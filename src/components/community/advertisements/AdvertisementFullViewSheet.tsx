import { useState, useRef } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  X, MapPin, Phone, Mail, Globe, ChevronLeft, ChevronRight,
  Flag, Eye, Calendar, ThumbsUp, MessageSquare, Share2, Megaphone, Play,
  MoreVertical, Edit2, Pause, Trash2, PlayCircle,
} from "lucide-react";
import { getCategoryLabel } from "@/data/advertisementData";
import { formatMobiAmount, calculateDaysRemaining } from "@/lib/campaignFeeDistribution";
import { useToast } from "@/hooks/use-toast";
import type { EnhancedAdvertisement } from "@/types/advertisementSystem";

interface AdvertisementFullViewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advertisement: EnhancedAdvertisement | null;
  isOwner?: boolean;
}

export function AdvertisementFullViewSheet({ open, onOpenChange, advertisement, isOwner = false }: AdvertisementFullViewSheetProps) {
  const { toast } = useToast();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!advertisement) return null;

  const ad = advertisement;
  const daysRemaining = calculateDaysRemaining(ad.endDate);
  const mediaItems = ad.media;
  const currentItem = mediaItems[currentMediaIndex];
  const isPaused = ad.status === "paused";
  const isActive = ad.status === "active";

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

  const handleEditAd = () => {
    toast({
      title: "Edit Advertisement",
      description: `Opening editor for "${ad.productTitle}"...`,
    });
  };

  const handleTogglePause = () => {
    toast({
      title: isPaused ? "Advertisement Resumed" : "Advertisement Paused",
      description: isPaused
        ? `"${ad.productTitle}" is now live again.`
        : `"${ad.productTitle}" has been paused. You can resume it anytime.`,
    });
  };

  const handleDeleteConfirm = () => {
    toast({
      title: "Advertisement Deleted",
      description: `"${ad.productTitle}" has been permanently removed.`,
      variant: "destructive",
    });
    setShowDeleteConfirm(false);
    onOpenChange(false);
  };

  return (
    <>
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
                    {isActive && daysRemaining > 0 && (
                      <Badge className="bg-amber-600 text-white text-[10px] border-0">
                        <Calendar className="h-3 w-3 mr-1" />{daysRemaining}d left
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Title & Category + Owner Menu */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg leading-tight flex-1 min-w-0 break-words">{ad.businessName}</h3>
                    {isOwner && (
                      <DropdownMenu modal={true}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 shrink-0 rounded-full touch-manipulation active:scale-[0.95]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 z-[100]">
                          <DropdownMenuItem
                            onClick={handleEditAd}
                            className="py-2.5 text-sm touch-manipulation"
                          >
                            <Edit2 className="h-4 w-4 mr-2.5" />
                            Edit Advertisement
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={handleTogglePause}
                            className="py-2.5 text-sm touch-manipulation"
                          >
                            {isPaused ? (
                              <>
                                <PlayCircle className="h-4 w-4 mr-2.5" />
                                Resume Advertisement
                              </>
                            ) : (
                              <>
                                <Pause className="h-4 w-4 mr-2.5" />
                                Stop Advertisement
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setShowDeleteConfirm(true)}
                            className="py-2.5 text-sm text-destructive focus:text-destructive touch-manipulation"
                          >
                            <Trash2 className="h-4 w-4 mr-2.5" />
                            Delete Advertisement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {getCategoryLabel(ad.category)}
                    </Badge>
                    <span className="text-sm text-primary font-medium">{ad.productTitle}</span>
                    {isPaused && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0 text-amber-600 border-amber-300">
                        <Pause className="h-2.5 w-2.5 mr-0.5" />
                        Paused
                      </Badge>
                    )}
                  </div>
                </div>

                {/* City */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{ad.city}</span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed">{ad.description}</p>

                {/* Contact Buttons - Row 1: Call + WhatsApp */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    size="sm"
                    className="h-10 text-sm font-medium touch-manipulation active:scale-[0.97] bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleCall(ad.phone1)}
                  >
                    <Phone className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    className="h-10 text-sm font-medium touch-manipulation active:scale-[0.97] bg-green-600 hover:bg-green-700"
                    onClick={() => handleWhatsApp(ad.phone1)}
                  >
                    <span className="mr-1.5 shrink-0">💬</span>
                    WhatsApp
                  </Button>
                </div>

                {/* Contact Buttons - Row 2: Email + Website */}
                {(ad.email || ad.website) && (
                  <div className="grid grid-cols-2 gap-2">
                    {ad.email && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-10 text-sm font-medium touch-manipulation active:scale-[0.97]"
                        onClick={() => (window.location.href = `mailto:${ad.email}`)}
                      >
                        <Mail className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                        Email
                      </Button>
                    )}
                    {ad.website && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-10 text-sm font-medium touch-manipulation active:scale-[0.97]"
                        onClick={() => window.open(ad.website, "_blank")}
                      >
                        <Globe className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                        Website
                      </Button>
                    )}
                  </div>
                )}

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
                  <button className="flex items-center gap-1.5 text-sm touch-manipulation active:scale-[0.95]">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm touch-manipulation active:scale-[0.95]">
                    <MessageSquare className="h-4 w-4" />
                    <span>{ad.feedbackCount}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm touch-manipulation active:scale-[0.95]">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-destructive touch-manipulation active:scale-[0.95]">
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

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Advertisement?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to permanently delete{" "}
                <strong>"{ad.productTitle}"</strong>?
              </p>
              <p className="text-xs">
                This action cannot be undone. All stats and data for this ad will be lost.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="touch-manipulation">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 touch-manipulation"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
