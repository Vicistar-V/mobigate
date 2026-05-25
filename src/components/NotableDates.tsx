import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { SendGiftDialog, GiftSelection } from "@/components/chat/SendGiftDialog";
import { CreateEventDialog, CreatedEvent } from "@/components/CreateEventDialog";
import { useToast } from "@/hooks/use-toast";

// ─── Types ──────────────────────────────────────────────────────────────────
type MainTab   = "birthdays" | "events";
type TimeRange = "today" | "tomorrow" | "others" | "yesterday" | "next-week" | "last-week" | "next-month" | "last-month";
type EventType = "wedding" | "burial" | "others";

interface NotablePerson {
  id: string;
  name: string;
  photo: string;
  dateLabel: string;       // e.g. "August 25"
  isFriend: boolean;
  eventType?: EventType;   // only for events
  eventLabel?: string;     // e.g. "Wedding"
}

// ─── Sample / window-bridge data ────────────────────────────────────────────
const SAMPLE_PEOPLE: NotablePerson[] = [
  { id: "a1", name: "Anthony Okafor Ejiro",  photo: "https://api.dicebear.com/7.x/initials/svg?seed=Anthony%20Okafor",  dateLabel: "August 25", isFriend: true  },
  { id: "a2", name: "Emmanuel Maduako",      photo: "https://api.dicebear.com/7.x/initials/svg?seed=Emmanuel%20Maduako", dateLabel: "August 25", isFriend: false },
  { id: "a3", name: "Michael Amaechi Ndukaku", photo: "https://api.dicebear.com/7.x/initials/svg?seed=Michael%20Amaechi", dateLabel: "August 25", isFriend: true  },
];

// Counts for filter chips (would come from backend window vars)
const BDAY_COUNTS  = { today: 3, tomorrow: 5, others: 84, yesterday: 2, nextWeek: 6, lastWeek: 4, nextMonth: 19, lastMonth: 27 };
const EVENT_COUNTS = { today: 3, tomorrow: 5, others: 84, yesterday: 2, nextWeek: 6, lastWeek: 4, nextMonth: 19, lastMonth: 27 };
const EVENT_TYPE_COUNTS = { wedding: 12, burial: 5, others: 84 };
const OTHER_EVENT_TYPES = [
  { label: "Graduation",      count: 2  },
  { label: "Matriculation",   count: 6  },
  { label: "Child Dedication",count: 4  },
  { label: "House Warming",   count: 7  },
  { label: "Naming Ceremony", count: 3  },
  { label: "Coronation",      count: 1  },
];

// ─── Subcomponents (defined OUTSIDE parent to keep stable refs) ─────────────
const PersonCard = ({
  p, showViewDetails, onMessage, onGift,
}: {
  p: NotablePerson;
  showViewDetails: boolean;
  onMessage: (p: NotablePerson) => void;
  onGift:    (p: NotablePerson) => void;
}) => (
  <div className="flex-shrink-0 w-[170px] rounded-lg border border-border bg-card overflow-hidden flex flex-col">
    <div className="w-full aspect-[3/4] bg-muted overflow-hidden">
      <img src={p.photo} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
    </div>
    <div className="p-2.5 space-y-1.5 flex-1 flex flex-col">
      {/* Row 1 — full name (own line, may wrap) */}
      <p className="text-[14px] font-bold text-foreground leading-tight text-center break-words">
        {p.name}
      </p>

      {/* Row 2 — date · friend / add friend */}
      <div className="flex items-center justify-center gap-1.5 text-[13px] flex-wrap">
        <span className="text-red-600 font-bold whitespace-nowrap">{p.dateLabel}</span>
        <span className="text-muted-foreground">|</span>
        {p.isFriend ? (
          <span className="text-primary font-semibold">Friend</span>
        ) : (
          <Link to={`/friends/add/${p.id}`} className="text-primary font-semibold hover:underline">
            Add Friend
          </Link>
        )}
      </div>

      {/* Row 3 — message · send gift (functional) */}
      <div className="flex items-center justify-center gap-1.5 text-[13px] mt-auto pt-1">
        <button
          type="button"
          onClick={() => onMessage(p)}
          className="text-primary font-semibold hover:underline focus:outline-none focus:underline"
        >
          Message
        </button>
        <span className="text-muted-foreground">|</span>
        <button
          type="button"
          onClick={() => onGift(p)}
          className="text-primary font-semibold hover:underline focus:outline-none focus:underline"
        >
          Send Gift
        </button>
      </div>

      {showViewDetails && (
        <div className="text-center pt-0.5 border-t border-border/60">
          <Link to={`/events/${p.id}`} className="text-[13px] text-primary font-semibold hover:underline">
            View Details
          </Link>
        </div>
      )}
    </div>
  </div>
);


const TimeRangeChips = ({
  active, onChange, counts, basePath,
}: {
  active: TimeRange;
  onChange: (r: TimeRange) => void;
  counts: { today: number; tomorrow: number; others: number };
  basePath: string;
}) => {
  const items: { key: TimeRange; label: string; count: number }[] = [
    { key: "today",    label: "Today",    count: counts.today    },
    { key: "tomorrow", label: "Tomorrow", count: counts.tomorrow },
    { key: "others",   label: "Others",   count: counts.others   },
  ];
  return (
    <div className="flex items-center flex-wrap gap-x-1 gap-y-1 text-[13px]">
      <span className="text-muted-foreground font-bold">|</span>
      {items.map((it, i) => (
        <span key={it.key} className="flex items-center gap-1">
          <button
            onClick={() => onChange(it.key)}
            className={`font-semibold transition-colors ${
              active === it.key ? "text-primary underline" : "text-foreground hover:text-primary"
            }`}
          >
            {it.label} [{it.count}]
          </button>
          <span className="text-muted-foreground font-bold">|</span>
        </span>
      ))}
    </div>
  );
};

const EventTypeChips = ({
  active, onChange, counts,
}: {
  active: EventType;
  onChange: (e: EventType) => void;
  counts: { wedding: number; burial: number; others: number };
}) => {
  const items: { key: EventType; label: string; count: number }[] = [
    { key: "wedding", label: "Wedding/Marriage", count: counts.wedding },
    { key: "burial",  label: "Burial",           count: counts.burial  },
    { key: "others",  label: "Others",           count: counts.others  },
  ];
  return (
    <div className="flex items-center flex-wrap gap-x-1 gap-y-1 text-[13px]">
      <span className="text-muted-foreground font-bold">|</span>
      {items.map((it) => (
        <span key={it.key} className="flex items-center gap-1">
          <button
            onClick={() => onChange(it.key)}
            className={`font-semibold transition-colors ${
              active === it.key ? "text-primary underline" : "text-foreground hover:text-primary"
            }`}
          >
            {it.label} [{it.count}]
          </button>
          <span className="text-muted-foreground font-bold">|</span>
        </span>
      ))}
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────
export const NotableDates = () => {
  const [tab,        setTab]        = useState<MainTab>("birthdays");
  const [bdayRange,  setBdayRange]  = useState<TimeRange>("today");
  const [eventRange, setEventRange] = useState<TimeRange>("today");
  const [eventType,  setEventType]  = useState<EventType>("wedding");

  // ── Message + Gift wiring (reuse existing app components/events) ─────────
  const { toast } = useToast();
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftUser, setGiftUser] = useState<{ id: string; name: string } | null>(null);

  // ── Create Event dialog + user-created events store ──────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [userEvents, setUserEvents] = useState<CreatedEvent[]>(() => {
    if (typeof window === "undefined") return [];
    const w = window as any;
    return Array.isArray(w.__NOTABLE_EVENTS__) ? (w.__NOTABLE_EVENTS__ as CreatedEvent[]) : [];
  });

  // Listen for events created elsewhere (e.g. another mounted instance)
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = (e as CustomEvent<CreatedEvent>).detail;
      if (!ev) return;
      setUserEvents(prev => (prev.some(p => p.id === ev.id) ? prev : [ev, ...prev]));
    };
    window.addEventListener("notableEventCreated", handler as any);
    return () => window.removeEventListener("notableEventCreated", handler as any);
  }, []);

  const handleMessage = (p: NotablePerson) => {
    window.dispatchEvent(new CustomEvent("openChatWithUser", {
      detail: { userId: p.id, userName: p.name },
    }));
    toast({ title: "Opening chat", description: `Starting a conversation with ${p.name}` });
  };

  const handleGift = (p: NotablePerson) => {
    setGiftUser({ id: p.id, name: p.name });
    setGiftOpen(true);
  };

  const people = useMemo<NotablePerson[]>(() => {
    const fromWindow = (typeof window !== "undefined" && (window as any).__NOTABLE_DATES__) as NotablePerson[] | undefined;
    return fromWindow?.length ? fromWindow : SAMPLE_PEOPLE;
  }, []);

  // Map a user-created event into the NotablePerson card shape
  const userEventCards = useMemo<NotablePerson[]>(() => {
    return userEvents.map(ev => ({
      id:         ev.id,
      name:       ev.name,
      photo:      ev.photo,
      dateLabel:  ev.dateLabel,
      isFriend:   ev.isFriend,
      eventType:  (ev.eventType === "wedding" || ev.eventType === "burial") ? ev.eventType : "others",
      eventLabel: ev.eventLabel,
    }));
  }, [userEvents]);

  // Range bucket calculator (today / tomorrow / etc.) — used to filter user events
  const bucketOf = (iso: string): TimeRange => {
    if (!iso) return "others";
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const target = new Date(iso); target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - today.getTime()) / 86_400_000);
    if (diffDays === 0)  return "today";
    if (diffDays === 1)  return "tomorrow";
    if (diffDays === -1) return "yesterday";
    if (diffDays > 1  && diffDays <= 7)   return "next-week";
    if (diffDays < -1 && diffDays >= -7)  return "last-week";
    if (diffDays > 7  && diffDays <= 31)  return "next-month";
    if (diffDays < -7 && diffDays >= -31) return "last-month";
    return "others";
  };

  // Filter cards (optimistic; backend can return pre-filtered slices later)
  const filtered = useMemo(() => {
    if (tab === "birthdays") {
      return bdayRange === "today" ? people : [];
    }
    // events tab — combine demo "today" people with user-created events, then filter
    const demoEvents = people.map(p => ({
      ...p,
      eventType,
      eventLabel: eventType === "wedding" ? "Wedding" : eventType === "burial" ? "Burial" : "Event",
      _bucket: "today" as TimeRange,
      _typeKey: eventType as string,
    }));
    const created = userEvents.map(ev => ({
      id: ev.id, name: ev.name, photo: ev.photo, dateLabel: ev.dateLabel, isFriend: ev.isFriend,
      eventType: (ev.eventType === "wedding" || ev.eventType === "burial") ? ev.eventType : "others" as EventType,
      eventLabel: ev.eventLabel,
      _bucket: bucketOf(ev.dateISO),
      _typeKey: ev.eventType as string,
    }));
    const wedKey = "wedding", burKey = "burial";
    const matchesType = (k: string) =>
      eventType === "wedding" ? k === wedKey
      : eventType === "burial" ? k === burKey
      : (k !== wedKey && k !== burKey);
    return [...created, ...demoEvents].filter(c => c._bucket === eventRange && matchesType(c._typeKey));
  }, [tab, bdayRange, eventRange, eventType, people, userEvents]);

  const activeRange = tab === "birthdays" ? bdayRange : eventRange;
  const setActiveRange = (r: TimeRange) => (tab === "birthdays" ? setBdayRange(r) : setEventRange(r));
  const rangeCounts = tab === "birthdays" ? BDAY_COUNTS : EVENT_COUNTS;

  const handleCreated = (ev: CreatedEvent) => {
    setUserEvents(prev => (prev.some(p => p.id === ev.id) ? prev : [ev, ...prev]));
    // Jump the UI to where the new event will actually show
    setTab("events");
    setEventRange(bucketOf(ev.dateISO));
    setEventType(
      ev.eventType === "wedding" ? "wedding"
      : ev.eventType === "burial" ? "burial"
      : "others"
    );
  };



  return (
    <Card className="p-4 space-y-3 hover:shadow-md transition-shadow overflow-hidden">
      {/* Title */}
      <h3 className="text-base font-bold text-foreground">Notable Dates</h3>

      {/* Main tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setTab("birthdays")}
          className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${
            tab === "birthdays"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-foreground hover:bg-muted"
          }`}
        >
          Birthdays
        </button>
        <button
          onClick={() => setTab("events")}
          className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${
            tab === "events"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-foreground hover:bg-muted"
          }`}
        >
          Notable Events
        </button>

        {/* Create Event — only relevant on the Events tab, but visible there always */}
        {tab === "events" && (
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[13px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
            aria-label="Create new notable event"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        )}
      </div>

      {/* Birthdays helper — explains they're auto-generated */}
      {tab === "birthdays" && (
        <p className="text-[12px] text-muted-foreground leading-snug">
          Birthdays are generated automatically from friends' profile information.
        </p>
      )}

      {/* Event-type chips (events tab only) */}
      {tab === "events" && (
        <EventTypeChips active={eventType} onChange={setEventType} counts={EVENT_TYPE_COUNTS} />
      )}

      {/* Time-range chips */}
      {tab === "birthdays" ? (
        <TimeRangeChips
          active={bdayRange}
          onChange={setBdayRange}
          counts={{ today: BDAY_COUNTS.today, tomorrow: BDAY_COUNTS.tomorrow, others: BDAY_COUNTS.others }}
          basePath="/friends/birthdays"
        />
      ) : (
        <TimeRangeChips
          active={eventRange}
          onChange={setEventRange}
          counts={{ today: EVENT_COUNTS.today, tomorrow: EVENT_COUNTS.tomorrow, others: EVENT_COUNTS.others }}
          basePath="/friends/events"
        />
      )}

      {/* Cards row — horizontal scroll on mobile */}
      <div className="-mx-4 px-4 overflow-x-auto touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filtered.length > 0 ? (
          <div className="flex gap-3 pb-1">
            {filtered.map(p => (
              <PersonCard key={p.id} p={p} showViewDetails={tab === "events"} onMessage={handleMessage} onGift={handleGift} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-4">
            No entries in this range. Try another filter above.
          </p>
        )}
      </div>

      {/* Others [Dates] inline filter buttons */}
      <p className="text-[13px] text-foreground leading-relaxed">
        <span className="font-bold">Others [Dates]:</span>{" "}
        {([
          { label: "Yesterday",  count: rangeCounts.yesterday,  range: "yesterday"   as TimeRange },
          { label: "Next Week",  count: rangeCounts.nextWeek,   range: "next-week"   as TimeRange },
          { label: "Last Week",  count: rangeCounts.lastWeek,   range: "last-week"   as TimeRange },
          { label: "Next Month", count: rangeCounts.nextMonth,  range: "next-month"  as TimeRange },
          { label: "Last Month", count: rangeCounts.lastMonth,  range: "last-month"  as TimeRange },
        ]).map((o, i, arr) => (
          <span key={o.range}>
            <button
              type="button"
              onClick={() => setActiveRange(o.range)}
              className={`font-semibold transition-colors ${
                activeRange === o.range ? "text-primary underline" : "text-primary hover:underline"
              }`}
            >
              {o.label} [{o.count}]
            </button>
            {i < arr.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>

      {/* Others [Events] – events tab only */}
      {tab === "events" && (
        <p className="text-[13px] text-foreground leading-relaxed">
          <span className="font-bold">Others [Events]:</span>{" "}
          {OTHER_EVENT_TYPES.map((e, i, arr) => (
            <span key={e.label}>
              <Link
                to={`/friends/events?type=${encodeURIComponent(e.label.toLowerCase())}`}
                className="text-primary font-semibold hover:underline"
              >
                {e.label} [{e.count}]
              </Link>
              {i < arr.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      )}


      {/* Send Gift dialog — reuses the same component as PeopleYouMayKnow */}
      <SendGiftDialog
        isOpen={giftOpen}
        onClose={() => { setGiftOpen(false); setGiftUser(null); }}
        recipientName={giftUser?.name || ""}
        recipientId={giftUser?.id}
        onSendGift={(_gift: GiftSelection) => {
          setGiftOpen(false);
          setGiftUser(null);
        }}
      />

      {/* Create Event dialog */}
      <CreateEventDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
    </Card>
  );
};

export default NotableDates;
