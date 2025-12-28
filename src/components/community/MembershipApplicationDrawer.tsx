import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, CheckCircle2, Loader2, X } from "lucide-react";
import { howHeardOptions, genderOptions, nigerianStates } from "@/data/membershipData";

interface MembershipApplicationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MembershipApplicationDrawer({
  open,
  onOpenChange,
}: MembershipApplicationDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    stateOfOrigin: "",
    cityOfResidence: "",
    occupation: "",
    howHeard: "",
    sponsorName: "",
    motivation: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateReferenceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `APP-${year}-${random}`;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setReferenceNumber(generateReferenceNumber());
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      stateOfOrigin: "",
      cityOfResidence: "",
      occupation: "",
      howHeard: "",
      sponsorName: "",
      motivation: "",
    });
    setPhotoPreview(null);
    setAcceptTerms(false);
    onOpenChange(false);
  };

  const isFormValid = 
    formData.fullName && 
    formData.email && 
    formData.phone && 
    formData.gender &&
    formData.motivation && 
    acceptTerms;

  if (isSubmitted) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[85vh]">
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Application Submitted</h2>
            <p className="text-muted-foreground mb-4">
              Your membership application is pending review by the community administrators.
            </p>
            <div className="bg-muted/50 rounded-lg px-4 py-3 mb-4">
              <p className="text-sm text-muted-foreground">Reference Number</p>
              <p className="font-mono font-semibold text-lg">{referenceNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              You will receive a notification once your application is approved.
            </p>
            <Button onClick={handleClose} className="w-full bg-cyan-600 hover:bg-cyan-700">
              Close
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col touch-auto overflow-hidden">
        <DrawerHeader className="bg-zinc-900 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-white">Apply for Membership</DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-zinc-800"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto min-h-0 touch-auto p-4 space-y-4">
          {/* Photo Upload */}
          <div className="flex flex-col items-center mb-4">
            <Label className="mb-2 text-sm">Passport Photograph</Label>
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-dashed border-muted-foreground/50">
                <AvatarImage src={photoPreview || undefined} />
                <AvatarFallback className="bg-muted">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tap to upload</p>
          </div>

          {/* Personal Information */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="fullName" className="text-sm">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="dob" className="text-sm">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm">State of Origin</Label>
              <Select
                value={formData.stateOfOrigin}
                onValueChange={(value) => handleInputChange("stateOfOrigin", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="city" className="text-sm">City/Town of Residence</Label>
              <Input
                id="city"
                placeholder="Enter your city or town"
                value={formData.cityOfResidence}
                onChange={(e) => handleInputChange("cityOfResidence", e.target.value)}
              />
            </div>
          </div>

          {/* Professional */}
          <div>
            <Label htmlFor="occupation" className="text-sm">Occupation/Profession</Label>
            <Input
              id="occupation"
              placeholder="Enter your occupation"
              value={formData.occupation}
              onChange={(e) => handleInputChange("occupation", e.target.value)}
            />
          </div>

          {/* Community Connection */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm">How did you hear about us?</Label>
              <Select
                value={formData.howHeard}
                onValueChange={(value) => handleInputChange("howHeard", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {howHeardOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sponsor" className="text-sm">Sponsor/Guarantor (Optional)</Label>
              <Input
                id="sponsor"
                placeholder="Name of existing member recommending you"
                value={formData.sponsorName}
                onChange={(e) => handleInputChange("sponsorName", e.target.value)}
              />
            </div>
          </div>

          {/* Motivation */}
          <div>
            <Label htmlFor="motivation" className="text-sm">Why do you want to join? *</Label>
            <Textarea
              id="motivation"
              placeholder="Tell us why you want to be part of this community (max 200 words)"
              value={formData.motivation}
              onChange={(e) => handleInputChange("motivation", e.target.value)}
              className="min-h-[100px]"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.motivation.split(/\s+/).filter(Boolean).length}/200 words
            </p>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2 py-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
              I accept the community's Terms & Conditions and agree to abide by the community rules
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
