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
  contactDetails?: {
    phone?: string;
    phoneMethod?: 'whatsapp' | 'call';
    email?: string;
    website?: string;
  };
  isPreviewMode?: boolean;
}

export const PremiumAdCard = ({
  id,
  advertiser,
  content,
  media,
  layout,
  contactDetails,
  isPreviewMode = false,
}: PremiumAdCardProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
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

  const handleContactPhone = () => {
    if (!contactDetails?.phone) return;
    const cleanPhone = contactDetails.phone.replace(/\s+/g, '');
    if (contactDetails.phoneMethod === 'whatsapp') {
      window.open(`https://wa.me/${cleanPhone}`, '_blank');
    } else {
      window.location.href = `tel:${cleanPhone}`;
    }
  };

  const handleContactEmail = () => {
    if (contactDetails?.email) {
      window.location.href = `mailto:${contactDetails.email}`;
    }
  };

  const handleContactWebsite = () => {
    if (contactDetails?.website) {
      window.open(contactDetails.website, '_blank');
    }
  };

  // Fullscreen layout - High impact, takes 80-100vh
  if (layout === 'fullscreen') {
    return (
      <Card className="relative w-full h-full overflow-hidden bg-card border-2 border-primary/20 shadow-xl">
        <div className="relative h-full">
          {/* Background Media */}
          {media.type === 'video' ? (
            <video
              src={media.items[0]?.url}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              src={media.items[0]?.url}
              alt={content.headline}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 z-20">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1 text-white/90 text-xs sm:text-sm min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  {advertiser.logo && (
                    <img 
                      src={advertiser.logo} 
                      alt={advertiser.name}
                      className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover bg-white flex-shrink-0"
                    />
                  )}
                  <span className="font-medium truncate">{advertiser.name}</span>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm pl-8">
                  <Globe className="h-3 w-3 flex-shrink-0" />
                  <span>Sponsored</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex-shrink-0"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Content - Centered */}
          <div className="absolute inset-0 flex items-center justify-center px-4 py-6 sm:p-8 z-10">
            <div className="w-full max-w-2xl text-center text-white">
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight px-2">
                  {content.headline}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed px-2">
                  {content.description}
                </p>
              </div>
              {contactDetails && (contactDetails.phone || contactDetails.email || contactDetails.website) ? (
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                  {contactDetails.phone && (
                    <Button
                      onClick={handleContactPhone}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      {contactDetails.phoneMethod === 'whatsapp' ? '💬 WhatsApp' : '📞 Call'}
                    </Button>
                  )}
                  {contactDetails.email && (
                    <Button
                      onClick={handleContactEmail}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      ✉️ Email
                    </Button>
                  )}
                  {contactDetails.website && (
                    <Button
                      onClick={handleContactWebsite}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      🌐 Website
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={handleCTA}
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {content.ctaText}
                </Button>
              )}
              <div className="mt-4 sm:mt-6">
                <EngagementBar
                  itemId={id}
                  itemType="ad"
                  initialLikes="0"
                  initialComments="0"
                  initialShares="0"
                  onComment={() => setShowComments(true)}
                  onShare={() => setShowShare(true)}
                  variant="minimal"
                />
              </div>
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
                autoPlay
                loop
                muted
                playsInline
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
            <div className="relative">
              <p className={`text-base sm:text-lg text-muted-foreground leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
                {content.description}
              </p>
              {content.description.length > 100 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-primary hover:text-primary/80 text-sm font-medium mt-1 inline-flex items-center"
                >
                  {isDescriptionExpanded ? 'Show less' : '...More'}
                </button>
              )}
              {isPreviewMode && (
                <span className="block mt-2 text-xs text-blue-600 dark:text-blue-400">
                  <strong>Note:</strong> Ensure your advert material fits properly. Edit or resize images/videos if distorted before submitting.
                </span>
              )}
            </div>
          </div>
          {contactDetails && (contactDetails.phone || contactDetails.email || contactDetails.website) ? (
            <div className="flex flex-wrap gap-2">
              {contactDetails.phone && (
                <Button
                  onClick={handleContactPhone}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 sm:py-5 text-sm sm:text-base rounded-lg"
                >
                  {contactDetails.phoneMethod === 'whatsapp' ? '💬 WhatsApp' : '📞 Call'}
                </Button>
              )}
              {contactDetails.email && (
                <Button
                  onClick={handleContactEmail}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 sm:py-5 text-sm sm:text-base rounded-lg"
                >
                  ✉️ Email
                </Button>
              )}
              {contactDetails.website && (
                <Button
                  onClick={handleContactWebsite}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 sm:py-5 text-sm sm:text-base rounded-lg"
                >
                  🌐 Website
                </Button>
              )}
            </div>
          ) : (
            <Button
              onClick={handleCTA}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 sm:py-5 text-base sm:text-lg rounded-lg"
            >
              {content.ctaText}
            </Button>
          )}
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
            {media.type === 'video' ? (
              <video
                src={media.items[0]?.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={media.items[0]?.url}
                alt={content.headline}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Title and Advertiser */}
          <div className="flex-1 min-w-0">
            <div className="space-y-0.5 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground text-xs sm:text-sm truncate">{advertiser.name}</span>
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
        <div className="relative">
          <p className={`text-sm sm:text-base text-muted-foreground leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
            {content.description}
          </p>
          {content.description.length > 80 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-primary hover:text-primary/80 text-xs font-medium mt-0.5"
            >
              {isDescriptionExpanded ? 'Less' : '...More'}
            </button>
          )}
        </div>

        {/* CTA Button(s) */}
        {contactDetails && (contactDetails.phone || contactDetails.email || contactDetails.website) ? (
          <div className="flex flex-wrap gap-1.5">
            {contactDetails.phone && (
              <Button
                onClick={handleContactPhone}
                className="flex-1 min-w-[80px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs sm:text-sm py-2.5"
              >
                {contactDetails.phoneMethod === 'whatsapp' ? '💬' : '📞'}
              </Button>
            )}
            {contactDetails.email && (
              <Button
                onClick={handleContactEmail}
                className="flex-1 min-w-[80px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs sm:text-sm py-2.5"
              >
                ✉️
              </Button>
            )}
            {contactDetails.website && (
              <Button
                onClick={handleContactWebsite}
                className="flex-1 min-w-[80px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs sm:text-sm py-2.5"
              >
                🌐
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={handleCTA}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm sm:text-base py-2.5"
          >
            {content.ctaText}
          </Button>
        )}

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
