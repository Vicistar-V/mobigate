import { useState } from "react";
import {
  Vote,
  Calendar,
  Check,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  Clock,
  Users,
  Plus,
  X,
  Gavel,
  Crown,
  HeartCrack,
  Ban,
  FileX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ModuleAuthorizationDrawer } from "../authorization/ModuleAuthorizationDrawer";

// Vacancy reasons for supplementary elections
export type VacancyReason = "resignation" | "impeachment" | "death" | "incapacitation" | "other";

export const VACANCY_REASONS: Record<VacancyReason, { label: string; icon: React.ReactNode }> = {
  resignation: { label: "Resignation", icon: <FileX className="h-4 w-4" /> },
  impeachment: { label: "Impeachment", icon: <Gavel className="h-4 w-4" /> },
  death: { label: "Death", icon: <HeartCrack className="h-4 w-4" /> },
  incapacitation: { label: "Incapacitation", icon: <Ban className="h-4 w-4" /> },
  other: { label: "Other Reason", icon: <AlertCircle className="h-4 w-4" /> },
};

// Office interface
interface ElectableOffice {
  id: string;
  name: string;
  currentHolder?: string;
  tenureEnd?: Date;
  isVacant: boolean;
  vacancyReason?: VacancyReason;
}

// Mock offices data
const mockOffices: ElectableOffice[] = [
  { id: "off-1", name: "President General", currentHolder: "DR. MARK ANTHONY ONWUDINJO", tenureEnd: new Date("2028-01-31"), isVacant: false },
  { id: "off-2", name: "Vice President", currentHolder: "Mrs. Chidinma Adaeze Nwosu", tenureEnd: new Date("2028-01-31"), isVacant: false },
  { id: "off-3", name: "Secretary General", currentHolder: "Barr. Ngozi Okonkwo", tenureEnd: new Date("2028-01-31"), isVacant: false },
  { id: "off-4", name: "Assistant Secretary", currentHolder: "Mr. Emeka Chukwuemeka", tenureEnd: new Date("2028-01-31"), isVacant: false },
  { id: "off-5", name: "Treasurer", isVacant: true, vacancyReason: "resignation" },
  { id: "off-6", name: "Financial Secretary", currentHolder: "Chief Ikenna Uche", tenureEnd: new Date("2028-01-31"), isVacant: false },
  { id: "off-7", name: "Public Relations Officer", currentHolder: "Mr. Obinna Nnamdi", tenureEnd: new Date("2028-01-31"), isVacant: false },
  { id: "off-8", name: "Director of Socials", currentHolder: "Mrs. Amaka Grace Okoro", tenureEnd: new Date("2028-01-31"), isVacant: false },
  { id: "off-9", name: "Legal Adviser", currentHolder: "Barr. Chinedu Paul Okoye", tenureEnd: new Date("2028-01-31"), isVacant: false },
  { id: "off-10", name: "Welfare Officer", isVacant: true, vacancyReason: "death" },
];

export type ElectionType = "general" | "supplementary";

interface SelectedOfficeVacancy {
  officeId: string;
  reason: VacancyReason;
  reasonDetails?: string;
}

interface DeclareElectionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "type" | "offices" | "details" | "confirm";

export function DeclareElectionDrawer({
  open,
  onOpenChange,
}: DeclareElectionDrawerProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>("type");
  const [electionType, setElectionType] = useState<ElectionType>("general");
  const [selectedOffices, setSelectedOffices] = useState<string[]>([]);
  const [officeVacancies, setOfficeVacancies] = useState<SelectedOfficeVacancy[]>([]);
  const [electionName, setElectionName] = useState("");
  const [nominationStartDate, setNominationStartDate] = useState("");
  const [electionDate, setElectionDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);

  // Filter offices based on election type
  const availableOffices = mockOffices.filter((office) => {
    if (electionType === "general") {
      return true; // All offices for general election
    } else {
      return office.isVacant; // Only vacant offices for supplementary
    }
  });

  const handleSelectOffice = (officeId: string, checked: boolean) => {
    if (checked) {
      setSelectedOffices([...selectedOffices, officeId]);
      if (electionType === "supplementary") {
        const office = mockOffices.find((o) => o.id === officeId);
        if (office?.isVacant && office.vacancyReason) {
          setOfficeVacancies([
            ...officeVacancies,
            { officeId, reason: office.vacancyReason },
          ]);
        }
      }
    } else {
      setSelectedOffices(selectedOffices.filter((id) => id !== officeId));
      setOfficeVacancies(officeVacancies.filter((ov) => ov.officeId !== officeId));
    }
  };

  const handleSelectAllOffices = () => {
    if (electionType === "general") {
      if (selectedOffices.length === mockOffices.length) {
        setSelectedOffices([]);
      } else {
        setSelectedOffices(mockOffices.map((o) => o.id));
      }
    }
  };

  const updateVacancyReason = (officeId: string, reason: VacancyReason, details?: string) => {
    setOfficeVacancies((prev) => {
      const existing = prev.find((ov) => ov.officeId === officeId);
      if (existing) {
        return prev.map((ov) =>
          ov.officeId === officeId ? { ...ov, reason, reasonDetails: details } : ov
        );
      }
      return [...prev, { officeId, reason, reasonDetails: details }];
    });
  };

  const handleBack = () => {
    if (step === "offices") setStep("type");
    else if (step === "details") setStep("offices");
    else if (step === "confirm") setStep("details");
  };

  const handleNext = () => {
    if (step === "type") setStep("offices");
    else if (step === "offices") setStep("details");
    else if (step === "details") setStep("confirm");
    else if (step === "confirm") setShowAuthDrawer(true);
  };

  const canProceed = () => {
    if (step === "type") return true;
    if (step === "offices") return selectedOffices.length > 0;
    if (step === "details") {
      if (electionType === "supplementary") {
        // Ensure all selected offices have vacancy reasons
        return (
          selectedOffices.every((id) =>
            officeVacancies.some((ov) => ov.officeId === id)
          ) && nominationStartDate && electionDate
        );
      }
      return nominationStartDate && electionDate;
    }
    return true;
  };

  const handleAuthComplete = () => {
    toast({
      title: "Election Declared Successfully",
      description: `${electionType === "general" ? "General" : "Supplementary"} Election for ${selectedOffices.length} office(s) has been declared.`,
    });
    handleClose();
  };

  const handleClose = () => {
    setStep("type");
    setElectionType("general");
    setSelectedOffices([]);
    setOfficeVacancies([]);
    setElectionName("");
    setNominationStartDate("");
    setElectionDate("");
    setAdditionalNotes("");
    setShowConfirmDialog(false);
    setShowAuthDrawer(false);
    onOpenChange(false);
  };

  const renderElectionTypeSelection = () => (
    <div className="space-y-4 px-4">
      <div className="text-sm text-muted-foreground">
        Select the type of election you want to declare for this community.
      </div>

      <RadioGroup
        value={electionType}
        onValueChange={(value: ElectionType) => setElectionType(value)}
        className="space-y-3"
      >
        <Card
          className={cn(
            "cursor-pointer transition-all",
            electionType === "general"
              ? "border-primary ring-2 ring-primary/20"
              : "hover:border-muted-foreground/50"
          )}
          onClick={() => setElectionType("general")}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <RadioGroupItem value="general" id="general" className="mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <Label htmlFor="general" className="font-semibold text-base cursor-pointer">
                    General Election
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Full election for all or selected offices. Used for regular tenure-based elections.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "cursor-pointer transition-all",
            electionType === "supplementary"
              ? "border-primary ring-2 ring-primary/20"
              : "hover:border-muted-foreground/50"
          )}
          onClick={() => setElectionType("supplementary")}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <RadioGroupItem value="supplementary" id="supplementary" className="mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-amber-600" />
                  <Label htmlFor="supplementary" className="font-semibold text-base cursor-pointer">
                    Supplementary Election
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Election for vacant offices due to resignation, impeachment, death, or other reasons.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {Object.entries(VACANCY_REASONS).slice(0, 4).map(([key, { label }]) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </RadioGroup>
    </div>
  );

  const renderOfficeSelection = () => (
    <div className="space-y-4 px-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Badge
          variant={electionType === "general" ? "default" : "secondary"}
          className={electionType === "general" ? "bg-primary" : "bg-amber-500 text-white"}
        >
          {electionType === "general" ? "General Election" : "Supplementary Election"}
        </Badge>
      </div>

      {electionType === "general" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAllOffices}
          className="w-full"
        >
          {selectedOffices.length === mockOffices.length ? "Deselect All" : "Select All Offices"}
        </Button>
      )}

      <ScrollArea className="h-[350px]">
        <div className="space-y-2 pr-4">
          {availableOffices.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-4 text-center">
                <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No vacant offices available for supplementary election.
                </p>
              </CardContent>
            </Card>
          ) : (
            availableOffices.map((office) => (
              <Card
                key={office.id}
                className={cn(
                  "transition-all",
                  selectedOffices.includes(office.id)
                    ? "border-primary ring-1 ring-primary/30"
                    : ""
                )}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={office.id}
                      checked={selectedOffices.includes(office.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOffice(office.id, checked as boolean)
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={office.id} className="font-medium text-sm cursor-pointer">
                        {office.name}
                      </Label>
                      {office.currentHolder && !office.isVacant && (
                        <p className="text-xs text-muted-foreground">
                          Current: {office.currentHolder}
                        </p>
                      )}
                      {office.isVacant && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          Vacant - {VACANCY_REASONS[office.vacancyReason || "other"].label}
                        </Badge>
                      )}
                    </div>
                    {selectedOffices.includes(office.id) && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="text-sm text-muted-foreground text-center">
        {selectedOffices.length} office(s) selected
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-4 px-4">
      <Button variant="ghost" size="sm" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <ScrollArea className="h-[380px]">
        <div className="space-y-4 pr-4">
          {/* Election Name */}
          <div className="space-y-2">
            <Label htmlFor="electionName">Election Name (Optional)</Label>
            <Input
              id="electionName"
              placeholder={`e.g., ${new Date().getFullYear()} ${electionType === "general" ? "General" : "Supplementary"} Election`}
              value={electionName}
              onChange={(e) => setElectionName(e.target.value)}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="nominationStart">Nomination Opens *</Label>
              <Input
                id="nominationStart"
                type="date"
                value={nominationStartDate}
                onChange={(e) => setNominationStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="electionDate">Election Date *</Label>
              <Input
                id="electionDate"
                type="date"
                value={electionDate}
                onChange={(e) => setElectionDate(e.target.value)}
              />
            </div>
          </div>

          {/* Vacancy Reasons for Supplementary Elections */}
          {electionType === "supplementary" && selectedOffices.length > 0 && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Vacancy Reasons (Required)
              </Label>
              {selectedOffices.map((officeId) => {
                const office = mockOffices.find((o) => o.id === officeId);
                const vacancy = officeVacancies.find((ov) => ov.officeId === officeId);
                return (
                  <Card key={officeId} className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                    <CardContent className="p-3 space-y-2">
                      <p className="font-medium text-sm">{office?.name}</p>
                      <Select
                        value={vacancy?.reason || ""}
                        onValueChange={(value: VacancyReason) =>
                          updateVacancyReason(officeId, value)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select reason..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(VACANCY_REASONS).map(([key, { label, icon }]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                {icon}
                                {label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {vacancy?.reason === "other" && (
                        <Input
                          placeholder="Specify reason..."
                          value={vacancy.reasonDetails || ""}
                          onChange={(e) =>
                            updateVacancyReason(officeId, "other", e.target.value)
                          }
                        />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about this election..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-4 px-4">
      <Button variant="ghost" size="sm" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Vote className="h-5 w-5 text-primary" />
            Election Declaration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Type */}
          <div className="p-3 bg-background rounded-lg">
            <p className="text-xs text-muted-foreground">Election Type</p>
            <div className="flex items-center gap-2 mt-1">
              {electionType === "general" ? (
                <Crown className="h-4 w-4 text-primary" />
              ) : (
                <Gavel className="h-4 w-4 text-amber-600" />
              )}
              <p className="font-semibold">
                {electionType === "general" ? "General Election" : "Supplementary Election"}
              </p>
            </div>
          </div>

          {/* Offices */}
          <div className="p-3 bg-background rounded-lg">
            <p className="text-xs text-muted-foreground">
              Offices ({selectedOffices.length})
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {selectedOffices.map((id) => {
                const office = mockOffices.find((o) => o.id === id);
                return (
                  <Badge key={id} variant="secondary" className="text-xs">
                    {office?.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground">Nomination Opens</p>
              <p className="font-medium text-sm">
                {nominationStartDate
                  ? format(new Date(nominationStartDate), "MMM d, yyyy")
                  : "Not set"}
              </p>
            </div>
            <div className="p-3 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground">Election Date</p>
              <p className="font-medium text-sm">
                {electionDate
                  ? format(new Date(electionDate), "MMM d, yyyy")
                  : "Not set"}
              </p>
            </div>
          </div>

          {/* Authorization Note */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="text-xs">
              This declaration requires authorization from: 
              <strong> President + Secretary + (PRO or Dir. of Socials)</strong>, 
              OR <strong>Secretary + PRO + Legal Adviser + (Dir. of Socials or another Admin)</strong> if President is unavailable.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case "type":
        return "Select Election Type";
      case "offices":
        return "Select Offices";
      case "details":
        return "Election Details";
      case "confirm":
        return "Confirm Declaration";
      default:
        return "New Election";
    }
  };

  const DrawerBodyContent = () => (
    <ScrollArea className="flex-1 overflow-y-auto touch-auto pb-6">
      {step === "type" && renderElectionTypeSelection()}
      {step === "offices" && renderOfficeSelection()}
      {step === "details" && renderDetailsForm()}
      {step === "confirm" && renderConfirmation()}
    </ScrollArea>
  );

  const FooterContent = () => (
    <div className="flex gap-2 p-4 border-t bg-background">
      <Button variant="outline" className="flex-1" onClick={handleClose}>
        Cancel
      </Button>
      <Button
        className="flex-1 bg-primary hover:bg-primary/90"
        onClick={handleNext}
        disabled={!canProceed()}
      >
        {step === "confirm" ? (
          <>
            <Vote className="h-4 w-4 mr-2" />
            Proceed to Authorization
          </>
        ) : (
          <>
            Continue
            <ChevronRight className="h-4 w-4 ml-1" />
          </>
        )}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[92vh] flex flex-col">
            <DrawerHeader className="shrink-0 border-b">
              <DrawerTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                {getStepTitle()}
              </DrawerTitle>
            </DrawerHeader>
            <DrawerBodyContent />
            <FooterContent />
          </DrawerContent>
        </Drawer>

        <ModuleAuthorizationDrawer
          open={showAuthDrawer}
          onOpenChange={setShowAuthDrawer}
          module="elections"
          actionTitle="Declare New Election"
          actionDescription={`Declare ${electionType === "general" ? "General" : "Supplementary"} Election for ${selectedOffices.length} office(s)`}
          actionDetails={
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {electionType === "general" ? (
                  <Crown className="h-5 w-5 text-primary" />
                ) : (
                  <Gavel className="h-5 w-5 text-amber-600" />
                )}
                <div>
                  <p className="font-medium text-sm">
                    {electionType === "general" ? "General Election" : "Supplementary Election"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedOffices.length} office(s) selected
                  </p>
                </div>
              </div>
            </div>
          }
          onAuthorized={handleAuthComplete}
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="shrink-0 p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              {getStepTitle()}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <DrawerBodyContent />
          </div>
          <FooterContent />
        </DialogContent>
      </Dialog>

      <ModuleAuthorizationDrawer
        open={showAuthDrawer}
        onOpenChange={setShowAuthDrawer}
        module="elections"
        actionTitle="Declare New Election"
        actionDescription={`Declare ${electionType === "general" ? "General" : "Supplementary"} Election for ${selectedOffices.length} office(s)`}
        actionDetails={
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {electionType === "general" ? (
                <Crown className="h-5 w-5 text-primary" />
              ) : (
                <Gavel className="h-5 w-5 text-amber-600" />
              )}
              <div>
                <p className="font-medium text-sm">
                  {electionType === "general" ? "General Election" : "Supplementary Election"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedOffices.length} office(s) selected
                </p>
              </div>
            </div>
          </div>
        }
        onAuthorized={handleAuthComplete}
      />
    </>
  );
}
