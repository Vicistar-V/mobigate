/**
 * components/ShareProfileDialog.tsx
 * Full share dialog with multiple channels:
 * WhatsApp, SMS, Email, Twitter/X, Instagram, Mobi-Chat, Telegram, Facebook, Copy Link
 */
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, MessageCircle, Mail, Send } from "lucide-react";

interface ShareProfileDialogProps {
  open:        boolean;
  onClose:     () => void;
  profileName: string;
  profileUrl?: string;
}

export const ShareProfileDialog = ({
  open,
  onClose,
  profileName,
  profileUrl,
}: ShareProfileDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const url  = profileUrl || window.location.href;
  const text = `Check out ${profileName}'s profile on Mobiface: ${url}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Link copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Could not copy", variant: "destructive" });
    }
  };

  // Use native Web Share API if available (mobile)
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${profileName} on Mobiface`, text, url });
      } catch {}
    }
  };

  const channels = [
    {
      label: "WhatsApp",
      color: "bg-[#25D366] hover:bg-[#1ebe5d] text-white",
      icon: "💬",
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank"),
    },
    {
      label: "SMS",
      color: "bg-blue-500 hover:bg-blue-600 text-white",
      icon: "📱",
      action: () => window.open(`sms:?body=${encodeURIComponent(text)}`, "_blank"),
    },
    {
      label: "Email",
      color: "bg-gray-600 hover:bg-gray-700 text-white",
      icon: "✉️",
      action: () => window.open(`mailto:?subject=${encodeURIComponent(`${profileName} on Mobiface`)}&body=${encodeURIComponent(text)}`, "_blank"),
    },
    {
      label: "Twitter / X",
      color: "bg-black hover:bg-gray-900 text-white",
      icon: "𝕏",
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank"),
    },
    {
      label: "Facebook",
      color: "bg-[#1877F2] hover:bg-[#1462cc] text-white",
      icon: "f",
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank"),
    },
    {
      label: "Telegram",
      color: "bg-[#229ED9] hover:bg-[#1a8fbf] text-white",
      icon: "✈️",
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out ${profileName} on Mobiface`)}`, "_blank"),
    },
    {
      label: "Instagram",
      color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 text-white",
      icon: "📸",
      // Instagram doesn't support direct share URLs — open app or copy
      action: () => {
        navigator.clipboard.writeText(url);
        toast({ title: "Link copied!", description: "Paste it in your Instagram bio or story." });
      },
    },
    {
      label: "Mobi-Chat",
      color: "bg-purple-600 hover:bg-purple-700 text-white",
      icon: "💜",
      action: () => {
        window.dispatchEvent(new CustomEvent("openMobiChat", { detail: { shareText: text } }));
        onClose();
      },
    },
    {
      label: "LinkedIn",
      color: "bg-[#0A66C2] hover:bg-[#0958a8] text-white",
      icon: "in",
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank"),
    },
    {
      label: "Reddit",
      color: "bg-[#FF4500] hover:bg-[#e03d00] text-white",
      icon: "🤖",
      action: () => window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(`${profileName} on Mobiface`)}`, "_blank"),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent aria-describedby={undefined} className="max-w-sm w-full p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Send className="h-5 w-5 text-purple-600" />
            Share Profile
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            Share <span className="font-semibold text-foreground">{profileName}</span>'s profile
          </p>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4">

          {/* Native share button — mobile only, hidden on desktop */}
          {typeof navigator !== "undefined" && navigator.share && (
            <Button
              className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={nativeShare}
            >
              <Send className="h-4 w-4" />
              Share via device apps
            </Button>
          )}

          {/* Share channels grid */}
          <div className="grid grid-cols-2 gap-2">
            {channels.map(ch => (
              <button
                key={ch.label}
                onClick={ch.action}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${ch.color} shadow-sm`}
              >
                <span className="text-base w-5 text-center leading-none">{ch.icon}</span>
                <span>{ch.label}</span>
              </button>
            ))}
          </div>

          {/* Copy link row */}
          <div className="flex gap-2 pt-1 border-t border-gray-100">
            <Input
              value={url}
              readOnly
              className="text-xs text-muted-foreground bg-gray-50 border-gray-200 focus-visible:ring-purple-400 rounded-xl"
              onClick={e => (e.target as HTMLInputElement).select()}
            />
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 gap-1.5 rounded-xl border-gray-200 hover:border-purple-400 hover:text-purple-600 px-3"
              onClick={copyLink}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
