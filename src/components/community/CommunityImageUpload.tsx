import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CommunityImageUploadProps {
  type: "cover" | "logo" | "banner";
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
  className?: string;
}

const API = "/api";

export function CommunityImageUpload({
  type, value, onChange, label, hint, className,
}: CommunityImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCover  = type === "cover"  || type === "banner";
  const isLogo   = type === "logo";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large (max 10MB)");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("type", type);
      const res  = await fetch(`${API}/community/upload_image.php`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
      onChange(data.url);
      toast.success(`${label || "Image"} uploaded`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  /* ── Cover / Banner ── */
  if (isCover) return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      <div
        className="relative w-full rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer group bg-muted/30"
        style={{ height: 160 }}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <>
            <img src={value} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}>
                <Camera className="h-3.5 w-3.5 mr-1" /> Change
              </Button>
              <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={e => { e.stopPropagation(); onChange(null); }}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            {uploading
              ? <Loader2 className="h-8 w-8 animate-spin text-primary" />
              : <>
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-sm font-medium">Click to upload {label || "cover image"}</span>
                  {hint && <span className="text-xs opacity-70">{hint}</span>}
                </>}
          </div>
        )}
        {uploading && value && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden" onChange={handleFileChange} />
      {hint && !value && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  /* ── Logo / Avatar ── */
  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      <div className="flex items-center gap-4">
        <div
          className="relative h-20 w-20 rounded-2xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer group bg-muted/30 overflow-hidden shrink-0"
          onClick={() => inputRef.current?.click()}
        >
          {value ? (
            <>
              <img src={value} alt="logo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              {uploading
                ? <Loader2 className="h-6 w-6 animate-spin text-primary" />
                : <><ImagePlus className="h-6 w-6" /><span className="text-[10px] mt-1">Logo</span></>}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <Button size="sm" variant="outline" className="h-8 text-xs mb-1"
            disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Camera className="h-3 w-3 mr-1" />}
            {value ? "Change logo" : "Upload logo"}
          </Button>
          {value && (
            <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive hover:text-destructive ml-1"
              onClick={() => onChange(null)}>
              <X className="h-3 w-3 mr-1" /> Remove
            </Button>
          )}
          {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden" onChange={handleFileChange} />
    </div>
  );
}
