import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useState } from "react";
import { EngagementBar } from "@/components/EngagementBar";
import { ShareDialog } from "@/components/ShareDialog";
import { CommentDialog } from "@/components/CommentDialog";
import { generateShareUrl } from "@/lib/shareUtils";

interface AdCardProps {
  image?: string;
  content?: string;
  timeRemaining?: string;
  url?: string;
}

export const AdCard = ({ image, content, timeRemaining, url }: AdCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const shareUrl = generateShareUrl('ad', 'ad-rotation');

  return (
    <>
      <Card 
        className="p-4 col-span-3 bg-muted/30 space-y-3 cursor-pointer active:scale-[0.98] transition-transform touch-manipulation"
        onClick={() => url && window.open(url, "_blank")}
      >
        <div className="relative h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {image ? (
            <>
              <img 
                src={image} 
                alt="Advertisement" 
                className="w-full h-full object-cover"
              />
              {content && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                  <span className="text-white text-base font-medium">{content}</span>
                </div>
              )}
            </>
          ) : (
            <span className="text-base text-muted-foreground">Ad Space 300x250</span>
          )}
          {timeRemaining && (
            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md flex items-center gap-1 text-base">
              <Clock className="h-3 w-3" />
              {timeRemaining}
            </div>
          )}
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <EngagementBar
            itemId="ad-rotation"
            itemType="ad"
            initialLikes="0"
            initialComments="0"
            initialShares="0"
            onComment={() => setShowComments(true)}
            onShare={() => setShowShare(true)}
            variant="compact"
          />
        </div>
      </Card>

      <CommentDialog
        open={showComments}
        onOpenChange={setShowComments}
        post={{
          id: 'ad-rotation',
          title: content || "Advertisement",
          author: "Advertiser",
          type: "Article",
          imageUrl: image,
        }}
      />

      <ShareDialog
        open={showShare}
        onOpenChange={setShowShare}
        shareUrl={shareUrl}
        title={content || "Advertisement"}
      />
    </>
  );
};
