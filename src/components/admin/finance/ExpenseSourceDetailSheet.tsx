import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  TrendingDown,
  Calendar,
  FileText,
  User,
  Building2,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { formatNgnMobi } from "@/lib/financialDisplay";

import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";

interface ExpenseRecord {
  id: string;
  description: string;
  vendor: string;
  amount: number;
  date: Date;
  reference: string;
  status: "completed" | "pending" | "approved" | "rejected";
  approvedBy: string;
  approverAvatar: string;
  category: string;
  paymentMethod: "bank_transfer" | "cash" | "check" | "wallet";
  receipt?: string;
  notes?: string;
}

// Mock data for each expense category
const mockExpenseRecords: Record<string, ExpenseRecord[]> = {
  operationalExpenses: [
    { 
      id: "op1", 
      description: "Office Supplies - Stationery & Printing Materials", 
      vendor: "Office Hub Nigeria Ltd", 
      amount: 45000, 
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
      reference: "OPE-2025-001", 
      status: "completed",
      approvedBy: "Chief Obiora Chukwuma",
      approverAvatar: communityPerson1,
      category: "Office Supplies",
      paymentMethod: "bank_transfer",
      receipt: "REC-2025-001",
      notes: "Monthly office supplies restocking"
    },
    { 
      id: "op2", 
      description: "Electricity Bills - Community Hall & Office", 
      vendor: "EKEDC", 
      amount: 85000, 
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
      reference: "OPE-2025-002", 
      status: "completed",
      approvedBy: "Chief Obiora Chukwuma",
      approverAvatar: communityPerson1,
      category: "Utilities",
      paymentMethod: "bank_transfer",
      receipt: "REC-2025-002"
    },
    { 
      id: "op3", 
      description: "Security Personnel Salary - January", 
      vendor: "Zenith Security Services", 
      amount: 120000, 
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), 
      reference: "OPE-2025-003", 
      status: "completed",
      approvedBy: "Dr. Amaka Eze",
      approverAvatar: communityPerson3,
      category: "Personnel",
      paymentMethod: "bank_transfer"
    },
    { 
      id: "op4", 
      description: "Internet & Communication Services", 
      vendor: "MTN Business", 
      amount: 35000, 
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), 
      reference: "OPE-2025-004", 
      status: "completed",
      approvedBy: "Chief Obiora Chukwuma",
      approverAvatar: communityPerson1,
      category: "Communication",
      paymentMethod: "wallet"
    },
    { 
      id: "op5", 
      description: "Cleaning & Janitorial Services", 
      vendor: "CleanPro Services", 
      amount: 75000, 
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 
      reference: "OPE-2025-005", 
      status: "pending",
      approvedBy: "Ngozi Okafor",
      approverAvatar: communityPerson2,
      category: "Maintenance",
      paymentMethod: "bank_transfer",
      notes: "Quarterly cleaning contract"
    },
    { 
      id: "op6", 
      description: "Generator Fuel & Maintenance", 
      vendor: "Total Energies", 
      amount: 90000, 
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), 
      reference: "OPE-2025-006", 
      status: "completed",
      approvedBy: "Chief Obiora Chukwuma",
      approverAvatar: communityPerson1,
      category: "Utilities",
      paymentMethod: "cash",
      receipt: "REC-2025-006"
    },
  ],
  projectExpenses: [
    { 
      id: "pr1", 
      description: "Community Hall Foundation & Groundwork", 
      vendor: "Mega Builders Construction Ltd", 
      amount: 500000, 
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
      reference: "PRJ-2025-001", 
      status: "completed",
      approvedBy: "Chief Obiora Chukwuma",
      approverAvatar: communityPerson1,
      category: "Construction",
      paymentMethod: "bank_transfer",
      receipt: "REC-2025-010",
      notes: "Phase 1 - Foundation work completed"
    },
    { 
      id: "pr2", 
      description: "Building Materials - Cement & Iron Rods", 
      vendor: "Dangote Building Materials", 
      amount: 350000, 
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), 
      reference: "PRJ-2025-002", 
      status: "completed",
      approvedBy: "Dr. Amaka Eze",
      approverAvatar: communityPerson3,
      category: "Materials",
      paymentMethod: "bank_transfer",
      receipt: "REC-2025-011"
    },
    { 
      id: "pr3", 
      description: "Architectural & Engineering Consultancy", 
      vendor: "Apex Design Consultants", 
      amount: 150000, 
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), 
      reference: "PRJ-2025-003", 
      status: "completed",
      approvedBy: "Chief Obiora Chukwuma",
      approverAvatar: communityPerson1,
      category: "Professional Services",
      paymentMethod: "bank_transfer"
    },
    { 
      id: "pr4", 
      description: "Electrical Installation - Phase 1", 
      vendor: "PowerMax Electricals", 
      amount: 120000, 
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), 
      reference: "PRJ-2025-004", 
      status: "approved",
      approvedBy: "Ngozi Okafor",
      approverAvatar: communityPerson2,
      category: "Installation",
      paymentMethod: "bank_transfer",
      notes: "Awaiting materials before installation"
    },
    { 
      id: "pr5", 
      description: "Plumbing & Water System Installation", 
      vendor: "AquaFlow Plumbing Services", 
      amount: 80000, 
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      reference: "PRJ-2025-005", 
      status: "pending",
      approvedBy: "Dr. Amaka Eze",
      approverAvatar: communityPerson3,
      category: "Installation",
      paymentMethod: "bank_transfer"
    },
  ],
  welfarePayouts: [
    { 
      id: "wf1", 
      description: "Medical Emergency Support - Chukwuemeka Okonkwo", 
      vendor: "St. Nicholas Hospital", 
      amount: 100000, 
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), 
      reference: "WEL-2025-001", 
      status: "completed",
      approvedBy: "Chief Obiora Chukwuma",
      approverAvatar: communityPerson1,
      category: "Medical Support",
      paymentMethod: "bank_transfer",
      notes: "Emergency surgery expenses covered"
    },
    { 
      id: "wf2", 
      description: "Bereavement Support - Adaeze Nnamdi Family", 
      vendor: "Direct to Beneficiary", 
      amount: 50000, 
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), 
      reference: "WEL-2025-002", 
      status: "completed",
      approvedBy: "Dr. Amaka Eze",
      approverAvatar: communityPerson3,
      category: "Bereavement",
      paymentMethod: "cash"
    },
    { 
      id: "wf3", 
      description: "Education Scholarship - Ifeanyi Ezekwesili", 
      vendor: "Federal University Onitsha", 
      amount: 75000, 
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), 
      reference: "WEL-2025-003", 
      status: "completed",
      approvedBy: "Ngozi Okafor",
      approverAvatar: communityPerson2,
      category: "Education",
      paymentMethod: "bank_transfer",
      notes: "Second year tuition payment"
    },
    { 
      id: "wf4", 
      description: "Childbirth Celebration Gift", 
      vendor: "Direct to Beneficiary", 
      amount: 25000, 
      date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), 
      reference: "WEL-2025-004", 
      status: "completed",
      approvedBy: "Chief Obiora Chukwuma",
      approverAvatar: communityPerson1,
      category: "Celebration",
      paymentMethod: "cash"
    },
  ],
  administrativeExpenses: [
    { 
      id: "ad1", 
      description: "Annual Report Printing & Binding", 
      vendor: "Premier Printing Press", 
      amount: 45000, 
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 
      reference: "ADM-2025-001", 
      status: "completed",
      approvedBy: "Dr. Amaka Eze",
      approverAvatar: communityPerson3,
      category: "Printing",
      paymentMethod: "bank_transfer",
      receipt: "REC-2025-020"
    },
    { 
      id: "ad2", 
      description: "Legal & Compliance Consultation", 
      vendor: "Okonkwo & Associates Law Firm", 
      amount: 35000, 
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 
      reference: "ADM-2025-002", 
      status: "completed",
      approvedBy: "Chief Obiora Chukwuma",
      approverAvatar: communityPerson1,
      category: "Legal",
      paymentMethod: "bank_transfer"
    },
    { 
      id: "ad3", 
      description: "Accounting & Audit Services", 
      vendor: "KPMG Nigeria", 
      amount: 50000, 
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      reference: "ADM-2025-003", 
      status: "completed",
      approvedBy: "Ngozi Okafor",
      approverAvatar: communityPerson2,
      category: "Professional",
      paymentMethod: "bank_transfer",
      notes: "Quarterly audit completed"
    },
    { 
      id: "ad4", 
      description: "Board Meeting Refreshments & Venue", 
      vendor: "Transcorp Hilton Abuja", 
      amount: 20000, 
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), 
      reference: "ADM-2025-004", 
      status: "pending",
      approvedBy: "Chief Obiora Chukwuma",
      approverAvatar: communityPerson1,
      category: "Meetings",
      paymentMethod: "wallet"
    },
  ],
  otherExpenses: [
    { 
      id: "ot1", 
      description: "Cultural Festival Logistics & Transport", 
      vendor: "ABC Logistics", 
      amount: 25000, 
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
      reference: "OTH-2025-001", 
      status: "completed",
      approvedBy: "Ngozi Okafor",
      approverAvatar: communityPerson2,
      category: "Events",
      paymentMethod: "cash"
    },
    { 
      id: "ot2", 
      description: "Emergency Repairs - Community Borehole", 
      vendor: "WaterTech Solutions", 
      amount: 15000, 
      date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), 
      reference: "OTH-2025-002", 
      status: "completed",
      approvedBy: "Dr. Amaka Eze",
      approverAvatar: communityPerson3,
      category: "Repairs",
      paymentMethod: "cash"
    },
    { 
      id: "ot3", 
      description: "Miscellaneous Community Support", 
      vendor: "Various Vendors", 
      amount: 10000, 
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), 
      reference: "OTH-2025-003", 
      status: "completed",
      approvedBy: "Chief Obiora Chukwuma",
      approverAvatar: communityPerson1,
      category: "Miscellaneous",
      paymentMethod: "cash"
    },
  ],
};

const expenseSourceLabels: Record<string, string> = {
  operationalExpenses: "Operational Expenses",
  projectExpenses: "Project Expenses",
  welfarePayouts: "Welfare Payouts",
  administrativeExpenses: "Administrative Expenses",
  otherExpenses: "Other Expenses",
};

const expenseSourceColors: Record<string, string> = {
  operationalExpenses: "bg-blue-50 border-blue-200",
  projectExpenses: "bg-purple-50 border-purple-200",
  welfarePayouts: "bg-pink-50 border-pink-200",
  administrativeExpenses: "bg-amber-50 border-amber-200",
  otherExpenses: "bg-gray-50 border-gray-200",
};

const expenseSourceIcons: Record<string, React.ReactNode> = {
  operationalExpenses: <Building2 className="h-5 w-5 text-blue-600" />,
  projectExpenses: <FileText className="h-5 w-5 text-purple-600" />,
  welfarePayouts: <User className="h-5 w-5 text-pink-600" />,
  administrativeExpenses: <Receipt className="h-5 w-5 text-amber-600" />,
  otherExpenses: <AlertCircle className="h-5 w-5 text-gray-600" />,
};

interface ExpenseSourceDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceKey: string;
  totalAmount: number;
}

// Helper: Local Currency PRIMARY, Mobi SECONDARY (no abbreviations)
const formatLocalPrimary = (amount: number) => formatNgnMobi(amount);

const getStatusConfig = (status: ExpenseRecord["status"]) => {
  switch (status) {
    case "completed":
      return { 
        label: "Paid", 
        className: "bg-green-500/10 text-green-600",
        icon: <CheckCircle2 className="h-3 w-3" />
      };
    case "pending":
      return { 
        label: "Pending", 
        className: "bg-amber-500/10 text-amber-600",
        icon: <Clock className="h-3 w-3" />
      };
    case "approved":
      return { 
        label: "Approved", 
        className: "bg-blue-500/10 text-blue-600",
        icon: <CheckCircle2 className="h-3 w-3" />
      };
    case "rejected":
      return { 
        label: "Rejected", 
        className: "bg-red-500/10 text-red-600",
        icon: <AlertCircle className="h-3 w-3" />
      };
    default:
      return { 
        label: status, 
        className: "bg-gray-500/10 text-gray-600",
        icon: null
      };
  }
};

const getPaymentMethodLabel = (method: ExpenseRecord["paymentMethod"]) => {
  switch (method) {
    case "bank_transfer": return "Bank Transfer";
    case "cash": return "Cash";
    case "check": return "Check";
    case "wallet": return "Mobi Wallet";
    default: return method;
  }
};

export const ExpenseSourceDetailSheet = ({
  open,
  onOpenChange,
  sourceKey,
  totalAmount,
}: ExpenseSourceDetailSheetProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRecord | null>(null);

  const expenses = mockExpenseRecords[sourceKey] || [];
  const sourceLabel = expenseSourceLabels[sourceKey] || sourceKey;
  const sourceColor = expenseSourceColors[sourceKey] || "bg-gray-50 border-gray-200";
  const sourceIcon = expenseSourceIcons[sourceKey] || <Receipt className="h-5 w-5 text-gray-600" />;

  const filteredExpenses = expenses.filter((e) =>
    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFormatted = formatLocalPrimary(totalAmount);
  const completedCount = expenses.filter(e => e.status === "completed").length;
  const pendingCount = expenses.filter(e => e.status === "pending" || e.status === "approved").length;

  const handleDownloadReceipt = (expense: ExpenseRecord) => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for ${expense.reference} has been downloaded.`,
    });
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Summary Header - LOCAL CURRENCY PRIMARY */}
      <Card className={`p-4 ${sourceColor} border`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white/80">
            {sourceIcon}
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{sourceLabel}</p>
            <p className="text-xl font-bold text-red-600 whitespace-normal break-words leading-tight">-{totalFormatted.local}</p>
            <p className="text-xs text-muted-foreground">({totalFormatted.mobi})</p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-xs mb-1">
              {expenses.length} records
            </Badge>
            <div className="flex gap-1 justify-end">
              <Badge className="text-[10px] bg-green-500/10 text-green-600">
                {completedCount} paid
              </Badge>
              {pendingCount > 0 && (
                <Badge className="text-[10px] bg-amber-500/10 text-amber-600">
                  {pendingCount} pending
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by description, vendor, or reference..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Expense Records List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Expense Records ({filteredExpenses.length})
        </h3>

        <div className="space-y-2">
          {filteredExpenses.map((expense) => {
            const expenseFormatted = formatLocalPrimary(expense.amount);
            const statusConfig = getStatusConfig(expense.status);
            
            return (
              <Card 
                key={expense.id} 
                className="p-3 cursor-pointer hover:bg-muted/30 transition-colors active:scale-[0.99]"
                onClick={() => setSelectedExpense(expense)}
              >
                <div className="space-y-2">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{expense.description}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {expense.vendor}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 max-w-[52%]">
                      <p className="font-semibold text-sm text-red-600 whitespace-normal break-words leading-tight">
                        -{expenseFormatted.local}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({expenseFormatted.mobi})
                      </p>
                    </div>
                  </div>

                  {/* Footer Row */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(expense.date, "MMM d, yyyy")}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="truncate max-w-[100px]">{expense.reference}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${statusConfig.className}`}>
                        {statusConfig.icon}
                        <span className="ml-1">{statusConfig.label}</span>
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {filteredExpenses.length === 0 && (
        <Card className="p-8 text-center">
          <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">No Expenses Found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query.
          </p>
        </Card>
      )}

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          open={!!selectedExpense}
          onOpenChange={(open) => !open && setSelectedExpense(null)}
          onDownloadReceipt={handleDownloadReceipt}
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

// Expense Detail Modal Component
interface ExpenseDetailModalProps {
  expense: ExpenseRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadReceipt: (expense: ExpenseRecord) => void;
}

const ExpenseDetailModal = ({
  expense,
  open,
  onOpenChange,
  onDownloadReceipt,
}: ExpenseDetailModalProps) => {
  const isMobile = useIsMobile();
  const expenseFormatted = formatLocalPrimary(expense.amount);
  const statusConfig = getStatusConfig(expense.status);

  const DetailContent = () => (
    <div className="space-y-4">
      {/* Amount Header */}
      <div className="text-center py-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-3xl font-bold text-red-600">-{expenseFormatted.local}</p>
        <p className="text-sm text-muted-foreground">({expenseFormatted.mobi})</p>
        <Badge className={`mt-2 ${statusConfig.className}`}>
          {statusConfig.icon}
          <span className="ml-1">{statusConfig.label}</span>
        </Badge>
      </div>

      {/* Details Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Reference</p>
            <p className="font-medium text-sm">{expense.reference}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Date</p>
            <p className="font-medium text-sm">{format(expense.date, "MMM d, yyyy")}</p>
          </Card>
        </div>

        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          <p className="font-medium text-sm">{expense.description}</p>
        </Card>

        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Vendor / Payee</p>
          <p className="font-medium text-sm">{expense.vendor}</p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Category</p>
            <p className="font-medium text-sm">{expense.category}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
            <p className="font-medium text-sm">{getPaymentMethodLabel(expense.paymentMethod)}</p>
          </Card>
        </div>

        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Approved By</p>
          <div className="flex items-center gap-2 mt-1">
            <img 
              src={expense.approverAvatar} 
              alt={expense.approvedBy}
              className="h-8 w-8 rounded-full object-cover"
            />
            <p className="font-medium text-sm">{expense.approvedBy}</p>
          </div>
        </Card>

        {expense.notes && (
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-sm">{expense.notes}</p>
          </Card>
        )}

        {expense.receipt && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onDownloadReceipt(expense)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt ({expense.receipt})
          </Button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>Expense Details</DrawerTitle>
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
          <DialogTitle>Expense Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <DetailContent />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
