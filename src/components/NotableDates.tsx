import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
type MainTab   = "birthdays" | "events";
type TimeRange = "today" | "tomorrow" | "others";
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
const PersonCard = ({ p, showViewDetails }: { p: NotablePerson; showViewDetails: boolean }) => (
  <div className="flex-shrink-0 w-[148px] rounded-lg border border-border bg-card overflow-hidden">
    <div className="w-full aspect-[3/4] bg-muted overflow-hidden">
      <img src={p.photo} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
    </div>
    <div className="p-2 space-y-1">
      <p className="text-[13px] font-bold text-foreground leading-tight text-center line-clamp-2 min-h-[2.4em]">
        {p.name}
      </p>
      <div className="flex items-center justify-center gap-1 text-[12px]">
        <span className="text-red-600 font-bold">{p.dateLabel}</span>
        <span className="text-muted-foreground">|</span>
        {p.isFriend ? (
          <span className="text-primary font-semibold">Friend</span>
        ) : (
          <Link to={`/friends/add/${p.id}`} className="text-primary font-semibold hover:underline">
            Add Friend
          </Link>
        )}
      </div>
      <div className="flex items-center justify-center gap-1 text-[12px]">
        <Link to={`/messages/${p.id}`} className="text-primary font-semibold hover:underline">Message</Link>
        <span className="text-muted-foreground">|</span>
        <Link to={`/gifts/send/${p.id}`} className="text-primary font-semibold hover:underline">Send Gift</Link>
      </div>
      {showViewDetails && (
        <div className="text-center">
          <Link to={`/events/${p.id}`} className="text-[12px] text-primary font-semibold hover:underline">
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

  const people = useMemo<NotablePerson[]>(() => {
    const fromWindow = (typeof window !== "undefined" && (window as any).__NOTABLE_DATES__) as NotablePerson[] | undefined;
    return fromWindow?.length ? fromWindow : SAMPLE_PEOPLE;
  }, []);

  // Filter cards (optimistic; backend can return pre-filtered slices later)
  const filtered = useMemo(() => {
    // For demo, all sample cards represent "today" entries. Other ranges show empty state.
    if (tab === "birthdays") {
      return bdayRange === "today" ? people : [];
    }
    // events tab — also filter by selected event type
    if (eventRange !== "today") return [];
    return people.map(p => ({ ...p, eventType, eventLabel: eventType === "wedding" ? "Wedding" : eventType === "burial" ? "Burial" : "Event" }));
  }, [tab, bdayRange, eventRange, eventType, people]);

  return (
    <Card className="p-4 space-y-3 hover:shadow-md transition-shadow overflow-hidden">
      {/* Title */}
      <h3 className="text-base font-bold text-foreground">Notable Dates</h3>

      {/* Main tabs */}
      <div className="flex items-center gap-3 flex-wrap">
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
          className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${
            tab === "events"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-foreground hover:bg-muted"
          }`}
        >
          Notable Events
          {tab === "events" && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-sm bg-primary-foreground/20 text-primary-foreground text-xs font-bold">
              +
            </span>
          )}
        </button>
      </div>

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
              <PersonCard key={p.id} p={p} showViewDetails={tab === "events"} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-4">
            No entries in this range. Try another filter above.
          </p>
        )}
      </div>

      {/* Others [Dates] inline links */}
      <p className="text-[13px] text-foreground leading-relaxed">
        <span className="font-bold">Others [Dates]:</span>{" "}
        {[
          { label: "Yesterday",  count: tab === "birthdays" ? BDAY_COUNTS.yesterday : EVENT_COUNTS.yesterday,  range: "yesterday" },
          { label: "Next Week",  count: tab === "birthdays" ? BDAY_COUNTS.nextWeek  : EVENT_COUNTS.nextWeek,  range: "next-week" },
          { label: "Last Week",  count: tab === "birthdays" ? BDAY_COUNTS.lastWeek  : EVENT_COUNTS.lastWeek,  range: "last-week" },
          { label: "Next Month", count: tab === "birthdays" ? BDAY_COUNTS.nextMonth : EVENT_COUNTS.nextMonth, range: "next-month" },
          { label: "Last Month", count: tab === "birthdays" ? BDAY_COUNTS.lastMonth : EVENT_COUNTS.lastMonth, range: "last-month" },
        ].map((o, i, arr) => (
          <span key={o.range}>
            <Link
              to={`/friends/${tab === "birthdays" ? "birthdays" : "events"}?range=${o.range}`}
              className="text-primary font-semibold hover:underline"
            >
              {o.label} [{o.count}]
            </Link>
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
    </Card>
  );
};

export default NotableDates;
