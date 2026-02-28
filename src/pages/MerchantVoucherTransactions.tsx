import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { initialMockTransactions, formatNum } from "@/data/merchantVoucherData";

type FilterType = "all" | "funding" | "voucher_generation";
type SortOption = "newest" | "oldest" | "amount_high" | "amount_low";

export default function MerchantVoucherTransactions() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...initialMockTransactions];
    if (filterType !== "all") result = result.filter(t => t.type === filterType);
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest": return a.createdAt.getTime() - b.createdAt.getTime();
        case "amount_high": return Math.abs(b.amount) - Math.abs(a.amount);
        case "amount_low": return Math.abs(a.amount) - Math.abs(b.amount);
        default: return 0;
      }
    });
    return result;
  }, [filterType, sortBy]);

  return (
    <div className="bg-background min-h-screen pb-6">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">Transactions</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-9 w-9 rounded-full flex items-center justify-center active:scale-90 touch-manipulation ${showFilters ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
        {showFilters && (
          <div className="px-4 pb-3 space-y-3 border-t border-border/30 pt-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">Type</p>
              <div className="flex gap-1.5">
                {([["all", "All"], ["funding", "Funding"], ["voucher_generation", "Generation"]] as [FilterType, string][]).map(([val, label]) => (
                  <button key={val} onClick={() => setFilterType(val)} className={`h-8 px-3 rounded-lg text-xs font-semibold touch-manipulation ${filterType === val ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{label}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">Sort</p>
              <div className="flex gap-1.5 flex-wrap">
                {([["newest", "Newest"], ["oldest", "Oldest"], ["amount_high", "Amount ↓"], ["amount_low", "Amount ↑"]] as [SortOption, string][]).map(([val, label]) => (
                  <button key={val} onClick={() => setSortBy(val)} className={`h-8 px-3 rounded-lg text-xs font-semibold touch-manipulation ${sortBy === val ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{label}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-3 space-y-2.5">
        {filtered.map(txn => {
          const isFunding = txn.type === "funding";
          return (
            <div
              key={txn.id}
              onClick={() => txn.batchId ? navigate(`/merchant-voucher-batch/${txn.batchId}`) : undefined}
              className={`rounded-xl border border-border/50 bg-card p-4 ${txn.batchId ? "active:scale-[0.97] transition-transform touch-manipulation cursor-pointer" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isFunding ? "bg-emerald-500/10" : "bg-primary/10"
                }`}>
                  {isFunding ? <ArrowDownLeft className="h-5 w-5 text-emerald-600" /> : <ArrowUpRight className="h-5 w-5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Row 1: Title + Amount */}
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-foreground">{isFunding ? "Wallet Funding" : "Voucher Generation"}</p>
                    <p className={`text-sm font-bold ${isFunding ? "text-emerald-600" : "text-foreground"}`}>
                      {isFunding ? "+" : ""}₦{formatNum(Math.abs(txn.amount))}
                    </p>
                  </div>
                  {/* Row 2: Description */}
                  <p className="text-xs text-muted-foreground truncate mb-1.5">{txn.description}</p>
                  {/* Row 3: Reference + Date */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground font-mono">{txn.reference}</p>
                    <p className="text-xs text-muted-foreground">{txn.createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
