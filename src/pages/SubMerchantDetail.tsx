import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockSubMerchants, mockSubMerchantPurchases, formatNum } from "@/data/subMerchantData";

export default function SubMerchantDetail() {
  const navigate = useNavigate();
  const { subMerchantId } = useParams();

  const sm = mockSubMerchants.find(m => m.id === subMerchantId);
  const purchases = mockSubMerchantPurchases.filter(p => p.subMerchantId === subMerchantId);

  if (!sm) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Sub-merchant not found</p>
          <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-8">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-foreground truncate">{sm.name}</h1>
            <Badge className={`text-xs h-5 px-2 ${sm.status === "active" ? "bg-emerald-500/15 text-emerald-600" : "bg-destructive/15 text-destructive"}`}>
              {sm.status === "active" ? "Active" : "Suspended"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{sm.city}, {sm.state}</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Profile info */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Profile</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Location</span>
              <span className="font-semibold text-foreground">{sm.city}, {sm.state}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Joined</span>
              <span className="font-semibold text-foreground">{sm.joinDate.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount Rate</span>
              <span className="font-semibold text-emerald-600">{sm.discountRate}%</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border/30">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Statistics</p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-border/30">
            {[
              { label: "Total Batches", value: formatNum(sm.totalBatches), color: "text-foreground" },
              { label: "Total Bundles", value: formatNum(sm.totalBundles), color: "text-foreground" },
              { label: "Total Cards", value: formatNum(sm.totalCards), color: "text-primary" },
              { label: "Total Spend", value: `₦${formatNum(sm.totalSpend)}`, color: "text-emerald-600" },
            ].map(item => (
              <div key={item.label} className="p-3.5 text-center">
                <p className={`text-lg font-black ${item.color}`}>{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase History */}
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Purchase History ({purchases.length})</p>
          {purchases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No purchases yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {purchases.map(p => (
                <div key={p.id} className="rounded-xl border border-border/50 bg-card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">M{formatNum(p.denomination)} × {p.totalCards} cards</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.bundlesBought} bundle{p.bundlesBought !== 1 ? "s" : ""}</p>
                    </div>
                    <Badge className={`text-xs h-5 px-2 ${
                      p.status === "completed" ? "bg-emerald-500/15 text-emerald-600" :
                      p.status === "processing" ? "bg-amber-500/15 text-amber-600" :
                      "bg-destructive/15 text-destructive"
                    }`}>
                      {p.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">{p.batchReference}</span>
                    <span>₦{formatNum(p.totalCost)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {p.date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
