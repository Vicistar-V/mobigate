import { useState } from "react";
import { Plus, Trash2, Edit, Save, X, Handshake, Building2, Globe, MessageCircle, Mail, Phone } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import type { SeasonSponsor } from "@/data/mobigateInteractiveQuizData";

interface ManageSponsorsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sponsors: SeasonSponsor[];
  onSponsorsChange: (sponsors: SeasonSponsor[]) => void;
  seasonName?: string;
}

const emptySponsor = (): Partial<SeasonSponsor> => ({
  brandName: "",
  logoUrl: "",
  websiteUrl: "",
  whatsAppNumber: "",
  email: "",
  phoneNumber: "",
});

export function ManageSponsorsSheet({ open, onOpenChange, sponsors, onSponsorsChange, seasonName }: ManageSponsorsSheetProps) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<SeasonSponsor>>(emptySponsor());

  const updateField = (key: keyof SeasonSponsor, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleSave = () => {
    if (!form.brandName?.trim()) {
      toast({ title: "⚠️ Brand Name Required", description: "Please enter the sponsor's brand name.", variant: "destructive" });
      return;
    }

    if (editingId) {
      const updated = sponsors.map((s) => (s.id === editingId ? { ...s, ...form } as SeasonSponsor : s));
      onSponsorsChange(updated);
      toast({ title: "✅ Sponsor Updated", description: `"${form.brandName}" has been updated.` });
    } else {
      const newSponsor: SeasonSponsor = {
        id: `sp-${Date.now()}`,
        brandName: form.brandName!.trim(),
        logoUrl: form.logoUrl || undefined,
        websiteUrl: form.websiteUrl || undefined,
        whatsAppNumber: form.whatsAppNumber || undefined,
        email: form.email || undefined,
        phoneNumber: form.phoneNumber || undefined,
      };
      onSponsorsChange([...sponsors, newSponsor]);
      toast({ title: "✅ Sponsor Added", description: `"${newSponsor.brandName}" has been added.` });
    }

    setForm(emptySponsor());
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (sponsor: SeasonSponsor) => {
    setForm({
      brandName: sponsor.brandName,
      logoUrl: sponsor.logoUrl || "",
      websiteUrl: sponsor.websiteUrl || "",
      whatsAppNumber: sponsor.whatsAppNumber || "",
      email: sponsor.email || "",
      phoneNumber: sponsor.phoneNumber || "",
    });
    setEditingId(sponsor.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const sponsor = sponsors.find((s) => s.id === id);
    onSponsorsChange(sponsors.filter((s) => s.id !== id));
    toast({ title: "🗑️ Sponsor Removed", description: `"${sponsor?.brandName}" has been removed.` });
  };

  const handleCancel = () => {
    setForm(emptySponsor());
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="flex items-center gap-2 text-base">
            <Handshake className="h-5 w-5 text-primary" />
            Manage Sponsors
          </DrawerTitle>
          {seasonName && (
            <p className="text-xs text-muted-foreground">{seasonName}</p>
          )}
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 pb-6">
          {/* Add Button */}
          {!showForm && (
            <Button
              variant="outline"
              className="w-full h-11 gap-2 text-sm font-semibold mb-3 touch-manipulation"
              onClick={() => { setForm(emptySponsor()); setEditingId(null); setShowForm(true); }}
            >
              <Plus className="h-4 w-4" />
              Add Sponsor
            </Button>
          )}

          {/* Add/Edit Form */}
          {showForm && (
            <Card className="border-primary/30 mb-3">
              <CardContent className="p-4 space-y-3">
                <h4 className="text-sm font-bold text-primary">
                  {editingId ? "Edit Sponsor" : "New Sponsor"}
                </h4>

                <div>
                  <Label className="text-xs text-muted-foreground">Brand Name *</Label>
                  <Input
                    value={form.brandName || ""}
                    onChange={(e) => updateField("brandName", e.target.value)}
                    placeholder="e.g. Coca-Cola Nigeria"
                    className="h-11 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Logo URL</Label>
                  <Input
                    value={form.logoUrl || ""}
                    onChange={(e) => updateField("logoUrl", e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="h-11 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Website URL
                  </Label>
                  <Input
                    value={form.websiteUrl || ""}
                    onChange={(e) => updateField("websiteUrl", e.target.value)}
                    placeholder="https://www.example.com"
                    className="h-11 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> WhatsApp Number
                  </Label>
                  <Input
                    value={form.whatsAppNumber || ""}
                    onChange={(e) => updateField("whatsAppNumber", e.target.value)}
                    placeholder="+234 XXX XXX XXXX"
                    inputMode="tel"
                    className="h-11 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </Label>
                  <Input
                    value={form.email || ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="sponsor@example.com"
                    type="email"
                    className="h-11 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Phone Number
                  </Label>
                  <Input
                    value={form.phoneNumber || ""}
                    onChange={(e) => updateField("phoneNumber", e.target.value)}
                    placeholder="+234 XXX XXX XXXX"
                    inputMode="tel"
                    className="h-11 mt-1"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <Button variant="outline" className="flex-1 h-11 text-sm gap-1" onClick={handleCancel}>
                    <X className="h-3.5 w-3.5" /> Cancel
                  </Button>
                  <Button className="flex-1 h-11 text-sm gap-1" onClick={handleSave}>
                    <Save className="h-3.5 w-3.5" /> {editingId ? "Update" : "Add"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sponsors List */}
          {sponsors.length === 0 && !showForm ? (
            <div className="text-center py-12 space-y-2">
              <Building2 className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No sponsors added yet.</p>
              <p className="text-xs text-muted-foreground">Tap "Add Sponsor" to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sponsors.map((sponsor) => (
                <Card key={sponsor.id}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border shrink-0">
                      {sponsor.logoUrl && <AvatarImage src={sponsor.logoUrl} alt={sponsor.brandName} />}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {sponsor.brandName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{sponsor.brandName}</p>
                      <p className="text-xs text-muted-foreground">
                        {[
                          sponsor.websiteUrl && "Web",
                          sponsor.whatsAppNumber && "WhatsApp",
                          sponsor.email && "Email",
                          sponsor.phoneNumber && "Phone",
                        ].filter(Boolean).join(" · ") || "No contact info"}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(sponsor)}
                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted touch-manipulation"
                      >
                        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(sponsor.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-red-50 touch-manipulation"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
