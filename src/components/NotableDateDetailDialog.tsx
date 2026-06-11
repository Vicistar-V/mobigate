import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Cake,
  CalendarHeart,
  MessageCircle,
  Gift,
  UserPlus,
  UserCheck,
  Clock3,
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
  if (!person) return null;

  const isBirthday = person.kind === "birthday";

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{person.name} details</DialogTitle>
        </DialogHeader>

        {/* Hero */}
        <div className="relative w-full aspect-[4/3] bg-muted">
          <img
            src={person.photo}
            alt={person.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
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
