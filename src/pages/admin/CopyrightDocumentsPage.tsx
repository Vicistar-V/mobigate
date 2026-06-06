/**
 * pages/admin/CopyrightDocumentsPage.tsx
 *
 * Mobiface Admin-only management interface for Copyright Documents submitted by
 * authors. View-only by design — these are legal records owned by Mobiface and
 * cannot be deleted (not even by the original author).
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ShieldCheck, Search, FileText, Eye, Download,
  Lock, AlertTriangle, FileWarning,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  getCopyrightDocuments, type CopyrightDocument,
} from "@/data/copyrightDocuments";

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
};

export default function CopyrightDocumentsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const allDocs = useMemo(() => getCopyrightDocuments(), []);

  const docs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allDocs;
    return allDocs.filter(d =>
      d.authorName.toLowerCase().includes(q) ||
      (d.authorEmail || "").toLowerCase().includes(q) ||
      (d.postTitle || "").toLowerCase().includes(q) ||
      d.fileName.toLowerCase().includes(q));
  }, [allDocs, search]);

  const activeCount = allDocs.filter(d => d.status === "active").length;
  const retainedCount = allDocs.filter(d => d.status === "post-deleted").length;

  const handleView = (d: CopyrightDocument) => {
    if (d.fileUrl) {
      window.open(d.fileUrl, "_blank", "noopener");
    } else {
      toast({
        title: "Opening document",
        description: `${d.fileName} — secure admin view (connects to backend in production).`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">Copyright Documents</h1>
            <p className="text-[11px] text-muted-foreground leading-tight">Mobiface Admins only · Legal records</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-3xl mx-auto">
        {/* Legal banner */}
        <div className="flex gap-2 rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2.5">
          <Lock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-snug text-amber-800">
            These documents are submitted against each author's account and are
            <strong> legal property of Mobiface</strong>. They are accessible only to Admins and
            <strong> cannot be removed</strong> — they are retained even after the related post is deleted.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3">
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-[11px] text-muted-foreground">Active documents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-2xl font-bold flex items-center gap-1.5">
                {retainedCount}
                {retainedCount > 0 && <FileWarning className="h-4 w-4 text-amber-500" />}
              </p>
              <p className="text-[11px] text-muted-foreground">Retained (post deleted)</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by author, post, email or file..."
            className="pl-9 rounded-xl"
          />
        </div>

        {/* List */}
        <div className="space-y-2.5">
          {docs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No copyright documents found</p>
            </div>
          )}

          {docs.map(d => (
            <Card key={d.id} className="overflow-hidden">
              <CardContent className="p-3 space-y-3">
                {/* Author row */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={d.authorAvatar} alt={d.authorName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {d.authorName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{d.authorName}</p>
                    {d.authorEmail && (
                      <p className="text-[11px] text-muted-foreground truncate">{d.authorEmail}</p>
                    )}
                  </div>
                  {d.status === "post-deleted" ? (
                    <Badge variant="outline" className="gap-1 border-amber-400 text-amber-700 shrink-0">
                      <AlertTriangle className="h-3 w-3" />Retained
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0">Active</Badge>
                  )}
                </div>

                {/* Related post */}
                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                    Related Post
                  </p>
                  <p className="text-sm font-medium truncate">
                    {d.postTitle || "Untitled"}
                    {d.postType && <span className="text-muted-foreground font-normal"> · {d.postType}</span>}
                  </p>
                  {!d.postId && (
                    <p className="text-[11px] text-amber-600 mt-0.5">
                      Original post was deleted — document permanently retained.
                    </p>
                  )}
                </div>

                {/* File row */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{d.fileName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {d.fileType} · {d.fileSize} · {formatDate(d.submittedAt)}
                    </p>
                  </div>
                </div>

                {/* Actions — view / download only (no delete by design) */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => handleView(d)}>
                    <Eye className="h-4 w-4" />View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => handleView(d)}>
                    <Download className="h-4 w-4" />Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
