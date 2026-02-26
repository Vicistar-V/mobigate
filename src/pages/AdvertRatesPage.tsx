import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, TrendingUp, Percent, Layers, Image, Video, Maximize, ArrowLeft, Info, Zap, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";



const SLOT_PACKS = [
  { name: "Entry Pack", range: "1–2 slots", discount: 0, rate: 500, tag: "" },
  { name: "Basic Pack", range: "3–4 slots", discount: 20, rate: 400, tag: "" },
  { name: "Standard Pack", range: "5–7 slots", discount: 25, rate: 375, tag: "Popular" },
  { name: "Business Pack", range: "8–10 slots", discount: 30, rate: 350, tag: "" },
  { name: "Enterprise Pack", range: "11–15 slots", discount: 35, rate: 325, tag: "Best Value" },
];

const DURATION_PRICING = [
  { label: "7 Days", cost: 500, perDay: 71 },
  { label: "14 Days", cost: 900, perDay: 64 },
  { label: "30 Days", cost: 1600, perDay: 53 },
  { label: "60 Days", cost: 2750, perDay: 46 },
  { label: "90 Days", cost: 3750, perDay: 42 },
];

const DPD_TIERS = [
  { label: "1–100 views/day", rate: 50, tier: "Tier 1" },
  { label: "101–500 views/day", rate: 120, tier: "Tier 2" },
  { label: "501–2,000 views/day", rate: 300, tier: "Tier 3" },
  { label: "2,000+ views/day", rate: 500, tier: "Tier 4" },
];

const SIZE_RATES = [
  { size: "Small", multiplier: "×1.0", cost: "500 Mobi" },
  { size: "Medium", multiplier: "×1.5", cost: "750 Mobi" },
  { size: "Large", multiplier: "×2.0", cost: "1,000 Mobi" },
  { size: "Full Width", multiplier: "×2.5", cost: "1,250 Mobi" },
];

const DISPLAY_MODES = [
  { mode: "Single", desc: "1 image/video displayed", setupFee: "500 Mobi" },
  { mode: "Multiple (2–10)", desc: "Carousel of 2–10 items", setupFee: "800–2,500 Mobi" },
  { mode: "Rollout (2–15)", desc: "Sequential reveal of items", setupFee: "1,000–3,500 Mobi" },
];

const CATEGORY_RATES = [
  { category: "Pictoral (Image)", icon: Image, base: "500 Mobi", desc: "Static image adverts" },
  { category: "Video", icon: Video, base: "800 Mobi", desc: "Video-based adverts" },
];

const SUBSCRIPTION_DISCOUNTS = [
  { months: "1 Month", discount: "0%" },
  { months: "3 Months", discount: "5%" },
  { months: "6 Months", discount: "10%" },
  { months: "9 Months", discount: "12%" },
  { months: "12 Months", discount: "15%" },
  { months: "18 Months", discount: "18%" },
  { months: "24 Months", discount: "22%" },
];

const ACCREDITED_TIERS = [
  { tier: "Bronze", discount: "5%", requirement: "10+ adverts" },
  { tier: "Silver", discount: "10%", requirement: "25+ adverts" },
  { tier: "Gold", discount: "15%", requirement: "50+ adverts" },
  { tier: "Platinum", discount: "20%", requirement: "100+ adverts" },
];

export default function AdvertRatesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <ScrollArea className="h-[calc(100vh-80px)]">
        {/* Top Bar */}
        <div className="px-4 pt-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Advert Subscription Rates</h1>
            <p className="text-xs text-muted-foreground">All pricing in Mobi tokens</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Info Banner */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex gap-3 items-start">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Rates shown are the current community prices. Discounts stack — slot pack + subscription + accredited tier savings all apply together.
            </p>
          </div>

          {/* Slot Pack Discounts */}
          <Card>
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
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{pack.name}</p>
                      {pack.tag && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">
                          {pack.tag}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{pack.range}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {pack.discount > 0 ? (
                      <>
                        <Badge variant="secondary" className="text-xs mb-0.5">-{pack.discount}%</Badge>
                        <p className="text-sm font-bold text-primary">{pack.rate} Mobi/slot</p>
                      </>
                    ) : (
                      <p className="text-sm font-bold">{pack.rate} Mobi/slot</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Duration Pricing */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
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

          {/* DPD Tiers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Display-Per-Day (DPD) Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Extra cost based on how many daily impressions your ad gets</p>
              {DPD_TIERS.map((tier) => (
                <div key={tier.tier} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{tier.tier}</p>
                    <p className="text-xs text-muted-foreground">{tier.label}</p>
                  </div>
                  <p className="font-bold text-sm">{tier.rate} Mobi</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ad Sizes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Maximize className="h-5 w-5 text-violet-500" />
                Ad Size Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Bigger ads cost more — multiplied from base rate</p>
              {SIZE_RATES.map((s) => (
                <div key={s.size} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{s.size}</p>
                    <p className="text-xs text-muted-foreground">{s.multiplier}</p>
                  </div>
                  <p className="font-bold text-sm">{s.cost}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Display Modes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-5 w-5 text-orange-500" />
                Display Mode Setup Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">One-time setup fee based on display type</p>
              {DISPLAY_MODES.map((dm) => (
                <div key={dm.mode} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{dm.mode}</p>
                    <p className="text-xs text-muted-foreground">{dm.desc}</p>
                  </div>
                  <p className="font-bold text-sm shrink-0 ml-2">{dm.setupFee}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Category Rates */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Image className="h-5 w-5 text-pink-500" />
                Category Base Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {CATEGORY_RATES.map((cat) => (
                <div key={cat.category} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <cat.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{cat.category}</p>
                      <p className="text-xs text-muted-foreground">{cat.desc}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm">{cat.base}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Subscription Discounts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Subscription Discounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Commit to a longer subscription for recurring savings</p>
              <div className="grid grid-cols-2 gap-2">
                {SUBSCRIPTION_DISCOUNTS.map((sub) => (
                  <div key={sub.months} className="p-3 bg-muted/30 rounded-lg text-center">
                    <p className="font-medium text-sm">{sub.months}</p>
                    <p className="text-lg font-black text-primary">{sub.discount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Accredited Advertiser Tiers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Accredited Advertiser Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Earn loyalty discounts based on your total advert history</p>
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

          {/* CTA */}
          <Button className="w-full h-12 text-base font-bold" onClick={() => navigate("/submit-advert")}>
            Create an Advert →
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
