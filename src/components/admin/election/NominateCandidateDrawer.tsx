import { useState } from "react";
import {
  UserPlus,
  Search,
  Check,
  Lock,
  Calendar,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

// Extended Office interface for nomination availability
interface NominableOffice {
  id: string;
  name: string;
  currentHolder?: string;
  tenureStart?: Date;
  tenureEnd?: Date;
  isAvailable: boolean; // Can be nominated for
  availabilityReason?: string; // Why it's not available
  nominationsCount: number;
  maxNominations?: number;
}

// Mock member data for selection
interface SelectableMember {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  joinDate?: Date;
  isEligible: boolean;
  ineligibilityReason?: string;
}

// Mock data for offices
const mockNominableOffices: NominableOffice[] = [
  {
    id: "office-1",
    name: "President General",
    currentHolder: "Chief Emmanuel Nwosu",
    tenureStart: new Date("2023-01-01"),
    tenureEnd: new Date("2025-01-31"),
    isAvailable: false,
    availabilityReason: "Tenure not expired until Jan 31, 2025",
    nominationsCount: 5,
    maxNominations: 10,
  },
  {
    id: "office-2",
    name: "Vice President",
    currentHolder: "Dr. Patricia Okafor",
    tenureStart: new Date("2023-01-01"),
    tenureEnd: new Date("2025-01-31"),
    isAvailable: false,
    availabilityReason: "Tenure not expired until Jan 31, 2025",
    nominationsCount: 4,
    maxNominations: 10,
  },
  {
    id: "office-3",
    name: "Secretary General",
    isAvailable: true,
    nominationsCount: 3,
    maxNominations: 8,
  },
  {
    id: "office-4",
    name: "Treasurer",
    isAvailable: true,
    nominationsCount: 2,
    maxNominations: 8,
  },
  {
    id: "office-5",
    name: "Financial Secretary",
    isAvailable: true,
    nominationsCount: 0,
    maxNominations: 8,
  },
  {
    id: "office-6",
    name: "Public Relations Officer",
    currentHolder: "Mr. Ikenna Uche",
    tenureStart: new Date("2024-01-01"),
    tenureEnd: new Date("2026-01-31"),
    isAvailable: false,
    availabilityReason: "Tenure not expired until Jan 31, 2026",
    nominationsCount: 0,
  },
  {
    id: "office-7",
    name: "Welfare Officer",
    isAvailable: true,
    nominationsCount: 1,
    maxNominations: 6,
  },
];

// Mock selectable members
const mockSelectableMembers: SelectableMember[] = [
  {
    id: "member-1",
    name: "Paulson Chinedu Okonkwo",
    avatar: "/placeholder.svg",
    role: "Member",
    joinDate: new Date("2020-03-15"),
    isEligible: true,
  },
  {
    id: "member-2",
    name: "Jerome Ifeanyi Adebayo",
    avatar: "/placeholder.svg",
    role: "Member",
    joinDate: new Date("2019-07-22"),
    isEligible: true,
  },
  {
    id: "member-3",
    name: "Amaka Grace Okoro",
    avatar: "/placeholder.svg",
    role: "Member",
    joinDate: new Date("2021-01-10"),
    isEligible: true,
  },
  {
    id: "member-4",
    name: "David Olumide Fashola",
    avatar: "/placeholder.svg",
    role: "Member",
    joinDate: new Date("2022-05-18"),
    isEligible: false,
    ineligibilityReason: "Financial obligations pending",
  },
  {
    id: "member-5",
    name: "Chief Emmanuel Nwosu",
    avatar: "/placeholder.svg",
    role: "President General",
    joinDate: new Date("2015-02-28"),
    isEligible: true,
  },
  {
    id: "member-6",
    name: "Dr. Patricia Okafor",
    avatar: "/placeholder.svg",
    role: "Vice President",
    joinDate: new Date("2016-09-14"),
    isEligible: true,
  },
  {
    id: "member-7",
    name: "Ngozi Blessing Eze",
    avatar: "/placeholder.svg",
    role: "Member",
    joinDate: new Date("2020-11-05"),
    isEligible: true,
  },
  {
    id: "member-8",
    name: "Samuel Obinna Nnamdi",
    avatar: "/placeholder.svg",
    role: "Member",
    joinDate: new Date("2018-04-12"),
    isEligible: true,
  },
];

interface NominateCandidateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "office" | "member" | "confirm";

export function NominateCandidateDrawer({
  open,
  onOpenChange,
}: NominateCandidateDrawerProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>("office");
  const [selectedOffice, setSelectedOffice] = useState<NominableOffice | null>(null);
  const [selectedMember, setSelectedMember] = useState<SelectableMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const availableOffices = mockNominableOffices.filter((o) => o.isAvailable);
  const unavailableOffices = mockNominableOffices.filter((o) => !o.isAvailable);

  const filteredMembers = mockSelectableMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectOffice = (office: NominableOffice) => {
    if (!office.isAvailable) return;
    setSelectedOffice(office);
    setStep("member");
  };

  const handleSelectMember = (member: SelectableMember) => {
    if (!member.isEligible) return;
    setSelectedMember(member);
    setStep("confirm");
  };

  const handleBack = () => {
    if (step === "member") {
      setStep("office");
      setSelectedMember(null);
    } else if (step === "confirm") {
      setStep("member");
    }
  };

  const handleConfirmNomination = () => {
    if (!selectedOffice || !selectedMember) return;

    toast({
      title: "Nomination Submitted",
      description: `${selectedMember.name} has been nominated for ${selectedOffice.name}. Awaiting approval.`,
    });

    // Reset and close
    setStep("office");
    setSelectedOffice(null);
    setSelectedMember(null);
    setSearchQuery("");
    setShowConfirmDialog(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    setStep("office");
    setSelectedOffice(null);
    setSelectedMember(null);
    setSearchQuery("");
    onOpenChange(false);
  };

  const renderOfficeSelection = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Select an office to nominate a candidate for. Only offices with available positions can be selected.
      </div>

      {/* Available Offices */}
      {availableOffices.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
            <Check className="h-4 w-4" />
            Available Positions ({availableOffices.length})
          </h4>
          <div className="space-y-2">
            {availableOffices.map((office) => (
              <Card
                key={office.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-emerald-200 hover:border-emerald-400"
                onClick={() => handleSelectOffice(office)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{office.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {office.nominationsCount}/{office.maxNominations || "∞"} nominations
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500 text-white text-xs">Open</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Unavailable Offices */}
      {unavailableOffices.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Unavailable Positions ({unavailableOffices.length})
          </h4>
          <div className="space-y-2">
            {unavailableOffices.map((office) => (
              <Card
                key={office.id}
                className="opacity-60 border-muted cursor-not-allowed"
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-muted-foreground">{office.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {office.currentHolder && `Current: ${office.currentHolder}`}
                      </p>
                      {office.tenureEnd && (
                        <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Tenure ends: {format(office.tenureEnd, "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderMemberSelection = () => (
    <div className="space-y-4">
      {/* Back button and office info */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Nominating for:</p>
          <p className="font-semibold">{selectedOffice?.name}</p>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Members List */}
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-4">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className={cn(
                "transition-shadow",
                member.isEligible
                  ? "cursor-pointer hover:shadow-md hover:border-primary"
                  : "opacity-60 cursor-not-allowed"
              )}
              onClick={() => handleSelectMember(member)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                    {!member.isEligible && member.ineligibilityReason && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {member.ineligibilityReason}
                      </p>
                    )}
                  </div>
                  {member.isEligible && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-4">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Confirm Nomination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nominee */}
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={selectedMember?.avatar} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{selectedMember?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedMember?.role}</p>
            </div>
          </div>

          {/* Office */}
          <div className="p-3 bg-background rounded-lg">
            <p className="text-xs text-muted-foreground">For the office of:</p>
            <p className="font-semibold text-primary">{selectedOffice?.name}</p>
          </div>

          {/* Note */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="text-xs">
              This nomination will be submitted for review. The nominee will be notified and must accept the nomination.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DrawerBodyContent = () => (
    <ScrollArea className="flex-1 overflow-y-auto touch-auto px-4 pb-6">
      {step === "office" && renderOfficeSelection()}
      {step === "member" && renderMemberSelection()}
      {step === "confirm" && renderConfirmation()}
    </ScrollArea>
  );

  const FooterContent = () => (
    <div className="flex gap-2 p-4 border-t bg-background">
      <Button variant="outline" className="flex-1" onClick={handleClose}>
        Cancel
      </Button>
      {step === "confirm" && (
        <Button 
          className="flex-1 bg-primary hover:bg-primary/90"
          onClick={() => setShowConfirmDialog(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Submit Nomination
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[92vh] flex flex-col">
            <DrawerHeader className="shrink-0 border-b">
              <DrawerTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Nominate Candidate
              </DrawerTitle>
            </DrawerHeader>
            <DrawerBodyContent />
            <FooterContent />
          </DrawerContent>
        </Drawer>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Nomination</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to nominate <strong>{selectedMember?.name}</strong> for the office of <strong>{selectedOffice?.name}</strong>. 
                This action will notify the nominee for acceptance.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmNomination}>
                Confirm Nomination
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="shrink-0 p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Nominate Candidate
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <DrawerBodyContent />
          </div>
          <FooterContent />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Nomination</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to nominate <strong>{selectedMember?.name}</strong> for the office of <strong>{selectedOffice?.name}</strong>. 
              This action will notify the nominee for acceptance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNomination}>
              Confirm Nomination
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
