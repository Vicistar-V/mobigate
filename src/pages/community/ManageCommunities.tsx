// src/pages/community/ManageCommunities.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Settings2, ArrowLeft, Users, Loader2, Plus, Globe } from "lucide-react";
import { CommunityManagePanel } from "@/components/community/CommunityManagePanel";
import { useCommunityList } from "@/hooks/useCommunity";
import { cn } from "@/lib/utils";

export default function ManageCommunities() {
  const navigate = useNavigate();
  const { owned, loading } = useCommunityList();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedOwned = owned.find(c => c.id === selectedId) ?? owned[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/community")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-amber-600" /> Manage Communities
            </h1>
            <p className="text-xs text-muted-foreground">Manage your owned communities</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : owned.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center bg-muted/20 rounded-xl border border-dashed">
            <Settings2 className="h-14 w-14 text-muted-foreground/30 mb-4" />
            <p className="font-semibold text-muted-foreground">No communities to manage</p>
            <p className="text-sm text-muted-foreground mt-1">Create a community to start managing it</p>
            <Button className="mt-4 gap-2" onClick={() => navigate("/create-community")}>
              <Plus className="h-4 w-4" /> Create Community
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {owned.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {owned.map(c => (
                  <button key={c.id} onClick={() => setSelectedId(c.id)}
                    className={cn("text-xs px-4 py-2 rounded-full border font-medium transition-all",
                      selectedOwned?.id === c.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background border-muted-foreground/20 text-muted-foreground hover:border-primary hover:text-foreground")}>
                    {c.name.length > 22 ? c.name.slice(0,22)+"…" : c.name}
                  </button>
                ))}
              </div>
            )}
            {selectedOwned && (
              <CommunityManagePanel communityId={selectedOwned.id} communityName={selectedOwned.name} />
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
