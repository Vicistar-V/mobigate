import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, XCircle, ArrowLeft, Bell, Store, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Status = "pending" | "approved" | "rejected";

interface SubMerchantApp {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantCity: string;
  refNo: string;
  dateSubmitted: string;
  status: Status;
  rejectionReason?: string;
  estimatedReview: string;
}

const mockApplications: SubMerchantApp[] = [
  {
    id: "1",
    merchantId: "techhub",
    merchantName: "TechHub Solutions",
    merchantCity: "Lagos, Nigeria",
    refNo: "MG-SUB-2026-0118",
    dateSubmitted: "20 Feb 2026",
    status: "pending",
    estimatedReview: "7-14 business days",
  },
  {
    id: "2",
    merchantId: "greenleaf",
    merchantName: "GreenLeaf Stores",
    merchantCity: "Abuja, Nigeria",
    refNo: "MG-SUB-2026-0095",
    dateSubmitted: "12 Feb 2026",
    status: "approved",
    estimatedReview: "",
  },
  {
    id: "3",
    merchantId: "quickmart",
    merchantName: "QuickMart Ltd",
    merchantCity: "Port Harcourt, Nigeria",
    refNo: "MG-SUB-2026-0071",
    dateSubmitted: "5 Feb 2026",
    status: "rejected",
    rejectionReason: "Your application was not approved because your location is not acceptable at the moment.",
    estimatedReview: "",
  },
];

const statusMeta = {
  approved: {
    icon: CheckCircle2,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-600",
    label: "Approved",
    badgeBg: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  },
  pending: {
    icon: Clock,
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    iconColor: "text-sky-600",
    label: "Pending",
    badgeBg: "bg-sky-500/15 text-sky-700 border-sky-200",
  },
  rejected: {
    icon: XCircle,
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    iconColor: "text-red-600",
    label: "Rejected",
    badgeBg: "bg-red-500/15 text-red-700 border-red-200",
  },
};

const SubMerchantApplicationStatus = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(mockApplications[0]?.id ?? null);

  const handleReminder = (merchantName: string) => {
    toast({
      title: "Reminder Sent",
      description: `A reminder has been sent to ${merchantName} to review your Sub-Merchant application.`,
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const pendingCount = mockApplications.filter(a => a.status === "pending").length;
  const approvedCount = mockApplications.filter(a => a.status === "approved").length;
  const rejectedCount = mockApplications.filter(a => a.status === "rejected").length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 touch-manipulation active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Sub-Merchant Applications</h1>
            <p className="text-xs text-muted-foreground">{mockApplications.length} applications submitted</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-sky-500/10 border border-sky-500/20 p-3 text-center">
            <p className="text-xl font-bold text-sky-700">{pendingCount}</p>
            <p className="text-[10px] font-medium text-sky-600 uppercase tracking-wide">Pending</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
            <p className="text-xl font-bold text-emerald-700">{approvedCount}</p>
            <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wide">Approved</p>
          </div>
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-center">
            <p className="text-xl font-bold text-red-700">{rejectedCount}</p>
            <p className="text-[10px] font-medium text-red-600 uppercase tracking-wide">Rejected</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {mockApplications.map((app) => {
            const meta = statusMeta[app.status];
            const Icon = meta.icon;
            const isExpanded = expandedId === app.id;

            return (
              <div
                key={app.id}
                className={`rounded-2xl border-2 ${meta.border} ${meta.bg} overflow-hidden transition-all duration-200`}
              >
                {/* Collapsed Header — always visible */}
                <button
                  onClick={() => toggleExpand(app.id)}
                  className="w-full flex items-center gap-3 p-4 text-left touch-manipulation active:scale-[0.98] transition-transform"
                >
                  <div className={`h-10 w-10 rounded-full ${meta.bg} flex items-center justify-center shrink-0 border ${meta.border}`}>
                    <Icon className={`h-5 w-5 ${meta.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Store className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <p className="text-sm font-bold text-foreground truncate">{app.merchantName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{app.merchantCity}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={`text-xs ${meta.badgeBg}`}>
                      {meta.label}
                    </Badge>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date Submitted</span>
                        <span className="font-medium text-foreground">{app.dateSubmitted}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reference No.</span>
                        <span className="font-medium text-foreground font-mono text-xs">{app.refNo}</span>
                      </div>
                      {app.status === "pending" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estimated Review</span>
                          <span className="font-medium text-sky-600">{app.estimatedReview}</span>
                        </div>
                      )}
                      {app.status === "rejected" && app.rejectionReason && (
                        <div className="pt-2 border-t border-border/30">
                          <p className="text-xs text-muted-foreground mb-1">Rejection Reason</p>
                          <p className="text-sm text-foreground">{app.rejectionReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {app.status === "approved" && (
                      <Button
                        onClick={() => navigate("/sub-merchant-voucher-management")}
                        className="w-full h-11 rounded-xl touch-manipulation active:scale-[0.97] text-sm font-semibold"
                      >
                        Go to Sub-Merchant Dashboard
                      </Button>
                    )}
                    {app.status === "pending" && (
                      <Button
                        onClick={() => handleReminder(app.merchantName)}
                        variant="outline"
                        className="w-full h-11 rounded-xl touch-manipulation active:scale-[0.97] text-sm font-semibold gap-2 border-sky-500/30 text-sky-700 hover:bg-sky-500/10"
                      >
                        <Bell className="h-4 w-4" />
                        Send Reminder to {app.merchantName}
                      </Button>
                    )}
                    {app.status === "rejected" && (
                      <Button
                        onClick={() => navigate(`/apply-sub-merchant/${app.merchantId}`, {
                          state: {
                            reapply: true,
                            previousData: {
                              fullName: "Chinedu Okonkwo",
                              businessName: "QuickStop Retail",
                              phone: "+234 803 456 7890",
                              email: "chinedu@quickstop.ng",
                              city: "Port Harcourt",
                              state: "Rivers",
                              businessTypes: ["retail_shop", "mobi_kiosk"],
                              description: "A retail shop and Mobi kiosk operating in Port Harcourt's main market area, serving over 200 customers daily.",
                              yearsInBusiness: "4_to_7",
                            }
                          }
                        })}
                        variant="outline"
                        className="w-full h-11 rounded-xl touch-manipulation active:scale-[0.97] text-sm font-semibold border-red-500/30 text-red-700 hover:bg-red-500/10"
                      >
                        Re-apply as Sub-Merchant
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubMerchantApplicationStatus;
