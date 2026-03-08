import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreditCard, ChevronDown, ChevronUp, Lock, Unlock, ShieldCheck, Eye, EyeOff, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  platformMerchantAppFeeSettings,
  setApplicationFee,
  setWaiverFee,
} from "@/data/platformSettingsData";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

export function MerchantAppFeeSettingsCard() {
  const s = platformMerchantAppFeeSettings;
  const [appFee, setAppFeeLocal] = useState(s.applicationFee);
  const [waiver, setWaiverLocal] = useState(s.waiverFee);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [locks, setLocks] = useState({ appFee: true, waiver: true });
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
    if (isAuthenticated) { setIsOpen(true); return; }
    setShowPasswordInput(true);
    setTimeout(() => passwordRef.current?.focus(), 100);
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) return;
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 600));
    setIsAuthenticated(true);
    setIsOpen(true);
    setShowPasswordInput(false);
    setPassword("");
    setIsVerifying(false);
    toast({ title: "Access granted", description: "Fee settings unlocked" });
  };

  const hasChanges = appFee !== s.applicationFee || waiver !== s.waiverFee;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setApplicationFee(appFee);
    setWaiverFee(waiver);
    setIsSaving(false);
    toast({
      title: "Fee Settings Updated",
      description: `App Fee: M${appFee.toLocaleString()} · Waiver: M${waiver.toLocaleString()}`,
    });
  };

  const formatM = (v: number) => `M${v.toLocaleString()}`;

  return (
    <div className="space-y-2">
      <Collapsible open={isOpen} onOpenChange={() => {}}>
        <button
          onClick={handleToggleOpen}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card touch-manipulation active:scale-[0.98]"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            {isAuthenticated ? <ShieldCheck className="h-5 w-5 text-emerald-500" /> : <CreditCard className="h-5 w-5 text-primary" />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-foreground">Merchant Application Fees</p>
            <p className="text-xs text-muted-foreground">
              App Fee: {formatM(s.applicationFee)} · Waiver: {formatM(s.waiverFee)}
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
          <div className="mt-2 rounded-xl border border-border/50 bg-card p-4 space-y-3">
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
              <Button variant="outline" onClick={() => { setShowPasswordInput(false); setPassword(""); }} className="flex-1 h-10 rounded-xl text-xs" disabled={isVerifying}>
                Cancel
              </Button>
              <Button onClick={handlePasswordSubmit} disabled={isVerifying || !password.trim()} className="flex-1 h-10 rounded-xl text-xs">
                {isVerifying ? "Verifying..." : "Unlock"}
              </Button>
            </div>
          </div>
        )}

        <CollapsibleContent>
          <div className="mt-2 rounded-xl border border-border/50 bg-card p-4 space-y-5">
            {/* Application Fee */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleLock('appFee')} className="touch-manipulation active:scale-[0.9]">
                    {locks.appFee ? <Lock className="h-3.5 w-3.5 text-destructive" /> : <Unlock className="h-3.5 w-3.5 text-emerald-500" />}
                  </button>
                  <p className="text-xs font-medium text-foreground">Application Fee</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs">{formatM(appFee)}</Badge>
              </div>
              {!locks.appFee ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">M</span>
                  <Input
                    type="number"
                    value={appFee}
                    onChange={e => {
                      const v = Math.max(s.applicationFeeMin, Math.min(s.applicationFeeMax, Number(e.target.value) || s.applicationFeeMin));
                      setAppFeeLocal(v);
                    }}
                    className="h-11 text-sm font-bold flex-1"
                    min={s.applicationFeeMin}
                    max={s.applicationFeeMax}
                    step={5000}
                  />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Fee charged for merchant application submission. Range: {formatM(s.applicationFeeMin)} – {formatM(s.applicationFeeMax)}
                </p>
              )}
            </div>

            {/* Waiver Fee */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleLock('waiver')} className="touch-manipulation active:scale-[0.9]">
                    {locks.waiver ? <Lock className="h-3.5 w-3.5 text-destructive" /> : <Unlock className="h-3.5 w-3.5 text-emerald-500" />}
                  </button>
                  <p className="text-xs font-medium text-foreground">Waiver Request Fee</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs">{formatM(waiver)}</Badge>
              </div>
              {!locks.waiver ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">M</span>
                  <Input
                    type="number"
                    value={waiver}
                    onChange={e => {
                      const v = Math.max(s.waiverFeeMin, Math.min(s.waiverFeeMax, Number(e.target.value) || s.waiverFeeMin));
                      setWaiverLocal(v);
                    }}
                    className="h-11 text-sm font-bold flex-1"
                    min={s.waiverFeeMin}
                    max={s.waiverFeeMax}
                    step={5000}
                  />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Additional fee when applicant requests a waiver. Range: {formatM(s.waiverFeeMin)} – {formatM(s.waiverFeeMax)}
                </p>
              )}
            </div>

            {/* Total preview */}
            <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <p><strong>Standard Application:</strong> {formatM(appFee)}</p>
                  <p><strong>With Waiver Request:</strong> {formatM(appFee + waiver)}</p>
                </div>
              </div>
            </div>

            {/* Save */}
            {hasChanges ? (
              <Button onClick={handleSave} disabled={isSaving} className="w-full h-11 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]">
                {isSaving ? "Updating..." : "Update Application Fees"}
              </Button>
            ) : (
              <div className="text-center py-1">
                <p className="text-xs text-muted-foreground">Application fees are up to date</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}