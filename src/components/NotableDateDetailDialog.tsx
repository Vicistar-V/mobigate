import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Cake,
  CalendarHeart,
  MessageCircle,
  Gift,
  UserPlus,
  UserCheck,
  Clock3,
  Images,
  User,
  MoreVertical,
  UserMinus,
  UserX,
  Ban,
  Flag,
  Heart,
  Share2,
  Rss,
  CalendarCheck,
} from "lucide-react";

export interface NotableDetailPerson {
  id: string;
  name: string;
  photo: string;
  images?: string[];        // up to 3 event photos
  dateLabel: string;
  isFriend: boolean;
  kind: "birthday" | "event";
  eventLabel?: string;
  notes?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  person: NotableDetailPerson | null;
  /** "none" → not a friend, "requested" → request sent, "friend" → connected. */
  friendState: "none" | "requested" | "friend";
  onMessage: (p: NotableDetailPerson) => void;
  onGift: (p: NotableDetailPerson) => void;
  onToggleFriend: (p: NotableDetailPerson) => void;
}

export const NotableDateDetailDialog = ({
  isOpen,
  onClose,
  person,
  friendState,
  onMessage,
  onGift,
  onToggleFriend,
}: Props) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);


  // Reset to first slide whenever a different person opens.
  useEffect(() => {
    setActiveIdx(0);
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [person?.id]);

  if (!person) return null;

  const isBirthday = person.kind === "birthday";

  // Gallery: uploaded event photos when present, otherwise the single cover photo.
  const gallery =
    person.images && person.images.length > 0 ? person.images.slice(0, 3) : [person.photo];
  const hasGallery = gallery.length > 1;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeIdx) setActiveIdx(idx);
  };

  const goToSlide = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
    setActiveIdx(idx);
  };

  const handleViewProfile = () => {
    onClose();
    navigate(`/profile/${person.id}`);
  };

  // Lightweight optimistic action handlers for the "more" menu.
  const firstName = person.name.split(" ")[0];
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [willAttend, setWillAttend] = useState(false);

  const moreActions = [
    {
      key: "view",
      label: "View Profile",
      icon: User,
      run: handleViewProfile,
    },
    ...(friendState === "friend"
      ? [
          {
            key: "unfriend",
            label: "Unfriend",
            icon: UserMinus,
            run: () => {
              onToggleFriend(person);
              toast({ title: "Unfriended", description: `You are no longer friends with ${person.name}.` });
            },
          },
        ]
      : []),
    {
      key: "remove",
      label: "Remove",
      icon: UserX,
      run: () => toast({ title: "Removed", description: `${person.name} removed from your list.` }),
    },
    {
      key: "block",
      label: "Block",
      icon: Ban,
      danger: true,
      run: () => toast({ title: "Blocked", description: `${person.name} has been blocked.` }),
    },
    {
      key: "report",
      label: "Report",
      icon: Flag,
      danger: true,
      run: () => toast({ title: "Reported", description: `Your report on ${person.name} was submitted.` }),
    },
    {
      key: "comment",
      label: "Comment",
      icon: MessageCircle,
      run: () => onMessage(person),
    },
    {
      key: "like",
      label: isLiked ? "Liked" : "Like",
      icon: Heart,
      run: () => {
        setIsLiked((v) => !v);
        toast({ title: isLiked ? "Like removed" : "Liked", description: `${firstName}'s ${isBirthday ? "birthday" : "event"}.` });
      },
    },
    {
      key: "share",
      label: "Share",
      icon: Share2,
      run: async () => {
        const shareData = {
          title: person.name,
          text: `Check out ${firstName}'s ${isBirthday ? "birthday" : person.eventLabel || "event"} on Mobigate!`,
          url: typeof window !== "undefined" ? window.location.href : "",
        };
        if (typeof navigator !== "undefined" && typeof (navigator as any).share === "function") {
          try { await navigator.share(shareData); return; } catch { /* dismissed */ return; }
        }
        await navigator.clipboard?.writeText(shareData.url);
        toast({ title: "Link copied", description: "Share link copied to clipboard." });
      },
    },
    {
      key: "follow",
      label: isFollowing ? "Following" : "Follow",
      icon: Rss,
      run: () => {
        setIsFollowing((v) => !v);
        toast({ title: isFollowing ? "Unfollowed" : "Following", description: `${person.name}` });
      },
    },
    {
      key: "attend",
      label: willAttend ? "Attending" : "I will Attend",
      icon: CalendarCheck,
      run: () => {
        setWillAttend((v) => !v);
        toast({ title: willAttend ? "Attendance cancelled" : "You're attending!", description: `${firstName}'s ${isBirthday ? "birthday" : person.eventLabel || "event"}.` });
      },
    },
  ];


  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{person.name} details</DialogTitle>
        </DialogHeader>

        {/* Hero gallery — up to 3 photos, swipe right-to-left */}
        <div className="relative w-full aspect-[4/3] bg-muted">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex h-full w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {gallery.map((src, idx) => (
              <div key={idx} className="relative h-full w-full shrink-0 snap-center">
                <img
                  src={src}
                  alt={`${person.name} — photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {/* Photo count badge */}
          {hasGallery && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-semibold text-white">
              <Images className="h-3.5 w-3.5" />
              {activeIdx + 1}/{gallery.length}
            </span>
          )}

          {/* Dot indicators */}
          {hasGallery && (
            <div className="absolute bottom-16 inset-x-0 flex items-center justify-center gap-1.5">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeIdx ? "w-5 bg-white" : "w-2 bg-white/50"
                  }`}
                  aria-label={`Go to photo ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
              {isBirthday ? (
                <>
                  <Cake className="h-3.5 w-3.5" /> Birthday
                </>
              ) : (
                <>
                  <CalendarHeart className="h-3.5 w-3.5" />
                  {person.eventLabel || "Notable Event"}
                </>
              )}
            </span>
            <h2 className="mt-1.5 text-lg font-bold text-white leading-tight">
              {person.name}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock3 className="h-4 w-4 text-red-600" />
            <span className="font-bold text-red-600">{person.dateLabel}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {friendState === "friend"
                ? "Friend"
                : friendState === "requested"
                  ? "Request sent"
                  : "Not connected"}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {person.notes
              ? person.notes
              : isBirthday
                ? `Celebrate ${person.name.split(" ")[0]}'s special day — send a warm message or a thoughtful gift to make it memorable.`
                : `You're invited to share in ${person.name.split(" ")[0]}'s ${(person.eventLabel || "event").toLowerCase()}. Send your wishes or a gift.`}
          </p>

          {/* Thumbnail strip — tap to jump to a photo */}
          {hasGallery && (
            <div className="flex items-center gap-2">
              {gallery.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`h-14 w-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
                    idx === activeIdx ? "border-primary" : "border-transparent opacity-70"
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <img src={src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onMessage(person)}
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              Message
            </Button>
            <Button className="w-full" onClick={() => onGift(person)}>
              <Gift className="h-4 w-4 mr-1.5" />
              Send Gift
            </Button>
          </div>

          <Button
            variant={friendState === "none" ? "default" : "secondary"}
            className="w-full"
            disabled={friendState === "friend"}
            onClick={() => onToggleFriend(person)}
          >
            {friendState === "friend" ? (
              <>
                <UserCheck className="h-4 w-4 mr-1.5" />
                Friends
              </>
            ) : friendState === "requested" ? (
              <>
                <UserCheck className="h-4 w-4 mr-1.5" />
                Request Sent — Undo
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-1.5" />
                Add Friend
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotableDateDetailDialog;
