import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Search,
  Users,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Clock,
  Ban,
  CreditCard,
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import {
  mockMemberPayments,
  mockMemberDisbursements,
  mockMemberObligations,
  MemberPayment,
  MemberDisbursement,
  MemberObligation,
  getObligationTypeLabel,
  getMemberObligationStatusColor,
} from "@/data/financialManagementData";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { DualCurrencyDisplay, formatDualCurrency } from "@/components/common/DualCurrencyDisplay";

interface MembersFinancialReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MembersFinancialReportsDialog = ({
  open,
  onOpenChange,
}: MembersFinancialReportsDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("payments");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleExport = (type: string) => {
    toast({
      title: "Report Exported",
      description: `${type} report has been downloaded.`,
    });
  };

  const getPaymentMethodIcon = (method: MemberPayment["paymentMethod"]) => {
    switch (method) {
      case "wallet":
        return <Wallet className="h-3 w-3" />;
      case "bank_transfer":
        return <Banknote className="h-3 w-3" />;
      case "card":
        return <CreditCard className="h-3 w-3" />;
      default:
        return <Wallet className="h-3 w-3" />;
    }
  };

  const getDisbursementTypeLabel = (type: MemberDisbursement["disbursementType"]) => {
    const labels: Record<MemberDisbursement["disbursementType"], string> = {
      welfare: "Welfare",
      loan: "Loan",
      refund: "Refund",
      award: "Award",
      scholarship: "Scholarship",
    };
    return labels[type];
  };

  const getObligationStatusIcon = (status: MemberObligation["status"]) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "partial":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "defaulting":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "suspended":
        return <Ban className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const filteredPayments = mockMemberPayments.filter(
    (p) =>
      p.memberName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "all" || p.status === statusFilter)
  );

  const filteredDisbursements = mockMemberDisbursements.filter(
    (d) =>
      d.memberName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "all" || d.status === statusFilter)
  );

  const filteredObligations = mockMemberObligations.filter(
    (o) =>
      o.memberName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "all" || o.status === statusFilter)
  );

  const Content = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <Card className="p-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 touch-manipulation"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="compliant">Compliant</SelectItem>
              <SelectItem value="defaulting">Defaulting</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="payments" className="text-xs">
            <ArrowDownLeft className="h-3 w-3 mr-1" />
            Pay-ins
          </TabsTrigger>
          <TabsTrigger value="disbursements" className="text-xs">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            Pay-outs
          </TabsTrigger>
          <TabsTrigger value="obligations" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Status
          </TabsTrigger>
        </TabsList>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-3 mt-0">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm">Member Payments ({filteredPayments.length})</h3>
            <Button variant="ghost" size="sm" onClick={() => handleExport("Payments")}>
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="p-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={payment.memberAvatar} />
                  <AvatarFallback>{payment.memberName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{payment.memberName}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.obligationName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-green-600">
                        +{formatLocalAmount(payment.amountPaid, "NGN")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({formatMobiAmount(payment.amountPaid)})
                      </p>
                      <Badge
                        className={
                          payment.status === "completed"
                            ? "bg-green-500/10 text-green-600 text-xs"
                            : "bg-amber-500/10 text-amber-600 text-xs"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      {payment.paymentMethod.replace("_", " ")}
                    </span>
                    <span>{format(payment.paymentDate, "MMM d, yyyy")}</span>
                    <span className="truncate">{payment.reference}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Disbursements Tab */}
        <TabsContent value="disbursements" className="space-y-3 mt-0">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm">
              Member Disbursements ({filteredDisbursements.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={() => handleExport("Disbursements")}>
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {filteredDisbursements.map((disbursement) => (
            <Card key={disbursement.id} className="p-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={disbursement.memberAvatar} />
                  <AvatarFallback>{disbursement.memberName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{disbursement.memberName}</p>
                      <p className="text-xs text-muted-foreground">
                        {disbursement.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-red-600">
                        -{formatLocalAmount(disbursement.amount, "NGN")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({formatMobiAmount(disbursement.amount)})
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {getDisbursementTypeLabel(disbursement.disbursementType)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>Approved by: {disbursement.approvedBy}</span>
                    <span>{format(disbursement.disbursementDate, "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Obligations Tab */}
        <TabsContent value="obligations" className="space-y-3 mt-0">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm">
              Financial Obligations ({filteredObligations.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={() => handleExport("Obligations")}>
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-2 bg-green-50 border-green-200 text-center">
              <p className="text-xs text-muted-foreground">Compliant</p>
              <p className="font-bold text-lg text-green-600">
                {mockMemberObligations.filter((o) => o.status === "compliant").length}
              </p>
            </Card>
            <Card className="p-2 bg-red-50 border-red-200 text-center">
              <p className="text-xs text-muted-foreground">Defaulting</p>
              <p className="font-bold text-lg text-red-600">
                {mockMemberObligations.filter((o) => o.status === "defaulting").length}
              </p>
            </Card>
          </div>

          {filteredObligations.map((obligation) => {
            const progressPercentage = Math.round(
              (obligation.amountPaid / obligation.amountDue) * 100
            );

            return (
              <Card key={obligation.id} className="p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={obligation.memberAvatar} />
                    <AvatarFallback>{obligation.memberName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{obligation.memberName}</p>
                        <p className="text-xs text-muted-foreground">
                          {obligation.obligationName}
                        </p>
                      </div>
                      <Badge className={getMemberObligationStatusColor(obligation.status)}>
                        {getObligationStatusIcon(obligation.status)}
                        <span className="ml-1 capitalize">{obligation.status}</span>
                      </Badge>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span>{formatLocalAmount(obligation.amountPaid, "NGN")} / {formatLocalAmount(obligation.amountDue, "NGN")}</span>
                          <p className="text-muted-foreground">
                            ({formatMobiAmount(obligation.amountPaid)} / {formatMobiAmount(obligation.amountDue)})
                          </p>
                        </div>
                        <span className="text-muted-foreground">{progressPercentage}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-1.5" />
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>Due: {format(obligation.dueDate, "MMM d, yyyy")}</span>
                      {obligation.lastPaymentDate && (
                        <span>
                          Last paid: {format(obligation.lastPaymentDate, "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>Members Financial Reports</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            <Content />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Members Financial Reports</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <Content />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
