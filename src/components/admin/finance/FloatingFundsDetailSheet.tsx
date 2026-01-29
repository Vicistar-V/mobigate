import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  RefreshCw,
  Calendar,
  User,
  Clock,
  ChevronRight,
  Mail,
  Phone,
  Banknote,
  FileText,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { formatNgnMobi } from "@/lib/financialDisplay";

import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";
import communityPerson4 from "@/assets/community-person-4.jpg";
import communityPerson5 from "@/assets/community-person-5.jpg";
import communityPerson6 from "@/assets/community-person-6.jpg";

interface FloatingFundRecord {
  id: string;
  memberName: string;
  memberAvatar: string;
  memberEmail: string;
  memberPhone: string;
  type: "loan" | "advance" | "recoverable";
  description: string;
  originalAmount: number;
  amountRecovered: number;
  amountPending: number;
  disbursementDate: Date;
  expectedRecoveryDate: Date;
  status: "on_track" | "delayed" | "partial" | "overdue";
  repaymentTerms?: string;
  notes?: string;
}

// Mock data for floating funds categories
const mockFloatingFundRecords: Record<string, FloatingFundRecord[]> = {
  pendingLoans: [
    {
      id: "pl1",
      memberName: "Nnamdi Okafor",
      memberAvatar: communityPerson6,
      memberEmail: "nnamdi.o@email.com",
      memberPhone: "+234 806 789 0123",
      type: "loan",
      description: "Business Development Loan",
      originalAmount: 500000,
      amountRecovered: 150000,
      amountPending: 350000,
      disbursementDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      expectedRecoveryDate: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000),
      status: "on_track",
      repaymentTerms: "12 monthly installments of M41,667",
      notes: "3 installments paid on time"
    },
    {
      id: "pl2",
      memberName: "Chukwuemeka Okonkwo",
      memberAvatar: communityPerson4,
      memberEmail: "chukwuemeka.o@email.com",
      memberPhone: "+234 805 678 9012",
      type: "loan",
      description: "Emergency Personal Loan",
      originalAmount: 200000,
      amountRecovered: 50000,
      amountPending: 150000,
      disbursementDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      expectedRecoveryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      status: "delayed",
      repaymentTerms: "6 monthly installments of M33,334",
      notes: "Missed 1 payment, restructuring discussed"
    },
    {
      id: "pl3",
      memberName: "Dr. Amaka Eze",
      memberAvatar: communityPerson3,
      memberEmail: "dr.amaka@email.com",
      memberPhone: "+234 807 890 1234",
      type: "loan",
      description: "Education Support Loan",
      originalAmount: 150000,
      amountRecovered: 0,
      amountPending: 150000,
      disbursementDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      expectedRecoveryDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
      status: "on_track",
      repaymentTerms: "6 monthly installments starting next month",
    },
  ],
  advancesGiven: [
    {
      id: "ag1",
      memberName: "Chief Obiora Chukwuma",
      memberAvatar: communityPerson1,
      memberEmail: "obiora.c@email.com",
      memberPhone: "+234 801 234 5678",
      type: "advance",
      description: "Event Organization Advance",
      originalAmount: 100000,
      amountRecovered: 0,
      amountPending: 100000,
      disbursementDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      expectedRecoveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "on_track",
      notes: "To be settled after Cultural Festival"
    },
    {
      id: "ag2",
      memberName: "Ngozi Okafor",
      memberAvatar: communityPerson2,
      memberEmail: "ngozi.o@email.com",
      memberPhone: "+234 802 345 6789",
      type: "advance",
      description: "Travel Expense Advance",
      originalAmount: 75000,
      amountRecovered: 25000,
      amountPending: 50000,
      disbursementDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      expectedRecoveryDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: "overdue",
      notes: "Partial receipt submitted, balance pending"
    },
  ],
  recoverableExpenses: [
    {
      id: "re1",
      memberName: "Event Committee",
      memberAvatar: communityPerson5,
      memberEmail: "events@community.org",
      memberPhone: "+234 808 901 2345",
      type: "recoverable",
      description: "Festival Vendor Deposits (Refundable)",
      originalAmount: 150000,
      amountRecovered: 0,
      amountPending: 150000,
      disbursementDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      expectedRecoveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "on_track",
      notes: "Deposits to be returned after event"
    },
    {
      id: "re2",
      memberName: "Legal Department",
      memberAvatar: communityPerson1,
      memberEmail: "legal@community.org",
      memberPhone: "+234 809 012 3456",
      type: "recoverable",
      description: "Court Filing Fees (Reimbursable)",
      originalAmount: 50000,
      amountRecovered: 20000,
      amountPending: 30000,
      disbursementDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      expectedRecoveryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: "partial",
      notes: "Partial refund received from opposing party"
    },
    {
      id: "re3",
      memberName: "Building Committee",
      memberAvatar: communityPerson3,
      memberEmail: "building@community.org",
      memberPhone: "+234 810 123 4567",
      type: "recoverable",
      description: "Contractor Guarantee Deposit",
      originalAmount: 200000,
      amountRecovered: 0,
      amountPending: 200000,
      disbursementDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      expectedRecoveryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      status: "on_track",
      notes: "Refundable upon project completion"
    },
  ],
};

const floatingFundLabels: Record<string, string> = {
  pendingLoans: "Pending Loans",
  advancesGiven: "Advances Given",
  recoverableExpenses: "Recoverable Expenses",
};

const floatingFundColors: Record<string, string> = {
  pendingLoans: "bg-purple-50 border-purple-200",
  advancesGiven: "bg-indigo-50 border-indigo-200",
  recoverableExpenses: "bg-violet-50 border-violet-200",
};

interface FloatingFundsDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceKey: string;
  totalAmount: number;
}

// Helper: Local Currency PRIMARY, Mobi SECONDARY (no abbreviations)
const formatLocalPrimary = (amount: number) => formatNgnMobi(amount);

const getStatusConfig = (status: FloatingFundRecord["status"]) => {
  switch (status) {
    case "on_track":
      return { 
        label: "On Track", 
        className: "bg-green-500/10 text-green-600",
      };
    case "delayed":
      return { 
        label: "Delayed", 
        className: "bg-amber-500/10 text-amber-600",
      };
    case "partial":
      return { 
        label: "Partial", 
        className: "bg-blue-500/10 text-blue-600",
      };
    case "overdue":
      return { 
        label: "Overdue", 
        className: "bg-red-500/10 text-red-600",
      };
    default:
      return { 
        label: status, 
        className: "bg-gray-500/10 text-gray-600",
      };
  }
};

const getTypeIcon = (type: FloatingFundRecord["type"]) => {
  switch (type) {
    case "loan":
      return <Banknote className="h-4 w-4" />;
    case "advance":
      return <ArrowRight className="h-4 w-4" />;
    case "recoverable":
      return <RefreshCw className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export const FloatingFundsDetailSheet = ({
  open,
  onOpenChange,
  sourceKey,
  totalAmount,
}: FloatingFundsDetailSheetProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<FloatingFundRecord | null>(null);

  const records = mockFloatingFundRecords[sourceKey] || [];
  const sourceLabel = floatingFundLabels[sourceKey] || sourceKey;
  const sourceColor = floatingFundColors[sourceKey] || "bg-purple-50 border-purple-200";

  const filteredRecords = records.filter((r) =>
    r.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFormatted = formatLocalPrimary(totalAmount);
  const totalRecovered = records.reduce((sum, r) => sum + r.amountRecovered, 0);
  const recoveryRate = totalAmount > 0 ? Math.round((totalRecovered / (totalRecovered + totalAmount)) * 100) : 0;

  const handleSendReminder = (record: FloatingFundRecord) => {
    toast({
      title: "Reminder Sent",
      description: `Recovery reminder sent for ${record.description}.`,
    });
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Summary Header */}
      <Card className={`p-4 ${sourceColor} border`}>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-white/80 shrink-0">
              <RefreshCw className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{sourceLabel}</p>
              <p className="text-xl font-bold text-purple-600 break-words leading-tight">
                {totalFormatted.local}
              </p>
              <p className="text-xs text-muted-foreground break-words">
                ({totalFormatted.mobi}) pending
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {records.length} records
            </Badge>
            <Badge className="text-[10px] bg-green-500/10 text-green-600">
              {recoveryRate}% recovered
            </Badge>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Records List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Floating Fund Records ({filteredRecords.length})
        </h3>

        <div className="space-y-2">
          {filteredRecords.map((record) => {
            const pendingFormatted = formatLocalPrimary(record.amountPending);
            const statusConfig = getStatusConfig(record.status);
            const recoveryProgress = Math.round((record.amountRecovered / record.originalAmount) * 100);
            
            return (
              <Card 
                key={record.id} 
                className="p-3 cursor-pointer hover:bg-muted/30 transition-colors active:scale-[0.99]"
                onClick={() => setSelectedRecord(record)}
              >
                {/* Mobile-optimized stacked layout */}
                <div className="space-y-2">
                  {/* Row 1: Avatar + Name */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={record.memberAvatar} />
                      <AvatarFallback className="text-sm">
                        {record.memberName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm break-words leading-tight">
                        {record.memberName}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 break-words">
                        {record.description}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Amount */}
                  <div className="flex items-center justify-between gap-2 pl-13">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-purple-600 break-words leading-tight">
                        {pendingFormatted.local}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({pendingFormatted.mobi})
                      </p>
                    </div>
                    <Badge className={`text-[10px] shrink-0 ${statusConfig.className}`}>
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Row 3: Progress & chevron */}
                  <div className="flex items-center gap-2 pl-13">
                    <Progress value={recoveryProgress} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground shrink-0">
                      {recoveryProgress}%
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <Card className="p-8 text-center">
          <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">No Records Found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query.
          </p>
        </Card>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <FloatingFundDetailModal
          record={selectedRecord}
          open={!!selectedRecord}
          onOpenChange={(open) => !open && setSelectedRecord(null)}
          onSendReminder={handleSendReminder}
        />
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>{sourceLabel} Details</DrawerTitle>
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
          <DialogTitle>{sourceLabel} Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <Content />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Record Detail Modal Component
interface FloatingFundDetailModalProps {
  record: FloatingFundRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendReminder: (record: FloatingFundRecord) => void;
}

const FloatingFundDetailModal = ({
  record,
  open,
  onOpenChange,
  onSendReminder,
}: FloatingFundDetailModalProps) => {
  const isMobile = useIsMobile();
  const originalFormatted = formatLocalPrimary(record.originalAmount);
  const recoveredFormatted = formatLocalPrimary(record.amountRecovered);
  const pendingFormatted = formatLocalPrimary(record.amountPending);
  const statusConfig = getStatusConfig(record.status);
  const recoveryProgress = Math.round((record.amountRecovered / record.originalAmount) * 100);

  const DetailContent = () => (
    <div className="space-y-4">
      {/* Record Header */}
      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
        <Avatar className="h-14 w-14">
          <AvatarImage src={record.memberAvatar} />
          <AvatarFallback>{record.memberName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{record.memberName}</p>
          <div className="flex items-center gap-2 mt-1">
            {getTypeIcon(record.type)}
            <span className="text-xs text-muted-foreground capitalize">
              {record.type.replace(/_/g, " ")}
            </span>
          </div>
        </div>
        <Badge className={statusConfig.className}>
          {statusConfig.label}
        </Badge>
      </div>

      {/* Amount Summary */}
      <Card className="p-4 bg-purple-50 border-purple-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Original Amount</span>
            <span className="font-medium">{originalFormatted.local}</span>
          </div>
          <div className="flex items-center justify-between text-green-600">
            <span className="text-sm">Recovered</span>
            <span className="font-medium">-{recoveredFormatted.local}</span>
          </div>
          <div className="border-t pt-2 flex items-center justify-between">
            <span className="font-medium">Pending</span>
            <span className="font-bold text-purple-600">{pendingFormatted.local}</span>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Recovery Progress</span>
              <span>{recoveryProgress}%</span>
            </div>
            <Progress value={recoveryProgress} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="space-y-3">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          <p className="font-medium text-sm">{record.description}</p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Disbursed</p>
            <p className="font-medium text-sm">{format(record.disbursementDate, "MMM d, yyyy")}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Expected Recovery</p>
            <p className="font-medium text-sm">{format(record.expectedRecoveryDate, "MMM d, yyyy")}</p>
          </Card>
        </div>

        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-2">Contact Information</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{record.memberEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{record.memberPhone}</span>
            </div>
          </div>
        </Card>

        {record.repaymentTerms && (
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Repayment Terms</p>
            <p className="text-sm">{record.repaymentTerms}</p>
          </Card>
        )}

        {record.notes && (
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-sm">{record.notes}</p>
          </Card>
        )}

        {/* Actions */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onSendReminder(record)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Recovery Reminder
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>Floating Fund Details</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            <DetailContent />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Floating Fund Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <DetailContent />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
