// src/components/community/advertisements/AdvertisementsListSheet.tsx
import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Megaphone, RefreshCw, X, Plus, Eye, Pause, Play,
  Trash2, MapPin, Loader2, TrendingUp, XCircle, AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AdvertisementFullViewSheet } from "./AdvertisementFullViewSheet";

interface AdvertisementsListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  initialTab?: string;
  onCreateNew?: () => void;
}

const STATUS_STYLE: Record<string, string> = {
  active:          "bg-green-100 text-green-700",
  pending_payment: "bg-amber-100 text-amber-700",
  paused:          "bg-blue-100 text-blue-700",
  ended:           "bg-gray-100 text-gray-500",
  cancelled:       "bg-red-100 text-red-600",
  draft:           "bg-purple-100 text-purple-700",
};

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

function AdCard({ ad, canManage, onView, onPause, onResume, onStop, onDelete }: {
  ad: any; canManage?: boolean;
  onView(): void; onPause?(): void; onResume?(): void; onStop?(): void; onDelete?(): void;
}) {
  const [confirm, setConfirm] = useState<"stop"|"delete"|null>(null);
  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-0">
        <div className="flex gap-3 p-3">
          <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center shrink-0 border border-amber-100">
            <Megaphone className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <p className="font-semibold text-sm truncate flex-1">{ad.business_name}</p>
              <Badge className={cn("text-[10px] px-1.5 shrink-0 capitalize", STATUS_STYLE[ad.status] ?? "bg-gray-100")}>
                {ad.status?.replace(/_/g," ")}
              </Badge>
            </div>
            <p className="text-xs text-primary font-medium mt-0.5 truncate">{ad.product_title}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/>{ad.city}</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3"/>{ad.views}</span>
              <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3"/>{ad.clicks}</span>
              <span className="ml-auto">{timeAgo(ad.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Confirm prompt */}
        {confirm === "stop" && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border-t text-xs">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0"/>
            <span className="flex-1 text-red-700">Stop this advertisement?</span>
            <button className="font-bold text-red-600 hover:text-red-800" onClick={() => { setConfirm(null); onStop?.(); }}>Yes</button>
            <button className="text-muted-foreground ml-2" onClick={() => setConfirm(null)}>No</button>
          </div>
        )}
        {confirm === "delete" && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border-t text-xs">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0"/>
            <span className="flex-1 text-red-700">Delete permanently?</span>
            <button className="font-bold text-red-600 hover:text-red-800" onClick={() => { setConfirm(null); onDelete?.(); }}>Yes</button>
            <button className="text-muted-foreground ml-2" onClick={() => setConfirm(null)}>No</button>
          </div>
        )}

        {/* Action bar */}
        {!confirm && (
          <div className="flex border-t divide-x">
            <button className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-primary hover:bg-primary/5 transition-colors" onClick={onView}>
              <Eye className="h-3.5 w-3.5"/> View
            </button>
            {canManage && ad.status === "active" && (
              <button className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-amber-600 hover:bg-amber-50 transition-colors" onClick={onPause}>
                <Pause className="h-3.5 w-3.5"/> Pause
              </button>
            )}
            {canManage && ad.status === "paused" && (
              <button className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-green-600 hover:bg-green-50 transition-colors" onClick={onResume}>
                <Play className="h-3.5 w-3.5"/> Resume
              </button>
            )}
            {canManage && ad.status === "active" && (
              <button className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-destructive hover:bg-red-50 transition-colors" onClick={() => setConfirm("stop")}>
                <XCircle className="h-3.5 w-3.5"/> Stop
              </button>
            )}
            {canManage && ["ended","cancelled"].includes(ad.status) && (
              <button className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-destructive hover:bg-red-50 transition-colors" onClick={() => setConfirm("delete")}>
                <Trash2 className="h-3.5 w-3.5"/> Delete
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdvertisementsListSheet({ open, onOpenChange, communityId, initialTab = "all_active", onCreateNew }: AdvertisementsListSheetProps) {
  const { toast } = useToast();
  const [tab,         setTab]        = useState(initialTab);
  const [allActive,   setAllActive]  = useState<any[]>([]);
  const [myAds,       setMyAds]      = useState<any[]>([]);
  const [stats,       setStats]      = useState({ totalAll:0, myActive:0, myTotal:0, totalFees:0 });
  const [loading,     setLoading]    = useState(false);
  const [viewAdId,    setViewAdId]   = useState<string|null>(null);
  const [error,       setError]      = useState<string|null>(null);

  const loadAds = () => {
    if (!communityId) { setError("No community ID"); return; }
    setLoading(true);
    setError(null);
    fetch(`/api/community/advertisements.php?community_id=${communityId}&limit=100`, { credentials:"include" })
      .then(r => {
        if (!r.ok) return r.text().then(t => { throw new Error(`HTTP ${r.status}: ${t.slice(0,100)}`); });
        return r.text();
      })
      .then(text => {
        let d: any;
        try { d = JSON.parse(text); }
        catch { throw new Error("Invalid JSON: " + text.slice(0,100)); }
        setAllActive(d.all_active ?? []);
        setMyAds(d.my_ads ?? []);
        setStats({ totalAll: d.stats?.totalAll??0, myActive: d.stats?.myActive??0, myTotal: d.stats?.myTotal??0, totalFees: d.stats?.totalFees??0 });
      })
      .catch(e => { console.error("[Ads]", e); setError(e.message); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (open && communityId) loadAds(); }, [open, communityId]); // eslint-disable-line

  const callStatus = (adId: string, status: string) => {
    fetch("/api/community/advertisements.php", {
      method:"POST", credentials:"include",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action:"update_status", community_id:communityId, ad_id:adId, status }),
    }).then(r => r.ok && (toast({ title:`Ad ${status}` }), loadAds()));
  };

  const callDelete = (adId: string) => {
    fetch("/api/community/advertisements.php", {
      method:"POST", credentials:"include",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action:"delete", community_id:communityId, ad_id:adId }),
    }).then(r => r.ok && (toast({ title:"Ad deleted" }), loadAds()));
  };

  const myActive   = myAds.filter(a => a.status === "active");
  const myInactive = myAds.filter(a => !["active","pending_payment"].includes(a.status));

  const empty = (msg: string) => (
    <div className="text-center py-12 text-muted-foreground">
      <Megaphone className="h-10 w-10 mx-auto mb-2 opacity-30"/>
      <p className="text-sm">{msg}</p>
      {onCreateNew && <Button size="sm" className="mt-3 bg-amber-600 hover:bg-amber-700 text-white" onClick={onCreateNew}><Plus className="h-4 w-4 mr-1"/>Create Ad</Button>}
    </div>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl flex flex-col p-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-amber-600"/>
              <span className="font-semibold text-base">Advertisements</span>
              {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={loadAds} disabled={loading}>
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")}/>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4"/>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x border-b shrink-0">
            <div className="py-2.5 text-center">
              <p className="font-bold text-base text-green-600">{stats.totalAll}</p>
              <p className="text-xs text-muted-foreground">All Active</p>
            </div>
            <div className="py-2.5 text-center">
              <p className="font-bold text-base text-blue-600">{stats.myTotal}</p>
              <p className="text-xs text-muted-foreground">My Total</p>
            </div>
            <div className="py-2.5 text-center">
              <p className="font-bold text-base text-amber-600">{stats.myActive}</p>
              <p className="text-xs text-muted-foreground">My Active</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 mx-4 my-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0"/>{error}
              <Button size="sm" variant="ghost" className="h-6 ml-auto" onClick={loadAds}>Retry</Button>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="rounded-none border-b h-10 bg-transparent p-0 shrink-0">
              <TabsTrigger value="all_active" className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary text-xs font-medium">
                All Active ({allActive.length})
              </TabsTrigger>
              <TabsTrigger value="my_active" className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary text-xs font-medium">
                My Active ({myActive.length})
              </TabsTrigger>
              <TabsTrigger value="my_all" className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary text-xs font-medium">
                All Mine ({myAds.length})
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto"/>
                  <p className="text-sm text-muted-foreground mt-2">Loading advertisements…</p>
                </div>
              </div>
            ) : (
              <>
                <TabsContent value="all_active" className="flex-1 min-h-0 m-0">
                  <ScrollArea className="h-full">
                    <div className="p-3 space-y-3 pb-20">
                      {allActive.length === 0 ? empty("No active ads in this community") :
                        allActive.map(ad => (
                          <AdCard key={ad.id} ad={ad} canManage={false}
                            onView={() => setViewAdId(ad.id)}
                          />
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="my_active" className="flex-1 min-h-0 m-0">
                  <ScrollArea className="h-full">
                    <div className="p-3 space-y-3 pb-20">
                      {myActive.length === 0 ? empty("No active ads — create one!") :
                        myActive.map(ad => (
                          <AdCard key={ad.id} ad={ad} canManage
                            onView={() => setViewAdId(ad.id)}
                            onPause={() => callStatus(ad.id, "paused")}
                            onResume={() => callStatus(ad.id, "active")}
                            onStop={() => callStatus(ad.id, "cancelled")}
                            onDelete={() => callDelete(ad.id)}
                          />
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="my_all" className="flex-1 min-h-0 m-0">
                  <ScrollArea className="h-full">
                    <div className="p-3 space-y-3 pb-20">
                      {myAds.length === 0 ? empty("You have no advertisements yet") :
                        myAds.map(ad => (
                          <AdCard key={ad.id} ad={ad} canManage
                            onView={() => setViewAdId(ad.id)}
                            onPause={() => callStatus(ad.id, "paused")}
                            onResume={() => callStatus(ad.id, "active")}
                            onStop={() => callStatus(ad.id, "cancelled")}
                            onDelete={() => callDelete(ad.id)}
                          />
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </>
            )}
          </Tabs>

          {/* FAB */}
          {onCreateNew && (
            <div className="absolute bottom-6 right-4 z-50">
              <Button size="icon" className="h-12 w-12 rounded-full shadow-lg bg-amber-600 hover:bg-amber-700" onClick={onCreateNew}>
                <Plus className="h-5 w-5"/>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AdvertisementFullViewSheet
        open={!!viewAdId}
        onOpenChange={v => { if (!v) setViewAdId(null); }}
        adId={viewAdId ?? undefined}
        communityId={communityId}
      />
    </>
  );
}
