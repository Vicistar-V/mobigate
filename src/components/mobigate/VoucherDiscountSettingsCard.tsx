import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Percent, Info, ChevronDown, ChevronUp, Lock, Unlock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  platformVoucherDiscountSettings,
  setTierSize,
  setBaseRate,
  setIncrementRate,
  setMaxDiscount,
} from "@/data/platformSettingsData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

function computePreview(tierSize: number, baseRate: number, incrementRate: number, maxDisc: number) {
  const tiers: Array<{ tier: number; rangeStart: number; rangeEnd: number; discountPercent: number }> = [];
  let t = 1;
  while (true) {
    const raw = baseRate + (t - 1) * incrementRate;
    const disc = Math.min(Math.round(raw * 100) / 100, maxDisc);
    tiers.push({ tier: t, rangeStart: (t - 1) * tierSize + 1, rangeEnd: t * tierSize, discountPercent: disc });
    if (disc >= maxDisc) break;
    t++;
    if (t > 100) break;
  }
  return tiers;
}

const ADMIN_PASSWORD = "admin123";

export function VoucherDiscountSettingsCard() {
  const s = platformVoucherDiscountSettings;
  const [tierSize, setTierSizeLocal] = useState(s.tierSize);
  const [baseRate, setBaseRateLocal] = useState(s.baseRate);
  const [incrementRate, setIncrementRateLocal] = useState(s.incrementRate);
  const [maxDiscountVal, setMaxDiscountLocal] = useState(s.maxDiscount);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [shake, setShake] = useState(false);
  const [locks, setLocks] = useState({ tierSize: true, baseRate: true, incrementRate: true, maxDiscount: true });
  const passwordRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const toggleLock = (key: keyof typeof locks) => setLocks(prev => ({ ...prev, [key]: !prev[key] }));

  const handleToggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsAuthenticated(false);
      setShowPasswordInput(false);
      setPassword("");
      return;
    }
    if (isAuthenticated) {
      setIsOpen(true);
      return;
    }
    setShowPasswordInput(true);
    setTimeout(() => passwordRef.current?.focus(), 100);
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) return;
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 600));
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setIsOpen(true);
      setShowPasswordInput(false);
      setPassword("");
      setIsVerifying(false);
      toast({ title: "Access granted", description: "Settings unlocked" });
    } else {
      setIsVerifying(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast({ title: "Access denied", description: "Incorrect password", variant: "destructive" });
      setPassword("");
      passwordRef.current?.focus();
    }
  };

  const hasChanges =
    tierSize !== s.tierSize ||
    baseRate !== s.baseRate ||
    incrementRate !== s.incrementRate ||
    maxDiscountVal !== s.maxDiscount;

  const preview = computePreview(tierSize, baseRate, incrementRate, maxDiscountVal);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setTierSize(tierSize);
    setBaseRate(baseRate);
    setIncrementRate(incrementRate);
    setMaxDiscount(maxDiscountVal);
    setIsSaving(false);
    toast({
      title: "Discount Tiers Updated",
      description: `${preview.length} tiers configured, max ${maxDiscountVal.toFixed(1)}%`,
    });
  };

  return (
    <div className="space-y-2">
      <Collapsible open={isOpen} onOpenChange={() => {}}>
        <button 
          onClick={handleToggleOpen}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card touch-manipulation active:scale-[0.98]"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            {isAuthenticated ? <ShieldCheck className="h-5 w-5 text-emerald-500" /> : <Percent className="h-5 w-5 text-primary" />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-foreground">Voucher Bulk Discount</p>
            <p className="text-xs text-muted-foreground">
              {s.baseRate.toFixed(1)}% base, +{s.incrementRate.toFixed(1)}%/tier, max {s.maxDiscount.toFixed(1)}%
            </p>
          </div>
          {hasChanges && (
            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 mr-1">
              Modified
            </Badge>
          )}
          {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
        </button>

        {/* Password gate */}
        {showPasswordInput && !isAuthenticated && (
          <div className={`mt-2 rounded-xl border border-border/50 bg-card p-4 space-y-3 ${shake ? 'animate-shake' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Enter admin password to access settings</p>
            </div>
            <div className="relative">
              <Input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                className="pr-10 h-11"
                disabled={isVerifying}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground touch-manipulation"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => { setShowPasswordInput(false); setPassword(""); }}
                className="flex-1 h-10 rounded-xl text-xs"
                disabled={isVerifying}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                disabled={isVerifying || !password.trim()}
                className="flex-1 h-10 rounded-xl text-xs"
              >
                {isVerifying ? "Verifying..." : "Unlock"}
              </Button>
            </div>
          </div>
        )}
      <CollapsibleContent>
        <div className="mt-2 rounded-xl border border-border/50 bg-card p-4 space-y-5">
          {/* Tier Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => toggleLock('tierSize')} className="touch-manipulation active:scale-[0.9]">
                  {locks.tierSize ? <Lock className="h-3.5 w-3.5 text-destructive" /> : <Unlock className="h-3.5 w-3.5 text-emerald-500" />}
                </button>
                <p className="text-xs font-medium text-foreground">Bundles Per Tier</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">{tierSize}</Badge>
            </div>
            <Slider
              value={[tierSize]}
              onValueChange={([v]) => !locks.tierSize && setTierSizeLocal(v)}
              min={s.tierSizeMin}
              max={s.tierSizeMax}
              step={1}
              className={`w-full ${locks.tierSize ? 'opacity-50 pointer-events-none' : ''}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{s.tierSizeMin}</span>
              <span>{s.tierSizeMax}</span>
            </div>
          </div>

          {/* Base Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => toggleLock('baseRate')} className="touch-manipulation active:scale-[0.9]">
                  {locks.baseRate ? <Lock className="h-3.5 w-3.5 text-destructive" /> : <Unlock className="h-3.5 w-3.5 text-emerald-500" />}
                </button>
                <p className="text-xs font-medium text-foreground">Base Rate (1st Tier)</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">{baseRate.toFixed(1)}%</Badge>
            </div>
            <Slider
              value={[baseRate * 10]}
              onValueChange={([v]) => !locks.baseRate && setBaseRateLocal(Math.round(v) / 10)}
              min={s.baseRateMin * 10}
              max={s.baseRateMax * 10}
              step={5}
              className={`w-full ${locks.baseRate ? 'opacity-50 pointer-events-none' : ''}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{s.baseRateMin.toFixed(1)}%</span>
              <span>{s.baseRateMax.toFixed(1)}%</span>
            </div>
          </div>

          {/* Increment Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => toggleLock('incrementRate')} className="touch-manipulation active:scale-[0.9]">
                  {locks.incrementRate ? <Lock className="h-3.5 w-3.5 text-destructive" /> : <Unlock className="h-3.5 w-3.5 text-emerald-500" />}
                </button>
                <p className="text-xs font-medium text-foreground">Increment Per Tier</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">+{incrementRate.toFixed(1)}%</Badge>
            </div>
            <Slider
              value={[incrementRate * 100]}
              onValueChange={([v]) => !locks.incrementRate && setIncrementRateLocal(Math.round(v) / 100)}
              min={s.incrementRateMin * 100}
              max={s.incrementRateMax * 100}
              step={25}
              className={`w-full ${locks.incrementRate ? 'opacity-50 pointer-events-none' : ''}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{s.incrementRateMin.toFixed(1)}%</span>
              <span>{s.incrementRateMax.toFixed(1)}%</span>
            </div>
          </div>

          {/* Max Discount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => toggleLock('maxDiscount')} className="touch-manipulation active:scale-[0.9]">
                  {locks.maxDiscount ? <Lock className="h-3.5 w-3.5 text-destructive" /> : <Unlock className="h-3.5 w-3.5 text-emerald-500" />}
                </button>
                <p className="text-xs font-medium text-foreground">Max Discount Cap</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">{maxDiscountVal.toFixed(1)}%</Badge>
            </div>
            <Slider
              value={[maxDiscountVal]}
              onValueChange={([v]) => !locks.maxDiscount && setMaxDiscountLocal(v)}
              min={s.maxDiscountMin}
              max={s.maxDiscountMax}
              step={5}
              className={`w-full ${locks.maxDiscount ? 'opacity-50 pointer-events-none' : ''}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{s.maxDiscountMin.toFixed(1)}%</span>
              <span>{s.maxDiscountMax.toFixed(1)}%</span>
            </div>
          </div>

          {/* Tier Preview Table */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tier Preview</p>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="grid grid-cols-3 gap-0 bg-muted/50 px-3 py-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Tier</span>
                <span className="text-xs font-semibold text-muted-foreground">Bundles</span>
                <span className="text-xs font-semibold text-muted-foreground text-right">Discount</span>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {preview.map((t) => (
                  <div key={t.tier} className="grid grid-cols-3 gap-0 px-3 py-1.5 border-t border-border/30">
                    <span className="text-xs text-foreground font-medium">Tier {t.tier}</span>
                    <span className="text-xs text-muted-foreground">{t.rangeStart}–{t.rangeEnd}</span>
                    <span className="text-xs text-emerald-600 font-bold text-right">{t.discountPercent.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info note */}
          <div className="flex gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every <strong>{tierSize}</strong> bundles form a tier. Tier 1 gets <strong>{baseRate.toFixed(1)}%</strong>, each subsequent tier adds <strong>{incrementRate.toFixed(1)}%</strong>, capped at <strong>{maxDiscountVal.toFixed(1)}%</strong>.
            </p>
          </div>

          {/* Save button */}
          {hasChanges ? (
            <Button onClick={handleSave} disabled={isSaving} className="w-full h-11 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]">
              {isSaving ? "Updating..." : "Update Discount Tiers"}
            </Button>
          ) : (
            <div className="text-center py-1">
              <p className="text-xs text-muted-foreground">Discount tiers are up to date</p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
    </div>
  );
}
