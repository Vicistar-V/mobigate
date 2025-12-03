import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, MessageCircle, Share2, Eye, X, Calendar, MapPin, Users, TrendingUp } from "lucide-react";
import { CommentSection } from "@/components/CommentSection";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventItem } from "@/data/eventsData";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EventDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventItem;
  onLike: (eventId: string) => void;
  isLiked: boolean;
  likeCount: number;
}

export const EventDetailDialog = ({
  open,
  onOpenChange,
  event,
  onLike,
  isLiked,
  likeCount,
}: EventDetailDialogProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [hasRSVPd, setHasRSVPd] = useState(false);
  const [currentRSVPCount, setCurrentRSVPCount] = useState(event.rsvpCount);

  const handleLike = () => {
    onLike(event.id);
  };

  const handleRSVP = () => {
    setHasRSVPd(!hasRSVPd);
    setCurrentRSVPCount(prev => hasRSVPd ? prev - 1 : prev + 1);
    toast({ 
      description: hasRSVPd ? "RSVP cancelled" : "RSVP confirmed! See you at the event." 
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ description: "Link copied to clipboard" });
    }
  };

  const handleAuthorClick = () => {
    onOpenChange(false);
    if (event.authorId) {
      navigate(`/profile/${event.authorId}`);
    }
  };

  const getEventTypeColor = (type: EventItem["eventType"]) => {
    switch (type) {
      case "conference":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "workshop":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "meetup":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "celebration":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      case "fundraiser":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      case "social":
        return "bg-pink-500/10 text-pink-600 dark:text-pink-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getVenueTypeColor = (type: EventItem["venueType"]) => {
    switch (type) {
      case "indoor":
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400";
      case "outdoor":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "virtual":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400";
      case "hybrid":
        return "bg-violet-500/10 text-violet-600 dark:text-violet-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Shared content component for both mobile and desktop
  const EventContent = () => (
    <div className="flex flex-col h-full">
      {/* Close button - top right */}
      <button
        onClick={() => onOpenChange(false)}
        className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors md:hidden"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <ScrollArea className="flex-1">
        <div className="pb-24 md:pb-6">
          {/* Hero Image */}
          {event.thumbnail && (
            <div className="relative w-full">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={event.thumbnail}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {event.spotlight && (
                  <div className="absolute top-4 left-4">
                    <Badge className="gap-1 bg-primary text-primary-foreground">
                      <TrendingUp className="h-3 w-3" />
                      SPOTLIGHT
                    </Badge>
                  </div>
                )}
              </AspectRatio>
            </div>
          )}

          {/* Content Container */}
          <div className="px-5 sm:px-6 py-4 space-y-4">
            {/* Event Type and Venue Type Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getEventTypeColor(event.eventType)}>
                {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
              </Badge>
              <Badge className={getVenueTypeColor(event.venueType)}>
                {event.venueType.charAt(0).toUpperCase() + event.venueType.slice(1)}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {event.audience}
              </Badge>
              {event.sponsorship === "sponsored" && (
                <Badge variant="secondary">Sponsored</Badge>
              )}
              {event.sponsorship === "free" && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">Free</Badge>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {event.title}
            </h2>

            {/* Event Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Date & Time */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Date & Time</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {event.endDate && ` - ${new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Venue</p>
                  <p className="text-sm font-medium text-foreground line-clamp-2">
                    {event.venue}
                  </p>
                </div>
              </div>

              {/* RSVP Info */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Attendance</p>
                  <p className="text-sm font-medium text-foreground">
                    {currentRSVPCount} / {event.capacity} RSVPs
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.capacity - currentRSVPCount} spots remaining
                  </p>
                </div>
              </div>
            </div>

            {/* Author Section */}
            <button
              onClick={handleAuthorClick}
              className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage src={event.authorProfileImage} alt={event.author} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {event.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground text-sm">{event.author}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
                </p>
              </div>
            </button>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">About this event</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Stats Row - Compact */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{event.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                <span>{likeCount.toLocaleString()} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{event.comments.toLocaleString()} comments</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5" />
                <span>{event.shares.toLocaleString()} shares</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Comments Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comments ({event.comments})
              </h3>
              <CommentSection postId={event.id} className="border-none p-0" />
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Bottom Action Bar - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-5 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <Button
            variant={hasRSVPd ? "default" : "outline"}
            onClick={handleRSVP}
            className="flex-1"
            disabled={currentRSVPCount >= event.capacity && !hasRSVPd}
          >
            <Users className="h-4 w-4 mr-2" />
            {hasRSVPd ? "Cancel RSVP" : "RSVP"}
          </Button>
          
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 min-w-[60px] touch-manipulation active:scale-95 transition-transform"
          >
            <Heart 
              className={cn(
                "h-6 w-6 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} 
            />
            <span className="text-xs text-muted-foreground font-medium">{likeCount.toLocaleString()}</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 min-w-[60px] touch-manipulation active:scale-95 transition-transform"
          >
            <Share2 className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Desktop Action Bar */}
      <div className="hidden md:flex items-center gap-2 px-6 py-4 border-t border-border bg-card">
        <Button
          variant={hasRSVPd ? "default" : "outline"}
          onClick={handleRSVP}
          className="gap-2"
          disabled={currentRSVPCount >= event.capacity && !hasRSVPd}
        >
          <Users className="h-4 w-4" />
          {hasRSVPd ? "Cancel RSVP" : `RSVP (${currentRSVPCount}/${event.capacity})`}
        </Button>

        <Button
          variant={isLiked ? "default" : "outline"}
          size="sm"
          onClick={handleLike}
          className="gap-2"
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          Like ({likeCount.toLocaleString()})
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const commentInput = document.querySelector('textarea[placeholder*="comment"]') as HTMLTextAreaElement;
            if (commentInput) {
              commentInput.focus();
            }
          }}
          className="gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Comment ({event.comments.toLocaleString()})
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share ({event.shares.toLocaleString()})
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[95vh] h-[95vh] flex flex-col overflow-hidden p-0">
            <EventContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden rounded-xl">
            <EventContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};