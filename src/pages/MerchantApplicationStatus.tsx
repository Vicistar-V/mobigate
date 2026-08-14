import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, XCircle, ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Status = "pending" | "approved" | "rejected";

const statusConfig = {
  approved: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-600",
    heading: "Application Approved",
    badgeClass: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
    badgeLabel: "Approved",
  },
  pending: {
    icon: Clock,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-600",
    heading: "Application Pending",
    badgeClass: "bg-amber-500/15 text-amber-700 border-amber-200",
    badgeLabel: "Pending Review",
  },
  rejected: {
    icon: XCircle,
    iconBg: "bg-red-500/15",
    iconColor: "text-red-600",
    heading: "Application Rejected",
    badgeClass: "bg-red-500/15 text-red-700 border-red-200",
    badgeLabel: "Rejected",
  },
};

const MerchantApplicationStatus = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("pending");
  const [application, setApplication] = useState<{
    merchant_type?: string; rejection_reason?: string; submitted_at?: string; reviewed_at?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/merchant/application.php?action=status`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.application) {
          setApplication(d.application);
          setStatus(d.application.status as Status);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const config = statusConfig[status];
  const Icon = config.icon;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Clock className="h-8 w-8 text-muted-foreground animate-pulse" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center px-4 text-center">
        <Bell className="h-10 w-10 text-muted-foreground mb-3" />
        <h2 className="text-lg font-bold mb-1">No Application Found</h2>
        <p className="text-sm text-muted-foreground mb-5">You haven't submitted a merchant application yet.</p>
        <Button onClick={() => navigate("/merchant-application/individual")}>Apply Now</Button>
      </div>
    );
  }

  const handleReminder = () => {
    toast({
      title: "Reminder Sent",
      description: "A reminder has been sent to Mobiface to review your application.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-[var(--header-height)] z-30 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 touch-manipulation active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold">Merchant Application Status</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 space-y-5">
        {/* Status Icon & Heading */}
        <div className="flex flex-col items-center text-center pt-4">
          <div className={`h-24 w-24 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
            <Icon className={`h-12 w-12 ${config.iconColor}`} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{config.heading}</h2>
          <Badge
            variant="outline"
            className={config.badgeClass}
          >
            {config.badgeLabel}
          </Badge>
        </div>

        {/* Details Card */}
        <Card className="rounded-xl border-border/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date Submitted</span>
              <span className="font-medium text-foreground">
                {application?.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : "—"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Application Type</span>
              <span className="font-medium text-foreground">
                {application?.merchant_type === "corporate" ? "Corporate Merchant" : "Individual Merchant"}
              </span>
            </div>
            {status === "pending" && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Review Time</span>
                <span className="font-medium text-amber-600">14 business days</span>
              </div>
            )}
            {status === "rejected" && application?.rejection_reason && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-sm font-semibold text-red-600 mb-1">Reason for Decline</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {application.rejection_reason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {status === "approved" && (
            <Button
              onClick={() => navigate("/merchant-voucher-management")}
              className="w-full h-12 rounded-xl touch-manipulation active:scale-[0.97] text-base font-semibold"
            >
              Go to Merchant Dashboard
            </Button>
          )}
          {status === "pending" && (
            <div className="space-y-3">
              <Button
                onClick={handleReminder}
                variant="outline"
                className="w-full h-12 rounded-xl touch-manipulation active:scale-[0.97] text-base font-semibold gap-2"
              >
                <Bell className="h-5 w-5" />
                Send Reminder to Mobiface
              </Button>
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
                <div className="flex gap-2">
                  <span className="text-amber-600 shrink-0">ℹ️</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-bold text-foreground">Note:</span> Your application is being reviewed by <span className="font-bold text-foreground">Mobiface</span>. You'll be notified once they take action. You can send a reminder if it's been more than 14 days.
                  </p>
                </div>
              </div>
            </div>
          )}
          {status === "rejected" && (
            <>
              <Button
                onClick={() => navigate("/merchant-application/individual")}
                className="w-full h-12 rounded-xl touch-manipulation active:scale-[0.97] text-base font-semibold"
              >
                Re-apply as Individual
              </Button>
              <Button
                onClick={() => navigate("/merchant-application/corporate")}
                variant="outline"
                className="w-full h-12 rounded-xl touch-manipulation active:scale-[0.97] text-base font-semibold"
              >
                Re-apply as Corporate
              </Button>
              <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3">
                <div className="flex gap-2">
                  <span className="text-red-600 shrink-0">✕</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-bold text-red-600">Application Declined:</span> Review the reason(s) for decline above and address the issues before re‑applying. Your previous application details are retrievable.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantApplicationStatus;
