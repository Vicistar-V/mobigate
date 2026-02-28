import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, ChevronRight, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { initialSubMerchantBatches } from "@/data/subMerchantVoucherData";
import { getBatchStatusCounts, formatNum } from "@/data/merchantVoucherData";

type SortOption = "newest" | "oldest" | "denom_high" | "denom_low";

export default function SubMerchantVoucherBatches() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...initialSubMerchantBatches];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => b.batchNumber.toLowerCase().includes(q));
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
  }, [searchQuery, sortBy]);

  return (
    <div className="bg-background min-h-screen pb-6">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
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
          <div className="px-4 pb-3 border-t border-border/30 pt-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">Sort</p>
            <div className="flex gap-1.5 flex-wrap">
              {([["newest","Newest"],["oldest","Oldest"],["denom_high","Denom ↓"],["denom_low","Denom ↑"]] as [SortOption,string][]).map(([val,label]) => (
                <button key={val} onClick={() => setSortBy(val)} className={`h-8 px-3 rounded-lg text-xs font-semibold touch-manipulation ${sortBy === val ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{label}</button>
              ))}
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
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">{batch.batchNumber}</p>
                    <Badge variant="outline" className="text-xs px-2 h-5 border-primary/30 text-primary">Sub-Merchant</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">M{formatNum(batch.denomination)} • {batch.bundleCount} bundle{batch.bundleCount !== 1 ? "s" : ""} • {formatNum(batch.totalCards)} cards</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {counts.available > 0 && <Badge className="bg-emerald-500/15 text-emerald-600 text-xs px-2 h-5">{counts.available} avail</Badge>}
                {counts.sold_unused > 0 && <Badge className="bg-amber-500/15 text-amber-600 text-xs px-2 h-5">{counts.sold_unused} sold</Badge>}
                {counts.used > 0 && <Badge className="bg-primary/15 text-primary text-xs px-2 h-5">{counts.used} used</Badge>}
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
