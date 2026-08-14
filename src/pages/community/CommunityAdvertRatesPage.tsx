// src/pages/community/CommunityAdvertRatesPage.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, ArrowLeft, Info, Megaphone, Users, Globe, UsersRound, Store, Loader2, RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const API = "/api/community";

interface AdRates {
  duration_7:  number;
  duration_14: number;
  duration_30: number;
  duration_60: number;
  duration_90: number;
  pct_members:  number;
  pct_mobiface: number;
  pct_users:    number;
  pct_store:    number;
  community_share_pct: number;
}

const DEFAULT_RATES: AdRates = {
  duration_7:7, duration_14:900, duration_30:1600, duration_60:2750, duration_90:3750,
  pct_members:1000, pct_mobiface:2500, pct_users:2000, pct_store:1500,
  community_share_pct:60,
};

function fmt(n: number) { return n.toLocaleString(); }

export default function CommunityAdvertRatesPage() {
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();
  const [rates,   setRates]   = useState<AdRates>(DEFAULT_RATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`${API}/ad_rates.php?community_id=${communityId}`, { credentials:"include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.rates) setRates(d.rates); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [communityId]);

  const durations = [
    { label: "7 Days",  cost: rates.duration_7,  days: 7  },
    { label: "14 Days", cost: rates.duration_14, days: 14 },
    { label: "30 Days", cost: rates.duration_30, days: 30 },
    { label: "60 Days", cost: rates.duration_60, days: 60 },
    { label: "90 Days", cost: rates.duration_90, days: 90 },
  ];

  const audiences = [
    { label: "Members Interface",        icon: <Users className="h-4 w-4 text-blue-500" />,     premium: rates.pct_members,  desc: "Shown to all community members" },
    { label: "Mobiface Interface",       icon: <Globe className="h-4 w-4 text-purple-500" />,   premium: rates.pct_mobiface, desc: "Shown across the Mobiface platform" },
    { label: "Mobigate Users",           icon: <UsersRound className="h-4 w-4 text-green-500" />, premium: rates.pct_users, desc: "All users on Mobigate" },
    { label: "Mobi-Store Marketplace",   icon: <Store className="h-4 w-4 text-amber-500" />,    premium: rates.pct_store,  desc: "Buyers on the marketplace" },
  ];

  const communityShare = rates.community_share_pct;
  const mobifaceShare  = 100 - communityShare;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <ScrollArea className="h-[calc(100vh-80px)]">
        {/* Top Bar */}
        <div className="px-4 pt-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"
            onClick={() => navigate(`/community/${communityId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold">Community Advert Rates</h1>
            <p className="text-xs text-muted-foreground">Current pricing for this community</p>
          </div>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />}
        </div>

        <div className="p-4 space-y-4">
          {/* Info */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex gap-3 items-start">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fees are charged in Mobi from your wallet. Longer durations give a lower daily rate.
              Your community earns <strong>{communityShare}%</strong> of every ad fee.
            </p>
          </div>

          {/* Duration Pricing */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Duration Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <p className="text-xs text-muted-foreground mb-2">Base fee — community interface only</p>
              {durations.map(d => (
                <div key={d.label} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{d.label}</p>
                    <p className="text-xs text-muted-foreground">≈ {Math.round(d.cost / d.days)} Mobi/day</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary">{fmt(d.cost)} Mobi</p>
                    <p className="text-[10px] text-muted-foreground">base fee</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Audience Premiums */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Audience Premiums
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <p className="text-xs text-muted-foreground mb-2">Extra fee per selected audience (added to base)</p>
              {audiences.map(a => (
                <div key={a.label} className="p-3 bg-muted/30 rounded-lg flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background border shrink-0">{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{a.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-amber-600">+{fmt(a.premium)}</p>
                    <p className="text-[10px] text-muted-foreground">Mobi</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Revenue Split */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${communityShare}%` }} />
                </div>
                <span className="text-sm font-bold w-10 text-right">{communityShare}%</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-center">
                  <p className="font-bold text-lg text-primary">{communityShare}%</p>
                  <p className="text-xs text-muted-foreground">Community</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="font-bold text-lg">{mobifaceShare}%</p>
                  <p className="text-xs text-muted-foreground">Mobiface Platform</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example calculation */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-amber-800 dark:text-amber-200">Example Calculation</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-1.5 text-xs">
              {(() => {
                const base = rates.duration_7;
                const prem = rates.pct_members;
                const total = base + prem;
                const commEarns = Math.round(total * communityShare / 100);
                return (
                  <>
                    <div className="flex justify-between"><span className="text-muted-foreground">7-day base fee</span><span className="font-medium">{fmt(base)} Mobi</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">+ Members Interface</span><span className="font-medium">+{fmt(prem)} Mobi</span></div>
                    <div className="flex justify-between font-bold text-sm pt-1 border-t"><span>Total</span><span className="text-primary">{fmt(total)} Mobi</span></div>
                    <div className="flex justify-between text-green-700 dark:text-green-400"><span>Community earns ({communityShare}%)</span><span className="font-medium">{fmt(commEarns)} Mobi</span></div>
                  </>
                );
              })()}
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="pt-2 pb-6">
            <Button
              className="w-full h-12 text-base font-semibold gap-2 bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => navigate(`/community/${communityId}/create-advert`)}
            >
              <Megaphone className="h-5 w-5" />
              Create Advertisement
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
