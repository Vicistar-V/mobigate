import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CalendarClock, Loader2, RefreshCw, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

const API = "/api/community";

interface Position {
  id: string;
  title: string;
  holder_user_id?: string | null;
  holder_name?: string | null;
  holder_photo?: string | null;
  term_start_date?: string | null;
  term_end_date?: string | null;
  term_years?: number | null;
}

interface ManageTenureSectionProps {
  communityId?: string;
  onActivityLogged?: (action: string, target: string) => void;
}

export function ManageTenureSection({ communityId, onActivityLogged }: ManageTenureSectionProps) {
  const { toast } = useToast();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [form, setForm] = useState({ term_start_date: "", term_end_date: "", term_years: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`${API}/leadership.php?community_id=${communityId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setPositions(d.positions ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [communityId]);

  useEffect(() => { loadData(); }, [loadData]);

  const openEdit = (pos: Position) => {
    setEditingPosition(pos);
    setForm({
      term_start_date: pos.term_start_date ? pos.term_start_date.slice(0, 10) : "",
      term_end_date: pos.term_end_date ? pos.term_end_date.slice(0, 10) : "",
      term_years: pos.term_years ? String(pos.term_years) : "",
    });
  };

  const handleSave = async () => {
    if (!editingPosition) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/leadership.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_tenure",
          community_id: communityId,
          position_id: editingPosition.id,
          term_start_date: form.term_start_date,
          term_end_date: form.term_end_date,
          term_years: form.term_years,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed to save");
      toast({ title: "Tenure Updated", description: editingPosition.title });
      onActivityLogged?.("updated office tenure", editingPosition.title);
      setEditingPosition(null);
      loadData();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d?: string | null) => {
    if (!d) return "Not set";
    const date = new Date(d.includes("T") ? d : `${d}T00:00:00`);
    return isNaN(date.getTime()) ? "Not set" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          <span className="font-semibold text-base">Office Tenure</span>
          <Badge variant="secondary" className="text-sm">{positions.length}</Badge>
        </div>
        <Button size="sm" variant="ghost" className="h-9 px-2" onClick={loadData} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground px-1">
        Set the term start/end dates or duration for each position. This powers the "Office Tenure" view members see.
      </p>

      {loading && positions.length === 0 ? (
        <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : positions.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <CalendarClock className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No positions created yet</p>
          <p className="text-xs mt-1">Create positions from the Executives tab first.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {positions.map((pos) => (
            <Card key={pos.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={pos.holder_photo || undefined} alt={pos.holder_name || pos.title} />
                    <AvatarFallback>{(pos.holder_name || pos.title || "?")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{pos.title}</h4>
                    <p className="text-xs text-muted-foreground">{pos.holder_name || "Vacant"}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{formatDate(pos.term_start_date)} → {formatDate(pos.term_end_date)}</span>
                      {pos.term_years ? <Badge variant="outline" className="text-xs">{pos.term_years} yr term</Badge> : null}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => openEdit(pos)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingPosition} onOpenChange={(o) => { if (!o) setEditingPosition(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Set Tenure — {editingPosition?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Term Start</Label>
                <Input type="date" value={form.term_start_date} onChange={(e) => setForm({ ...form, term_start_date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Term End</Label>
                <Input type="date" value={form.term_end_date} onChange={(e) => setForm({ ...form, term_end_date: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Term Length (years) — optional override</Label>
              <Input type="number" min={0} value={form.term_years} onChange={(e) => setForm({ ...form, term_years: e.target.value })} placeholder="e.g. 4" />
              <p className="text-xs text-muted-foreground">If set, this is shown instead of the calculated duration between the two dates.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPosition(null)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
