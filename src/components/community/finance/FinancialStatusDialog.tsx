import { useState } from "react";
import { X, CheckCircle2, AlertTriangle, TrendingUp, Calendar, CreditCard, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockFinancialStatus } from "@/data/financeData";
import { useToast } from "@/hooks/use-toast";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";

interface FinancialStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper: Local Currency PRIMARY, Mobi SECONDARY
const formatLocalPrimary = (amount: number): { local: string; mobi: string } => {
  return {
    local: `₦${amount.toLocaleString()}`,
    mobi: `M${amount.toLocaleString()}`,
  };
};

export function FinancialStatusDialog({ open, onOpenChange }: FinancialStatusDialogProps) {
  const { toast } = useToast();
  const [status] = useState(mockFinancialStatus);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePayNow = () => {
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    setIsProcessingPayment(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const formatted = formatLocalPrimary(status.outstandingBalance);
    toast({
      title: "Payment Successful!",
      description: `Your payment of ${formatted.local} (${formatted.mobi}) has been debited from your Mobi Wallet.`,
    });
    
    setIsProcessingPayment(false);
    setShowConfirmation(false);
    onOpenChange(false);
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

  const outstandingFormatted = formatLocalPrimary(status.outstandingBalance);
  const totalPaidFormatted = formatLocalPrimary(status.totalPaid);
  const totalDueFormatted = formatLocalPrimary(status.totalDue);

  return (
    <>
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

              {/* Outstanding Balance - LOCAL CURRENCY PRIMARY */}
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
                        {outstandingFormatted.local}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ({outstandingFormatted.mobi}) Amount due
                      </p>
                    </div>
                    
                    {/* Single Pay Now Button */}
                    <Button 
                      onClick={handlePayNow} 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      size="lg"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now - {outstandingFormatted.local}
                    </Button>
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
                        {totalPaidFormatted.local}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({totalPaidFormatted.mobi})
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Due</p>
                      <p className="text-lg font-bold">
                        {totalDueFormatted.local}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({totalDueFormatted.mobi})
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

      {/* Payment Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <div className="flex justify-center mb-2">
              <div className="bg-amber-500/10 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">Confirm Payment</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
              You are paying{" "}
              <span className="font-bold text-foreground">
                {outstandingFormatted.local}
              </span>{" "}
              ({outstandingFormatted.mobi}) to clear your outstanding balance.
              This amount will be debited from your Mobi Wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto" disabled={isProcessingPayment}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleConfirmPayment();
              }}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
