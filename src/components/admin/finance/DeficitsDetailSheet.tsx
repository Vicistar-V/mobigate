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
  AlertTriangle,
  Calendar,
  User,
  Clock,
  ChevronRight,
  Mail,
  Phone,
  Ban,
} from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";
import communityPerson4 from "@/assets/community-person-4.jpg";
import communityPerson5 from "@/assets/community-person-5.jpg";
import communityPerson6 from "@/assets/community-person-6.jpg";

interface DeficitRecord {
  id: string;
  memberName: string;
  memberAvatar: string;
  memberEmail: string;
  memberPhone: string;
  obligationType: string;
  obligationName: string;
  amountOwed: number;
  dueDate: Date;
  daysPastDue: number;
  status: "overdue" | "grace_period" | "defaulting" | "suspended";
  lastReminder?: Date;
  notes?: string;
}

// Mock data for deficits categories
const mockDeficitRecords: Record<string, DeficitRecord[]> = {
  unpaidDues: [
    {
      id: "ud1",
      memberName: "Obiora Chukwuma",
      memberAvatar: communityPerson1,
      memberEmail: "obiora.c@email.com",
      memberPhone: "+234 801 234 5678",
      obligationType: "annual_dues",
      obligationName: "Annual Dues 2025",
      amountOwed: 15000,
      dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      daysPastDue: 30,
      status: "overdue",
      lastReminder: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      notes: "Promised to pay by month end"
    },
    {
      id: "ud2",
      memberName: "Ngozi Okafor",
      memberAvatar: communityPerson2,
      memberEmail: "ngozi.o@email.com",
      memberPhone: "+234 802 345 6789",
      obligationType: "annual_dues",
      obligationName: "Annual Dues 2025",
      amountOwed: 15000,
      dueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      daysPastDue: 45,
      status: "defaulting",
      lastReminder: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ud3",
      memberName: "Emeka Nwosu",
      memberAvatar: communityPerson4,
      memberEmail: "emeka.n@email.com",
      memberPhone: "+234 803 456 7890",
      obligationType: "annual_dues",
      obligationName: "Annual Dues 2025",
      amountOwed: 15000,
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      daysPastDue: 15,
      status: "grace_period",
    },
    {
      id: "ud4",
      memberName: "Adaeze Nnamdi",
      memberAvatar: communityPerson5,
      memberEmail: "adaeze.n@email.com",
      memberPhone: "+234 804 567 8901",
      obligationType: "annual_dues",
      obligationName: "Annual Dues 2024",
      amountOwed: 12000,
      dueDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      daysPastDue: 365,
      status: "suspended",
      notes: "Membership suspended due to non-payment"
    },
  ],
  unpaidLevies: [
    {
      id: "ul1",
      memberName: "Chukwuemeka Okonkwo",
      memberAvatar: communityPerson4,
      memberEmail: "chukwuemeka.o@email.com",
      memberPhone: "+234 805 678 9012",
      obligationType: "development_levy",
      obligationName: "Community Hall Development Levy",
      amountOwed: 25000,
      dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      daysPastDue: 20,
      status: "overdue",
      lastReminder: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ul2",
      memberName: "Ifeanyi Ezekwesili",
      memberAvatar: communityPerson6,
      memberEmail: "ifeanyi.e@email.com",
      memberPhone: "+234 806 789 0123",
      obligationType: "development_levy",
      obligationName: "Community Hall Development Levy",
      amountOwed: 12500,
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      daysPastDue: 10,
      status: "grace_period",
      notes: "Partial payment received - M12,500 pending"
    },
    {
      id: "ul3",
      memberName: "Dr. Amaka Eze",
      memberAvatar: communityPerson3,
      memberEmail: "dr.amaka@email.com",
      memberPhone: "+234 807 890 1234",
      obligationType: "emergency_levy",
      obligationName: "Emergency Health Fund",
      amountOwed: 5000,
      dueDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      daysPastDue: 35,
      status: "defaulting",
    },
  ],
  pendingObligations: [
    {
      id: "po1",
      memberName: "Ngozi Okafor",
      memberAvatar: communityPerson2,
      memberEmail: "ngozi.o@email.com",
      memberPhone: "+234 802 345 6789",
      obligationType: "special_assessment",
      obligationName: "Road Repair Assessment",
      amountOwed: 10000,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      daysPastDue: 0,
      status: "grace_period",
      notes: "Due in 2 weeks"
    },
    {
      id: "po2",
      memberName: "Obiora Chukwuma",
      memberAvatar: communityPerson1,
      memberEmail: "obiora.c@email.com",
      memberPhone: "+234 801 234 5678",
      obligationType: "project_levy",
      obligationName: "School Building Project",
      amountOwed: 30000,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      daysPastDue: 0,
      status: "grace_period",
    },
  ],
};

const deficitLabels: Record<string, string> = {
  unpaidDues: "Unpaid Dues",
  unpaidLevies: "Unpaid Levies",
  pendingObligations: "Pending Obligations",
};

const deficitColors: Record<string, string> = {
  unpaidDues: "bg-amber-50 border-amber-200",
  unpaidLevies: "bg-orange-50 border-orange-200",
  pendingObligations: "bg-yellow-50 border-yellow-200",
};

interface DeficitsDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceKey: string;
  totalAmount: number;
}

// Helper: Local Currency PRIMARY, Mobi SECONDARY
const formatLocalPrimary = (amount: number): { local: string; mobi: string } => {
  if (amount >= 1000000) {
    return {
      local: `₦${(amount / 1000000).toFixed(2)}M`,
      mobi: `M${(amount / 1000000).toFixed(2)}M`,
    };
  }
  if (amount >= 1000) {
    return {
      local: `₦${(amount / 1000).toFixed(0)}k`,
      mobi: `M${(amount / 1000).toFixed(0)}k`,
    };
  }
  return {
    local: `₦${amount.toLocaleString()}`,
    mobi: `M${amount.toLocaleString()}`,
  };
};

const getStatusConfig = (status: DeficitRecord["status"]) => {
  switch (status) {
    case "overdue":
      return { 
        label: "Overdue", 
        className: "bg-red-500/10 text-red-600",
      };
    case "grace_period":
      return { 
        label: "Grace Period", 
        className: "bg-amber-500/10 text-amber-600",
      };
    case "defaulting":
      return { 
        label: "Defaulting", 
        className: "bg-orange-500/10 text-orange-600",
      };
    case "suspended":
      return { 
        label: "Suspended", 
        className: "bg-gray-500/10 text-gray-600",
      };
    default:
      return { 
        label: status, 
        className: "bg-gray-500/10 text-gray-600",
      };
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
  const [selectedRecord, setSelectedRecord] = useState<DeficitRecord | null>(null);

  const records = mockDeficitRecords[sourceKey] || [];
  const sourceLabel = deficitLabels[sourceKey] || sourceKey;
  const sourceColor = deficitColors[sourceKey] || "bg-amber-50 border-amber-200";

  const filteredRecords = records.filter((r) =>
    r.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.obligationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFormatted = formatLocalPrimary(totalAmount);
  const overdueCount = records.filter(r => r.status === "overdue" || r.status === "defaulting").length;

  const handleSendReminder = (record: DeficitRecord) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${record.memberName}.`,
    });
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Summary Header */}
      <Card className={`p-4 ${sourceColor} border`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white/80">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{sourceLabel}</p>
            <p className="text-xl font-bold text-amber-600">{totalFormatted.local}</p>
            <p className="text-xs text-muted-foreground">({totalFormatted.mobi})</p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-xs mb-1">
              {records.length} members
            </Badge>
            {overdueCount > 0 && (
              <div>
                <Badge className="text-[10px] bg-red-500/10 text-red-600">
                  {overdueCount} overdue
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by member name or obligation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Records List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          Outstanding Records ({filteredRecords.length})
        </h3>

        <div className="space-y-2">
          {filteredRecords.map((record) => {
            const amountFormatted = formatLocalPrimary(record.amountOwed);
            const statusConfig = getStatusConfig(record.status);
            
            return (
              <Card 
                key={record.id} 
                className="p-3 cursor-pointer hover:bg-muted/30 transition-colors active:scale-[0.99]"
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={record.memberAvatar} />
                    <AvatarFallback className="text-sm">
                      {record.memberName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{record.memberName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {record.obligationName}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge className={`text-xs ${statusConfig.className}`}>
                        {statusConfig.label}
                      </Badge>
                      {record.daysPastDue > 0 && (
                        <span className="text-xs text-red-600">
                          {record.daysPastDue} days overdue
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm text-amber-600">
                      {amountFormatted.local}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ({amountFormatted.mobi})
                    </p>
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 ml-auto" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <Card className="p-8 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">No Records Found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query.
          </p>
        </Card>
      )}

      {/* Member Detail Modal */}
      {selectedRecord && (
        <DeficitMemberDetailModal
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

// Member Detail Modal Component
interface DeficitMemberDetailModalProps {
  record: DeficitRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendReminder: (record: DeficitRecord) => void;
}

const DeficitMemberDetailModal = ({
  record,
  open,
  onOpenChange,
  onSendReminder,
}: DeficitMemberDetailModalProps) => {
  const isMobile = useIsMobile();
  const amountFormatted = formatLocalPrimary(record.amountOwed);
  const statusConfig = getStatusConfig(record.status);

  const DetailContent = () => (
    <div className="space-y-4">
      {/* Member Header */}
      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
        <Avatar className="h-14 w-14">
          <AvatarImage src={record.memberAvatar} />
          <AvatarFallback>{record.memberName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{record.memberName}</p>
          <Badge className={`mt-1 ${statusConfig.className}`}>
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Amount Due */}
      <div className="text-center py-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-xs text-muted-foreground mb-1">Amount Owed</p>
        <p className="text-3xl font-bold text-amber-600">{amountFormatted.local}</p>
        <p className="text-sm text-muted-foreground">({amountFormatted.mobi})</p>
      </div>

      {/* Details Grid */}
      <div className="space-y-3">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Obligation</p>
          <p className="font-medium text-sm">{record.obligationName}</p>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
            {record.obligationType.replace(/_/g, " ")}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Due Date</p>
            <p className="font-medium text-sm">{format(record.dueDate, "MMM d, yyyy")}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Days Past Due</p>
            <p className={`font-medium text-sm ${record.daysPastDue > 0 ? "text-red-600" : "text-green-600"}`}>
              {record.daysPastDue > 0 ? `${record.daysPastDue} days` : "Not yet due"}
            </p>
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

        {record.lastReminder && (
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Last Reminder Sent</p>
            <p className="font-medium text-sm">{format(record.lastReminder, "MMM d, yyyy 'at' h:mm a")}</p>
          </Card>
        )}

        {record.notes && (
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-sm">{record.notes}</p>
          </Card>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onSendReminder(record)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Reminder
          </Button>
          {record.status === "defaulting" && (
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => {}}
            >
              <Ban className="h-4 w-4 mr-2" />
              Suspend
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>Member Deficit Details</DrawerTitle>
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
          <DialogTitle>Member Deficit Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <DetailContent />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
