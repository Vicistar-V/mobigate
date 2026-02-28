import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Image as ImageIcon, CalendarDays, Tv, Mail, Gamepad2, Heart, MessageCircle, Share2, UserPlus, Flag, CheckCircle, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, ChevronDown, ChevronUp, Users, Eye, Trophy, Zap, ExternalLink, Ticket, Store } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { mockMerchants, mockSeasons, type QuizSeason } from "@/data/mobigateInteractiveQuizData";
import { getMerchantHomeData, formatCount, type MerchantGalleryItem } from "@/data/merchantHomeData";
import { allLocationMerchants } from "@/data/nigerianLocationsData";
import { MediaGalleryViewer, type MediaItem } from "@/components/MediaGalleryViewer";
import { CommentDialog } from "@/components/CommentDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { LiveScoreboardDrawer } from "@/components/community/mobigate-quiz/LiveScoreboardDrawer";
import { HighlightedWinnersCarousel } from "@/components/community/mobigate-quiz/HighlightedWinnersCarousel";
import { shareViaNative, copyToClipboard } from "@/lib/shareUtils";
import { format } from "date-fns";

const linkIcons: Record<string, any> = {
  globe: Globe, facebook: Facebook, twitter: Twitter,
  instagram: Instagram, youtube: Youtube, linkedin: Linkedin,
};

function getSeasonStatusBadge(season: QuizSeason) {
  if (season.isLive) return <Badge className="bg-red-500 text-white animate-pulse text-xs">🔴 LIVE</Badge>;
  if (season.status === "open") return <Badge className="bg-emerald-500 text-white text-xs">Upcoming</Badge>;
  if (season.status === "in_progress") return <Badge className="bg-amber-500 text-white text-xs">In Progress</Badge>;
  return <Badge variant="secondary" className="text-xs">Completed</Badge>;
}

export default function MerchantHomePage() {
  const { merchantId } = useParams<{ merchantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const quizMerchant = mockMerchants.find(m => m.id === merchantId);
  const locationMerchant = allLocationMerchants.find(m => m.id === merchantId);
  
  // Build a unified merchant object
  const merchant = quizMerchant 
    ? quizMerchant 
    : locationMerchant 
      ? { id: locationMerchant.id, name: locationMerchant.name, logo: locationMerchant.logo, category: locationMerchant.category, isVerified: locationMerchant.isVerified }
      : undefined;

  const homeData = merchantId ? getMerchantHomeData(merchantId) : null;
  const seasons = mockSeasons.filter(s => s.merchantId === merchantId);

  const upcomingSeasons = seasons.filter(s => s.status === "open" || s.status === "in_progress" || s.isLive);
  const pastSeasons = seasons.filter(s => s.status === "completed");

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(homeData?.likes ?? 0);
  const [followerCount, setFollowerCount] = useState(homeData?.followers ?? 0);
  const [showPastShows, setShowPastShows] = useState(false);
  const [galleryViewerOpen, setGalleryViewerOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryType, setGalleryType] = useState<"photo" | "video">("photo");
  const [commentOpen, setCommentOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [scoreboardOpen, setScoreboardOpen] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [eventDrawerOpen, setEventDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ date: string; label: string; type: string; seasonId?: string } | null>(null);

  const galleryMediaItems: MediaItem[] = useMemo(() =>
    (homeData?.gallery ?? []).map(g => ({
      id: g.id, url: g.url, type: "photo" as const, title: g.caption,
      author: merchant?.name ?? "", authorImage: merchant?.logo,
    })), [homeData, merchant]);

  const videoMediaItems: MediaItem[] = useMemo(() =>
    (homeData?.videoHighlights ?? []).map(v => ({
      id: v.id, url: v.url, type: "video" as const, title: v.caption,
      author: merchant?.name ?? "", authorImage: merchant?.logo,
    })), [homeData, merchant]);

  const calendarEvents = useMemo(() => {
    const events: { date: string; label: string; type: string; seasonId?: string }[] = [];
    seasons.forEach(s => {
      events.push({ date: s.startDate, label: `${s.name} — Start`, type: "start", seasonId: s.id });
      events.push({ date: s.endDate, label: `${s.name} — End`, type: "end", seasonId: s.id });
      s.selectionProcesses.forEach((sp, i) => {
        events.push({ date: s.startDate, label: `${s.name} — Selection Round ${i + 1}`, type: "selection", seasonId: s.id });
      });
      s.tvShowRounds.forEach(tv => {
        events.push({ date: s.endDate, label: `${s.name} — ${tv.label}`, type: "tv", seasonId: s.id });
      });
    });
    return events.sort((a, b) => a.date.localeCompare(b.date));
  }, [seasons]);

  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-muted-foreground text-base">Merchant not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const handleFollow = () => {
    setIsFollowing(prev => !prev);
    setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
    toast({ title: isFollowing ? "Unfollowed" : "Following!", description: merchant.name });
  };

  const handleLike = () => {
    setIsLiked(prev => !prev);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleReport = () => {
    toast({ title: "Report Submitted", description: "Thank you for your feedback." });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/merchant-home/${merchantId}`;
    const shared = await shareViaNative(merchant.name, homeData?.about ?? `Check out ${merchant.name}!`, url);
    if (!shared) {
      setShareOpen(true);
    }
  };

  const openGallery = (index: number, type: "photo" | "video") => {
    setGalleryIndex(index);
    setGalleryType(type);
    setGalleryViewerOpen(true);
  };

  const handleEventClick = (ev: { date: string; label: string; type: string; seasonId?: string }) => {
    setSelectedEvent(ev);
    setEventDrawerOpen(true);
  };

  const quickActions = [
    { icon: Gamepad2, label: "Play Quiz", color: "from-orange-500 to-amber-500", onClick: () => navigate(`/mobi-quiz-games/merchant/${merchantId}`) },
    { icon: ImageIcon, label: "Gallery", color: "from-pink-500 to-rose-500", onClick: () => document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" }) },
    { icon: CalendarDays, label: "Events", color: "from-violet-500 to-purple-500", onClick: () => document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" }) },
    { icon: Tv, label: "Shows", color: "from-cyan-500 to-blue-500", onClick: () => document.getElementById("shows-section")?.scrollIntoView({ behavior: "smooth" }) },
    { icon: Zap, label: "Live", color: "from-red-500 to-pink-500", onClick: () => setScoreboardOpen(true) },
    { icon: Mail, label: "Contact", color: "from-emerald-500 to-green-500", onClick: () => document.getElementById("links-section")?.scrollIntoView({ behavior: "smooth" }) },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Hero Banner */}
      <div className="relative">
        <div
          className="h-48 bg-gradient-to-br from-primary via-accent to-primary/80 bg-cover bg-center"
          style={homeData?.coverImage ? { backgroundImage: `linear-gradient(to bottom, hsl(var(--primary) / 0.6), hsl(var(--accent) / 0.8)), url(${homeData.coverImage})` } : undefined}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 text-primary-foreground">
          <Avatar className="h-20 w-20 border-4 border-background shadow-lg -mb-2">
            <AvatarImage src={merchant.logo} alt={merchant.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">{merchant.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Merchant Info */}
      <div className="px-4 pt-4 pb-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-lg font-bold">{merchant.name}</h1>
          {merchant.isVerified && <CheckCircle className="h-5 w-5 text-blue-500 shrink-0" />}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{merchant.category}</p>
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="text-center">
            <p className="text-base font-bold">{formatCount(followerCount)}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold">{formatCount(likeCount)}</p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold">{seasons.length}</p>
            <p className="text-xs text-muted-foreground">Shows</p>
          </div>
        </div>

        {/* Action Buttons Row — Like, Follow, Comment, Share, Report */}
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          <Button
            size="sm"
            variant={isLiked ? "default" : "outline"}
            className={`h-10 touch-manipulation active:scale-95 ${isLiked ? "bg-red-500 hover:bg-red-600 text-white border-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-white" : ""}`} />
            {isLiked ? "Liked" : "Like"}
          </Button>
          <Button
            size="sm"
            className={`h-10 touch-manipulation active:scale-95 ${isFollowing ? "bg-muted text-foreground hover:bg-muted/80" : "bg-primary text-primary-foreground"}`}
            onClick={handleFollow}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            {isFollowing ? "Following" : "Follow"}
          </Button>
          <Button size="sm" variant="outline" className="h-10 touch-manipulation active:scale-95" onClick={() => setCommentOpen(true)}>
            <MessageCircle className="h-4 w-4 mr-1" /> Comment
          </Button>
          <Button size="sm" variant="outline" className="h-10 touch-manipulation active:scale-95" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
          <Button size="sm" variant="outline" className="h-10 touch-manipulation active:scale-95" onClick={handleReport}>
            <Flag className="h-4 w-4 mr-1" /> Report
          </Button>
        </div>

        {/* Voucher CTA */}
        <div className="mt-4 px-2">
          <button
            onClick={() => navigate(`/buy-vouchers?merchant=${encodeURIComponent(merchant.name)}`)}
            className="w-full relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-lg active:scale-[0.97] transition-transform touch-manipulation"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/30" />
              <div className="absolute -left-2 -bottom-2 h-16 w-16 rounded-full bg-white/20" />
            </div>
            <div className="relative flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-bold text-sm">Get Vouchers & Bundles</p>
                <p className="text-xs text-white/80 mt-0.5">Save up to 20% on Mobi top-ups</p>
              </div>
              <ExternalLink className="h-4 w-4 text-white/60 shrink-0" />
            </div>
          </button>
        </div>

        {/* Apply as Sub-Merchant CTA */}
        <div className="mt-3 px-2">
          <button
            onClick={() => navigate(`/apply-sub-merchant/${merchantId}`)}
            className="w-full rounded-2xl p-3 border-2 border-primary/30 bg-primary/5 flex items-center gap-3 active:scale-[0.97] transition-transform touch-manipulation"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-bold text-sm text-foreground">Apply as Sub-Merchant</p>
              <p className="text-xs text-muted-foreground mt-0.5">Become a retailer for this merchant</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        </div>

        {homeData?.about && (
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{homeData.about}</p>
        )}
      </div>

      {/* Quick Actions Bar */}
      <div className="px-4 py-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
          {quickActions.map(action => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-1.5 min-w-[64px] shrink-0 touch-manipulation active:scale-95"
              onClick={action.onClick}
            >
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Video Card */}
      {upcomingSeasons.some(s => s.isLive) && (
        <div className="px-4 pb-3">
          <Card
            className="relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 cursor-pointer active:scale-[0.98] transition-transform touch-manipulation"
            onClick={() => setScoreboardOpen(true)}
          >
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center">
                <Play className="h-7 w-7 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <Badge className="bg-white/30 text-white text-xs mb-1">🔴 LIVE NOW</Badge>
                <p className="font-semibold text-sm truncate">{upcomingSeasons.find(s => s.isLive)?.name}</p>
                <p className="text-xs text-white/80">{formatCount(upcomingSeasons.find(s => s.isLive)?.totalParticipants ?? 0)} watching</p>
              </div>
              <Eye className="h-5 w-5 text-white/70 shrink-0" />
            </div>
          </Card>
        </div>
      )}

      {/* Image Gallery */}
      {(homeData?.gallery?.length ?? 0) > 0 && (
        <section id="gallery-section" className="py-3">
          <div className="flex items-center justify-between px-4 mb-2">
            <h2 className="text-base font-bold flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-pink-500" /> Gallery
            </h2>
            <button className="text-sm text-primary font-medium touch-manipulation" onClick={() => setShowAllGallery(true)}>View All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
            {homeData!.gallery.map((img, i) => (
              <div
                key={img.id}
                className="shrink-0 w-36 rounded-xl overflow-hidden shadow-md cursor-pointer active:scale-95 transition-transform touch-manipulation"
                onClick={() => openGallery(i, "photo")}
              >
                <img src={img.url} alt={img.caption} className="h-28 w-full object-cover" loading="lazy" />
                <p className="text-xs p-2 truncate text-foreground">{img.caption}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery View All Drawer */}
      <Drawer open={showAllGallery} onOpenChange={setShowAllGallery}>
        <DrawerContent className="max-h-[95vh] flex flex-col">
          <DrawerHeader className="shrink-0">
            <DrawerTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-pink-500" /> All Photos
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-3 pb-4">
            <div className="grid grid-cols-2 gap-2">
              {homeData?.gallery.map((img, i) => (
                <div
                  key={img.id}
                  className="rounded-xl overflow-hidden shadow-md cursor-pointer active:scale-95 transition-transform touch-manipulation"
                  onClick={() => { setShowAllGallery(false); openGallery(i, "photo"); }}
                >
                  <img src={img.url} alt={img.caption} className="h-32 w-full object-cover" loading="lazy" />
                  <p className="text-xs p-2 truncate text-foreground">{img.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Video Highlights */}
      {(homeData?.videoHighlights?.length ?? 0) > 0 && (
        <section className="py-3">
          <div className="flex items-center justify-between px-4 mb-2">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Play className="h-4 w-4 text-cyan-500" /> Video Highlights
            </h2>
            <button className="text-sm text-primary font-medium touch-manipulation" onClick={() => setShowAllVideos(true)}>View All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
            {homeData!.videoHighlights.map((vid, i) => (
              <div
                key={vid.id}
                className="shrink-0 w-44 rounded-xl overflow-hidden shadow-md cursor-pointer active:scale-95 transition-transform touch-manipulation relative"
                onClick={() => openGallery(i, "video")}
              >
                <img src={vid.url} alt={vid.caption} className="h-28 w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-5 w-5 text-foreground fill-foreground ml-0.5" />
                  </div>
                </div>
                <p className="text-xs p-2 truncate text-foreground">{vid.caption}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Video View All Drawer */}
      <Drawer open={showAllVideos} onOpenChange={setShowAllVideos}>
        <DrawerContent className="max-h-[95vh] flex flex-col">
          <DrawerHeader className="shrink-0">
            <DrawerTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-cyan-500" /> All Videos
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-3 pb-4">
            <div className="space-y-3">
              {homeData?.videoHighlights.map((vid, i) => (
                <div
                  key={vid.id}
                  className="rounded-xl overflow-hidden shadow-md cursor-pointer active:scale-95 transition-transform touch-manipulation relative"
                  onClick={() => { setShowAllVideos(false); openGallery(i, "video"); }}
                >
                  <img src={vid.url} alt={vid.caption} className="h-44 w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="h-6 w-6 text-foreground fill-foreground ml-0.5" />
                    </div>
                  </div>
                  <p className="text-sm p-3 text-foreground font-medium">{vid.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Upcoming Shows */}
      {upcomingSeasons.length > 0 && (
        <section id="shows-section" className="py-3 px-4">
          <h2 className="text-base font-bold flex items-center gap-2 mb-3">
            <Tv className="h-4 w-4 text-blue-500" /> Upcoming & Live Shows
          </h2>
          <div className="space-y-3">
            {upcomingSeasons.map(season => (
              <Card
                key={season.id}
                className="p-4 cursor-pointer active:scale-[0.98] transition-transform border-l-4 border-l-primary touch-manipulation"
                onClick={() => navigate(`/mobi-quiz-games/merchant/${merchantId}`)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {getSeasonStatusBadge(season)}
                      <Badge variant="outline" className="text-xs">{season.type}</Badge>
                    </div>
                    <p className="font-semibold text-sm">{season.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(season.startDate), "MMM d, yyyy")} — {format(new Date(season.endDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">₦{(season.totalWinningPrizes / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-muted-foreground">{formatCount(season.totalParticipants)} players</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Past Shows */}
      {pastSeasons.length > 0 && (
        <section className="py-3 px-4">
          <Collapsible open={showPastShows} onOpenChange={setShowPastShows}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 w-full text-left mb-2 touch-manipulation">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" /> Past Shows ({pastSeasons.length})
                </h2>
                {showPastShows ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-3">
                {pastSeasons.map(season => (
                  <Card key={season.id} className="p-4 bg-muted/30">
                    <p className="font-semibold text-sm">{season.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(season.startDate), "MMM d")} — {format(new Date(season.endDate), "MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatCount(season.totalParticipants)} participants • ₦{(season.totalWinningPrizes / 1000000).toFixed(1)}M prizes</p>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>
      )}

      {/* Highlighted Winners */}
      <section className="py-3">
        <HighlightedWinnersCarousel />
      </section>

      {/* Events & Calendar */}
      {calendarEvents.length > 0 && (
        <section id="events-section" className="py-3 px-4">
          <h2 className="text-base font-bold flex items-center gap-2 mb-3">
            <CalendarDays className="h-4 w-4 text-violet-500" /> Events & Calendar
          </h2>
          <div className="space-y-2">
            {calendarEvents.slice(0, 8).map((ev, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-muted/40 cursor-pointer active:bg-muted/60 transition-colors touch-manipulation"
                onClick={() => handleEventClick(ev)}
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {format(new Date(ev.date), "dd")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{ev.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(ev.date), "MMMM yyyy")}</p>
                    <Badge
                      variant="outline"
                      className="text-xs capitalize mt-1"
                    >
                      {ev.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Event Detail Drawer */}
      <Drawer open={eventDrawerOpen} onOpenChange={setEventDrawerOpen}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <DrawerHeader className="shrink-0">
            <DrawerTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-violet-500" /> Event Details
            </DrawerTitle>
          </DrawerHeader>
          {selectedEvent && (
            <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 pb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold shrink-0">
                    {format(new Date(selectedEvent.date), "dd")}
                  </div>
                  <div>
                    <p className="text-base font-semibold">{selectedEvent.label}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(selectedEvent.date), "EEEE, MMMM d, yyyy")}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm capitalize">{selectedEvent.type}</Badge>
                <div className="p-4 rounded-xl bg-muted/40 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.type === "start" && "This marks the beginning of the quiz season. Players can register and start competing!"}
                    {selectedEvent.type === "end" && "The season concludes on this date. Final scores and winners will be announced."}
                    {selectedEvent.type === "selection" && "A selection round where contestants compete to qualify for the next phase."}
                    {selectedEvent.type === "tv" && "A televised show round broadcast live. Tune in to watch the action!"}
                  </p>
                </div>
                {selectedEvent.seasonId && (
                  <Button
                    className="w-full h-12 touch-manipulation active:scale-95"
                    onClick={() => {
                      setEventDrawerOpen(false);
                      navigate(`/mobi-quiz-games/merchant/${merchantId}`);
                    }}
                  >
                    <Gamepad2 className="h-4 w-4 mr-2" /> Go to Season
                  </Button>
                )}
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* External Links */}
      {(homeData?.links?.length ?? 0) > 0 && (
        <section id="links-section" className="py-3 px-4 pb-6">
          <h2 className="text-base font-bold flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-emerald-500" /> Links
          </h2>
          <div className="space-y-2">
            {homeData!.links.map(link => {
              const Icon = linkIcons[link.icon] || Globe;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 active:bg-muted/60 transition-colors touch-manipulation"
                >
                  <Icon className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-medium flex-1">{link.label}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Dialogs & Drawers */}
      <MediaGalleryViewer
        open={galleryViewerOpen}
        onOpenChange={setGalleryViewerOpen}
        items={galleryType === "photo" ? galleryMediaItems : videoMediaItems}
        initialIndex={galleryIndex}
        galleryType={galleryType === "photo" ? "gallery" : "video-highlights"}
      />
      <CommentDialog
        open={commentOpen}
        onOpenChange={setCommentOpen}
        post={{
          title: merchant.name,
          author: merchant.name,
          authorProfileImage: merchant.logo,
          type: "Photo",
          imageUrl: homeData?.coverImage,
        }}
      />
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        shareUrl={`${window.location.origin}/merchant-home/${merchantId}`}
        title={merchant.name}
        description={homeData?.about ?? `Check out ${merchant.name} on Mobigate!`}
      />
      <LiveScoreboardDrawer open={scoreboardOpen} onOpenChange={setScoreboardOpen} />
    </div>
  );
}
