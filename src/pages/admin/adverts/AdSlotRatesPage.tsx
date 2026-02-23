import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Ruler,
  Receipt,
  Eye,
  Clock,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

// ─── SECTION 1: Advert Space Sizes & Charges ────────────────────────────
const initialSingleSizes = [
  { size: "2×3", desc: "1/5 Screen Height × Half Screen Width", pct: 2 },
  { size: "2×6", desc: "1/5 Screen Height × Full Screen Width", pct: 4 },
  { size: "2.5×3", desc: "Quarter Screen Height × Half Screen Width", pct: 6 },
  { size: "2.5×6", desc: "Quarter Screen Height × Full Screen Width", pct: 8 },
  { size: "3.5×3", desc: "1/3 Screen Height × Half Screen Width", pct: 10 },
  { size: "3.5×6", desc: "1/3 Screen Height × Full Screen Width", pct: 12 },
  { size: "5×6", desc: "Half Screen Height × Full Screen Width", pct: 14 },
  { size: "6.5×3", desc: "2/3 Screen Height × Half Screen Width", pct: 16 },
  { size: "6.5×6", desc: "2/3 Screen Height × Full Screen Width", pct: 18 },
  { size: "10×6", desc: "Full Screen Height × Full Screen Width", pct: 20 },
];

const initialBundledSizes = [
  { size: "2×3", desc: "1/5 Screen Height × Half Screen Width", pct: 12 },
  { size: "2×6", desc: "1/5 Screen Height × Full Screen Width", pct: 14 },
  { size: "2.5×3", desc: "Quarter Screen Height × Half Screen Width", pct: 16 },
  { size: "2.5×6", desc: "Quarter Screen Height × Full Screen Width", pct: 18 },
  { size: "3.5×3", desc: "1/3 Screen Height × Half Screen Width", pct: 20 },
  { size: "3.5×6", desc: "1/3 Screen Height × Full Screen Width", pct: 22 },
  { size: "5×6", desc: "Half Screen Height × Full Screen Width", pct: 24 },
  { size: "6.5×3", desc: "2/3 Screen Height × Half Screen Width", pct: 26 },
  { size: "6.5×6", desc: "2/3 Screen Height × Full Screen Width", pct: 28 },
  { size: "10×6", desc: "Full Screen Height × Full Screen Width", pct: 30 },
];

const initialRolloutSizes = [
  { size: "5×6", desc: "Half Screen Height × Full Screen Width", pct: 30 },
  { size: "6.5×6", desc: "2/3 Screen Height × Full Screen Width", pct: 35 },
  { size: "10×6", desc: "Full Screen Height × Full Screen Width", pct: 40 },
];

// ─── SECTION 2: Set-Up Fees ─────────────────────────────────────────────
const initialSingleSetup = [
  { label: "Single Display", fee: 40000 },
];

const initialBundledSetup = [
  { label: "2-in-1 Display", fee: 40000 },
  { label: "3-in-1 Display", fee: 60000 },
  { label: "4-in-1 Display", fee: 80000 },
  { label: "5-in-1 Display", fee: 100000 },
  { label: "6-in-1 Display", fee: 120000 },
  { label: "7-in-1 Display", fee: 140000 },
  { label: "8-in-1 Display", fee: 160000 },
  { label: "9-in-1 Display", fee: 180000 },
  { label: "10-in-1 Display", fee: 200000 },
  { label: "15-in-1 Display", fee: 250000 },
];

const initialRolloutSetup = [
  { label: "2-in-1 Display", fee: 70000 },
  { label: "3-in-1 Display", fee: 100000 },
  { label: "4-in-1 Display", fee: 140000 },
  { label: "5-in-1 Display", fee: 160000 },
  { label: "6-in-1 Display", fee: 180000 },
  { label: "7-in-1 Display", fee: 200000 },
  { label: "8-in-1 Display", fee: 220000 },
  { label: "9-in-1 Display", fee: 240000 },
  { label: "10-in-1 Display", fee: 260000 },
  { label: "15-in-1 Display", fee: 300000 },
];

// ─── SECTION 3: DPD Packages ────────────────────────────────────────────
const initialDpdPackages = [
  { name: "Basic", dpd: 1000, price: 10000 },
  { name: "Standard", dpd: 2000, price: 20000 },
  { name: "Professional", dpd: 3000, price: 30000 },
  { name: "Business", dpd: 4000, price: 40000 },
  { name: "Enterprise", dpd: 5000, price: 50000 },
  { name: "Entrepreneur", dpd: 6000, price: 60000 },
  { name: "Deluxe", dpd: 7000, price: 70000 },
  { name: "Deluxe Super", dpd: 8000, price: 80000 },
  { name: "Deluxe Super Plus", dpd: 9000, price: 90000 },
  { name: "Deluxe Silver", dpd: 10000, price: 100000 },
  { name: "Deluxe Bronze", dpd: 12000, price: 120000 },
  { name: "Deluxe Gold", dpd: 14000, price: 140000 },
  { name: "Deluxe Gold Plus", dpd: 16000, price: 160000 },
  { name: "Deluxe Diamond", dpd: 18000, price: 180000 },
  { name: "Deluxe Diamond Plus", dpd: 20000, price: 200000 },
  { name: "Deluxe Platinum", dpd: 25000, price: 250000 },
  { name: "Deluxe Platinum Plus", dpd: 30000, price: 300000 },
  { name: "Bumper Gold", dpd: 35000, price: 350000 },
  { name: "Bumper Diamond", dpd: 40000, price: 400000 },
  { name: "Bumper Platinum", dpd: 45000, price: 450000 },
  { name: "Bumper Infinity", dpd: 50000, price: 500000 },
  { name: "Unlimited", dpd: -1, price: 600000 },
];

// ─── SECTION 4: Extended Exposure Duration ──────────────────────────────
const initialExtendedExposure = [
  { label: "Extra 1 minute", pct: 12 },
  { label: "Extra 2 minutes", pct: 14 },
  { label: "Extra 3 minutes", pct: 16 },
  { label: "Extra 4 minutes", pct: 18 },
  { label: "Extra 5 minutes", pct: 20 },
  { label: "Extra 6 minutes", pct: 22 },
  { label: "Extra 7 minutes", pct: 24 },
  { label: "Extra 8 minutes", pct: 26 },
  { label: "Extra 9 minutes", pct: 28 },
  { label: "Extra 10 minutes", pct: 30 },
];

// ─── SECTION 5: Recurrent Exposure ──────────────────────────────────────
const initialRepeatAfter = [
  { label: "After 10 minutes", pct: 10 },
  { label: "After 30 minutes", pct: 10 },
  { label: "After 1 hour", pct: 10 },
  { label: "After 3 hours", pct: 10 },
  { label: "After 6 hours", pct: 10 },
  { label: "After 12 hours", pct: 10 },
  { label: "After 18 hours", pct: 10 },
  { label: "After 24 hours", pct: 10 },
];

const initialRepeatEvery = [
  { label: "Every 10 minutes", pct: 35 },
  { label: "Every 30 minutes", pct: 30 },
  { label: "Every 1 hour", pct: 25 },
  { label: "Every 3 hours", pct: 20 },
  { label: "Every 6 hours", pct: 15 },
  { label: "Every 12 hours", pct: 12 },
  { label: "Every 18 hours", pct: 10 },
  { label: "Every 24 hours", pct: 9 },
  { label: "Every 30 hours", pct: 8 },
  { label: "Every 36 hours", pct: 7 },
  { label: "Every 42 hours", pct: 6 },
  { label: "Every 48 hours", pct: 5 },
];

// ─── Collapsible Section Component ──────────────────────────────────────
function CollapsibleSection({
  title,
  icon,
  badge,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 active:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-sm">{title}</span>
          {badge && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {badge}
            </Badge>
          )}
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && <CardContent className="pt-0 pb-4 px-4">{children}</CardContent>}
    </Card>
  );
}

// ─── Size Rate Row ──────────────────────────────────────────────────────
function SizeRateRow({
  item,
  onChange,
}: {
  item: { size: string; desc: string; pct: number };
  onChange: (pct: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-2.5 border-b border-border/40 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground">{item.size}</p>
        <p className="text-[10px] text-muted-foreground leading-tight truncate">
          {item.desc}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Input
          type="number"
          min={0}
          max={100}
          value={item.pct}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-8 w-14 text-center text-xs font-bold"
        />
        <span className="text-[10px] text-muted-foreground">%</span>
      </div>
    </div>
  );
}

// ─── Setup Fee Row ──────────────────────────────────────────────────────
function SetupFeeRow({
  item,
  onChange,
}: {
  item: { label: string; fee: number };
  onChange: (fee: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-2.5 border-b border-border/40 last:border-0">
      <p className="text-xs font-medium text-foreground flex-1">{item.label}</p>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[10px] text-muted-foreground">₦/M</span>
        <Input
          type="number"
          min={0}
          value={item.fee}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-8 w-24 text-center text-xs font-bold"
        />
      </div>
    </div>
  );
}

// ─── Percentage Row (for extended exposure & recurrent) ─────────────────
function PercentageRow({
  label,
  suffix,
  pct,
  onChange,
}: {
  label: string;
  suffix: string;
  pct: number;
  onChange: (pct: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-2.5 border-b border-border/40 last:border-0">
      <p className="text-xs text-foreground flex-1">{label}</p>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[10px] text-muted-foreground">+</span>
        <Input
          type="number"
          min={0}
          max={100}
          value={pct}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-8 w-14 text-center text-xs font-bold"
        />
        <span className="text-[10px] text-muted-foreground truncate max-w-[60px]">
          % {suffix}
        </span>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════
export default function AdSlotRatesPage() {
  const { toast } = useToast();

  // Section 1
  const [singleSizes, setSingleSizes] = useState(initialSingleSizes.map((s) => ({ ...s })));
  const [bundledSizes, setBundledSizes] = useState(initialBundledSizes.map((s) => ({ ...s })));
  const [rolloutSizes, setRolloutSizes] = useState(initialRolloutSizes.map((s) => ({ ...s })));

  // Section 2
  const [singleSetup, setSingleSetup] = useState(initialSingleSetup.map((s) => ({ ...s })));
  const [bundledSetup, setBundledSetup] = useState(initialBundledSetup.map((s) => ({ ...s })));
  const [rolloutSetup, setRolloutSetup] = useState(initialRolloutSetup.map((s) => ({ ...s })));

  // Section 3
  const [dpdPackages, setDpdPackages] = useState(initialDpdPackages.map((s) => ({ ...s })));

  // Section 4
  const [extendedExposure, setExtendedExposure] = useState(initialExtendedExposure.map((s) => ({ ...s })));

  // Section 5
  const [repeatAfter, setRepeatAfter] = useState(initialRepeatAfter.map((s) => ({ ...s })));
  const [repeatEvery, setRepeatEvery] = useState(initialRepeatEvery.map((s) => ({ ...s })));

  const saveSection = (name: string) => {
    toast({ title: `${name} Saved`, description: `${name} rates updated successfully.` });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <div className="overflow-y-auto touch-auto overscroll-contain" style={{ height: "calc(100vh - 56px)" }}>
        {/* Page Title */}
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-base font-bold text-foreground">Advertisement Subscription Rates</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Configure all advert pricing, sizes, and value-added features
          </p>
        </div>

        <div className="px-3 pb-6 space-y-3">
          {/* ━━━ SECTION 1: Advert Space Sizes & Charges ━━━ */}
          <CollapsibleSection
            title="Space Sizes & Charges"
            icon={<Ruler className="h-4 w-4 text-primary" />}
            badge="% of Setup Fee"
            defaultOpen
          >
            <div className="space-y-4">
              {/* Single Display */}
              <div>
                <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                  Single Display
                </p>
                {singleSizes.map((item, i) => (
                  <SizeRateRow
                    key={item.size}
                    item={item}
                    onChange={(pct) => {
                      const u = [...singleSizes];
                      u[i] = { ...item, pct };
                      setSingleSizes(u);
                    }}
                  />
                ))}
              </div>

              {/* Multiples Bundled */}
              <div>
                <p className="text-[11px] font-bold text-accent-foreground uppercase tracking-wider mb-1">
                  Multiples Bundled Display
                </p>
                {bundledSizes.map((item, i) => (
                  <SizeRateRow
                    key={item.size}
                    item={item}
                    onChange={(pct) => {
                      const u = [...bundledSizes];
                      u[i] = { ...item, pct };
                      setBundledSizes(u);
                    }}
                  />
                ))}
              </div>

              {/* Roll-Out */}
              <div>
                <p className="text-[11px] font-bold text-secondary-foreground uppercase tracking-wider mb-1">
                  Multiples Roll-Out Display
                </p>
                {rolloutSizes.map((item, i) => (
                  <SizeRateRow
                    key={item.size}
                    item={item}
                    onChange={(pct) => {
                      const u = [...rolloutSizes];
                      u[i] = { ...item, pct };
                      setRolloutSizes(u);
                    }}
                  />
                ))}
              </div>

              <Button
                onClick={() => saveSection("Space Sizes")}
                className="w-full h-11 text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Space Sizes
              </Button>
            </div>
          </CollapsibleSection>

          {/* ━━━ SECTION 2: Set-Up Fees ━━━ */}
          <CollapsibleSection
            title="Subscription Set-Up Fees"
            icon={<Receipt className="h-4 w-4 text-accent-foreground" />}
            badge="₦ / Mobi"
          >
            <div className="space-y-4">
              {/* Single */}
              <div>
                <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                  Single Display
                </p>
                {singleSetup.map((item, i) => (
                  <SetupFeeRow
                    key={item.label}
                    item={item}
                    onChange={(fee) => {
                      const u = [...singleSetup];
                      u[i] = { ...item, fee };
                      setSingleSetup(u);
                    }}
                  />
                ))}
              </div>

              {/* Multiple Bundled */}
              <div>
                <p className="text-[11px] font-bold text-accent-foreground uppercase tracking-wider mb-1">
                  Multiple Bundled Display
                </p>
                {bundledSetup.map((item, i) => (
                  <SetupFeeRow
                    key={item.label}
                    item={item}
                    onChange={(fee) => {
                      const u = [...bundledSetup];
                      u[i] = { ...item, fee };
                      setBundledSetup(u);
                    }}
                  />
                ))}
              </div>

              {/* Roll-Out */}
              <div>
                <p className="text-[11px] font-bold text-secondary-foreground uppercase tracking-wider mb-1">
                  Multiples Roll-Out Display
                </p>
                {rolloutSetup.map((item, i) => (
                  <SetupFeeRow
                    key={item.label}
                    item={item}
                    onChange={(fee) => {
                      const u = [...rolloutSetup];
                      u[i] = { ...item, fee };
                      setRolloutSetup(u);
                    }}
                  />
                ))}
              </div>

              <Button
                onClick={() => saveSection("Set-Up Fees")}
                className="w-full h-11 text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Set-Up Fees
              </Button>
            </div>
          </CollapsibleSection>

          {/* ━━━ SECTION 3: DPD Packages ━━━ */}
          <CollapsibleSection
            title="DPD Packages"
            icon={<Eye className="h-4 w-4 text-secondary-foreground" />}
            badge={`${dpdPackages.length} tiers`}
          >
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground mb-2">
                Displays Per Day — Monthly rate per package
              </p>
              {dpdPackages.map((pkg, i) => (
                <div
                  key={pkg.name}
                  className="flex items-center justify-between gap-2 py-2 border-b border-border/40 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{pkg.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {pkg.dpd === -1 ? "Unlimited" : `${pkg.dpd.toLocaleString()} DPD`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-muted-foreground">₦/M</span>
                    <Input
                      type="number"
                      min={0}
                      value={pkg.price}
                      onChange={(e) => {
                        const u = [...dpdPackages];
                        u[i] = { ...pkg, price: Number(e.target.value) };
                        setDpdPackages(u);
                      }}
                      className="h-8 w-24 text-center text-xs font-bold"
                    />
                  </div>
                </div>
              ))}
              <Button
                onClick={() => saveSection("DPD Packages")}
                className="w-full h-11 text-sm mt-3"
              >
                <Save className="h-4 w-4 mr-2" />
                Save DPD Packages
              </Button>
            </div>
          </CollapsibleSection>

          {/* ━━━ SECTION 4: Extended Exposure Duration ━━━ */}
          <CollapsibleSection
            title="Extended Exposure Duration"
            icon={<Clock className="h-4 w-4 text-primary" />}
            badge="% of DPD"
          >
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground mb-2">
                Additional percentage of DPD charge for extra display time
              </p>
              {extendedExposure.map((item, i) => (
                <PercentageRow
                  key={item.label}
                  label={item.label}
                  suffix="of DPD"
                  pct={item.pct}
                  onChange={(pct) => {
                    const u = [...extendedExposure];
                    u[i] = { ...item, pct };
                    setExtendedExposure(u);
                  }}
                />
              ))}
              <Button
                onClick={() => saveSection("Extended Exposure")}
                className="w-full h-11 text-sm mt-3"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Extended Exposure
              </Button>
            </div>
          </CollapsibleSection>

          {/* ━━━ SECTION 5: Recurrent Exposure ━━━ */}
          <CollapsibleSection
            title="Recurrent Exposure"
            icon={<RotateCcw className="h-4 w-4 text-muted-foreground" />}
            badge="% of DPD"
          >
            <div className="space-y-4">
              {/* Repeat After */}
              <div>
                <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                  Repeat After Last Exposure
                </p>
                <p className="text-[10px] text-muted-foreground mb-2">
                  One-time repeat after specified interval
                </p>
                {repeatAfter.map((item, i) => (
                  <PercentageRow
                    key={item.label}
                    label={item.label}
                    suffix="of DPD"
                    pct={item.pct}
                    onChange={(pct) => {
                      const u = [...repeatAfter];
                      u[i] = { ...item, pct };
                      setRepeatAfter(u);
                    }}
                  />
                ))}
              </div>

              {/* Repeat Every */}
              <div>
                <p className="text-[11px] font-bold text-accent-foreground uppercase tracking-wider mb-1">
                  Repeat Every Interval
                </p>
                <p className="text-[10px] text-muted-foreground mb-2">
                  Continuous repeat at specified interval
                </p>
                {repeatEvery.map((item, i) => (
                  <PercentageRow
                    key={item.label}
                    label={item.label}
                    suffix="of DPD"
                    pct={item.pct}
                    onChange={(pct) => {
                      const u = [...repeatEvery];
                      u[i] = { ...item, pct };
                      setRepeatEvery(u);
                    }}
                  />
                ))}
              </div>

              <Button
                onClick={() => saveSection("Recurrent Exposure")}
                className="w-full h-11 text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Recurrent Exposure
              </Button>
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
