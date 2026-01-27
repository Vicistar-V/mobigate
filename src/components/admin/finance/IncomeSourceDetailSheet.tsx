import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  TrendingUp,
  Calendar,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";
import communityPerson4 from "@/assets/community-person-4.jpg";
import communityPerson5 from "@/assets/community-person-5.jpg";
import communityPerson6 from "@/assets/community-person-6.jpg";

interface IncomePayment {
  id: string;
  memberName: string;
  memberAvatar: string;
  amount: number;
  paymentDate: Date;
  reference: string;
  status: "completed" | "pending";
}

// Mock data for each income source category
const mockIncomeSourcePayments: Record<string, IncomePayment[]> = {
  duesCollected: [
    { id: "d1", memberName: "Chukwuemeka Okonkwo", memberAvatar: communityPerson4, amount: 15000, paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), reference: "DUE-2025-001", status: "completed" },
    { id: "d2", memberName: "Adaeze Nnamdi", memberAvatar: communityPerson5, amount: 15000, paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), reference: "DUE-2025-002", status: "completed" },
    { id: "d3", memberName: "Chief Obiora Chukwuma", memberAvatar: communityPerson1, amount: 15000, paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), reference: "DUE-2025-003", status: "completed" },
    { id: "d4", memberName: "Dr. Amaka Eze", memberAvatar: communityPerson3, amount: 15000, paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), reference: "DUE-2025-004", status: "completed" },
    { id: "d5", memberName: "Ifeanyi Ezekwesili", memberAvatar: communityPerson6, amount: 15000, paymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), reference: "DUE-2025-005", status: "completed" },
    { id: "d6", memberName: "Ngozi Okafor", memberAvatar: communityPerson2, amount: 15000, paymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), reference: "DUE-2025-006", status: "pending" },
  ],
  leviesCollected: [
    { id: "l1", memberName: "Adaeze Nnamdi", memberAvatar: communityPerson5, amount: 25000, paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), reference: "LEV-2025-001", status: "completed" },
    { id: "l2", memberName: "Chief Obiora Chukwuma", memberAvatar: communityPerson1, amount: 25000, paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), reference: "LEV-2025-002", status: "completed" },
    { id: "l3", memberName: "Chukwuemeka Okonkwo", memberAvatar: communityPerson4, amount: 25000, paymentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), reference: "LEV-2025-003", status: "completed" },
    { id: "l4", memberName: "Dr. Amaka Eze", memberAvatar: communityPerson3, amount: 12500, paymentDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), reference: "LEV-2025-004", status: "pending" },
    { id: "l5", memberName: "Ifeanyi Ezekwesili", memberAvatar: communityPerson6, amount: 25000, paymentDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), reference: "LEV-2025-005", status: "completed" },
  ],
  donations: [
    { id: "dn1", memberName: "Chief Obiora Chukwuma", memberAvatar: communityPerson1, amount: 100000, paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), reference: "DON-2025-001", status: "completed" },
    { id: "dn2", memberName: "Ifeanyi Ezekwesili", memberAvatar: communityPerson6, amount: 50000, paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), reference: "DON-2025-002", status: "completed" },
    { id: "dn3", memberName: "Dr. Amaka Eze", memberAvatar: communityPerson3, amount: 75000, paymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), reference: "DON-2025-003", status: "completed" },
    { id: "dn4", memberName: "Anonymous Donor", memberAvatar: communityPerson2, amount: 125000, paymentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), reference: "DON-2025-004", status: "completed" },
  ],
  fundraisers: [
    { id: "f1", memberName: "Chief Obiora Chukwuma", memberAvatar: communityPerson1, amount: 75000, paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), reference: "FUN-2025-001", status: "completed" },
    { id: "f2", memberName: "Chukwuemeka Okonkwo", memberAvatar: communityPerson4, amount: 50000, paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), reference: "FUN-2025-002", status: "completed" },
    { id: "f3", memberName: "Adaeze Nnamdi", memberAvatar: communityPerson5, amount: 25000, paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), reference: "FUN-2025-003", status: "completed" },
    { id: "f4", memberName: "Ngozi Okafor", memberAvatar: communityPerson2, amount: 100000, paymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), reference: "FUN-2025-004", status: "completed" },
    { id: "f5", memberName: "Dr. Amaka Eze", memberAvatar: communityPerson3, amount: 50000, paymentDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), reference: "FUN-2025-005", status: "pending" },
  ],
  eventRevenue: [
    { id: "e1", memberName: "General Admission", memberAvatar: communityPerson2, amount: 75000, paymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), reference: "EVT-2025-001", status: "completed" },
    { id: "e2", memberName: "VIP Tickets", memberAvatar: communityPerson1, amount: 50000, paymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), reference: "EVT-2025-002", status: "completed" },
    { id: "e3", memberName: "Sponsorship - Acme Corp", memberAvatar: communityPerson3, amount: 25000, paymentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), reference: "EVT-2025-003", status: "completed" },
  ],
  minutesDownloadRevenue: [
    { id: "m1", memberName: "Chukwuemeka Okonkwo", memberAvatar: communityPerson4, amount: 500, paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), reference: "MIN-2025-001", status: "completed" },
    { id: "m2", memberName: "Adaeze Nnamdi", memberAvatar: communityPerson5, amount: 500, paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), reference: "MIN-2025-002", status: "completed" },
    { id: "m3", memberName: "Chief Obiora Chukwuma", memberAvatar: communityPerson1, amount: 1000, paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), reference: "MIN-2025-003", status: "completed" },
    { id: "m4", memberName: "Dr. Amaka Eze", memberAvatar: communityPerson3, amount: 500, paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), reference: "MIN-2025-004", status: "completed" },
    { id: "m5", memberName: "Ifeanyi Ezekwesili", memberAvatar: communityPerson6, amount: 500, paymentDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), reference: "MIN-2025-005", status: "completed" },
  ],
  otherIncome: [
    { id: "o1", memberName: "Hall Rental - Wedding", memberAvatar: communityPerson2, amount: 25000, paymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), reference: "OTH-2025-001", status: "completed" },
    { id: "o2", memberName: "Equipment Rental", memberAvatar: communityPerson1, amount: 15000, paymentDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), reference: "OTH-2025-002", status: "completed" },
    { id: "o3", memberName: "Interest Income", memberAvatar: communityPerson3, amount: 10000, paymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), reference: "OTH-2025-003", status: "completed" },
  ],
};

const incomeSourceLabels: Record<string, string> = {
  duesCollected: "Dues Collected",
  leviesCollected: "Levies Collected",
  donations: "Donations",
  fundraisers: "Fundraisers",
  eventRevenue: "Event Revenue",
  minutesDownloadRevenue: "Minutes Download Revenue",
  otherIncome: "Other Income",
};

const incomeSourceColors: Record<string, string> = {
  duesCollected: "bg-blue-100",
  leviesCollected: "bg-cyan-100",
  donations: "bg-pink-100",
  fundraisers: "bg-purple-100",
  eventRevenue: "bg-yellow-100",
  minutesDownloadRevenue: "bg-green-100",
  otherIncome: "bg-gray-100",
};

interface IncomeSourceDetailSheetProps {
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

export const IncomeSourceDetailSheet = ({
  open,
  onOpenChange,
  sourceKey,
  totalAmount,
}: IncomeSourceDetailSheetProps) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");

  const payments = mockIncomeSourcePayments[sourceKey] || [];
  const sourceLabel = incomeSourceLabels[sourceKey] || sourceKey;
  const sourceColor = incomeSourceColors[sourceKey] || "bg-gray-100";

  const filteredPayments = payments.filter((p) =>
    p.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFormatted = formatLocalPrimary(totalAmount);

  const Content = () => (
    <div className="space-y-4">
      {/* Summary Header - LOCAL CURRENCY PRIMARY */}
      <Card className={`p-4 ${sourceColor} border-0`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white/60">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{sourceLabel}</p>
            <p className="text-xl font-bold text-green-700">{totalFormatted.local}</p>
            <p className="text-xs text-muted-foreground">({totalFormatted.mobi})</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {payments.length} payments
          </Badge>
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or reference..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Payments List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          Payment Records ({filteredPayments.length})
        </h3>

        <div className="space-y-2">
          {filteredPayments.map((payment) => {
            const paymentFormatted = formatLocalPrimary(payment.amount);
            return (
              <Card key={payment.id} className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={payment.memberAvatar} />
                    <AvatarFallback className="text-sm">
                      {payment.memberName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{payment.memberName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(payment.paymentDate, "MMM d, yyyy")}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="truncate">{payment.reference}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm text-green-600">
                      +{paymentFormatted.local}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ({paymentFormatted.mobi})
                    </p>
                    <Badge
                      className={`text-xs ${
                        payment.status === "completed" 
                          ? "bg-green-500/10 text-green-600" 
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {payment.status === "completed" ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <Card className="p-8 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">No Payments Found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query.
          </p>
        </Card>
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
