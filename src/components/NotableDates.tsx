import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { SendGiftDialog, GiftSelection } from "@/components/chat/SendGiftDialog";
import { CreateEventDialog, CreatedEvent } from "@/components/CreateEventDialog";
import {
  NotableDateDetailDialog,
  NotableDetailPerson,
} from "@/components/NotableDateDetailDialog";
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
  _bucket: TimeRange;
  eventType?: EventType;   // only for events
  eventLabel?: string;     // e.g. "Wedding"
  _typeKey?: string;
}

// ─── Demo data generation ───────────────────────────────────────────────────
// Produces realistic, populated entries for EVERY time range so all filter
// chips show content. The PHP backend will later replace this with pre-filtered
// slices delivered through window.__NOTABLE_DATES__ / __NOTABLE_EVENTS__.
const FIRST = [
  "Anthony", "Emmanuel", "Michael", "Grace", "Blessing", "Chinedu", "Ngozi",
  "Ifeoma", "Tunde", "Aisha", "Samuel", "Joy", "Daniel", "Esther", "Kelechi",
  "Uche", "Bola", "Fatima", "Victor", "Peace",
];
const LAST = [
  "Okafor", "Maduako", "Amaechi", "Eze", "Bello", "Okonkwo", "Adeyemi",
  "Nwosu", "Balogun", "Ibrahim", "Johnson", "Williams", "Obi", "Lawal", "Chukwu",
];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const photoFor = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

// Representative day-offset per bucket (matches bucketOf logic below)
const BUCKET_OFFSET: Record<TimeRange, number> = {
  today: 0,
  tomorrow: 1,
  yesterday: -1,
  "next-week": 3,
  "last-week": -3,
  "next-month": 20,
  "last-month": -20,
  others: 60,
};

// How many demo cards to generate per bucket (also drives the chip counts so
// the number shown always equals the number of cards you can actually open).
const BUCKET_SIZE: Record<TimeRange, number> = {
  today: 3,
  tomorrow: 5,
  yesterday: 2,
  "next-week": 6,
  "last-week": 4,
  "next-month": 9,
  "last-month": 7,
  others: 12,
};

const labelForOffset = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

const EVENT_TYPE_BY_INDEX: { type: EventType; label: string }[] = [
  { type: "wedding", label: "Wedding" },
  { type: "burial", label: "Burial" },
  { type: "others", label: "Graduation" },
  { type: "others", label: "House Warming" },
  { type: "others", label: "Naming Ceremony" },
];

const buildPeople = (kind: "birthday" | "event"): NotablePerson[] => {
  const out: NotablePerson[] = [];
  let n = 0;
  (Object.keys(BUCKET_SIZE) as TimeRange[]).forEach((bucket) => {
    const size = BUCKET_SIZE[bucket];
    for (let i = 0; i < size; i++) {
      const name = `${FIRST[n % FIRST.length]} ${LAST[(n * 3 + i) % LAST.length]}`;
      const base: NotablePerson = {
        id: `${kind}-${bucket}-${i}`,
        name,
        photo: photoFor(name),
        dateLabel: labelForOffset(BUCKET_OFFSET[bucket]),
        isFriend: kind === "birthday" ? true : i % 2 === 0,
        _bucket: bucket,
      };
      if (kind === "event") {
        const ev = EVENT_TYPE_BY_INDEX[n % EVENT_TYPE_BY_INDEX.length];
        base.eventType = ev.type;
        base.eventLabel = ev.label;
        base._typeKey = ev.type;
      }
      out.push(base);
      n++;
    }
  });
  return out;
};

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
  p, showViewDetails, friendState, onMessage, onGift, onOpen,
}: {
  p: NotablePerson;
  showViewDetails: boolean;
  friendState: "none" | "requested" | "friend";
  onMessage: (p: NotablePerson) => void;
  onGift:    (p: NotablePerson) => void;
  onOpen:    (p: NotablePerson) => void;
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onOpen(p)}
    onKeyDown={(e) => { if (e.key === "Enter") onOpen(p); }}
    className="flex-shrink-0 w-[170px] rounded-lg border border-border bg-card overflow-hidden flex flex-col text-left cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all active:scale-[0.99]"
  >
    <div className="w-full aspect-[3/4] bg-muted overflow-hidden">
      <img src={p.photo} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
    </div>
    <div className="p-2.5 space-y-1.5 flex-1 flex flex-col">
      {/* Row 1 — full name */}
      <p className="text-[14px] font-bold text-foreground leading-tight text-center break-words">
        {p.name}
      </p>

      {/* Row 2 — date · friend / add friend */}
      <div className="flex items-center justify-center gap-1.5 text-[13px] flex-wrap">
        <span className="text-red-600 font-bold whitespace-nowrap">{p.dateLabel}</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-primary font-semibold">
          {friendState === "friend" ? "Friend" : friendState === "requested" ? "Requested" : "Add Friend"}
        </span>
      </div>

      {/* Row 3 — message · send gift */}
      <div className="flex items-center justify-center gap-1.5 text-[13px] mt-auto pt-1">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onMessage(p); }}
          className="text-primary font-semibold hover:underline focus:outline-none focus:underline"
        >
          Message
        </button>
        <span className="text-muted-foreground">|</span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onGift(p); }}
          className="text-primary font-semibold hover:underline focus:outline-none focus:underline"
        >
          Send Gift
        </button>
      </div>

      {showViewDetails && (
        <div className="text-center pt-0.5 border-t border-border/60">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpen(p); }}
            className="text-[13px] text-primary font-semibold hover:underline"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  </div>
);

const TimeRangeChips = ({
  active, onChange, counts,
}: {
  active: TimeRange;
  onChange: (r: TimeRange) => void;
  counts: { today: number; tomorrow: number; others: number };
}) => {
  const items: { key: TimeRange; label: string; count: number }[] = [
    { key: "today",    label: "Today",    count: counts.today    },
    { key: "tomorrow", label: "Tomorrow", count: counts.tomorrow },
    { key: "others",   label: "Others",   count: counts.others   },
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

  const { toast } = useToast();
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftUser, setGiftUser] = useState<{ id: string; name: string } | null>(null);

  // Detail dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailPerson, setDetailPerson] = useState<NotableDetailPerson | null>(null);

  // Friend-request state (optimistic, session-scoped)
  const [friendReqs, setFriendReqs] = useState<Record<string, "requested" | "friend">>({});

  // Create Event dialog + user-created events store
  const [createOpen, setCreateOpen] = useState(false);
  const [userEvents, setUserEvents] = useState<CreatedEvent[]>(() => {
    if (typeof window === "undefined") return [];
    const w = window as any;
    return Array.isArray(w.__NOTABLE_EVENTS__) ? (w.__NOTABLE_EVENTS__ as CreatedEvent[]) : [];
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = (e as CustomEvent<CreatedEvent>).detail;
      if (!ev) return;
      setUserEvents(prev => (prev.some(p => p.id === ev.id) ? prev : [ev, ...prev]));
    };
    window.addEventListener("notableEventCreated", handler as any);
    return () => window.removeEventListener("notableEventCreated", handler as any);
  }, []);

  // ── Data ────────────────────────────────────────────────────────────────
  const birthdayPeople = useMemo<NotablePerson[]>(() => {
    const fromWindow = (typeof window !== "undefined" && (window as any).__NOTABLE_DATES__) as NotablePerson[] | undefined;
    if (fromWindow?.length) return fromWindow;
    return buildPeople("birthday");
  }, []);

  const baseEvents = useMemo<NotablePerson[]>(() => buildPeople("event"), []);

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

  // Merge user-created events into the event pool
  const allEvents = useMemo<NotablePerson[]>(() => {
    const created: NotablePerson[] = userEvents.map(ev => ({
      id: ev.id,
      name: ev.name,
      photo: ev.photo,
      dateLabel: ev.dateLabel,
      isFriend: ev.isFriend,
      _bucket: bucketOf(ev.dateISO),
      eventType: (ev.eventType === "wedding" || ev.eventType === "burial") ? ev.eventType : "others",
      eventLabel: ev.eventLabel,
      _typeKey: ev.eventType,
    }));
    return [...created, ...baseEvents];
  }, [userEvents, baseEvents]);

  // ── Counts (derived from real data so chips always match cards) ──────────
  const bdayCounts = useMemo(() => {
    const c: Record<string, number> = {};
    birthdayPeople.forEach(p => { c[p._bucket] = (c[p._bucket] || 0) + 1; });
    return c;
  }, [birthdayPeople]);

  const eventCountsByType = useMemo(() => {
    const matchesType = (k: string | undefined, t: EventType) =>
      t === "wedding" ? k === "wedding"
      : t === "burial" ? k === "burial"
      : (k !== "wedding" && k !== "burial");
    const countFor = (t: EventType) => {
      const c: Record<string, number> = {};
      allEvents.filter(e => matchesType(e._typeKey, t)).forEach(e => {
        c[e._bucket] = (c[e._bucket] || 0) + 1;
      });
      return c;
    };
    return {
      wedding: countFor("wedding"),
      burial:  countFor("burial"),
      others:  countFor("others"),
    };
  }, [allEvents]);

  const eventTypeTotals = useMemo(() => ({
    wedding: allEvents.filter(e => e._typeKey === "wedding").length,
    burial:  allEvents.filter(e => e._typeKey === "burial").length,
    others:  allEvents.filter(e => e._typeKey !== "wedding" && e._typeKey !== "burial").length,
  }), [allEvents]);

  // ── Filtered cards ───────────────────────────────────────────────────────
  const filtered = useMemo<NotablePerson[]>(() => {
    if (tab === "birthdays") {
      return birthdayPeople.filter(p => p._bucket === bdayRange);
    }
    const matchesType = (k: string | undefined) =>
      eventType === "wedding" ? k === "wedding"
      : eventType === "burial" ? k === "burial"
      : (k !== "wedding" && k !== "burial");
    return allEvents.filter(e => e._bucket === eventRange && matchesType(e._typeKey));
  }, [tab, bdayRange, eventRange, eventType, birthdayPeople, allEvents]);

  const activeRange = tab === "birthdays" ? bdayRange : eventRange;
  const setActiveRange = (r: TimeRange) => (tab === "birthdays" ? setBdayRange(r) : setEventRange(r));

  // Counts for the range chips depend on tab (+ event type)
  const rangeCounts = useMemo(() => {
    if (tab === "birthdays") return bdayCounts;
    return eventCountsByType[eventType];
  }, [tab, eventType, bdayCounts, eventCountsByType]);

  // ── Friend state helpers ─────────────────────────────────────────────────
  const friendStateOf = (p: NotablePerson): "none" | "requested" | "friend" => {
    if (p.isFriend) return "friend";
    return friendReqs[p.id] || "none";
  };

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleMessage = (p: NotablePerson | NotableDetailPerson) => {
    window.dispatchEvent(new CustomEvent("openChatWithUser", {
      detail: { userId: p.id, userName: p.name },
    }));
    toast({ title: "Opening chat", description: `Starting a conversation with ${p.name}` });
  };

  const handleGift = (p: NotablePerson | NotableDetailPerson) => {
    setGiftUser({ id: p.id, name: p.name });
    setGiftOpen(true);
  };

  const handleOpenDetail = (p: NotablePerson) => {
    setDetailPerson({
      id: p.id,
      name: p.name,
      photo: p.photo,
      dateLabel: p.dateLabel,
      isFriend: p.isFriend,
      kind: tab === "birthdays" ? "birthday" : "event",
      eventLabel: p.eventLabel,
    });
    setDetailOpen(true);
  };

  const handleToggleFriend = (p: NotablePerson | NotableDetailPerson) => {
    setFriendReqs(prev => {
      const next = { ...prev };
      if (next[p.id] === "requested") {
        delete next[p.id];
        toast({ title: "Request withdrawn", description: `Friend request to ${p.name} cancelled.` });
      } else {
        next[p.id] = "requested";
        toast({ title: "Friend request sent", description: `Your request to ${p.name} is on its way.` });
      }
      return next;
    });
  };

  const handleCreated = (ev: CreatedEvent) => {
    setUserEvents(prev => (prev.some(p => p.id === ev.id) ? prev : [ev, ...prev]));
    setTab("events");
    setEventRange(bucketOf(ev.dateISO));
    setEventType(
      ev.eventType === "wedding" ? "wedding"
      : ev.eventType === "burial" ? "burial"
      : "others"
    );
  };

  const detailFriendState = detailPerson
    ? (detailPerson.isFriend ? "friend" : (friendReqs[detailPerson.id] || "none"))
    : "none";

  return (
    <Card className="p-4 space-y-3 hover:shadow-md transition-shadow overflow-hidden">
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

      {tab === "birthdays" && (
        <p className="text-[12px] text-muted-foreground leading-snug">
          Birthdays are generated automatically from friends' profile information.
        </p>
      )}

      {tab === "events" && (
        <EventTypeChips active={eventType} onChange={setEventType} counts={eventTypeTotals} />
      )}

      <TimeRangeChips
        active={activeRange}
        onChange={setActiveRange}
        counts={{
          today: rangeCounts.today || 0,
          tomorrow: rangeCounts.tomorrow || 0,
          others: rangeCounts.others || 0,
        }}
      />

      {/* Cards row */}
      <div className="-mx-4 px-4 overflow-x-auto touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filtered.length > 0 ? (
          <div className="flex gap-3 pb-1">
            {filtered.map(p => (
              <PersonCard
                key={p.id}
                p={p}
                showViewDetails={tab === "events"}
                friendState={friendStateOf(p)}
                onMessage={handleMessage}
                onGift={handleGift}
                onOpen={handleOpenDetail}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-4">
            No entries in this range. Try another filter above.
          </p>
        )}
      </div>

      {/* Others [Dates] */}
      <p className="text-[13px] text-foreground leading-relaxed">
        <span className="font-bold">Others [Dates]:</span>{" "}
        {([
          { label: "Yesterday",  range: "yesterday"   as TimeRange },
          { label: "Next Week",  range: "next-week"   as TimeRange },
          { label: "Last Week",  range: "last-week"   as TimeRange },
          { label: "Next Month", range: "next-month"  as TimeRange },
          { label: "Last Month", range: "last-month"  as TimeRange },
        ]).map((o, i, arr) => (
          <span key={o.range}>
            <button
              type="button"
              onClick={() => setActiveRange(o.range)}
              className={`font-semibold transition-colors ${
                activeRange === o.range ? "text-primary underline" : "text-primary hover:underline"
              }`}
            >
              {o.label} [{rangeCounts[o.range] || 0}]
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
              <button
                type="button"
                onClick={() => { setEventType("others"); setEventRange("today"); }}
                className="text-primary font-semibold hover:underline"
              >
                {e.label} [{e.count}]
              </button>
              {i < arr.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      )}

      {/* Detail dialog */}
      <NotableDateDetailDialog
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        person={detailPerson}
        friendState={detailFriendState}
        onMessage={handleMessage}
        onGift={handleGift}
        onToggleFriend={handleToggleFriend}
      />

      {/* Send Gift dialog */}
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
