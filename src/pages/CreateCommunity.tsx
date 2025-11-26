import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Building, Users, Calendar, Settings } from "lucide-react";
import { useCommunityForm } from "@/hooks/useCommunityForm";
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

export default function CreateCommunity() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const {
    formData,
    errors,
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
  } = useCommunityForm();

  const progressPercentage = (currentStep / steps.length) * 100;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = handleSubmit();
    if (success) {
      navigate("/community");
    }
  };

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-6 pb-24">
        <div className="max-w-3xl mx-auto">
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
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={progressPercentage} className="h-2 mb-4" />
            
            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2">
              {steps.map((step) => {
                const StepIcon = step.icon;
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(step.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all",
                      isCurrent && "bg-primary/10",
                      !isCurrent && "hover:bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        isCompleted && "bg-primary text-primary-foreground",
                        isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                        !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs font-medium",
                      isCurrent && "text-primary",
                      !isCurrent && "text-muted-foreground"
                    )}>
                      {step.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={onSubmit}>
            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* Community Identity */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Community Identity</h2>
                      <p className="text-xs text-muted-foreground">Basic information about your community</p>
                    </div>
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
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Classification & Type</h2>
                      <p className="text-xs text-muted-foreground">Define your community's category</p>
                    </div>
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
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Leadership Style</h2>
                      <p className="text-xs text-muted-foreground">Choose how leaders are selected</p>
                    </div>
                  </div>

                  <LeadershipSection
                    formData={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                </div>

                {/* Administration */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Administration</h2>
                      <p className="text-xs text-muted-foreground">Set administrative parameters</p>
                    </div>
                  </div>

                  <AdministrationSection
                    formData={formData}
                    updateField={updateField}
                  />
                </div>

                {/* Offices & Positions */}
                <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Offices & Positions</h2>
                      <p className="text-xs text-muted-foreground">Add leadership positions</p>
                    </div>
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
    </div>
  );
}
