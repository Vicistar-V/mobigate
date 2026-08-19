import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { useServiceUnavailableDialog } from "@/hooks/useServiceUnavailableDialog";
import { useCurrentUserId } from "@/hooks/useWindowData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase, GraduationCap, User, Heart, Users, Mail, Phone, CheckCircle, Pencil, UserCog, Shield, Store, BookOpen, ExternalLink, Banknote, Eye, ArrowLeftRight, TrendingUp, Wallet, ArrowRightLeft, Building2, Home } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { EditSectionDialog } from "./profile/EditSectionDialog";
import { EditBasicInfoForm } from "./profile/EditBasicInfoForm";
import { EditRelationshipForm } from "./profile/EditRelationshipForm";
import { EditAboutForm } from "./profile/EditAboutForm";
import { EditContactForm } from "./profile/EditContactForm";
import { EditLocationForm } from "./profile/EditLocationForm";
import { EditEducationForm } from "./profile/EditEducationForm";
import { EditWorkForm } from "./profile/EditWorkForm";
import { EditFamilyForm } from "./profile/EditFamilyForm";
import { EditSchoolMatesForm, SchoolMate } from "./profile/EditSchoolMatesForm";
import { EditClassmatesForm, Classmate } from "./profile/EditClassmatesForm";
import { EditAgeMatesForm, AgeMate } from "./profile/EditAgeMatesForm";
import { EditWorkColleaguesForm, WorkColleague } from "./profile/EditWorkColleaguesForm";
import { EditLoveFriendshipForm, LoveFriendship } from "./profile/EditLoveFriendshipForm";
import { EditRefererUrlForm } from "./profile/EditRefererUrlForm";
import { EditCurrencyForm } from "./profile/EditCurrencyForm";
import { EditSocialCommunityForm, SocialCommunity } from "./profile/EditSocialCommunityForm";
import { MateDetailDialog } from "./profile/MateDetailDialog";
import { PrivacyBadge } from "./profile/PrivacyBadge";
import { PrivacyLevel } from "@/types/privacy";
import { AccountSummaryDialog } from "./profile/AccountSummaryDialog";
import { CurrencyExchangeDialog } from "./profile/CurrencyExchangeDialog";
import { MobiExchangeRatesDialog } from "./profile/MobiExchangeRatesDialog";
interface ProfileAboutTabProps {
  userName: string;
  /** The profile being viewed. Omit (or pass the logged-in user's own id) for MyProfile. */
  userId?: string;
}
interface Location {
  id: string;
  place: string;
  description: string;
  period?: string;
}
interface Education {
  id: string;
  school: string;
  faculty?: string;
  department?: string;
  period: string;
  extraSkills?: string;
  privacy?: string;
  exceptions?: string[];
}
interface Work {
  id: string;
  workplaceName: string;
  position: string;
  period: string;
}
interface BasicInfo {
  gender: string;
  birthday: string;
  languages: string;
  birthdayPrivacy?: "full" | "partial" | "hidden";
  privacy?: string;
  exceptions?: string[];
}
interface RelationshipInfo {
  status: string;
  privacy?: string;
  exceptions?: string[];
}
interface AboutInfo {
  text: string;
  privacy?: string;
  exceptions?: string[];
}
interface FamilyMember {
  id: string;
  name: string;
  relation: string;
}
interface ContactInfo {
  phone1: string;
  phone2?: string;
  email: string;
  privacy?: string;
  exceptions?: string[];
}
interface RefererUrl {
  url: string;
  referralCode?: string;
  refererName: string;
  refererId: string;
  privacy?: string;
  exceptions?: string[];
}
interface CurrencyInfo {
  preferredCurrency: string;
  currencySymbol: string;
  accountSummaryPrivacy?: string;
  accountSummaryExceptions?: string[];
  privacy?: string;
  exceptions?: string[];
}

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

// Section keys accepted by /api/profile/about.php (must match the PHP $colMap)
type AboutSection =
  | "designations" | "locations" | "education" | "work" | "basicInfo"
  | "relationship" | "contact" | "about" | "refererUrl" | "currency"
  | "schoolMates" | "classmates" | "ageMates" | "workColleagues"
  | "loveFriendships" | "socialCommunities" | "family";

export const ProfileAboutTab = ({
  userName,
  userId
}: ProfileAboutTabProps) => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    showDialog,
    Dialog
  } = useServiceUnavailableDialog();

  const currentUserId = useCurrentUserId();
  // Whose About tab this is: the explicit userId prop when viewing someone
  // else's profile (UserProfile.tsx), otherwise the logged-in user's own
  // (MyProfile.tsx, or userId left unset/equal to currentUserId).
  const viewedUserId = userId || currentUserId;
  const isOwnProfile = !userId || userId === currentUserId;
  // Synchronous (prop-only) signal, available before currentUserId resolves —
  // used to keep the localStorage cache strictly to the user's own data, so
  // viewing someone else's profile never reads or writes a shared cache key.
  const isOtherProfile = !!userId;

  // Dialog states
  const [editLocationOpen, setEditLocationOpen] = useState(false);
  const [editEducationOpen, setEditEducationOpen] = useState(false);
  const [editSchoolMatesOpen, setEditSchoolMatesOpen] = useState(false);
  const [editClassmatesOpen, setEditClassmatesOpen] = useState(false);
  const [editAgeMatesOpen, setEditAgeMatesOpen] = useState(false);
  const [editWorkColleaguesOpen, setEditWorkColleaguesOpen] = useState(false);
  const [editWorkOpen, setEditWorkOpen] = useState(false);
  const [editBasicInfoOpen, setEditBasicInfoOpen] = useState(false);
  const [editRelationshipOpen, setEditRelationshipOpen] = useState(false);
  const [editLoveFriendshipOpen, setEditLoveFriendshipOpen] = useState(false);
  const [editFamilyOpen, setEditFamilyOpen] = useState(false);
  const [editSocialCommunityOpen, setEditSocialCommunityOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [editAboutOpen, setEditAboutOpen] = useState(false);

  // Currency feature dialogs
  const [accountSummaryOpen, setAccountSummaryOpen] = useState(false);
  const [currencyExchangeOpen, setCurrencyExchangeOpen] = useState(false);
  const [mobiExchangeRatesOpen, setMobiExchangeRatesOpen] = useState(false);
  const [editRefererUrlOpen, setEditRefererUrlOpen] = useState(false);
  const [editCurrencyOpen, setEditCurrencyOpen] = useState(false);

  // Detail dialog states
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMate, setSelectedMate] = useState<SchoolMate | Classmate | AgeMate | WorkColleague | null>(null);
  const [mateType, setMateType] = useState<"schoolmate" | "classmate" | "agemate" | "colleague">("schoolmate");
  const openMateDetails = (mate: SchoolMate | Classmate | AgeMate | WorkColleague, type: typeof mateType) => {
    setSelectedMate(mate);
    setMateType(type);
    setDetailDialogOpen(true);
  };
  const handleUserProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };
  const handleCommunityClick = (communityId: string) => {
    // Navigate to community page (detail pages coming later)
    navigate('/community');
  };

  // Load a cached copy from localStorage (used only as an instant, offline-friendly
  // placeholder before the API responds — never fabricated demo data).
  // Skipped entirely when viewing someone else's profile, since these keys
  // are shared across the app and must never mix one user's data with another's.
  const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    if (isOtherProfile) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Data states — all start empty/blank. Real values come from the API
  // (GET /api/profile/about.php) once it loads; localStorage is only a
  // same-device cache of the user's own previously-saved data.
  const [designations, setDesignations] = useState<string>(() => loadFromStorage("profile_designations", ""));
  const [locations, setLocations] = useState<Location[]>(() => loadFromStorage("profile_locations", []));
  const [education, setEducation] = useState<Education[]>(() => loadFromStorage("profile_education", []));
  const [work, setWork] = useState<Work[]>(() => loadFromStorage("profile_work", []));
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(() =>
    loadFromStorage("profile_basicInfo", { gender: "", birthday: "", languages: "", birthdayPrivacy: "full", privacy: "public" })
  );
  const [relationship, setRelationship] = useState<RelationshipInfo>(() =>
    loadFromStorage("profile_relationship", { status: "", privacy: "public", exceptions: [] })
  );
  const [family, setFamily] = useState<FamilyMember[]>(() => loadFromStorage("profile_family", []));
  const [contact, setContact] = useState<ContactInfo>(() =>
    loadFromStorage("profile_contact", { phone1: "", phone2: "", email: "", privacy: "public", exceptions: [] })
  );
  const [about, setAbout] = useState<AboutInfo>(() =>
    loadFromStorage("profile_about", { text: "", privacy: "public", exceptions: [] })
  );
  const [refererUrl, setRefererUrl] = useState<RefererUrl>(() =>
    loadFromStorage("profile_refererUrl", { url: "", referralCode: "", refererName: "", refererId: "", privacy: "public", exceptions: [] })
  );
  const [currency, setCurrency] = useState<CurrencyInfo>(() =>
    loadFromStorage("profile_currency", {
      preferredCurrency: "", currencySymbol: "",
      accountSummaryPrivacy: "only-me", accountSummaryExceptions: [],
      privacy: "public", exceptions: [],
    })
  );
  const [schoolMates, setSchoolMates] = useState<SchoolMate[]>(() => loadFromStorage<SchoolMate[]>("profile_schoolMates", []));
  const [classmates, setClassmates] = useState<Classmate[]>(() => loadFromStorage<Classmate[]>("profile_classmates", []));
  const [ageMates, setAgeMates] = useState<AgeMate[]>(() => loadFromStorage<AgeMate[]>("profile_ageMates", []));
  const [workColleagues, setWorkColleagues] = useState<WorkColleague[]>(() => loadFromStorage<WorkColleague[]>("profile_workColleagues", []));
  const [loveFriendship, setLoveFriendship] = useState<LoveFriendship[]>(() => loadFromStorage<LoveFriendship[]>("profile_loveFriendship", []));
  const [socialCommunities, setSocialCommunities] = useState<SocialCommunity[]>(() => loadFromStorage<SocialCommunity[]>("profile_socialCommunities", []));

  const [aboutLoading, setAboutLoading] = useState(true);
  const [aboutLoaded, setAboutLoaded] = useState(false);

  // Cache a section to localStorage too, so the tab still has something to
  // show instantly (and offline) before the next API fetch completes.
  const cacheLocally = (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      /* ignore quota/storage errors */
    }
  };

  // Persist a single About-tab section through the API.
  // Optimistically updates local state first, then POSTs to the backend.
  const saveSection = async (section: AboutSection, data: unknown, localStorageKey?: string) => {
    if (!isOwnProfile) return false; // never save on someone else's profile
    if (localStorageKey) cacheLocally(localStorageKey, data);
    try {
      const res = await fetch(`${API_BASE}/profile/about.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.success) {
        throw new Error(result?.error || "Save failed");
      }
      return true;
    } catch {
      toast({
        title: "Couldn't save changes",
        description: "Your change is shown here, but saving to the server failed. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Wrapped setters: update UI immediately, then persist via the API.
  const handleSaveLocations = (data: Location[]) => { setLocations(data); saveSection("locations", data, "profile_locations"); };
  const handleSaveEducation = (data: Education[]) => { setEducation(data); saveSection("education", data, "profile_education"); };
  const handleSaveWork = (data: Work[]) => { setWork(data); saveSection("work", data, "profile_work"); };
  const handleSaveBasicInfo = (data: BasicInfo) => { setBasicInfo(data); saveSection("basicInfo", data, "profile_basicInfo"); };
  const handleSaveRelationship = (data: RelationshipInfo) => { setRelationship(data); saveSection("relationship", data, "profile_relationship"); };
  const handleSaveFamily = (data: FamilyMember[]) => { setFamily(data); saveSection("family", data, "profile_family"); };
  const handleSaveContact = (data: ContactInfo) => { setContact(data); saveSection("contact", data, "profile_contact"); };
  const handleSaveAbout = (data: AboutInfo) => { setAbout(data); saveSection("about", data, "profile_about"); };
  const handleSaveSchoolMates = (data: SchoolMate[]) => { setSchoolMates(data); saveSection("schoolMates", data, "profile_schoolMates"); };
  const handleSaveClassmates = (data: Classmate[]) => { setClassmates(data); saveSection("classmates", data, "profile_classmates"); };
  const handleSaveAgeMates = (data: AgeMate[]) => { setAgeMates(data); saveSection("ageMates", data, "profile_ageMates"); };
  const handleSaveWorkColleagues = (data: WorkColleague[]) => { setWorkColleagues(data); saveSection("workColleagues", data, "profile_workColleagues"); };
  const handleSaveLoveFriendship = (data: LoveFriendship[]) => { setLoveFriendship(data); saveSection("loveFriendships", data, "profile_loveFriendship"); };
  const handleSaveSocialCommunities = (data: SocialCommunity[]) => { setSocialCommunities(data); saveSection("socialCommunities", data, "profile_socialCommunities"); };
  const handleSaveRefererUrl = (privacyUpdate: { privacy: string; exceptions: string[] }) => {
    const finalData: RefererUrl = { ...refererUrl, ...privacyUpdate };
    setRefererUrl(finalData);
    saveSection("refererUrl", privacyUpdate, "profile_refererUrl");
    setEditRefererUrlOpen(false);
  };
  const handleSaveCurrency = (data: CurrencyInfo) => { setCurrency(data); saveSection("currency", data, "profile_currency"); setEditCurrencyOpen(false); };

  // Load the About tab from the API on mount (and whenever the viewed user changes).
  useEffect(() => {
    let cancelled = false;
    const loadAbout = async () => {
      setAboutLoading(true);
      try {
        const url = viewedUserId
          ? `${API_BASE}/profile/about.php?user_id=${encodeURIComponent(viewedUserId)}`
          : `${API_BASE}/profile/about.php`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled || !data) return;

        if (data.designations) setDesignations(data.designations);
        if (data.locations) setLocations(data.locations);
        if (data.education) setEducation(data.education);
        if (data.work) setWork(data.work);
        if (data.basicInfo) setBasicInfo(data.basicInfo);
        if (data.relationship) setRelationship(data.relationship);
        if (data.family) setFamily(data.family);
        if (data.contact) setContact(data.contact);
        if (data.about) setAbout(data.about);
        if (data.refererUrl) setRefererUrl(data.refererUrl);
        if (data.currency) setCurrency(data.currency);
        if (data.schoolMates) setSchoolMates(data.schoolMates);
        if (data.classmates) setClassmates(data.classmates);
        if (data.ageMates) setAgeMates(data.ageMates);
        if (data.workColleagues) setWorkColleagues(data.workColleagues);
        if (data.loveFriendships) setLoveFriendship(data.loveFriendships);
        if (data.socialCommunities) setSocialCommunities(data.socialCommunities);
      } catch {
        // Network/API failure: silently keep whatever was loaded from
        // localStorage/defaults above — the tab remains usable offline.
      } finally {
        if (!cancelled) {
          setAboutLoading(false);
          setAboutLoaded(true);
        }
      }
    };
    loadAbout();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedUserId]);

  // Helper function to format birthday based on privacy setting
  const formatBirthday = (birthday: string, birthdayPrivacy: "full" | "partial" | "hidden" = "full") => {
    if (birthdayPrivacy === "hidden") return null;
    try {
      const date = parse(birthday, "yyyy-MM-dd", new Date());
      if (birthdayPrivacy === "partial") {
        return format(date, "MMMM d"); // e.g., "September 20"
      }
      return format(date, "MMMM d, yyyy"); // e.g., "September 20, 1976"
    } catch {
      return birthday;
    }
  };
  return <div className="space-y-6">
      {aboutLoading && !aboutLoaded && (
        <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
          Loading profile details…
        </div>
      )}
      {/* User Category */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-base sm:text-lg font-semibold flex-1 min-w-0">User Category</h3>
          </div>
          <Badge variant="secondary" className="text-xs font-normal shrink-0 self-start sm:self-auto">System Managed</Badge>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">Verified User</p>
      </Card>

      {/* Designations */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-base sm:text-lg font-semibold flex-1 min-w-0">Designations</h3>
          </div>
          <Badge variant="secondary" className="text-xs font-normal shrink-0 self-start sm:self-auto">Auto-Assigned</Badge>
        </div>
        <p className="text-sm sm:text-base font-medium">{designations || "Standard Member"}</p>
      </Card>

      {isOwnProfile && (
      <>
      {/* My Referral Link */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <ExternalLink className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-base sm:text-lg font-semibold flex-1 min-w-0">My Referral Link</h3>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {refererUrl.privacy && <PrivacyBadge level={refererUrl.privacy as PrivacyLevel} exceptionsCount={refererUrl.exceptions?.length} />}
            {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setEditRefererUrlOpen(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {refererUrl.url ? (
          <div className="space-y-2">
            <p className="text-sm sm:text-base text-muted-foreground">
              Share this link — anyone who signs up through it is linked to your account:
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <a
                  href={refererUrl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base font-medium text-primary hover:underline break-all"
                >
                  {refererUrl.url}
                </a>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  navigator.clipboard?.writeText(refererUrl.url);
                  toast({ title: "Referral link copied" });
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm sm:text-base text-muted-foreground">
            Your referral link couldn't be generated. This usually only happens on very old accounts — contact support if it doesn't appear after a page reload.
          </p>
        )}
      </Card>
      </>
      )}

      {/* Location */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Location</h3>
          </div>
          {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0" onClick={() => setEditLocationOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {locations.length > 0 ? locations.map((loc, index) => {
            const isCurrent = /current/i.test(loc.description);
            const isHometown = /hometown/i.test(loc.description);
            const Icon = isCurrent ? MapPin : isHometown ? Home : Briefcase;
            return (
              <div key={loc.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium break-words">{loc.place}</p>
                    <p className="text-base text-muted-foreground">{loc.description}</p>
                    {loc.period && <p className="text-base text-muted-foreground">{loc.period}</p>}
                  </div>
                </div>
              </div>
            );
          }) : <p className="text-base text-muted-foreground">No locations added yet</p>}
        </div>
      </Card>

      {/* Education */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <GraduationCap className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Education</h3>
          </div>
          {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0" onClick={() => setEditEducationOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {education.length > 0 ? education.map((edu, index) => {
            const isUniversity = /(university|college|polytechnic|institute)/i.test(edu.school);
            const Icon = isUniversity ? Building2 : GraduationCap;
            return (
              <div key={edu.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium break-words">{edu.school}</p>
                      {edu.privacy && <PrivacyBadge level={edu.privacy as PrivacyLevel} exceptionsCount={edu.exceptions?.length} />}
                    </div>
                    {edu.faculty && <p className="text-base text-muted-foreground">{edu.faculty}</p>}
                    {edu.department && <p className="text-base text-muted-foreground">{edu.department}</p>}
                    <p className="text-base text-muted-foreground">{edu.period}</p>
                    {edu.extraSkills && <p className="text-base text-muted-foreground">Skills: {edu.extraSkills}</p>}
                  </div>
                </div>
              </div>
            );
          }) : <p className="text-base text-muted-foreground">No education added yet</p>}
        </div>
      </Card>

      {/* Life Mates */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserCog className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Life Mates</h3>
        </div>

        {/* School Mates */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">School Mates</h4>
            {isOwnProfile && (
<Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-primary" onClick={() => setEditSchoolMatesOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
          {schoolMates.length > 0 ? <div className="space-y-3">
              {schoolMates.map((mate, index) => <div key={mate.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-border cursor-pointer hover:ring-primary transition-all" onClick={() => handleUserProfileClick(mate.id)}>
                          <AvatarImage src={mate.linkedUserProfileImage || mate.profileImage} alt={mate.name} />
                          <AvatarFallback className="text-lg font-semibold">
                            {mate.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div onClick={() => handleUserProfileClick(mate.id)} className="flex-1 cursor-pointer min-w-0">
                        <p className="font-medium text-primary hover:underline break-words">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
                        <p className="text-sm text-muted-foreground break-words">{mate.institution}</p>
                        {mate.period && <p className="text-sm text-muted-foreground">{mate.period}</p>}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openMateDetails(mate, "schoolmate")} className="w-full sm:w-auto shrink-0">
                      Details
                    </Button>
                  </div>
                </div>)}
            </div> : <p className="text-base text-muted-foreground">No school mates added</p>}
        </div>

        <Separator className="my-6" />

        {/* Classmates */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Classmates</h4>
            {isOwnProfile && (
<Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-primary" onClick={() => setEditClassmatesOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
          {classmates.length > 0 ? <div className="space-y-3">
              {classmates.map((mate, index) => <div key={mate.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors px-0">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-border cursor-pointer hover:ring-primary transition-all" onClick={() => handleUserProfileClick(mate.id)}>
                          <AvatarImage src={mate.linkedUserProfileImage || mate.profileImage} alt={mate.name} />
                          <AvatarFallback className="text-lg font-semibold">
                            {mate.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div onClick={() => handleUserProfileClick(mate.id)} className="flex-1 cursor-pointer min-w-0">
                        <p className="font-medium text-primary hover:underline break-words">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
                        <p className="text-sm text-muted-foreground break-words">{mate.institution}</p>
                        {mate.period && <p className="text-sm text-muted-foreground">{mate.period}</p>}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openMateDetails(mate, "classmate")} className="w-full sm:w-auto shrink-0">
                      Details
                    </Button>
                  </div>
                </div>)}
            </div> : <p className="text-base text-muted-foreground">No classmates added</p>}
        </div>

        <Separator className="my-6" />

        {/* Age Mates */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Age Mates</h4>
            {isOwnProfile && (
<Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-primary" onClick={() => setEditAgeMatesOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
          {ageMates.length > 0 ? <div className="space-y-3">
              {ageMates.map((mate, index) => <div key={mate.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-border cursor-pointer hover:ring-primary transition-all" onClick={() => handleUserProfileClick(mate.id)}>
                          <AvatarImage src={mate.linkedUserProfileImage || mate.profileImage} alt={mate.name} />
                          <AvatarFallback className="text-lg font-semibold">
                            {mate.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div onClick={() => handleUserProfileClick(mate.id)} className="flex-1 cursor-pointer min-w-0">
                        <p className="font-medium text-primary hover:underline break-words">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
                        <p className="text-sm text-muted-foreground break-words">{mate.community}</p>
                        {mate.ageGrade && <p className="text-sm text-muted-foreground">Age Grade: {mate.ageGrade}</p>}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openMateDetails(mate, "agemate")} className="w-full sm:w-auto shrink-0">
                      Details
                    </Button>
                  </div>
                </div>)}
            </div> : <p className="text-base text-muted-foreground">No age mates added</p>}
        </div>

        <Separator className="my-6" />

        {/* Work Colleagues */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Work Colleagues</h4>
            {isOwnProfile && (
<Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-primary" onClick={() => setEditWorkColleaguesOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
          {workColleagues.length > 0 ? <div className="space-y-3">
              {workColleagues.map((colleague, index) => <div key={colleague.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-border cursor-pointer hover:ring-primary transition-all" onClick={() => handleUserProfileClick(colleague.id)}>
                          <AvatarImage src={colleague.linkedUserProfileImage || colleague.profileImage} alt={colleague.name} />
                          <AvatarFallback className="text-lg font-semibold">
                            {colleague.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div onClick={() => handleUserProfileClick(colleague.id)} className="flex-1 cursor-pointer min-w-0">
                        <p className="font-medium text-primary hover:underline break-words">{colleague.name}{colleague.nickname && ` (${colleague.nickname})`}</p>
                        <p className="text-sm text-muted-foreground break-words">{colleague.workplaceName}{colleague.workplaceLocation && `, ${colleague.workplaceLocation}`}</p>
                        {colleague.position && <p className="text-sm text-muted-foreground">Position: {colleague.position}</p>}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openMateDetails(colleague, "colleague")} className="w-full sm:w-auto shrink-0">
                      Details
                    </Button>
                  </div>
                </div>)}
            </div> : <p className="text-base text-muted-foreground">No work colleagues added</p>}
        </div>
      </Card>

      {/* Business/Career/Work */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Briefcase className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Business/Career/Work</h3>
          </div>
          {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0" onClick={() => setEditWorkOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {work.length > 0 ? work.map((workItem, index) => (
            <div key={workItem.id}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium break-words">{workItem.workplaceName}</p>
                  <p className="text-base">{workItem.position}</p>
                  <p className="text-base text-muted-foreground">{workItem.period}</p>
                </div>
              </div>
            </div>
          )) : <p className="text-base text-muted-foreground">No work experience added yet</p>}
        </div>
      </Card>

      {isOwnProfile && (
      <>
      {/* Extra Source */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-start sm:items-center justify-between mb-2 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Briefcase className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Extra Source</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Click on any option to navigate to the respective page
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 border rounded-lg border-muted cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => {
          showDialog();
        }}>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={e => {
              e.stopPropagation();
              toast({
                title: "Edit My Mobi-Shop settings (Coming soon)"
              });
            }}>
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-primary hover:underline break-words">My Mobi-Shop @ Mobi-Store</h4>
              <p className="text-sm text-muted-foreground break-words">Your personal online store</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-lg border-muted cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => {
          showDialog();
        }}>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={e => {
              e.stopPropagation();
              toast({
                title: "Edit Mobi-Circle settings (Coming soon)"
              });
            }}>
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-primary hover:underline break-words">Mobi-Circle</h4>
              <p className="text-sm text-muted-foreground break-words">Connect with your community</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-lg border-muted cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => {
          showDialog();
        }}>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={e => {
              e.stopPropagation();
              toast({
                title: "Edit Biz-Catalogue settings (Coming soon)"
              });
            }}>
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-primary hover:underline break-words">Biz-Catalogue</h4>
              <p className="text-sm text-muted-foreground break-words">Browse business offerings</p>
            </div>
          </div>
        </div>
      </Card>
      </>
      )}

      {/* Basic Information */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <User className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Basic Information</h3>
          </div>
          {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0" onClick={() => setEditBasicInfoOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium">{basicInfo.gender || "Not set"}</p>
            <p className="text-base text-muted-foreground">Gender</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">
              {basicInfo.birthday ? (formatBirthday(basicInfo.birthday, basicInfo.birthdayPrivacy) ?? "Hidden") : "Not set"}
            </p>
            <p className="text-base text-muted-foreground">Birthday</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">{basicInfo.languages || "Not set"}</p>
            <p className="text-base text-muted-foreground">Languages Spoken</p>
          </div>
        </div>
      </Card>

      {/* Relationship */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Heart className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Relationship</h3>
            {relationship.privacy && <PrivacyBadge level={relationship.privacy as PrivacyLevel} exceptionsCount={relationship.exceptions?.length} />}
          </div>
          {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0" onClick={() => setEditRelationshipOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div>
          <p className="font-medium">{relationship.status || "Not set"}</p>
          <p className="text-base text-muted-foreground">Status</p>
        </div>
      </Card>

      {/* Love Life & Friendship */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Heart className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Love Life & Friendship</h3>
          </div>
          {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0" onClick={() => setEditLoveFriendshipOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {loveFriendship.length > 0 ? loveFriendship.map((friendship, index) => <div key={friendship.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div>
                  <p className="font-medium text-primary hover:underline cursor-pointer" onClick={() => handleUserProfileClick(friendship.id)}>
                    {friendship.name}
                  </p>
                  <p className="text-base text-muted-foreground">{friendship.relationshipTag}</p>
                </div>
              </div>) : <p className="text-base text-muted-foreground">No friendships added</p>}
        </div>
      </Card>

      {/* Family */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Users className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Family</h3>
          </div>
          {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0" onClick={() => setEditFamilyOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {family.length > 0 ? family.map((member, index) => {
            const initials = member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
            const dicebear = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`;
            return (
              <div key={member.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex items-start gap-3">
                  <Avatar
                    className="h-11 w-11 shrink-0 ring-2 ring-border cursor-pointer hover:ring-primary transition-all"
                    onClick={() => handleUserProfileClick(member.id)}
                  >
                    <AvatarImage src={dicebear} alt={member.name} />
                    <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary hover:underline cursor-pointer break-words" onClick={() => handleUserProfileClick(member.id)}>
                      {member.name}
                    </p>
                    <p className="text-base text-muted-foreground">{member.relation}</p>
                  </div>
                </div>
              </div>
            );
          }) : <p className="text-base text-muted-foreground">No family members added yet</p>}
        </div>
      </Card>

      {/* Social Community */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Users className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Social Community</h3>
            <Badge variant="secondary" className="text-xs font-normal shrink-0">System Managed</Badge>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0" onClick={() => setEditSocialCommunityOpen(true)}>
                    <Shield className="h-4 w-4" />
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage Privacy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-4">
          {socialCommunities.length > 0 ? socialCommunities.map((community, index) => <div key={community.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-primary hover:underline cursor-pointer" onClick={() => handleCommunityClick(community.id)}>
                      {community.name}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {community.type}
                      {community.role && ` • ${community.role}`}
                      {` • ${community.status}`}
                    </p>
                    <p className="text-base text-muted-foreground">
                      Member since: {new Date(community.joinDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                    </p>
                    {community.location && <p className="text-base text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {community.location}
                      </p>}
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {community.privacy === "public" && "🌐 Public"}
                    {community.privacy === "friends" && "👥 Friends"}
                    {community.privacy === "only_me" && "🔒 Only Me"}
                  </Badge>
                </div>
              </div>) : <p className="text-base text-muted-foreground">
              You haven't joined any Social Communities yet. Join Town Unions, Clubs, and Associations on Mobiface to see them here.
            </p>}
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Phone className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Contact Information</h3>
            {contact.privacy && <PrivacyBadge level={contact.privacy as PrivacyLevel} exceptionsCount={contact.exceptions?.length} />}
          </div>
          {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0" onClick={() => setEditContactOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">Tel: {contact.phone1 || "Not set"}</p>
              {contact.phone2 && <p className="font-medium">{contact.phone2}</p>}
            </div>
          </div>
          <Separator />
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              {contact.email ? (
                <p className="font-medium">E-mail: <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a></p>
              ) : (
                <p className="font-medium">E-mail: Not set</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Currency */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Banknote className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-base sm:text-lg font-semibold min-w-0">Currency</h3>
            {currency.privacy && <PrivacyBadge level={currency.privacy as PrivacyLevel} exceptionsCount={currency.exceptions?.length} />}
          </div>
          {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0" onClick={() => setEditCurrencyOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Current Currency Display */}
          <div>
            <p className="font-medium text-base sm:text-lg">
              {currency.preferredCurrency ? `${currency.currencySymbol} ${currency.preferredCurrency}` : "Not set"}
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">Preferred Currency</p>
          </div>

          <Separator />

          {/* Feature Buttons */}
          <div className={`grid grid-cols-1 ${isOwnProfile ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-2 sm:gap-3`}>
            {isOwnProfile && (
            <>
            {/* View Account Summary */}
            <Button variant="outline" className="h-auto py-3 px-3 sm:px-4 flex flex-col items-start gap-1 hover:bg-primary/5 hover:border-primary transition-colors" onClick={() => setAccountSummaryOpen(true)}>
              <div className="flex items-center gap-2 w-full">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                <span className="font-semibold text-base sm:text-lg text-primary">View Account Summary</span>
              </div>
              <span className="text-base sm:text-lg text-muted-foreground text-left">
                Balance & transactions
              </span>
            </Button>
            </>
            )}

            {/* Currency Exchange Converter */}
            <Button variant="outline" className="h-auto py-3 px-3 sm:px-4 flex flex-col items-start gap-1 hover:bg-primary/5 hover:border-primary transition-colors" onClick={() => setCurrencyExchangeOpen(true)}>
              <div className="flex items-center gap-2 w-full">
                <ArrowRightLeft className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                <span className="font-semibold text-base sm:text-lg text-primary">Currency Converter</span>
              </div>
              <span className="text-base sm:text-lg text-muted-foreground text-left">
                Convert currencies
              </span>
            </Button>

            {/* Mobi Exchange Rates */}
            <Button variant="outline" className="h-auto py-3 px-3 sm:px-4 flex flex-col items-start gap-1 hover:bg-primary/5 hover:border-primary transition-colors" onClick={() => setMobiExchangeRatesOpen(true)}>
              <div className="flex items-center gap-2 w-full">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                <span className="font-semibold text-base sm:text-lg text-primary">Mobi Exchange Rates</span>
              </div>
              <span className="text-base sm:text-lg text-muted-foreground text-left">
                1 Mobi = 1 Naira
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <User className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">About</h3>
            {about.privacy && <PrivacyBadge level={about.privacy as PrivacyLevel} exceptionsCount={about.exceptions?.length} />}
          </div>
          {isOwnProfile && (
<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0" onClick={() => setEditAboutOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="prose prose-sm max-w-none">
          {about.text
            ? about.text.split('\n\n').map((paragraph, index) => <p key={index} className="text-foreground leading-relaxed mt-3 first:mt-0">
                {paragraph}
              </p>)
            : <p className="text-muted-foreground">Nothing added yet. Click the pencil icon to write something about yourself.</p>}
        </div>
      </Card>

      {/* Edit Dialogs */}
      <EditSectionDialog open={editLocationOpen} onOpenChange={setEditLocationOpen} title="Edit Locations" maxWidth="lg">
        <EditLocationForm currentData={locations} onSave={handleSaveLocations} onClose={() => setEditLocationOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editEducationOpen} onOpenChange={setEditEducationOpen} title="Edit Education" maxWidth="lg">
        <EditEducationForm currentData={education} onSave={handleSaveEducation} onClose={() => setEditEducationOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editWorkOpen} onOpenChange={setEditWorkOpen} title="Edit Work Experience" maxWidth="lg">
        <EditWorkForm currentData={work} onSave={handleSaveWork} onClose={() => setEditWorkOpen(false)} />
      </EditSectionDialog>


      <EditSectionDialog open={editBasicInfoOpen} onOpenChange={setEditBasicInfoOpen} title="Edit Basic Information">
        <EditBasicInfoForm currentData={basicInfo} onSave={handleSaveBasicInfo} onClose={() => setEditBasicInfoOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editRelationshipOpen} onOpenChange={setEditRelationshipOpen} title="Edit Relationship Status">
        <EditRelationshipForm currentData={relationship} onSave={handleSaveRelationship} onClose={() => setEditRelationshipOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editLoveFriendshipOpen} onOpenChange={setEditLoveFriendshipOpen} title="Edit Love Life & Friendship" maxWidth="lg">
        <EditLoveFriendshipForm currentData={loveFriendship} onSave={handleSaveLoveFriendship} onClose={() => setEditLoveFriendshipOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editFamilyOpen} onOpenChange={setEditFamilyOpen} title="Edit Family Members" maxWidth="lg">
        <EditFamilyForm currentData={family} onSave={handleSaveFamily} onClose={() => setEditFamilyOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editSocialCommunityOpen} onOpenChange={setEditSocialCommunityOpen} title="Manage Social Community Privacy" maxWidth="lg">
        <EditSocialCommunityForm currentData={socialCommunities} onSave={handleSaveSocialCommunities} onClose={() => setEditSocialCommunityOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editContactOpen} onOpenChange={setEditContactOpen} title="Edit Contact Information">
        <EditContactForm currentData={contact} onSave={handleSaveContact} onClose={() => setEditContactOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editAboutOpen} onOpenChange={setEditAboutOpen} title="Edit About" maxWidth="2xl">
        <EditAboutForm currentData={about} onSave={handleSaveAbout} onClose={() => setEditAboutOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editRefererUrlOpen} onOpenChange={setEditRefererUrlOpen} title="Referral Link Privacy" maxWidth="lg">
        <EditRefererUrlForm
          currentData={{ url: refererUrl.url, privacy: refererUrl.privacy, exceptions: refererUrl.exceptions }}
          onSave={handleSaveRefererUrl}
          onClose={() => setEditRefererUrlOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog open={editCurrencyOpen} onOpenChange={setEditCurrencyOpen} title="Edit Currency Settings" maxWidth="lg">
        <EditCurrencyForm currentData={currency} onSave={handleSaveCurrency} onClose={() => setEditCurrencyOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editSchoolMatesOpen} onOpenChange={setEditSchoolMatesOpen} title="Edit School Mates" maxWidth="2xl">
        <EditSchoolMatesForm currentData={schoolMates} onSave={handleSaveSchoolMates} onClose={() => setEditSchoolMatesOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editClassmatesOpen} onOpenChange={setEditClassmatesOpen} title="Edit Classmates" maxWidth="2xl">
        <EditClassmatesForm currentData={classmates} onSave={handleSaveClassmates} onClose={() => setEditClassmatesOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editAgeMatesOpen} onOpenChange={setEditAgeMatesOpen} title="Edit Age Mates" maxWidth="lg">
        <EditAgeMatesForm currentData={ageMates} onSave={handleSaveAgeMates} onClose={() => setEditAgeMatesOpen(false)} />
      </EditSectionDialog>

      <EditSectionDialog open={editWorkColleaguesOpen} onOpenChange={setEditWorkColleaguesOpen} title="Edit Work Colleagues" maxWidth="lg">
        <EditWorkColleaguesForm currentData={workColleagues} onSave={handleSaveWorkColleagues} onClose={() => setEditWorkColleaguesOpen(false)} />
      </EditSectionDialog>

      <MateDetailDialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen} mate={selectedMate} type={mateType} />

      {/* Currency Feature Dialogs */}
      <AccountSummaryDialog open={accountSummaryOpen} onOpenChange={setAccountSummaryOpen} userName={userName} currencySymbol={currency.currencySymbol} />

      <CurrencyExchangeDialog open={currencyExchangeOpen} onOpenChange={setCurrencyExchangeOpen} />

      <MobiExchangeRatesDialog open={mobiExchangeRatesOpen} onOpenChange={setMobiExchangeRatesOpen} />

      {/* Service Unavailable Dialog */}
      <Dialog />
    </div>;
};