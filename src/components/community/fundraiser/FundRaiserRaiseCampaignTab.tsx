import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FundRaiserHeader } from "./FundRaiserHeader";
import { RequestAudienceSection } from "./RequestAudienceSection";
import { MediaGalleryUpload } from "./MediaGalleryUpload";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PersonalBankDetails, CampaignMediaItem, urgencyLevels } from "@/data/fundraiserData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const FundRaiserRaiseCampaignTab = () => {
  const { toast } = useToast();
  
  const [personalDetails, setPersonalDetails] = useState<PersonalBankDetails>({
    name: "John Doe",
    address: "",
    city: "",
    state: "",
    country: "",
    telephone: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    swiftCode: "",
  });

  const [requestDetails, setRequestDetails] = useState({
    theme: "",
    amount: "",
    currency: "USD",
    urgencyLevels: [] as string[],
    customUrgency: "",
    hasTimeFrame: false,
    timeFrame: "",
    moreDetails: "",
    hasEvidence: false,
  });

  const [mediaItems, setMediaItems] = useState<CampaignMediaItem[]>([]);
  const [audience, setAudience] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const toggleUrgencyLevel = (level: string) => {
    if (requestDetails.urgencyLevels.includes(level)) {
      setRequestDetails({
        ...requestDetails,
        urgencyLevels: requestDetails.urgencyLevels.filter((l) => l !== level),
      });
    } else {
      setRequestDetails({
        ...requestDetails,
        urgencyLevels: [...requestDetails.urgencyLevels, level],
      });
    }
  };

  const handleSavePersonalDetails = () => {
    toast({
      title: "Personal Details Saved",
      description: "Your information has been saved successfully",
    });
  };

  const handleSubmit = () => {
    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms before submitting",
        variant: "destructive",
      });
      return;
    }

    if (!requestDetails.theme || !requestDetails.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Campaign Submitted!",
      description: "Your fundraiser campaign has been created successfully. You will receive your campaign ID via email.",
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <FundRaiserHeader />

      {/* Confirm Personal Details Section */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 border-b pb-2">
          Confirm Personal Details
        </h3>
        
        <div className="space-y-4">
          {/* NAME */}
          <div>
            <Label>NAME [in full]</Label>
            <Input
              value={personalDetails.name}
              onChange={(e) =>
                setPersonalDetails({ ...personalDetails, name: e.target.value })
              }
              placeholder="System Generated"
              className="bg-muted"
            />
          </div>

          {/* ADDRESS */}
          <div>
            <Label>ADDRESS</Label>
            <Input
              value={personalDetails.address}
              onChange={(e) =>
                setPersonalDetails({ ...personalDetails, address: e.target.value })
              }
              placeholder="Enter your address"
            />
          </div>

          {/* CITY and STATE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>CITY</Label>
              <Input
                value={personalDetails.city}
                onChange={(e) =>
                  setPersonalDetails({ ...personalDetails, city: e.target.value })
                }
                placeholder="City"
              />
            </div>
            <div>
              <Label>STATE</Label>
              <Input
                value={personalDetails.state}
                onChange={(e) =>
                  setPersonalDetails({ ...personalDetails, state: e.target.value })
                }
                placeholder="State"
              />
            </div>
          </div>

          {/* COUNTRY and TELEPHONE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>COUNTRY</Label>
              <Select
                value={personalDetails.country}
                onValueChange={(value) =>
                  setPersonalDetails({ ...personalDetails, country: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nigeria">Nigeria</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>TELEPHONE</Label>
              <Input
                value={personalDetails.telephone}
                onChange={(e) =>
                  setPersonalDetails({ ...personalDetails, telephone: e.target.value })
                }
                placeholder="Phone number"
              />
            </div>
          </div>

          {/* BANK NAME */}
          <div>
            <Label>BANK NAME</Label>
            <Input
              value={personalDetails.bankName}
              onChange={(e) =>
                setPersonalDetails({ ...personalDetails, bankName: e.target.value })
              }
              placeholder="Enter bank name"
            />
          </div>

          {/* ACCOUNT NUMBER and ACCOUNT NAME */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>ACCOUNT NUMBER</Label>
              <Input
                value={personalDetails.accountNumber}
                onChange={(e) =>
                  setPersonalDetails({
                    ...personalDetails,
                    accountNumber: e.target.value,
                  })
                }
                placeholder="Account number"
              />
            </div>
            <div>
              <Label>ACCOUNT NAME</Label>
              <Input
                value={personalDetails.accountName}
                onChange={(e) =>
                  setPersonalDetails({
                    ...personalDetails,
                    accountName: e.target.value,
                  })
                }
                placeholder="Account name"
              />
            </div>
          </div>

          {/* BANK SWIFT CODE */}
          <div>
            <Label>BANK SWIFT CODE (Optional)</Label>
            <Input
              value={personalDetails.swiftCode}
              onChange={(e) =>
                setPersonalDetails({ ...personalDetails, swiftCode: e.target.value })
              }
              placeholder="SWIFT/BIC code"
            />
          </div>

          <Button onClick={handleSavePersonalDetails} className="w-full">
            SAVE
          </Button>
        </div>
      </Card>

      {/* Request Details Section */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 border-b pb-2">
          Request Details
        </h3>

        <div className="space-y-4">
          {/* REQUEST THEME */}
          <div>
            <Label>ADD REQUEST THEME:</Label>
            <Input
              value={requestDetails.theme}
              onChange={(e) =>
                setRequestDetails({ ...requestDetails, theme: e.target.value })
              }
              placeholder="Enter campaign theme"
            />
          </div>

          {/* AMOUNT REQUESTING FOR */}
          <div>
            <Label>AMOUNT REQUESTING FOR:</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={requestDetails.amount}
                onChange={(e) =>
                  setRequestDetails({ ...requestDetails, amount: e.target.value })
                }
                placeholder="Enter amount"
                className="flex-1"
              />
              <Select
                value={requestDetails.currency}
                onValueChange={(value) =>
                  setRequestDetails({ ...requestDetails, currency: value })
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar</SelectItem>
                  <SelectItem value="NGN">Naira</SelectItem>
                  <SelectItem value="MOBI">Mobi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* URGENCY LEVEL */}
          <div>
            <Label className="mb-3 block">URGENCY LEVEL:</Label>
            <div className="grid grid-cols-2 gap-3">
              {urgencyLevels.map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <Checkbox
                    checked={requestDetails.urgencyLevels.includes(level)}
                    onCheckedChange={() => toggleUrgencyLevel(level)}
                  />
                  <span className="text-sm">{level}</span>
                </div>
              ))}
            </div>
            {requestDetails.urgencyLevels.includes("Other") && (
              <Input
                value={requestDetails.customUrgency}
                onChange={(e) =>
                  setRequestDetails({
                    ...requestDetails,
                    customUrgency: e.target.value,
                  })
                }
                placeholder="Specify urgency"
                className="mt-3"
              />
            )}
          </div>

          {/* TIME-FRAME */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={requestDetails.hasTimeFrame}
              onCheckedChange={(checked) =>
                setRequestDetails({
                  ...requestDetails,
                  hasTimeFrame: checked as boolean,
                })
              }
            />
            <Label>ANY TIME-FRAME?</Label>
          </div>
          {requestDetails.hasTimeFrame && (
            <Input
              value={requestDetails.timeFrame}
              onChange={(e) =>
                setRequestDetails({ ...requestDetails, timeFrame: e.target.value })
              }
              placeholder="e.g., 60 days"
            />
          )}

          {/* MORE DETAILS */}
          <div>
            <Label>PROVIDE MORE DETAILS:</Label>
            <Textarea
              value={requestDetails.moreDetails}
              onChange={(e) =>
                setRequestDetails({ ...requestDetails, moreDetails: e.target.value })
              }
              placeholder="Explain your situation in detail..."
              rows={5}
            />
          </div>

          {/* EVIDENCE CHECKBOX */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={requestDetails.hasEvidence}
              onCheckedChange={(checked) =>
                setRequestDetails({
                  ...requestDetails,
                  hasEvidence: checked as boolean,
                })
              }
            />
            <Label>ANY AVAILABLE PHOTOS OR VIDEO EVIDENCE?</Label>
          </div>
        </div>
      </Card>

      {/* Media Gallery (if has evidence) */}
      {requestDetails.hasEvidence && (
        <MediaGalleryUpload items={mediaItems} onItemsChange={setMediaItems} />
      )}

      {/* Request Audience Section */}
      <RequestAudienceSection
        selectedAudience={audience}
        onAudienceChange={setAudience}
      />

      {/* Submission Section */}
      <Card className="p-6">
        <p className="text-sm font-semibold mb-4 text-center">
          I UNDERSTAND MOBIGATE WILL CHARGE MY WALLET A TOKEN OF{" "}
          <span className="text-primary">1000 Mobi</span> FOR THIS REQUEST
        </p>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <Checkbox
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <Button variant="outline" size="sm">
            Agree
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Checkbox />
          <Button
            onClick={handleSubmit}
            className="bg-black text-white hover:bg-black/90 font-bold px-8"
          >
            SUBMIT NOW
          </Button>
        </div>
      </Card>

      {/* Ads */}
      <PremiumAdRotation
        slotId="fundraiser-raise-ad"
        ads={[]}
        context="feed"
      />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
