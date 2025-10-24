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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Eye, Save, Info, AlertCircle, Lock, Unlock, ArrowLeft, Phone, X } from "lucide-react";
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
  getMultipleCount,
  SlotPackId,
  SlotPackDraft,
  AdvertFormData
} from "@/types/advert";
import { calculateAdvertPricing, getRequiredFileCount, getSizeFeeDescription, getAllowedSizes } from "@/lib/advertPricing";
import { saveAdvert, saveAdvertDraft, loadAdvertDraft, clearAdvertDraft, loadAdvertForEdit, clearAdvertEditData } from "@/lib/advertStorage";
import { AdvertPricingCard } from "@/components/advert/AdvertPricingCard";
import { FilePreviewGrid } from "@/components/advert/FilePreviewGrid";
import { AdvertPreviewDialog } from "@/components/advert/AdvertPreviewDialog";
import { DisplayModeSelector } from "@/components/advert/DisplayModeSelector";
import { MultipleCountCard } from "@/components/advert/MultipleCountCard";
import { AccreditedAdvertiserBadge } from "@/components/advert/AccreditedAdvertiserBadge";
import { getUserDiscountProfile } from "@/data/discountData";
import { SlotPackSelector } from "@/components/advert/SlotPackSelector";
import { SlotPackManager } from "@/components/advert/SlotPackManager";
import { SlotPackSummary } from "@/components/advert/SlotPackSummary";
import { UserTypeSelector } from "@/components/advert/UserTypeSelector";
import { AccreditationVerification } from "@/components/advert/AccreditationVerification";
import { AccreditationTier } from "@/lib/accreditationUtils";
import { 
  createNewPackDraft, 
  loadPackDraft, 
  addSlotToPack, 
  updateSlotInPack, 
  deleteSlotFromPack,
  canPublishPack,
  clearPackDraft
} from "@/lib/slotPackStorage";
import { validateSlotCount } from "@/data/slotPacks";

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
  
  // Wallet balance (hardcoded for now)
  const walletBalance = 500000;
  
  // Pack system state
  const [currentStep, setCurrentStep] = useState<"select-user-type" | "verify-accreditation" | "select-pack" | "fill-slot">("select-user-type");
  const [userType, setUserType] = useState<"individual" | "accredited" | undefined>();
  const [isAccredited, setIsAccredited] = useState(false);
  const [accreditationCode, setAccreditationCode] = useState("");
  const [accreditationTier, setAccreditationTier] = useState<AccreditationTier | undefined>();
  const [packDraft, setPackDraft] = useState<SlotPackDraft | null>(null);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editingAdvertId, setEditingAdvertId] = useState<string | null>(null);
  const [editBanner, setEditBanner] = useState<{
    originalStatus: string;
    rejectionReason?: string;
  } | null>(null);
  
  // Draft detection state (for manual loading)
  const [hasDraftAvailable, setHasDraftAvailable] = useState(false);
  const [draftType, setDraftType] = useState<'pack' | 'individual' | null>(null);
  
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
  const [contactPhone, setContactPhone] = useState("");
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "call">("whatsapp");
  const [contactEmail, setContactEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [catchmentLocked, setCatchmentLocked] = useState(() => {
    const saved = localStorage.getItem('advert-catchment-locked');
    return saved ? JSON.parse(saved) : false;
  });

  // Update type when displayMode or multipleCount changes
  useEffect(() => {
    if (displayMode) {
      const newType = getAdvertType(displayMode, multipleCount);
      setType(newType);
      
      // Reset size if it's not allowed for the new display mode
      if (size && displayMode === "rollout") {
        const allowedSizes = getAllowedSizes(displayMode);
        if (!allowedSizes.includes(size)) {
          setSize(undefined);
          toast({
            title: "Size reset",
            description: "Roll-out displays only support 5x6, 6.5x6, and 10x6 sizes.",
          });
        }
      }
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

  // Check for existing drafts on mount (without loading them)
  useEffect(() => {
    const packDraft = loadPackDraft();
    const individualDraft = loadAdvertDraft();
    
    if (packDraft) {
      setHasDraftAvailable(true);
      setDraftType('pack');
    } else if (individualDraft) {
      setHasDraftAvailable(true);
      setDraftType('individual');
    }
  }, []);

  // Persist catchment lock state
  useEffect(() => {
    localStorage.setItem('advert-catchment-locked', JSON.stringify(catchmentLocked));
  }, [catchmentLocked]);

  // Check for edit mode from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
      const advertToEdit = loadAdvertForEdit(editId);
      
      if (advertToEdit) {
        setEditMode(true);
        setEditingAdvertId(advertToEdit.id);
        
        // Store rejection reason if exists for banner display
        if (advertToEdit.status === 'rejected' && advertToEdit.rejectedReason) {
          setEditBanner({
            originalStatus: 'rejected',
            rejectionReason: advertToEdit.rejectedReason
          });
        }
        
        // Pre-populate all form fields
        setCategory(advertToEdit.category);
        
        // Derive display mode and count from type
        const derivedDisplayMode = getDisplayMode(advertToEdit.type);
        const derivedMultipleCount = getMultipleCount(advertToEdit.type);
        
        setDisplayMode(derivedDisplayMode);
        setMultipleCount(derivedMultipleCount);
        setType(advertToEdit.type);
        setSize(advertToEdit.size);
        setDpdPackage(advertToEdit.dpdPackage);
        setSubscriptionMonths(advertToEdit.pricing.subscriptionMonths as SubscriptionDuration);
        
        // Extended exposure settings
        if (advertToEdit.extendedExposure) {
          setExtendedExposureTime(advertToEdit.extendedExposure);
        }
        if (advertToEdit.recurrentAfter) {
          setRecurrentAfter(advertToEdit.recurrentAfter);
        }
        if (advertToEdit.recurrentEvery) {
          setRecurrentEvery(advertToEdit.recurrentEvery);
        }
        
        // Catchment market
        setCatchmentMarket(advertToEdit.catchmentMarket);
        
        // Launch date
        setLaunchDate(advertToEdit.launchDate);
        
        // Contact details
        if (advertToEdit.contactPhone) {
          setContactPhone(advertToEdit.contactPhone);
        }
        if (advertToEdit.contactMethod) {
          setContactMethod(advertToEdit.contactMethod);
        }
        if (advertToEdit.contactEmail) {
          setContactEmail(advertToEdit.contactEmail);
        }
        if (advertToEdit.websiteUrl) {
          setWebsiteUrl(advertToEdit.websiteUrl);
        }
        
        // Skip user type selection and pack selection for edit mode
        setUserType("individual");
        setCurrentStep("fill-slot");
        
        // Show toast notification
        toast({
          title: "Editing Advert",
          description: "Make your changes and resubmit for review.",
        });
        
        // Clear the temporary edit data
        clearAdvertEditData();
      } else {
        toast({
          title: "Edit session expired",
          description: "Please try again from My Adverts page.",
          variant: "destructive",
        });
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    // Don't auto-save in edit mode
    if (editMode) return;
    
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
            files: [],
            contactPhone: contactPhone || undefined,
            contactMethod: contactPhone ? contactMethod : undefined,
            contactEmail: contactEmail || undefined,
            websiteUrl: websiteUrl || undefined
          });
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [category, displayMode, multipleCount, type, size, dpdPackage, subscriptionMonths, extendedExposureTime, recurrentAfter, recurrentEvery, launchDate, catchmentMarket, agreed, contactPhone, contactMethod, contactEmail, websiteUrl, editMode]);

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

  const isMultipleDisplay = displayMode === "multiple" || displayMode === "rollout";

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

  const validateSlotForm = (showToast: boolean = true): boolean => {
    console.log('🔍 Validating form...', {
      category,
      displayMode,
      multipleCount,
      type,
      size,
      dpdPackage,
      subscriptionMonths,
      uploadedFiles: uploadedFiles.length,
      catchmentTotal,
      agreed,
      ageRange: catchmentMarket.ageRange
    });

    // Category validation
    if (!category) {
      console.log('❌ Validation failed: No category');
      if (showToast) toast({ title: "Validation Error", description: "Please select an advert category", variant: "destructive" });
      return false;
    }

    // Display Mode validation
    if (!displayMode) {
      console.log('❌ Validation failed: No displayMode');
      if (showToast) toast({ title: "Validation Error", description: "Please select display mode (Single or Multiple)", variant: "destructive" });
      return false;
    }

    // Multiple Count validation (for multiple/rollout displays)
    if ((displayMode === "multiple" || displayMode === "rollout") && !multipleCount) {
      console.log('❌ Validation failed: Multiple/rollout needs multipleCount');
      if (showToast) toast({ title: "Validation Error", description: "Please select the number of multiple displays", variant: "destructive" });
      return false;
    }

    // Type validation
    if (!type) {
      console.log('❌ Validation failed: No type');
      if (showToast) toast({ title: "Validation Error", description: "Display type could not be determined", variant: "destructive" });
      return false;
    }

    // Size validation
    if (!size) {
      console.log('❌ Validation failed: No size');
      if (showToast) toast({ title: "Validation Error", description: "Please select advert size", variant: "destructive" });
      return false;
    }

    // Roll-out size restrictions
    if (displayMode === "rollout" && !["5x6", "6.5x6", "10x6"].includes(size)) {
      console.log('❌ Validation failed: Invalid rollout size');
      if (showToast) toast({ title: "Validation Error", description: "Roll-out displays only support 5x6, 6.5x6, and 10x6 sizes", variant: "destructive" });
      return false;
    }

    // DPD Package validation
    if (!dpdPackage) {
      console.log('❌ Validation failed: No DPD package');
      if (showToast) toast({ title: "Validation Error", description: "Please select a DPD package", variant: "destructive" });
      return false;
    }

    // Subscription months validation
    if (!subscriptionMonths || subscriptionMonths < 1) {
      console.log('❌ Validation failed: Invalid subscription months', subscriptionMonths);
      if (showToast) toast({ title: "Validation Error", description: "Please select a valid subscription duration", variant: "destructive" });
      return false;
    }

    // File upload validation
    const requiredFiles = getRequiredFiles();
    if (uploadedFiles.length !== requiredFiles) {
      console.log('❌ Validation failed: File count mismatch', { required: requiredFiles, uploaded: uploadedFiles.length });
      if (showToast) toast({ title: "Validation Error", description: `Please upload exactly ${requiredFiles} file(s) for ${type} display`, variant: "destructive" });
      return false;
    }

    // Catchment market validation
    if (catchmentTotal !== 100) {
      console.log('❌ Validation failed: Catchment total not 100%', catchmentTotal);
      if (showToast) toast({ title: "Validation Error", description: `Catchment market percentages must total 100% (current: ${catchmentTotal}%)`, variant: "destructive" });
      return false;
    }

    // Age range validation
    const minAge = catchmentMarket.ageRange?.min || 0;
    const maxAge = catchmentMarket.ageRange?.max || 0;
    if (minAge < 18 || minAge > 100) {
      console.log('❌ Validation failed: Invalid min age', minAge);
      if (showToast) toast({ title: "Validation Error", description: "Minimum age must be between 18 and 100", variant: "destructive" });
      return false;
    }
    if (maxAge < 18 || maxAge > 100) {
      console.log('❌ Validation failed: Invalid max age', maxAge);
      if (showToast) toast({ title: "Validation Error", description: "Maximum age must be between 18 and 100", variant: "destructive" });
      return false;
    }
    if (minAge >= maxAge) {
      console.log('❌ Validation failed: Min age >= max age', { minAge, maxAge });
      if (showToast) toast({ title: "Validation Error", description: "Minimum age must be less than maximum age", variant: "destructive" });
      return false;
    }

    // Terms agreement validation
    if (!agreed) {
      console.log('❌ Validation failed: Terms not agreed');
      if (showToast) toast({ title: "Validation Error", description: "Please agree to the terms and conditions", variant: "destructive" });
      return false;
    }

    // Optional fields validation (if provided, must be valid)
    if (contactPhone && contactPhone.trim().length > 0) {
      const phoneDigits = contactPhone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        console.log('❌ Validation failed: Invalid phone', { phone: contactPhone, digits: phoneDigits.length });
        if (showToast) toast({ title: "Validation Error", description: "Phone number must contain 10-15 digits", variant: "destructive" });
        return false;
      }
    }

    if (contactEmail && contactEmail.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        console.log('❌ Validation failed: Invalid email', contactEmail);
        if (showToast) toast({ title: "Validation Error", description: "Please enter a valid email address", variant: "destructive" });
        return false;
      }
    }

    if (websiteUrl && websiteUrl.trim().length > 0) {
      try {
        new URL(websiteUrl);
        if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
          throw new Error('Invalid protocol');
        }
      } catch {
        console.log('❌ Validation failed: Invalid URL', websiteUrl);
        if (showToast) toast({ title: "Validation Error", description: "Please enter a valid website URL (must start with http:// or https://)", variant: "destructive" });
        return false;
      }
    }

    console.log('✅ Validation passed!');
    return true;
  };

  const handlePublish = async () => {
    if (!validateSlotForm()) return;

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
        // Disable accredited discount for individual users
        userType === "individual" ? null : userProfile.accreditedTier,
        // Disable volume discount for individual users
        userType === "individual" ? 0 : userProfile.activeAdverts
      );

      // Check wallet balance
      if (!checkSufficientBalance(pricing)) {
        setIsSubmitting(false);
        return;
      }

      if (editMode && editingAdvertId) {
        // Update existing advert by updating media
        // This resets status to pending and clears old approval/rejection data
        const updatedAdvert = saveAdvert(
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
            agreed,
            contactPhone: contactPhone || undefined,
            contactMethod: contactPhone ? contactMethod : undefined,
            contactEmail: contactEmail || undefined,
            websiteUrl: websiteUrl || undefined
          },
          pricing
        );
        
        toast({
          title: "Advert Updated!",
          description: "Your advert has been resubmitted for review.",
        });
      } else {
        // Create new advert
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
            agreed,
            contactPhone: contactPhone || undefined,
            contactMethod: contactPhone ? contactMethod : undefined,
            contactEmail: contactEmail || undefined,
            websiteUrl: websiteUrl || undefined
          },
          pricing
        );

        toast({
          title: "Success!",
          description: "Your advert has been submitted for review. You'll be notified once it's approved.",
        });
      }

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
    // Disable accredited discount for individual users
    userType === "individual" ? null : userProfile.accreditedTier,
    // Disable volume discount for individual users
    userType === "individual" ? 0 : userProfile.activeAdverts
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

  // Pack system handlers
  const handleUserTypeSelection = (type: "individual" | "accredited") => {
    setUserType(type);
    
    if (type === "individual") {
      // Individual users get a single-slot pack
      const newDraft = createNewPackDraft("entry");
      setPackDraft(newDraft);
      setCurrentStep("fill-slot");
      resetSlotForm();
    } else {
      // Accredited users must verify their accreditation code first
      setCurrentStep("verify-accreditation");
    }
  };

  const handleAccreditationVerified = (code: string, tier: AccreditationTier) => {
    setIsAccredited(true);
    setAccreditationCode(code);
    setAccreditationTier(tier);
    setCurrentStep("select-pack");
    
    toast({
      title: "Accreditation verified!",
      description: `Welcome ${tier.charAt(0).toUpperCase() + tier.slice(1)} tier advertiser. You can now access slot packs.`,
    });
  };

  const handlePackSelection = (packId: SlotPackId) => {
    const newDraft = createNewPackDraft(packId);
    setPackDraft(newDraft);
    setCurrentStep("fill-slot");
    resetSlotForm();
  };

  const resetSlotForm = () => {
    setCategory(null);
    setDisplayMode("single");
    setMultipleCount(undefined);
    setType("single");
    setSize(null);
    setDpdPackage(null);
    setSubscriptionMonths(1);
    setExtendedExposureTime("");
    setRecurrentAfter("");
    setRecurrentEvery("");
    setLaunchDate(undefined);
    setUploadedFiles([]);
    setAgreed(false);
    setEditingSlotId(null);
  };

  // Check if user has sufficient balance
  const checkSufficientBalance = (pricing: any): boolean => {
    const finalAmount = pricing.finalAmountPayable ?? pricing.totalCost;
    
    if (walletBalance < finalAmount) {
      toast({
        title: "Insufficient Funds",
        description: `You need ₦${finalAmount.toLocaleString()} but your wallet balance is ₦${walletBalance.toLocaleString()}. Please fund your wallet to continue.`,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleAddSlot = () => {
    console.log('🎯 handleAddSlot called', { packDraft: !!packDraft, pricing: !!pricing });
    
    if (!packDraft || !pricing) {
      console.log('❌ Missing packDraft or pricing', { packDraft: !!packDraft, pricing: !!pricing });
      return;
    }

    // Validate form before adding slot
    console.log('⏳ Running validation...');
    if (!validateSlotForm()) {
      console.log('❌ Validation failed, not adding slot');
      return;
    }
    console.log('✅ Validation passed, continuing...');

    // Check wallet balance
    console.log('💰 Checking wallet balance...');
    if (!checkSufficientBalance(pricing)) {
      console.log('❌ Insufficient balance');
      return;
    }
    console.log('✅ Balance sufficient');

    // Validate slot count - only check MAXIMUM when adding, minimum is checked at publish
    const slotCountToValidate = editingSlotId 
      ? packDraft.slots.length 
      : packDraft.slots.length + 1;
    
    console.log('🔢 Validating slot count...', { 
      packId: packDraft.packId, 
      slotCountToValidate,
      editingSlotId 
    });
    
    const validation = validateSlotCount(packDraft.packId, slotCountToValidate);
    console.log('Slot count validation result:', validation);
    
    // Only block if exceeding MAXIMUM (not minimum - that's checked at publish time)
    if (!validation.isValid && validation.needsUpgrade) {
      console.log('❌ Maximum slot count exceeded');
      toast({
        title: "Pack limit reached",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }
    
    console.log('✅ Slot count valid, creating form data...');

    // Create form data
    console.log('📋 Creating form data...');
    const formData: AdvertFormData = {
      category: category!,
      displayMode,
      multipleCount,
      type: type!,
      size: size!,
      dpdPackage: dpdPackage!,
      subscriptionMonths,
      extendedExposure: extendedExposureTime,
      recurrentAfter,
      recurrentEvery,
      catchmentMarket,
      launchDate,
      files: uploadedFiles,
      agreed,
      contactPhone: contactPhone || undefined,
      contactMethod: contactPhone ? contactMethod : undefined,
      contactEmail: contactEmail || undefined,
      websiteUrl: websiteUrl || undefined
    };

    // Add or update slot
    console.log('💾 Adding/updating slot...', { editingSlotId });
    let updatedDraft;
    if (editingSlotId) {
      updatedDraft = updateSlotInPack(packDraft, editingSlotId, formData, pricing);
      console.log('✅ Slot updated');
      toast({
        title: "Slot updated",
        description: `Slot has been updated successfully.`,
      });
    } else {
      updatedDraft = addSlotToPack(packDraft, formData, pricing);
      console.log('✅ Slot added', { totalSlots: updatedDraft.slots.length });
      toast({
        title: "Slot added",
        description: `Slot ${updatedDraft.slots.length} added to your pack.`,
      });
    }

    setPackDraft(updatedDraft);
    console.log('🔄 Pack draft updated, resetting form');
    resetSlotForm();
    
    // Scroll to top for next slot
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditSlot = (slotId: string) => {
    if (!packDraft) return;

    const slot = packDraft.slots.find(s => s.id === slotId);
    if (!slot) return;

    setEditingSlotId(slotId);
    setCategory(slot.formData.category);
    setDisplayMode(slot.formData.displayMode);
    setMultipleCount(slot.formData.multipleCount);
    setType(slot.formData.type);
    setSize(slot.formData.size);
    setDpdPackage(slot.formData.dpdPackage);
    setSubscriptionMonths(slot.formData.subscriptionMonths);
    setExtendedExposureTime(slot.formData.extendedExposure || "");
    setRecurrentAfter(slot.formData.recurrentAfter || "");
    setRecurrentEvery(slot.formData.recurrentEvery || "");
    setLaunchDate(slot.formData.launchDate);
    setCatchmentMarket(slot.formData.catchmentMarket);
    setUploadedFiles(slot.formData.files);
    setAgreed(slot.formData.agreed);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSlot = (slotId: string) => {
    if (!packDraft) return;

    const updatedDraft = deleteSlotFromPack(packDraft, slotId);
    setPackDraft(updatedDraft);
    
    if (editingSlotId === slotId) {
      resetSlotForm();
    }

    toast({
      title: "Slot removed",
      description: `Slot has been removed from your pack.`,
    });
  };

  const handlePublishPack = () => {
    if (!packDraft || !canPublishPack(packDraft)) {
      toast({
        title: "Cannot publish",
        description: "Please meet the minimum slot requirement for your pack.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Save all slots as individual adverts
      packDraft.slots.forEach((slot, index) => {
        saveAdvert(slot.formData, slot.pricing);
      });

      clearPackDraft();
      setIsSubmitting(false);

      toast({
        title: "Pack published successfully!",
        description: `Your ${packDraft.slots.length}-slot pack has been submitted for approval.`,
      });

      navigate("/my-adverts");
    }, 1500);
  };

  const handleBackToPacks = () => {
    if (packDraft && packDraft.slots.length > 0) {
      const confirm = window.confirm("Are you sure you want to go back? Your current pack will be saved.");
      if (!confirm) return;
    }
    
    if (userType === "individual") {
      setCurrentStep("select-user-type");
    } else {
      setCurrentStep("select-pack");
    }
    
    setPackDraft(null);
    resetSlotForm();
  };

  const handleBackToUserTypeSelection = () => {
    if (packDraft && packDraft.slots.length > 0) {
      const confirm = window.confirm("Are you sure you want to go back? Any unsaved progress will be lost.");
      if (!confirm) return;
    }
    
    setCurrentStep("select-user-type");
    setPackDraft(null);
    setUserType(undefined);
    resetSlotForm();
  };

  const handleLoadDraft = () => {
    if (draftType === 'pack') {
      const draft = loadPackDraft();
      if (draft) {
        setPackDraft(draft);
        setUserType(draft.packId === "entry" ? "individual" : "accredited");
        setCurrentStep("fill-slot");
        setHasDraftAvailable(false);
        toast({
          title: "Pack draft loaded",
          description: `Your ${draft.slots.length}-slot draft has been restored.`,
        });
      }
    } else if (draftType === 'individual') {
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
        if (draft.contactPhone) setContactPhone(draft.contactPhone);
        if (draft.contactMethod) setContactMethod(draft.contactMethod);
        if (draft.contactEmail) setContactEmail(draft.contactEmail);
        if (draft.websiteUrl) setWebsiteUrl(draft.websiteUrl);
        
        setUserType("individual");
        setCurrentStep("fill-slot");
        setHasDraftAvailable(false);
        
        toast({
          title: "Draft loaded",
          description: "Your saved advert has been restored.",
        });
      }
    }
  };

  const handleDiscardDraft = () => {
    if (draftType === 'pack') {
      clearPackDraft();
    } else if (draftType === 'individual') {
      clearAdvertDraft();
    }
    
    setHasDraftAvailable(false);
    setDraftType(null);
    
    toast({
      title: "Draft discarded",
      description: "Starting fresh with a new advert.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      {/* Edit Mode Banner */}
      {editMode && editBanner && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="container mx-auto py-4 px-4 max-w-7xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                    Editing Previously Rejected Advert
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                    This advert was rejected. Please address the issues below before resubmitting.
                  </p>
                </div>
                {editBanner.rejectionReason && (
                  <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-yellow-300 dark:border-yellow-700">
                    <p className="text-xs font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                      Original Rejection Reason:
                    </p>
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
                      {editBanner.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => setEditBanner(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Step 1: User Type Selection */}
        {currentStep === "select-user-type" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Draft Available Alert */}
            {hasDraftAvailable && (
              <Alert className="border-primary/50 bg-primary/5">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-1 gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm sm:text-base">Unfinished {draftType === 'pack' ? 'pack' : 'advert'} draft</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Continue or start fresh?
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={handleDiscardDraft} className="w-full sm:w-auto">
                      Start Fresh
                    </Button>
                    <Button size="sm" onClick={handleLoadDraft} className="w-full sm:w-auto">
                      Continue Draft
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <UserTypeSelector
              selectedType={userType}
              onSelectType={handleUserTypeSelection}
            />
          </div>
        )}

        {/* Step 2: Accreditation Verification (Accredited Only) */}
        {currentStep === "verify-accreditation" && (
          <AccreditationVerification
            onVerified={handleAccreditationVerified}
            onBack={handleBackToUserTypeSelection}
          />
        )}

        {/* Step 3: Pack Selection (Accredited Only) */}
        {currentStep === "select-pack" && (
          <div className="max-w-6xl mx-auto space-y-4">
            <Button
              variant="outline"
              onClick={handleBackToUserTypeSelection}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to User Type Selection
            </Button>
            <SlotPackSelector
              selectedPackId={packDraft?.packId}
              onSelectPack={handlePackSelection}
              excludeEntry={false}
            />
          </div>
        )}

        {/* Step 4: Fill Slots */}
        {currentStep === "fill-slot" && packDraft && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Slot Form */}
            <div className="lg:col-span-2 space-y-4">
              <Button
                variant="outline"
                onClick={handleBackToPacks}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {userType === "individual" ? "User Type Selection" : "Pack Selection"}
              </Button>

              <Card className="overflow-visible">
                <CardHeader className="space-y-1 sm:space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        {editingSlotId ? "Edit Slot" : `Create Slot ${packDraft.slots.length + 1}`}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Fill in the details for this advert slot
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
                    <DisplayModeSelector
                      category={category}
                      displayMode={displayMode}
                      onSelectMode={(mode) => {
                        setDisplayMode(mode);
                        if (mode === "single") {
                          setMultipleCount(undefined);
                        }
                      }}
                    />
                  </div>
                )}

                {/* Multiple Display Count Selection */}
                {category && (displayMode === "multiple" || displayMode === "rollout") && (
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Select Number of Displays *
                      <InfoTooltip content="Choose how many different adverts will rotate in your campaign" />
                    </Label>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                      {([2, 3, 4, 5, 6, 7, 8, 9, 10, 15] as MultipleDisplayCount[]).map((count, index) => (
                        <MultipleCountCard
                          key={count}
                          count={count}
                          selected={multipleCount === count}
                          category={category}
                          displayMode={displayMode!}
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
                  {displayMode === "rollout" && (
                    <div className="mb-2 p-2 bg-warning/10 rounded-md border border-warning/20">
                      <p className="text-sm text-warning-foreground">
                        <AlertCircle className="h-4 w-4 inline-block mr-1" />
                        Roll-out displays only support: 5x6, 6.5x6, and 10x6 sizes
                      </p>
                    </div>
                  )}
                  <Select value={size || ""} onValueChange={(v) => setSize(v as AdvertSize)}>
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Choose advert size" />
                    </SelectTrigger>
                    <SelectContent>
                      {advertSizes
                        .filter((s) => {
                          if (displayMode === "rollout") {
                            return ["5x6", "6.5x6", "10x6"].includes(s.value);
                          }
                          return true;
                        })
                        .map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                            {displayMode === "rollout" && s.value === "5x6" && " @ 12% Size Fee"}
                            {displayMode === "rollout" && s.value === "6.5x6" && " @ 15% Size Fee"}
                            {displayMode === "rollout" && s.value === "10x6" && " @ 20% Size Fee"}
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

                {/* Contact Information */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">
                      Contact Information (Optional)
                      <InfoTooltip content="Add ways for customers to contact you directly from your advert - all fields are optional." />
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide contact details to make it easy for customers to reach you
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Phone Number with Method Selection */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Phone Number (Optional)</Label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Button
                          type="button"
                          variant={contactMethod === "whatsapp" ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                          onClick={() => setContactMethod("whatsapp")}
                        >
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          WhatsApp
                        </Button>
                        <Button
                          type="button"
                          variant={contactMethod === "call" ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                          onClick={() => setContactMethod("call")}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Phone Call
                        </Button>
                      </div>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="+234 XXX XXX XXXX"
                        value={contactPhone}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^\d\s+]/g, '');
                          setContactPhone(cleaned);
                        }}
                        maxLength={20}
                        className="font-mono"
                      />
                      {contactPhone && (
                        <p className="text-xs text-muted-foreground">
                          Customers can {contactMethod === "whatsapp" ? "message you on WhatsApp" : "call you directly"}
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <Label htmlFor="contact-email" className="text-xs font-medium">
                        Email Address (Optional)
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="your@email.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        maxLength={100}
                      />
                      {contactEmail && (
                        <p className="text-xs text-muted-foreground">
                          Customers can send you emails directly
                        </p>
                      )}
                    </div>

                    {/* Website URL */}
                    <div className="space-y-2">
                      <Label htmlFor="website-url" className="text-xs font-medium">
                        Website URL (Optional)
                      </Label>
                      <Input
                        id="website-url"
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        maxLength={200}
                      />
                      {websiteUrl && (
                        <p className="text-xs text-muted-foreground">
                          Customers can visit your website
                        </p>
                      )}
                    </div>

                    {(contactPhone || contactEmail || websiteUrl) && (
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          ✓ Contact buttons will appear on your advert for customers to reach you easily
                        </p>
                      </div>
                    )}
                  </div>
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

                {/* Cost Breakdown */}
                {pricing ? (
                  <AdvertPricingCard pricing={pricing} walletBalance={walletBalance} variant="inline" />
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

                {/* Validation Status Alert */}
                {!validateSlotForm(false) && (
                  <Alert variant="destructive" className="animate-in fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please complete all required fields before {userType === "individual" ? "publishing" : "adding to pack"}
                    </AlertDescription>
                  </Alert>
                )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <Button
                      variant="outline"
                      onClick={resetSlotForm}
                      className="flex-1 h-14 px-6 py-4"
                      size="lg"
                    >
                      Reset Form
                    </Button>
                    
                    {/* Preview Button */}
                    <Button
                      variant="outline"
                      onClick={handlePreview}
                      disabled={!category || !type || !size || uploadedFiles.length === 0}
                      className="flex-1 h-14 px-6 py-4"
                      size="lg"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    
                    {userType === "individual" ? (
                      <Button
                        onClick={handlePublish}
                        disabled={
                          !category || 
                          !displayMode ||
                          ((displayMode === "multiple" || displayMode === "rollout") && !multipleCount) ||
                          !type || 
                          !size || 
                          !dpdPackage || 
                          uploadedFiles.length === 0 || 
                          catchmentTotal !== 100 ||
                          !agreed || 
                          isSubmitting
                        }
                        className="flex-1 h-14 px-6 py-4"
                        size="lg"
                      >
                        {isSubmitting ? (editMode ? "Resubmitting..." : "Publishing...") : (editMode ? "Resubmit Advertisement" : "Publish Advertisement")}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleAddSlot}
                        disabled={
                          !category || 
                          !displayMode ||
                          ((displayMode === "multiple" || displayMode === "rollout") && !multipleCount) ||
                          !type || 
                          !size || 
                          !dpdPackage || 
                          uploadedFiles.length === 0 || 
                          catchmentTotal !== 100 ||
                          !agreed
                        }
                        className="flex-1 h-14 px-6 py-4"
                        size="lg"
                      >
                        {editingSlotId ? "Update Slot" : "Add to Pack"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Pack Manager & Summary or Pricing (based on user type) */}
            <div className="space-y-4">
              {userType === "accredited" ? (
                <>
                  <SlotPackManager
                    packDraft={packDraft}
                    onAddSlot={() => {
                      if (!editingSlotId) resetSlotForm();
                    }}
                    onEditSlot={handleEditSlot}
                    onDeleteSlot={handleDeleteSlot}
                    onPublishPack={handlePublishPack}
                    canPublish={canPublishPack(packDraft)}
                  />
                  <SlotPackSummary packDraft={packDraft} />
                </>
              ) : (
                pricing && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Advertisement</CardTitle>
                      <CardDescription>Individual advert pricing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdvertPricingCard pricing={pricing} walletBalance={walletBalance} variant="card" />
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        )}
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
