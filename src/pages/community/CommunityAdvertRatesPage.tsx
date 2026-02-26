import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, Percent, Star, ArrowLeft, Info, Maximize, Monitor, Layers, RotateCcw, Zap, RefreshCw, Repeat } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// ─── Duration Pricing Data ───
const DURATION_PRICING = [
  { label: "7 Days", cost: 500, perDay: 71 },
  { label: "14 Days", cost: 900, perDay: 64 },
  { label: "30 Days", cost: 1600, perDay: 53 },
  { label: "60 Days", cost: 2750, perDay: 46 },
  { label: "90 Days", cost: 3750, perDay: 42 },
];

const SLOT_PACKS = [
  { name: "Entry Pack", range: "1–2 slots", discount: 0, tag: "" },
  { name: "Basic Pack", range: "3–4 slots", discount: 20, tag: "" },
  { name: "Standard Pack", range: "5–7 slots", discount: 25, tag: "Popular" },
  { name: "Business Pack", range: "8–10 slots", discount: 30, tag: "" },
  { name: "Enterprise Pack", range: "11–15 slots", discount: 35, tag: "Best Value" },
];

const ACCREDITED_TIERS = [
  { tier: "Bronze", discount: "5%", requirement: "10+ adverts" },
  { tier: "Silver", discount: "10%", requirement: "25+ adverts" },
  { tier: "Gold", discount: "15%", requirement: "50+ adverts" },
  { tier: "Platinum", discount: "20%", requirement: "100+ adverts" },
];

// ─── Subscription Rates Data ───
const SINGLE_SIZES = [
  { size: "2×3", desc: "1/5 Screen Height × Half Screen Width", fee: "2%" },
  { size: "2×6", desc: "1/5 Screen Height × Full Screen Width", fee: "4%" },
  { size: "2.5×3", desc: "Quarter Screen Height × Half Screen Width", fee: "6%" },
  { size: "2.5×6", desc: "Quarter Screen Height × Full Screen Width", fee: "8%" },
  { size: "3.5×3", desc: "1/3 Screen Height × Half Screen Width", fee: "10%" },
  { size: "3.5×6", desc: "1/3 Screen Height × Full Screen Width", fee: "12%" },
  { size: "5×6", desc: "Half Screen Height × Full Screen Width", fee: "14%" },
  { size: "6.5×3", desc: "2/3 Screen Height × Half Screen Width", fee: "16%" },
  { size: "6.5×6", desc: "2/3 Screen Height × Full Screen Width", fee: "18%" },
  { size: "10×6", desc: "Full Screen Height × Full Screen Width", fee: "20%" },
];

const BUNDLED_SIZES = [
  { size: "2×3", desc: "1/5 Screen Height × Half Screen Width", fee: "12%" },
  { size: "2×6", desc: "1/5 Screen Height × Full Screen Width", fee: "14%" },
  { size: "2.5×3", desc: "Quarter Screen Height × Half Screen Width", fee: "16%" },
  { size: "2.5×6", desc: "Quarter Screen Height × Full Screen Width", fee: "18%" },
  { size: "3.5×3", desc: "1/3 Screen Height × Half Screen Width", fee: "20%" },
  { size: "3.5×6", desc: "1/3 Screen Height × Full Screen Width", fee: "22%" },
  { size: "5×6", desc: "Half Screen Height × Full Screen Width", fee: "24%" },
  { size: "6.5×3", desc: "2/3 Screen Height × Half Screen Width", fee: "26%" },
  { size: "6.5×6", desc: "2/3 Screen Height × Full Screen Width", fee: "28%" },
  { size: "10×6", desc: "Full Screen Height × Full Screen Width", fee: "30%" },
];

const ROLLOUT_SIZES = [
  { size: "5×6", desc: "Half Screen Height × Full Screen Width", fee: "30%" },
  { size: "6.5×6", desc: "2/3 Screen Height × Full Screen Width", fee: "35%" },
  { size: "10×6", desc: "Full Screen Height × Full Screen Width", fee: "40%" },
];

const SINGLE_SETUP = { label: "Single Display", fee: "₦40,000 / 40,000 Mobi" };

const BUNDLED_SETUP = [
  { label: "2-in-1 Display", fee: "₦40,000 / 40,000 Mobi" },
  { label: "3-in-1 Display", fee: "₦60,000 / 60,000 Mobi" },
  { label: "4-in-1 Display", fee: "₦80,000 / 80,000 Mobi" },
  { label: "5-in-1 Display", fee: "₦100,000 / 100,000 Mobi" },
  { label: "6-in-1 Display", fee: "₦120,000 / 120,000 Mobi" },
  { label: "7-in-1 Display", fee: "₦140,000 / 140,000 Mobi" },
  { label: "8-in-1 Display", fee: "₦160,000 / 160,000 Mobi" },
  { label: "9-in-1 Display", fee: "₦180,000 / 180,000 Mobi" },
  { label: "10-in-1 Display", fee: "₦200,000 / 200,000 Mobi" },
  { label: "15-in-1 Display", fee: "₦250,000 / 250,000 Mobi" },
];

const ROLLOUT_SETUP = [
  { label: "2-in-1 Display", fee: "₦70,000 / 70,000 Mobi" },
  { label: "3-in-1 Display", fee: "₦100,000 / 100,000 Mobi" },
  { label: "4-in-1 Display", fee: "₦140,000 / 140,000 Mobi" },
  { label: "5-in-1 Display", fee: "₦160,000 / 160,000 Mobi" },
  { label: "6-in-1 Display", fee: "₦180,000 / 180,000 Mobi" },
  { label: "7-in-1 Display", fee: "₦200,000 / 200,000 Mobi" },
  { label: "8-in-1 Display", fee: "₦220,000 / 220,000 Mobi" },
  { label: "9-in-1 Display", fee: "₦240,000 / 240,000 Mobi" },
  { label: "10-in-1 Display", fee: "₦260,000 / 260,000 Mobi" },
  { label: "15-in-1 Display", fee: "₦300,000 / 300,000 Mobi" },
];

const DPD_PACKAGES = [
  { name: "Basic", dpd: "1,000", price: "₦10,000 / 10,000 Mobi" },
  { name: "Standard", dpd: "2,000", price: "₦20,000 / 20,000 Mobi" },
  { name: "Professional", dpd: "3,000", price: "₦30,000 / 30,000 Mobi" },
  { name: "Business", dpd: "4,000", price: "₦40,000 / 40,000 Mobi" },
  { name: "Enterprise", dpd: "5,000", price: "₦50,000 / 50,000 Mobi" },
  { name: "Entrepreneur", dpd: "6,000", price: "₦60,000 / 60,000 Mobi" },
  { name: "Deluxe", dpd: "7,000", price: "₦70,000 / 70,000 Mobi" },
  { name: "Deluxe Super", dpd: "8,000", price: "₦80,000 / 80,000 Mobi" },
  { name: "Deluxe Super Plus", dpd: "9,000", price: "₦90,000 / 90,000 Mobi" },
  { name: "Deluxe Silver", dpd: "10,000", price: "₦100,000 / 100,000 Mobi" },
  { name: "Deluxe Bronze", dpd: "12,000", price: "₦120,000 / 120,000 Mobi" },
  { name: "Deluxe Gold", dpd: "14,000", price: "₦140,000 / 140,000 Mobi" },
  { name: "Deluxe Gold Plus", dpd: "16,000", price: "₦160,000 / 160,000 Mobi" },
  { name: "Deluxe Diamond", dpd: "18,000", price: "₦180,000 / 180,000 Mobi" },
  { name: "Deluxe Diamond Plus", dpd: "20,000", price: "₦200,000 / 200,000 Mobi" },
  { name: "Deluxe Platinum", dpd: "25,000", price: "₦250,000 / 250,000 Mobi" },
  { name: "Deluxe Platinum Plus", dpd: "30,000", price: "₦300,000 / 300,000 Mobi" },
  { name: "Bumper Gold", dpd: "35,000", price: "₦350,000 / 350,000 Mobi" },
  { name: "Bumper Diamond", dpd: "40,000", price: "₦400,000 / 400,000 Mobi" },
  { name: "Bumper Platinum", dpd: "45,000", price: "₦450,000 / 450,000 Mobi" },
  { name: "Bumper Infinity", dpd: "50,000", price: "₦500,000 / 500,000 Mobi" },
  { name: "Unlimited", dpd: "Unlimited", price: "₦600,000 / 600,000 Mobi" },
];

const EXTENDED_EXPOSURE = [
  { extra: "Extra 1 minute", charge: "12% of DPD Charge" },
  { extra: "Extra 2 minutes", charge: "14% of DPD Charge" },
  { extra: "Extra 3 minutes", charge: "16% of DPD Charge" },
  { extra: "Extra 4 minutes", charge: "18% of DPD Charge" },
  { extra: "Extra 5 minutes", charge: "20% of DPD Charge" },
  { extra: "Extra 6 minutes", charge: "22% of DPD Charge" },
  { extra: "Extra 7 minutes", charge: "24% of DPD Charge" },
  { extra: "Extra 8 minutes", charge: "26% of DPD Charge" },
  { extra: "Extra 9 minutes", charge: "28% of DPD Charge" },
  { extra: "Extra 10 minutes", charge: "30% of DPD Charge" },
];

const REPEAT_AFTER = [
  { interval: "After 10 minutes", charge: "+10% of DPD Charge" },
  { interval: "After 30 minutes", charge: "+10% of DPD Charge" },
  { interval: "After 1 hour", charge: "+10% of DPD Charge" },
  { interval: "After 3 hours", charge: "+10% of DPD Charge" },
  { interval: "After 6 hours", charge: "+10% of DPD Charge" },
  { interval: "After 12 hours", charge: "+10% of DPD Charge" },
  { interval: "After 18 hours", charge: "+10% of DPD Charge" },
  { interval: "After 24 hours", charge: "+10% of DPD Charge" },
];

const REPEAT_EVERY = [
  { interval: "Every 10 minutes", charge: "+35% of DPD Charge" },
  { interval: "Every 30 minutes", charge: "+30% of DPD Charge" },
  { interval: "Every 1 hour", charge: "+25% of DPD Charge" },
  { interval: "Every 3 hours", charge: "+20% of DPD Charge" },
  { interval: "Every 6 hours", charge: "+15% of DPD Charge" },
  { interval: "Every 12 hours", charge: "+12% of DPD Charge" },
  { interval: "Every 18 hours", charge: "+10% of DPD Charge" },
  { interval: "Every 24 hours", charge: "+9% of DPD Charge" },
  { interval: "Every 30 hours", charge: "+8% of DPD Charge" },
  { interval: "Every 36 hours", charge: "+7% of DPD Charge" },
  { interval: "Every 42 hours", charge: "+6% of DPD Charge" },
  { interval: "Every 48 hours", charge: "+5% of DPD Charge" },
];

// ─── Sub-components ───

function SizeList({ data }: { data: { size: string; desc: string; fee: string }[] }) {
  return (
    <div className="divide-y divide-border/30">
      {data.map((item, i) => (
        <div key={i} className="py-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-foreground">{item.size}</span>
            <Badge variant="secondary" className="text-xs font-semibold whitespace-nowrap">
              {item.fee} of Setup Fee
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 break-words">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

function SetupList({ data }: { data: { label: string; fee: string }[] }) {
  return (
    <div className="divide-y divide-border/30">
      {data.map((item, i) => (
        <div key={i} className="py-2.5 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground whitespace-nowrap">{item.label}</span>
          <span className="text-xs text-muted-foreground font-medium text-right">{item.fee}</span>
        </div>
      ))}
    </div>
  );
}

function TwoColRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2.5 flex items-center justify-between gap-2">
      <span className="text-sm font-semibold text-foreground whitespace-nowrap">{label}</span>
      <span className="text-xs text-muted-foreground font-medium text-right whitespace-nowrap">{value}</span>
    </div>
  );
}

export default function CommunityAdvertRatesPage() {
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();

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
            <h1 className="text-lg font-bold">Community Advert Rates</h1>
            <p className="text-xs text-muted-foreground">Pricing guide for community advertisements</p>
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
                        <Badge variant="secondary" className="text-[10px]">{pack.tag}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{pack.range}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs font-bold shrink-0">-{pack.discount}%</Badge>
                </div>
              ))}
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

          {/* ══════════ FULL SUBSCRIPTION RATE CARD ══════════ */}
          <Separator className="my-2" />

          <div className="space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
              Full Subscription Rate Card
            </h2>
            <p className="text-xs text-muted-foreground px-1">
              Tap each category to expand detailed pricing. All prices in ₦ and Mobi (1:1 rate).
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="space-y-2"
            onValueChange={(value) => {
              if (value) {
                setTimeout(() => {
                  const el = document.querySelector(`[data-state="open"][data-accordion-item="${value}"]`)
                    || document.querySelector(`[data-state="open"].border.rounded-xl`);
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 350);
              }
            }}
          >
            {/* 1. Ad Space Sizes */}
            <AccordionItem value="space-sizes" data-accordion-item="space-sizes" className="border rounded-xl overflow-hidden bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <Maximize className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Advert Space Sizes & Charges</p>
                    <p className="text-xs text-muted-foreground font-normal">Single, Bundled & Roll-Out display sizes</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold">Single Display [H × W]</p>
                  </div>
                  <SizeList data={SINGLE_SIZES} />
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold">Multiples Bundled Display [H × W]</p>
                  </div>
                  <SizeList data={BUNDLED_SIZES} />
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold">Multiples Roll-Out Display [H × W]</p>
                  </div>
                  <SizeList data={ROLLOUT_SIZES} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Setup Fees */}
            <AccordionItem value="setup-fees" data-accordion-item="setup-fees" className="border rounded-xl overflow-hidden bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <Zap className="h-5 w-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Set-Up Fees</p>
                    <p className="text-xs text-muted-foreground font-normal">One-time setup fees per display type</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Single Display</p>
                  <TwoColRow label={SINGLE_SETUP.label} value={SINGLE_SETUP.fee} />
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-semibold mb-2">Bundled Display</p>
                  <SetupList data={BUNDLED_SETUP} />
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-semibold mb-2">Roll-Out Display</p>
                  <SetupList data={ROLLOUT_SETUP} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. DPD Packages */}
            <AccordionItem value="dpd-packages" data-accordion-item="dpd-packages" className="border rounded-xl overflow-hidden bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <Clock className="h-5 w-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">DPD Packages</p>
                    <p className="text-xs text-muted-foreground font-normal">Display-Per-Day packages & pricing</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="divide-y divide-border/30">
                  {DPD_PACKAGES.map((pkg, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-sm font-semibold text-foreground">{pkg.name}</span>
                        <p className="text-xs text-muted-foreground">{pkg.dpd} DPD</p>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium text-right">{pkg.price}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Value-Added Features */}
            <AccordionItem value="value-added" data-accordion-item="value-added" className="border rounded-xl overflow-hidden bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <Star className="h-5 w-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Value-Added Features</p>
                    <p className="text-xs text-muted-foreground font-normal">Extended exposure, repeat-after & repeat-every</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <p className="text-sm font-semibold">Extended Exposure</p>
                  </div>
                  <div className="divide-y divide-border/30">
                    {EXTENDED_EXPOSURE.map((item, i) => (
                      <TwoColRow key={i} label={item.extra} value={item.charge} />
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-semibold">Repeat After</p>
                  </div>
                  <div className="divide-y divide-border/30">
                    {REPEAT_AFTER.map((item, i) => (
                      <TwoColRow key={i} label={item.interval} value={item.charge} />
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Repeat className="h-4 w-4 text-emerald-500" />
                    <p className="text-sm font-semibold">Repeat Every</p>
                  </div>
                  <div className="divide-y divide-border/30">
                    {REPEAT_EVERY.map((item, i) => (
                      <TwoColRow key={i} label={item.interval} value={item.charge} />
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
