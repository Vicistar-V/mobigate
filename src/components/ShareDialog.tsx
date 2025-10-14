import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import { 
  shareToFacebook, 
  shareToTwitter, 
  shareToWhatsApp, 
  shareToLinkedIn,
  copyToClipboard 
} from "@/lib/shareUtils";
import { toast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  title: string;
  description?: string;
}

export const ShareDialog = ({
  open,
  onOpenChange,
  shareUrl,
  title,
  description,
}: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: string) => {
    switch (platform) {
      case 'facebook':
        shareToFacebook(shareUrl, title);
        break;
      case 'twitter':
        shareToTwitter(shareUrl, title);
        break;
      case 'whatsapp':
        shareToWhatsApp(shareUrl, title);
        break;
      case 'linkedin':
        shareToLinkedIn(shareUrl);
        break;
    }
    
    toast({
      title: "Opening share dialog",
      description: `Sharing to ${platform}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this content</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Title and description */}
          <div className="space-y-1">
            <p className="text-sm font-medium line-clamp-2">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
            )}
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleShare('facebook')}
              className="w-full justify-start gap-2"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              <span>Facebook</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('twitter')}
              className="w-full justify-start gap-2"
            >
              <Twitter className="h-4 w-4 text-sky-500" />
              <span>Twitter</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('whatsapp')}
              className="w-full justify-start gap-2"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              <span>WhatsApp</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('linkedin')}
              className="w-full justify-start gap-2"
            >
              <Linkedin className="h-4 w-4 text-blue-700" />
              <span>LinkedIn</span>
            </Button>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Or copy link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-muted rounded-md border border-input"
              />
              <Button
                variant={copied ? "default" : "outline"}
                size="icon"
                onClick={handleCopyLink}
                className="flex-shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
