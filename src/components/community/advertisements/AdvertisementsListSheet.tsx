import { useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, MapPin, Eye, Calendar, Plus, Megaphone } from "lucide-react";
import {
  getActiveAdvertisements,
  getMyAdvertisements,
  getEndedAdvertisements,
  getCategoryLabel,
  getAdvertisementStats,
} from "@/data/advertisementData";
import { calculateDaysRemaining, formatMobiAmount } from "@/lib/campaignFeeDistribution";
import { AdvertisementFullViewSheet } from "./AdvertisementFullViewSheet";
import type { EnhancedAdvertisement } from "@/types/advertisementSystem";

interface AdvertisementsListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "active" | "mine" | "ended";
  onCreateNew?: () => void;
}

export function AdvertisementsListSheet({
  open,
  onOpenChange,
  initialTab = "active",
  onCreateNew,
}: AdvertisementsListSheetProps) {
  const [selectedAd, setSelectedAd] = useState<EnhancedAdvertisement | null>(null);
  const [showFullView, setShowFullView] = useState(false);

  const activeAds = getActiveAdvertisements();
  const myAds = getMyAdvertisements();
  const endedAds = getEndedAdvertisements();
  const stats = getAdvertisementStats();

  const openAdvert = (ad: EnhancedAdvertisement) => {
    setSelectedAd(ad);
    setShowFullView(true);
  };

  const AdCard = ({ ad }: { ad: EnhancedAdvertisement }) => {
    const daysRemaining = calculateDaysRemaining(ad.endDate);
    const isEnded = ad.status === "ended";

    return (
      <Card
        className="p-0 overflow-hidden touch-manipulation active:scale-[0.98] transition-transform"
        onClick={() => openAdvert(ad)}
      >
        <div className="flex gap-3 p-3">
          {/* Thumbnail */}
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
            {ad.photos.length > 0 ? (
              <img src={ad.photos[0]} alt={ad.businessName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Megaphone className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="font-semibold text-sm leading-tight truncate">{ad.businessName}</h4>
            <p className="text-xs text-primary font-medium truncate">{ad.productTitle}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-amber-600 text-white text-[10px] px-1.5 py-0 border-0">
                <Megaphone className="h-2.5 w-2.5 mr-0.5" />
                Sponsored
              </Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {getCategoryLabel(ad.category)}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{ad.city}</span>
              </div>
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
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
                  Ended
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

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
              <p className="text-[10px] text-muted-foreground">Active</p>
            </div>
            <div className="text-center p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded">
              <p className="text-sm font-bold text-blue-600">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
            <div className="text-center p-1.5 bg-amber-50 dark:bg-amber-950/20 rounded">
              <p className="text-sm font-bold text-amber-600">{formatMobiAmount(stats.totalFees)}</p>
              <p className="text-[10px] text-muted-foreground">Revenue</p>
            </div>
          </div>

          <Tabs defaultValue={initialTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="w-full justify-start px-4 pt-2 bg-transparent flex-shrink-0">
              <TabsTrigger value="active" className="text-xs flex-1">Active ({activeAds.length})</TabsTrigger>
              <TabsTrigger value="mine" className="text-xs flex-1">My Adverts ({myAds.length})</TabsTrigger>
              <TabsTrigger value="ended" className="text-xs flex-1">Ended ({endedAds.length})</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 overflow-y-auto touch-auto">
              <TabsContent value="active" className="p-3 space-y-2 mt-0">
                {activeAds.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No active advertisements</p>
                ) : (
                  activeAds.map((ad) => <AdCard key={ad.id} ad={ad} />)
                )}
              </TabsContent>

              <TabsContent value="mine" className="p-3 space-y-2 mt-0">
                {myAds.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">You haven't created any ads yet</p>
                ) : (
                  myAds.map((ad) => <AdCard key={ad.id} ad={ad} />)
                )}
              </TabsContent>

              <TabsContent value="ended" className="p-3 space-y-2 mt-0">
                {endedAds.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No ended advertisements</p>
                ) : (
                  endedAds.map((ad) => <AdCard key={ad.id} ad={ad} />)
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
    </>
  );
}
