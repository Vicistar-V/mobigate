import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Shield, Users, BookOpen, UserPlus, CreditCard,
  ChevronDown, ChevronUp, Lock, Unlock, ShieldCheck, Eye, EyeOff, Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  platformEligibilitySettings,
  setEligibilitySetting,
  type PlatformEligibilitySettings,
} from "@/data/platformSettingsData";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

interface FieldConfig {
  key: keyof PlatformEligibilitySettings;
  label: string;
  icon: React.ElementType;
  format?: "currency" | "number" | "days";
  step: number;
}

const FIELDS: FieldConfig[] = [
  { key: "verifiedDays", label: "Verified Days", icon: Shield, format: "days", step: 10 },
  { key: "invitedFriends", label: "Invited Friends", icon: Users, step: 100 },
  { key: "friends", label: "Friends", icon: Users, step: 500 },
  { key: "followers", label: "Followers", icon: Users, step: 500 },
  { key: "eLibraryContents", label: "E-Library Contents", icon: BookOpen, step: 10 },
  { key: "contentLikes", label: "Content Likes (min per item)", icon: BookOpen, step: 500 },
  { key: "usersFollowed", label: "Users Followed", icon: UserPlus, step: 50 },
  { key: "registrationFee", label: "Registration Fee", icon: CreditCard, format: "currency", step: 50000 },
  { key: "imvsdAmount", label: "IMVSD Amount", icon: CreditCard, format: "currency", step: 50000 },
];

export function EligibilitySettingsCard() {
  const s = platformEligibilitySettings;
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(FIELDS.map(f => [f.key, s[f.key] as number]))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [locks, setLocks] = useState<Record<string, boolean>>(
    Object.fromEntries(FIELDS.map(f => [f.key, true]))
  );
  const passwordRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const toggleLock = (key: string) => setLocks(prev => ({ ...prev, [key]: !prev[key] }));

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
    toast({ title: "Access granted", description: "Eligibility settings unlocked" });
  };

  const hasChanges = FIELDS.some(f => values[f.key] !== (s[f.key] as number));

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    FIELDS.forEach(f => {
      setEligibilitySetting(f.key, values[f.key]);
    });
    setIsSaving(false);
    toast({ title: "Eligibility Settings Updated", description: "All thresholds have been saved" });
  };

  const formatVal = (v: number, format?: string) => {
    if (format === "currency") return `M${v.toLocaleString()}`;
    if (format === "days") return `${v} days`;
    return v.toLocaleString();
  };

  const summaryText = `${s.verifiedDays} days · ${(s.friends as number).toLocaleString()} friends · M${(s.registrationFee as number).toLocaleString()} fee`;

  return (
    <div className="space-y-2">
      <Collapsible open={isOpen} onOpenChange={() => {}}>
        <button
          onClick={handleToggleOpen}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card touch-manipulation active:scale-[0.98]"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            {isAuthenticated ? <ShieldCheck className="h-5 w-5 text-emerald-500" /> : <Shield className="h-5 w-5 text-primary" />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-foreground">Eligibility Requirements</p>
            <p className="text-xs text-muted-foreground">{summaryText}</p>
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
          <div className="mt-2 rounded-xl border border-border/50 bg-card p-4 space-y-4">
            {FIELDS.map((field) => {
              const minKey = `${field.key}Min` as keyof PlatformEligibilitySettings;
              const maxKey = `${field.key}Max` as keyof PlatformEligibilitySettings;
              const min = s[minKey] as number;
              const max = s[maxKey] as number;
              const isLocked = locks[field.key];
              const Icon = field.icon;

              return (
                <div key={field.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleLock(field.key)} className="touch-manipulation active:scale-[0.9]">
                        {isLocked ? <Lock className="h-3.5 w-3.5 text-destructive" /> : <Unlock className="h-3.5 w-3.5 text-emerald-500" />}
                      </button>
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-xs font-medium text-foreground">{field.label}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">{formatVal(values[field.key], field.format)}</Badge>
                  </div>
                  {!isLocked ? (
                    <div className="flex items-center gap-2 pl-6">
                      {field.format === "currency" && <span className="text-xs text-muted-foreground font-medium">M</span>}
                      <Input
                        type="number"
                        value={values[field.key]}
                        onChange={e => {
                          const raw = e.target.value;
                          if (raw === "") return;
                          setValues(prev => ({ ...prev, [field.key]: Number(raw) }));
                        }}
                        onBlur={() => {
                          const v = Math.max(min, Math.min(max, values[field.key]));
                          setValues(prev => ({ ...prev, [field.key]: v }));
                        }}
                        className="h-11 text-sm font-bold flex-1"
                        min={min}
                        max={max}
                        step={1}
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground pl-6">
                      Range: {formatVal(min, field.format)} – {formatVal(max, field.format)}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Info note */}
            <div className="flex gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                These thresholds determine the minimum requirements a user must meet to be eligible for merchant status. Changes apply platform-wide.
              </p>
            </div>

            {/* Save */}
            {hasChanges ? (
              <Button onClick={handleSave} disabled={isSaving} className="w-full h-11 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]">
                {isSaving ? "Updating..." : "Update Eligibility Thresholds"}
              </Button>
            ) : (
              <div className="text-center py-1">
                <p className="text-xs text-muted-foreground">Eligibility thresholds are up to date</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}