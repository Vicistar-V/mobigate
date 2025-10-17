import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Globe, AlertCircle } from "lucide-react";
import { useState } from "react";
import { PremiumAdCarousel } from "./PremiumAdCarousel";
import { EngagementBar } from "@/components/EngagementBar";
import { ShareDialog } from "@/components/ShareDialog";
import { CommentDialog } from "@/components/CommentDialog";
import { generateShareUrl } from "@/lib/shareUtils";

export interface PremiumAdMedia {
  url: string;
  caption?: string;
  price?: string;
}

export interface PremiumAdCardProps {
  id: string;
  advertiser: {
    name: string;
    logo?: string;
    verified?: boolean;
  };
  content: {
    headline: string;
    description: string;
    ctaText: string;
    ctaUrl?: string;
  };
  media: {
    type: 'image' | 'carousel' | 'video';
    items: PremiumAdMedia[];
  };
  layout: 'fullscreen' | 'standard' | 'compact';
  duration?: number;
}

export const PremiumAdCard = ({
  id,
  advertiser,
  content,
  media,
  layout,
}: PremiumAdCardProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const shareUrl = generateShareUrl('ad', id);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCTA = () => {
    if (content.ctaUrl) {
      window.open(content.ctaUrl, '_blank');
    }
  };

  // Fullscreen layout - High impact, takes 80-100vh
  if (layout === 'fullscreen') {
    return (
      <Card className="relative w-full h-full overflow-hidden bg-card border-2 border-primary/20 shadow-xl">
        <div className="relative h-full">
          {/* Background Image */}
          <img
            src={media.items[0]?.url}
            alt={content.headline}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2 text-white/90 text-sm sm:text-base">
              {advertiser.logo && (
                <img 
                  src={advertiser.logo} 
                  alt={advertiser.name}
                  className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover bg-white"
                />
              )}
              <span className="font-medium">{advertiser.name}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Sponsored
              </span>
              {advertiser.verified && (
                <Badge variant="secondary" className="text-base px-1.5 py-0">Verified</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/40 hover:bg-black/60 text-white"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Content - Centered */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 z-10">
            <div className="max-w-2xl text-center text-white space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {content.headline}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/90">
                {content.description}
              </p>
              <Button
                onClick={handleCTA}
                size="lg"
                className="mt-4 sm:mt-6 bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold rounded-xl"
              >
                {content.ctaText}
              </Button>
              <EngagementBar
                itemId={id}
                itemType="ad"
                initialLikes="0"
                initialComments="0"
                initialShares="0"
                onComment={() => setShowComments(true)}
                onShare={() => setShowShare(true)}
                variant="minimal"
                className="mt-4"
              />
            </div>
          </div>
        </div>

        <CommentDialog
          open={showComments}
          onOpenChange={setShowComments}
          post={{
            id,
            title: content.headline,
            subtitle: content.description,
            author: advertiser.name,
            authorProfileImage: advertiser.logo,
            type: "Article",
            imageUrl: media.items[0]?.url,
          }}
        />

        <ShareDialog
          open={showShare}
          onOpenChange={setShowShare}
          shareUrl={shareUrl}
          title={content.headline}
          description={content.description}
        />
      </Card>
    );
  }

  // Standard layout - Main feed ad format
  if (layout === 'standard') {
    return (
      <Card className="w-full h-full overflow-hidden bg-card border-2 border-primary/10 shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
          <div className="flex items-start gap-2 justify-between">
            {/* Left: Advertiser Info */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {advertiser.logo && (
                <img 
                  src={advertiser.logo} 
                  alt={advertiser.name}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover bg-muted flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-foreground text-sm sm:text-base">{advertiser.name}</span>
                  {advertiser.verified && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">✓</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-0.5">
                  <Globe className="h-3 w-3 flex-shrink-0" />
                  <span>Sponsored</span>
                </div>
              </div>
            </div>
            
            {/* Right: Action Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground"
              >
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Media Content */}
        <div className="flex-1 min-h-0">
          {media.type === 'carousel' ? (
            <PremiumAdCarousel items={media.items} />
          ) : media.type === 'video' ? (
            <div className="relative h-full bg-black">
              <video
                src={media.items[0]?.url}
                controls
                className="w-full h-full object-contain"
                poster={media.items[0]?.url}
              />
            </div>
          ) : (
            <div className="relative h-full">
              <img
                src={media.items[0]?.url}
                alt={content.headline}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Content Footer */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-shrink-0">
          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-foreground leading-tight">
              {content.headline}
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {content.description}
            </p>
          </div>
          <Button
            onClick={handleCTA}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 sm:py-5 text-base sm:text-lg rounded-lg"
          >
            {content.ctaText}
          </Button>
          <EngagementBar
            itemId={id}
            itemType="ad"
            initialLikes="0"
            initialComments="0"
            initialShares="0"
            onComment={() => setShowComments(true)}
            onShare={() => setShowShare(true)}
            className="pt-3 border-t"
          />
        </div>

        <CommentDialog
          open={showComments}
          onOpenChange={setShowComments}
          post={{
            id,
            title: content.headline,
            subtitle: content.description,
            author: advertiser.name,
            authorProfileImage: advertiser.logo,
            type: "Article",
            imageUrl: media.items[0]?.url,
          }}
        />

        <ShareDialog
          open={showShare}
          onOpenChange={setShowShare}
          shareUrl={shareUrl}
          title={content.headline}
          description={content.description}
        />
      </Card>
    );
  }

  // Compact layout - Smaller inline ad
  return (
    <Card className="w-full h-full overflow-hidden bg-card border border-border flex flex-col">
      <div className="p-3 sm:p-4 space-y-3 flex-1">
        {/* Top Row: Image, Title, and Close Button */}
        <div className="flex gap-3 items-start">
          {/* Media Thumbnail */}
          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted">
            <img
              src={media.items[0]?.url}
              alt={content.headline}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title and Advertiser */}
          <div className="flex-1 min-w-0">
            <div className="space-y-0.5 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground text-xs sm:text-sm truncate">{advertiser.name}</span>
                {advertiser.verified && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">✓</Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="h-3 w-3 flex-shrink-0" />
                <span>Sponsored</span>
              </div>
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-foreground line-clamp-2 leading-snug">
              {content.headline}
            </h4>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 leading-relaxed">
          {content.description}
        </p>

        {/* CTA Button */}
        <Button
          onClick={handleCTA}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm sm:text-base py-2.5"
        >
          {content.ctaText}
        </Button>

        {/* Engagement Bar */}
        <EngagementBar
          itemId={id}
          itemType="ad"
          initialLikes="0"
          initialComments="0"
          initialShares="0"
          onComment={() => setShowComments(true)}
          onShare={() => setShowShare(true)}
          variant="compact"
          className="pt-2 border-t"
        />
      </div>

      <CommentDialog
        open={showComments}
        onOpenChange={setShowComments}
        post={{
          id,
          title: content.headline,
          subtitle: content.description,
          author: advertiser.name,
          authorProfileImage: advertiser.logo,
          type: "Article",
          imageUrl: media.items[0]?.url,
        }}
      />

      <ShareDialog
        open={showShare}
        onOpenChange={setShowShare}
        shareUrl={shareUrl}
        title={content.headline}
        description={content.description}
      />
    </Card>
  );
};
