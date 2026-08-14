// src/components/community/advertisements/AdvertisementFullViewSheet.tsx
import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X, ChevronLeft, ChevronRight, MapPin, Phone, Mail, Globe,
  Megaphone, Eye, TrendingUp, Loader2, Play, Image,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API = "/api/community";

interface MediaItem { url: string; type: "image" | "video"; }
interface FullAd {
  id: string;
  business_name: string;
  product_title: string;
  category: string;
  description: string;
  city: string;
  phone1: string;
  phone2?: string;
  email?: string;
  website?: string;
  media: MediaItem[];
  views: number;
  clicks: number;
  status: string;
  created_at: string;
  advertiser_name: string;
  advertiser_photo?: string;
}

interface AdvertisementFullViewSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  adId?: string;
  communityId?: string;
}

export function AdvertisementFullViewSheet({
  open, onOpenChange, adId, communityId,
}: AdvertisementFullViewSheetProps) {
  const [ad,          setAd]          = useState<FullAd | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [mediaIndex,  setMediaIndex]  = useState(0);
  const [videoPlaying,setVideoPlaying]= useState(false);

  useEffect(() => {
    if (!open || !adId || !communityId) return;
    setAd(null); setError(null); setMediaIndex(0); setVideoPlaying(false);
    setLoading(true);
    fetch(`${API}/advertisements.php?community_id=${communityId}&ad_id=${adId}`, { credentials: "include" })
      .then(r => r.ok ? r.json() : r.json().then(d => { throw new Error(d.error || `HTTP ${r.status}`); }))
      .then(d => { if (d.ad) setAd(d.ad); else setError("Ad not found"); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [open, adId, communityId]);

  const media    = ad?.media ?? [];
  const hasMedia = media.length > 0;
  const current  = media[mediaIndex];

  const prev = () => { setVideoPlaying(false); setMediaIndex(i => (i - 1 + media.length) % media.length); };
  const next = () => { setVideoPlaying(false); setMediaIndex(i => (i + 1) % media.length); };

  const openPhone = (phone: string) => { window.open(`tel:${phone}`); };
  const openWA    = (phone: string) => { window.open(`https://wa.me/${phone.replace(/\D/g,"")}`, "_blank"); };
  const openEmail = (email: string) => { window.open(`mailto:${email}`); };
  const openWeb   = (url: string)   => { window.open(url.startsWith("http") ? url : `https://${url}`, "_blank"); };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[95vh] rounded-t-2xl flex flex-col p-0 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-amber-600" />
            <span className="font-semibold text-sm truncate max-w-[200px]">{ad?.business_name ?? "Advertisement"}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground p-6">
            <Megaphone className="h-12 w-12 opacity-30" />
            <p className="text-sm">{error}</p>
            <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        ) : ad && (
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="pb-8">

              {/* ── Media carousel ─────────────────────────────────────── */}
              {hasMedia ? (
                <div className="relative bg-black aspect-[4/3] overflow-hidden">
                  {current?.type === "video" ? (
                    <div className="relative w-full h-full" onClick={() => setVideoPlaying(v => !v)}>
                      <video
                        key={current.url}
                        src={current.url}
                        className="w-full h-full object-contain"
                        playsInline
                        controls={videoPlaying}
                        muted={!videoPlaying}
                        autoPlay={videoPlaying}
                      />
                      {!videoPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-14 w-14 rounded-full bg-black/50 flex items-center justify-center">
                            <Play className="h-7 w-7 text-white ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      key={current?.url}
                      src={current?.url}
                      alt={ad.product_title}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}

                  {/* Carousel nav */}
                  {media.length > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center z-10"
                        onClick={prev}
                      >
                        <ChevronLeft className="h-5 w-5 text-white" />
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center z-10"
                        onClick={next}
                      >
                        <ChevronRight className="h-5 w-5 text-white" />
                      </button>
                      {/* Dots */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {media.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => { setMediaIndex(i); setVideoPlaying(false); }}
                            className={cn("w-2 h-2 rounded-full transition-all", i === mediaIndex ? "bg-white scale-125" : "bg-white/50")}
                          />
                        ))}
                      </div>
                      <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full z-10">
                        {mediaIndex + 1}/{media.length}
                      </span>
                    </>
                  )}

                  {/* Sponsored badge */}
                  <Badge className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] border-0 z-10">
                    <Megaphone className="h-3 w-3 mr-1" />Sponsored
                  </Badge>
                </div>
              ) : (
                /* No media placeholder */
                <div className="aspect-[4/3] bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Image className="h-10 w-10 opacity-40" />
                  <p className="text-sm">No photos</p>
                </div>
              )}

              {/* ── Ad details ─────────────────────────────────────────── */}
              <div className="p-4 space-y-4">
                {/* Title + Category */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] capitalize">{ad.category}</Badge>
                    <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-1">
                      <Eye className="h-3 w-3" />{ad.views} · <TrendingUp className="h-3 w-3" />{ad.clicks}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg leading-tight">{ad.business_name}</h2>
                  <p className="text-sm font-medium text-primary mt-0.5">{ad.product_title}</p>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{ad.city}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">{ad.description}</p>

                {/* Contact buttons */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {ad.phone1 && (
                      <Button className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => openPhone(ad.phone1!)}>
                        <Phone className="h-4 w-4 mr-2" /> Call
                      </Button>
                    )}
                    {ad.phone1 && (
                      <Button className="h-11 bg-green-600 hover:bg-green-700 text-white" onClick={() => openWA(ad.phone1!)}>
                        💬 WhatsApp
                      </Button>
                    )}
                  </div>
                  {ad.phone2 && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="h-11" onClick={() => openPhone(ad.phone2!)}>
                        <Phone className="h-4 w-4 mr-2" /> Phone 2
                      </Button>
                      <Button variant="outline" className="h-11" onClick={() => openWA(ad.phone2!)}>
                        💬 WA 2
                      </Button>
                    </div>
                  )}
                  {(ad.email || ad.website) && (
                    <div className="grid grid-cols-2 gap-2">
                      {ad.email && (
                        <Button variant="outline" className="h-11" onClick={() => openEmail(ad.email!)}>
                          <Mail className="h-4 w-4 mr-2" /> Email
                        </Button>
                      )}
                      {ad.website && (
                        <Button variant="outline" className="h-11" onClick={() => openWeb(ad.website!)}>
                          <Globe className="h-4 w-4 mr-2" /> Website
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Advertiser */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={ad.advertiser_photo} />
                    <AvatarFallback>{(ad.advertiser_name || "M")[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{ad.advertiser_name}</p>
                    <p className="text-xs text-muted-foreground">Community Member</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
