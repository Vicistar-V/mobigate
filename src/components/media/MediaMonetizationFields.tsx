import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Coins,
  Users,
  ShieldCheck,
  Music,
  Upload,
  X,
  FileCheck2,
  Globe,
  Heart,
  Flag,
  Building2,
  UserRound,
} from "lucide-react";
import {
  getMediaAccessFeeDefault,
  getMediaAccessFeeMax,
  getMediaAccessFeeMin,
} from "@/data/platformSettingsData";

export type AudienceKey =
  | "all"
  | "country"
  | "friends"
  | "lifemates"
  | "communities"
  | "followers";

export const AUDIENCE_OPTIONS: {
  key: AudienceKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "all", label: "All Audience", icon: Globe },
  { key: "country", label: "My Country", icon: Flag },
  { key: "friends", label: "Friends", icon: UserRound },
  { key: "lifemates", label: "Life-mates", icon: Heart },
  { key: "communities", label: "Communities", icon: Building2 },
  { key: "followers", label: "Followers", icon: Users },
];

export interface MediaMonetizationValue {
  accessFee: number;
  audience: AudienceKey[];
  ownsCopyright: boolean;
  copyrightDocName?: string;
  audioTrackName?: string;
}

interface MediaMonetizationFieldsProps {
  value: MediaMonetizationValue;
  onChange: (next: MediaMonetizationValue) => void;
  /** When true, hide the Add Audio/Music section (e.g. for Video uploads) */
  hideAudio?: boolean;
  /** Compact spacing for tight drawers */
  compact?: boolean;
}

export const defaultMonetizationValue = (): MediaMonetizationValue => ({
  accessFee: getMediaAccessFeeDefault(),
  audience: ["all"],
  ownsCopyright: false,
});

export function MediaMonetizationFields({
  value,
  onChange,
  hideAudio = false,
  compact = false,
}: MediaMonetizationFieldsProps) {
  const docInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const maxFee = getMediaAccessFeeMax();
  const minFee = getMediaAccessFeeMin();
  const defaultFee = getMediaAccessFeeDefault();

  const toggleAudience = (key: AudienceKey) => {
    let next = [...value.audience];
    if (key === "all") {
      next = next.includes("all") ? [] : ["all"];
    } else {
      next = next.filter((k) => k !== "all");
      if (next.includes(key)) next = next.filter((k) => k !== key);
      else next.push(key);
    }
    if (next.length === 0) next = ["all"];
    onChange({ ...value, audience: next });
  };

  const handleFeeBlur = () => {
    let v = Number(value.accessFee);
    if (!Number.isFinite(v) || v < 0) v = 0;
    // Allow 0 (free) explicitly; otherwise clamp into [minFee, maxFee]
    if (v > 0 && v < minFee) v = minFee;
    if (v > maxFee) v = maxFee;
    onChange({ ...value, accessFee: v });
  };

  const gap = compact ? "space-y-3" : "space-y-4";

  return (
    <div className={gap}>
      {/* Access Fee */}
      <div className="space-y-2 p-3 rounded-lg border bg-muted/30">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Coins className="h-4 w-4 text-amber-500" />
            Set Access Fee
          </Label>
          <Badge variant="secondary" className="text-[10px]">
            M{minFee} – M{maxFee} • Default M{defaultFee}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-muted-foreground">M</span>
          <Input
            type="number"
            min={0}
            max={maxFee}
            inputMode="decimal"
            value={value.accessFee}
            onChange={(e) =>
              onChange({ ...value, accessFee: Number(e.target.value) })
            }
            onBlur={handleFeeBlur}
            className="h-9"
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Mobi
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Visitors pay this fee to view your content. Allowed range:{" "}
          <span className="font-semibold">M{minFee} – M{maxFee}</span>. Set to 0
          to keep it free.
        </p>
      </div>

      {/* Audience */}
      <div className="space-y-2 p-3 rounded-lg border bg-muted/30">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Choose Audience
          <span className="text-[10px] text-muted-foreground font-normal">
            (multi-select)
          </span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {AUDIENCE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const checked = value.audience.includes(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleAudience(opt.key)}
                className={`flex items-center gap-2 p-2 rounded-md border text-left text-xs transition-all ${
                  checked
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <Checkbox
                  checked={checked}
                  className="pointer-events-none"
                />
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Copyright */}
      <div className="space-y-2 p-3 rounded-lg border bg-muted/30">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Copyright Ownership
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {value.ownsCopyright ? "Yes" : "No"}
            </span>
            <Switch
              checked={value.ownsCopyright}
              onCheckedChange={(v) =>
                onChange({
                  ...value,
                  ownsCopyright: v,
                  copyrightDocName: v ? value.copyrightDocName : undefined,
                })
              }
            />
          </div>
        </div>
        {value.ownsCopyright && (
          <div className="space-y-2">
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onChange({ ...value, copyrightDocName: f.name });
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => docInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5 mr-2" />
              {value.copyrightDocName
                ? "Change Copyright Document"
                : "Upload Copyright Document"}
            </Button>
            {value.copyrightDocName && (
              <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 min-w-0">
                  <FileCheck2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs truncate">
                    {value.copyrightDocName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...value, copyrightDocName: undefined })
                  }
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground leading-snug">
              Required proof of ownership (license, certificate, agreement).
            </p>
          </div>
        )}
      </div>

      {/* Background Audio (hidden for videos) */}
      {!hideAudio && (
        <div className="space-y-2 p-3 rounded-lg border bg-muted/30">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Music className="h-4 w-4 text-purple-500" />
            Add Audio / Music
            <span className="text-[10px] text-muted-foreground font-normal">
              (background)
            </span>
          </Label>
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onChange({ ...value, audioTrackName: f.name });
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => audioInputRef.current?.click()}
          >
            <Music className="h-3.5 w-3.5 mr-2" />
            {value.audioTrackName ? "Change Audio Track" : "Add Audio / Music"}
          </Button>
          {value.audioTrackName && (
            <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center gap-2 min-w-0">
                <Music className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span className="text-xs truncate">{value.audioTrackName}</span>
              </div>
              <button
                type="button"
                onClick={() => onChange({ ...value, audioTrackName: undefined })}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <p className="text-[11px] text-muted-foreground leading-snug">
            Plays softly in the background while viewers enjoy your content.
          </p>
        </div>
      )}
    </div>
  );
}
