import { useState } from "react";
import { format } from "date-fns";
import {
  UserPlus,
  Search,
  Check,
  ChevronRight,
  User,
  Users,
  Vote,
  AlertCircle,
  Lock,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { mockNominationPeriods } from "@/data/electionProcessesData";
import { cn } from "@/lib/utils";

// Unavailable offices with active tenure
const unavailableOffices = [
  {
    id: "office-unavail-1",
    officeName: "President General",
    currentHolder: "Chief Emmanuel Nwosu",
    tenureEnd: new Date("2025-12-31"),
    status: "active_tenure" as const,
  },
  {
    id: "office-unavail-2",
    officeName: "Secretary General",
    currentHolder: "Mrs. Ngozi Eze",
    tenureEnd: new Date("2025-12-31"),
    status: "active_tenure" as const,
  },
  {
    id: "office-unavail-3",
    officeName: "Publicity Secretary",
    currentHolder: "Dr. Patricia Okafor",
    tenureEnd: new Date("2025-12-31"),
    status: "active_tenure" as const,
  },
];

interface Member {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
}

// Mock community members for selection
const mockMembers: Member[] = [
  { id: "member-1", name: "Chief Emmanuel Nwosu", avatar: "/placeholder.svg", title: "Elder" },
  { id: "member-2", name: "Dr. Patricia Okafor", avatar: "/placeholder.svg", title: "Doctor" },
  { id: "member-3", name: "Elder James Nwachukwu", avatar: "/placeholder.svg", title: "Elder" },
  { id: "member-4", name: "Mrs. Ngozi Eze", avatar: "/placeholder.svg", title: "Chief" },
  { id: "member-5", name: "Barr. Chukwudi Anene", avatar: "/placeholder.svg", title: "Barrister" },
  { id: "member-6", name: "Prof. Adaeze Okoli", avatar: "/placeholder.svg", title: "Professor" },
  { id: "member-7", name: "Chief Obinna Okafor", avatar: "/placeholder.svg", title: "Chief" },
  { id: "member-8", name: "Grace Adaeze Okafor", avatar: "/placeholder.svg", title: "Member" },
];

// Current user (mock)
const currentUser: Member = {
  id: "current-user",
  name: "John Doe",
  avatar: "/placeholder.svg",
  title: "Member",
};

interface NominateCandidateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNominationComplete?: (nomineeId: string, officeId: string, isSelfNomination: boolean) => void;
}

export function NominateCandidateSheet({
  open,
  onOpenChange,
  onNominationComplete,
}: NominateCandidateSheetProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [nominationType, setNominationType] = useState<"self" | "other">("self");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const openNominationPeriods = mockNominationPeriods.filter(
    (p) => p.status === "open"
  );

  const filteredMembers = mockMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (!selectedOffice) {
      toast({
        title: "Select an Office",
        description: "Please select an office to nominate for",
        variant: "destructive",
      });
      return;
    }

    if (nominationType === "other" && !selectedMember) {
      toast({
        title: "Select a Member",
        description: "Please select a member to nominate",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmNomination = () => {
    const nominee = nominationType === "self" ? currentUser : selectedMember;
    const office = openNominationPeriods.find((p) => p.officeId === selectedOffice);

    toast({
      title: "Nomination Submitted!",
      description: `${nominee?.name} has been nominated for ${office?.officeName}`,
    });

    onNominationComplete?.(
      nominee?.id || "",
      selectedOffice,
      nominationType === "self"
    );

    setShowConfirmDialog(false);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setNominationType("self");
    setSearchQuery("");
    setSelectedMember(null);
    setSelectedOffice("");
  };

  const Content = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1 overflow-y-auto touch-auto px-4 pb-6">
        <div className="space-y-5">
          {/* Nomination Type Selection */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-semibold mb-3 block">
                Who would you like to nominate?
              </Label>
              <RadioGroup
                value={nominationType}
                onValueChange={(v) => setNominationType(v as "self" | "other")}
                className="space-y-3"
              >
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    nominationType === "self"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                  onClick={() => setNominationType("self")}
                >
                  <RadioGroupItem value="self" id="self" />
                  <User className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <Label htmlFor="self" className="font-medium cursor-pointer">
                      Nominate Myself
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Self-nominate for an election office
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    nominationType === "other"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                  onClick={() => setNominationType("other")}
                >
                  <RadioGroupItem value="other" id="other" />
                  <Users className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <Label htmlFor="other" className="font-medium cursor-pointer">
                      Nominate Another Member
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Nominate a fellow community member
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Self Nomination - Show current user */}
          {nominationType === "self" && (
            <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-emerald-400">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-base">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.title}</p>
                  </div>
                  <Badge className="bg-emerald-500 text-white">
                    <Check className="h-3 w-3 mr-1" />
                    You
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Member Selection */}
          {nominationType === "other" && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-sm font-semibold">Select a Member</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <ScrollArea className="h-[180px]">
                  <div className="space-y-2 pr-2">
                    {filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                          selectedMember?.id === member.id
                            ? "bg-primary/10 border border-primary"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                        onClick={() => setSelectedMember(member)}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.title}</p>
                        </div>
                        {selectedMember?.id === member.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                    {filteredMembers.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-6">
                        No members found
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Office Selection - Card-based with Active/Inactive states */}
          <div className="space-y-4">
            {/* Available Offices */}
            {openNominationPeriods.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  Available Positions ({openNominationPeriods.length})
                </Label>
                <div className="space-y-2">
                  {openNominationPeriods.map((period) => (
                    <Card
                      key={period.officeId}
                      className={cn(
                        "cursor-pointer transition-all",
                        selectedOffice === period.officeId
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 hover:shadow-sm"
                      )}
                      onClick={() => setSelectedOffice(period.officeId)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{period.officeName}</p>
                            <p className="text-xs text-muted-foreground">
                              {period.nominationsCount}/{period.maxNominations || "No limit"} nominations
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-500 text-white text-[10px]">Open</Badge>
                            {selectedOffice === period.officeId && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {openNominationPeriods.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm">No nomination periods are currently open</p>
              </div>
            )}

            {/* Unavailable Offices */}
            {unavailableOffices.length > 0 && (
              <div className="space-y-2 mt-4">
                <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Unavailable Positions ({unavailableOffices.length})
                </Label>
                <div className="space-y-2">
                  {unavailableOffices.map((office) => (
                    <Card
                      key={office.id}
                      className="opacity-60 border-muted cursor-not-allowed"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-muted-foreground">{office.officeName}</p>
                            <p className="text-xs text-muted-foreground">
                              Current: {office.currentHolder}
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" />
                              Tenure ends: {format(office.tenureEnd, "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">
                            <Lock className="h-2.5 w-2.5 mr-1" />
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

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedOffice ||
              (nominationType === "other" && !selectedMember)
            }
            className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/80"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Submit Nomination
          </Button>
        </div>
      </ScrollArea>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Nomination</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                You are about to nominate{" "}
                <strong>
                  {nominationType === "self"
                    ? currentUser.name
                    : selectedMember?.name}
                </strong>{" "}
                for the office of{" "}
                <strong>
                  {
                    openNominationPeriods.find((p) => p.officeId === selectedOffice)
                      ?.officeName
                  }
                </strong>
                .
              </p>
              {nominationType === "self" && (
                <p className="text-xs text-muted-foreground">
                  As a self-nomination, this will be automatically marked as accepted.
                </p>
              )}
              {nominationType === "other" && (
                <p className="text-xs text-muted-foreground">
                  The nominee will be notified and must accept this nomination.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmNomination}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              Confirm Nomination
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] flex flex-col">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Nominate for Election
            </DrawerTitle>
            <DrawerDescription>
              Nominate yourself or another member for an election office
            </DrawerDescription>
          </DrawerHeader>
          <Content />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Nominate for Election
          </DialogTitle>
          <DialogDescription>
            Nominate yourself or another member for an election office
          </DialogDescription>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
