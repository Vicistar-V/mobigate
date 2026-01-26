import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerClose,
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
import { useIsMobile } from "@/hooks/use-mobile";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import {
  X,
  Coins,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Gift,
  Landmark,
} from "lucide-react";

interface MemberContributionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: ExecutiveMember;
}

// Mock contribution data
const mockContributions = [
  {
    id: "1",
    type: "Monthly Dues",
    amount: 5000,
    date: "2024-01-15",
    status: "completed",
    reference: "TXN-001234",
  },
  {
    id: "2",
    type: "Special Levy",
    amount: 25000,
    date: "2024-01-10",
    status: "completed",
    reference: "TXN-001198",
  },
  {
    id: "3",
    type: "Building Fund",
    amount: 50000,
    date: "2023-12-20",
    status: "completed",
    reference: "TXN-001156",
  },
  {
    id: "4",
    type: "Monthly Dues",
    amount: 5000,
    date: "2023-12-15",
    status: "completed",
    reference: "TXN-001123",
  },
  {
    id: "5",
    type: "Event Donation",
    amount: 15000,
    date: "2023-11-25",
    status: "completed",
    reference: "TXN-001089",
  },
  {
    id: "6",
    type: "Monthly Dues",
    amount: 5000,
    date: "2024-02-15",
    status: "pending",
    reference: "TXN-001278",
  },
];

const contributionStats = {
  totalContributed: 105000,
  thisYear: 85000,
  pendingAmount: 5000,
  contributionStreak: 12, // months
};

export function MemberContributionsSheet({
  open,
  onOpenChange,
  member,
}: MemberContributionsSheetProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("all");

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getTypeIcon = (type: string) => {
    if (type.includes("Dues")) return <Coins className="h-4 w-4 text-primary" />;
    if (type.includes("Levy")) return <Landmark className="h-4 w-4 text-blue-500" />;
    if (type.includes("Donation")) return <Gift className="h-4 w-4 text-pink-500" />;
    return <DollarSign className="h-4 w-4 text-green-500" />;
  };

  const filteredContributions = activeTab === "all" 
    ? mockContributions 
    : mockContributions.filter(c => c.status === activeTab);

  const content = (
    <div className="flex flex-col h-full">
      {/* Member Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
        <Avatar className="h-12 w-12">
          <AvatarImage src={member.imageUrl} alt={member.name} />
          <AvatarFallback className="text-lg">{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{member.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{member.position}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <p className="font-bold text-base">{formatMobiAmount(contributionStats.totalContributed)}</p>
            <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(contributionStats.totalContributed, "NGN")}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">This Year</span>
            </div>
            <p className="font-bold text-base">{formatMobiAmount(contributionStats.thisYear)}</p>
            <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(contributionStats.thisYear, "NGN")}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <p className="font-bold text-base">{formatMobiAmount(contributionStats.pendingAmount)}</p>
            <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(contributionStats.pendingAmount, "NGN")}</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
            <p className="font-bold text-base">{contributionStats.contributionStreak} months</p>
            <p className="text-xs text-muted-foreground">Consecutive payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 px-4">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 mt-3 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-3 pb-4">
              {filteredContributions.map((contribution) => (
                <Card key={contribution.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex flex-col gap-2">
                      {/* Top row: Type and Amount */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {getTypeIcon(contribution.type)}
                          <span className="font-medium text-sm truncate">{contribution.type}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-sm">{formatMobiAmount(contribution.amount)}</p>
                          <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(contribution.amount, "NGN")}</p>
                        </div>
                      </div>
                      
                      {/* Bottom row: Date, Ref, Status */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(contribution.date).toLocaleDateString()}
                        </span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="truncate">{contribution.reference}</span>
                        <Badge 
                          variant={contribution.status === "completed" ? "secondary" : "outline"} 
                          className="ml-auto text-xs px-2 py-0.5 flex items-center gap-1"
                        >
                          {getStatusIcon(contribution.status)}
                          {contribution.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredContributions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Coins className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No contributions found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] h-[92vh] flex flex-col">
          <DrawerHeader className="shrink-0 pb-0 relative">
            <DrawerTitle className="text-lg font-semibold flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Member Contributions
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-hidden">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="shrink-0 p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Member Contributions
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
