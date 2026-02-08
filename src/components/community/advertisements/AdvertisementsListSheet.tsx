import { useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  X, MapPin, Eye, Calendar, Plus, Megaphone, Play, RefreshCw,
  Edit2, Pause, Trash2, MoreVertical,
} from "lucide-react";
import {
  getActiveAdvertisements,
  getMyActiveAdvertisements,
  getMyInactiveAdvertisements,
  getCategoryLabel,
  getAdvertisementStats,
} from "@/data/advertisementData";
import { calculateDaysRemaining, formatMobiAmount } from "@/lib/campaignFeeDistribution";
import { AdvertisementFullViewSheet } from "./AdvertisementFullViewSheet";
import { useToast } from "@/hooks/use-toast";
import type { EnhancedAdvertisement } from "@/types/advertisementSystem";

interface AdvertisementsListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "all_active" | "my_active" | "my_inactive";
  onCreateNew?: () => void;
}

export function AdvertisementsListSheet({
  open,
  onOpenChange,
  initialTab = "all_active",
  onCreateNew,
}: AdvertisementsListSheetProps) {
  const { toast } = useToast();
  const [selectedAd, setSelectedAd] = useState<EnhancedAdvertisement | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EnhancedAdvertisement | null>(null);

  const allActiveAds = getActiveAdvertisements();
  const myActiveAds = getMyActiveAdvertisements();
  const myInactiveAds = getMyInactiveAdvertisements();
  const stats = getAdvertisementStats();

  const openAdvert = (ad: EnhancedAdvertisement) => {
    setSelectedAd(ad);
    setShowFullView(true);
  };

  const handleReactivateAd = (ad: EnhancedAdvertisement, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Reactivate Advertisement",
      description: `Redirecting to renew "${ad.businessName}" subscription...`,
    });
  };

  const handleEditAd = (ad: EnhancedAdvertisement, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Edit Advertisement",
      description: `Opening editor for "${ad.productTitle}"...`,
    });
  };

  const handleTogglePause = (ad: EnhancedAdvertisement, e: React.MouseEvent) => {
    e.stopPropagation();
    const isPaused = ad.status === "paused";
    toast({
      title: isPaused ? "Advertisement Resumed" : "Advertisement Paused",
      description: isPaused
        ? `"${ad.productTitle}" is now live again.`
        : `"${ad.productTitle}" has been paused. You can resume it anytime.`,
    });
  };

  const handleDeleteAd = (ad: EnhancedAdvertisement, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget(ad);
  };

  const confirmDeleteAd = () => {
    if (deleteTarget) {
      toast({
        title: "Advertisement Deleted",
        description: `"${deleteTarget.productTitle}" has been permanently removed.`,
        variant: "destructive",
      });
      setDeleteTarget(null);
    }
  };

  // Public ad card (no management buttons)
  const PublicAdCard = ({ ad }: { ad: EnhancedAdvertisement }) => {
    const daysRemaining = calculateDaysRemaining(ad.endDate);
    const firstMedia = ad.media[0];

    return (
      <Card
        className="p-0 overflow-hidden touch-manipulation active:scale-[0.98] transition-transform"
        onClick={() => openAdvert(ad)}
      >
        <div className="flex gap-3 p-3">
          <AdThumbnail firstMedia={firstMedia} businessName={ad.businessName} />
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="font-semibold text-sm leading-tight truncate">{ad.businessName}</h4>
            <p className="text-xs text-primary font-medium truncate">{ad.productTitle}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-amber-600 text-white text-xs px-1.5 py-0 border-0">
                <Megaphone className="h-2.5 w-2.5 mr-0.5" />
                Sponsored
              </Badge>
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {getCategoryLabel(ad.category)}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{ad.city}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />{ad.views.toLocaleString()}
              </span>
              {daysRemaining > 0 && (
                <span className="flex items-center gap-1 text-amber-600">
                  <Calendar className="h-3 w-3" />{daysRemaining}d left
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // My ad card (with management buttons)
  const MyAdCard = ({ ad, showReactivate = false }: { ad: EnhancedAdvertisement; showReactivate?: boolean }) => {
    const daysRemaining = calculateDaysRemaining(ad.endDate);
    const isEnded = ad.status === "ended";
    const isPaused = ad.status === "paused";
    const firstMedia = ad.media[0];

    return (
      <Card className="p-0 overflow-hidden">
        {/* Clickable card body */}
        <div
          className="flex gap-3 p-3 touch-manipulation active:bg-muted/30 transition-colors"
          onClick={() => openAdvert(ad)}
        >
          <AdThumbnail firstMedia={firstMedia} businessName={ad.businessName} />
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="font-semibold text-sm leading-tight truncate">{ad.businessName}</h4>
            <p className="text-xs text-primary font-medium truncate">{ad.productTitle}</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge className="bg-amber-600 text-white text-xs px-1.5 py-0 border-0">
                <Megaphone className="h-2.5 w-2.5 mr-0.5" />
                Sponsored
              </Badge>
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {getCategoryLabel(ad.category)}
              </Badge>
              {isPaused && (
                <Badge variant="outline" className="text-xs px-1.5 py-0 text-amber-600 border-amber-300">
                  <Pause className="h-2.5 w-2.5 mr-0.5" />
                  Paused
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{ad.city}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />{ad.views.toLocaleString()}
              </span>
              {!isEnded && daysRemaining > 0 && (
                <span className="flex items-center gap-1 text-amber-600">
                  <Calendar className="h-3 w-3" />{daysRemaining}d left
                </span>
              )}
              {isEnded && (
                <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                  Ended
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Management Actions */}
        <div className="border-t px-3 py-2 flex gap-2">
          {showReactivate ? (
            <>
              <Button
                size="sm"
                className="flex-1 h-9 text-xs font-medium touch-manipulation active:scale-[0.97] bg-amber-600 hover:bg-amber-700"
                onClick={(e) => handleReactivateAd(ad, e)}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Reactivate
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 touch-manipulation active:scale-[0.97]"
                onClick={(e) => handleDeleteAd(ad, e)}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-9 text-xs font-medium touch-manipulation active:scale-[0.97]"
                onClick={(e) => handleEditAd(ad, e)}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-9 text-xs font-medium touch-manipulation active:scale-[0.97]"
                onClick={(e) => handleTogglePause(ad, e)}
              >
                {isPaused ? (
                  <>
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5 mr-1.5" />
                    Stop
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 touch-manipulation active:scale-[0.97]"
                onClick={(e) => handleDeleteAd(ad, e)}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </Card>
    );
  };

  // Shared thumbnail component
  const AdThumbnail = ({ firstMedia, businessName }: { firstMedia?: EnhancedAdvertisement["media"][0]; businessName: string }) => (
    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 relative">
      {firstMedia ? (
        firstMedia.type === 'video' ? (
          <div className="relative w-full h-full">
            <video
              src={firstMedia.url}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="h-7 w-7 rounded-full bg-black/60 flex items-center justify-center">
                <Play className="h-3.5 w-3.5 text-white ml-0.5" />
              </div>
            </div>
          </div>
        ) : (
          <img src={firstMedia.url} alt={businessName} className="w-full h-full object-cover" />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Megaphone className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
    </div>
  );

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] overflow-hidden p-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-amber-600" />
              <h2 className="font-semibold text-base">Advertisements</h2>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-1 px-4 py-2 border-b flex-shrink-0">
            <div className="text-center p-1.5 bg-emerald-50 dark:bg-emerald-950/20 rounded">
              <p className="text-sm font-bold text-emerald-600">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="text-center p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded">
              <p className="text-sm font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="text-center p-1.5 bg-amber-50 dark:bg-amber-950/20 rounded">
              <p className="text-sm font-bold text-amber-600">{formatMobiAmount(stats.totalFees)}</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
          </div>

          <Tabs defaultValue={initialTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-2 pb-1 flex-shrink-0">
              <TabsList className="w-full grid grid-cols-3 h-10">
                <TabsTrigger value="all_active" className="text-xs px-1 touch-manipulation">
                  Active ({allActiveAds.length})
                </TabsTrigger>
                <TabsTrigger value="my_active" className="text-xs px-1 touch-manipulation">
                  My Adverts ({myActiveAds.length})
                </TabsTrigger>
                <TabsTrigger value="my_inactive" className="text-xs px-1 touch-manipulation">
                  Ended ({myInactiveAds.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 overflow-y-auto overflow-x-hidden touch-auto">
              <TabsContent value="all_active" className="px-4 py-3 space-y-2 mt-0">
                {allActiveAds.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No active advertisements</p>
                ) : (
                  allActiveAds.map((ad) => <PublicAdCard key={ad.id} ad={ad} />)
                )}
              </TabsContent>

              <TabsContent value="my_active" className="px-4 py-3 space-y-3 mt-0">
                {myActiveAds.length === 0 ? (
                  <div className="text-center py-8">
                    <Megaphone className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">You have no active ads</p>
                    <p className="text-xs text-muted-foreground mt-1">Create one to start promoting your business</p>
                  </div>
                ) : (
                  myActiveAds.map((ad) => <MyAdCard key={ad.id} ad={ad} />)
                )}
              </TabsContent>

              <TabsContent value="my_inactive" className="px-4 py-3 space-y-3 mt-0">
                {myInactiveAds.length === 0 ? (
                  <div className="text-center py-8">
                    <Megaphone className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">You have no inactive ads</p>
                  </div>
                ) : (
                  myInactiveAds.map((ad) => <MyAdCard key={ad.id} ad={ad} showReactivate />)
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>

          {/* FAB */}
          {onCreateNew && (
            <div className="absolute bottom-4 right-4">
              <Button
                className="h-12 w-12 rounded-full shadow-lg bg-amber-600 hover:bg-amber-700 touch-manipulation active:scale-[0.95]"
                onClick={() => {
                  onOpenChange(false);
                  onCreateNew();
                }}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      <AdvertisementFullViewSheet
        open={showFullView}
        onOpenChange={setShowFullView}
        advertisement={selectedAd}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Advertisement?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to permanently delete{" "}
                <strong>"{deleteTarget?.productTitle}"</strong>?
              </p>
              <p className="text-xs">
                This action cannot be undone. All stats and data for this ad will be lost.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="touch-manipulation">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAd}
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
