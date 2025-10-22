import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Eye, Save, Info, AlertCircle, Lock, Unlock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  AdvertCategory, 
  AdvertType, 
  AdvertSize, 
  DPDPackageId,
  DisplayMode,
  MultipleDisplayCount,
  CatchmentMarket,
  SubscriptionDuration,
  getAdvertType,
  getDisplayMode,
  getMultipleCount
} from "@/types/advert";
import { calculateAdvertPricing, getRequiredFileCount, getSizeFeeDescription } from "@/lib/advertPricing";
import { saveAdvert, saveAdvertDraft, loadAdvertDraft, clearAdvertDraft } from "@/lib/advertStorage";
import { AdvertPricingCard } from "@/components/advert/AdvertPricingCard";
import { FilePreviewGrid } from "@/components/advert/FilePreviewGrid";
import { AdvertPreviewDialog } from "@/components/advert/AdvertPreviewDialog";
import { DisplayModeCard } from "@/components/advert/DisplayModeCard";
import { MultipleCountCard } from "@/components/advert/MultipleCountCard";
import { AccreditedAdvertiserBadge } from "@/components/advert/AccreditedAdvertiserBadge";
import { VolumeDiscountInfo } from "@/components/advert/VolumeDiscountInfo";
import { getUserDiscountProfile } from "@/data/discountData";

const advertCategories = [
  { value: "pictorial" as AdvertCategory, label: "Pictorial/Photo Ads" },
  { value: "video" as AdvertCategory, label: "Videos/Dynamic Ads" }
];

const advertTypes = [
  { value: "single" as AdvertType, label: "Single Display", requiredFiles: 1 },
  { value: "multiple-2" as AdvertType, label: "2-in-1 Multiple Displays", requiredFiles: 2 },
  { value: "multiple-3" as AdvertType, label: "3-in-1 Multiple Displays", requiredFiles: 3 },
  { value: "multiple-4" as AdvertType, label: "4-in-1 Multiple Displays", requiredFiles: 4 },
  { value: "multiple-5" as AdvertType, label: "5-in-1 Multiple Displays", requiredFiles: 5 },
  { value: "multiple-6" as AdvertType, label: "6-in-1 Multiple Displays", requiredFiles: 6 },
  { value: "multiple-7" as AdvertType, label: "7-in-1 Multiple Displays", requiredFiles: 7 },
  { value: "multiple-8" as AdvertType, label: "8-in-1 Multiple Displays", requiredFiles: 8 },
  { value: "multiple-9" as AdvertType, label: "9-in-1 Multiple Displays", requiredFiles: 9 },
  { value: "multiple-10" as AdvertType, label: "10-in-1 Multiple Displays", requiredFiles: 10 }
];

const advertSizes = [
  { value: "2x3" as AdvertSize, label: "2x3 - 1/5 Screen Height x Half Screen Width" },
  { value: "2x6" as AdvertSize, label: "2x6 - 1/5 Screen Height x Full Screen Width" },
  { value: "2.5x3" as AdvertSize, label: "2.5x3 - Quarter Screen Height x Half Screen Width" },
  { value: "2.5x6" as AdvertSize, label: "2.5x6 - Quarter Screen Height x Full Screen Width" },
  { value: "3.5x3" as AdvertSize, label: "3.5x3 - 1/3 Screen Height x Half Screen Width" },
  { value: "3.5x6" as AdvertSize, label: "3.5x6 - 1/3 Screen Height x Full Screen Width" },
  { value: "5x6" as AdvertSize, label: "5x6 - Half Screen Height x Full Screen Width" },
  { value: "6.5x3" as AdvertSize, label: "6.5x3 - 2/3 Screen Height x Half Screen Width" },
  { value: "6.5x6" as AdvertSize, label: "6.5x6 - 2/3 Screen Height x Full Screen Width" },
  { value: "10x6" as AdvertSize, label: "10x6 - Full Screen Height x Full Screen Width" }
];

const dpdPackages = [
  { value: "basic" as DPDPackageId, label: "Basic: 1,000 DPD @ ₦10,000 / 10,000 Mobi" },
  { value: "standard" as DPDPackageId, label: "Standard: 2,000 DPD @ ₦20,000 / 20,000 Mobi" },
  { value: "professional" as DPDPackageId, label: "Professional: 3,000 DPD @ ₦30,000 / 30,000 Mobi" },
  { value: "business" as DPDPackageId, label: "Business: 4,000 DPD @ ₦40,000 / 40,000 Mobi" },
  { value: "enterprise" as DPDPackageId, label: "Enterprise: 5,000 DPD @ ₦50,000 / 50,000 Mobi" },
  { value: "entrepreneur" as DPDPackageId, label: "Entrepreneur: 6,000 DPD @ ₦60,000 / 60,000 Mobi" },
  { value: "deluxe" as DPDPackageId, label: "Deluxe: 7,000 DPD @ ₦70,000 / 70,000 Mobi" },
  { value: "deluxe-super" as DPDPackageId, label: "Deluxe Super: 8,000 DPD @ ₦80,000 / 80,000 Mobi" },
  { value: "deluxe-super-plus" as DPDPackageId, label: "Deluxe Super Plus: 9,000 DPD @ ₦90,000 / 90,000 Mobi" },
  { value: "deluxe-silver" as DPDPackageId, label: "Deluxe Silver: 10,000 DPD @ ₦100,000 / 100,000 Mobi" },
  { value: "deluxe-bronze" as DPDPackageId, label: "Deluxe Bronze: 12,000 DPD @ ₦120,000 / 120,000 Mobi" },
  { value: "deluxe-gold" as DPDPackageId, label: "Deluxe Gold: 14,000 DPD @ ₦140,000 / 140,000 Mobi" },
  { value: "deluxe-gold-plus" as DPDPackageId, label: "Deluxe Gold Plus: 16,000 DPD @ ₦160,000 / 160,000 Mobi" },
  { value: "deluxe-diamond" as DPDPackageId, label: "Deluxe Diamond: 18,000 DPD @ ₦180,000 / 180,000 Mobi" },
  { value: "deluxe-diamond-plus" as DPDPackageId, label: "Deluxe Diamond Plus: 20,000 DPD @ ₦200,000 / 200,000 Mobi" },
  { value: "deluxe-platinum" as DPDPackageId, label: "Deluxe Platinum: 25,000 DPD @ ₦250,000 / 250,000 Mobi" },
  { value: "deluxe-platinum-plus" as DPDPackageId, label: "Deluxe Platinum Plus: 30,000 DPD @ ₦300,000 / 300,000 Mobi" },
  { value: "bumper-gold" as DPDPackageId, label: "Bumper Gold: 35,000 DPD @ ₦350,000 / 350,000 Mobi" },
  { value: "bumper-diamond" as DPDPackageId, label: "Bumper Diamond: 40,000 DPD @ ₦400,000 / 400,000 Mobi" },
  { value: "bumper-platinum" as DPDPackageId, label: "Bumper Platinum: 45,000 DPD @ ₦450,000 / 450,000 Mobi" },
  { value: "bumper-infinity" as DPDPackageId, label: "Bumper Infinity: 50,000 DPD @ ₦500,000 / 500,000 Mobi" },
  { value: "unlimited" as DPDPackageId, label: "Unlimited: Unlimited DPD @ ₦600,000 / 600,000 Mobi" }
];

const extendedExposure = [
  { value: "extra-1", label: "Extra 1 minute @ Additional 12%" },
  { value: "extra-2", label: "Extra 2 minutes @ Additional 14%" },
  { value: "extra-3", label: "Extra 3 minutes @ Additional 16%" },
  { value: "extra-4", label: "Extra 4 minutes @ Additional 18%" },
  { value: "extra-5", label: "Extra 5 minutes @ Additional 20%" },
  { value: "extra-6", label: "Extra 6 minutes @ Additional 22%" },
  { value: "extra-7", label: "Extra 7 minutes @ Additional 24%" },
  { value: "extra-8", label: "Extra 8 minutes @ Additional 26%" },
  { value: "extra-9", label: "Extra 9 minutes @ Additional 28%" },
  { value: "extra-10", label: "Extra 10 minutes @ Additional 30%" }
];

const recurrentExposureAfter = [
  { value: "after-10m", label: "Repeat after 10 minutes @ Additional 10%" },
  { value: "after-30m", label: "Repeat after 30 minutes @ Additional 10%" },
  { value: "after-1h", label: "Repeat after 1 hour @ Additional 10%" },
  { value: "after-3h", label: "Repeat after 3 hours @ Additional 10%" },
  { value: "after-6h", label: "Repeat after 6 hours @ Additional 10%" },
  { value: "after-12h", label: "Repeat after 12 hours @ Additional 10%" },
  { value: "after-18h", label: "Repeat after 18 hours @ Additional 10%" },
  { value: "after-24h", label: "Repeat after 24 hours @ Additional 10%" }
];

const recurrentExposureEvery = [
  { value: "every-10m", label: "Repeat every 10 minutes @ Additional 35%" },
  { value: "every-30m", label: "Repeat every 30 minutes @ Additional 30%" },
  { value: "every-1h", label: "Repeat every 1 hour @ Additional 25%" },
  { value: "every-3h", label: "Repeat every 3 hours @ Additional 20%" },
  { value: "every-6h", label: "Repeat every 6 hours @ Additional 15%" },
  { value: "every-12h", label: "Repeat every 12 hours @ Additional 12%" },
  { value: "every-18h", label: "Repeat every 18 hours @ Additional 10%" },
  { value: "every-24h", label: "Repeat every 24 hours @ Additional 9%" },
  { value: "every-30h", label: "Repeat every 30 hours @ Additional 8%" },
  { value: "every-36h", label: "Repeat every 36 hours @ Additional 7%" },
  { value: "every-42h", label: "Repeat every 42 hours @ Additional 6%" },
  { value: "every-48h", label: "Repeat every 48 hours @ Additional 5%" }
];

const subscriptionDurations = [
  { value: 1 as SubscriptionDuration, label: "1 Month (30 Days)", discount: 0 },
  { value: 3 as SubscriptionDuration, label: "3 Months (90 Days)", discount: 0 },
  { value: 4 as SubscriptionDuration, label: "4 Months (120 Days)", discount: 0 },
  { value: 6 as SubscriptionDuration, label: "6 Months (180 Days)", discount: 5 },
  { value: 9 as SubscriptionDuration, label: "9 Months (270 Days)", discount: 7 },
  { value: 12 as SubscriptionDuration, label: "12 Months (360 Days)", discount: 10 },
  { value: 18 as SubscriptionDuration, label: "18 Months (540 Days)", discount: 12 },
  { value: 24 as SubscriptionDuration, label: "24 Months (720 Days)", discount: 15 },
];

export default function SubmitAdvert() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get user discount profile (mock data for now)
  const userProfile = getUserDiscountProfile("current-user");
  
  const [category, setCategory] = useState<AdvertCategory | undefined>();
  const [displayMode, setDisplayMode] = useState<DisplayMode | undefined>();
  const [multipleCount, setMultipleCount] = useState<MultipleDisplayCount | undefined>();
  const [type, setType] = useState<AdvertType | undefined>();
  const [size, setSize] = useState<AdvertSize | undefined>();
  const [dpdPackage, setDpdPackage] = useState<DPDPackageId | undefined>();
  const [subscriptionMonths, setSubscriptionMonths] = useState<SubscriptionDuration>(1);
  const [extendedExposureTime, setExtendedExposureTime] = useState("");
  const [recurrentAfter, setRecurrentAfter] = useState("");
  const [recurrentEvery, setRecurrentEvery] = useState("");
  const [launchDate, setLaunchDate] = useState<Date>();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [catchmentLocked, setCatchmentLocked] = useState(() => {
    const saved = localStorage.getItem('advert-catchment-locked');
    return saved ? JSON.parse(saved) : false;
  });

  // Update type when displayMode or multipleCount changes
  useEffect(() => {
    if (displayMode) {
      const newType = getAdvertType(displayMode, multipleCount);
      setType(newType);
    }
  }, [displayMode, multipleCount]);

  // Catchment market percentages and age range
  const [catchmentMarket, setCatchmentMarket] = useState<CatchmentMarket>({
    ownCity: 20,
    ownState: 25,
    ownCountry: 25,
    foreignCountries: 10,
    popularSearches: 5,
    random: 5,
    others: 10,
    ageRange: {
      min: 28,
      max: 78
    }
  });

  // Local state for age range inputs (allows free typing)
  const [ageInputs, setAgeInputs] = useState({
    min: (catchmentMarket.ageRange?.min || 28).toString(),
    max: (catchmentMarket.ageRange?.max || 78).toString()
  });

  // Sync age inputs with catchmentMarket changes
  useEffect(() => {
    setAgeInputs({
      min: (catchmentMarket.ageRange?.min || 28).toString(),
      max: (catchmentMarket.ageRange?.max || 78).toString()
    });
  }, [catchmentMarket.ageRange?.min, catchmentMarket.ageRange?.max]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Persist catchment lock state
  useEffect(() => {
    localStorage.setItem('advert-catchment-locked', JSON.stringify(catchmentLocked));
  }, [catchmentLocked]);

  // Load draft on mount
  useEffect(() => {
    const draft = loadAdvertDraft();
    if (draft) {
      if (draft.category) setCategory(draft.category as AdvertCategory);
      if (draft.type) {
        const loadedType = draft.type as AdvertType;
        setType(loadedType);
        setDisplayMode(getDisplayMode(loadedType));
        const count = getMultipleCount(loadedType);
        if (count) setMultipleCount(count);
      }
      if (draft.size) setSize(draft.size as AdvertSize);
      if (draft.dpdPackage) setDpdPackage(draft.dpdPackage as DPDPackageId);
      if (draft.subscriptionMonths) setSubscriptionMonths(draft.subscriptionMonths as SubscriptionDuration);
      if (draft.extendedExposure) setExtendedExposureTime(draft.extendedExposure);
      if (draft.recurrentAfter) setRecurrentAfter(draft.recurrentAfter);
      if (draft.recurrentEvery) setRecurrentEvery(draft.recurrentEvery);
      if (draft.launchDate) setLaunchDate(new Date(draft.launchDate));
      if (draft.catchmentMarket) setCatchmentMarket(draft.catchmentMarket);
      if (draft.agreed) setAgreed(draft.agreed);
      
      toast({
        title: "Draft loaded",
        description: "Your previous draft has been restored.",
      });
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (category || type || size || dpdPackage) {
        if (displayMode && type) {
          saveAdvertDraft({
            category,
            displayMode,
            multipleCount,
            type,
            size,
            dpdPackage,
            subscriptionMonths,
            extendedExposure: extendedExposureTime,
            recurrentAfter,
            recurrentEvery,
            launchDate,
            catchmentMarket,
            agreed,
            files: []
          });
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [category, displayMode, multipleCount, type, size, dpdPackage, subscriptionMonths, extendedExposureTime, recurrentAfter, recurrentEvery, launchDate, catchmentMarket, agreed]);

  const updateCatchmentMarket = (field: keyof typeof catchmentMarket, value: number[]) => {
    if (catchmentLocked) return;
    setCatchmentMarket(prev => ({
      ...prev,
      [field]: value[0]
    }));
  };

  const updateCatchmentMarketInput = (field: keyof typeof catchmentMarket, value: string) => {
    if (catchmentLocked) return;
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numValue));
    setCatchmentMarket(prev => ({
      ...prev,
      [field]: clampedValue
    }));
  };

  const catchmentTotal = Object.entries(catchmentMarket)
    .filter(([key]) => key !== 'ageRange')
    .reduce((sum, [, value]) => sum + (value as number), 0);

  const getRequiredFiles = () => {
    if (!type) return 1;
    return getRequiredFileCount(type);
  };

  const isMultipleDisplay = displayMode === "multiple";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const requiredFiles = getRequiredFiles();
      
      if (files.length > requiredFiles) {
        toast({
          title: "Too many files",
          description: `Please select exactly ${requiredFiles} file(s) for ${type} display.`,
          variant: "destructive",
        });
        return;
      }
      
      setUploadedFiles(files);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    if (displayMode && type) {
      saveAdvertDraft({
        category,
        displayMode,
        multipleCount,
        type,
        size,
        dpdPackage,
        subscriptionMonths,
        extendedExposure: extendedExposureTime,
        recurrentAfter,
        recurrentEvery,
        launchDate,
        catchmentMarket,
        agreed,
        files: []
      });
      
      toast({
        title: "Draft saved",
        description: "Your advert draft has been saved successfully.",
      });
    }
  };

  const validateForm = () => {
    if (!category) {
      toast({
        title: "Validation Error",
        description: "Please select an advert category",
        variant: "destructive",
      });
      return false;
    }

    if (!displayMode) {
      toast({
        title: "Validation Error",
        description: "Please select display mode (Single or Multiple)",
        variant: "destructive",
      });
      return false;
    }

    if (displayMode === "multiple" && !multipleCount) {
      toast({
        title: "Validation Error",
        description: "Please select the number of multiple displays",
        variant: "destructive",
      });
      return false;
    }

    if (!type) {
      toast({
        title: "Validation Error",
        description: "Display type could not be determined",
        variant: "destructive",
      });
      return false;
    }

    if (!size) {
      toast({
        title: "Validation Error",
        description: "Please select advert size",
        variant: "destructive",
      });
      return false;
    }

    if (!dpdPackage) {
      toast({
        title: "Validation Error",
        description: "Please select a DPD package",
        variant: "destructive",
      });
      return false;
    }

    const requiredFiles = getRequiredFiles();
    if (uploadedFiles.length !== requiredFiles) {
      toast({
        title: "Validation Error",
        description: `Please upload exactly ${requiredFiles} file(s) for ${type} display`,
        variant: "destructive",
      });
      return false;
    }

    if (catchmentTotal !== 100) {
      toast({
        title: "Validation Error",
        description: `Catchment market percentages must total 100% (current: ${catchmentTotal}%)`,
        variant: "destructive",
      });
      return false;
    }

    if (!agreed) {
      toast({
        title: "Validation Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const pricing = calculateAdvertPricing(
        category as AdvertCategory,
        type as AdvertType,
        size as AdvertSize,
        dpdPackage as DPDPackageId,
        subscriptionMonths,
        extendedExposureTime,
        recurrentAfter,
        recurrentEvery,
        userProfile.accreditedTier,
        userProfile.activeAdverts
      );

      const advert = saveAdvert(
        {
          category: category as AdvertCategory,
          displayMode: displayMode as DisplayMode,
          multipleCount,
          type: type as AdvertType,
          size: size as AdvertSize,
          dpdPackage: dpdPackage as DPDPackageId,
          subscriptionMonths,
          extendedExposure: extendedExposureTime,
          recurrentAfter,
          recurrentEvery,
          catchmentMarket,
          launchDate,
          files: uploadedFiles,
          agreed
        },
        pricing
      );

      toast({
        title: "Success!",
        description: "Your advert has been submitted for review. You'll be notified once it's approved.",
      });

      // Navigate to My Adverts page
      navigate("/my-adverts");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit advert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    if (!category || !type || !size || uploadedFiles.length === 0) {
      toast({
        title: "Cannot Preview",
        description: "Please select category, type, size, and upload at least one file to preview.",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  const pricing = category && type && size && dpdPackage ? calculateAdvertPricing(
    category as AdvertCategory,
    type as AdvertType,
    size as AdvertSize,
    dpdPackage as DPDPackageId,
    subscriptionMonths,
    extendedExposureTime,
    recurrentAfter,
    recurrentEvery,
    userProfile.accreditedTier,
    userProfile.activeAdverts
  ) : null;

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help inline-block ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        <div className="max-w-5xl mx-auto">
          {/* Main Form */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="overflow-visible">
              <CardHeader className="space-y-1 sm:space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">Create Premium Advert</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Fill in the details below to create your advertising campaign
                    </CardDescription>
                  </div>
                  <AccreditedAdvertiserBadge 
                    tier={userProfile.accreditedTier} 
                    totalCampaigns={userProfile.totalCampaigns}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 overflow-visible">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm">
                    Select Category *
                    <InfoTooltip content="Choose between static image ads or dynamic video ads" />
                  </Label>
                  <Select value={category || ""} onValueChange={(v) => setCategory(v as AdvertCategory)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Choose advert category" />
                    </SelectTrigger>
                    <SelectContent>
                      {advertCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Display Mode Selection */}
                {category && (
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Select Display Mode *
                      <InfoTooltip content="Choose whether you want a single advert or multiple adverts rotating in sequence" />
                    </Label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <DisplayModeCard
                        mode="single"
                        selected={displayMode === "single"}
                        category={category}
                        onSelect={() => {
                          setDisplayMode("single");
                          setMultipleCount(undefined);
                        }}
                      />
                      <DisplayModeCard
                        mode="multiple"
                        selected={displayMode === "multiple"}
                        category={category}
                        onSelect={() => setDisplayMode("multiple")}
                      />
                    </div>
                  </div>
                )}

                {/* Multiple Display Count Selection */}
                {category && displayMode === "multiple" && (
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Select Number of Displays *
                      <InfoTooltip content="Choose how many different adverts will rotate in your campaign" />
                    </Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                      {([2, 3, 4, 5, 6, 7, 8, 9, 10] as MultipleDisplayCount[]).map((count, index) => (
                        <MultipleCountCard
                          key={count}
                          count={count}
                          selected={multipleCount === count}
                          category={category}
                          onSelect={() => setMultipleCount(count)}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-sm">
                    Select Advert Size *
                    <InfoTooltip content="Choose the display size based on screen dimensions" />
                  </Label>
                  <Select value={size || ""} onValueChange={(v) => setSize(v as AdvertSize)}>
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Choose advert size" />
                    </SelectTrigger>
                    <SelectContent>
                      {advertSizes.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {size && type && (
                    <div className="mt-2 p-2 bg-primary/5 rounded-md border border-primary/20">
                      <p className="text-sm font-medium text-primary">
                        {getSizeFeeDescription(type, size)}
                      </p>
                    </div>
                  )}
                </div>

                {/* DPD Package Selection */}
                <div className="space-y-2">
                  <Label htmlFor="dpd" className="text-sm">
                    Select Display Per Day Package (DPD) *
                    <InfoTooltip content="DPD determines how many times your ad will be shown per day. Higher DPD means more exposure." />
                  </Label>
                  <Select value={dpdPackage || ""} onValueChange={(v) => setDpdPackage(v as DPDPackageId)}>
                    <SelectTrigger id="dpd">
                      <SelectValue placeholder="Choose DPD package" />
                    </SelectTrigger>
                    <SelectContent>
                      {dpdPackages.map((pkg) => (
                        <SelectItem key={pkg.value} value={pkg.value}>
                          {pkg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subscription Duration Selection */}
                <div className="space-y-2">
                  <Label htmlFor="subscription" className="text-sm">
                    Subscription Duration *
                    <InfoTooltip content="Choose your subscription length. Longer subscriptions get discounts on DPD costs!" />
                  </Label>
                  <Select 
                    value={subscriptionMonths.toString()} 
                    onValueChange={(v) => setSubscriptionMonths(parseInt(v) as SubscriptionDuration)}
                  >
                    <SelectTrigger id="subscription">
                      <SelectValue placeholder="Choose subscription duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {subscriptionDurations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value.toString()}>
                          <div className="flex items-center justify-between w-full gap-2">
                            <span>{duration.label}</span>
                            {duration.discount > 0 && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Save {duration.discount}%
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {subscriptionMonths > 1 && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        🎉 You're saving {subscriptionDurations.find(d => d.value === subscriptionMonths)?.discount}% on DPD costs!
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                        Total days: {subscriptionMonths * 30} days
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Extended Exposure Duration */}
                <div className="space-y-2">
                  <Label htmlFor="extended" className="text-sm">
                    Extended Exposure Duration (Optional)
                    <InfoTooltip content="Keep your ad visible for longer periods. Default exposure is 2-10 minutes." />
                  </Label>
                  <Select value={extendedExposureTime} onValueChange={setExtendedExposureTime}>
                    <SelectTrigger id="extended">
                      <SelectValue placeholder="Select extended exposure time" />
                    </SelectTrigger>
                    <SelectContent>
                      {extendedExposure.map((ext) => (
                        <SelectItem key={ext.value} value={ext.value}>
                          {ext.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Recurrent Exposure - After */}
                <div className="space-y-2">
                  <Label htmlFor="recurrent-after" className="text-sm">
                    Recurrent Exposure - Repeat After (Optional)
                    <InfoTooltip content="Show the ad again after a specific time period from the last display" />
                  </Label>
                  <Select value={recurrentAfter} onValueChange={setRecurrentAfter}>
                    <SelectTrigger id="recurrent-after">
                      <SelectValue placeholder="Select when to repeat" />
                    </SelectTrigger>
                    <SelectContent>
                      {recurrentExposureAfter.map((rec) => (
                        <SelectItem key={rec.value} value={rec.value}>
                          {rec.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Recurrent Exposure - Every */}
                <div className="space-y-2">
                  <Label htmlFor="recurrent-every" className="text-sm">
                    Recurrent Exposure - Repeat Every (Optional)
                    <InfoTooltip content="Continuously repeat the ad at regular intervals" />
                  </Label>
                  <Select value={recurrentEvery} onValueChange={setRecurrentEvery}>
                    <SelectTrigger id="recurrent-every">
                      <SelectValue placeholder="Select repeat frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {recurrentExposureEvery.map((rec) => (
                        <SelectItem key={rec.value} value={rec.value}>
                          {rec.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Catchment/Target Markets */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <Label className="text-sm">
                      Catchment/Target Markets
                      <InfoTooltip content="Distribute your ad exposure across different geographic and interest segments. Must total 100%." />
                    </Label>
                    <div className="flex items-center gap-2 justify-between sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCatchmentLocked(!catchmentLocked)}
                        className="h-7 px-2"
                      >
                        {catchmentLocked ? (
                          <Lock className="h-3 w-3 mr-1" />
                        ) : (
                          <Unlock className="h-3 w-3 mr-1" />
                        )}
                        <span className="text-xs">{catchmentLocked ? "Locked" : "Unlocked"}</span>
                      </Button>
                      <div className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap",
                        catchmentTotal === 100 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                      )}>
                        Total: {catchmentTotal}%
                      </div>
                    </div>
                  </div>

                  {/* Age Range */}
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <Label className="text-sm font-semibold mb-3 block">
                      Age Range
                      <InfoTooltip content="Target your ads to specific age groups. Select minimum and maximum age." />
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label htmlFor="min-age" className="text-xs mb-1 block">Minimum Age</Label>
                          <Input
                            id="min-age"
                            type="number"
                            value={ageInputs.min}
                            onChange={(e) => {
                              if (catchmentLocked) return;
                              setAgeInputs(prev => ({ ...prev, min: e.target.value }));
                            }}
                            onBlur={(e) => {
                              if (catchmentLocked) return;
                              const value = parseInt(e.target.value) || 28;
                              const maxAge = catchmentMarket.ageRange?.max || 78;
                              const validMin = Math.max(18, Math.min(value, maxAge - 1));
                              
                              setAgeInputs(prev => ({ ...prev, min: validMin.toString() }));
                              setCatchmentMarket(prev => ({
                                ...prev,
                                ageRange: { min: validMin, max: prev.ageRange?.max || 78 }
                              }));
                            }}
                            disabled={catchmentLocked}
                            className="h-9"
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="max-age" className="text-xs mb-1 block">Maximum Age</Label>
                          <Input
                            id="max-age"
                            type="number"
                            value={ageInputs.max}
                            onChange={(e) => {
                              if (catchmentLocked) return;
                              setAgeInputs(prev => ({ ...prev, max: e.target.value }));
                            }}
                            onBlur={(e) => {
                              if (catchmentLocked) return;
                              const value = parseInt(e.target.value) || 78;
                              const minAge = catchmentMarket.ageRange?.min || 28;
                              const validMax = Math.min(100, Math.max(value, minAge + 1));
                              
                              setAgeInputs(prev => ({ ...prev, max: validMax.toString() }));
                              setCatchmentMarket(prev => ({
                                ...prev,
                                ageRange: { min: prev.ageRange?.min || 28, max: validMax }
                              }));
                            }}
                            disabled={catchmentLocked}
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        Targeting ages {catchmentMarket.ageRange?.min || 28} - {catchmentMarket.ageRange?.max || 78}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 p-3 rounded-lg bg-muted/50">
                    {[
                      { key: "ownCity" as const, label: "Own City", defaultValue: 20 },
                      { key: "ownState" as const, label: "Own State", defaultValue: 25 },
                      { key: "ownCountry" as const, label: "Own Country", defaultValue: 25 },
                      { key: "foreignCountries" as const, label: "Foreign Countries", defaultValue: 10 },
                      { key: "popularSearches" as const, label: "Popular Searches", defaultValue: 5 },
                      { key: "random" as const, label: "Random", defaultValue: 5 },
                      { key: "others" as const, label: "Others", defaultValue: 10 },
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <Label htmlFor={key} className="text-xs sm:text-sm flex-shrink-0">{label}</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={catchmentMarket[key]}
                              onChange={(e) => updateCatchmentMarketInput(key, e.target.value)}
                              disabled={catchmentLocked}
                              className="w-16 h-7 text-xs text-right"
                            />
                            <span className="text-xs font-medium">%</span>
                          </div>
                        </div>
                        <Slider
                          id={key}
                          value={[catchmentMarket[key]]}
                          onValueChange={(value) => updateCatchmentMarket(key, value)}
                          max={100}
                          step={1}
                          className="flex-1"
                          disabled={catchmentLocked}
                        />
                      </div>
                    ))}
                  </div>

                  {catchmentTotal !== 100 && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-destructive">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Percentages must total exactly 100%</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Launch Date */}
                <div className="space-y-2">
                  <Label className="text-sm">
                    Launch Date (Optional)
                    <InfoTooltip content="Select when you want your ad campaign to start. Leave empty to start immediately upon approval." />
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !launchDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {launchDate ? format(launchDate, "PPP") : "Pick a launch date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={launchDate}
                        onSelect={setLaunchDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Separator />

                {/* File Upload */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="file-upload" className="text-sm">
                      Upload Advert Material *
                      <InfoTooltip content={`Upload ${getRequiredFiles()} ${category === "video" ? "video" : "image"} file(s) for your ${displayMode === "single" ? "single" : `${multipleCount}-in-1 multiple`} display type.`} />
                    </Label>
                    {type && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Required: {getRequiredFiles()} file(s) for {displayMode === "single" ? "Single Display" : `${multipleCount}-in-1 Multiple Display`}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category === "video" ? "MP4, AVI, MOV" : "PNG, JPG, GIF"} (MAX. 20MB each)
                        </p>
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept={category === "video" ? "video/*" : "image/*"}
                        multiple={isMultipleDisplay}
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {/* File Preview */}
                  {uploadedFiles.length > 0 && (
                    <FilePreviewGrid
                      files={uploadedFiles}
                      onRemove={handleRemoveFile}
                      maxFiles={getRequiredFiles()}
                      isMultiple={isMultipleDisplay}
                    />
                  )}
                </div>

                <Separator />

                {/* Discount Information */}
                {userProfile.activeAdverts > 0 && (
                  <VolumeDiscountInfo 
                    activeAdvertCount={userProfile.activeAdverts}
                    currentDiscountPercentage={pricing?.appliedDiscounts?.find(d => d.type === "volume_based")?.percentage}
                  />
                )}

                {/* Cost Breakdown */}
                {pricing ? (
                  <AdvertPricingCard pricing={pricing} walletBalance={500000} variant="inline" />
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Cost Breakdown</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose category, type, and DPD package to calculate your advert cost.
                    </p>
                  </div>
                )}

                <Separator />

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <label
                    htmlFor="agree"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the Terms and Conditions and confirm that my Advert Material
                    complies with Advertising Guidelines *
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="flex-1 h-14 px-6 py-4"
                    size="lg"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Save Draft</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handlePreview}
                    className="flex-1 h-14 px-6 py-4"
                    size="lg"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    className="flex-1 h-14 px-6 py-4"
                    size="lg"
                  >
                    {isSubmitting ? "Publishing..." : "Publish Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Preview Dialog */}
      {category && displayMode && type && size && uploadedFiles.length > 0 && (
        <AdvertPreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          formData={{
            category,
            displayMode,
            multipleCount,
            type,
            size,
            dpdPackage: dpdPackage || "basic",
            subscriptionMonths,
            extendedExposure: extendedExposureTime,
            recurrentAfter,
            recurrentEvery,
            catchmentMarket,
            launchDate,
            files: uploadedFiles,
            agreed,
          }}
        />
      )}
    </div>
  );
}
