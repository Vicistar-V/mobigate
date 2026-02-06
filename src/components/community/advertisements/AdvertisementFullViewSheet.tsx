import { useState, useRef } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X, MapPin, Phone, Mail, Globe, ChevronLeft, ChevronRight,
  Flag, Eye, Calendar, ThumbsUp, MessageSquare, Share2, Megaphone, Play,
} from "lucide-react";
import { getCategoryLabel } from "@/data/advertisementData";
import { formatMobiAmount, calculateDaysRemaining } from "@/lib/campaignFeeDistribution";
import type { EnhancedAdvertisement } from "@/types/advertisementSystem";

interface AdvertisementFullViewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advertisement: EnhancedAdvertisement | null;
}

export function AdvertisementFullViewSheet({ open, onOpenChange, advertisement }: AdvertisementFullViewSheetProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!advertisement) return null;

  const ad = advertisement;
  const daysRemaining = calculateDaysRemaining(ad.endDate);
  const mediaItems = ad.media;
  const currentItem = mediaItems[currentMediaIndex];

  const nextMedia = () => {
    if (mediaItems.length > 0) {
      setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
      setIsVideoPlaying(false);
    }
  };
  const prevMedia = () => {
    if (mediaItems.length > 0) {
      setCurrentMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
      setIsVideoPlaying(false);
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s+/g, "")}`;
  };

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/[\s+]/g, "")}`, "_blank");
  };

  const handleVideoTap = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] overflow-hidden p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {ad.advertiserPhoto && (
              <img src={ad.advertiserPhoto} alt={ad.advertiserName} className="h-7 w-7 rounded-full object-cover shrink-0" />
            )}
            <div className="min-w-0">
              <h2 className="font-semibold text-sm truncate">{ad.businessName}</h2>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="h-3 w-3 shrink-0" />
                <span>Sponsored</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto touch-auto">
          <div className="pb-6">
            {/* Media Carousel */}
            {mediaItems.length > 0 && (
              <div className="relative bg-muted aspect-[4/3] overflow-hidden">
                {currentItem?.type === 'video' ? (
                  <div className="relative w-full h-full bg-black" onClick={handleVideoTap}>
                    <video
                      ref={videoRef}
                      src={currentItem.url}
                      className="w-full h-full object-contain"
                      playsInline
                      muted
                      preload="metadata"
                      controls={isVideoPlaying}
                    />
                    {!isVideoPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-14 w-14 rounded-full bg-black/50 flex items-center justify-center">
                          <Play className="h-7 w-7 text-white ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <img
                    src={currentItem?.url}
                    alt={`Product ${currentMediaIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                {mediaItems.length > 1 && (
                  <>
                    <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 z-10" onClick={(e) => { e.stopPropagation(); prevMedia(); }}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 z-10" onClick={(e) => { e.stopPropagation(); nextMedia(); }}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {mediaItems.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i === currentMediaIndex ? "bg-white" : "bg-white/50"}`} />
                      ))}
                    </div>
                  </>
                )}
                {/* Sponsored Badge */}
                <Badge className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] border-0 shadow-md z-10">
                  <Megaphone className="h-3 w-3 mr-1" />
                  Sponsored Advert
                </Badge>
                {/* Stats Overlay */}
                <div className="absolute top-2 right-2 flex gap-1.5 z-10">
                  <Badge className="bg-black/60 text-white text-[10px] border-0">
                    <Eye className="h-3 w-3 mr-1" />{ad.views.toLocaleString()}
                  </Badge>
                  {ad.status === "active" && daysRemaining > 0 && (
                    <Badge className="bg-amber-600 text-white text-[10px] border-0">
                      <Calendar className="h-3 w-3 mr-1" />{daysRemaining}d left
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Title & Category */}
              <div className="space-y-1">
                <h3 className="font-bold text-lg leading-tight">{ad.businessName}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                    {getCategoryLabel(ad.category)}
                  </Badge>
                  <span className="text-sm text-primary font-medium">{ad.productTitle}</span>
                </div>
              </div>

              {/* City */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{ad.city}</span>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed">{ad.description}</p>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  size="sm"
                  className="flex-1 min-w-[100px] h-10 text-sm font-medium touch-manipulation active:scale-[0.97] bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleCall(ad.phone1)}
                >
                  <Phone className="h-3.5 w-3.5 mr-1.5" />
                  Call
                </Button>
                <Button
                  size="sm"
                  className="flex-1 min-w-[100px] h-10 text-sm font-medium touch-manipulation active:scale-[0.97] bg-green-600 hover:bg-green-700"
                  onClick={() => handleWhatsApp(ad.phone1)}
                >
                  💬 WhatsApp
                </Button>
                {ad.email && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 min-w-[80px] h-10 text-sm font-medium touch-manipulation"
                    onClick={() => (window.location.href = `mailto:${ad.email}`)}
                  >
                    <Mail className="h-3.5 w-3.5 mr-1.5" />
                    Email
                  </Button>
                )}
                {ad.website && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 min-w-[80px] h-10 text-sm font-medium touch-manipulation"
                    onClick={() => window.open(ad.website, "_blank")}
                  >
                    <Globe className="h-3.5 w-3.5 mr-1.5" />
                    Website
                  </Button>
                )}
              </div>

              {/* Phone 2 */}
              {ad.phone2 && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-9 text-xs touch-manipulation"
                    onClick={() => handleCall(ad.phone2!)}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call Alt: {ad.phone2}
                  </Button>
                </div>
              )}

              {/* Engagement Bar */}
              <div className="flex items-center justify-between pt-3 border-t text-muted-foreground">
                <button className="flex items-center gap-1.5 text-sm touch-manipulation">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm touch-manipulation">
                  <MessageSquare className="h-4 w-4" />
                  <span>{ad.feedbackCount}</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm touch-manipulation">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm text-destructive touch-manipulation">
                  <Flag className="h-4 w-4" />
                  <span>Report</span>
                </button>
              </div>

              {/* Advertiser Info */}
              <Card className="p-3 mt-2 bg-muted/30">
                <div className="flex items-center gap-2">
                  {ad.advertiserPhoto && (
                    <img src={ad.advertiserPhoto} alt={ad.advertiserName} className="h-8 w-8 rounded-full object-cover" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{ad.advertiserName}</p>
                    <p className="text-xs text-muted-foreground">{ad.communityName}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
