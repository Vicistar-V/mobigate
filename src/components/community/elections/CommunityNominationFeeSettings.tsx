import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Coins,
  Crown,
  Briefcase,
  Users,
  Info,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import {
  nominationFeeStructures,
  mobigateNominationConfig,
  communityNominationFeeOverrides,
  getEffectiveNominationFee,
  getMinimumNominationFee,
  setCommunityNominationFee,
  validateCommunityNominationFee,
  type CommunityFeePolicy,
} from "@/data/nominationFeesData";
import { formatMobi, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { LockableSetting } from "@/components/common/LockableSetting";

interface CommunityNominationFeeSettingsProps {
  /** Defaults to the demo community for the UI template. */
  communityId?: string;
  communityName?: string;
}

const POLICY_META: Record<
  CommunityFeePolicy,
  { label: string; tone: string; icon: typeof ShieldCheck; banner: string }
> = {
  enforce_minimum: {
    label: "System Minimum Enforced",
    tone: "text-emerald-700 bg-emerald-500/10 border-emerald-500/30",
    icon: ShieldCheck,
    banner:
      "Mobigate requires fees to be at least the system minimum for each office. You can raise them but not lower them.",
  },
  allow_below: {
    label: "Below-Minimum Allowed",
    tone: "text-amber-700 bg-amber-500/10 border-amber-500/30",
    icon: ShieldAlert,
    banner:
      "Mobigate currently lets communities set fees below the system minimum (down to the absolute floor).",
  },
  free_for_all: {
    label: "Communities Set Freely",
    tone: "text-fuchsia-700 bg-fuchsia-500/10 border-fuchsia-500/30",
    icon: Sparkles,
    banner:
      "Mobigate has waived its minimums — your community sets nomination fees freely for every office.",
  },
};

const categoryIcon = (cat: string) => {
  switch (cat) {
    case "executive":
      return <Crown className="h-4 w-4 text-amber-500" />;
    case "administrative":
      return <Briefcase className="h-4 w-4 text-blue-500" />;
    case "support":
      return <Users className="h-4 w-4 text-emerald-500" />;
    default:
      return <Coins className="h-4 w-4" />;
  }
};

interface OfficeRowProps {
  officeId: string;
  officeName: string;
  systemMin: number;
  currentValue: number;
  hasOverride: boolean;
  onSave: (officeId: string, value: number) => void;
  onReset: (officeId: string) => void;
  policy: CommunityFeePolicy;
}

function OfficeFeeRow({
  officeId,
  officeName,
  systemMin,
  currentValue,
  hasOverride,
  onSave,
  onReset,
  policy,
}: OfficeRowProps) {
  const [locked, setLocked] = useState(true);
  const [draft, setDraft] = useState<string>(String(currentValue));
  const [error, setError] = useState<string | null>(null);

  const numericDraft = Number(draft) || 0;
  const isBelowMin = numericDraft < systemMin;

  const handleToggle = (next: boolean) => {
    if (locked && !next) {
      setDraft(String(currentValue));
      setError(null);
      setLocked(false);
      return;
    }
    // Saving
    const validation = validateCommunityNominationFee(officeId, numericDraft);
    if (validation) {
      setError(validation);
      return;
    }
    onSave(officeId, numericDraft);
    setError(null);
    setLocked(true);
  };

  return (
    <LockableSetting
      label={officeName}
      description={
        hasOverride
          ? `Community-set · System minimum M${systemMin.toLocaleString()}`
          : `Using system minimum · M${systemMin.toLocaleString()}`
      }
      locked={locked}
      onLockedChange={handleToggle}
      displayValue={
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-foreground">
            {formatMobi(currentValue)}
          </span>
          {hasOverride && (
            <Badge variant="outline" className="text-[10px] h-4 px-1.5">
              Custom
            </Badge>
          )}
        </div>
      }
    >
      {(unlocked) => (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Nomination Fee (Mobi)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              M
            </span>
            <Input
              type="number"
              value={draft}
              disabled={!unlocked}
              onChange={(e) => {
                setDraft(e.target.value);
                setError(null);
              }}
              onBlur={(e) => {
                const v = Math.max(
                  mobigateNominationConfig.absoluteMinimumFee,
                  Number(e.target.value) || 0
                );
                setDraft(String(v));
              }}
              className="pl-8"
              min={mobigateNominationConfig.absoluteMinimumFee}
              step={500}
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">≈ Local equivalence</span>
            <span className="font-mono">
              {formatLocalAmount(numericDraft, "NGN")}
            </span>
          </div>

          {policy === "enforce_minimum" && isBelowMin && (
            <p className="text-[11px] text-destructive leading-snug">
              ⚠ Below system minimum (M{systemMin.toLocaleString()}). System
              policy will reject save.
            </p>
          )}
          {policy !== "enforce_minimum" && isBelowMin && (
            <p className="text-[11px] text-amber-600 leading-snug">
              Below system suggestion (M{systemMin.toLocaleString()}) — allowed
              under current policy.
            </p>
          )}
          {error && (
            <p className="text-[11px] text-destructive leading-snug">{error}</p>
          )}

          {hasOverride && unlocked && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => {
                onReset(officeId);
                setDraft(String(systemMin));
                setLocked(true);
              }}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset to System Minimum
            </Button>
          )}
        </div>
      )}
    </LockableSetting>
  );
}

export function CommunityNominationFeeSettings({
  communityId = "comm-current",
  communityName = "this community",
}: CommunityNominationFeeSettingsProps) {
  const { toast } = useToast();
  // Local mirror of overrides so the UI re-renders on change
  const [overrides, setOverrides] = useState<Record<string, number>>(
    () => ({ ...(communityNominationFeeOverrides[communityId] || {}) })
  );

  const policy = mobigateNominationConfig.communityFeePolicy;
  const PolicyIcon = POLICY_META[policy].icon;

  const grouped = useMemo(
    () => ({
      executive: nominationFeeStructures.filter((f) => f.category === "executive"),
      administrative: nominationFeeStructures.filter(
        (f) => f.category === "administrative"
      ),
      support: nominationFeeStructures.filter((f) => f.category === "support"),
    }),
    []
  );

  const handleSave = (officeId: string, value: number) => {
    setCommunityNominationFee(communityId, officeId, value);
    setOverrides((prev) => ({ ...prev, [officeId]: value }));
    const office = nominationFeeStructures.find((f) => f.officeId === officeId);
    toast({
      title: "Nomination Fee Updated",
      description: `${office?.officeName ?? "Office"} fee set to M${value.toLocaleString()} for ${communityName}.`,
    });
  };

  const handleReset = (officeId: string) => {
    if (communityNominationFeeOverrides[communityId]) {
      delete communityNominationFeeOverrides[communityId][officeId];
    }
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[officeId];
      return next;
    });
    toast({
      title: "Reverted to System Minimum",
      description: "Community will charge the Mobigate-set minimum for this office.",
    });
  };

  const customCount = Object.keys(overrides).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Coins className="h-5 w-5 text-primary" />
        <h2 className="font-bold text-lg">Community Nomination Fees</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Set the fee each candidate pays to declare interest in an elective
        office in <strong>{communityName}</strong>. Each office is lockable —
        unlock to edit, then save to re-lock.
      </p>

      {/* Policy banner from Mobigate */}
      <div
        className={`rounded-xl border-2 p-3 flex items-start gap-2.5 ${POLICY_META[policy].tone}`}
      >
        <PolicyIcon className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-xs font-bold">
            Mobigate Policy: {POLICY_META[policy].label}
          </p>
          <p className="text-[11px] leading-snug mt-0.5 opacity-90">
            {POLICY_META[policy].banner}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-2.5 text-center">
            <p className="text-lg font-bold text-foreground">
              {nominationFeeStructures.length}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Total Offices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5 text-center">
            <p className="text-lg font-bold text-primary">{customCount}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Community-Set
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Office list */}
      <Card>
        <CardHeader className="pb-2 px-3">
          <CardTitle className="text-base">Per-Office Fees</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Accordion type="single" collapsible defaultValue="executive">
            {(Object.entries(grouped) as [string, typeof nominationFeeStructures][]).map(
              ([category, list]) => (
                <AccordionItem key={category} value={category} className="border-0">
                  <AccordionTrigger className="px-3 py-3 hover:no-underline hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      {categoryIcon(category)}
                      <span className="capitalize font-medium">
                        {category} Positions
                      </span>
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {list.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3 space-y-3">
                    {list.map((office) => {
                      const systemMin = getMinimumNominationFee(office.officeId);
                      const hasOverride =
                        overrides[office.officeId] !== undefined;
                      const currentValue = hasOverride
                        ? overrides[office.officeId]
                        : getEffectiveNominationFee(office.officeId, communityId);
                      return (
                        <OfficeFeeRow
                          key={office.officeId}
                          officeId={office.officeId}
                          officeName={office.officeName}
                          systemMin={systemMin}
                          currentValue={currentValue}
                          hasOverride={hasOverride}
                          policy={policy}
                          onSave={handleSave}
                          onReset={handleReset}
                        />
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              )
            )}
          </Accordion>
        </CardContent>
      </Card>

      {/* Notes */}
      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>How fees flow:</strong> The candidate's wallet is debited
            the nomination fee plus the unified Service Charge / Processing
            Fee. The Community Wallet is also debited that same Service Charge
            (paid once per side).
          </p>
          <p>
            <strong>Mobigate minimums</strong> protect the platform from being
            undercut. If the policy is set to <em>Enforce</em>, you cannot save
            a fee below the system value. Each setting must be unlocked before
            it can be edited.
          </p>
        </div>
      </div>
    </div>
  );
}
