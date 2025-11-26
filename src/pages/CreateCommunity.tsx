import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Building, Users, Calendar, Settings, AlertCircle, X, Save, CheckCircle2, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useCommunityForm, SavedDraft } from "@/hooks/useCommunityForm";
import { formatDistanceToNow } from "date-fns";
import { ClassificationSection } from "@/components/community/form/ClassificationSection";
import { MembershipSection } from "@/components/community/form/MembershipSection";
import { LeadershipSection } from "@/components/community/form/LeadershipSection";
import { AdministrationSection } from "@/components/community/form/AdministrationSection";
import { MeetingsSection } from "@/components/community/form/MeetingsSection";
import { OfficesPositionsSection } from "@/components/community/form/OfficesPositionsSection";
import { EventsActivitiesSection } from "@/components/community/form/EventsActivitiesSection";
import { OriginationContactsSection } from "@/components/community/form/OriginationContactsSection";
import { PrivacySettingsSection } from "@/components/community/form/PrivacySettingsSection";
import { GeneralSettingsSection } from "@/components/community/form/GeneralSettingsSection";
import { CommunityPromotionSection } from "@/components/community/form/CommunityPromotionSection";
import { CommunityElectionsSection } from "@/components/community/form/CommunityElectionsSection";
import { AddingPeoplePostingSection } from "@/components/community/form/AddingPeoplePostingSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Basics", icon: Building },
  { id: 2, name: "Structure", icon: Users },
  { id: 3, name: "Operations", icon: Calendar },
  { id: 4, name: "Settings", icon: Settings },
];

const AUTO_SAVE_DELAY = 2000; // 2 seconds

export default function CreateCommunity() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showValidationBanner, setShowValidationBanner] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [savedDraft, setSavedDraft] = useState<SavedDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);
  
  const {
    formData,
    errors,
    completedSteps,
    lastSaved,
    hasSavedDraft,
    updateField,
    addPosition,
    removePosition,
    updatePosition,
    addMeeting,
    removeMeeting,
    updateMeeting,
    addEvent,
    removeEvent,
    updateEvent,
    handleSubmit,
    validateForm,
    validateStep,
    getStepErrors,
    isStepComplete,
    markStepComplete,
    saveToStorage,
    loadFromStorage,
    clearStorage,
    checkForSavedDraft,
    restoreFromDraft,
  } = useCommunityForm();

  // Check for saved draft on mount
  useEffect(() => {
    const draft = loadFromStorage();
    if (draft) {
      setSavedDraft(draft);
      setShowResumeDialog(true);
    }
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.name || formData.classification || formData.category) {
        setIsSaving(true);
        saveToStorage(currentStep);
        setTimeout(() => setIsSaving(false), 500);
      }
    }, AUTO_SAVE_DELAY);

    return () => clearTimeout(timer);
  }, [formData, currentStep, completedSteps]);

  // Save on beforeunload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formData.name || formData.classification) {
        saveToStorage(currentStep);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, currentStep, completedSteps]);

  useEffect(() => {
    if (showValidationBanner && formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showValidationBanner]);

  const progressPercentage = (currentStep / steps.length) * 100;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = handleSubmit();
    if (success) {
      clearStorage(); // Clear draft on successful submit
      navigate("/community");
    }
  };

  const goToNextStep = () => {
    const isValid = validateStep(currentStep);
    
    if (!isValid) {
      const stepErrors = getStepErrors(currentStep);
      setValidationErrors(stepErrors);
      setShowValidationBanner(true);
      
      toast({
        title: "Please complete required fields",
        description: `Fix ${stepErrors.length} ${stepErrors.length === 1 ? 'issue' : 'issues'} before continuing`,
        variant: "destructive"
      });
      
      return;
    }
    
    markStepComplete(currentStep);
    setShowValidationBanner(false);
    setValidationErrors([]);
    
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveToStorage(nextStep); // Save immediately on step change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    setShowValidationBanner(false);
    setValidationErrors([]);
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step: number) => {
    setShowValidationBanner(false);
    setValidationErrors([]);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueEditing = () => {
    if (savedDraft) {
      restoreFromDraft(savedDraft);
      setCurrentStep(savedDraft.currentStep);
      setShowResumeDialog(false);
    }
  };

  const handleStartFresh = () => {
    clearStorage();
    setShowResumeDialog(false);
    setSavedDraft(null);
    toast({
      title: "Starting Fresh",
      description: "Previous draft has been discarded"
    });
  };

  const formatLastSaved = () => {
    if (!lastSaved) return null;
    try {
      return formatDistanceToNow(lastSaved, { addSuffix: true });
    } catch (error) {
      return "just now";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div ref={formTopRef} />
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/community")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold truncate">Create Community</h1>
              <div className="flex items-center gap-2">
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  Step {currentStep} of {steps.length}
                </p>
                {/* Auto-save indicator */}
                {(isSaving || lastSaved) && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">•</span>
                    {isSaving ? (
                      <>
                        <Save className="w-3 h-3 animate-pulse" />
                        <span className="hidden sm:inline">Saving...</span>
                      </>
                    ) : lastSaved ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        <span className="hidden sm:inline">Saved {formatLastSaved()}</span>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={progressPercentage} className="h-2 mb-4" />
            
            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2">
              {steps.map((step) => {
                const StepIcon = step.icon;
                const isCompleted = completedSteps.includes(step.id) || step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const stepErrorCount = getStepErrors(step.id).length;
                const hasErrors = stepErrorCount > 0 && !isCurrent;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(step.id)}
                    className={cn(
                      "relative flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all",
                      isCurrent && "bg-primary/10",
                      !isCurrent && "hover:bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all relative",
                        isCompleted && !hasErrors && "bg-primary text-primary-foreground",
                        hasErrors && "bg-destructive/10 text-destructive ring-2 ring-destructive/30",
                        isCurrent && !hasErrors && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                        !isCompleted && !isCurrent && !hasErrors && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted && !hasErrors ? (
                        <Check className="h-5 w-5" />
                      ) : hasErrors ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    {hasErrors && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {stepErrorCount}
                      </Badge>
                    )}
                    <span className={cn(
                      "text-xs font-medium",
                      isCurrent && "text-primary",
                      hasErrors && "text-destructive",
                      !isCurrent && !hasErrors && "text-muted-foreground"
                    )}>
                      {step.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Validation Banner */}
          {showValidationBanner && validationErrors.length > 0 && (
            <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="ml-2 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold mb-2">Please complete required fields before continuing</p>
                    <ul className="space-y-1 text-sm">
                      {validationErrors.map((error, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-destructive mt-0.5">•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => setShowValidationBanner(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Form Content */}
          <form onSubmit={onSubmit}>
            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* Community Identity */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Community Identity</h2>
                        <p className="text-xs text-muted-foreground">Basic information about your community</p>
                      </div>
                    </div>
                    {(errors.name || errors.shortDescription) && (
                      <Badge variant="destructive" className="shrink-0">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {[errors.name, errors.shortDescription].filter(Boolean).length}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Community Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter community name..."
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className={cn(
                        "h-11",
                        errors.name && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription" className="text-sm font-medium">
                      Short Description
                      <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
                    </Label>
                    <Textarea
                      id="shortDescription"
                      placeholder="Brief description of your community..."
                      value={formData.shortDescription}
                      onChange={(e) => {
                        if (e.target.value.length <= 200) {
                          updateField("shortDescription", e.target.value);
                        }
                      }}
                      maxLength={200}
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.shortDescription.length}/200 characters
                    </p>
                  </div>
                </div>

                {/* Classification & Type */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Classification & Type</h2>
                        <p className="text-xs text-muted-foreground">Define your community's category</p>
                      </div>
                    </div>
                    {(errors.classification || errors.category || errors.designation) && (
                      <Badge variant="destructive" className="shrink-0">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {[errors.classification, errors.category, errors.designation].filter(Boolean).length}
                      </Badge>
                    )}
                  </div>

                  <ClassificationSection
                    formData={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Structure */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* Membership & Gender */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Membership & Gender</h2>
                      <p className="text-xs text-muted-foreground">Define member requirements</p>
                    </div>
                  </div>

                  <MembershipSection
                    formData={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                </div>

                {/* Leadership Style */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Leadership Style</h2>
                        <p className="text-xs text-muted-foreground">Choose how leaders are selected</p>
                      </div>
                    </div>
                    {errors.leadershipStyle && (
                      <Badge variant="destructive" className="shrink-0">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        1
                      </Badge>
                    )}
                  </div>

                  <LeadershipSection
                    formData={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                </div>

                {/* Administration */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Administration</h2>
                        <p className="text-xs text-muted-foreground">Set administrative parameters</p>
                      </div>
                    </div>
                    {errors.populationStrength && (
                      <Badge variant="destructive" className="shrink-0">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        1
                      </Badge>
                    )}
                  </div>

                  <AdministrationSection
                    formData={formData}
                    updateField={updateField}
                  />
                </div>

                {/* Offices & Positions */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Offices & Positions</h2>
                        <p className="text-xs text-muted-foreground">Add leadership positions</p>
                      </div>
                    </div>
                    {errors.positions && (
                      <Badge variant="destructive" className="shrink-0">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        1
                      </Badge>
                    )}
                  </div>

                  <OfficesPositionsSection
                    formData={formData}
                    addPosition={addPosition}
                    removePosition={removePosition}
                    updatePosition={updatePosition}
                    errors={errors}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Operations */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* Meetings & Gatherings */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Meetings & Gatherings</h2>
                      <p className="text-xs text-muted-foreground">Schedule regular meetings</p>
                    </div>
                  </div>

                  <MeetingsSection
                    formData={formData}
                    updateField={updateField}
                    addMeeting={addMeeting}
                    removeMeeting={removeMeeting}
                    updateMeeting={updateMeeting}
                  />
                </div>

                {/* Events & Activities */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Events & Activities</h2>
                      <p className="text-xs text-muted-foreground">Plan community activities</p>
                    </div>
                  </div>

                  <EventsActivitiesSection
                    formData={formData}
                    addEvent={addEvent}
                    removeEvent={removeEvent}
                    errors={errors}
                  />
                </div>

                {/* Origination & Contacts */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Origination & Contacts</h2>
                      <p className="text-xs text-muted-foreground">Location and contact details</p>
                    </div>
                  </div>

                  <OriginationContactsSection
                    formData={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Settings */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* Privacy Settings */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Privacy Settings</h2>
                      <p className="text-xs text-muted-foreground">Control information access</p>
                    </div>
                  </div>

                  <PrivacySettingsSection
                    formData={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                </div>

                {/* General Settings */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">General Settings</h2>
                      <p className="text-xs text-muted-foreground">Fees and management</p>
                    </div>
                  </div>

                  <GeneralSettingsSection
                    formData={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                </div>

                {/* Community Promotion */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Community Promotion</h2>
                      <p className="text-xs text-muted-foreground">Visibility and discovery</p>
                    </div>
                  </div>

                  <CommunityPromotionSection
                    formData={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                </div>

                {/* Elections */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Elections</h2>
                      <p className="text-xs text-muted-foreground">Voting permissions</p>
                    </div>
                  </div>

                  <CommunityElectionsSection
                    formData={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                </div>

                {/* Adding People & Posting */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Members & Posting</h2>
                      <p className="text-xs text-muted-foreground">Manage member permissions</p>
                    </div>
                  </div>

                  <AddingPeoplePostingSection
                    formData={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Sticky Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            
            {currentStep === 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/community")}
                className="flex-1"
              >
                Cancel
              </Button>
            )}

            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={goToNextStep}
                className="flex-1"
              >
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={onSubmit}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                Create Community
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Resume Draft Dialog */}
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 w-5 text-primary" />
              Continue Your Progress?
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              <p>You have an unsaved community draft.</p>
              {savedDraft && (
                <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                  {savedDraft.formData.name && (
                    <p className="font-medium text-foreground">
                      Community: "{savedDraft.formData.name}"
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    Progress: Step {savedDraft.currentStep} of {steps.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last saved: {formatDistanceToNow(new Date(savedDraft.savedAt), { addSuffix: true })}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleStartFresh}
              className="w-full sm:w-auto"
            >
              Start Fresh
            </Button>
            <Button
              onClick={handleContinueEditing}
              className="w-full sm:w-auto"
            >
              Continue Editing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
