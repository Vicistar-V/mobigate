/**
 * components/ShareDialog.tsx
 * Rich share dialog — shows post thumbnail, title, description.
 * Shares to WhatsApp, SMS, Email, Twitter, Telegram, Facebook etc.
 */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Copy, Check, Send, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open:          boolean;
  onOpenChange:  (o: boolean) => void;
  shareUrl:      string;
  title?:        string;
  description?:  string;
  imageUrl?:     string;
  author?:       string;
  postType?:     string;
}

export const ShareDialog = ({
  open, onOpenChange, shareUrl, title, description, imageUrl, author, postType,
}: ShareDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const postTitle = title || "Check this out on Mobigate";
  const postDesc  = description || (author ? `${postType || "Post"} by ${author}` : "");
  const shareText = `${postTitle}${postDesc ? `\n${postDesc}` : ""}\n\n${shareUrl}`;
  const shortText = `${postTitle} — ${shareUrl}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: postTitle, text: postDesc, url: shareUrl });
      } catch {}
    }
  };

  const channels = [
    {
      label:  "WhatsApp",
      icon:   "💬",
      color:  "bg-[#25D366] hover:bg-[#1ebe5d] text-white",
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank"),
    },
    {
      label:  "SMS",
      icon:   "📱",
      color:  "bg-blue-500 hover:bg-blue-600 text-white",
      action: () => window.open(`sms:?body=${encodeURIComponent(shareText)}`, "_blank"),
    },
    {
      label:  "Email",
      icon:   "✉️",
      color:  "bg-gray-700 hover:bg-gray-800 text-white",
      action: () => window.open(`mailto:?subject=${encodeURIComponent(postTitle)}&body=${encodeURIComponent(shareText)}`, "_blank"),
    },
    {
      label:  "Twitter / X",
      icon:   "𝕏",
      color:  "bg-black hover:bg-gray-900 text-white",
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shortText)}`, "_blank"),
    },
    {
      label:  "Facebook",
      icon:   "f",
      color:  "bg-[#1877F2] hover:bg-[#1462cc] text-white",
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(postTitle)}`, "_blank"),
    },
    {
      label:  "Telegram",
      icon:   "✈️",
      color:  "bg-[#229ED9] hover:bg-[#1a8fbf] text-white",
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank"),
    },
    {
      label:  "Mobi-Chat",
      icon:   "💜",
      color:  "bg-purple-600 hover:bg-purple-700 text-white",
      action: () => {
        window.dispatchEvent(new CustomEvent("openMobiChat", { detail: { shareText } }));
        onOpenChange(false);
      },
    },
    {
      label:  "Instagram",
      icon:   "📸",
      color:  "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white",
      action: () => {
        navigator.clipboard.writeText(shareText);
        toast({ title: "Copied!", description: "Paste in your Instagram story or DM." });
      },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-full p-0 overflow-hidden rounded-2xl">

        <DialogHeader className="px-5 pt-5 pb-3 border-b border-gray-100">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Send className="h-4 w-4 text-purple-600" />Share
          </DialogTitle>
        </DialogHeader>

        {/* ── Post preview card ── */}
        <div className="mx-5 mt-4 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
          {imageUrl && (
            <div className="relative">
              <img
                src={imageUrl}
                alt={postTitle}
                className="w-full h-36 object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              {postType && (
                <span className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {postType}
                </span>
              )}
            </div>
          )}
          <div className="p-3">
            <p className="font-bold text-sm text-gray-900 line-clamp-2">{postTitle}</p>
            {postDesc && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{postDesc}</p>}
            <p className="text-xs text-purple-500 mt-1 flex items-center gap-1 truncate">
              <ExternalLink className="h-3 w-3 shrink-0" />{shareUrl}
            </p>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3">
          {/* Native share — mobile */}
          {typeof navigator !== "undefined" && (navigator as any).share && (
            <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white" onClick={nativeShare}>
              <Send className="h-4 w-4" />Share via device
            </Button>
          )}

          {/* Channels grid */}
          <div className="grid grid-cols-2 gap-2">
            {channels.map(ch => (
              <button key={ch.label} onClick={ch.action}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${ch.color}`}>
                <span className="text-base w-5 text-center">{ch.icon}</span>
                <span>{ch.label}</span>
              </button>
            ))}
          </div>

          {/* Copy link row */}
          <div className="flex gap-2 pt-1 border-t border-gray-100">
            <Input value={shareUrl} readOnly
              className="text-xs text-gray-500 bg-gray-50 border-gray-200 rounded-xl"
              onClick={e => (e.target as HTMLInputElement).select()} />
            <Button size="sm" variant="outline" onClick={copyLink}
              className="shrink-0 rounded-xl border-gray-200 hover:border-purple-400 hover:text-purple-600 px-3 gap-1.5">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};
