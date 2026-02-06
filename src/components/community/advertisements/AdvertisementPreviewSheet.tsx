import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, MapPin, Phone, Mail, Globe, ThumbsUp, MessageSquare, Share2, ChevronLeft, ChevronRight, AlertCircle, Megaphone, Play } from "lucide-react";
import { useState, useRef } from "react";
import { getCategoryLabel } from "@/data/advertisementData";
import type { AdvertisementFormData } from "@/types/advertisementSystem";

interface AdvertisementPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: AdvertisementFormData;
}

export function AdvertisementPreviewSheet({ open, onOpenChange, formData }: AdvertisementPreviewSheetProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const mediaItems = formData.media;

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

  const currentItem = mediaItems[currentMediaIndex];

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
          <h2 className="font-semibold text-base">Advert Preview</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Preview Mode Banner */}
        <div className="bg-blue-50 dark:bg-blue-950/30 px-4 py-2 flex items-center gap-2 border-b flex-shrink-0">
          <AlertCircle className="h-4 w-4 text-blue-600 shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            <strong>Preview Mode</strong> — This is how your ad will appear to viewers
          </p>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto touch-auto">
          <div className="pb-6">
            {/* Media Carousel */}
            {mediaItems.length > 0 ? (
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 z-10"
                      onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 z-10"
                      onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {mediaItems.map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all ${i === currentMediaIndex ? "bg-white scale-110" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {/* Sponsored Badge */}
                <Badge className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] border-0 shadow-md z-10">
                  <Megaphone className="h-3 w-3 mr-1" />
                  Sponsored Advert
                </Badge>
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full z-10">
                  {currentMediaIndex + 1}/{mediaItems.length}
                </div>
              </div>
            ) : (
              <div className="bg-muted aspect-[4/3] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No photos or videos uploaded</p>
              </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Sponsored Label */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Globe className="h-3 w-3" />
                <span>Sponsored</span>
              </div>

              {/* Title & Category */}
              <div className="space-y-1">
                <h3 className="font-bold text-lg leading-tight">{formData.businessName || "Business Name"}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                    {getCategoryLabel(formData.category)}
                  </Badge>
                  <span className="text-sm text-primary font-medium">{formData.productTitle || "Product Title"}</span>
                </div>
              </div>

              {/* City */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{formData.city || "City"}</span>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-foreground">
                {formData.description || "Product or service description will appear here..."}
              </p>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.phone1 && (
                  <Button size="sm" className="flex-1 min-w-[100px] h-10 text-sm font-medium touch-manipulation bg-emerald-600 hover:bg-emerald-700">
                    <Phone className="h-3.5 w-3.5 mr-1.5" />
                    Call
                  </Button>
                )}
                {formData.phone1 && (
                  <Button size="sm" className="flex-1 min-w-[100px] h-10 text-sm font-medium touch-manipulation bg-green-600 hover:bg-green-700">
                    💬 WhatsApp
                  </Button>
                )}
                {formData.email && (
                  <Button size="sm" variant="outline" className="flex-1 min-w-[80px] h-10 text-sm font-medium touch-manipulation">
                    <Mail className="h-3.5 w-3.5 mr-1.5" />
                    Email
                  </Button>
                )}
                {formData.website && (
                  <Button size="sm" variant="outline" className="flex-1 min-w-[80px] h-10 text-sm font-medium touch-manipulation">
                    <Globe className="h-3.5 w-3.5 mr-1.5" />
                    Website
                  </Button>
                )}
              </div>

              {/* Simulated Engagement Bar */}
              <div className="flex items-center justify-between pt-3 border-t text-muted-foreground">
                <button className="flex items-center gap-1.5 text-sm">
                  <ThumbsUp className="h-4 w-4" />
                  <span>0</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  <span>0</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t bg-background flex-shrink-0">
          <Button
            className="w-full h-11 text-sm font-medium touch-manipulation active:scale-[0.97]"
            onClick={() => onOpenChange(false)}
          >
            Looks Good ✓
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
