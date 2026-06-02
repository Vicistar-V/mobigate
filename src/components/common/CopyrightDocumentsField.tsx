/**
 * components/common/CopyrightDocumentsField.tsx
 *
 * Reusable block for post-creation / post-edit forms that lets an author:
 *  1. Optionally upload Copyright Documents (PDF / JPEG / TIFF / PNG / GIF).
 *  2. Toggle whether the "✓Copyright" designation marker appears on their media.
 *
 * Legal behaviour (enforced by the PHP backend — surfaced here for the author):
 *  - Uploaded documents are submitted to the System against the Author's Account.
 *  - Only Mobigate Admins can access or view these Documents.
 *  - The Author CANNOT delete or remove a submitted document, even if the post
 *    itself is later deleted. It is a legal document that belongs to Mobigate.
 */

import { useRef } from "react";
import { Upload, X, FileCheck, ShieldCheck, BadgeCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ACCEPT =
  ".pdf,.jpg,.jpeg,.tiff,.tif,.png,.gif,application/pdf,image/jpeg,image/tiff,image/png,image/gif";

export interface CopyrightDocumentsFieldProps {
  /** "Upload Copyright Documents, if any" checkbox state */
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  /** Currently-selected document file (or null) */
  file: File | null;
  onFileChange: (f: File | null) => void;
  /** Whether the ✓Copyright marker is shown on the media (default true) */
  marker: boolean;
  onMarkerChange: (v: boolean) => void;
  className?: string;
}

export const CopyrightDocumentsField = ({
  enabled,
  onEnabledChange,
  file,
  onFileChange,
  marker,
  onMarkerChange,
  className,
}: CopyrightDocumentsFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileChange(f);
  };

  const clearFile = () => {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`rounded-xl border bg-muted/30 p-3 space-y-3 ${className ?? ""}`}>
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Copyright Protection</p>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Register your ownership and mark your media
          </p>
        </div>
      </div>

      {/* ── 1. Display ✓Copyright marker toggle ── */}
      <div className="flex items-start justify-between gap-3 rounded-lg border bg-background px-3 py-2.5">
        <div className="flex items-start gap-2.5 min-w-0">
          <BadgeCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div className="min-w-0">
            <Label htmlFor="copyright-marker" className="text-sm font-medium cursor-pointer">
              Show “✓Copyright” on media
            </Label>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Displays a Copyright designation on the bottom-right of your images/videos.
              Turn off to let media appear without it.
            </p>
          </div>
        </div>
        <Switch
          id="copyright-marker"
          checked={marker}
          onCheckedChange={onMarkerChange}
          className="mt-0.5 shrink-0"
        />
      </div>

      {/* ── 2. Upload Copyright Documents ── */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="copyright-docs-toggle"
          checked={enabled}
          onCheckedChange={(v) => {
            const next = v === true;
            onEnabledChange(next);
            if (!next) clearFile();
          }}
          className="mt-0.5"
        />
        <Label htmlFor="copyright-docs-toggle" className="text-sm font-medium leading-snug cursor-pointer">
          Upload Copyright Documents, if any
        </Label>
      </div>

      {enabled && (
        <div className="space-y-2 pl-7">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => inputRef.current?.click()}
          >
            {file ? <FileCheck className="h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            {file ? "Change Document" : "Upload Document"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            onChange={handleFile}
            className="hidden"
          />

          {file && (
            <div className="flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2">
              <span className="text-sm truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <p className="text-[11px] text-muted-foreground">Supported formats: PDF, JPEG, TIFF, PNG, GIF</p>

          {/* Legal notice — documents belong to Mobigate */}
          <div className="flex gap-2 rounded-lg border border-amber-300/60 bg-amber-50 px-2.5 py-2">
            <Lock className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug text-amber-800">
              Submitted documents are filed against your account as legal records that
              <strong> belong to Mobigate</strong>. Only Mobigate Admins can view them, and they
              <strong> cannot be removed</strong> — even if you later delete this post.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
