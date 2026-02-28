import { useState } from "react";
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

  const config = statusConfig[status];
  const Icon = config.icon;

  const cycleStatus = () => {
    const order: Status[] = ["pending", "approved", "rejected"];
    const next = order[(order.indexOf(status) + 1) % order.length];
    setStatus(next);
  };

  const handleReminder = () => {
    toast({
      title: "Reminder Sent",
      description: "A reminder has been sent to the Mobigate Admin to review your application.",
    });
  };

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
            className={`${config.badgeClass} cursor-pointer touch-manipulation`}
            onClick={cycleStatus}
          >
            {config.badgeLabel}
          </Badge>
          <p className="text-[10px] text-muted-foreground/50 mt-1">(Tap badge to cycle demo status)</p>
        </div>

        {/* Details Card */}
        <Card className="rounded-xl border-border/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date Submitted</span>
              <span className="font-medium text-foreground">15 Feb 2026</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reference No.</span>
              <span className="font-medium text-foreground font-mono">MG-MER-2026-0042</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Application Type</span>
              <span className="font-medium text-foreground">Individual Merchant</span>
            </div>
            {status === "pending" && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Review</span>
                <span className="font-medium text-amber-600">14-21 business days</span>
              </div>
            )}
            {status === "rejected" && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Rejection Reason</p>
                <p className="text-sm text-foreground">
                  Incomplete business documentation. Please provide a valid business registration certificate and resubmit.
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
            <Button
              onClick={handleReminder}
              variant="outline"
              className="w-full h-12 rounded-xl touch-manipulation active:scale-[0.97] text-base font-semibold gap-2"
            >
              <Bell className="h-5 w-5" />
              Send Reminder to Mobigate Admin
            </Button>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantApplicationStatus;
