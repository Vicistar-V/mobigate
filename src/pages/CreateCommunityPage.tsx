import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronRight, ChevronLeft, Loader2, Save, Users } from "lucide-react";
import { useCommunityForm } from "@/hooks/useCommunityForm";
import { CommunityImageUpload } from "@/components/community/CommunityImageUpload";
import { ClassificationSection } from "@/components/community/form/ClassificationSection";
import { LeadershipSection } from "@/components/community/form/LeadershipSection";
import { MembershipSection } from "@/components/community/form/MembershipSection";
import { MeetingsSection } from "@/components/community/form/MeetingsSection";
import { EventsActivitiesSection } from "@/components/community/form/EventsActivitiesSection";
import { GeneralSettingsSection } from "@/components/community/form/GeneralSettingsSection";
import { CommunityElectionsSection } from "@/components/community/form/CommunityElectionsSection";
import { CommunityPromotionSection } from "@/components/community/form/CommunityPromotionSection";
import { createCommunity } from "@/hooks/useCommunity";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Basics",     description: "Name, type & classification" },
  { id: 2, title: "Structure",  description: "Leadership style, positions & population strength" },
  { id: 3, title: "Operations", description: "Meetings, events & settings" },
  { id: 4, title: "Settings",   description: "Elections, promotion & finish" },
];

export default function CreateCommunityPage() {
  const navigate  = useNavigate();
  const [step,     setStep]     = useState(1);
  const [saving,   setSaving]   = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [logoImage,  setLogoImage]  = useState<string | null>(null);
  const [bannerImage,setBannerImage]= useState<string | null>(null);
  const {
    formData, errors, completedSteps,
    updateField, addPosition, removePosition, updatePosition,
    addMeeting, removeMeeting, updateMeeting,
    addEvent, removeEvent, updateEvent,
    validateStep, markStepComplete,
  } = useCommunityForm();

  const progress = Math.round((completedSteps.length / STEPS.length) * 100);

  const handleNext = () => {
    if (validateStep(step)) {
      markStepComplete(step);
      setStep(s => Math.min(s + 1, STEPS.length));
    }
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setSaving(true);
    try {
      const payload = {
        name:              formData.name,
        description:       formData.description,
        classification:    formData.classification,
        category:          formData.category,
        interest:          formData.interest,
        leadershipStyle:   formData.leadershipStyle,
        topmostOffice:     formData.topmostOffice,
        deputyOffice:      formData.deputyOffice,
        populationStrength: formData.populationStrength,
        gender:            formData.gender,
        membershipChoice:  formData.membershipChoice,
        positions:         formData.positions.map((p, i) => ({ title: p.title, adminNumber: i + 2 })),
        generalMeetings:   formData.generalMeetings,
        executiveMeetings: formData.executiveMeetings,
        meetingsDownloadFee: formData.meetingsDownloadFee,
        publicAccessFee:   formData.publicAccessFee,
        complaintBoxFee:   formData.complaintBoxFee,
        postingFee:        formData.postingFee,
        handoverTime:      formData.handoverTime,
        whoCanVote:        formData.whoCanVote,
        communityVisibility: formData.communityVisibility,
        publicGuestUsers:  formData.publicGuestUsers,
        coverImage:        coverImage  || null,
        logoImage:         logoImage   || null,
        bannerImage:       bannerImage || null,
      };

      const result = await createCommunity(payload);
      if (!result.success) throw new Error(result.error || "Failed to create community");

      toast.success(`Community created! Designation: ${result.designation}`);
      navigate(`/community/${result.community_id}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create Community</h1>
              <p className="text-sm text-muted-foreground">Step {step} of {STEPS.length}</p>
            </div>
          </div>
          <Progress value={progress} className="h-1.5 mt-3" />
        </div>

        {/* Step tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {STEPS.map(s => (
            <button key={s.id}
              onClick={() => completedSteps.includes(s.id - 1) && setStep(s.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                step === s.id
                  ? "bg-primary text-primary-foreground"
                  : completedSteps.includes(s.id)
                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                  : "bg-muted text-muted-foreground"
              )}>
              {completedSteps.includes(s.id) && <CheckCircle className="h-3 w-3" />}
              {s.title}
            </button>
          ))}
        </div>

        {/* Form card */}
        <Card>
          <CardContent className="pt-6 pb-4">
            <p className="text-sm text-muted-foreground mb-5">{STEPS[step - 1].description}</p>

            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Community Name <span className="text-destructive">*</span></Label>
                  <Input id="name" value={formData.name}
                    onChange={e => updateField("name", e.target.value)}
                    placeholder="Enter community name"
                    className={cn("h-11", errors.name && "border-destructive")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description}
                    onChange={e => updateField("description", e.target.value)}
                    placeholder="What is this community about?"
                    rows={3} />
                </div>
                {/* Cover & Logo images */}
                <div className="space-y-4 pt-2">
                  <CommunityImageUpload
                    type="cover"
                    label="Cover Image"
                    hint="Recommended: 1200×400px — shown in community cards and profile header"
                    value={coverImage}
                    onChange={setCoverImage}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <CommunityImageUpload
                      type="logo"
                      label="Community Logo"
                      hint="Square image, min 200×200px"
                      value={logoImage}
                      onChange={setLogoImage}
                    />
                    <CommunityImageUpload
                      type="banner"
                      label="Banner Image"
                      hint="Wide banner for profile page top"
                      value={bannerImage}
                      onChange={setBannerImage}
                    />
                  </div>
                </div>

                <ClassificationSection formData={formData} updateField={updateField} errors={errors} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <LeadershipSection formData={formData} updateField={updateField} errors={errors} />

                {/* Population Strength — required by validateStep(2) */}
                <div className="border-t pt-5 space-y-2">
                  <Label htmlFor="pop" className="text-sm font-medium">
                    Population Strength <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pop"
                    type="number"
                    min="1"
                    placeholder="Expected number of members"
                    value={formData.populationStrength || ""}
                    onChange={e => updateField("populationStrength", parseInt(e.target.value) || 0)}
                    className={cn("h-11", errors.populationStrength && "border-destructive")}
                  />
                  {errors.populationStrength && (
                    <p className="text-xs text-destructive">{errors.populationStrength}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Community designation (Tier-1 to Tier-10) is automatically assigned based on this number.
                  </p>
                </div>

                {/* Official Positions — required by validateStep(2) */}
                <div className="border-t pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Official Positions <span className="text-destructive">*</span>
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addPosition({ id: `pos-${Date.now()}`, title: "", adminNumber: formData.positions.length + 2 })}
                    >
                      + Add Position
                    </Button>
                  </div>
                  {errors.positions && (
                    <p className="text-xs text-destructive">{errors.positions}</p>
                  )}
                  {formData.positions.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">
                      Add at least one official position (e.g., Secretary, Treasurer).
                      The {formData.topmostOffice || "President"} is automatically Admin-1.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {formData.positions.map((pos, i) => (
                        <div key={pos.id} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-16 shrink-0">
                            Admin-{pos.adminNumber || i + 2}
                          </span>
                          <Input
                            value={pos.title}
                            onChange={e => updatePosition(pos.id, { title: e.target.value })}
                            placeholder="Position title (e.g. Secretary)"
                            className="h-9 text-sm"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 p-0 text-destructive hover:text-destructive shrink-0"
                            onClick={() => removePosition(pos.id)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <MembershipSection formData={formData} updateField={updateField} errors={errors} />
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Meeting Schedules</h3>
                  <MeetingsSection formData={formData} updateField={updateField}
                    addMeeting={addMeeting} removeMeeting={removeMeeting} updateMeeting={updateMeeting} />
                </div>
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Events & Activities</h3>
                  <EventsActivitiesSection formData={formData}
                    addEvent={addEvent} removeEvent={removeEvent} updateEvent={updateEvent} errors={errors} />
                </div>
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">General Settings</h3>
                  <GeneralSettingsSection formData={formData} updateField={updateField} errors={errors} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold mb-4">Election Settings</h3>
                  <CommunityElectionsSection formData={formData} updateField={updateField} errors={errors} />
                </div>
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Promotion & Visibility</h3>
                  <CommunityPromotionSection formData={formData} updateField={updateField} errors={errors} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex gap-2">
            {step < STEPS.length ? (
              <Button onClick={handleNext}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={saving} className="bg-green-600 hover:bg-green-700">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                {saving ? "Creating..." : "Create Community"}
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
