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
  Crown,
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Impeachment process statuses
type ImpeachmentStatus = "petition" | "voting" | "successful" | "failed" | "withdrawn";

interface ImpeachmentProcess {
  id: string;
  officerId: string;
  officerName: string;
  officerPosition: string;
  officerAvatar?: string;
  initiatedBy: string;
  initiatedAt: Date;
  reason: string;
  status: ImpeachmentStatus;
  totalEligibleVoters: number;
  votesFor: number;
  votesAgainst: number;
  votingStartedAt?: Date;
  votingEndsAt?: Date;
  requiredThreshold: number; // 85-100%
  completedAt?: Date;
}

interface Officer {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  tenureStart: Date;
  isImpeachable: boolean;
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

const mockImpeachments: ImpeachmentProcess[] = [
  {
    id: "imp-1",
    officerId: "off-5",
    officerName: "Chief Ikenna Uche",
    officerPosition: "Treasurer",
    officerAvatar: "/placeholder.svg",
    initiatedBy: "Community Members",
    initiatedAt: new Date("2025-01-15"),
    reason: "Misappropriation of community funds and failure to present financial reports for 6 consecutive months.",
    status: "voting",
    totalEligibleVoters: 250,
    votesFor: 180,
    votesAgainst: 25,
    votingStartedAt: new Date("2025-01-20"),
    votingEndsAt: new Date("2025-02-05"),
    requiredThreshold: 85,
  },
  {
    id: "imp-2",
    officerId: "off-6",
    officerName: "Mr. Obinna Nnamdi",
    officerPosition: "PRO",
    officerAvatar: "/placeholder.svg",
    initiatedBy: "Executive Committee",
    initiatedAt: new Date("2024-11-10"),
    reason: "Gross misconduct and unauthorized statements to the press damaging community reputation.",
    status: "failed",
    totalEligibleVoters: 248,
    votesFor: 150,
    votesAgainst: 80,
    requiredThreshold: 85,
    completedAt: new Date("2024-12-01"),
  },
  {
    id: "imp-3",
    officerId: "off-4",
    officerName: "Mr. Emeka Chukwuemeka",
    officerPosition: "Assistant Secretary",
    officerAvatar: "/placeholder.svg",
    initiatedBy: "Members Petition",
    initiatedAt: new Date("2024-08-15"),
    reason: "Dereliction of duties and absence from official meetings for over 3 months.",
    status: "successful",
    totalEligibleVoters: 240,
    votesFor: 220,
    votesAgainst: 15,
    requiredThreshold: 85,
    completedAt: new Date("2024-09-20"),
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
    default:
      return status;
  }
};

// Stats Card Component
const StatCard = ({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) => (
  <Card className={cn("border-0", color)}>
    <CardContent className="p-2.5 text-center">
      <div className="flex flex-col items-center gap-1">
        {icon}
        <span className="text-lg font-bold">{value}</span>
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
    </CardContent>
  </Card>
);

export function AdminImpeachmentTab() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
    failed: mockImpeachments.filter((i) => i.status === "failed").length,
  };

  // Filtered impeachments
  const filteredImpeachments = mockImpeachments.filter((imp) => {
    const matchesSearch = imp.officerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || imp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectOfficer = (officer: Officer) => {
    setSelectedOfficer(officer);
    setStep("reason");
  };

  const handleInitiateImpeachment = () => {
    if (!selectedOfficer || !impeachmentReason.trim()) return;
    
    toast({
      title: "Impeachment Process Initiated",
      description: `Impeachment petition against ${selectedOfficer.name} has been submitted for review.`,
    });
    
    setShowInitiateDrawer(false);
    setSelectedOfficer(null);
    setImpeachmentReason("");
    setStep("select");
  };

  const calculateProgress = (imp: ImpeachmentProcess) => {
    const totalVotes = imp.votesFor + imp.votesAgainst;
    if (totalVotes === 0) return 0;
    return (imp.votesFor / imp.totalEligibleVoters) * 100;
  };

  const renderInitiateOfficerSelection = () => (
    <div className="space-y-4 px-4">
      <div className="text-sm text-muted-foreground">
        Select an officer to initiate impeachment proceedings against. Note: Impeachment requires <strong>85-100%</strong> of active member votes to succeed.
      </div>

      <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
        <p className="text-xs text-red-700 dark:text-red-400">
          Impeachment is a serious process. False or malicious allegations may result in disciplinary action against the initiator.
        </p>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-4">
          {mockOfficers.map((officer) => (
            <Card
              key={officer.id}
              className="cursor-pointer hover:shadow-md transition-shadow hover:border-red-300"
              onClick={() => handleSelectOfficer(officer)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={officer.avatar} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{officer.name}</p>
                    <p className="text-xs text-muted-foreground">{officer.position}</p>
                    <p className="text-xs text-muted-foreground">
                      Since: {format(officer.tenureStart, "MMM yyyy")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderReasonForm = () => (
    <div className="space-y-4 px-4">
      <Button variant="ghost" size="sm" onClick={() => setStep("select")}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      {/* Selected Officer */}
      <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={selectedOfficer?.avatar} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{selectedOfficer?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedOfficer?.position}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reason Form */}
      <div className="space-y-2">
        <Label htmlFor="reason" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Grounds for Impeachment *
        </Label>
        <Textarea
          id="reason"
          placeholder="Provide detailed reasons for this impeachment request. Be specific about the misconduct, dates, and evidence..."
          value={impeachmentReason}
          onChange={(e) => setImpeachmentReason(e.target.value)}
          rows={5}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Minimum 50 characters required. {impeachmentReason.length}/50
        </p>
      </div>

      {/* Threshold Info */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-700 dark:text-amber-400">
              <p className="font-medium">Required Threshold: 85% - 100%</p>
              <p className="mt-1">
                For impeachment to succeed, at least 85% of all active members must vote in favor. 
                Upon success, the officer's position becomes vacant and their admin credentials are invalidated.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderImpeachmentCard = (imp: ImpeachmentProcess) => {
    const progress = calculateProgress(imp);
    const isActive = imp.status === "voting" || imp.status === "petition";
    
    return (
      <Card
        key={imp.id}
        className={cn(
          "cursor-pointer hover:shadow-md transition-shadow",
          imp.status === "successful" && "border-red-200 bg-red-50/30 dark:bg-red-950/10"
        )}
        onClick={() => {
          setSelectedImpeachment(imp);
          setShowDetailsSheet(true);
        }}
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={imp.officerAvatar} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm truncate">{imp.officerName}</p>
                  <p className="text-xs text-muted-foreground">{imp.officerPosition}</p>
                </div>
                <Badge className={cn("text-xs text-white shrink-0", getStatusColor(imp.status))}>
                  {getStatusLabel(imp.status)}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {imp.reason}
              </p>

              {/* Progress for active impeachments */}
              {isActive && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      Votes: {imp.votesFor}/{imp.totalEligibleVoters}
                    </span>
                    <span className={progress >= imp.requiredThreshold ? "text-green-600 font-medium" : "text-amber-600"}>
                      {progress.toFixed(1)}% / {imp.requiredThreshold}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              )}

              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Initiated: {format(imp.initiatedAt, "MMM d, yyyy")}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const InitiateDrawerContent = () => (
    <>
      <DrawerHeader className="shrink-0 border-b">
        <DrawerTitle className="flex items-center gap-2 text-red-600">
          <Gavel className="h-5 w-5" />
          {step === "select" ? "Initiate Impeachment" : "Grounds for Impeachment"}
        </DrawerTitle>
      </DrawerHeader>
      <ScrollArea className="flex-1 overflow-y-auto touch-auto pb-6">
        {step === "select" && renderInitiateOfficerSelection()}
        {step === "reason" && renderReasonForm()}
      </ScrollArea>
      <div className="flex gap-2 p-4 border-t bg-background">
        <Button
          variant="outline"
          className="flex-1"
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
            className="flex-1"
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
    
    return (
      <>
        <DrawerHeader className="shrink-0 border-b">
          <DrawerTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-red-600" />
            Impeachment Details
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="flex-1 overflow-y-auto touch-auto p-4 pb-6">
          <div className="space-y-4">
            {/* Officer Info */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selectedImpeachment.officerAvatar} />
                    <AvatarFallback>
                      <User className="h-7 w-7" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{selectedImpeachment.officerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedImpeachment.officerPosition}</p>
                    <Badge className={cn("text-xs text-white mt-1", getStatusColor(selectedImpeachment.status))}>
                      {getStatusLabel(selectedImpeachment.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voting Progress */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Vote className="h-4 w-4" />
                  Voting Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Required: {selectedImpeachment.requiredThreshold}% ({Math.ceil(selectedImpeachment.totalEligibleVoters * selectedImpeachment.requiredThreshold / 100)} votes)
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{selectedImpeachment.votesFor}</p>
                    <p className="text-xs text-muted-foreground">For</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="text-lg font-bold text-red-600">{selectedImpeachment.votesAgainst}</p>
                    <p className="text-xs text-muted-foreground">Against</p>
                  </div>
                  <div className="p-2 bg-muted rounded-lg">
                    <p className="text-lg font-bold">{selectedImpeachment.totalEligibleVoters - selectedImpeachment.votesFor - selectedImpeachment.votesAgainst}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reason */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Grounds for Impeachment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {selectedImpeachment.reason}
                </p>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Initiated</span>
                  <span>{format(selectedImpeachment.initiatedAt, "MMM d, yyyy")}</span>
                </div>
                {selectedImpeachment.votingStartedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Voting Started</span>
                    <span>{format(selectedImpeachment.votingStartedAt, "MMM d, yyyy")}</span>
                  </div>
                )}
                {selectedImpeachment.votingEndsAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Voting Ends</span>
                    <span>{format(selectedImpeachment.votingEndsAt, "MMM d, yyyy")}</span>
                  </div>
                )}
                {selectedImpeachment.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed</span>
                    <span>{format(selectedImpeachment.completedAt, "MMM d, yyyy")}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Consequences Note */}
            {selectedImpeachment.status === "successful" && (
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-red-700 dark:text-red-400">
                      <p className="font-medium">Impeachment Successful</p>
                      <p className="mt-1">
                        The officer has been removed from position. Their admin credentials have been invalidated 
                        and the office is now declared vacant for supplementary election.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-background">
          <Button
            variant="outline"
            className="w-full"
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
        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
      >
        <Gavel className="h-5 w-5 mr-2" />
        Start Impeachment Process
      </Button>

      {/* Info Banner */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Impeachment requires <strong>85% to 100%</strong> votes from active members to succeed. 
              Successful impeachment results in automatic office vacancy and admin credential invalidation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-1.5">
        <StatCard
          icon={<Users className="h-3.5 w-3.5 text-blue-600" />}
          value={stats.total}
          label="Total"
          color="bg-blue-500/10"
        />
        <StatCard
          icon={<Clock className="h-3.5 w-3.5 text-amber-600" />}
          value={stats.active}
          label="Active"
          color="bg-amber-500/10"
        />
        <StatCard
          icon={<CheckCircle2 className="h-3.5 w-3.5 text-red-600" />}
          value={stats.successful}
          label="Impeached"
          color="bg-red-500/10"
        />
        <StatCard
          icon={<XCircle className="h-3.5 w-3.5 text-muted-foreground" />}
          value={stats.failed}
          label="Failed"
          color="bg-muted/50"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search impeachments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Impeachment List */}
      <div className="space-y-2">
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Gavel className="h-5 w-5" />
              Confirm Impeachment Petition
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to initiate impeachment proceedings against <strong>{selectedOfficer?.name}</strong> ({selectedOfficer?.position}). 
              This action will be visible to all community members and requires 85% approval to succeed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
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
