import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Globe, AlertCircle } from "lucide-react";
import { useState } from "react";
import { PremiumAdCarousel } from "./PremiumAdCarousel";

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
      <Card className="relative w-full overflow-hidden bg-card border-2 border-primary/20 shadow-xl">
        <div className="relative h-[80vh] sm:h-[70vh]">
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
            <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
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
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Verified</Badge>
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
              <p className="text-sm sm:text-lg md:text-xl text-white/90">
                {content.description}
              </p>
              <Button
                onClick={handleCTA}
                size="lg"
                className="mt-4 sm:mt-6 bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold rounded-xl"
              >
                {content.ctaText}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Standard layout - Main feed ad format
  if (layout === 'standard') {
    return (
      <Card className="w-full overflow-hidden bg-card border-2 border-primary/10 shadow-lg">
        {/* Header */}
        <div className="p-3 sm:p-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
            {advertiser.logo && (
              <img 
                src={advertiser.logo} 
                alt={advertiser.name}
                className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover bg-muted"
              />
            )}
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">{advertiser.name}</span>
              {advertiser.verified && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">✓</Badge>
              )}
            </div>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Sponsored
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground"
            >
              <AlertCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Media Content */}
        {media.type === 'carousel' ? (
          <PremiumAdCarousel items={media.items} />
        ) : media.type === 'video' ? (
          <div className="relative aspect-video bg-black">
            <video
              src={media.items[0]?.url}
              controls
              className="w-full h-full"
              poster={media.items[0]?.url}
            />
          </div>
        ) : (
          <div className="relative aspect-video sm:aspect-[16/9]">
            <img
              src={media.items[0]?.url}
              alt={content.headline}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Footer */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-foreground leading-tight">
              {content.headline}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {content.description}
            </p>
          </div>
          <Button
            onClick={handleCTA}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 sm:py-5 text-sm sm:text-base rounded-lg"
          >
            {content.ctaText}
          </Button>
        </div>
      </Card>
    );
  }

  // Compact layout - Smaller inline ad
  return (
    <Card className="w-full overflow-hidden bg-card border border-border">
      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Media Thumbnail */}
        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted">
          <img
            src={media.items[0]?.url}
            alt={content.headline}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
              <span className="font-medium text-foreground truncate">{advertiser.name}</span>
              <span>·</span>
              <span>Sponsored</span>
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-foreground line-clamp-2">
              {content.headline}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
              {content.description}
            </p>
          </div>
          <Button
            onClick={handleCTA}
            size="sm"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs sm:text-sm mt-2"
          >
            {content.ctaText}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </Card>
  );
};
