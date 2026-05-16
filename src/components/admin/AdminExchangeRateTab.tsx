import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Coins,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  Pencil,
  RotateCcw,
  Globe,
  Info,
  X,
  Link2,
  Unlink,
  AlertTriangle,
} from "lucide-react";

interface CurrencyRate {
  code: string;
  name: string;
  country: string;
  flag: string;
  /** Buying Rate — Local → Mobi (Voucher Recharges). Always more favourable. */
  ratePerMobi: number;
  previousRate: number;
  /** Selling Rate — Mobi → Local (Liquidation from Sundry Wallet). Less favourable, sustains platform spread. */
  sellingRatePerMobi: number;
  previousSellingRate: number;
  lastUpdated: string;
  isBase: boolean;
}

// Default Selling Rate is 4% LESS favourable than Buying Rate (industry-standard forex spread)
const DEFAULT_SELL_SPREAD = 0.04;
const sell = (buy: number) => +(buy * (1 - DEFAULT_SELL_SPREAD)).toPrecision(6);

const initialCurrencyRates: CurrencyRate[] = ([
  { code: "NGN", name: "Nigerian Naira", country: "Nigeria", flag: "🇳🇬", ratePerMobi: 1.00, previousRate: 1.00, lastUpdated: "2026-03-17", isBase: true },
  { code: "USD", name: "US Dollar", country: "United States", flag: "🇺🇸", ratePerMobi: 0.00062, previousRate: 0.00065, lastUpdated: "2026-03-17", isBase: false },
  { code: "EUR", name: "Euro", country: "Eurozone", flag: "🇪🇺", ratePerMobi: 0.00057, previousRate: 0.00059, lastUpdated: "2026-03-17", isBase: false },
  { code: "GBP", name: "British Pound", country: "United Kingdom", flag: "🇬🇧", ratePerMobi: 0.00049, previousRate: 0.00050, lastUpdated: "2026-03-17", isBase: false },
  { code: "GHS", name: "Ghanaian Cedi", country: "Ghana", flag: "🇬🇭", ratePerMobi: 0.0093, previousRate: 0.0091, lastUpdated: "2026-03-17", isBase: false },
  { code: "KES", name: "Kenyan Shilling", country: "Kenya", flag: "🇰🇪", ratePerMobi: 0.080, previousRate: 0.079, lastUpdated: "2026-03-17", isBase: false },
  { code: "ZAR", name: "South African Rand", country: "South Africa", flag: "🇿🇦", ratePerMobi: 0.011, previousRate: 0.012, lastUpdated: "2026-03-17", isBase: false },
  { code: "EGP", name: "Egyptian Pound", country: "Egypt", flag: "🇪🇬", ratePerMobi: 0.030, previousRate: 0.029, lastUpdated: "2026-03-17", isBase: false },
  { code: "XOF", name: "West African CFA Franc", country: "West Africa (UEMOA)", flag: "🌍", ratePerMobi: 0.37, previousRate: 0.36, lastUpdated: "2026-03-17", isBase: false },
  { code: "XAF", name: "Central African CFA Franc", country: "Central Africa (CEMAC)", flag: "🌍", ratePerMobi: 0.37, previousRate: 0.36, lastUpdated: "2026-03-17", isBase: false },
  { code: "TZS", name: "Tanzanian Shilling", country: "Tanzania", flag: "🇹🇿", ratePerMobi: 1.56, previousRate: 1.55, lastUpdated: "2026-03-17", isBase: false },
  { code: "UGX", name: "Ugandan Shilling", country: "Uganda", flag: "🇺🇬", ratePerMobi: 2.28, previousRate: 2.27, lastUpdated: "2026-03-17", isBase: false },
  { code: "RWF", name: "Rwandan Franc", country: "Rwanda", flag: "🇷🇼", ratePerMobi: 0.82, previousRate: 0.81, lastUpdated: "2026-03-17", isBase: false },
  { code: "ETB", name: "Ethiopian Birr", country: "Ethiopia", flag: "🇪🇹", ratePerMobi: 0.072, previousRate: 0.070, lastUpdated: "2026-03-17", isBase: false },
  { code: "MAD", name: "Moroccan Dirham", country: "Morocco", flag: "🇲🇦", ratePerMobi: 0.006, previousRate: 0.006, lastUpdated: "2026-03-17", isBase: false },
  { code: "INR", name: "Indian Rupee", country: "India", flag: "🇮🇳", ratePerMobi: 0.052, previousRate: 0.053, lastUpdated: "2026-03-17", isBase: false },
  { code: "CNY", name: "Chinese Yuan", country: "China", flag: "🇨🇳", ratePerMobi: 0.0045, previousRate: 0.0046, lastUpdated: "2026-03-17", isBase: false },
  { code: "JPY", name: "Japanese Yen", country: "Japan", flag: "🇯🇵", ratePerMobi: 0.093, previousRate: 0.092, lastUpdated: "2026-03-17", isBase: false },
  { code: "CAD", name: "Canadian Dollar", country: "Canada", flag: "🇨🇦", ratePerMobi: 0.00085, previousRate: 0.00087, lastUpdated: "2026-03-17", isBase: false },
  { code: "AUD", name: "Australian Dollar", country: "Australia", flag: "🇦🇺", ratePerMobi: 0.00095, previousRate: 0.00097, lastUpdated: "2026-03-17", isBase: false },
  { code: "AED", name: "UAE Dirham", country: "United Arab Emirates", flag: "🇦🇪", ratePerMobi: 0.0023, previousRate: 0.0024, lastUpdated: "2026-03-17", isBase: false },
  { code: "SAR", name: "Saudi Riyal", country: "Saudi Arabia", flag: "🇸🇦", ratePerMobi: 0.0023, previousRate: 0.0024, lastUpdated: "2026-03-17", isBase: false },
  { code: "BRL", name: "Brazilian Real", country: "Brazil", flag: "🇧🇷", ratePerMobi: 0.0031, previousRate: 0.0033, lastUpdated: "2026-03-17", isBase: false },
  { code: "MXN", name: "Mexican Peso", country: "Mexico", flag: "🇲🇽", ratePerMobi: 0.011, previousRate: 0.012, lastUpdated: "2026-03-17", isBase: false },
  { code: "BWP", name: "Botswana Pula", country: "Botswana", flag: "🇧🇼", ratePerMobi: 0.0083, previousRate: 0.0082, lastUpdated: "2026-03-17", isBase: false },
  { code: "MZN", name: "Mozambican Metical", country: "Mozambique", flag: "🇲🇿", ratePerMobi: 0.039, previousRate: 0.038, lastUpdated: "2026-03-17", isBase: false },
  { code: "ZMW", name: "Zambian Kwacha", country: "Zambia", flag: "🇿🇲", ratePerMobi: 0.017, previousRate: 0.016, lastUpdated: "2026-03-17", isBase: false },
  { code: "AOA", name: "Angolan Kwanza", country: "Angola", flag: "🇦🇴", ratePerMobi: 0.52, previousRate: 0.51, lastUpdated: "2026-03-17", isBase: false },
  { code: "CDF", name: "Congolese Franc", country: "DR Congo", flag: "🇨🇩", ratePerMobi: 1.73, previousRate: 1.70, lastUpdated: "2026-03-17", isBase: false },
  { code: "SLL", name: "Sierra Leonean Leone", country: "Sierra Leone", flag: "🇸🇱", ratePerMobi: 13.0, previousRate: 12.8, lastUpdated: "2026-03-17", isBase: false },
  { code: "GMD", name: "Gambian Dalasi", country: "Gambia", flag: "🇬🇲", ratePerMobi: 0.042, previousRate: 0.041, lastUpdated: "2026-03-17", isBase: false },
] as Omit<CurrencyRate, "sellingRatePerMobi" | "previousSellingRate">[]).map(r => ({
  ...r,
  sellingRatePerMobi: sell(r.ratePerMobi),
  previousSellingRate: sell(r.previousRate),
}));

export function AdminExchangeRateTab() {
  const [rates, setRates] = useState<CurrencyRate[]>(initialCurrencyRates);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [cascadeChanges, setCascadeChanges] = useState(true);
  // Global Selling Spread (% applied below Buying Rate). Default 4%.
  const [sellingSpreadPct, setSellingSpreadPct] = useState<number>(4);
  const [spreadLocked, setSpreadLocked] = useState(true);
  const [spreadDraft, setSpreadDraft] = useState("4");
  const { toast } = useToast();

  // Recompute Selling Rates whenever Buying Rate or Spread changes
  const ratesWithSell = useMemo(() => {
    const factor = 1 - sellingSpreadPct / 100;
    return rates.map(r => ({
      ...r,
      sellingRatePerMobi: +(r.ratePerMobi * factor).toPrecision(6),
      previousSellingRate: +(r.previousRate * factor).toPrecision(6),
    }));
  }, [rates, sellingSpreadPct]);


  const filteredRates = useMemo(() => {
    if (!searchQuery.trim()) return ratesWithSell;
    const q = searchQuery.toLowerCase();
    return ratesWithSell.filter(
      r =>
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q)
    );
  }, [ratesWithSell, searchQuery]);

  const totalCurrencies = rates.length;
  const baseRate = rates.find(r => r.isBase);

  const handleStartEdit = (code: string, currentRate: number) => {
    setEditingCode(code);
    setEditValue(currentRate.toString());
    // Reset cascade to true when editing base
    if (code === "NGN") setCascadeChanges(true);
  };

  const handleSaveRate = (code: string) => {
    const newRate = parseFloat(editValue);
    if (isNaN(newRate) || newRate <= 0) {
      toast({ title: "Invalid Rate", description: "Please enter a valid positive number.", variant: "destructive" });
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (code === "NGN") {
      const oldBaseRate = baseRate?.ratePerMobi || 1;
      const ratio = newRate / oldBaseRate;

      if (cascadeChanges) {
        // Cascade: scale all other currencies proportionally
        setRates(prev =>
          prev.map(r => {
            if (r.code === "NGN") {
              return { ...r, previousRate: r.ratePerMobi, ratePerMobi: newRate, lastUpdated: today };
            }
            const scaledRate = r.ratePerMobi * ratio;
            return { ...r, previousRate: r.ratePerMobi, ratePerMobi: scaledRate, lastUpdated: today };
          })
        );
        toast({
          title: "Base Rate Cascaded",
          description: `NGN updated to ${newRate}. All ${totalCurrencies - 1} currencies scaled proportionally.`,
        });
      } else {
        // Only update NGN
        setRates(prev =>
          prev.map(r =>
            r.code === "NGN"
              ? { ...r, previousRate: r.ratePerMobi, ratePerMobi: newRate, lastUpdated: today }
              : r
          )
        );
        toast({
          title: "Base Rate Updated",
          description: `NGN updated to ${newRate}. Other currencies unchanged.`,
        });
      }
    } else {
      setRates(prev =>
        prev.map(r =>
          r.code === code
            ? { ...r, previousRate: r.ratePerMobi, ratePerMobi: newRate, lastUpdated: today }
            : r
        )
      );
      toast({ title: "Rate Updated", description: `${code} exchange rate updated to ${newRate} per Mobi.` });
    }

    setEditingCode(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingCode(null);
    setEditValue("");
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
    if (current < previous) return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  const getChangePercent = (current: number, previous: number) => {
    if (previous === 0) return "0.0";
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const formatRate = (rate: number) => {
    if (rate < 0.001) return rate.toFixed(6);
    if (rate < 0.01) return rate.toFixed(5);
    if (rate < 1) return rate.toFixed(4);
    return rate.toFixed(2);
  };

  const isEditingBase = editingCode === "NGN";

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-3 pb-6">
        {/* Base Rate Hero — now editable */}
        <div className={`rounded-xl border bg-gradient-to-br p-4 transition-all ${
          isEditingBase
            ? "border-primary/50 from-primary/10 to-primary/5 ring-2 ring-primary/20"
            : "border-amber-500/30 from-amber-500/15 to-orange-500/10"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">Base Exchange Rate</span>
            </div>
            {!isEditingBase && (
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 touch-manipulation active:scale-90"
                onClick={() => handleStartEdit("NGN", baseRate?.ratePerMobi || 1)}
              >
                <Pencil className="h-4 w-4 text-amber-600" />
              </Button>
            )}
          </div>

          {isEditingBase ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium whitespace-nowrap">1 Mobi =</span>
                <Input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 h-11 text-lg font-bold text-right touch-manipulation"
                  step="any"
                  autoFocus
                />
                <span className="text-sm font-medium text-amber-600">NGN</span>
              </div>

              {/* Cascade toggle */}
              <div className="rounded-lg border border-border/60 bg-background/50 p-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {cascadeChanges ? (
                      <Link2 className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Unlink className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <Label htmlFor="cascade" className="text-sm font-medium cursor-pointer">
                      {cascadeChanges ? "Cascade to all currencies" : "Update NGN only"}
                    </Label>
                  </div>
                  <Switch
                    id="cascade"
                    checked={cascadeChanges}
                    onCheckedChange={setCascadeChanges}
                    className="touch-manipulation"
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cascadeChanges
                    ? "All other currencies will be proportionally recalculated based on the new base rate."
                    : "Only the NGN base value changes. Other currency rates stay as they are."}
                </p>
                {!cascadeChanges && (
                  <div className="flex items-start gap-1.5 text-xs text-amber-600">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>This may cause rate inconsistencies across currencies.</span>
                  </div>
                )}
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-2">
                <Button
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.98]"
                  onClick={() => handleSaveRate("NGN")}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {cascadeChanges ? "Save & Cascade" : "Save NGN Only"}
                </Button>
                <Button
                  variant="outline"
                  className="h-11 px-4 touch-manipulation active:scale-95"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-foreground">
                1 Mobi <span className="text-muted-foreground font-normal">=</span>{" "}
                <span className="text-amber-600">₦{formatRate(baseRate?.ratePerMobi || 1)}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                Tap the pencil to edit. You can cascade changes to all currencies.
              </p>
            </>
          )}
        </div>

        {/* Stats — inline pills */}
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg border border-border bg-card px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-bold">{totalCurrencies}</span>
              <span className="text-xs text-muted-foreground">pairs</span>
            </div>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-sm font-bold">Today</span>
              <span className="text-xs text-muted-foreground">synced</span>
            </div>
          </div>
        </div>

        {/* Selling Spread (Buy/Sell margin) — global, lockable */}
        <div className="rounded-xl border-2 border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 to-purple-500/5 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <TrendingDown className="h-4 w-4 text-fuchsia-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">Selling Spread</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  % discount applied below Buying Rate when users Liquidate Mobi → Local
                </p>
              </div>
            </div>
            <Button
              size="icon"
              variant={spreadLocked ? "outline" : "default"}
              className="h-9 w-9 shrink-0 touch-manipulation active:scale-95"
              onClick={() => {
                if (!spreadLocked) {
                  // Saving: apply draft
                  const v = parseFloat(spreadDraft);
                  if (isNaN(v) || v < 0 || v > 25) {
                    toast({ title: "Invalid Spread", description: "Enter 0–25%.", variant: "destructive" });
                    return;
                  }
                  setSellingSpreadPct(v);
                  toast({ title: "Selling Spread Updated", description: `Now ${v}% across all ${totalCurrencies} currencies.` });
                }
                setSpreadLocked(!spreadLocked);
              }}
              aria-label={spreadLocked ? "Unlock spread" : "Save & lock spread"}
            >
              {spreadLocked
                ? <span className="text-xs">🔒</span>
                : <Check className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={spreadLocked ? sellingSpreadPct : spreadDraft}
              onChange={(e) => setSpreadDraft(e.target.value)}
              disabled={spreadLocked}
              step="0.1"
              min="0"
              max="25"
              className="h-10 text-base font-bold tabular-nums text-right"
            />
            <span className="text-sm font-semibold text-muted-foreground shrink-0">%</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-fuchsia-500/15">
            <span className="text-muted-foreground">Buy Rate (Recharge)</span>
            <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">₦{formatRate(baseRate?.ratePerMobi || 1)} / Mobi</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Sell Rate (Liquidate)</span>
            <span className="font-mono font-semibold text-fuchsia-700 dark:text-fuchsia-400">
              ₦{formatRate((baseRate?.ratePerMobi || 1) * (1 - sellingSpreadPct / 100))} / Mobi
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search currency, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 touch-manipulation"
          />
        </div>

        {/* Currency List */}
        <div className="space-y-2">
          {filteredRates.map((rate) => {
            if (rate.isBase) return null; // Base shown in hero above

            const changePercent = getChangePercent(rate.ratePerMobi, rate.previousRate);
            const isEditing = editingCode === rate.code;
            const isPositive = rate.ratePerMobi > rate.previousRate;
            const isNegative = rate.ratePerMobi < rate.previousRate;

            return (
              <div
                key={rate.code}
                className="rounded-xl border border-border/50 bg-card p-3"
              >
                {/* Row 1: Flag + Code + Name */}
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-2xl leading-none">{rate.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">{rate.code}</span>
                      <span className="text-xs text-muted-foreground">—</span>
                      <span className="text-xs text-muted-foreground truncate">{rate.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground/70">{rate.country}</p>
                  </div>
                </div>

                {/* Row 2: Rate + trend + edit */}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 h-11 text-sm text-right touch-manipulation"
                      step="any"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      className="h-11 w-11 bg-emerald-600 hover:bg-emerald-700 shrink-0 touch-manipulation active:scale-95"
                      onClick={() => handleSaveRate(rate.code)}
                    >
                      <Check className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-11 w-11 shrink-0 touch-manipulation active:scale-95"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold tabular-nums">{formatRate(rate.ratePerMobi)}</span>
                      <span className="text-xs text-muted-foreground">per Mobi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(rate.ratePerMobi, rate.previousRate)}
                        <span
                          className={`text-xs font-medium ${
                            isPositive ? "text-emerald-500" : isNegative ? "text-red-500" : "text-muted-foreground"
                          }`}
                        >
                          {isPositive ? "+" : ""}{changePercent}%
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 touch-manipulation active:scale-90"
                        onClick={() => handleStartEdit(rate.code, rate.ratePerMobi)}
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Row 3: Buy / Sell rate + conversion preview */}
                {!isEditing && (
                  <div className="mt-2 pt-2 border-t border-border/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">Buy</span>
                      <span className="text-xs font-mono font-semibold text-foreground">
                        {formatRate(rate.ratePerMobi)} {rate.code} / Mobi
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-fuchsia-600 font-semibold">Sell</span>
                      <span className="text-xs font-mono font-semibold text-fuchsia-700 dark:text-fuchsia-400">
                        {formatRate(rate.sellingRatePerMobi)} {rate.code} / Mobi
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground pt-1">
                      M1,000 → buy {(rate.ratePerMobi * 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {rate.code} · sell {(rate.sellingRatePerMobi * 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {rate.code}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredRates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No currencies match your search.</p>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
