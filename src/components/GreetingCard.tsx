import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, ChevronLeft, ChevronRight, ImagePlus, BadgeCheck, Images, Plus, Maximize2, PenSquare, FilePlus2, LayoutList } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CreatePostDialog } from "./CreatePostDialog";
import { EditPostDialog } from "./EditPostDialog";
import {
  Dialog as ActionDialog,
  DialogContent as ActionDialogContent,
  DialogHeader as ActionDialogHeader,
  DialogTitle as ActionDialogTitle,
  DialogDescription as ActionDialogDescription,
} from "@/components/ui/dialog";
import { PeopleYouMayKnow } from "./PeopleYouMayKnow";
import { useServiceUnavailableDialog } from "@/hooks/useServiceUnavailableDialog";
import { useState, useEffect, useRef } from "react";
import { UserTagBadges } from "./UserTagBadges";
import { useUserProfile, useCurrentUserId, useFeedPosts } from "@/hooks/useWindowData";
import { feedPosts as fallbackFeedPosts } from "@/data/posts";
import heroAdBanner from "@/assets/hero-ad-banner.jpg";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";
import { WallBannerSlideshow } from "@/components/wall-banner/WallBannerSlideshow";
import { WallBannerManagerDialog } from "@/components/wall-banner/WallBannerManagerDialog";
import { PostDetailDialog } from "@/components/PostDetailDialog";

export const GreetingSection = () => {
  const profile = useUserProfile();
  const navigate = useNavigate();
  const currentUserId = useCurrentUserId();
  const phpFeedPosts = useFeedPosts();
  const allPosts = phpFeedPosts || fallbackFeedPosts;

  // Active posting-area tab — drives which slice of content is shown in place.
  const [activeFeedTab, setActiveFeedTab] = useState<"Stories" | "Vibes & Flexing" | "Breaking News">("Stories");

  // Per-tab metadata: contextual keywords used to surface relevant content,
  // and the label shown on the "see more" footer link.
  const TAB_META = {
    "Stories": {
      keywords: [] as string[],
      moreLabel: "Enjoy more exciting stories",
      composeCta: "Post & Share something now",
    },
    "Vibes & Flexing": {
      keywords: ["vibe", "flex", "fun", "party", "weekend", "lifestyle", "style"],
      moreLabel: "Flex with more exciting Vibes",
      composeCta: "Post & Share your Vibe now",
    },
    "Breaking News": {
      keywords: ["news", "breaking", "update", "alert", "report", "headline"],
      moreLabel: "Catch up on more Breaking News",
      composeCta: "Post & Share Breaking News now",
    },
  } as const;
  const tabMeta = TAB_META[activeFeedTab];

  const matchesTab = (p: typeof allPosts[number]) => {
    if (!tabMeta.keywords.length) return true;
    const hay = `${p.title || ""} ${(p as any).subtitle || ""} ${(p as any).description || ""} ${(p as any).label || ""} ${(p as any).category || ""}`.toLowerCase();
    return tabMeta.keywords.some((k) => hay.includes(k));
  };

  // The User's OWN most recent post — pinned to the TOP big image space (never changes via thumbs)
  const myOwnPostsAll = allPosts.filter((p) => p.userId === currentUserId);
  const myOwnTabMatches = myOwnPostsAll.filter(matchesTab);
  // Keep the area populated even when a tab has no exact matches.
  const myOwnPosts = myOwnTabMatches.length > 0 ? myOwnTabMatches : myOwnPostsAll;
  const myLatestOwnPost = myOwnPosts[0] || allPosts[0];

  // Public/connection posts from OTHER users — drive the SECOND big image space
  const publicConnectionPosts = (() => {
    const others = allPosts.filter(
      (p) => p.userId !== currentUserId && ((p as any).privacy ?? "Public") === "Public",
    );
    const tabbed = others.filter(matchesTab);
    const base = tabbed.length > 0 ? tabbed : others;
    // Fallback so the space is never empty
    return base.length > 0 ? base.slice(0, 16) : allPosts.filter((p) => p.userId !== currentUserId).slice(0, 16);
  })();

  // Thumbnail strip — User's own + Public connection posts, de-duped
  const thumbnailPosts = (() => {
    const seen = new Set<string>();
    const out: typeof allPosts = [];
    for (const p of [...myOwnPosts, ...publicConnectionPosts]) {
      const key = p.id || p.imageUrl;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(p);
    }
    return out.slice(0, 16);
  })();

  // The SECOND big space rotates based on which thumbnail was tapped (any thumb, own or public)
  const [featuredPublicIdx, setFeaturedPublicIdx] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);
  const [storyDetailOpen, setStoryDetailOpen] = useState(false);
  const [ownActionsOpen, setOwnActionsOpen] = useState(false);
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [wallBannerManagerOpen, setWallBannerManagerOpen] = useState(false);
  const [bannerViewerOpen, setBannerViewerOpen] = useState(false);
  const [viewerItems, setViewerItems] = useState<MediaItem[]>([]);
  const safeFeaturedIdx = Math.min(featuredPublicIdx, Math.max(0, thumbnailPosts.length - 1));
  const featuredPublicPost = thumbnailPosts[safeFeaturedIdx] || thumbnailPosts[0] || myLatestOwnPost;
  // Keep legacy names so the rest of the file keeps compiling unchanged
  const featuredPost = myLatestOwnPost;
  const myRecentPosts = thumbnailPosts;
  const setFeaturedIdx = setFeaturedPublicIdx;




  const [friendsMenuView, setFriendsMenuView] = useState<"main" | "requests" | "birthdays">("main");
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [presetMediaUrl, setPresetMediaUrl] = useState<string | null>(null);
  const [presetTitle, setPresetTitle] = useState<string>("");
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { showDialog, Dialog } = useServiceUnavailableDialog();
  const restrictedServices = ["/mobi-shop", "/mobi-circle", "/biz-catalogue"];

  // Live ticking clock
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const liveDate = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const liveTime = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const openComposerWithImage = (url: string, title?: string) => {
    setPresetMediaUrl(url);
    setPresetTitle(title || "");
    setCreatePostOpen(true);
  };

  const openComposerBlank = () => {
    setPresetMediaUrl(null);
    setPresetTitle("");
    setCreatePostOpen(true);
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      openComposerWithImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const handleLinkClick = (e: React.MouseEvent, href: string, action?: string) => {
    if (action === "openChat") {
      e.preventDefault();
      const messagesButton = document.querySelector(
        "[data-messages-trigger]"
      ) as HTMLElement;
      messagesButton?.click();
      return;
    }
    if (restrictedServices.includes(href)) {
      e.preventDefault();
      showDialog();
    }
  };

  const primaryLinks = [{ label: "About", href: `/profile/${currentUserId}#about` }];
  const moreLinks = [
    { label: "Followers", href: `/profile/${currentUserId}#followers` },
    { label: "Following", href: `/profile/${currentUserId}#following` },
    { label: "Gifts", href: `/profile/${currentUserId}#gifts` },
    { label: "MobiChat", href: "#", action: "openChat" },
    { label: "Mobi Quiz Games", href: "/mobi-quiz-games" },
    { label: "Mobi-Store", href: "/mobi-shop" },
    { label: "Mobi-Circle", href: "/mobi-circle" },
    { label: "Community", href: "/community" },
    { label: "Biz-Catalogue", href: "/biz-catalogue" },
    { label: "E-Library", href: `/profile/${currentUserId}#contents` },
    { label: "Adverts Log", href: "/adverts-log" },
  ];

  // Featured top advert (mocked — real ad pool plugs in here later)
  const heroAd = {
    advertiser: "GoCom Taxi",
    tagline: "Ride smart. Stay better.",
    headline: "Provides an elite way to travel for an everyday price",
    body: "Connecting you affordably to where you want to be.",
    bullets: ["Move faster", "Save bigger", "Live better"],
    image:
      "https://images.unsplash.com/photo-1549921296-3a6b3ec0e13b?w=1200&q=80",
    ctaUrl: "#",
  };

  if (!profile) {
    return (
      <div className="space-y-3">
        <Card className="overflow-hidden rounded-3xl">
          <div className="h-[150px] sm:h-[180px] bg-muted animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="flex items-end gap-3">
              <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ============ HERO BLOCK ============ */}
      <Card className="overflow-hidden rounded-3xl shadow-[0_6px_20px_-8px_hsl(var(--primary)/0.45)]">
        {/* Top Wall Banner — user-managed rotating slideshow */}
        <div className="m-2 mb-0 border-[5px] border-[hsl(212_95%_50%)] rounded-2xl overflow-hidden">
          <WallBannerSlideshow
            ownerId={currentUserId}
            scope="home"
            fallbackImage={heroAdBanner}
            fallbackAlt={`${heroAd.advertiser} — ${heroAd.headline}`}
            isOwner
            heightClass="h-[150px] sm:h-[180px]"
            onManage={() => setWallBannerManagerOpen(true)}
            onChangeFallback={() => setWallBannerManagerOpen(true)}
            onOpenViewer={(slide) => {
              setViewerItems([
                {
                  id: slide.id,
                  url: slide.mediaUrl,
                  type: slide.mediaType,
                  author: profile.fullName,
                  title: slide.caption,
                } as MediaItem,
              ]);
              setViewerStartIndex(0);
              setBannerViewerOpen(true);
            }}
          />
        </div>

        {/* Identity Row — overlapping avatar */}
        <div className="px-3 pb-3 -mt-12 relative">
          <div className="flex items-end gap-3">
            {/* Avatar with online dot — nudged right, slightly larger */}
            <div className="relative shrink-0 ml-2">
              <Avatar className="h-24 w-24 border-4 border-card shadow-md">
                <AvatarImage src={profile.avatar} alt={profile.fullName} />
                <AvatarFallback>{profile.username.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span
                className="absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full bg-green-500 ring-2 ring-card"
                aria-label="Online"
              />
              {/* Verified badge at bottom of avatar */}
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-0.5 bg-black/55 text-white text-[9px] font-bold px-1.5 py-[2px] rounded-full ring-2 ring-card whitespace-nowrap">
                <BadgeCheck className="h-2.5 w-2.5 fill-green-400 text-white" />
                Verified
              </span>
            </div>

            {/* Date/time on top, greeting below */}
            <div className="flex-1 min-w-0 pb-1.5 flex flex-col gap-1">
              <p className="text-[13px] font-medium text-muted-foreground tabular-nums whitespace-nowrap leading-tight">
                {liveDate} · {liveTime}
              </p>
              <p className="text-[15px] font-bold text-destructive leading-tight whitespace-nowrap">
                {profile.greeting?.trim() || (() => {
                  const h = now.getHours();
                  const part = h < 12 ? "morning" : h < 17 ? "afternoon" : h < 21 ? "evening" : "night";
                  return `Good ${part}!`;
                })()}
              </p>
            </div>
          </div>

          {/* Full Name + Badges — under avatar */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold tracking-tight truncate">
              {profile.fullName}
            </h2>
            <UserTagBadges userId={currentUserId} />
          </div>

          {/* Nav row */}
          <div className="mt-3 pt-2 border-t flex flex-nowrap items-center overflow-x-auto scrollbar-hide">
            {primaryLinks.map((link) => (
              <span key={link.label} className="flex items-center flex-shrink-0">
                <Link
                  to={link.href}
                  className="text-base font-semibold text-foreground hover:text-primary transition-colors whitespace-nowrap"
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.label}
                </Link>
                <span className="text-muted-foreground px-2">|</span>
              </span>
            ))}

            {/* Friends */}
            <span className="flex items-center flex-shrink-0">
              <DropdownMenu onOpenChange={(open) => !open && setFriendsMenuView("main")}>
                <DropdownMenuTrigger asChild>
                  <button className="text-base font-semibold text-foreground hover:text-primary transition-colors whitespace-nowrap">
                    Friends
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  side="bottom"
                  sideOffset={5}
                  className="bg-card z-50 w-48"
                >
                  {friendsMenuView === "main" ? (
                    <>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to={`/profile/${currentUserId}#friends`} className="cursor-pointer">
                          Friends
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-base font-medium text-primary cursor-pointer flex justify-between items-center"
                        onSelect={(e) => {
                          e.preventDefault();
                          setFriendsMenuView("requests");
                        }}
                      >
                        Friend Requests
                        <span className="ml-auto">&gt;</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/find" className="cursor-pointer">
                          Find Friends
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/invite" className="cursor-pointer">
                          Invite People
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/referred" className="cursor-pointer">
                          Referred Friends
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-base font-medium text-primary cursor-pointer flex justify-between items-center"
                        onSelect={(e) => {
                          e.preventDefault();
                          setFriendsMenuView("birthdays");
                        }}
                      >
                        Friends' Birthdays
                        <span className="ml-auto">&gt;</span>
                      </DropdownMenuItem>
                    </>
                  ) : friendsMenuView === "requests" ? (
                    <>
                      <DropdownMenuItem
                        className="text-base font-medium text-primary cursor-pointer"
                        onSelect={(e) => {
                          e.preventDefault();
                          setFriendsMenuView("main");
                        }}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/requests/received" className="cursor-pointer">
                          Received Requests
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/requests/sent" className="cursor-pointer">
                          Sent Requests
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        className="text-base font-medium text-primary cursor-pointer"
                        onSelect={(e) => {
                          e.preventDefault();
                          setFriendsMenuView("main");
                        }}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/birthdays?range=all" className="cursor-pointer">
                          All Birthdays
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/birthdays?range=today" className="cursor-pointer">
                          Today
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/birthdays?range=tomorrow" className="cursor-pointer">
                          Tomorrow
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/birthdays?range=yesterday" className="cursor-pointer">
                          Yesterday
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/birthdays?range=next-week" className="cursor-pointer">
                          Next Week
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/birthdays?range=last-week" className="cursor-pointer">
                          Last Week
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/birthdays?range=next-month" className="cursor-pointer">
                          Next Month
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-base font-medium text-primary">
                        <Link to="/friends/birthdays?range=last-month" className="cursor-pointer">
                          Last Month
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-muted-foreground px-2">|</span>
            </span>

            {/* Albums */}
            <span className="flex items-center flex-shrink-0">
              <Link
                to={`/profile/${currentUserId}#albums`}
                className="text-base font-semibold text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                Albums
              </Link>
              <span className="text-muted-foreground px-2">|</span>
            </span>

            {/* More */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-base font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 flex-shrink-0">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-card z-50 w-48">
                {moreLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.label}
                    asChild
                    className="text-base font-medium text-primary"
                  >
                    <Link
                      to={link.href}
                      className="cursor-pointer"
                      onClick={(e) => handleLinkClick(e, link.href, link.action)}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search anything on Mobigate"
                className="h-11 rounded-full bg-muted/40 border-muted-foreground/20 pl-4 pr-4 text-[15px]"
              />
            </div>
            <Button
              size="icon"
              className="h-11 w-11 rounded-full shrink-0 shadow-sm"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* ============ POSTING AREA ============ */}
          <div className="mt-3">
            {/* Section tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
              {(["Stories", "Vibes & Flexing", "Breaking News"] as const).map((t) => {
                const active = activeFeedTab === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      // Switch the posting area content in place — no page jump.
                      setActiveFeedTab(t);
                      setFeaturedPublicIdx(0);
                    }}
                    className={`shrink-0 h-9 px-3 rounded-md text-[13px] font-bold border-2 transition-colors touch-manipulation ${
                      active
                        ? "bg-green-600 text-white border-green-600 shadow-sm"
                        : "bg-card text-foreground border-border hover:border-green-500/60"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <div className="h-px bg-green-500/40 mt-1 mb-3" />

            {/* ============ VIBES & FLEXING VIEW ============
                Image-first layout: one big featured vibe on the left with a (+)
                badge, a "Post & Share" button top-right, and a compact grid of
                vibe thumbnails below it. Footer cycles vibes with ◄ / ► arrows. */}
            {activeFeedTab === "Vibes & Flexing" && featuredPublicPost && (
              <div className="rounded-lg overflow-hidden">
                <div className="grid grid-cols-[42%_1fr] gap-2 items-stretch">
                  {/* Left: big featured vibe → enlarge in viewer */}
                  <button
                    type="button"
                    onClick={() => setViewerOpen(true)}
                    className="relative bg-muted rounded-lg overflow-hidden border-[3px] border-[hsl(212_95%_50%)] shadow-sm active:scale-[0.98] transition-transform touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(212_95%_50%)]"
                    aria-label="Enlarge this vibe"
                  >
                    <img
                      key={featuredPublicPost.id || `vibe-${safeFeaturedIdx}`}
                      src={featuredPublicPost.imageUrl}
                      alt={featuredPublicPost.title}
                      className="w-full h-full object-cover aspect-[3/5] transition-opacity duration-300 pointer-events-none"
                      loading="lazy"
                    />
                    <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm pointer-events-none">
                      <Maximize2 className="h-3 w-3" />
                      Tap to enlarge
                    </span>
                    {/* (+) create-vibe affordance */}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        openComposerBlank();
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          openComposerBlank();
                        }
                      }}
                      aria-label="Create a new Vibe"
                      className="absolute bottom-1.5 right-1.5 h-8 w-8 rounded-full bg-[hsl(212_95%_50%)] text-white flex items-center justify-center shadow ring-2 ring-card active:scale-95 touch-manipulation"
                    >
                      <Plus className="h-5 w-5" />
                    </span>
                  </button>

                  {/* Right: compose button + vibe thumbnail grid */}
                  <div className="flex flex-col gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={openComposerBlank}
                      className="bg-[hsl(212_95%_50%)] text-white rounded-md px-2.5 py-2.5 flex items-center justify-center gap-2 text-[13px] font-bold leading-tight active:opacity-90 touch-manipulation shadow-sm"
                    >
                      <span className="truncate">Post &amp; Share something now</span>
                      <Images className="h-4 w-4 shrink-0" />
                    </button>

                    <div className="grid grid-cols-4 gap-1 flex-1 content-start">
                      {myRecentPosts.slice(0, 8).map((post, i) => {
                        const realIdx = myRecentPosts.findIndex(
                          (p) => (p.id || p.imageUrl) === (post.id || post.imageUrl),
                        );
                        const isActive = realIdx === safeFeaturedIdx;
                        return (
                          <button
                            key={`vibe-thumb-${i}-${post.id ?? i}`}
                            type="button"
                            onClick={() => setFeaturedIdx(realIdx < 0 ? 0 : realIdx)}
                            className={`relative rounded-md overflow-hidden bg-muted aspect-square active:scale-95 transition-all touch-manipulation ${
                              isActive
                                ? "ring-2 ring-[hsl(212_95%_50%)] border border-[hsl(212_95%_50%)]"
                                : "border border-[hsl(212_95%_50%)]/30 opacity-90 hover:opacity-100"
                            }`}
                            aria-label={`Feature ${post.title} vibe`}
                            aria-pressed={isActive}
                          >
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                            <span
                              aria-hidden="true"
                              className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-[hsl(212_95%_50%)]/90 text-white flex items-center justify-center"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer — ◄ Flex with more exciting Vibes ► */}
                <div className="mt-3 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFeaturedIdx((safeFeaturedIdx - 1 + myRecentPosts.length) % myRecentPosts.length)
                    }
                    className="h-7 w-7 rounded-full bg-card border border-[hsl(212_95%_50%)]/40 shadow-sm flex items-center justify-center text-[hsl(212_95%_50%)] active:scale-95 touch-manipulation"
                    aria-label="Previous vibe"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="italic font-bold underline underline-offset-2 text-[13px] text-[hsl(212_95%_50%)]">
                    Flex with more exciting Vibes
                  </span>
                  <button
                    type="button"
                    onClick={() => setFeaturedIdx((safeFeaturedIdx + 1) % myRecentPosts.length)}
                    className="h-7 w-7 rounded-full bg-card border border-[hsl(212_95%_50%)]/40 shadow-sm flex items-center justify-center text-[hsl(212_95%_50%)] active:scale-95 touch-manipulation"
                    aria-label="Next vibe"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Featured post card — image left, [Post & Share button] + [storyline] stacked right.
                Image X + Storyline 1 are READ-ONLY; tapping either opens an action sheet
                with Edit Post / Create New Post. */}
            {activeFeedTab !== "Vibes & Flexing" && featuredPost && (
              <div className="rounded-lg overflow-hidden">
                <div className="grid grid-cols-[40%_1fr] gap-2 items-stretch">
                  {/* Left: own image — opens Edit / Create New action sheet */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setOwnActionsOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOwnActionsOpen(true);
                      }
                    }}
                    className="relative bg-muted rounded-lg overflow-hidden border-[3px] border-green-500/80 shadow-sm cursor-pointer active:scale-[0.98] transition-transform touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    aria-label="Open post options: Edit Post or Create New Post"
                  >
                    <img
                      key={featuredPost.id || safeFeaturedIdx}
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover aspect-[4/5] transition-opacity duration-300 pointer-events-none"
                      loading="lazy"
                    />
                    <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm pointer-events-none">
                      <PenSquare className="h-3 w-3" />
                      Tap to edit
                    </span>
                    {/* Persistent (+) badge as a visual affordance — non-interactive */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1.5 right-1.5 h-7 w-7 rounded-full bg-foreground/85 text-background flex items-center justify-center shadow ring-2 ring-card pointer-events-none"
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Right column: stacked button + storyline (storyline is read-only opener) */}
                  <div className="flex flex-col gap-2 min-w-0">
                    {/* Post & Share button — quick shortcut to blank composer */}
                    <button
                      type="button"
                      onClick={openComposerBlank}
                      className="bg-primary text-primary-foreground rounded-md px-2.5 py-2.5 text-center text-[15px] font-bold leading-tight truncate active:opacity-90 touch-manipulation shadow-sm"
                    >
                      {tabMeta.composeCta}
                    </button>
                    {/* Storyline 1 — read-only div opener for Edit / Create New */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setOwnActionsOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setOwnActionsOpen(true);
                        }
                      }}
                      className="flex-1 bg-lime-200/70 text-foreground p-2.5 text-left rounded-md active:opacity-90 touch-manipulation cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 select-none"
                      aria-label="Open post options: Edit Post or Create New Post"
                    >
                      <p className="text-[15px] font-bold leading-snug">
                        {featuredPost.title || "Your Post or Content Description or Storyline here."}
                      </p>
                      <p className="text-[14px] leading-snug mt-1">
                        {(featuredPost as any).description ||
                          "However, the storyline may not just exceed certain word-counts or be made to be unnecessary"}
                        <span className="font-extrabold italic">…More</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Public/Connection post — view-only wrapper.
                Inside it: the IMAGE opens the media viewer (enlarge),
                the STORYLINE text opens the full story details dialog.
                The outer card itself is NOT clickable. */}
            {activeFeedTab !== "Vibes & Flexing" && featuredPublicPost && (
              <div
                className="mt-2 rounded-lg overflow-hidden bg-purple-200/60 p-1.5"
                aria-label="Public post preview"
              >
                <div className="grid grid-cols-[40%_1fr] gap-2 items-stretch">
                  {/* IMAGE → opens MediaGalleryViewer */}
                  <button
                    type="button"
                    onClick={() => setViewerOpen(true)}
                    className="relative bg-muted rounded-md overflow-hidden border-2 border-red-500 cursor-pointer active:opacity-95 active:scale-[0.997] transition-transform touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label="Enlarge this post's media"
                  >
                    <img
                      key={featuredPublicPost.id || `pub-${safeFeaturedIdx}`}
                      src={featuredPublicPost.imageUrl}
                      alt={featuredPublicPost.title}
                      className="w-full h-full object-cover aspect-[4/5] transition-opacity duration-300 pointer-events-none"
                      loading="lazy"
                    />
                    <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm pointer-events-none">
                      <Maximize2 className="h-3 w-3" />
                      Tap to enlarge
                    </span>
                  </button>

                  {/* STORYLINE → opens enlarged story details */}
                  <button
                    type="button"
                    onClick={() => setStoryDetailOpen(true)}
                    className="text-foreground p-2.5 text-left select-none cursor-pointer rounded-md hover:bg-purple-300/40 active:bg-purple-300/60 active:scale-[0.997] transition-all touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label="Read full story details"
                  >
                    <p className="text-[15px] font-bold leading-snug">
                      {featuredPublicPost.title || "Public Post or Content Description or Storyline here."}
                    </p>
                    <p className="text-[14px] leading-snug mt-1">
                      {(featuredPublicPost as any).description ||
                        "However, the storyline may not just exceed certain word-counts or be made to be unnecessarily bulky or voluminous in any case, or"}
                      <span className="font-extrabold italic text-primary">…More</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 italic">
                      by {(featuredPublicPost as any).author || "Public User"} · {featuredPublicPost.userId === currentUserId ? "Your post" : "Public / Connection"}
                    </p>
                  </button>
                </div>
              </div>
            )}



            {/* RTL auto-scrolling thumbnail strip — click to load into the big featured panel above */}
            {activeFeedTab !== "Vibes & Flexing" && myRecentPosts.length > 1 && (
              <div className="mt-2 rounded-lg border border-border bg-card/50 p-1.5 overflow-hidden">
                <div className="group/strip relative">
                  {/* Prev button */}
                  <button
                    type="button"
                    onClick={() =>
                      setFeaturedIdx((safeFeaturedIdx - 1 + myRecentPosts.length) % myRecentPosts.length)
                    }
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/90 border border-border shadow-md flex items-center justify-center active:scale-95 touch-manipulation"
                    aria-label="Previous post"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {/* Next button */}
                  <button
                    type="button"
                    onClick={() =>
                      setFeaturedIdx((safeFeaturedIdx + 1) % myRecentPosts.length)
                    }
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/90 border border-border shadow-md flex items-center justify-center active:scale-95 touch-manipulation"
                    aria-label="Next post"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div
                    className="flex gap-2 w-max animate-marquee-rtl group-hover/strip:[animation-play-state:paused] px-9"
                    style={{ animationDuration: `${Math.max(18, myRecentPosts.length * 3)}s` }}
                  >
                    {[...myRecentPosts, ...myRecentPosts].map((post, i) => {
                      const realIdx = i % myRecentPosts.length;
                      const isActive = realIdx === safeFeaturedIdx;
                      return (
                        <button
                          key={`thumb-${i}-${post.id ?? realIdx}`}
                          type="button"
                          onClick={() => setFeaturedIdx(realIdx)}
                          className={`relative shrink-0 h-16 w-16 rounded-md overflow-hidden bg-muted active:scale-95 transition-all touch-manipulation ${
                            isActive
                              ? "ring-2 ring-red-500 border-2 border-red-500 shadow-md scale-[1.04]"
                              : "border border-foreground/30 opacity-90 hover:opacity-100"
                          }`}
                          aria-label={`Show ${post.title} in big view`}
                          aria-pressed={isActive}
                        >
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          {isActive && (
                            <span className="absolute inset-x-0 bottom-0 bg-red-600 text-white text-[9px] font-bold text-center py-0.5">
                              Showing
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground text-center italic">
                  Auto-scrolls right → left · tap any thumbnail to feature it above · tap ‹ › to step through posts · tap the big image to open larger
                </p>

              </div>
            )}

            {/* See-more link — scrolls down the feed for more of this tab's content */}
            {activeFeedTab !== "Vibes & Flexing" && (
              <button
                type="button"
                onClick={() => {
                  window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
                }}
                className="mt-2 flex items-center gap-2 px-1 py-1.5 text-primary active:opacity-80 touch-manipulation"
              >
                <ChevronLeft className="h-4 w-4 shrink-0 rotate-[-90deg]" />
                <span className="italic font-semibold underline underline-offset-2 text-[13px]">
                  {tabMeta.moreLabel}
                </span>
              </button>
            )}

            {/* Hidden gallery input */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleGalleryFileChange}
            />
          </div>
        </div>
      </Card>

      {/* People You May Know */}
      <PeopleYouMayKnow />

      {/* Compose dialog */}
      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
        hideTrigger
        presetMediaUrl={presetMediaUrl}
        presetTitle={presetTitle}
      />

      {/* Bigger-window viewer for the featured media */}
      <MediaGalleryViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        items={myRecentPosts.map((p, i): MediaItem => ({
          id: p.id || `featured-${i}`,
          url: p.imageUrl,
          type: (p as any).type?.toLowerCase() === "video" ? "video" : (p as any).type?.toLowerCase() === "audio" ? "audio" : "photo",
          title: p.title,
          author: (p as any).author,
          authorImage: (p as any).authorProfileImage,
          authorUserId: (p as any).userId,
          description: (p as any).description,
          timestamp: (p as any).timestamp,
          likes: Number((p as any).likes) || 0,
          comments: Number((p as any).comments) || 0,
          followers: (p as any).followers,
          isOwner: (p as any).userId === currentUserId,
        }))}
        initialIndex={safeFeaturedIdx}
      />

      {/* Enlarged story details — opens when the storyline TEXT is tapped */}
      {featuredPublicPost && (
        <PostDetailDialog
          open={storyDetailOpen}
          onOpenChange={setStoryDetailOpen}
          post={{
            id:                 featuredPublicPost.id,
            title:              featuredPublicPost.title || "Public Post",
            subtitle:           (featuredPublicPost as any).subtitle,
            description:        (featuredPublicPost as any).description ||
                                "However, the storyline may not just exceed certain word-counts or be made to be unnecessarily bulky or voluminous in any case.",
            author:             (featuredPublicPost as any).author || "Public User",
            authorProfileImage: (featuredPublicPost as any).authorProfileImage,
            userId:             (featuredPublicPost as any).userId,
            status:             ((featuredPublicPost as any).status as "Online" | "Offline") || "Online",
            views:              String((featuredPublicPost as any).views ?? 0),
            comments:           String((featuredPublicPost as any).comments ?? 0),
            likes:              String((featuredPublicPost as any).likes ?? 0),
            followers:          (featuredPublicPost as any).followers,
            type:               (((featuredPublicPost as any).type as string)?.toLowerCase() === "video"   ? "Video"
                               : ((featuredPublicPost as any).type as string)?.toLowerCase() === "audio"   ? "Audio"
                               : ((featuredPublicPost as any).type as string)?.toLowerCase() === "pdf"     ? "PDF"
                               : ((featuredPublicPost as any).type as string)?.toLowerCase() === "url"     ? "URL"
                               : ((featuredPublicPost as any).type as string)?.toLowerCase() === "article" ? "Article"
                               : "Photo") as "Video" | "Article" | "Photo" | "Audio" | "PDF" | "URL",
            imageUrl:           featuredPublicPost.imageUrl,
            fee:                (featuredPublicPost as any).fee,
          }}
        />
      )}

      {/* ── Own Post action sheet (Edit / Create New) ── */}
      <ActionDialog open={ownActionsOpen} onOpenChange={setOwnActionsOpen}>
        <ActionDialogContent className="sm:max-w-sm rounded-2xl p-5">
          <ActionDialogHeader>
            <ActionDialogTitle className="text-lg">Post Options</ActionDialogTitle>
            <ActionDialogDescription>
              Choose what you want to do with your latest post.
            </ActionDialogDescription>
          </ActionDialogHeader>

          <div className="mt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setOwnActionsOpen(false);
                setEditPostOpen(true);
              }}
              disabled={!featuredPost}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 active:scale-[0.99] transition-all touch-manipulation text-left disabled:opacity-50"
            >
              <span className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <PenSquare className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold text-foreground">Edit Post</span>
                <span className="block text-[12px] text-muted-foreground leading-snug">
                  Modify the images and/or text of this post.
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOwnActionsOpen(false);
                openComposerBlank();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 active:scale-[0.99] transition-all touch-manipulation text-left"
            >
              <span className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0">
                <FilePlus2 className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold text-foreground">Create New Post</span>
                <span className="block text-[12px] text-muted-foreground leading-snug">
                  Start a fresh post — images, video, audio, article or PDF.
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOwnActionsOpen(false);
                navigate(`/profile/${currentUserId}#status`);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 active:scale-[0.99] transition-all touch-manipulation text-left"
            >
              <span className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <LayoutList className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold text-foreground">View my Posts</span>
                <span className="block text-[12px] text-muted-foreground leading-snug">
                  See all the posts you've shared so far.
                </span>
              </span>
            </button>
          </div>
        </ActionDialogContent>
      </ActionDialog>

      {/* ── Edit existing own post dialog ── */}
      {featuredPost && (
        <EditPostDialog
          post={featuredPost as any}
          open={editPostOpen}
          onOpenChange={setEditPostOpen}
          onSave={() => {
            setEditPostOpen(false);
            window.dispatchEvent(new CustomEvent("postUpdated"));
          }}
        />
      )}


      {/* Service Unavailable Dialog */}
      <Dialog />

      {/* Wall Banner — owner manager */}
      <WallBannerManagerDialog
        open={wallBannerManagerOpen}
        onOpenChange={setWallBannerManagerOpen}
        ownerId={currentUserId}
        scope="home"
      />

      {/* Wall Banner — big viewer for slides with "Open in viewer" action */}
      <MediaGalleryViewer
        open={bannerViewerOpen}
        onOpenChange={setBannerViewerOpen}
        items={viewerItems}
        initialIndex={0}
        showActions={false}
        galleryType="banner"
      />
    </div>
  );
};
