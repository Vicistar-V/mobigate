import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  AlertTriangle,
  Calendar,
  Building2,
  Clock,
  ChevronRight,
  Mail,
  Phone,
  CreditCard,
  FileText,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { formatNgnMobi } from "@/lib/financialDisplay";

interface CommunityDebtRecord {
  id: string;
  payeeName: string;
  payeeType: "contractor" | "vendor" | "utility" | "service_provider" | "other";
  payeeEmail: string;
  payeePhone: string;
  invoiceNumber: string;
  description: string;
  amountOwed: number;
  dueDate: Date;
  daysPastDue: number;
  status: "overdue" | "due_soon" | "pending_approval" | "disputed";
  priority: "high" | "medium" | "low";
  notes?: string;
}

// Mock data for community debts/payables
const mockCommunityDebtRecords: Record<string, CommunityDebtRecord[]> = {
  contractorPayables: [
    {
      id: "cp1",
      payeeName: "Mega Builders Construction Ltd",
      payeeType: "contractor",
      payeeEmail: "accounts@megabuilders.com",
      payeePhone: "+234 801 234 5678",
      invoiceNumber: "INV-MB-2025-045",
      description: "Community Hall Phase 2 - Roofing & Finishing",
      amountOwed: 75000,
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      daysPastDue: 15,
      status: "overdue",
      priority: "high",
      notes: "Contractor has sent 2 payment reminders"
    },
    {
      id: "cp2",
      payeeName: "PowerMax Electricals",
      payeeType: "contractor",
      payeeEmail: "billing@powermax.ng",
      payeePhone: "+234 802 345 6789",
      invoiceNumber: "INV-PME-2025-112",
      description: "Electrical Installation - Final Phase",
      amountOwed: 45000,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      daysPastDue: 0,
      status: "due_soon",
      priority: "medium",
    },
    {
      id: "cp3",
      payeeName: "AquaFlow Plumbing Services",
      payeeType: "contractor",
      payeeEmail: "info@aquaflow.com",
      payeePhone: "+234 803 456 7890",
      invoiceNumber: "INV-AFS-2025-089",
      description: "Water System Installation & Testing",
      amountOwed: 30000,
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      daysPastDue: 5,
      status: "overdue",
      priority: "medium",
    },
  ],
  vendorPayables: [
    {
      id: "vp1",
      payeeName: "Dangote Building Materials",
      payeeType: "vendor",
      payeeEmail: "sales@dangotecement.com",
      payeePhone: "+234 804 567 8901",
      invoiceNumber: "INV-DBM-2025-234",
      description: "Cement & Iron Rods - Credit Purchase",
      amountOwed: 65000,
      dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      daysPastDue: 30,
      status: "overdue",
      priority: "high",
      notes: "30-day credit term expired"
    },
    {
      id: "vp2",
      payeeName: "Office Hub Nigeria Ltd",
      payeeType: "vendor",
      payeeEmail: "orders@officehub.ng",
      payeePhone: "+234 805 678 9012",
      invoiceNumber: "INV-OH-2025-567",
      description: "Office Furniture & Equipment",
      amountOwed: 35000,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      daysPastDue: 0,
      status: "pending_approval",
      priority: "low",
    },
    {
      id: "vp3",
      payeeName: "Premier Printing Press",
      payeeType: "vendor",
      payeeEmail: "accounts@premierprint.com",
      payeePhone: "+234 806 789 0123",
      invoiceNumber: "INV-PPP-2025-321",
      description: "Annual Report Printing & Binding",
      amountOwed: 25000,
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      daysPastDue: 10,
      status: "disputed",
      priority: "low",
      notes: "Quality dispute pending resolution"
    },
  ],
  pendingBills: [
    {
      id: "pb1",
      payeeName: "EKEDC - Eko Electricity",
      payeeType: "utility",
      payeeEmail: "support@abornedc.com",
      payeePhone: "0700-CALL-EKEDC",
      invoiceNumber: "BILL-EKEDC-JAN-2025",
      description: "Electricity Bill - Community Hall & Office",
      amountOwed: 25000,
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      daysPastDue: 7,
      status: "overdue",
      priority: "high",
      notes: "Disconnection notice received"
    },
    {
      id: "pb2",
      payeeName: "Lagos State Water Corporation",
      payeeType: "utility",
      payeeEmail: "billing@lswc.gov.ng",
      payeePhone: "+234 1 234 5678",
      invoiceNumber: "BILL-LSWC-Q1-2025",
      description: "Water Rates - Q1 2025",
      amountOwed: 15000,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      daysPastDue: 0,
      status: "due_soon",
      priority: "medium",
    },
    {
      id: "pb3",
      payeeName: "Zenith Security Services",
      payeeType: "service_provider",
      payeeEmail: "accounts@zenithsecurity.ng",
      payeePhone: "+234 807 890 1234",
      invoiceNumber: "INV-ZSS-FEB-2025",
      description: "Security Personnel - February Salary",
      amountOwed: 10000,
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      daysPastDue: 3,
      status: "overdue",
      priority: "high",
    },
  ],
};

const deficitLabels: Record<string, string> = {
  contractorPayables: "Contractor Payables",
  vendorPayables: "Vendor Payables",
  pendingBills: "Pending Bills & Utilities",
};

const deficitDescriptions: Record<string, string> = {
  contractorPayables: "Amounts owed to contractors for construction and project work",
  vendorPayables: "Amounts owed to vendors for materials and supplies",
  pendingBills: "Outstanding utility bills and service provider payments",
};

const deficitColors: Record<string, string> = {
  contractorPayables: "bg-amber-50 border-amber-200",
  vendorPayables: "bg-orange-50 border-orange-200",
  pendingBills: "bg-red-50 border-red-200",
};

interface DeficitsDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceKey: string;
  totalAmount: number;
}

// Helper: Local Currency PRIMARY, Mobi SECONDARY (no abbreviations)
const formatLocalPrimary = (amount: number) => formatNgnMobi(amount);

const getStatusConfig = (status: CommunityDebtRecord["status"]) => {
  switch (status) {
    case "overdue":
      return { 
        label: "Overdue", 
        className: "bg-red-500/10 text-red-600",
      };
    case "due_soon":
      return { 
        label: "Due Soon", 
        className: "bg-amber-500/10 text-amber-600",
      };
    case "pending_approval":
      return { 
        label: "Pending Approval", 
        className: "bg-blue-500/10 text-blue-600",
      };
    case "disputed":
      return { 
        label: "Disputed", 
        className: "bg-purple-500/10 text-purple-600",
      };
    default:
      return { 
        label: status, 
        className: "bg-gray-500/10 text-gray-600",
      };
  }
};

const getPriorityConfig = (priority: CommunityDebtRecord["priority"]) => {
  switch (priority) {
    case "high":
      return { label: "High Priority", className: "bg-red-500/10 text-red-600" };
    case "medium":
      return { label: "Medium", className: "bg-amber-500/10 text-amber-600" };
    case "low":
      return { label: "Low", className: "bg-green-500/10 text-green-600" };
    default:
      return { label: priority, className: "bg-gray-500/10 text-gray-600" };
  }
};

const getPayeeTypeIcon = (type: CommunityDebtRecord["payeeType"]) => {
  switch (type) {
    case "contractor":
      return <Building2 className="h-4 w-4" />;
    case "vendor":
      return <Receipt className="h-4 w-4" />;
    case "utility":
      return <FileText className="h-4 w-4" />;
    case "service_provider":
      return <Building2 className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export const DeficitsDetailSheet = ({
  open,
  onOpenChange,
  sourceKey,
  totalAmount,
}: DeficitsDetailSheetProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<CommunityDebtRecord | null>(null);

  const records = mockCommunityDebtRecords[sourceKey] || [];
  const sourceLabel = deficitLabels[sourceKey] || sourceKey;
  const sourceDescription = deficitDescriptions[sourceKey] || "";
  const sourceColor = deficitColors[sourceKey] || "bg-amber-50 border-amber-200";

  const filteredRecords = records.filter((r) =>
    r.payeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFormatted = formatLocalPrimary(totalAmount);
  const overdueCount = records.filter(r => r.status === "overdue").length;
  const highPriorityCount = records.filter(r => r.priority === "high").length;

  const handlePayNow = (record: CommunityDebtRecord) => {
    const formatted = formatLocalPrimary(record.amountOwed);
    toast({
      title: "Payment Initiated",
      description: `Payment of ${formatted.local} (${formatted.mobi}) to ${record.payeeName} has been queued for processing.`,
    });
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Summary Header */}
      <Card className={`p-4 ${sourceColor} border`}>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-white/80 shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{sourceLabel}</p>
              <p className="text-xl font-bold text-amber-600 break-words leading-tight">
                {totalFormatted.local}
              </p>
              <p className="text-xs text-muted-foreground break-words">
                ({totalFormatted.mobi}) owed
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {records.length} payables
            </Badge>
            {overdueCount > 0 && (
              <Badge className="text-[10px] bg-red-500/10 text-red-600">
                {overdueCount} overdue
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 border-t pt-2 break-words">
          {sourceDescription}
        </p>
      </Card>

      {/* Priority Summary */}
      {highPriorityCount > 0 && (
        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span className="text-sm text-red-700 break-words">
            {highPriorityCount} high priority payment{highPriorityCount > 1 ? 's' : ''} require immediate attention
          </span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search payee, invoice..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Records List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Outstanding Payments ({filteredRecords.length})
        </h3>

        <div className="space-y-2">
          {filteredRecords.map((record) => {
            const amountFormatted = formatLocalPrimary(record.amountOwed);
            const statusConfig = getStatusConfig(record.status);
            
            return (
              <Card 
                key={record.id} 
                className={`p-3 cursor-pointer hover:bg-muted/30 transition-colors active:scale-[0.99] ${
                  record.priority === "high" ? "border-l-4 border-l-red-500" : ""
                }`}
                onClick={() => setSelectedRecord(record)}
              >
                {/* Mobile-optimized stacked layout */}
                <div className="space-y-2">
                  {/* Row 1: Icon + Payee Name */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted/50 shrink-0">
                      {getPayeeTypeIcon(record.payeeType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm break-words leading-tight">
                        {record.payeeName}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 break-words">
                        {record.description}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Amount - full width */}
                  <div className="flex items-center justify-between gap-2 pl-11">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-red-600 break-words leading-tight">
                        -{amountFormatted.local}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({amountFormatted.mobi})
                      </p>
                    </div>
                    <Badge className={`text-[10px] shrink-0 ${statusConfig.className}`}>
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Row 3: Invoice & Due date */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pl-11 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span className="break-all">{record.invoiceNumber}</span>
                    </span>
                    <span className="text-muted-foreground/50">•</span>
                    {record.daysPastDue > 0 ? (
                      <span className="text-red-600">{record.daysPastDue} days overdue</span>
                    ) : (
                      <span>Due: {format(record.dueDate, "MMM d")}</span>
                    )}
                    <ChevronRight className="h-4 w-4 ml-auto shrink-0" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <Card className="p-8 text-center">
          <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">No Payables Found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query.
          </p>
        </Card>
      )}

      {/* Debt Detail Modal */}
      {selectedRecord && (
        <DebtDetailModal
          record={selectedRecord}
          open={!!selectedRecord}
          onOpenChange={(open) => !open && setSelectedRecord(null)}
          onPayNow={handlePayNow}
        />
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>{sourceLabel}</DrawerTitle>
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
          <DialogTitle>{sourceLabel}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <Content />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Debt Detail Modal Component
interface DebtDetailModalProps {
  record: CommunityDebtRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayNow: (record: CommunityDebtRecord) => void;
}

const DebtDetailModal = ({
  record,
  open,
  onOpenChange,
  onPayNow,
}: DebtDetailModalProps) => {
  const isMobile = useIsMobile();
  const amountFormatted = formatLocalPrimary(record.amountOwed);
  const statusConfig = getStatusConfig(record.status);
  const priorityConfig = getPriorityConfig(record.priority);

  const DetailContent = () => (
    <div className="space-y-4">
      {/* Payee Header */}
      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
        <div className="p-3 rounded-lg bg-background">
          {getPayeeTypeIcon(record.payeeType)}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{record.payeeName}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {record.payeeType.replace(/_/g, " ")}
          </p>
        </div>
        <Badge className={priorityConfig.className}>
          {priorityConfig.label}
        </Badge>
      </div>

      {/* Amount Due */}
      <div className="text-center py-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-xs text-muted-foreground mb-1">Amount Owed by Community</p>
        <p className="text-3xl font-bold text-red-600">{amountFormatted.local}</p>
        <p className="text-sm text-muted-foreground">({amountFormatted.mobi})</p>
        <Badge className={`mt-2 ${statusConfig.className}`}>
          {statusConfig.label}
        </Badge>
      </div>

      {/* Details Grid */}
      <div className="space-y-3">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          <p className="font-medium text-sm">{record.description}</p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Invoice Number</p>
            <p className="font-medium text-sm">{record.invoiceNumber}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Due Date</p>
            <p className={`font-medium text-sm ${record.daysPastDue > 0 ? "text-red-600" : ""}`}>
              {format(record.dueDate, "MMM d, yyyy")}
            </p>
          </Card>
        </div>

        {record.daysPastDue > 0 && (
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <Clock className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700 font-medium">
              {record.daysPastDue} days past due
            </span>
          </div>
        )}

        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-2">Contact Information</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{record.payeeEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{record.payeePhone}</span>
            </div>
          </div>
        </Card>

        {record.notes && (
          <Card className="p-3 bg-amber-50 border-amber-200">
            <p className="text-xs text-muted-foreground mb-1">Notes / Remarks</p>
            <p className="text-sm">{record.notes}</p>
          </Card>
        )}

        {/* Actions */}
        <div className="pt-2">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => onPayNow(record)}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Pay Now - {amountFormatted.local}
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
            <DrawerTitle>Payable Details</DrawerTitle>
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
          <DialogTitle>Payable Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <DetailContent />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
