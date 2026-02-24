import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Monitor, Layers, RotateCcw, Zap, Clock, RefreshCw, Repeat } from "lucide-react";
import { Header } from "@/components/Header";

// ─── Single Display Sizes ───
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

// ─── Multiples Bundled Display Sizes ───
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

// ─── Multiples Roll-Out Display Sizes ───
const ROLLOUT_SIZES = [
  { size: "5×6", desc: "Half Screen Height × Full Screen Width", fee: "30%" },
  { size: "6.5×6", desc: "2/3 Screen Height × Full Screen Width", fee: "35%" },
  { size: "10×6", desc: "Full Screen Height × Full Screen Width", fee: "40%" },
];

// ─── Single Display Setup Fee ───
const SINGLE_SETUP = { label: "Single Display", fee: "₦40,000 / 40,000 Mobi" };

// ─── Multiple Bundled Setup Fees ───
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

// ─── Multiples Roll-Out Setup Fees ───
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

// ─── DPD Packages ───
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

// ─── Extended Exposure Duration ───
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

// ─── Recurrent Exposure - Repeat After ───
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

// ─── Recurrent Exposure - Repeat Every ───
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

// ─── Helper: size table ───
function SizeTable({ title, icon, data }: { title: string; icon: React.ReactNode; data: typeof SINGLE_SIZES }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2 px-3 pt-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div className="space-y-1.5">
          {data.map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-2 py-1.5 border-b border-border/30 last:border-0">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">{item.size}</span>
                <p className="text-xs text-muted-foreground leading-tight">{item.desc}</p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0 font-semibold">
                {item.fee} of Setup Fee
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Helper: setup fee table ───
function SetupTable({ title, icon, data }: { title: string; icon: React.ReactNode; data: { label: string; fee: string }[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2 px-3 pt-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div className="space-y-1.5">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-border/30 last:border-0">
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <span className="text-xs text-muted-foreground font-medium shrink-0">{item.fee}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdvertSubscriptionRatesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <ScrollArea className="flex-1">
        <div className="max-w-lg mx-auto px-3 py-4 pb-24 space-y-4">
          {/* Top bar */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground">Advertisement Subscription Rates</h1>
              <p className="text-xs text-muted-foreground">Complete pricing guide for all advert types</p>
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <p className="text-sm text-primary font-medium leading-relaxed">
              All prices are shown in both Naira (₦) and Mobi tokens at a 1:1 rate. Charges are per subscription month unless stated otherwise.
            </p>
          </div>

          {/* ══════════ SECTION 1: Ad Space Sizes & Charges ══════════ */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
              Advert Space Sizes & Charges
            </h2>
            <SizeTable
              title="Single Display [H × W]"
              icon={<Monitor className="h-4 w-4 text-primary" />}
              data={SINGLE_SIZES}
            />
            <SizeTable
              title="Multiples Bundled Display [H × W]"
              icon={<Layers className="h-4 w-4 text-blue-500" />}
              data={BUNDLED_SIZES}
            />
            <SizeTable
              title="Multiples Roll-Out Display [H × W]"
              icon={<RotateCcw className="h-4 w-4 text-amber-500" />}
              data={ROLLOUT_SIZES}
            />
          </div>

          {/* ══════════ SECTION 2: Setup Fees ══════════ */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
              Advert Subscription Set-Up Fees
            </h2>
            <SetupTable
              title="Single Display Set-Up Fee"
              icon={<Monitor className="h-4 w-4 text-primary" />}
              data={[SINGLE_SETUP]}
            />
            <SetupTable
              title="Multiple Bundled Display Set-Up Fees"
              icon={<Layers className="h-4 w-4 text-blue-500" />}
              data={BUNDLED_SETUP}
            />
            <SetupTable
              title="Multiples Roll-Out Display Set-Up Fees"
              icon={<RotateCcw className="h-4 w-4 text-amber-500" />}
              data={ROLLOUT_SETUP}
            />
          </div>

          {/* ══════════ SECTION 3: DPD Packages ══════════ */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
              Displays Per Day (DPD) Packages
            </h2>
            <Card className="border-border/60">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  DPD Rates Per Month
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="space-y-1">
                  {DPD_PACKAGES.map((pkg, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-border/30 last:border-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-foreground">{pkg.name}</span>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {pkg.dpd} DPD
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium shrink-0">{pkg.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ══════════ SECTION 4: Value-Added Features ══════════ */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
              Value-Added Features & Sundry Charges
            </h2>

            {/* Extended Exposure */}
            <Card className="border-border/60">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  Extended Exposure Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="space-y-1">
                  {EXTENDED_EXPOSURE.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-border/30 last:border-0">
                      <span className="text-sm font-medium text-foreground">{item.extra}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        +{item.charge}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Repeat After */}
            <Card className="border-border/60">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-violet-500" />
                  Recurrent Exposure — Repeat After
                </CardTitle>
                <p className="text-xs text-muted-foreground">Single repeat after a set delay from last exposure</p>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="space-y-1">
                  {REPEAT_AFTER.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-border/30 last:border-0">
                      <span className="text-sm font-medium text-foreground">{item.interval}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {item.charge}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Repeat Every */}
            <Card className="border-border/60">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-rose-500" />
                  Recurrent Exposure — Repeat Every
                </CardTitle>
                <p className="text-xs text-muted-foreground">Continuous repeat at fixed intervals</p>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="space-y-1">
                  {REPEAT_EVERY.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-border/30 last:border-0">
                      <span className="text-sm font-medium text-foreground">{item.interval}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {item.charge}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Button className="w-full" onClick={() => navigate("/submit-advert")}>
              Create an Advert →
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
