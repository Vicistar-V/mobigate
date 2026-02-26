import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Percent, Star, Info, TrendingUp, Megaphone } from "lucide-react";

const DURATION_PRICING = [
  { label: "7 Days", cost: 500, perDay: 71 },
  { label: "14 Days", cost: 900, perDay: 64 },
  { label: "30 Days", cost: 1600, perDay: 53 },
  { label: "60 Days", cost: 2750, perDay: 46 },
  { label: "90 Days", cost: 3750, perDay: 42 },
];

const SLOT_PACKS = [
  { name: "Entry Pack", range: "1–2 slots", discount: 0 },
  { name: "Basic Pack", range: "3–4 slots", discount: 20 },
  { name: "Standard Pack", range: "5–7 slots", discount: 25 },
  { name: "Business Pack", range: "8–10 slots", discount: 30 },
  { name: "Enterprise Pack", range: "11–15 slots", discount: 35 },
];

const ACCREDITED_TIERS = [
  { tier: "Bronze", discount: "5%", requirement: "10+ adverts" },
  { tier: "Silver", discount: "10%", requirement: "25+ adverts" },
  { tier: "Gold", discount: "15%", requirement: "50+ adverts" },
  { tier: "Platinum", discount: "20%", requirement: "100+ adverts" },
];

export default function CommunityAdvertRatesPage() {
  const navigate = useNavigate();
  const { communityId } = useParams();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <ScrollArea className="h-[calc(100vh-80px)]">
        {/* Top Bar */}
        <div className="px-4 pt-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate(`/community/${communityId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-amber-600" />
              Community Advert Rates
            </h1>
            <p className="text-xs text-muted-foreground">Pricing for advertising in this community</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Info Banner */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex gap-3 items-start">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              These are the advert rates for this community. Discounts stack — slot pack + duration + accredited tier savings all apply together.
            </p>
          </div>

          {/* Duration Pricing */}
          <Card className="border-amber-200/50 dark:border-amber-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Duration Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Longer durations = lower daily cost</p>
              {DURATION_PRICING.map((dur) => (
                <div key={dur.label} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{dur.label}</p>
                    <p className="text-xs text-muted-foreground">≈ {dur.perDay} Mobi/day</p>
                  </div>
                  <p className="font-bold text-sm">{dur.cost.toLocaleString()} Mobi</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Slot Pack Discounts */}
          <Card className="border-amber-200/50 dark:border-amber-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Percent className="h-5 w-5 text-amber-500" />
                Slot Pack Discounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Buy more slots, pay less per slot</p>
              {SLOT_PACKS.map((pack) => (
                <div key={pack.name} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{pack.name}</p>
                    <p className="text-xs text-muted-foreground">{pack.range}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs font-bold shrink-0">-{pack.discount}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Accredited Advertiser Tiers */}
          <Card className="border-amber-200/50 dark:border-amber-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Accredited Advertiser Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Earn loyalty discounts based on your advert history</p>
              {ACCREDITED_TIERS.map((at) => (
                <div key={at.tier} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{at.tier}</p>
                    <p className="text-xs text-muted-foreground">{at.requirement}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs font-bold">-{at.discount}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Separator />

          {/* CTA */}
          <Button
            className="w-full h-12 text-base font-bold bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => navigate(`/community/${communityId}/create-advert`)}
          >
            <Megaphone className="h-5 w-5 mr-2" />
            Create an Advertisement →
          </Button>

          {/* View full rates link */}
          <Button
            variant="outline"
            className="w-full h-10 text-sm"
            onClick={() => navigate("/advert-rates")}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Full Subscription Rates
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
