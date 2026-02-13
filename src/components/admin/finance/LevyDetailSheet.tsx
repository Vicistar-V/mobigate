import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Download,
  Bell,
  Clock,
  TrendingUp,
  AlertTriangle,
  Globe
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays } from "date-fns";
import { DuesAndLevies, getObligationStatusColor } from "@/data/financialManagementData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { MobiExplainerTooltip } from "@/components/common/MobiExplainerTooltip";

interface MemberPaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  amount: number;
  paidAt?: Date;
  status: 'paid' | 'unpaid' | 'partial' | 'overdue';
  reference?: string;
}

// Mock payment records
const generateMockPayments = (obligation: DuesAndLevies): MemberPaymentRecord[] => {
  const members = [
    { name: "Chief Adebayo Okonkwo", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Dr. Amina Bello", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Engr. Michael Eze", avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
    { name: "Mrs. Grace Nnamdi", avatar: "https://randomuser.me/api/portraits/women/28.jpg" },
    { name: "Barr. Samuel Okoro", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Mrs. Ngozi Ibe", avatar: "https://randomuser.me/api/portraits/women/35.jpg" },
    { name: "Dr. Chukwuemeka Nwosu", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
    { name: "Chief Mrs. Adaeze Obi", avatar: "https://randomuser.me/api/portraits/women/55.jpg" },
  ];

  return members.map((member, index) => {
    const isPaid = index < obligation.paidCount;
    const isOverdue = !isPaid && new Date() > obligation.dueDate;
    
    return {
      id: `payment-${index}`,
      memberId: `member-${index}`,
      memberName: member.name,
      memberAvatar: member.avatar,
      amount: obligation.amount,
      paidAt: isPaid ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
      status: isPaid ? 'paid' : isOverdue ? 'overdue' : 'unpaid',
      reference: isPaid ? `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : undefined
    };
  });
};

interface LevyDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  levy: DuesAndLevies | null;
}

export function LevyDetailSheet({
  open,
  onOpenChange,
  levy
}: LevyDetailSheetProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("paid");

  if (!levy) return null;

  const payments = generateMockPayments(levy);
  const paidPayments = payments.filter(p => p.status === 'paid');
  const unpaidPayments = payments.filter(p => p.status !== 'paid');
  const progressPercentage = Math.round((levy.totalCollected / levy.totalExpected) * 100);
  const daysUntilDue = differenceInDays(levy.dueDate, new Date());

  const handleSendReminder = () => {
    toast({
      title: "Reminders Sent",
      description: `Payment reminders sent to ${unpaidPayments.length} members.`
    });
  };

  const handleExportCSV = () => {
    toast({
      title: "Export Started",
      description: "Payment records are being exported to CSV."
    });
  };

  const PaymentCard = ({ payment }: { payment: MemberPaymentRecord }) => (
    <Card className={`${payment.status === 'overdue' ? 'border-red-500/30 bg-red-500/5' : ''}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={payment.memberAvatar} alt={payment.memberName} />
            <AvatarFallback>
              {payment.memberName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{payment.memberName}</p>
            {payment.status === 'paid' ? (
              <p className="text-xs text-muted-foreground">
                Paid {payment.paidAt && format(payment.paidAt, "MMM d, yyyy")}
              </p>
            ) : (
              <p className="text-xs text-red-600">
                {payment.status === 'overdue' ? 'Overdue' : 'Not paid'}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className={`text-sm font-bold ${
              payment.status === 'paid' ? 'text-green-600' : 'text-muted-foreground'
            }`}>
              {formatLocalAmount(payment.amount, "NGN")}
            </p>
            <p className="text-xs text-muted-foreground">
              ({formatMobiAmount(payment.amount)})
            </p>
            {payment.reference && (
              <p className="text-xs text-muted-foreground">{payment.reference}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const content = (
    <div className="space-y-4">
      {/* Levy Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="font-semibold text-base">{levy.name}</h3>
              <p className="text-sm text-muted-foreground">{levy.description}</p>
            </div>
            <Badge className={getObligationStatusColor(levy.status)}>
              {levy.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">{formatLocalAmount(levy.amount, "NGN")}</span>
                <span className="text-xs text-muted-foreground">/member</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(levy.dueDate, "MMM d, yyyy")}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Globe className="h-3 w-3" />
            <span>Mobi equivalent: {formatMobiAmount(levy.amount)}/member</span>
            <MobiExplainerTooltip size="sm" />
          </div>

          {daysUntilDue > 0 ? (
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {daysUntilDue} days until deadline
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {Math.abs(daysUntilDue)} days overdue
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Progress Stats */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Collection Progress</span>
            <span className="text-sm font-bold">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-green-500/10 rounded-lg">
              <p className="text-lg font-bold text-green-600">
                {formatLocalAmount(levy.totalCollected, "NGN")}
              </p>
              <p className="text-xs text-muted-foreground">Collected</p>
              <p className="text-xs text-green-600/70">
                ({formatMobiAmount(levy.totalCollected)})
              </p>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold">
                {formatLocalAmount(levy.totalExpected, "NGN")}
              </p>
              <p className="text-xs text-muted-foreground">Target</p>
              <p className="text-xs text-muted-foreground">
                ({formatMobiAmount(levy.totalExpected)})
              </p>
            </div>
          </div>

          <div className="flex justify-between text-sm pt-2">
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              {levy.paidCount} paid
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <XCircle className="h-4 w-4" />
              {levy.totalMembers - levy.paidCount} unpaid
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleSendReminder}
        >
          <Bell className="h-4 w-4 mr-1" />
          Send Reminders
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleExportCSV}
        >
          <Download className="h-4 w-4 mr-1" />
          Export CSV
        </Button>
      </div>

      <Separator />

      {/* Payment Records */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="paid" className="text-sm">
            Paid ({paidPayments.length})
          </TabsTrigger>
          <TabsTrigger value="unpaid" className="text-sm">
            Unpaid ({unpaidPayments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paid" className="space-y-2 mt-3">
          {paidPayments.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">No payments received yet.</p>
              </CardContent>
            </Card>
          ) : (
            paidPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="unpaid" className="space-y-2 mt-3">
          {unpaidPayments.length === 0 ? (
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-700">All members have paid!</p>
              </CardContent>
            </Card>
          ) : (
            unpaidPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b pb-3">
            <DrawerTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Levy Details
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            {content}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="pb-3">
          <SheetTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Levy Details
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] pr-4">
          {content}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
