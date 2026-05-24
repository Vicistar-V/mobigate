import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Cake, Gift, Heart, PartyPopper, CalendarDays, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

type NotableKind = "birthday" | "anniversary" | "wedding" | "milestone";

interface NotableDate {
  id: string;
  name: string;
  profileImage?: string;
  kind: NotableKind;
  date: string;        // human readable e.g. "Aug 25"
  whenLabel: string;   // e.g. "Today", "Tomorrow", "In 3 days"
  highlight?: boolean; // today
}

const SAMPLE: NotableDate[] = [
  { id: "1", name: "Amaka Jane",     kind: "birthday",    date: "Today",       whenLabel: "Today",      highlight: true,
    profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Amaka%20Jane" },
  { id: "2", name: "Chinedu Okafor", kind: "anniversary", date: "Tomorrow",    whenLabel: "Tomorrow",
    profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Chinedu%20Okafor" },
  { id: "3", name: "Sarah Johnson",  kind: "birthday",    date: "Aug 27",      whenLabel: "In 2 days",
    profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Johnson" },
  { id: "4", name: "Michael Chen",   kind: "wedding",     date: "Aug 30",      whenLabel: "In 5 days",
    profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Michael%20Chen" },
  { id: "5", name: "Emily Williams", kind: "birthday",    date: "Sep 02",      whenLabel: "Next week",
    profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Emily%20Williams" },
  { id: "6", name: "Peter Iprec",    kind: "milestone",   date: "Sep 10",      whenLabel: "Next week",
    profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Peter%20Iprec" },
];

const kindMeta: Record<NotableKind, { label: string; icon: typeof Cake; chip: string }> = {
  birthday:    { label: "Birthday",    icon: Cake,         chip: "bg-pink-500/10    text-pink-600    border-pink-500/20"    },
  anniversary: { label: "Anniversary", icon: Heart,        chip: "bg-rose-500/10    text-rose-600    border-rose-500/20"    },
  wedding:     { label: "Wedding",     icon: PartyPopper,  chip: "bg-violet-500/10  text-violet-600  border-violet-500/20"  },
  milestone:   { label: "Milestone",   icon: Gift,         chip: "bg-amber-500/10   text-amber-600   border-amber-500/20"   },
};

export const NotableDates = () => {
  // PHP bridge: window.__NOTABLE_DATES__ (when available)
  const items = useMemo<NotableDate[]>(() => {
    const fromWindow = (typeof window !== "undefined" && (window as any).__NOTABLE_DATES__) as NotableDate[] | undefined;
    return fromWindow?.length ? fromWindow : SAMPLE;
  }, []);

  if (!items.length) return null;

  return (
    <Card className="p-4 space-y-4 hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold text-foreground">Notable Dates</h3>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary h-8 px-2 text-sm font-semibold">
          <Link to="/friends/birthdays?range=all" className="flex items-center gap-1">
            See all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Horizontal scroll */}
      <div className="-mx-4 px-4 overflow-x-auto touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 pb-1">
          {items.map((item) => {
            const meta = kindMeta[item.kind];
            const Icon = meta.icon;
            return (
              <div
                key={item.id}
                className={`flex-shrink-0 w-[150px] rounded-xl border bg-card p-3 flex flex-col items-center text-center gap-2 ${
                  item.highlight ? "ring-2 ring-primary/40 border-primary/40" : "border-border"
                }`}
              >
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-2 ring-background">
                    <AvatarImage src={item.profileImage} alt={item.name} />
                    <AvatarFallback className="text-sm font-semibold">
                      {item.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                    <Icon className="h-4 w-4 text-primary" />
                  </span>
                </div>

                <div className="w-full">
                  <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${meta.chip}`}>
                    {meta.label}
                  </span>
                  <p className={`mt-1 text-xs font-semibold ${item.highlight ? "text-primary" : "text-muted-foreground"}`}>
                    {item.whenLabel}{item.whenLabel !== item.date ? ` · ${item.date}` : ""}
                  </p>
                </div>

                <Button asChild size="sm" className="w-full h-8 text-xs font-semibold">
                  <Link to={`/profile/${item.id}`}>
                    {item.kind === "birthday" ? "Wish & Gift" : "Send Wishes"}
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default NotableDates;
