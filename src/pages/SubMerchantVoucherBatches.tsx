import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, ChevronRight, Filter, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initialSubMerchantBatches } from "@/data/subMerchantVoucherData";
import { getBatchStatusCounts, formatNum } from "@/data/merchantVoucherData";

type SortOption = "newest" | "oldest" | "denom_high" | "denom_low";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function SubMerchantVoucherBatches() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Date filters
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterDay, setFilterDay] = useState<string>("all");
  const [filterHour, setFilterHour] = useState<string>("all");

  const yearOptions = useMemo(() => {
    const years = [...new Set(initialSubMerchantBatches.map(b => b.createdAt.getFullYear()))].sort((a, b) => b - a);
    return years;
  }, []);

  const dayOptions = useMemo(() => {
    if (filterYear === "all" || filterMonth === "all") return Array.from({ length: 31 }, (_, i) => i + 1);
    const daysInMonth = new Date(Number(filterYear), Number(filterMonth) + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [filterYear, filterMonth]);

  const filtered = useMemo(() => {
    let result = [...initialSubMerchantBatches];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => b.batchNumber.toLowerCase().includes(q));
    }
    if (filterYear !== "all") {
      result = result.filter(b => b.createdAt.getFullYear() === Number(filterYear));
    }
    if (filterMonth !== "all") {
      result = result.filter(b => b.createdAt.getMonth() === Number(filterMonth));
    }
    if (filterDay !== "all") {
      result = result.filter(b => b.createdAt.getDate() === Number(filterDay));
    }
    if (filterHour !== "all") {
      result = result.filter(b => b.createdAt.getHours() === Number(filterHour));
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest": return a.createdAt.getTime() - b.createdAt.getTime();
        case "denom_high": return b.denomination - a.denomination;
        case "denom_low": return a.denomination - b.denomination;
        default: return 0;
      }
    });
    return result;
  }, [searchQuery, sortBy, filterYear, filterMonth, filterDay, filterHour]);

  const clearDateFilters = () => {
    setFilterYear("all");
    setFilterMonth("all");
    setFilterDay("all");
    setFilterHour("all");
  };

  const hasDateFilter = filterYear !== "all" || filterMonth !== "all" || filterDay !== "all" || filterHour !== "all";

  return (
    <div className="bg-background min-h-screen pb-6">
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">My Batches</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} batch{filtered.length !== 1 ? "es" : ""}</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-9 w-9 rounded-full flex items-center justify-center active:scale-90 touch-manipulation ${showFilters ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text" placeholder="Search by batch number..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-9 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-muted-foreground" /></button>}
          </div>
        </div>
        {showFilters && (
          <div className="px-4 pb-3 border-t border-border/30 pt-3 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">Sort</p>
              <div className="flex gap-1.5 flex-wrap">
                {([["newest","Newest"],["oldest","Oldest"],["denom_high","Denom ↓"],["denom_low","Denom ↑"]] as [SortOption,string][]).map(([val,label]) => (
                  <button key={val} onClick={() => setSortBy(val)} className={`h-8 px-3 rounded-lg text-xs font-semibold touch-manipulation ${sortBy === val ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{label}</button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Filter by Date</p>
                </div>
                {hasDateFilter && (
                  <button onClick={clearDateFilters} className="text-xs text-destructive font-medium touch-manipulation">Clear</button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background">
                    <SelectItem value="all">All</SelectItem>
                    {yearOptions.map(y => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background">
                    <SelectItem value="all">All</SelectItem>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={i} value={String(i)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterDay} onValueChange={setFilterDay}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background max-h-48">
                    <SelectItem value="all">All</SelectItem>
                    {dayOptions.map(d => (
                      <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterHour} onValueChange={setFilterHour}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Time" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background max-h-48">
                    <SelectItem value="all">All</SelectItem>
                    {HOURS.map(h => (
                      <SelectItem key={h} value={String(h)}>{String(h).padStart(2, "0")}:00</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-3 space-y-2.5">
        {filtered.map(batch => {
          const counts = getBatchStatusCounts(batch);
          return (
            <div key={batch.id} onClick={() => navigate(`/sub-merchant-voucher-batch/${batch.id}`)} className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div>
                    <p className="text-sm font-bold text-foreground">{batch.batchNumber}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">M{formatNum(batch.denomination)} • {batch.bundleCount} bundle{batch.bundleCount !== 1 ? "s" : ""} • {formatNum(batch.totalCards)} cards</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {counts.available > 0 && <Badge className="bg-emerald-500/15 text-emerald-600 text-xs px-2 h-5">{counts.available} Available</Badge>}
                {counts.sold_unused > 0 && <Badge className="bg-amber-500/15 text-amber-600 text-xs px-2 h-5">{counts.sold_unused} Sold</Badge>}
                {counts.used > 0 && <Badge className="bg-primary/15 text-primary text-xs px-2 h-5">{counts.used} Used</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{batch.createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-16"><p className="text-sm text-muted-foreground">No batches found</p></div>}
      </div>
    </div>
  );
}
