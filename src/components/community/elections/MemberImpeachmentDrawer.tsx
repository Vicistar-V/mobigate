import { useState, useEffect } from "react";
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
  User,
  FileText,
  Timer,
  Bell,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Eye,
  EyeOff,
  Calendar,
  Vote,
  Shield,
  Settings,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { ImpeachmentPrivacySettings } from "./ImpeachmentPrivacySettings";
import { 
  mockImpeachmentPrivacySettings, 
  ImpeachmentPrivacySetting,
  getEffectivePrivacyValue 
} from "@/types/impeachmentPrivacySettings";

// Constants
const IMPEACHMENT_VALIDITY_DAYS = 30;
const NOTIFICATION_THRESHOLD_PERCENT = 25;
const SUCCESS_THRESHOLD_MIN = 85;

// Types
type ImpeachmentStatus = "petition" | "voting" | "successful" | "failed" | "withdrawn" | "expired";
type MemberVoteStatus = "support" | "reject" | "neutral";

interface ImpeachmentProcess {
  id: string;
  officerId: string;
  officerName: string;
  officerPosition: string;
  officerAvatar?: string;
  initiatedBy: string;
  initiatorName: string;
  supportersCount: number;
  initiatedAt: Date;
  reason: string;
  status: ImpeachmentStatus;
  totalEligibleVoters: number;
  votesFor: number;
  votesAgainst: number;
  expiresAt: Date;
  requiredThreshold: number;
  isNotificationActive: boolean;
  myVote?: MemberVoteStatus;
}

interface Officer {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  tenureStart: Date;
  isImpeachable: boolean;
}

interface MemberImpeachmentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialView?: "list" | "start";
}

// Mock data
const mockOfficers: Officer[] = [
  { id: "off-1", name: "DR. MARK ANTHONY ONWUDINJO", position: "President General", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
  { id: "off-2", name: "Mrs. Chidinma Adaeze Nwosu", position: "Vice President", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
  { id: "off-3", name: "Barr. Ngozi Okonkwo", position: "Secretary General", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
  { id: "off-4", name: "Mr. Emeka Chukwuemeka", position: "Assistant Secretary", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
  { id: "off-5", name: "Chief Ikenna Uche", position: "Treasurer", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
  { id: "off-6", name: "Mr. Obinna Nnamdi", position: "PRO", avatar: "/placeholder.svg", tenureStart: new Date("2024-01-01"), isImpeachable: true },
];

const mockActiveImpeachments: ImpeachmentProcess[] = [
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
    expiresAt: addDays(new Date("2025-01-15"), 30),
    requiredThreshold: 85,
    isNotificationActive: true,
    myVote: "neutral",
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
    expiresAt: addDays(new Date("2025-01-25"), 30),
    requiredThreshold: 85,
    isNotificationActive: false,
    myVote: "support",
  },
];

const getDaysRemaining = (expiresAt: Date): number => {
  return Math.max(0, differenceInDays(expiresAt, new Date()));
};

const getStatusLabel = (status: ImpeachmentStatus) => {
  switch (status) {
    case "petition": return "Petition Stage";
    case "voting": return "Voting Active";
    case "successful": return "Impeached";
    case "failed": return "Failed";
    case "withdrawn": return "Withdrawn";
    case "expired": return "Expired";
    default: return status;
  }
};

const getVoteStatusIcon = (vote: MemberVoteStatus) => {
  switch (vote) {
    case "support": return <ThumbsUp className="h-4 w-4 text-green-600" />;
    case "reject": return <ThumbsDown className="h-4 w-4 text-red-600" />;
    case "neutral": return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

const getVoteStatusLabel = (vote: MemberVoteStatus) => {
  switch (vote) {
    case "support": return "You Support";
    case "reject": return "You Reject";
    case "neutral": return "No Action (Neutral)";
  }
};

export function MemberImpeachmentDrawer({ open, onOpenChange, initialView = "list" }: MemberImpeachmentDrawerProps) {
  const { toast } = useToast();
  
  const [view, setView] = useState<"list" | "start" | "details">(initialView);
  const [step, setStep] = useState<"select" | "reason">("select");
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [impeachmentReason, setImpeachmentReason] = useState("");
  const [selectedImpeachment, setSelectedImpeachment] = useState<ImpeachmentProcess | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingVote, setPendingVote] = useState<MemberVoteStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVotersList, setShowVotersList] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [privacySettings] = useState<ImpeachmentPrivacySetting[]>(mockImpeachmentPrivacySettings);

  // Get effective privacy values
  const getPrivacyValue = (key: string): 'visible' | 'hidden' => {
    const setting = privacySettings.find(s => s.settingKey === key);
    return setting ? getEffectivePrivacyValue(setting) : 'visible';
  };

  const isInitiatorVisible = getPrivacyValue('initiator_visibility') === 'visible';
  const isVotersVisible = getPrivacyValue('voters_visibility') === 'visible';
  const isDatesVisible = getPrivacyValue('dates_visibility') === 'visible';
  const isStatusVisible = getPrivacyValue('status_visibility') === 'visible';

  // Sync view with initialView when drawer opens
  useEffect(() => {
    if (open) {
      setView(initialView);
    }
  }, [open, initialView]);

  // Active impeachments for members to vote on
  const activeImpeachments = mockActiveImpeachments.filter(
    imp => imp.officerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectOfficer = (officer: Officer) => {
    setSelectedOfficer(officer);
    setStep("reason");
  };

  const handleInitiateImpeachment = () => {
    if (!selectedOfficer || impeachmentReason.length < 50) return;
    
    toast({
      title: "Impeachment Petition Submitted",
      description: `Your petition against ${selectedOfficer.name} has been submitted. Valid for 30 days.`,
    });
    
    resetState();
  };

  const handleVote = (vote: MemberVoteStatus) => {
    if (!selectedImpeachment) return;
    
    toast({
      title: vote === "support" ? "Vote Recorded: Support" : vote === "reject" ? "Vote Recorded: Reject" : "Vote Cleared",
      description: `Your vote on the impeachment of ${selectedImpeachment.officerName} has been recorded.`,
    });
    
    setShowConfirmDialog(false);
    setPendingVote(null);
    setSelectedImpeachment(null);
    setView("list");
  };

  const resetState = () => {
    setView("list");
    setStep("select");
    setSelectedOfficer(null);
    setImpeachmentReason("");
    setSelectedImpeachment(null);
    setShowConfirmDialog(false);
    setPendingVote(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetState, 300);
  };

  const calculateProgress = (imp: ImpeachmentProcess) => {
    if (imp.totalEligibleVoters === 0) return 0;
    return (imp.votesFor / imp.totalEligibleVoters) * 100;
  };

  // List View - Shows active impeachments + Start button
  const renderListView = () => (
    <div className="space-y-4">
      {/* Action Buttons Row */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => setView("start")}
          className="h-12 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold"
        >
          <Gavel className="h-4 w-4 mr-2" />
          Start Process
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowPrivacySettings(true)}
          className="h-12"
        >
          <Settings className="h-4 w-4 mr-2" />
          Privacy Settings
        </Button>
      </div>

      {/* Privacy Settings Summary */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-800 dark:text-blue-300">Privacy Status</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {privacySettings.filter(s => s.memberVote === null).length} pending votes
            </Badge>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {privacySettings.map((setting) => {
              const isVisible = getEffectivePrivacyValue(setting) === 'visible';
              return (
                <div 
                  key={setting.settingId}
                  className={cn(
                    "text-center p-1.5 rounded text-[10px]",
                    isVisible 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isVisible ? <Eye className="h-3 w-3 mx-auto mb-0.5" /> : <EyeOff className="h-3 w-3 mx-auto mb-0.5" />}
                  <p className="truncate">{setting.settingName.split('/')[0].split(' ')[0]}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Impeachment requires <strong>85% to 100%</strong> votes from active members.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Timer className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>30-day limit:</strong> Process aborts if threshold not reached.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Impeachments Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Vote className="h-4 w-4 text-primary" />
          Active Impeachment Processes ({activeImpeachments.length})
        </h3>
        <p className="text-xs text-muted-foreground">
          Cast your vote: <strong>Support</strong>, <strong>Reject</strong>, or take <strong>No Action</strong> (counted as Neutral).
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search processes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 text-base"
        />
      </div>

      {/* Active Impeachments List */}
      <div className="space-y-3">
        {activeImpeachments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <Gavel className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No active impeachment processes
              </p>
            </CardContent>
          </Card>
        ) : (
          activeImpeachments.map((imp) => {
            const progress = calculateProgress(imp);
            const daysRemaining = getDaysRemaining(imp.expiresAt);
            
            return (
              <Card
                key={imp.id}
                className="cursor-pointer hover:shadow-md active:scale-[0.99] transition-all"
                onClick={() => {
                  setSelectedImpeachment(imp);
                  setView("details");
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarImage src={imp.officerAvatar} />
                      <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <p className="font-medium text-sm leading-tight">{imp.officerName}</p>
                          <p className="text-xs text-muted-foreground">{imp.officerPosition}</p>
                        </div>
                        <Badge className="bg-blue-500 text-white text-xs shrink-0">
                          {getStatusLabel(imp.status)}
                        </Badge>
                      </div>
                      
                      {/* Progress */}
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Votes: <span className="font-medium">{imp.votesFor}</span>/{imp.totalEligibleVoters}
                          </span>
                          <span className={cn("font-medium", progress >= 85 ? "text-green-600" : "text-amber-600")}>
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>

                      {/* My Vote Status & Days Remaining */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs">
                          {getVoteStatusIcon(imp.myVote || "neutral")}
                          <span className={cn(
                            "font-medium",
                            imp.myVote === "support" && "text-green-600",
                            imp.myVote === "reject" && "text-red-600",
                            (!imp.myVote || imp.myVote === "neutral") && "text-muted-foreground"
                          )}>
                            {getVoteStatusLabel(imp.myVote || "neutral")}
                          </span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-xs font-medium",
                          daysRemaining <= 3 ? "text-red-600" :
                          daysRemaining <= 7 ? "text-amber-600" :
                          "text-blue-600"
                        )}>
                          <Timer className="h-3 w-3" />
                          {daysRemaining}d left
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 self-center" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );

  // Start Impeachment View
  const renderStartView = () => (
    <div className="space-y-4">
      {step === "select" ? (
        <>
          <Button variant="ghost" size="sm" onClick={() => setView("list")} className="-ml-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <p className="text-sm text-muted-foreground">
            Select an officer to initiate impeachment proceedings against.
          </p>

          {/* 30-Day Notice */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Timer className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-700 dark:text-blue-400">
                  <p className="font-semibold">30-Day Validity Period</p>
                  <p className="mt-0.5">Process expires if 85-100% votes not achieved.</p>
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
                  <strong>Warning:</strong> False or malicious allegations may result in disciplinary action.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Officers List */}
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
                      <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
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
        </>
      ) : (
        <>
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
                  <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{selectedOfficer?.name}</p>
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
              placeholder="Provide detailed reasons for this impeachment request..."
              value={impeachmentReason}
              onChange={(e) => setImpeachmentReason(e.target.value)}
              rows={5}
              className="resize-none text-base"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 50 characters. <span className={impeachmentReason.length >= 50 ? "text-green-600 font-medium" : ""}>{impeachmentReason.length}/50</span>
            </p>
          </div>
        </>
      )}
    </div>
  );

  // Details View - View impeachment details + Vote
  const renderDetailsView = () => {
    if (!selectedImpeachment) return null;
    
    const progress = calculateProgress(selectedImpeachment);
    const daysRemaining = getDaysRemaining(selectedImpeachment.expiresAt);
    
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setView("list")} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {/* Officer Info */}
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 shrink-0">
                <AvatarImage src={selectedImpeachment.officerAvatar} />
                <AvatarFallback><User className="h-7 w-7" /></AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{selectedImpeachment.officerName}</p>
                <p className="text-sm text-muted-foreground">{selectedImpeachment.officerPosition}</p>
                <div className="flex items-center gap-2 mt-1">
                  {isStatusVisible ? (
                    <Badge className="bg-blue-500 text-white text-xs">
                      {getStatusLabel(selectedImpeachment.status)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      <Lock className="h-3 w-3 mr-1" />
                      Status Hidden
                    </Badge>
                  )}
                  {isDatesVisible ? (
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                      daysRemaining <= 3 ? "bg-red-100 text-red-700" :
                      daysRemaining <= 7 ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      <Timer className="h-3 w-3" />
                      {daysRemaining}d left
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      <EyeOff className="h-3 w-3" />
                      Timeline Hidden
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <div className="absolute top-0 bottom-0 w-0.5 bg-primary" style={{ left: '25%' }} />
                <div className="absolute top-0 bottom-0 w-0.5 bg-green-500" style={{ left: '85%' }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>25% notify</span>
                <span>Required: {selectedImpeachment.requiredThreshold}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-xl font-bold text-green-600">{selectedImpeachment.votesFor}</p>
                <p className="text-xs text-muted-foreground">Support</p>
              </div>
              <div className="p-2.5 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <p className="text-xl font-bold text-red-600">{selectedImpeachment.votesAgainst}</p>
                <p className="text-xs text-muted-foreground">Reject</p>
              </div>
              <div className="p-2.5 bg-muted rounded-lg">
                <p className="text-xl font-bold">{selectedImpeachment.totalEligibleVoters - selectedImpeachment.votesFor - selectedImpeachment.votesAgainst}</p>
                <p className="text-xs text-muted-foreground">Neutral</p>
              </div>
            </div>
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
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              {/* Initiated by - respects privacy */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Initiated by:
                </span>
                {isInitiatorVisible ? (
                  <span className="font-semibold">{selectedImpeachment.initiatorName}</span>
                ) : (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Hidden
                  </span>
                )}
              </div>
              
              {/* Supported by - respects privacy */}
              {isVotersVisible ? (
                <div 
                  className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/50 -mx-3 px-3 py-1.5 rounded-lg transition-colors"
                  onClick={() => setShowVotersList(true)}
                >
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Supported by:
                  </span>
                  <span className="font-semibold text-primary flex items-center gap-1">
                    {selectedImpeachment.supportersCount}/{selectedImpeachment.totalEligibleVoters} Members
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Voters:
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Protected by Privacy Settings
                  </span>
                </div>
              )}

              {/* Dates - respects privacy */}
              {isDatesVisible ? (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Initiated:
                    </span>
                    <span className="font-medium">{format(selectedImpeachment.initiatedAt, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Timer className="h-3.5 w-3.5" />
                      Expires:
                    </span>
                    <span className="font-medium">{format(selectedImpeachment.expiresAt, "MMM d, yyyy")}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Timeline:
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Hidden
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Current Vote */}
        <Card className={cn(
          "border-2",
          selectedImpeachment.myVote === "support" && "border-green-300 bg-green-50/50",
          selectedImpeachment.myVote === "reject" && "border-red-300 bg-red-50/50",
          (!selectedImpeachment.myVote || selectedImpeachment.myVote === "neutral") && "border-muted"
        )}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getVoteStatusIcon(selectedImpeachment.myVote || "neutral")}
                <span className="text-sm font-medium">Your Current Vote:</span>
              </div>
              <span className={cn(
                "text-sm font-semibold",
                selectedImpeachment.myVote === "support" && "text-green-600",
                selectedImpeachment.myVote === "reject" && "text-red-600",
                (!selectedImpeachment.myVote || selectedImpeachment.myVote === "neutral") && "text-muted-foreground"
              )}>
                {getVoteStatusLabel(selectedImpeachment.myVote || "neutral")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Vote Action Buttons */}
        <div className="space-y-2">
          <p className="text-xs text-center text-muted-foreground">
            Cast or change your vote below
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={selectedImpeachment.myVote === "support" ? "default" : "outline"}
              className={cn(
                "h-12 flex-col gap-1",
                selectedImpeachment.myVote === "support" ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50 hover:border-green-300"
              )}
              onClick={() => {
                setPendingVote("support");
                setShowConfirmDialog(true);
              }}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="text-xs">Support</span>
            </Button>
            <Button
              variant={selectedImpeachment.myVote === "reject" ? "default" : "outline"}
              className={cn(
                "h-12 flex-col gap-1",
                selectedImpeachment.myVote === "reject" ? "bg-red-600 hover:bg-red-700" : "hover:bg-red-50 hover:border-red-300"
              )}
              onClick={() => {
                setPendingVote("reject");
                setShowConfirmDialog(true);
              }}
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="text-xs">Reject</span>
            </Button>
            <Button
              variant={(!selectedImpeachment.myVote || selectedImpeachment.myVote === "neutral") ? "default" : "outline"}
              className={cn(
                "h-12 flex-col gap-1",
                (!selectedImpeachment.myVote || selectedImpeachment.myVote === "neutral") ? "bg-muted text-foreground" : ""
              )}
              onClick={() => {
                setPendingVote("neutral");
                setShowConfirmDialog(true);
              }}
            >
              <Minus className="h-4 w-4" />
              <span className="text-xs">Neutral</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[92vh] flex flex-col">
          <DrawerHeader className="shrink-0 border-b px-4">
            <DrawerTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-red-600" />
              {view === "list" && "Impeachment"}
              {view === "start" && (step === "select" ? "Select Officer" : "Grounds for Impeachment")}
              {view === "details" && "Impeachment Details"}
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain p-4 min-h-0">
            {view === "list" && renderListView()}
            {view === "start" && renderStartView()}
            {view === "details" && renderDetailsView()}
          </div>

          {/* Footer for Start View - Reason Step */}
          {view === "start" && step === "reason" && (
            <div className="shrink-0 flex gap-2 p-4 border-t bg-background">
              <Button variant="outline" className="flex-1 h-11" onClick={() => setStep("select")}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-11"
                onClick={handleInitiateImpeachment}
                disabled={impeachmentReason.length < 50}
              >
                <Gavel className="h-4 w-4 mr-2" />
                Submit Petition
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* Vote Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {pendingVote === "support" && <ThumbsUp className="h-5 w-5 text-green-600" />}
              {pendingVote === "reject" && <ThumbsDown className="h-5 w-5 text-red-600" />}
              {pendingVote === "neutral" && <Minus className="h-5 w-5 text-muted-foreground" />}
              Confirm Your Vote
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-2">
              <p>
                You are about to <strong>{
                  pendingVote === "support" ? "SUPPORT" :
                  pendingVote === "reject" ? "REJECT" :
                  "set No Action (NEUTRAL) on"
                }</strong> the impeachment of <strong>{selectedImpeachment?.officerName}</strong>.
              </p>
              <p className="text-xs">
                {pendingVote === "neutral" 
                  ? "Your vote will be counted as neutral and will not contribute to either side."
                  : "You can change your vote at any time while the process is active."
                }
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "w-full sm:w-auto",
                pendingVote === "support" && "bg-green-600 hover:bg-green-700",
                pendingVote === "reject" && "bg-red-600 hover:bg-red-700"
              )}
              onClick={() => handleVote(pendingVote!)}
            >
              Confirm Vote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Voters List Drawer */}
      <Drawer open={showVotersList} onOpenChange={setShowVotersList}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <DrawerHeader className="shrink-0 border-b px-4">
            <DrawerTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              All Voters
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain p-4 min-h-0">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2.5 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-lg font-bold text-green-600">{selectedImpeachment?.votesFor || 0}</p>
                <p className="text-xs text-muted-foreground">Support</p>
              </div>
              <div className="text-center p-2.5 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <p className="text-lg font-bold text-red-600">{selectedImpeachment?.votesAgainst || 0}</p>
                <p className="text-xs text-muted-foreground">Reject</p>
              </div>
              <div className="text-center p-2.5 bg-muted rounded-lg">
                <p className="text-lg font-bold">{(selectedImpeachment?.totalEligibleVoters || 0) - (selectedImpeachment?.votesFor || 0) - (selectedImpeachment?.votesAgainst || 0)}</p>
                <p className="text-xs text-muted-foreground">Neutral</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto -mx-4 px-4 touch-pan-x">
              <Badge variant="default" className="shrink-0 cursor-pointer h-8 px-4">All ({selectedImpeachment?.supportersCount || 0})</Badge>
              <Badge variant="outline" className="shrink-0 cursor-pointer h-8 px-4">Support ({selectedImpeachment?.votesFor || 0})</Badge>
              <Badge variant="outline" className="shrink-0 cursor-pointer h-8 px-4">Reject ({selectedImpeachment?.votesAgainst || 0})</Badge>
              <Badge variant="outline" className="shrink-0 cursor-pointer h-8 px-4">Neutral</Badge>
            </div>

            {/* Voters List */}
            <div className="space-y-2">
              {/* Mock voters data */}
              {[
                { id: 1, name: "Mr. John Obi", accreditation: "ACC-2025-0042", vote: "support", votedAt: "Jan 16, 2025" },
                { id: 2, name: "Mrs. Ada Nwosu", accreditation: "ACC-2025-0089", vote: "support", votedAt: "Jan 17, 2025" },
                { id: 3, name: "Chief Emeka Okonkwo", accreditation: "ACC-2025-0023", vote: "support", votedAt: "Jan 17, 2025" },
                { id: 4, name: "Dr. Chidi Eze", accreditation: "ACC-2025-0101", vote: "reject", votedAt: "Jan 18, 2025" },
                { id: 5, name: "Mrs. Ngozi Udeh", accreditation: "ACC-2025-0056", vote: "support", votedAt: "Jan 18, 2025" },
                { id: 6, name: "Mr. Obinna Nnamdi", accreditation: "ACC-2025-0078", vote: "neutral", votedAt: null },
                { id: 7, name: "Barr. Chukwuma Ike", accreditation: "ACC-2025-0034", vote: "support", votedAt: "Jan 19, 2025" },
                { id: 8, name: "Mrs. Adaeze Okoro", accreditation: "ACC-2025-0112", vote: "support", votedAt: "Jan 20, 2025" },
              ].map((voter) => (
                <Card key={voter.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="text-xs">
                          {voter.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{voter.name}</p>
                        <p className="text-xs text-muted-foreground">{voter.accreditation}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            voter.vote === "support" && "bg-green-50 text-green-600 border-green-200",
                            voter.vote === "reject" && "bg-red-50 text-red-600 border-red-200",
                            voter.vote === "neutral" && "bg-muted text-muted-foreground"
                          )}
                        >
                          {voter.vote === "support" ? "Support" : voter.vote === "reject" ? "Reject" : "Neutral"}
                        </Badge>
                        {voter.votedAt && (
                          <p className="text-xs text-muted-foreground mt-1">{voter.votedAt}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="shrink-0 px-4 py-4 border-t bg-background">
            <Button variant="outline" className="w-full h-11" onClick={() => setShowVotersList(false)}>
              Close
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Privacy Settings Drawer */}
      <ImpeachmentPrivacySettings
        open={showPrivacySettings}
        onOpenChange={setShowPrivacySettings}
      />
    </>
  );
}
