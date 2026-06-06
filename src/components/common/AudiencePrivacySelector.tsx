import { useState } from "react";
import {
  Globe2, Users, UserPlus, UsersRound, Heart, Building2,
  GraduationCap, MapPin, CalendarRange, ChevronDown, Check,
} from "lucide-react";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { ExclusionPicker, type ExcludedUser } from "@/components/common/ExclusionPicker";
import { CascadingLocationSelector } from "@/components/common/CascadingLocationSelector";

/**
 * Audience Privacy Selector  (Expanded)
 * ─────────────────────────────────────
 * Reusable audience-visibility picker for any user-generated content
 * (Posts, Photos, Albums, Wall Status, Comments, etc).
 *
 * MULTIPLE SELECTION is allowed. Picking "Public" covers all selections.
 *
 * Audiences:
 *   • public      — All Public Users (everyone on Mobiface)
 *   • friends     — Only Friends
 *   • family      — Family Relations
 *   • connections — Followers, Following, Likes, Messaging/Chat, Fundraiser…
 *   • community   — Same Community Members
 *   • lifemates   — Class-Mates, School-Mates, Age-Mates, Work Colleagues
 *   • locations   — Country / State / LGA / City / Town (configurable)
 *   • agelimits   — Age bands (10-17 … 70+)
 *
 * Every audience can carry its own EXCLUSION list — specific individuals who
 * must NOT see the content even if they fall inside that audience.
 */

export type AudienceKey =
  | "public" | "friends" | "family" | "connections"
  | "community" | "lifemates" | "locations" | "agelimits";

export const AGE_BANDS = [
  "10 - 17", "18 - 30", "31 - 40", "41 - 50", "51 - 60", "61 - 70", "70+",
] as const;

export const LIFE_MATE_GROUPS = [
  "Class-Mates", "School-Mates", "Age-Mates", "Work Colleagues",
] as const;

export interface AudienceValue {
  /** Multi-select list of granted audiences. 'public' overrides all others. */
  selected: AudienceKey[];
  /** Per-audience exclusion lists. */
  exclusions: Partial<Record<AudienceKey, ExcludedUser[]>>;
  /** Location targeting (only meaningful when 'locations' is selected). */
  locations: { country: string; state: string; lga: string; city: string; town: string };
  /** Selected age bands (only meaningful when 'agelimits' is selected). */
  ageLimits: string[];
  /** Selected Life-Mate groups (only meaningful when 'lifemates' is selected). */
  lifeMates: string[];
}

export const DEFAULT_AUDIENCE_VALUE: AudienceValue = {
  selected: ["public"],
  exclusions: {},
  locations: { country: "", state: "", lga: "", city: "", town: "" },
  ageLimits: [],
  lifeMates: [],
};

interface OptionMeta {
  key:   AudienceKey;
  label: string;
  hint:  string;
  Icon:  React.ComponentType<{ className?: string }>;
  tint:  string;
}

const OPTIONS: OptionMeta[] = [
  { key: "public",      label: "Public",      hint: "All public users on Mobiface",                         Icon: Globe2,        tint: "bg-sky-100 text-sky-700" },
  { key: "friends",     label: "Friends",     hint: "Only your Friends",                                    Icon: Users,         tint: "bg-emerald-100 text-emerald-700" },
  { key: "family",      label: "Family",      hint: "Family relations",                                     Icon: Heart,         tint: "bg-pink-100 text-pink-700" },
  { key: "connections", label: "Connections", hint: "Followers, Following, Likes, Chat, Fundraiser…",       Icon: UsersRound,    tint: "bg-indigo-100 text-indigo-700" },
  { key: "community",   label: "Community",   hint: "Same community members",                               Icon: Building2,     tint: "bg-violet-100 text-violet-700" },
  { key: "lifemates",   label: "Life-Mates",  hint: "Class-Mates, School-Mates, Age-Mates, Colleagues",     Icon: GraduationCap, tint: "bg-amber-100 text-amber-700" },
  { key: "locations",   label: "Locations",   hint: "Country / State / LGA / City / Town",                  Icon: MapPin,        tint: "bg-teal-100 text-teal-700" },
  { key: "agelimits",   label: "Age-Limits",  hint: "Target specific age groups",                           Icon: CalendarRange, tint: "bg-rose-100 text-rose-700" },
];

interface AudiencePrivacySelectorProps {
  value: AudienceValue;
  onChange: (v: AudienceValue) => void;
  label?: string;
  description?: string;
  className?: string;
}

export const AudiencePrivacySelector = ({
  value,
  onChange,
  label = "Audience Privacy",
  description = "Choose who can see this content. Multiple selections are allowed — 'Public' covers everyone.",
  className,
}: AudiencePrivacySelectorProps) => {
  const [expanded, setExpanded] = useState<AudienceKey | null>(null);

  const set = (patch: Partial<AudienceValue>) => onChange({ ...value, ...patch });

  const publicAll = value.selected.includes("public");

  const toggleAudience = (key: AudienceKey) => {
    let next: AudienceKey[];
    if (key === "public") {
      // Selecting Public collapses everything to just Public; toggling off clears it.
      next = value.selected.includes("public") ? [] : ["public"];
    } else {
      const without = value.selected.filter(k => k !== "public");
      next = without.includes(key) ? without.filter(k => k !== key) : [...without, key];
    }
    set({ selected: next });
    if (next.includes(key) && key !== "public") setExpanded(key);
  };

  const setExclusion = (key: AudienceKey, list: ExcludedUser[]) =>
    set({ exclusions: { ...value.exclusions, [key]: list } });

  const toggleAgeBand = (band: string) => {
    const next = value.ageLimits.includes(band)
      ? value.ageLimits.filter(b => b !== band)
      : [...value.ageLimits, band];
    set({ ageLimits: next });
  };

  const toggleLifeMate = (group: string) => {
    const next = value.lifeMates.includes(group)
      ? value.lifeMates.filter(g => g !== group)
      : [...value.lifeMates, group];
    set({ lifeMates: next });
  };

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

      {publicAll && (
        <div className="rounded-lg border border-sky-200 bg-sky-50/70 px-3 py-2 text-[11px] text-sky-700">
          <span className="font-semibold">Public is on.</span> Everyone can see this content. You can still exclude specific people below.
        </div>
      )}

      {/* Audience cards (multi-select) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {OPTIONS.map(opt => {
          const active = value.selected.includes(opt.key);
          const Icon = opt.Icon;
          const isExpanded = expanded === opt.key;
          const exCount = value.exclusions[opt.key]?.length || 0;
          return (
            <div key={opt.key} className="space-y-2">
              <button
                type="button"
                onClick={() => toggleAudience(opt.key)}
                className={cn(
                  "w-full flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all touch-manipulation",
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
                  {exCount > 0 && (
                    <span className="inline-block mt-1 text-[10px] font-medium text-rose-600">
                      {exCount} excluded
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "h-4 w-4 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30",
                  )}
                >
                  {active && <Check className="h-3 w-3" />}
                </span>
              </button>

              {/* Inline config + exclusion (only for active audiences) */}
              {active && (
                <div className="rounded-xl border border-dashed border-rose-200 bg-rose-50/40 p-2.5 space-y-2.5">
                  {/* Locations config — cascading Country → Region → County → City */}
                  {opt.key === "locations" && (
                    <CascadingLocationSelector
                      value={value.locations}
                      onChange={(loc) => set({ locations: loc })}
                      compact
                      hideHeader
                    />
                  )}

                  {/* Life-Mates config — independent groups */}
                  {opt.key === "lifemates" && (
                    <div className="flex flex-wrap gap-1.5">
                      {LIFE_MATE_GROUPS.map(group => {
                        const on = value.lifeMates.includes(group);
                        return (
                          <button
                            key={group}
                            type="button"
                            onClick={() => toggleLifeMate(group)}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors",
                              on
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-white text-muted-foreground border-border hover:border-primary/40",
                            )}
                          >
                            {group}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Age-limits config */}
                  {opt.key === "agelimits" && (
                    <div className="flex flex-wrap gap-1.5">
                      {AGE_BANDS.map(band => {
                        const on = value.ageLimits.includes(band);
                        return (
                          <button
                            key={band}
                            type="button"
                            onClick={() => toggleAgeBand(band)}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors",
                              on
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-white text-muted-foreground border-border hover:border-primary/40",
                            )}
                          >
                            {band}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Exclusion accordion */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : opt.key)}
                      className="w-full flex items-center justify-between text-[11px] font-semibold text-rose-700"
                    >
                      <span>Exclusion {exCount > 0 ? `(${exCount})` : ""}</span>
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-180")} />
                    </button>
                    {isExpanded && (
                      <div className="mt-2">
                        <ExclusionPicker
                          value={value.exclusions[opt.key] || []}
                          onChange={list => setExclusion(opt.key, list)}
                          compact
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Helper to flatten an AudienceValue into FormData-friendly entries. */
export function appendAudienceToFormData(form: FormData, v: AudienceValue, prefix = "audience") {
  // Multi-select audiences
  form.append(`${prefix}`, v.selected.join(","));
  v.selected.forEach(k => form.append(`${prefix}[]`, k));

  // Per-audience exclusions as JSON (ids + raw entries for backend resolution)
  const exclusions: Record<string, Array<{ id?: string; label: string; via: string }>> = {};
  Object.entries(v.exclusions).forEach(([key, list]) => {
    if (list && list.length) {
      exclusions[key] = list.map(u => ({ id: u.id, label: u.label, via: u.via }));
    }
  });
  form.append(`${prefix}_exclusions`, JSON.stringify(exclusions));

  // Location targeting
  if (v.selected.includes("locations")) {
    form.append(`${prefix}_locations`, JSON.stringify(v.locations));
  }

  // Age-limit targeting
  if (v.selected.includes("agelimits")) {
    form.append(`${prefix}_age_limits`, v.ageLimits.join(","));
  }

  // Life-Mate group targeting
  if (v.selected.includes("lifemates")) {
    form.append(`${prefix}_life_mates`, v.lifeMates.join(","));
  }
}
