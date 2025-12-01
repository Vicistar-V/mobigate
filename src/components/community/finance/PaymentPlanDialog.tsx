import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addMonths, format } from "date-fns";

interface PaymentPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outstandingBalance: number;
}

interface PaymentPlan {
  id: string;
  duration: number; // months
  monthlyPayment: number;
  totalAmount: number;
  interestRate: number;
}

export function PaymentPlanDialog({ 
  open, 
  onOpenChange, 
  outstandingBalance 
}: PaymentPlanDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [startDate, setStartDate] = useState(new Date());
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [step, setStep] = useState<"select" | "confirm">("select");
  const { toast } = useToast();

  // Calculate payment plans
  const paymentPlans: PaymentPlan[] = [
    {
      id: "3months",
      duration: 3,
      monthlyPayment: Math.ceil((outstandingBalance * 1.02) / 3), // 2% interest
      totalAmount: Math.ceil(outstandingBalance * 1.02),
      interestRate: 2,
    },
    {
      id: "6months",
      duration: 6,
      monthlyPayment: Math.ceil((outstandingBalance * 1.05) / 6), // 5% interest
      totalAmount: Math.ceil(outstandingBalance * 1.05),
      interestRate: 5,
    },
    {
      id: "12months",
      duration: 12,
      monthlyPayment: Math.ceil((outstandingBalance * 1.10) / 12), // 10% interest
      totalAmount: Math.ceil(outstandingBalance * 1.10),
      interestRate: 10,
    },
  ];

  const handleContinue = () => {
    if (!selectedPlan) {
      toast({
        title: "Select a Plan",
        description: "Please choose a payment plan to continue",
        variant: "destructive",
      });
      return;
    }
    setStep("confirm");
  };

  const handleSubmit = () => {
    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the payment plan terms to continue",
        variant: "destructive",
      });
      return;
    }

    const plan = paymentPlans.find((p) => p.id === selectedPlan);
    toast({
      title: "Payment Plan Submitted!",
      description: `Your ${plan?.duration}-month payment plan request has been submitted for approval`,
    });

    onOpenChange(false);
    // Reset
    setTimeout(() => {
      setSelectedPlan("");
      setAgreedToTerms(false);
      setStep("select");
    }, 300);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedPlan("");
      setAgreedToTerms(false);
      setStep("select");
    }, 300);
  };

  const selectedPlanDetails = paymentPlans.find((p) => p.id === selectedPlan);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Payment Plan Options
          </DialogTitle>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-4">
            <Card className="p-4 bg-muted">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                  <p className="text-2xl font-bold">₦{outstandingBalance.toLocaleString()}</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-950 p-2 rounded-full">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <div>
              <Label className="mb-3 block">Choose a Payment Plan</Label>
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                <div className="space-y-3">
                  {paymentPlans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? "border-primary border-2 bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                        <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">{plan.duration} Months Plan</p>
                              <Badge variant="outline" className="text-xs">
                                {plan.interestRate}% interest
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">Monthly Payment</p>
                                <p className="font-bold text-primary">
                                  ₦{plan.monthlyPayment.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Total Amount</p>
                                <p className="font-semibold">₦{plan.totalAmount.toLocaleString()}</p>
                              </div>
                            </div>

                            {selectedPlan === plan.id && (
                              <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  Starts: {format(startDate, "MMMM d, yyyy")} •{" "}
                                  Ends: {format(addMonths(startDate, plan.duration), "MMMM d, yyyy")}
                                </p>
                              </div>
                            )}
                          </div>
                        </Label>
                      </div>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Payment Plan Benefits</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Automatic monthly deductions</li>
                    <li>No penalty for early completion</li>
                    <li>Maintain good standing while paying</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleContinue} className="w-full" disabled={!selectedPlan}>
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "confirm" && selectedPlanDetails && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Confirm Payment Plan</h3>
              <p className="text-sm text-muted-foreground">
                Review your selected payment plan
              </p>
            </div>

            <Card className="p-4 space-y-3 bg-muted">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan Duration</span>
                <span className="font-semibold">{selectedPlanDetails.duration} months</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="font-bold text-lg text-primary">
                  ₦{selectedPlanDetails.monthlyPayment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-semibold">
                  ₦{selectedPlanDetails.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Interest Rate</span>
                <span className="font-medium">{selectedPlanDetails.interestRate}%</span>
              </div>
            </Card>

            <Card className="p-4">
              <p className="text-sm font-medium mb-2">Payment Schedule</p>
              <div className="space-y-2 text-xs">
                {Array.from({ length: selectedPlanDetails.duration }).map((_, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Payment {index + 1} - {format(addMonths(startDate, index), "MMM yyyy")}
                    </span>
                    <span className="font-medium">
                      ₦{selectedPlanDetails.monthlyPayment.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex items-start space-x-2 p-3 border rounded-lg">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer">
                I agree to the payment plan terms and conditions. I understand that failure to make
                timely payments may result in additional charges and affect my community standing.
              </Label>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Your payment plan request will be reviewed by the finance
                committee. You'll be notified within 48 hours of approval or rejection.
              </p>
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep("select")} className="w-full sm:w-auto">
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="w-full sm:w-auto"
                disabled={!agreedToTerms}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
