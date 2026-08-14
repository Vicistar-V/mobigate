import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MessageCircle,
  UserPlus,
  BookOpen,
  Image as ImageIcon,
  Play,
  Music,
  Eye,
  ArrowLeft,
  Minimize2,
  Maximize2,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CommentDialog } from "@/components/CommentDialog";
import { useSwipeable } from "react-swipeable";
import { MediaOwnerMenu } from "@/components/media/MediaOwnerMenu";
import { CopyrightBadge } from "@/components/common/CopyrightBadge";

export interface MediaItem {
  id?: string;
  url: string;
  type: "photo" | "video" | "audio";
  title?: string;
  author?: string;
  authorImage?: string;
  authorUserId?: string;
  timestamp?: string;
  description?: string;
  likes?: number;
  comments?: number;
  views?: number;
  followers?: string;
  isLiked?: boolean;
  isOwner?: boolean;
  /** Show the "✓Copyright" designation marker on this media (default true) */
  copyrightMarked?: boolean;
  /** How long this slide stays on screen before auto-advancing (ms). Photos/audio only. */
  durationMs?: number;
}

interface MediaGalleryViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: MediaItem[];
  initialIndex?: number;
  showActions?: boolean;
  galleryType?:
    | "wall-status"
    | "profile-picture"
    | "banner"
    | "post"
    | "gallery"
    | "video-highlights";
  /** When true, slides auto-advance on a timer (story-style) with a top progress bar. */
  autoAdvance?: boolean;
}

export const MediaGalleryViewer = ({
  open,
  onOpenChange,
  items,
  initialIndex = 0,
  showActions = true,
  galleryType = "wall-status",
  autoAdvance = false,
}: MediaGalleryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"media" | "reader">("media");

  // Reader Mode Interactive UX States
  const [readerScrolled, setReaderScrolled] = useState(false);
  const [readerMinimized, setReaderMinimized] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const readerScrollRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const currentItem = items[currentIndex];

  const openAuthorProfile = () => {
    if (!currentItem?.author) return;
    const id =
      currentItem.authorUserId ||
      currentItem.author.toLowerCase().replace(/\s+/g, "-");
    onOpenChange(false);
    navigate(`/profile/${encodeURIComponent(id)}`);
  };

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Reset reader interactive states when slide changes
  useEffect(() => {
    if (currentItem) {
      setIsLiked(currentItem.isLiked || false);
      setLikeCount(currentItem.likes || 0);
      setIsFollowing(false);
      setFollowerCount(
        currentItem.followers
          ? parseInt(currentItem.followers.replace(/[^0-9]/g, "")) || 0
          : 0
      );
      setViewCount((currentItem.views || 0) + 1);

      // Reset scroll tracking
      setReaderScrolled(false);
      setReaderMinimized(false);
      setReadingProgress(0);

      const hasText = !!(
        currentItem.description && currentItem.description.trim().length > 40
      );
      const prefersReader =
        ["post", "gallery", "video-highlights"].includes(galleryType) ||
        hasText;
      setViewMode(prefersReader && hasText ? "reader" : "media");
    }
  }, [currentItem, galleryType]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  }, [items.length]);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((c) => Math.max(0, c - 1));
      setIsLiked(false);
      toast({ description: "Unliked" });
    } else {
      setLikeCount((c) => c + 1);
      setIsLiked(true);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: currentItem?.title || "Check this out!",
      text: currentItem?.description?.slice(0, 200) || currentItem?.title || "",
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link copied", description: "Share it anywhere you like." });
    } catch {
      toast({ title: "Could not share link", variant: "destructive" });
    }
  };

  const handleComment = () => {
    setCommentDialogOpen(true);
  };

  const handleFollow = () => {
    if (isFollowing) {
      setFollowerCount((c) => Math.max(0, c - 1));
      setIsFollowing(false);
      toast({ description: `Unfollowed ${currentItem?.author || "user"}` });
    } else {
      setFollowerCount((c) => c + 1);
      setIsFollowing(true);
      toast({ description: `Now following ${currentItem?.author || "user"}` });
    }
  };

  const formatFollowerCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  // Reader Scroll Handler
  const handleReaderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const top = target.scrollTop;
    const height = target.scrollHeight - target.clientHeight;
    if (height > 0) {
      setReadingProgress(Math.min(100, (top / height) * 100));
    }
    if (top > 45 && !readerScrolled) {
      setReaderScrolled(true);
    } else if (top <= 45 && readerScrolled) {
      setReaderScrolled(false);
    }
  };

  const isHeroCollapsed = readerScrolled || readerMinimized;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
    onSwipedDown: () => onOpenChange(false),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50,
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onOpenChange(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex]);

  useEffect(() => {
    setPaused(false);
  }, [open, currentIndex]);

  // Story-style timer
  useEffect(() => {
    if (!open || !autoAdvance || items.length <= 1) {
      setProgress(0);
      return;
    }
    if (viewMode === "reader" || commentDialogOpen || paused) return;
    if (currentItem?.type === "video") return;

    setProgress(0);
    const duration = currentItem?.durationMs ?? 5000;
    const start = Date.now();
    const id = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (elapsed >= duration) {
        window.clearInterval(id);
        goToNext();
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [
    open,
    autoAdvance,
    currentIndex,
    viewMode,
    commentDialogOpen,
    paused,
    currentItem,
    items.length,
    goToNext,
  ]);

  const renderMedia = () => {
    if (!currentItem) return null;

    switch (currentItem.type) {
      case "video":
        return (
          <video
            src={currentItem.url}
            controls
            autoPlay
            onEnded={() => {
              if (autoAdvance && items.length > 1) goToNext();
            }}
            className="w-full h-full object-contain"
            key={currentItem.url}
          >
            Your browser does not support the video tag.
          </video>
        );

      case "audio":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
            <div className="text-center text-white">
              <h3 className="text-3xl font-semibold mb-2">
                {currentItem.title || "Audio"}
              </h3>
              {currentItem.author && (
                <p className="text-lg text-white/80">by {currentItem.author}</p>
              )}
            </div>
            <audio
              src={currentItem.url}
              controls
              autoPlay
              className="w-full max-w-2xl"
              key={currentItem.url}
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case "photo":
      default:
        return (
          <div className="relative h-full w-full overflow-hidden bg-[#0b0b0f]">
            <img
              src={currentItem.url}
              alt={currentItem.title || "Media"}
              className="h-full w-full object-cover select-none scale-[1.02]"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/35" />
          </div>
        );
    }
  };

  const getGalleryTitle = () => {
    switch (galleryType) {
      case "profile-picture":
        return "Profile Pictures";
      case "banner":
        return "Profile Banners";
      case "wall-status":
        return "Wall Status";
      case "post":
        return "Post Media";
      case "gallery":
        return "Gallery";
      case "video-highlights":
        return "Video Highlights";
      default:
        return "Media Gallery";
    }
  };

  if (!currentItem) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 gap-0 bg-black border-none !z-[200]"
          overlayClassName="!z-[200]"
        >
          {/* Story Progress Bar (Media Mode) */}
          {autoAdvance && items.length > 1 && viewMode !== "reader" && (
            <div className="absolute top-0 left-0 right-0 z-[60] flex gap-1 px-2 pt-2">
              {items.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                >
                  <div
                    className="h-full bg-white"
                    style={{
                      width:
                        i < currentIndex
                          ? "100%"
                          : i === currentIndex
                          ? `${currentItem?.type === "video" ? 0 : progress}%`
                          : "0%",
                      transition:
                        i === currentIndex ? "width 60ms linear" : "none",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Standard Header (Media View Mode) */}
          {viewMode !== "reader" && (
            <div
              className={`absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-2 sm:p-4 ${
                autoAdvance && items.length > 1 ? "pt-4 sm:pt-6" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  {currentItem.author ? (
                    <button
                      type="button"
                      onClick={openAuthorProfile}
                      className="flex items-center gap-2 sm:gap-3 rounded-full pr-2 sm:pr-3 -ml-1 pl-1 py-1 hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
                      aria-label={`Open ${currentItem.author}'s profile`}
                    >
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white/20">
                        <AvatarImage
                          src={currentItem.authorImage}
                          alt={currentItem.author}
                        />
                        <AvatarFallback>
                          {currentItem.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-white text-left">
                        <p className="text-base sm:text-lg font-semibold leading-tight hover:underline">
                          {currentItem.author}
                        </p>
                        {currentItem.timestamp && (
                          <p className="text-xs sm:text-sm text-white/70">
                            {currentItem.timestamp}
                          </p>
                        )}
                      </div>
                    </button>
                  ) : (
                    <div className="text-white">
                      <p className="text-base sm:text-lg font-semibold">
                        {getGalleryTitle()}
                      </p>
                      <p className="text-xs sm:text-sm text-white/70">
                        {currentIndex + 1} of {items.length}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {/* Reader toggle button */}
                  {currentItem.description &&
                    currentItem.description.trim().length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("reader")}
                        className="h-9 px-2.5 gap-1.5 text-white hover:bg-white/20 bg-white/10 rounded-full"
                        aria-label="Enter story reader mode"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span className="text-xs font-semibold hidden sm:inline">
                          Read Story
                        </span>
                      </Button>
                    )}
                  {currentItem?.isOwner && (
                    <MediaOwnerMenu
                      itemLabel={
                        currentItem.type === "video"
                          ? "Video"
                          : currentItem.type === "audio"
                          ? "Audio"
                          : "Photo"
                      }
                      onEdit={() =>
                        toast({
                          title: "Edit",
                          description: "Open editor for this media.",
                        })
                      }
                      onChangeAccessFee={() =>
                        toast({
                          title: "Set Access Fee",
                          description:
                            "Visitors pay M5 – M100 to view this content.",
                        })
                      }
                      onDelete={() => {
                        toast({
                          title: "Deleted",
                          description: "Media removed from your profile.",
                        });
                        onOpenChange(false);
                      }}
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div
            {...swipeHandlers}
            onPointerDown={() => autoAdvance && setPaused(true)}
            onPointerUp={() => autoAdvance && setPaused(false)}
            onPointerCancel={() => autoAdvance && setPaused(false)}
            className="relative w-full h-full flex items-center justify-center touch-pan-y"
          >
            {renderMedia()}

            {/* Copyright Marker */}
            {currentItem.copyrightMarked &&
              currentItem.type !== "audio" &&
              viewMode !== "reader" && <CopyrightBadge size="md" />}

            {/* ────────────────────────────────────────────────────────── */}
            {/* 📖 REBUILT IMMERSIVE READER MODE (Shrink + Sticky Heading) */}
            {/* ────────────────────────────────────────────────────────── */}
            {viewMode === "reader" && currentItem.description && (
              <div className="absolute inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl animate-in fade-in duration-200">
                {/* ── TOP READING PROGRESS BAR ── */}
                <div className="w-full bg-muted/50 h-1 shrink-0 z-50">
                  <div
                    className="h-full bg-primary transition-all duration-150 ease-out"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>

                {/* ── STICKY READER TOP BAR ── */}
                <header className="sticky top-0 z-40 flex items-center justify-between px-3 py-2 bg-background/90 backdrop-blur-md border-b border-border/80 shrink-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <button
                      type="button"
                      onClick={() => setViewMode("media")}
                      className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 active:scale-95 transition-transform shrink-0"
                      aria-label="Back to media view"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>

                    {/* When hero is scrolled past or minimized: Sticky Thumbnail + Sticky Title */}
                    <div
                      className={`flex items-center gap-2 min-w-0 transition-all duration-300 ${
                        isHeroCollapsed
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <img
                        src={currentItem.url}
                        alt=""
                        onClick={() => setReaderMinimized(false)}
                        className="h-8 w-8 rounded-md object-cover border border-border shrink-0 cursor-pointer shadow-xs active:scale-95"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block leading-tight">
                          {currentItem.type.toUpperCase()} STORY
                        </span>
                        <h3 className="text-xs font-bold text-foreground truncate leading-tight">
                          {currentItem.title || currentItem.description.slice(0, 50)}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Top Reader Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setReaderMinimized((p) => !p)}
                      className={`h-8 px-2.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                        isHeroCollapsed
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                      title={isHeroCollapsed ? "Expand Media Header" : "Minimize Media Header"}
                    >
                      {isHeroCollapsed ? (
                        <>
                          <Maximize2 className="h-3.5 w-3.5" />
                          <span className="hidden xs:inline text-[11px]">Photo</span>
                        </>
                      ) : (
                        <>
                          <Minimize2 className="h-3.5 w-3.5" />
                          <span className="hidden xs:inline text-[11px]">Focus</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleLike}
                      className={`h-8 w-8 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
                        isLiked
                          ? "bg-red-500 text-white"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                      aria-label="Like story"
                    >
                      <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 active:scale-95 transition-transform"
                      aria-label="Share story"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 active:scale-95 transition-transform"
                      aria-label="Close viewer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </header>

                {/* ── SCROLLABLE ARTICLE BODY ── */}
                <div
                  ref={readerScrollRef}
                  onScroll={handleReaderScroll}
                  className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
                >
                  <article className="max-w-2xl mx-auto w-full pb-20">
                    {/* ── COLLAPSIBLE HERO MEDIA (Shrink/Expand on Tap) ── */}
                    <div
                      onClick={() => setReaderMinimized((p) => !p)}
                      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ease-in-out select-none shadow-md group ${
                        isHeroCollapsed
                          ? "h-0 opacity-0 pointer-events-none mb-0"
                          : "h-52 sm:h-72 opacity-100 mb-5"
                      }`}
                    >
                      {currentItem.type === "video" ? (
                        <div className="relative h-full w-full bg-black">
                          <video
                            src={currentItem.url}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="h-10 w-10 text-white fill-white" />
                          </div>
                        </div>
                      ) : currentItem.type === "audio" ? (
                        <div className="h-full w-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                          <Music className="h-12 w-12 text-white" />
                        </div>
                      ) : (
                        <img
                          src={currentItem.url}
                          alt=""
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Hint pill on top of image */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
                        <Minimize2 className="h-3 w-3" />
                        <span>Tap to shrink media</span>
                      </div>

                      {currentItem.title && (
                        <div className="absolute bottom-3 left-4 right-4">
                          <h2 className="text-white text-base sm:text-lg font-bold leading-tight drop-shadow-md line-clamp-2">
                            {currentItem.title}
                          </h2>
                        </div>
                      )}
                    </div>

                    {/* ── DOCKED MEDIA BANNER (When Collapsed) ── */}
                    {isHeroCollapsed && (
                      <div className="mb-4 flex items-center justify-between p-2.5 rounded-xl bg-muted/60 border border-border">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={currentItem.url}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover border shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                              {currentItem.type} Story
                            </span>
                            <p className="text-xs font-semibold text-foreground truncate">
                              {currentItem.title || currentItem.description.slice(0, 45)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReaderMinimized(false)}
                          className="shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-background hover:bg-background/80 rounded-lg border text-foreground flex items-center gap-1 shadow-2xs"
                        >
                          <Maximize2 className="h-3 w-3" /> Expand
                        </button>
                      </div>
                    )}

                    {/* ── MAIN HEADING ── */}
                    {currentItem.title && (
                      <h1 className="text-xl sm:text-2xl font-black text-foreground leading-tight tracking-tight mb-3">
                        {currentItem.title}
                      </h1>
                    )}

                    {/* ── AUTHOR STRIP (Scrolls Naturally Away) ── */}
                    {currentItem.author && (
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-border">
                        <button
                          type="button"
                          onClick={openAuthorProfile}
                          className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity"
                        >
                          <Avatar className="h-9 w-9 border border-border">
                            <AvatarImage
                              src={currentItem.authorImage}
                              alt={currentItem.author}
                            />
                            <AvatarFallback>
                              {currentItem.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-foreground truncate hover:underline">
                              {currentItem.author}
                            </p>
                            {currentItem.timestamp && (
                              <p className="text-[11px] text-muted-foreground">
                                {currentItem.timestamp}
                              </p>
                            )}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={handleFollow}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                            isFollowing
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-foreground text-background hover:opacity-90"
                          }`}
                        >
                          {isFollowing ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <UserPlus className="h-3 w-3" />
                          )}
                          {isFollowing ? "Following" : "Follow"}
                        </button>
                      </div>
                    )}

                    {/* ── STORY PROSE (With Dropcap & Generous Spacing) ── */}
                    <div className="prose prose-sm sm:prose-base max-w-none text-foreground/90 leading-relaxed font-serif space-y-4">
                      {currentItem.description.split("\n\n").map((para, idx) => (
                        <p key={idx} className="text-justify leading-relaxed">
                          {idx === 0 ? (
                            <>
                              <span className="float-left text-4xl font-sans font-black mr-2 leading-none text-primary">
                                {para.charAt(0)}
                              </span>
                              {para.slice(1)}
                            </>
                          ) : (
                            para
                          )}
                        </p>
                      ))}
                    </div>

                    {/* ── BOTTOM READER ACTION BAR ── */}
                    <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLike}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                            isLiked
                              ? "bg-red-500 text-white"
                              : "bg-muted text-foreground hover:bg-muted/80"
                          }`}
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
                              isLiked ? "fill-current" : ""
                            }`}
                          />
                          <span>{formatFollowerCount(likeCount)}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleComment}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-muted text-foreground text-xs font-bold hover:bg-muted/80 active:scale-95 transition-all"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{formatFollowerCount(currentItem.comments || 0)}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleShare}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-foreground text-background text-xs font-bold hover:opacity-90 active:scale-95 transition-all"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span>Share</span>
                        </button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode("media")}
                          className="rounded-full text-xs font-semibold gap-1 text-muted-foreground"
                        >
                          <ImageIcon className="h-3.5 w-3.5" /> View Media
                        </Button>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            )}

            {/* Navigation Arrows (When more than 1 item) */}
            {items.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-2 border-white/20 z-40"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-2 border-white/20 z-40"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                </Button>
              </>
            )}
          </div>

          {/* Bottom Bar (Media View Mode) */}
          {viewMode !== "reader" && (
            <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/85 to-transparent px-3 pt-10 pb-[max(env(safe-area-inset-bottom),0.75rem)] sm:px-6 sm:pt-12 sm:pb-6">
              <div className="mx-auto w-full max-w-3xl space-y-2.5 sm:space-y-3.5">
                {/* Title row */}
                {currentItem.title && (
                  <button
                    type="button"
                    onClick={() =>
                      currentItem.description &&
                      currentItem.description.trim().length > 0 &&
                      setViewMode("reader")
                    }
                    className="block w-full text-left rounded-xl bg-white/5 px-2.5 py-2 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
                    aria-label={
                      currentItem.description ? "Read full text" : undefined
                    }
                  >
                    <h3 className="text-white text-[15px] sm:text-xl font-bold leading-snug line-clamp-2">
                      {currentItem.title}
                    </h3>
                    {currentItem.description &&
                      currentItem.description.trim().length > 0 && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-primary">
                          <BookOpen className="h-3.5 w-3.5" />
                          Read full story
                        </span>
                      )}
                  </button>
                )}

                {showActions && (
                  <>
                    <div className="flex items-stretch justify-between gap-1 rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/10 p-1">
                      {/* Like */}
                      <button
                        type="button"
                        onClick={handleLike}
                        className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2 transition-colors touch-manipulation active:scale-95 ${
                          isLiked
                            ? "text-red-500"
                            : "text-white hover:bg-white/10"
                        }`}
                        aria-pressed={isLiked}
                        aria-label="Like"
                      >
                        <Heart
                          className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                        />
                        <span className="text-[11px] font-bold leading-none">
                          {formatFollowerCount(likeCount)}
                        </span>
                      </button>

                      {/* Comment */}
                      <button
                        type="button"
                        onClick={handleComment}
                        className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-white transition-colors hover:bg-white/10 touch-manipulation active:scale-95"
                        aria-label="Comment"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-[11px] font-bold leading-none">
                          {formatFollowerCount(currentItem.comments || 0)}
                        </span>
                      </button>

                      {/* Share */}
                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-white transition-colors hover:bg-white/10 touch-manipulation active:scale-95"
                        aria-label="Share"
                      >
                        <Share2 className="h-5 w-5" />
                        <span className="text-[11px] font-bold leading-none">
                          Share
                        </span>
                      </button>

                      {/* Follow (hidden for owner) */}
                      {!currentItem.isOwner && (
                        <button
                          type="button"
                          onClick={handleFollow}
                          className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2 transition-colors touch-manipulation active:scale-95 ${
                            isFollowing
                              ? "text-primary"
                              : "text-white hover:bg-white/10"
                          }`}
                          aria-pressed={isFollowing}
                          aria-label={isFollowing ? "Following" : "Follow"}
                        >
                          <UserPlus
                            className={`h-5 w-5 ${
                              isFollowing ? "fill-current" : ""
                            }`}
                          />
                          <span className="text-[11px] font-bold leading-none">
                            {isFollowing ? "Following" : "Follow"}
                          </span>
                        </button>
                      )}

                      {/* Views (read-only) */}
                      <div className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-white/80">
                        <Eye className="h-5 w-5" />
                        <span className="text-[11px] font-bold leading-none">
                          {formatFollowerCount(viewCount)}
                        </span>
                      </div>
                    </div>

                    {/* Pagination Indicator */}
                    {items.length > 1 && (
                      <div className="flex justify-center">
                        {items.length <= 20 ? (
                          <div className="flex gap-1">
                            {items.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 rounded-full transition-all ${
                                  index === currentIndex
                                    ? "w-5 bg-white"
                                    : "w-1.5 bg-white/40 hover:bg-white/60"
                                }`}
                                aria-label={`Go to item ${index + 1}`}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-white/80 text-xs font-medium">
                            {currentIndex + 1} / {items.length}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        post={{
          id: currentItem?.id,
          title: currentItem?.title || "Media Item",
          author: currentItem?.author || "Unknown Author",
          authorProfileImage: currentItem?.authorImage,
          type:
            currentItem?.type === "video"
              ? "Video"
              : currentItem?.type === "audio"
              ? "Audio"
              : "Photo",
          imageUrl: currentItem?.url,
          likes: likeCount.toString(),
        }}
      />
    </>
  );
};

export default MediaGalleryViewer;