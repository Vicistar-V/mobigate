import { useState } from "react";
import { X, Calendar, CreditCard, AlertCircle, CheckCircle2, Clock, Wallet, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { mockObligations } from "@/data/financeData";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface FinancialObligationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinancialObligationsDialog({ open, onOpenChange }: FinancialObligationsDialogProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending");

  const pendingObligations = mockObligations.filter(o => o.status === "pending");
  const paidObligations = mockObligations.filter(o => o.status === "paid");
  const overdueObligations = mockObligations.filter(o => o.status === "overdue");

  // Calculate totals
  const totalPending = pendingObligations.reduce((sum, o) => sum + o.amount, 0);
  const totalOverdue = overdueObligations.reduce((sum, o) => sum + o.amount, 0);

  const handlePayNow = (obligationId: string, title: string) => {
    toast({
      title: "Payment Initiated",
      description: `Payment for ${title} will be processed`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-700 border-green-200 text-xs">Paid</Badge>;
      case "overdue":
        return <Badge className="bg-red-500/10 text-red-700 border-red-200 text-xs">Overdue</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-700 border-amber-200 text-xs">Pending</Badge>;
    }
  };

  // Mobile-optimized Obligation Card
  const ObligationCard = ({ obligation }: { obligation: any }) => {
    const isExpanded = expandedId === obligation.id;
    
    return (
      <Card className="overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={(open) => setExpandedId(open ? obligation.id : null)}>
          <CardContent className="p-4">
            {/* Header Row: Icon + Title + Status */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                {getStatusIcon(obligation.status)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base leading-tight">{obligation.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{obligation.description}</p>
              </div>
              <div className="shrink-0">
                {getStatusBadge(obligation.status)}
              </div>
            </div>

            {/* Amount & Due Date Row */}
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-xl font-bold text-foreground">
                  M{obligation.amount.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Due Date</p>
                <div className="flex items-center justify-end gap-1.5 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  {obligation.dueDate.toLocaleDateString('en-NG', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            {/* Expand/Collapse Trigger */}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full mt-3 h-9">
                <span className="text-sm">View Details</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </CollapsibleTrigger>

            {/* Expanded Content */}
            <CollapsibleContent className="mt-3 space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge variant="outline" className="capitalize text-sm">
                    {obligation.category}
                  </Badge>
                </div>
                {obligation.recurrence && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Recurrence</span>
                    <span className="text-sm font-medium capitalize">{obligation.recurrence}</span>
                  </div>
                )}
                {obligation.status === "overdue" && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Days Overdue</span>
                    <span className="text-sm font-medium text-red-600">
                      {Math.floor((new Date().getTime() - obligation.dueDate.getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                )}
              </div>

              {obligation.status !== "paid" && (
                <Button
                  onClick={() => handlePayNow(obligation.id, obligation.title)}
                  className="w-full h-11 text-sm"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
              )}

              {obligation.status === "paid" && (
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Payment Complete</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                    Paid on {obligation.paidDate?.toLocaleDateString('en-NG', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    }) || 'N/A'}
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </CardContent>
        </Collapsible>
      </Card>
    );
  };

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Financial Obligations</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-10 w-10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="shrink-0 p-4 border-b bg-muted/30">
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Pending</span>
              </div>
              <p className="text-xl font-bold text-amber-800 dark:text-amber-300">
                M{totalPending.toLocaleString()}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                {pendingObligations.length} item(s)
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-700 dark:text-red-400">Overdue</span>
              </div>
              <p className="text-xl font-bold text-red-800 dark:text-red-300">
                M{totalOverdue.toLocaleString()}
              </p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
                {overdueObligations.length} item(s)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="shrink-0 px-4 pt-3 pb-2 bg-background">
          <TabsList className="w-full h-auto p-1 bg-muted/60">
            <div className="grid grid-cols-3 w-full gap-1">
              <TabsTrigger 
                value="pending" 
                className="flex flex-col items-center py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="text-xs font-medium">Pending</span>
                <Badge variant="secondary" className="mt-1 text-xs bg-background/50">{pendingObligations.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="overdue" 
                className="flex flex-col items-center py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="text-xs font-medium">Overdue</span>
                <Badge variant="secondary" className="mt-1 text-xs bg-background/50">{overdueObligations.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="paid" 
                className="flex flex-col items-center py-2.5 px-1 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="text-xs font-medium">Paid</span>
                <Badge variant="secondary" className="mt-1 text-xs bg-background/50">{paidObligations.length}</Badge>
              </TabsTrigger>
            </div>
          </TabsList>
        </div>

        {/* Tab Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto touch-auto">
          <div className="p-4 pb-8">
            {/* Pending Tab */}
            <TabsContent value="pending" className="mt-0">
              {pendingObligations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Wallet className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-base font-medium">No pending obligations</p>
                  <p className="text-sm mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingObligations.map((obligation) => (
                    <ObligationCard key={obligation.id} obligation={obligation} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Overdue Tab */}
            <TabsContent value="overdue" className="mt-0">
              {overdueObligations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-base font-medium">No overdue payments</p>
                  <p className="text-sm mt-1">Great job staying on track!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {overdueObligations.map((obligation) => (
                    <ObligationCard key={obligation.id} obligation={obligation} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Paid Tab */}
            <TabsContent value="paid" className="mt-0">
              {paidObligations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CreditCard className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-base font-medium">No payment history</p>
                  <p className="text-sm mt-1">Completed payments will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paidObligations.map((obligation) => (
                    <ObligationCard key={obligation.id} obligation={obligation} />
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] h-[92vh] flex flex-col touch-auto overflow-hidden">
          <Content />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] h-[85vh] p-0 flex flex-col overflow-hidden">
        <Content />
      </DialogContent>
    </Dialog>
  );
}