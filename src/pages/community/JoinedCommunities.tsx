// src/pages/community/JoinedCommunities.tsx
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkCheck, ArrowLeft, Users, Loader2, LogOut, Globe } from "lucide-react";
import { JoinedCommunityRow } from "@/components/community/JoinedCommunityRow";
import { useCommunityList, leaveCommunity } from "@/hooks/useCommunity";
import { toast } from "sonner";
import { useState } from "react";

export default function JoinedCommunities() {
  const navigate = useNavigate();
  const { joined, loading, refresh } = useCommunityList();
  const [leavingId, setLeavingId] = useState<string | null>(null);

  const handleLeave = async (id: string, name: string) => {
    if (!confirm(`Leave "${name}"? You can rejoin later.`)) return;
    setLeavingId(id);
    const ok = await leaveCommunity(id);
    setLeavingId(null);
    if (ok) { toast.success(`Left ${name}`); refresh(); }
    else toast.error("Could not leave community");
  };

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
              <BookmarkCheck className="h-5 w-5 text-green-600" /> Joined Communities
            </h1>
            <p className="text-xs text-muted-foreground">Communities you are a member of</p>
          </div>
          <Badge variant="secondary" className="ml-auto">{joined.length}</Badge>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : joined.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center bg-muted/20 rounded-xl border border-dashed">
            <BookmarkCheck className="h-14 w-14 text-muted-foreground/30 mb-4" />
            <p className="font-semibold text-muted-foreground">No joined communities</p>
            <p className="text-sm text-muted-foreground mt-1">Discover and join communities from around the world</p>
            <Button className="mt-4 gap-2" onClick={() => navigate("/community")}>
              <Globe className="h-4 w-4" /> Discover Communities
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {joined.map(c => (
              <div key={c.id} className="group relative">
                <div className="cursor-pointer" onClick={() => navigate(`/community/${c.id}`)}>
                  <JoinedCommunityRow community={c as any} />
                </div>
                <Button size="sm" variant="ghost" disabled={leavingId === c.id}
                  onClick={e => { e.stopPropagation(); handleLeave(c.id, c.name); }}
                  className="absolute top-1/2 -translate-y-1/2 right-3 h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all">
                  {leavingId === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><LogOut className="h-3 w-3 mr-1" />Leave</>}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
