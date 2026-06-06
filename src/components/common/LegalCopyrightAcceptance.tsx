/**
 * LegalCopyrightAcceptance.tsx
 * Re-usable Legal / Copyright disclaimer + acceptance checkbox.
 * - Drop in just above a Submit / Publish button on every posting form.
 * - Pass `accepted` + `onAcceptedChange`; the parent uses `accepted` to enable
 *   its own Submit button.
 * - Tapping the "Legal / Copyright" link reveals the full disclaimer inline.
 */

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface LegalCopyrightAcceptanceProps {
  accepted: boolean;
  onAcceptedChange: (v: boolean) => void;
  className?: string;
  /** Override the publisher line (defaults to current logged-in user) */
  publisherName?: string;
  publisherEmail?: string;
}

export const LegalCopyrightAcceptance = ({
  accepted,
  onAcceptedChange,
  className,
  publisherName,
  publisherEmail,
}: LegalCopyrightAcceptanceProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const displayName  = publisherName  ?? user?.fullName ?? user?.username ?? "Mobiface User";
  const displayEmail = publisherEmail ?? user?.email    ?? "";

  return (
    <div
      className={cn(
        "rounded-xl border bg-muted/30 px-3 py-3 space-y-2",
        accepted && "border-primary/40 bg-primary/5",
        className,
      )}
    >
      <label className="flex items-start gap-2.5 cursor-pointer touch-manipulation">
        <Checkbox
          checked={accepted}
          onCheckedChange={(v) => onAcceptedChange(v === true)}
          className="mt-0.5 shrink-0"
          aria-label="I accept the Legal / Copyright disclaimer"
        />
        <span className="text-xs leading-snug text-foreground">
          I have read and accept the{" "}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setOpen((v) => !v); }}
            className="font-semibold text-primary underline underline-offset-2 inline-flex items-center gap-0.5"
          >
            Legal / Copyright
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>{" "}
          disclaimer for this publication.
        </span>
      </label>

      {open && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-3 mt-1 space-y-2 text-[11px] leading-relaxed text-foreground/90">
          <div className="flex items-center gap-2 text-destructive font-bold text-xs">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            Copyright Ownership Disclaimer
          </div>
          <p>
            Mobiface and its subsidiaries do not guarantee Copyright Ownership of any
            materials, information or expressions shared or published on its platforms;
            and do not accept responsibility for any violation or infringement thereof
            of any such Rights whether written or otherwise; or of any claims that might
            arise from any such whether legally or otherwise from or by any interests
            whether corporate or individual whatsoever! All views, materials and/or
            information shared on Mobiface platforms are entirely the opinions and/or
            expressions of the Users / publishers — those who share or post such
            contents.
          </p>
          <p>
            The Mobiface User(s) — the publisher accept(s) responsibilities for every
            information, materials and/or opinions shared on Mobiface platforms; and do
            indemnify and exonerate Mobiface Applications Ltd and its subsidiaries,
            partners and interests worldwide of any liabilities, claims or whatsoever
            that might arise as a result of or in connection with any information,
            materials and/or opinions expressed or shared on Mobiface platforms. All
            publications on Mobiface platforms are exclusively those of the individuals
            and/or entities that shared them.{" "}
            <span className="font-semibold text-destructive">
              Any presentation or assumptions to the contrary is a criminal offence!
            </span>
          </p>

          <div className="rounded-md border bg-background/70 px-2.5 py-2 mt-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
              Content Publisher
            </p>
            <p className="text-xs font-semibold text-foreground mt-0.5 break-words">
              {displayName}
              {displayEmail && (
                <>
                  ,{" "}
                  <em className="font-medium text-primary">{displayEmail}</em>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
