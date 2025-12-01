import { useState } from "react";
import { X, CheckCircle2, AlertTriangle, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockFinancialStatus } from "@/data/financeData";
import { useToast } from "@/hooks/use-toast";

interface FinancialStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinancialStatusDialog({ open, onOpenChange }: FinancialStatusDialogProps) {
  const { toast } = useToast();
  const [status] = useState(mockFinancialStatus);

  const handleRequestWaiver = () => {
    toast({
      title: "Waiver Request Submitted",
      description: "Your request will be reviewed by the finance committee",
    });
  };

  const handlePaymentPlan = () => {
    toast({
      title: "Payment Plan Options",
      description: "Payment plan feature will be available soon",
    });
  };

  const getStandingColor = (standing: string) => {
    switch (standing) {
      case "good":
        return "bg-green-500/10 text-green-700";
      case "defaulting":
        return "bg-yellow-500/10 text-yellow-700";
      case "suspended":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  const getStandingIcon = (standing: string) => {
    switch (standing) {
      case "good":
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case "defaulting":
      case "suspended":
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Financial Status</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-80px)]">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Financial Standing Card */}
            <Card className={`border-2 ${
              status.standing === "good" 
                ? "border-green-500/30 bg-green-500/5" 
                : "border-yellow-500/30 bg-yellow-500/5"
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStandingIcon(status.standing)}
                      <div>
                        <p className="text-sm text-muted-foreground">Your Financial Standing</p>
                        <h3 className="text-2xl font-bold capitalize">{status.standing} Standing</h3>
                      </div>
                    </div>
                    {status.standing === "good" ? (
                      <p className="text-sm text-muted-foreground">
                        You are in good financial standing with the community
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Please clear your outstanding obligations to maintain good standing
                      </p>
                    )}
                  </div>
                  <Badge className={getStandingColor(status.standing)}>
                    {status.standing}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Outstanding Balance */}
            {status.outstandingBalance > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Outstanding Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                    <p className="text-3xl font-bold text-yellow-700">
                      {status.currency} {status.outstandingBalance.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Amount due
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={handlePaymentPlan} variant="outline" size="sm">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Payment Plan
                    </Button>
                    <Button onClick={handleRequestWaiver} variant="outline" size="sm">
                      Request Waiver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Compliance Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Payment Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Compliance Rate</span>
                    <span className="text-sm font-bold">{status.complianceRate}%</span>
                  </div>
                  <Progress value={status.complianceRate} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {status.complianceRate >= 90 
                      ? "Excellent payment record!" 
                      : status.complianceRate >= 70 
                      ? "Good payment record" 
                      : "Please improve your payment record"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
                    <p className="text-lg font-bold text-green-600">
                      {status.currency} {status.totalPaid.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Due</p>
                    <p className="text-lg font-bold">
                      {status.currency} {status.totalDue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Payment */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Payment</p>
                    <p className="font-semibold">{status.lastPaymentDate.toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
