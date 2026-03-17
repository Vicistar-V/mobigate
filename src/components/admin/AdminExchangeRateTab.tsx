import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "lucide-react";

interface CurrencyRate {
  code: string;
  name: string;
  country: string;
  flag: string;
  ratePerMobi: number;
  previousRate: number;
  lastUpdated: string;
  isBase: boolean;
}

const initialCurrencyRates: CurrencyRate[] = [
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
];

export function AdminExchangeRateTab() {
  const [rates, setRates] = useState<CurrencyRate[]>(initialCurrencyRates);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();

  const filteredRates = useMemo(() => {
    if (!searchQuery.trim()) return rates;
    const q = searchQuery.toLowerCase();
    return rates.filter(
      r =>
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q)
    );
  }, [rates, searchQuery]);

  const totalCurrencies = rates.length;

  const handleStartEdit = (code: string, currentRate: number) => {
    setEditingCode(code);
    setEditValue(currentRate.toString());
  };

  const handleSaveRate = (code: string) => {
    const newRate = parseFloat(editValue);
    if (isNaN(newRate) || newRate <= 0) {
      toast({ title: "Invalid Rate", description: "Please enter a valid positive number.", variant: "destructive" });
      return;
    }
    setRates(prev =>
      prev.map(r =>
        r.code === code
          ? { ...r, previousRate: r.ratePerMobi, ratePerMobi: newRate, lastUpdated: new Date().toISOString().split("T")[0] }
          : r
      )
    );
    setEditingCode(null);
    setEditValue("");
    toast({ title: "Rate Updated", description: `${code} exchange rate updated to ${newRate} per Mobi.` });
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
    if (rate < 0.01) return rate.toFixed(5);
    if (rate < 1) return rate.toFixed(4);
    return rate.toFixed(2);
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-3 pb-6">
        {/* Base Rate Hero — compact vertical stack */}
        <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">Base Exchange Rate</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            1 Mobi <span className="text-muted-foreground font-normal">=</span> <span className="text-amber-600">₦1.00</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            All currencies derived from this base. 1 Mobi = 1 NGN.
          </p>
        </div>

        {/* Stats — inline pills instead of cards */}
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg border border-border bg-card px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-bold">{totalCurrencies}</span>
              <span className="text-xs text-muted-foreground">pairs</span>
            </div>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card px-3 py-2">
            <div className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-sm font-bold">Today</span>
              <span className="text-xs text-muted-foreground">synced</span>
            </div>
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

        {/* Currency List — vertically restacked cards */}
        <div className="space-y-2">
          {filteredRates.map((rate) => {
            const changePercent = getChangePercent(rate.ratePerMobi, rate.previousRate);
            const isEditing = editingCode === rate.code;
            const isPositive = rate.ratePerMobi > rate.previousRate;
            const isNegative = rate.ratePerMobi < rate.previousRate;

            return (
              <div
                key={rate.code}
                className={`rounded-xl border bg-card p-3 ${
                  rate.isBase ? "border-amber-500/40 bg-amber-500/5" : "border-border/50"
                }`}
              >
                {/* Row 1: Flag + Code + Name + BASE badge */}
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-2xl leading-none">{rate.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">{rate.code}</span>
                      <span className="text-xs text-muted-foreground">—</span>
                      <span className="text-xs text-muted-foreground truncate">{rate.name}</span>
                      {rate.isBase && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500 text-amber-600 ml-auto shrink-0">
                          BASE
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/70">{rate.country}</p>
                  </div>
                </div>

                {/* Row 2: Rate value + trend + edit button — full width */}
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
                      {!rate.isBase && (
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
                      )}
                      {!rate.isBase && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 touch-manipulation active:scale-90"
                          onClick={() => handleStartEdit(rate.code, rate.ratePerMobi)}
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Row 3: Conversion preview — stacked vertically */}
                {!rate.isBase && !isEditing && (
                  <div className="mt-2 pt-2 border-t border-border/40 space-y-0.5">
                    <p className="text-xs text-muted-foreground">
                      M1,000 = {rate.code} {(rate.ratePerMobi * 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      M1,000,000 = {rate.code} {(rate.ratePerMobi * 1000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
