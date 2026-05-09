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
import { Search, MoreHorizontal, ChevronLeft, ImagePlus, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { CreatePostDialog } from "./CreatePostDialog";
import { PeopleYouMayKnow } from "./PeopleYouMayKnow";
import { useServiceUnavailableDialog } from "@/hooks/useServiceUnavailableDialog";
import { useState, useEffect, useRef } from "react";
import { UserTagBadges } from "./UserTagBadges";
import { useUserProfile, useCurrentUserId, useFeedPosts } from "@/hooks/useWindowData";
import { feedPosts as fallbackFeedPosts } from "@/data/posts";
import heroAdBanner from "@/assets/hero-ad-banner.jpg";

export const GreetingSection = () => {
  const profile = useUserProfile();
  const currentUserId = useCurrentUserId();
  const phpFeedPosts = useFeedPosts();
  const allPosts = phpFeedPosts || fallbackFeedPosts;

  // Last 4 posts of the current user (fallback to latest 4 overall)
  const myRecentPosts = (() => {
    const mine = allPosts.filter((p) => p.userId === currentUserId).slice(0, 4);
    if (mine.length >= 4) return mine;
    return [...mine, ...allPosts.filter((p) => p.userId !== currentUserId)].slice(0, 4);
  })();
  const featuredPostThumb = myRecentPosts[0]?.imageUrl;

  const [friendsMenuView, setFriendsMenuView] = useState<"main" | "requests">("main");
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

  return (
    <div className="space-y-3">
      {/* ============ HERO BLOCK ============ */}
      <Card className="overflow-hidden border-2 border-primary/30 shadow-sm">
        {/* Top Advert Banner — full image */}
        <a
          href={heroAd.ctaUrl}
          className="block relative active:opacity-95 transition-opacity touch-manipulation"
        >
          <img
            src={heroAdBanner}
            alt={`${heroAd.advertiser} — ${heroAd.headline}`}
            className="w-full h-[150px] sm:h-[180px] object-cover"
          />
          {/* Sponsored chip */}
          <span className="absolute top-1.5 right-1.5 bg-black/50 text-white text-[9px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider">
            Sponsored
          </span>
        </a>

        {/* Identity Row — overlapping avatar */}
        <div className="px-3 pb-3 -mt-14 relative">
          <div className="flex items-end gap-3">
            {/* Avatar with online dot — bigger */}
            <div className="relative shrink-0">
              <Avatar className="h-28 w-28 border-4 border-card shadow-lg">
                <AvatarImage src={profile.avatar} alt={profile.fullName} />
                <AvatarFallback>{profile.username.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span
                className="absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full bg-green-500 ring-2 ring-card"
                aria-label="Online"
              />
            </div>

            {/* Greeting + live date/time — side-by-side, larger */}
            <div className="flex-1 min-w-0 pb-2 flex items-center justify-between gap-2 flex-wrap">
              <p className="text-base sm:text-lg font-bold text-destructive leading-tight whitespace-nowrap">
                {profile.greeting}
              </p>
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-foreground tabular-nums whitespace-nowrap">
                  {liveTime}
                </p>
                <p className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {liveDate}
                </p>
              </div>
            </div>
          </div>

          {/* Verified + Full Name — under avatar */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600">
              <BadgeCheck className="h-3.5 w-3.5 fill-green-600 text-white" />
              Verified
            </span>
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

          {/* Post & Share Row */}
          <div className="mt-3 flex items-center gap-2">
            {/* Featured thumb (latest post) — prefills compose */}
            <button
              type="button"
              onClick={() =>
                featuredPostThumb
                  ? openComposerWithImage(featuredPostThumb, myRecentPosts[0]?.title)
                  : openComposerBlank()
              }
              className="h-12 w-14 rounded-md overflow-hidden border-2 border-green-500/70 shrink-0 bg-muted active:scale-95 transition-transform touch-manipulation"
              aria-label="Post using recent image"
            >
              {featuredPostThumb ? (
                <img
                  src={featuredPostThumb}
                  alt="Recent"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus className="h-5 w-5 m-auto text-muted-foreground" />
              )}
            </button>

            {/* Compose trigger — blank composer */}
            <button
              type="button"
              onClick={openComposerBlank}
              className="flex-1 h-12 rounded-md border-2 border-green-500/70 bg-card text-left px-3 text-[14px] text-muted-foreground hover:bg-muted/40 transition-colors touch-manipulation truncate"
            >
              Post & Share something now
            </button>

            {/* Gallery icon — picks custom image from device */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="h-12 w-12 rounded-md border-2 border-green-500/70 bg-card flex items-center justify-center shrink-0 active:scale-95 transition-transform touch-manipulation"
              aria-label="Pick image from gallery"
            >
              <ImagePlus className="h-6 w-6 text-green-600" />
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleGalleryFileChange}
            />
          </div>

          {/* Recent post thumbnails (4 across) — tap to prefill compose */}
          {myRecentPosts.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {myRecentPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => openComposerWithImage(post.imageUrl, post.title)}
                  className="aspect-square rounded-md overflow-hidden border-2 border-green-500/70 bg-muted active:scale-95 transition-transform touch-manipulation"
                  aria-label={`Post using ${post.title}`}
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
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

      {/* Service Unavailable Dialog */}
      <Dialog />
    </div>
  );
};
