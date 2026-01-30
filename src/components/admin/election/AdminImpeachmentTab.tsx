import { useState } from "react";
import {
  Gavel,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ChevronRight,
  ArrowLeft,
  Vote,
  User,
  Shield,
  FileText,
  AlertCircle,
  TrendingUp,
  Bell,
  Timer,
  Eye,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays, addDays } from "date-fns";
import { cn } from "@/lib/utils";

// Constants
const IMPEACHMENT_VALIDITY_DAYS = 30;
const NOTIFICATION_THRESHOLD_PERCENT = 25;
const SUCCESS_THRESHOLD_MIN = 85;
const SUCCESS_THRESHOLD_MAX = 100;

// Impeachment process statuses
type ImpeachmentStatus = "petition" | "voting" | "successful" | "failed" | "withdrawn" | "expired";

interface ImpeachmentProcess {
  id: string;
  officerId: string;
  officerName: string;
  officerPosition: string;
  officerAvatar?: string;
  initiatedBy: string;
  initiatorName: string; // Full name of the initiator
  supportersCount: number; // Number of members who signed the petition
  initiatedAt: Date;
  reason: string;
  status: ImpeachmentStatus;
  totalEligibleVoters: number;
  votesFor: number;
  votesAgainst: number;
  votingStartedAt?: Date;
  expiresAt: Date; // 30 days from initiation
  requiredThreshold: number; // 85-100%
  completedAt?: Date;
  isNotificationActive: boolean; // True when votes >= 25%
}

interface Officer {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  tenureStart: Date;
  isImpeachable: boolean;
}

// Calculate days remaining
const getDaysRemaining = (expiresAt: Date): number => {
  return Math.max(0, differenceInDays(expiresAt, new Date()));
};

// Check if notification threshold is met
const isNotificationThresholdMet = (votesFor: number, totalEligibleVoters: number): boolean => {
  return (votesFor / totalEligibleVoters) * 100 >= NOTIFICATION_THRESHOLD_PERCENT;
};

// Mock data
const mockOfficers: Officer[] = [
  { id: "off-1", name: "DR. MARK ANTHONY ONWUDINJO", position: "President General", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
  { id: "off-2", name: "Mrs. Chidinma Adaeze Nwosu", position: "Vice President", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
  { id: "off-3", name: "Barr. Ngozi Okonkwo", position: "Secretary General", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
  { id: "off-4", name: "Mr. Emeka Chukwuemeka", position: "Assistant Secretary", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
  { id: "off-5", name: "Chief Ikenna Uche", position: "Treasurer", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
  { id: "off-6", name: "Mr. Obinna Nnamdi", position: "PRO", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
];

const mockImpeachments: ImpeachmentProcess[] = [
  {
    id: "imp-1",
    officerId: "off-5",
    officerName: "Chief Ikenna Uche",
    officerPosition: "Treasurer",
    officerAvatar: "/placeholder.svg",
    initiatedBy: "Community Members",
    initiatorName: "Mr. John Obi",
    supportersCount: 128,
    initiatedAt: new Date("2025-01-15"),
    reason: "Misappropriation of community funds and failure to present financial reports for 6 consecutive months.",
    status: "voting",
    totalEligibleVoters: 250,
    votesFor: 180,
    votesAgainst: 25,
    votingStartedAt: new Date("2025-01-20"),
    expiresAt: addDays(new Date("2025-01-15"), 30),
    requiredThreshold: 85,
    isNotificationActive: true, // 180/250 = 72% > 25%
  },
  {
    id: "imp-2",
    officerId: "off-6",
    officerName: "Mr. Obinna Nnamdi",
    officerPosition: "PRO",
    officerAvatar: "/placeholder.svg",
    initiatedBy: "Executive Committee",
    initiatorName: "Dr. Chukwudi Eze",
    supportersCount: 95,
    initiatedAt: new Date("2024-11-10"),
    reason: "Gross misconduct and unauthorized statements to the press damaging community reputation.",
    status: "expired",
    totalEligibleVoters: 248,
    votesFor: 150,
    votesAgainst: 80,
    expiresAt: addDays(new Date("2024-11-10"), 30),
    requiredThreshold: 85,
    completedAt: new Date("2024-12-10"),
    isNotificationActive: true,
  },
  {
    id: "imp-3",
    officerId: "off-4",
    officerName: "Mr. Emeka Chukwuemeka",
    officerPosition: "Assistant Secretary",
    officerAvatar: "/placeholder.svg",
    initiatedBy: "Members Petition",
    initiatorName: "Chief Adaeze Nwachukwu",
    supportersCount: 185,
    initiatedAt: new Date("2024-08-15"),
    reason: "Dereliction of duties and absence from official meetings for over 3 months.",
    status: "successful",
    totalEligibleVoters: 240,
    votesFor: 220,
    votesAgainst: 15,
    expiresAt: addDays(new Date("2024-08-15"), 30),
    requiredThreshold: 85,
    completedAt: new Date("2024-09-10"),
    isNotificationActive: true,
  },
  {
    id: "imp-4",
    officerId: "off-3",
    officerName: "Barr. Ngozi Okonkwo",
    officerPosition: "Secretary General",
    officerAvatar: "/placeholder.svg",
    initiatedBy: "Anonymous Petition",
    initiatorName: "Mr. Samuel Okoro",
    supportersCount: 42,
    initiatedAt: new Date("2025-01-25"),
    reason: "Alleged conflict of interest in community legal matters and unauthorized legal representation.",
    status: "voting",
    totalEligibleVoters: 250,
    votesFor: 45,
    votesAgainst: 12,
    votingStartedAt: new Date("2025-01-26"),
    expiresAt: addDays(new Date("2025-01-25"), 30),
    requiredThreshold: 85,
    isNotificationActive: false, // 45/250 = 18% < 25%
  },
];

const getStatusColor = (status: ImpeachmentStatus) => {
  switch (status) {
    case "petition":
      return "bg-amber-500";
    case "voting":
      return "bg-blue-500";
    case "successful":
      return "bg-red-500";
    case "failed":
      return "bg-muted text-muted-foreground";
    case "withdrawn":
      return "bg-gray-400";
    case "expired":
      return "bg-orange-500";
    default:
      return "bg-muted";
  }
};

const getStatusLabel = (status: ImpeachmentStatus) => {
  switch (status) {
    case "petition":
      return "Petition Stage";
    case "voting":
      return "Voting Active";
    case "successful":
      return "Impeached";
    case "failed":
      return "Failed";
    case "withdrawn":
      return "Withdrawn";
    case "expired":
      return "Expired/Aborted";
    default:
      return status;
  }
};

// Stats Card Component - Now interactive/clickable
const StatCard = ({
  icon,
  value,
  label,
  color,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
}) => (
  <Card 
    className={cn(
      "border-0 cursor-pointer transition-all active:scale-95",
      color,
      isActive && "ring-2 ring-primary ring-offset-1"
    )}
    onClick={onClick}
  >
    <CardContent className="p-2.5 text-center">
      <div className="flex flex-col items-center gap-0.5">
        {icon}
        <span className="text-lg font-bold leading-tight">{value}</span>
        <span className="text-xs text-muted-foreground leading-tight">{label}</span>
      </div>
    </CardContent>
  </Card>
);

// Countdown Timer Component
const CountdownBadge = ({ expiresAt, status }: { expiresAt: Date; status: ImpeachmentStatus }) => {
  const daysRemaining = getDaysRemaining(expiresAt);
  const isActive = status === "voting" || status === "petition";
  
  if (!isActive) return null;
  
  const isUrgent = daysRemaining <= 7;
  const isCritical = daysRemaining <= 3;
  
  return (
    <div className={cn(
      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
      isCritical ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" :
      isUrgent ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" :
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
    )}>
      <Timer className="h-3 w-3" />
      <span>{daysRemaining}d left</span>
    </div>
  );
};

// Notification Indicator Component
const NotificationIndicator = ({ isActive, percentage }: { isActive: boolean; percentage: number }) => {
  if (!isActive) return null;
  
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
      <Bell className="h-3 w-3 animate-pulse" />
      <span>Notifying Members</span>
    </div>
  );
};

export function AdminImpeachmentTab() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statsFilter, setStatsFilter] = useState<"all" | "active" | "impeached" | "expired">("all");
  const [showInitiateDrawer, setShowInitiateDrawer] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [impeachmentReason, setImpeachmentReason] = useState("");
  const [selectedImpeachment, setSelectedImpeachment] = useState<ImpeachmentProcess | null>(null);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [step, setStep] = useState<"select" | "reason" | "confirm">("select");

  // Stats
  const stats = {
    total: mockImpeachments.length,
    active: mockImpeachments.filter((i) => i.status === "voting" || i.status === "petition").length,
    successful: mockImpeachments.filter((i) => i.status === "successful").length,
    expired: mockImpeachments.filter((i) => i.status === "expired" || i.status === "failed").length,
  };

  // Filtered impeachments based on stats filter
  const filteredImpeachments = mockImpeachments.filter((imp) => {
    const matchesSearch = imp.officerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply stats filter
    let matchesStatsFilter = true;
    if (statsFilter === "active") {
      matchesStatsFilter = imp.status === "voting" || imp.status === "petition";
    } else if (statsFilter === "impeached") {
      matchesStatsFilter = imp.status === "successful";
    } else if (statsFilter === "expired") {
      matchesStatsFilter = imp.status === "expired" || imp.status === "failed";
    }
    
    return matchesSearch && matchesStatsFilter;
  });

  // Handle stats filter toggle
  const handleStatsFilterClick = (filter: "all" | "active" | "impeached" | "expired") => {
    setStatsFilter(prev => prev === filter ? "all" : filter);
  };

  const handleSelectOfficer = (officer: Officer) => {
    setSelectedOfficer(officer);
    setStep("reason");
  };

  const handleInitiateImpeachment = () => {
    if (!selectedOfficer || !impeachmentReason.trim()) return;
    
    toast({
      title: "Impeachment Process Initiated",
      description: `Impeachment petition against ${selectedOfficer.name} has been submitted. Valid for 30 days.`,
    });
    
    setShowInitiateDrawer(false);
    setSelectedOfficer(null);
    setImpeachmentReason("");
    setStep("select");
  };

  const calculateProgress = (imp: ImpeachmentProcess) => {
    if (imp.totalEligibleVoters === 0) return 0;
    return (imp.votesFor / imp.totalEligibleVoters) * 100;
  };

  const renderInitiateOfficerSelection = () => (
    <div className="space-y-4 px-4 pb-4">
      <p className="text-sm text-muted-foreground">
        Select an officer to initiate impeachment proceedings against.
      </p>

      {/* 30-Day Validity Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Timer className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs text-blue-700 dark:text-blue-400">
              <p className="font-semibold">30-Day Validity Period</p>
              <p className="mt-0.5">
                Impeachment process expires after 30 days if the required 85-100% votes are not achieved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700 dark:text-red-400">
              <strong>Warning:</strong> Impeachment is a serious process. False or malicious allegations may result in disciplinary action.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {mockOfficers.map((officer) => (
          <Card
            key={officer.id}
            className="cursor-pointer hover:shadow-md active:scale-[0.99] transition-all hover:border-red-300"
            onClick={() => handleSelectOfficer(officer)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarImage src={officer.avatar} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-tight">{officer.name}</p>
                  <p className="text-xs text-muted-foreground">{officer.position}</p>
                  <p className="text-xs text-muted-foreground">
                    Since: {format(officer.tenureStart, "MMM yyyy")}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReasonForm = () => (
    <div className="space-y-4 px-4 pb-4">
      <Button variant="ghost" size="sm" onClick={() => setStep("select")} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      {/* Selected Officer */}
      <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={selectedOfficer?.avatar} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight">{selectedOfficer?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedOfficer?.position}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reason Form */}
      <div className="space-y-2">
        <Label htmlFor="reason" className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4" />
          Grounds for Impeachment *
        </Label>
        <Textarea
          id="reason"
          placeholder="Provide detailed reasons for this impeachment request. Be specific about the misconduct, dates, and evidence..."
          value={impeachmentReason}
          onChange={(e) => setImpeachmentReason(e.target.value)}
          rows={5}
          className="resize-none text-base"
          style={{ touchAction: 'manipulation' }}
        />
        <p className="text-xs text-muted-foreground">
          Minimum 50 characters required. <span className={impeachmentReason.length >= 50 ? "text-green-600 font-medium" : ""}>{impeachmentReason.length}/50</span>
        </p>
      </div>

      {/* Threshold & Validity Info */}
      <div className="space-y-2">
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-700 dark:text-amber-400">
                <p className="font-semibold">Required Threshold: 85% - 100%</p>
                <p className="mt-0.5">
                  At least 85% of all active members must vote in favor for the impeachment to succeed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Bell className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-700 dark:text-blue-400">
                <p className="font-semibold">Member Notification at 25%</p>
                <p className="mt-0.5">
                  Once votes reach 25%, all valid members will be notified and can view the vote count on their dashboards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderImpeachmentCard = (imp: ImpeachmentProcess) => {
    const progress = calculateProgress(imp);
    const isActive = imp.status === "voting" || imp.status === "petition";
    const daysRemaining = getDaysRemaining(imp.expiresAt);
    const showNotification = isNotificationThresholdMet(imp.votesFor, imp.totalEligibleVoters);
    
    return (
      <Card
        key={imp.id}
        className={cn(
          "cursor-pointer hover:shadow-md active:scale-[0.99] transition-all",
          imp.status === "successful" && "border-red-200 bg-red-50/30 dark:bg-red-950/10",
          imp.status === "expired" && "border-orange-200 bg-orange-50/30 dark:bg-orange-950/10"
        )}
        onClick={() => {
          setSelectedImpeachment(imp);
          setShowDetailsSheet(true);
        }}
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarImage src={imp.officerAvatar} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="min-w-0">
                  <p className="font-medium text-sm leading-tight">{imp.officerName}</p>
                  <p className="text-xs text-muted-foreground">{imp.officerPosition}</p>
                </div>
                <Badge className={cn("text-xs text-white shrink-0", getStatusColor(imp.status))}>
                  {getStatusLabel(imp.status)}
                </Badge>
              </div>
              
              {/* Reason */}
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {imp.reason}
              </p>

              {/* Progress for active impeachments */}
              {isActive && (
                <div className="space-y-1.5 mb-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Votes: <span className="font-medium text-foreground">{imp.votesFor}</span>/{imp.totalEligibleVoters}
                    </span>
                    <span className={cn(
                      "font-medium",
                      progress >= imp.requiredThreshold ? "text-green-600" : "text-amber-600"
                    )}>
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-2" />
                    {/* 25% marker */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-primary/50"
                      style={{ left: '25%' }}
                    />
                    {/* 85% marker */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-green-500"
                      style={{ left: '85%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>25% notify</span>
                    <span>85% required</span>
                  </div>
                </div>
              )}

              {/* Status Indicators Row */}
              <div className="flex flex-wrap items-center gap-2">
                {isActive && (
                  <CountdownBadge expiresAt={imp.expiresAt} status={imp.status} />
                )}
                {isActive && showNotification && (
                  <NotificationIndicator isActive={true} percentage={progress} />
                )}
                {!isActive && (
                  <span className="text-xs text-muted-foreground">
                    {imp.completedAt ? format(imp.completedAt, "MMM d, yyyy") : format(imp.initiatedAt, "MMM d, yyyy")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const InitiateDrawerContent = () => (
    <>
      <DrawerHeader className="shrink-0 border-b px-4">
        <DrawerTitle className="flex items-center gap-2 text-red-600">
          <Gavel className="h-5 w-5" />
          {step === "select" ? "Initiate Impeachment" : "Grounds for Impeachment"}
        </DrawerTitle>
      </DrawerHeader>
      <div className="flex-1 overflow-y-auto touch-auto overscroll-contain">
        {step === "select" && renderInitiateOfficerSelection()}
        {step === "reason" && renderReasonForm()}
      </div>
      <div className="shrink-0 flex gap-2 p-4 border-t bg-background">
        <Button
          variant="outline"
          className="flex-1 h-11"
          onClick={() => {
            setShowInitiateDrawer(false);
            setSelectedOfficer(null);
            setImpeachmentReason("");
            setStep("select");
          }}
        >
          Cancel
        </Button>
        {step === "reason" && (
          <Button
            variant="destructive"
            className="flex-1 h-11"
            onClick={() => setShowConfirmDialog(true)}
            disabled={impeachmentReason.length < 50}
          >
            <Gavel className="h-4 w-4 mr-2" />
            Submit Petition
          </Button>
        )}
      </div>
    </>
  );

  const DetailsSheetContent = () => {
    if (!selectedImpeachment) return null;
    const progress = calculateProgress(selectedImpeachment);
    const daysRemaining = getDaysRemaining(selectedImpeachment.expiresAt);
    const isActive = selectedImpeachment.status === "voting" || selectedImpeachment.status === "petition";
    const showNotification = isNotificationThresholdMet(selectedImpeachment.votesFor, selectedImpeachment.totalEligibleVoters);
    
    return (
      <>
        <DrawerHeader className="shrink-0 border-b px-4">
          <DrawerTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-red-600" />
            Impeachment Details
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain p-4 space-y-4">
          {/* Officer Info */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 shrink-0">
                  <AvatarImage src={selectedImpeachment.officerAvatar} />
                  <AvatarFallback>
                    <User className="h-7 w-7" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{selectedImpeachment.officerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedImpeachment.officerPosition}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <Badge className={cn("text-xs text-white", getStatusColor(selectedImpeachment.status))}>
                      {getStatusLabel(selectedImpeachment.status)}
                    </Badge>
                    {isActive && (
                      <CountdownBadge expiresAt={selectedImpeachment.expiresAt} status={selectedImpeachment.status} />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Alert */}
          {isActive && showNotification && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Bell className="h-4 w-4 text-primary mt-0.5 shrink-0 animate-pulse" />
                  <div className="text-xs text-primary">
                    <p className="font-semibold">🔔 Members Are Being Notified</p>
                    <p className="mt-0.5">
                      Vote threshold has exceeded 25%. All valid members can now see this impeachment process and the current vote count on their dashboards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voting Progress */}
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Vote className="h-4 w-4" />
                Voting Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-semibold">{progress.toFixed(1)}%</span>
                </div>
                <div className="relative">
                  <Progress value={progress} className="h-3" />
                  {/* 25% notification marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-primary"
                    style={{ left: '25%' }}
                    title="25% - Notification Threshold"
                  />
                  {/* 85% success marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-green-500"
                    style={{ left: '85%' }}
                    title="85% - Success Threshold"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    25% notify
                  </span>
                  <span>Required: {selectedImpeachment.requiredThreshold}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <p className="text-xl font-bold text-green-600">{selectedImpeachment.votesFor}</p>
                  <p className="text-xs text-muted-foreground">For</p>
                </div>
                <div className="p-2.5 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <p className="text-xl font-bold text-red-600">{selectedImpeachment.votesAgainst}</p>
                  <p className="text-xs text-muted-foreground">Against</p>
                </div>
                <div className="p-2.5 bg-muted rounded-lg">
                  <p className="text-xl font-bold">{selectedImpeachment.totalEligibleVoters - selectedImpeachment.votesFor - selectedImpeachment.votesAgainst}</p>
                  <p className="text-xs text-muted-foreground">Neutral</p>
                </div>
              </div>

              {/* Member Visibility Note */}
              {isActive && (
                <Card className="border-muted bg-muted/30">
                  <CardContent className="p-2.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Eye className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {showNotification 
                          ? "Vote counts are visible to all members on their dashboards"
                          : `Vote counts will be visible to members once 25% threshold is reached (${Math.ceil(selectedImpeachment.totalEligibleVoters * 0.25)} votes)`
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Reason */}
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Grounds for Impeachment
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedImpeachment.reason}
              </p>
              
              {/* Initiator & Supporters Info */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Initiated by:
                  </span>
                  <span className="font-semibold text-foreground">
                    {selectedImpeachment.initiatorName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Supported by:
                  </span>
                  <span className="font-semibold text-primary">
                    {selectedImpeachment.supportersCount}/{selectedImpeachment.totalEligibleVoters} Members
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline & Validity */}
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline & Validity
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Initiated</span>
                <span className="font-medium">{format(selectedImpeachment.initiatedAt, "MMM d, yyyy")}</span>
              </div>
              {selectedImpeachment.votingStartedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voting Started</span>
                  <span className="font-medium">{format(selectedImpeachment.votingStartedAt, "MMM d, yyyy")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires</span>
                <span className={cn(
                  "font-medium",
                  isActive && daysRemaining <= 7 ? "text-red-600" : ""
                )}>
                  {format(selectedImpeachment.expiresAt, "MMM d, yyyy")}
                </span>
              </div>
              {isActive && (
                <div className="flex justify-between items-center pt-1 border-t">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Timer className="h-3.5 w-3.5" />
                    Time Remaining
                  </span>
                  <span className={cn(
                    "font-bold",
                    daysRemaining <= 3 ? "text-red-600" :
                    daysRemaining <= 7 ? "text-amber-600" :
                    "text-blue-600"
                  )}>
                    {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {selectedImpeachment.completedAt && (
                <div className="flex justify-between pt-1 border-t">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">{format(selectedImpeachment.completedAt, "MMM d, yyyy")}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Consequences Notes */}
          {selectedImpeachment.status === "successful" && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <div className="text-xs text-red-700 dark:text-red-400">
                    <p className="font-semibold">Impeachment Successful</p>
                    <p className="mt-0.5">
                      The officer has been removed from position. Their admin credentials have been invalidated 
                      and the office is now declared vacant for supplementary election.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedImpeachment.status === "expired" && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Timer className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                  <div className="text-xs text-orange-700 dark:text-orange-400">
                    <p className="font-semibold">Process Expired / Aborted</p>
                    <p className="mt-0.5">
                      The 30-day validity period elapsed without reaching the required 85% vote threshold. 
                      The impeachment process has been automatically aborted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="shrink-0 p-4 border-t bg-background">
          <Button
            variant="outline"
            className="w-full h-11"
            onClick={() => setShowDetailsSheet(false)}
          >
            Close
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Initiate Button */}
      <Button
        onClick={() => setShowInitiateDrawer(true)}
        className="w-full h-12 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold"
      >
        <Gavel className="h-5 w-5 mr-2" />
        Start Impeachment Process
      </Button>

      {/* Info Banner */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Impeachment requires <strong>85% to 100%</strong> votes from active members to succeed.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Timer className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <strong>30-day limit:</strong> Process is automatically aborted if threshold not reached.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Bell className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <strong>25% notification:</strong> Members are notified and can view votes on their dashboards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row - Interactive Filters */}
      <div className="grid grid-cols-4 gap-1.5">
        <StatCard
          icon={<Users className="h-3.5 w-3.5 text-blue-600" />}
          value={stats.total}
          label="Total"
          color="bg-blue-500/10"
          isActive={statsFilter === "all"}
          onClick={() => handleStatsFilterClick("all")}
        />
        <StatCard
          icon={<Clock className="h-3.5 w-3.5 text-amber-600" />}
          value={stats.active}
          label="Active"
          color="bg-amber-500/10"
          isActive={statsFilter === "active"}
          onClick={() => handleStatsFilterClick("active")}
        />
        <StatCard
          icon={<CheckCircle2 className="h-3.5 w-3.5 text-red-600" />}
          value={stats.successful}
          label="Impeached"
          color="bg-red-500/10"
          isActive={statsFilter === "impeached"}
          onClick={() => handleStatsFilterClick("impeached")}
        />
        <StatCard
          icon={<XCircle className="h-3.5 w-3.5 text-orange-600" />}
          value={stats.expired}
          label="Expired"
          color="bg-orange-500/10"
          isActive={statsFilter === "expired"}
          onClick={() => handleStatsFilterClick("expired")}
        />
      </div>

      {/* Active Filter Indicator */}
      {statsFilter !== "all" && (
        <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
          <span className="text-xs text-muted-foreground">
            Showing: <span className="font-medium text-foreground capitalize">{statsFilter}</span> ({filteredImpeachments.length})
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs px-2"
            onClick={() => setStatsFilter("all")}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search impeachments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 text-base"
          style={{ touchAction: 'manipulation' }}
        />
      </div>

      {/* Impeachment List */}
      <div className="space-y-3">
        {filteredImpeachments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <Gavel className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No impeachment processes found
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredImpeachments.map(renderImpeachmentCard)
        )}
      </div>

      {/* Initiate Drawer */}
      {isMobile ? (
        <Drawer open={showInitiateDrawer} onOpenChange={setShowInitiateDrawer}>
          <DrawerContent className="max-h-[92vh] flex flex-col">
            <InitiateDrawerContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showInitiateDrawer} onOpenChange={setShowInitiateDrawer}>
          <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
            <InitiateDrawerContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Details Sheet */}
      {isMobile ? (
        <Drawer open={showDetailsSheet} onOpenChange={setShowDetailsSheet}>
          <DrawerContent className="max-h-[92vh] flex flex-col">
            <DetailsSheetContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showDetailsSheet} onOpenChange={setShowDetailsSheet}>
          <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
            <DetailsSheetContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Gavel className="h-5 w-5" />
              Confirm Impeachment Petition
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-2">
              <p>
                You are about to initiate impeachment proceedings against <strong>{selectedOfficer?.name}</strong> ({selectedOfficer?.position}).
              </p>
              <p className="text-xs">
                • This action will be visible to all community members
                <br />
                • Requires 85% approval to succeed
                <br />
                • Valid for <strong>30 days</strong> only
                <br />
                • Notifications begin at 25% votes
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              onClick={handleInitiateImpeachment}
            >
              Submit Petition
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
