import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCommunityForm } from "@/hooks/useCommunityForm";
import { ClassificationSection } from "@/components/community/form/ClassificationSection";
import { MembershipSection } from "@/components/community/form/MembershipSection";
import { LeadershipSection } from "@/components/community/form/LeadershipSection";
import { AdministrationSection } from "@/components/community/form/AdministrationSection";
import { MeetingsSection } from "@/components/community/form/MeetingsSection";
import { OfficesPositionsSection } from "@/components/community/form/OfficesPositionsSection";

export default function CreateCommunity() {
  const navigate = useNavigate();
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
    handleSubmit,
  } = useCommunityForm();

  const [activeSection, setActiveSection] = useState<string>("classification");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = handleSubmit();
    if (success) {
      navigate("/community");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/community")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create New Community</h1>
              <p className="text-sm text-muted-foreground">
                Fill in the details to create your community
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit}>
            {/* Community Identity Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Community Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Community Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter community name..."
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">
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
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.shortDescription.length}/200 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information */}
          <Card>
            <CardHeader>
              <CardTitle>Community Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion
                type="single"
                collapsible
                value={activeSection}
                onValueChange={setActiveSection}
                className="w-full"
              >
                <AccordionItem value="classification">
                  <AccordionTrigger className="text-base font-semibold">
                    Classification & Type
                    {(errors.classification || errors.category || errors.designation) && (
                      <span className="ml-2 text-destructive">*</span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ClassificationSection
                      formData={formData}
                      updateField={updateField}
                      errors={errors}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="membership">
                  <AccordionTrigger className="text-base font-semibold">
                    Membership & Gender
                    {errors.populationStrength && (
                      <span className="ml-2 text-destructive">*</span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <MembershipSection
                      formData={formData}
                      updateField={updateField}
                      errors={errors}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="leadership">
                  <AccordionTrigger className="text-base font-semibold">
                    Leadership Style & Offices
                    {errors.leadershipStyle && (
                      <span className="ml-2 text-destructive">*</span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <LeadershipSection
                      formData={formData}
                      updateField={updateField}
                      errors={errors}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="administration">
                  <AccordionTrigger className="text-base font-semibold">
                    Administration & Leadership
                  </AccordionTrigger>
                  <AccordionContent>
                    <AdministrationSection
                      formData={formData}
                      updateField={updateField}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="meetings">
                  <AccordionTrigger className="text-base font-semibold">
                    Meetings & Gatherings
                  </AccordionTrigger>
                  <AccordionContent>
                    <MeetingsSection
                      formData={formData}
                      updateField={updateField}
                      addMeeting={addMeeting}
                      removeMeeting={removeMeeting}
                      updateMeeting={updateMeeting}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="positions">
                  <AccordionTrigger className="text-base font-semibold">
                    Offices & Positions
                    {errors.positions && (
                      <span className="ml-2 text-destructive">*</span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <OfficesPositionsSection
                      formData={formData}
                      addPosition={addPosition}
                      removePosition={removePosition}
                      updatePosition={updatePosition}
                      errors={errors}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/community")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4" />
              Create Community
            </Button>
          </div>
        </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
