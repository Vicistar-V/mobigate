import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  COUNTRIES, COUNTRY_NAMES, getCountry, getLabelsFor,
  getChildren, type LocationNode,
} from "@/data/worldLocationsData";

/**
 * CascadingLocationSelector
 * ─────────────────────────
 * Country → State/Province/Region → LGA/County → City/Town
 *
 * Rules implemented:
 *  • Selecting a Country activates the level-1 field (State/Province/Region) and
 *    shows the correct nomenclature for that country.
 *  • Selecting a level-1 value activates the level-2 field (LGA/County) with the
 *    correct nomenclature for that country.
 *  • Selecting a level-2 value activates the level-3 field (City/Town).
 *  • Each level is a dropdown when we have data for it, otherwise it gracefully
 *    becomes a free-text input (still using the correct adaptive label).
 *  • Changing any parent level clears all of its descendant levels.
 */

export interface LocationValue {
  country: string;
  state: string; // level 1
  lga: string;   // level 2
  city: string;  // level 3 (City/Town)
  town: string;  // reserved / optional extra granularity
}

export const EMPTY_LOCATION: LocationValue = {
  country: "", state: "", lga: "", city: "", town: "",
};

interface Props {
  value: LocationValue;
  onChange: (v: LocationValue) => void;
  /** Compact mode = tighter spacing for inline use (e.g. inside pickers). */
  compact?: boolean;
  /** Hide the leading MapPin/title row. */
  hideHeader?: boolean;
  className?: string;
}

export function CascadingLocationSelector({
  value, onChange, compact = false, hideHeader = false, className,
}: Props) {
  const labels = getLabelsFor(value.country);
  const country = getCountry(value.country);

  // Level-1 nodes (states/provinces/regions) for the chosen country.
  const level1Nodes: LocationNode[] = country?.divisions ?? [];
  // Level-2 nodes (LGAs/counties) for the chosen level-1.
  const level2Nodes: LocationNode[] = useMemo(
    () => (value.state ? getChildren(level1Nodes, value.state) : []),
    [level1Nodes, value.state],
  );
  // Level-3 nodes (cities/towns) for the chosen level-2.
  const level3Nodes: LocationNode[] = useMemo(
    () => (value.lga ? getChildren(level2Nodes, value.lga) : []),
    [level2Nodes, value.lga],
  );

  const setCountry = (country: string) =>
    onChange({ country, state: "", lga: "", city: "", town: "" });
  const setState = (state: string) =>
    onChange({ ...value, state, lga: "", city: "", town: "" });
  const setLga = (lga: string) =>
    onChange({ ...value, lga, city: "", town: "" });
  const setCity = (city: string) =>
    onChange({ ...value, city });

  const fieldCls = compact ? "h-8 text-xs bg-white" : "h-9 text-sm bg-background";
  const labelCls = cn(
    "text-muted-foreground",
    compact ? "text-[11px]" : "text-xs",
  );

  // Render a level as a dropdown (when nodes exist) or a free-text input.
  const renderLevel = (
    levelLabel: string,
    fieldValue: string,
    nodes: LocationNode[],
    onValueChange: (v: string) => void,
    disabled: boolean,
    placeholder: string,
  ) => (
    <div className="space-y-1">
      <Label className={labelCls}>{levelLabel}</Label>
      {nodes.length > 0 ? (
        <Select
          value={fieldValue || undefined}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectTrigger className={fieldCls}>
            <SelectValue placeholder={disabled ? placeholder : `Select ${levelLabel}`} />
          </SelectTrigger>
          <SelectContent className="z-[60] bg-background max-h-64">
            {nodes.map((n) => (
              <SelectItem key={n.name} value={n.name}>{n.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          value={fieldValue}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? placeholder : `Enter ${levelLabel}`}
          className={fieldCls}
        />
      )}
    </div>
  );

  return (
    <div className={cn("space-y-2.5", className)}>
      {!hideHeader && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          <span className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
            Location
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Country */}
        <div className="space-y-1">
          <Label className={labelCls}>Country</Label>
          <Select value={value.country || undefined} onValueChange={setCountry}>
            <SelectTrigger className={fieldCls}>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent className="z-[60] bg-background max-h-64">
              {COUNTRY_NAMES.map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Level 1 — State / Province / Region */}
        {renderLevel(
          labels.level1, value.state, level1Nodes, setState,
          !value.country, "Select a Country first",
        )}

        {/* Level 2 — LGA / County / District */}
        {renderLevel(
          labels.level2, value.lga, level2Nodes, setLga,
          !value.state, `Select a ${labels.level1} first`,
        )}

        {/* Level 3 — City / Town */}
        {renderLevel(
          labels.level3, value.city, level3Nodes, setCity,
          !value.lga, `Select a ${labels.level2} first`,
        )}
      </div>
    </div>
  );
}

/** Build a human-readable single-line summary from a LocationValue. */
export function formatLocation(v: LocationValue): string {
  return [v.city, v.lga, v.state, v.country].filter(Boolean).join(", ");
}

export { COUNTRIES };
