import { Globe2, Users, UserPlus, Lock, UserMinus, UsersRound, Settings2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Audience Privacy Selector
 * ─────────────────────────
 * Reusable audience-visibility picker for any user-generated content
 * (Posts, Photos, Albums, Wall Status, Comments, etc).
 *
 * Audiences:
 *   • public       — Everyone on Mobigate
 *   • friends      — Only confirmed Friends
 *   • connections  — Friends + Followers + Following (wider social ring)
 *   • private      — Only Me (vault / self-archive)
 *   • custom       — Manually specify who can see (allow-list)
 *
 * On top of the chosen audience, the user can optionally provide an
 * EXCLUDE list (people who must NOT see this content even if they fall
 * within the chosen audience).
 */

export type AudienceKey = "public" | "friends" | "connections" | "private" | "custom";

export interface AudienceValue {
  audience: AudienceKey;
  /** Comma-separated list of users/handles to exclude (applies when audience is not 'private'/'custom'). */
  excludeList: string;
  /** Comma-separated allow-list of users/handles (applies only when audience === 'custom'). */
  includeList: string;
}

export const DEFAULT_AUDIENCE_VALUE: AudienceValue = {
  audience: "public",
  excludeList: "",
  includeList: "",
};

interface OptionMeta {
  key:   AudienceKey;
  label: string;
  hint:  string;
  Icon:  React.ComponentType<{ className?: string }>;
  tint:  string;   // tailwind classes for the icon chip
}

const OPTIONS: OptionMeta[] = [
  { key: "public",      label: "Public",            hint: "Everyone on Mobigate can see this",          Icon: Globe2,      tint: "bg-sky-100 text-sky-700" },
  { key: "friends",     label: "Friends Only",      hint: "Only your confirmed Friends",                Icon: Users,       tint: "bg-emerald-100 text-emerald-700" },
  { key: "connections", label: "Other Connections", hint: "Friends, Followers & Following",             Icon: UsersRound,  tint: "bg-indigo-100 text-indigo-700" },
  { key: "private",     label: "Private (Only Me)", hint: "Saved for your eyes only",                   Icon: Lock,        tint: "bg-amber-100 text-amber-700" },
  { key: "custom",      label: "Custom List",       hint: "Specify exactly who can see",                Icon: Settings2,   tint: "bg-fuchsia-100 text-fuchsia-700" },
];

interface AudiencePrivacySelectorProps {
  value: AudienceValue;
  onChange: (v: AudienceValue) => void;
  /** Heading label rendered above the picker. */
  label?: string;
  /** Optional helper text under the heading. */
  description?: string;
  className?: string;
}

export const AudiencePrivacySelector = ({
  value,
  onChange,
  label = "Audience Privacy",
  description = "Choose who can see this content. You can also exclude specific people.",
  className,
}: AudiencePrivacySelectorProps) => {
  const set = (patch: Partial<AudienceValue>) => onChange({ ...value, ...patch });

  const canExclude = value.audience !== "private" && value.audience !== "custom";
  const isCustom   = value.audience === "custom";

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="space-y-0.5">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Globe2 className="h-4 w-4 text-primary" />
          {label}
        </Label>
        {description && (
          <p className="text-[11px] text-muted-foreground leading-snug">{description}</p>
        )}
      </div>

      {/* Audience pills — wrap-grid for mobile friendliness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {OPTIONS.map(opt => {
          const active = value.audience === opt.key;
          const Icon = opt.Icon;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => set({ audience: opt.key })}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all touch-manipulation",
                active
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
              )}
            >
              <span className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", opt.tint)}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold leading-tight">{opt.label}</span>
                <span className="block text-[11px] text-muted-foreground leading-snug mt-0.5">
                  {opt.hint}
                </span>
              </span>
              <span
                className={cn(
                  "h-4 w-4 rounded-full border-2 shrink-0 mt-0.5",
                  active ? "border-primary bg-primary" : "border-muted-foreground/30",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Custom allow-list */}
      {isCustom && (
        <div className="space-y-1.5 rounded-lg border border-fuchsia-200 bg-fuchsia-50/60 p-2.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-fuchsia-700">
            <UserPlus className="h-3.5 w-3.5" />
            Allow-list — people who CAN see
          </Label>
          <Textarea
            value={value.includeList}
            onChange={e => set({ includeList: e.target.value })}
            placeholder="@username, Full Name, another@handle…"
            rows={2}
            className="text-sm bg-white"
          />
          <p className="text-[10px] text-fuchsia-700/80">
            Separate with commas. Only these people will be able to see the content.
          </p>
        </div>
      )}

      {/* Exclude list (only meaningful for public / friends / connections) */}
      {canExclude && (
        <div className="space-y-1.5 rounded-lg border border-rose-200 bg-rose-50/60 p-2.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
            <UserMinus className="h-3.5 w-3.5" />
            Exclude — people who must NOT see <span className="font-normal text-rose-600/70">(optional)</span>
          </Label>
          <Textarea
            value={value.excludeList}
            onChange={e => set({ excludeList: e.target.value })}
            placeholder="@username, Full Name…"
            rows={2}
            className="text-sm bg-white"
          />
          <p className="text-[10px] text-rose-700/80">
            Separate with commas. These users are hidden from this content even if they're in the chosen audience.
          </p>
        </div>
      )}
    </div>
  );
};

/** Helper to flatten an AudienceValue into FormData-friendly entries. */
export function appendAudienceToFormData(form: FormData, v: AudienceValue, prefix = "audience") {
  form.append(`${prefix}`,              v.audience);
  form.append(`${prefix}_exclude`,      v.excludeList.trim());
  form.append(`${prefix}_include`,      v.includeList.trim());
}
