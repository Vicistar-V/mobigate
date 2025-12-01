import { useState } from "react";
import { X, Calendar, CreditCard, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { mockObligations } from "@/data/financeData";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown } from "lucide-react";

interface FinancialObligationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinancialObligationsDialog({ open, onOpenChange }: FinancialObligationsDialogProps) {
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pendingObligations = mockObligations.filter(o => o.status === "pending");
  const paidObligations = mockObligations.filter(o => o.status === "paid");
  const overdueObligations = mockObligations.filter(o => o.status === "overdue");

  const handlePayNow = (obligationId: string, title: string) => {
    toast({
      title: "Payment Initiated",
      description: `Payment for ${title} will be processed`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-700";
      case "overdue":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-yellow-500/10 text-yellow-700";
    }
  };

  const ObligationCard = ({ obligation }: { obligation: any }) => (
    <Card key={obligation.id}>
      <Collapsible open={expandedId === obligation.id} onOpenChange={(open) => setExpandedId(open ? obligation.id : null)}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(obligation.status)}
                  <h4 className="font-semibold text-sm truncate">{obligation.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{obligation.description}</p>
              </div>
              <Badge className={`${getStatusColor(obligation.status)} shrink-0`}>
                {obligation.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-lg font-bold">
                  {obligation.currency} {obligation.amount.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Due Date</p>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3" />
                  {obligation.dueDate.toLocaleDateString()}
                </div>
              </div>
            </div>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full">
                <span className="text-xs">View Details</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-3">
              <div className="p-3 bg-muted rounded-lg space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium capitalize">{obligation.category}</span>
                </div>
                {obligation.recurrence && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recurrence:</span>
                    <span className="font-medium capitalize">{obligation.recurrence}</span>
                  </div>
                )}
              </div>

              {obligation.status !== "paid" && (
                <Button
                  onClick={() => handlePayNow(obligation.id, obligation.title)}
                  className="w-full"
                  size="sm"
                >
                  <CreditCard className="h-3 w-3 mr-2" />
                  Pay Now
                </Button>
              )}
            </CollapsibleContent>
          </div>
        </CardContent>
      </Collapsible>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Financial Obligations</DialogTitle>
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

        <Tabs defaultValue="pending" className="flex-1">
          <div className="px-4 sm:px-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="pending" className="text-xs">
                Pending ({pendingObligations.length})
              </TabsTrigger>
              <TabsTrigger value="overdue" className="text-xs">
                Overdue ({overdueObligations.length})
              </TabsTrigger>
              <TabsTrigger value="paid" className="text-xs">
                Paid ({paidObligations.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(90vh-160px)]">
            <div className="p-4 sm:p-6">
              <TabsContent value="pending" className="mt-0 space-y-3">
                {pendingObligations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending obligations
                  </div>
                ) : (
                  pendingObligations.map((obligation) => (
                    <ObligationCard key={obligation.id} obligation={obligation} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="overdue" className="mt-0 space-y-3">
                {overdueObligations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No overdue obligations
                  </div>
                ) : (
                  overdueObligations.map((obligation) => (
                    <ObligationCard key={obligation.id} obligation={obligation} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="paid" className="mt-0 space-y-3">
                {paidObligations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No paid obligations
                  </div>
                ) : (
                  paidObligations.map((obligation) => (
                    <ObligationCard key={obligation.id} obligation={obligation} />
                  ))
                )}
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
