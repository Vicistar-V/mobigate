import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase, GraduationCap, User, Heart, Users, Mail, Phone, CheckCircle, Pencil, UserCog, Shield, Store, BookOpen, ExternalLink, Banknote, Eye, ArrowLeftRight, TrendingUp } from "lucide-react";
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

interface ProfileAboutTabProps {
  userName: string;
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

export const ProfileAboutTab = ({ userName }: ProfileAboutTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    toast({
      title: "Community Profile",
      description: "Community profile pages are coming soon!",
    });
  };

  // Load data from localStorage on mount
  const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Data states with localStorage initialization
  const [designations, setDesignations] = useState<string>(() => 
    loadFromStorage("profile_designations", "2-Star User, Mobi-Celebrity")
  );
  const [locations, setLocations] = useState<Location[]>(() => 
    loadFromStorage("profile_locations", [
      { id: "1", place: "Onitsha, Anambra State, Nigeria.", description: "Current City" },
      { id: "2", place: "Awka, Anambra State, Nigeria.", description: "Hometown" },
      { id: "3", place: "Lived in Aba, Abia, Nigeria", description: "1992 - 1998", period: "1992 - 1998" },
      { id: "4", place: "Lived in Port-Harcourt, Rivers, Nigeria", description: "2002 - 2009", period: "2002 - 2009" },
    ])
  );
  const [education, setEducation] = useState<Education[]>(() => 
    loadFromStorage("profile_education", [
      { id: "1", school: "Nike Grammar School, Enugu, Nigeria", period: "Class of 2013 - 2019." },
      { id: "2", school: "University of Nigeria, Nsukka, Nigeria", faculty: "Faculty of Engineering", department: "Civil Engineering Department", period: "Class of 2020 - 2025.", extraSkills: "AutoCAD, Project Management, Research" },
    ])
  );
  const [work, setWork] = useState<Work[]>(() => 
    loadFromStorage("profile_work", [
      { id: "1", workplaceName: "BeamColumn PCC Limited, Onitsha", position: "CEO", period: "January 5, 1995 - Present" },
      { id: "2", workplaceName: "Kemjik Allied Resources Ltd, Aba, Abia State", position: "MD", period: "July 22, 2010 - December 10, 2024." },
    ])
  );
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(() => 
    loadFromStorage("profile_basicInfo", {
      gender: "Female",
      birthday: "1976-09-20",
      languages: "English, French and Igbo",
      birthdayPrivacy: "full",
      privacy: "public",
    })
  );
  const [relationship, setRelationship] = useState<RelationshipInfo>(() => {
    const stored = loadFromStorage<RelationshipInfo | string>("profile_relationship", "Married");
    if (typeof stored === 'string') {
      return { status: stored, privacy: "public", exceptions: [] };
    }
    return stored;
  });
  const [family, setFamily] = useState<FamilyMember[]>(() => 
    loadFromStorage("profile_family", [
      { id: "1", name: "Emeka Anigbogu", relation: "Brother" },
      { id: "2", name: "Stella Anthonia Obi", relation: "Wife" },
      { id: "3", name: "Michael Johnson Obi", relation: "Son" },
    ])
  );
  const [contact, setContact] = useState<ContactInfo>(() => 
    loadFromStorage("profile_contact", {
      phone1: "+234-806-408-9171",
      phone2: "+234-803-477-1843",
      email: "kemjikng@yahoo.com",
    })
  );
  const [about, setAbout] = useState<AboutInfo>(() => {
    const stored = loadFromStorage<AboutInfo | string>("profile_about", 
      "I'm a Lawyer, Media Professional and Schola, with unique passion and experince in real estates, property development and management.\n\nI work with BeamColumn PCC Limited as Legal Adviser on Property Investments and Corporate Law; and also Senior Negotiator and Evaluator, etc."
    );
    if (typeof stored === 'string') {
      return { text: stored, privacy: "public", exceptions: [] };
    }
    return stored;
  });
  const [refererUrl, setRefererUrl] = useState<RefererUrl>(() => 
    loadFromStorage("profile_refererUrl", {
      url: "https://mobigate.com/profile/john-doe",
      refererName: "John Doe",
      refererId: "user-123",
      privacy: "public",
      exceptions: []
    })
  );
  const [currency, setCurrency] = useState<CurrencyInfo>(() =>
    loadFromStorage("profile_currency", {
      preferredCurrency: "Nigerian Naira",
      currencySymbol: "₦",
      accountSummaryPrivacy: "only-me",
      accountSummaryExceptions: [],
      privacy: "public",
      exceptions: []
    })
  );
  const [schoolMates, setSchoolMates] = useState<SchoolMate[]>(() => 
    loadFromStorage<SchoolMate[]>("profile_schoolMates", [
      {
        id: "1",
        name: "Chidi Okafor",
        nickname: "Chief",
        institution: "Nike Grammar School, Enugu, Nigeria",
        period: "2013-2019",
        postsHeld: "Class Captain, Football Team Captain",
        sportsPlayed: "Football, Basketball",
        clubsAssociations: "Science Club, Debate Society",
        favouriteTeacher: "Mr. James Okoli",
        teacherNickname: "Prof James",
        teacherHometown: "Enugu",
        teacherSubject: "Mathematics",
        teacherPosition: "Senior Teacher",
        privacy: "public"
      },
      {
        id: "2",
        name: "Ngozi Eze",
        nickname: "Ngo",
        institution: "Nike Grammar School, Enugu, Nigeria",
        period: "2013-2019",
        postsHeld: "Library Prefect, Drama Club President",
        sportsPlayed: "Volleyball, Athletics",
        clubsAssociations: "Drama Club, Literary Society",
        favouriteTeacher: "Mrs. Grace Uche",
        teacherNickname: "Mama Grace",
        teacherHometown: "Nsukka",
        teacherSubject: "English Literature",
        teacherPosition: "Head of Languages",
        privacy: "friends"
      }
    ])
  );
  const [classmates, setClassmates] = useState<Classmate[]>(() => 
    loadFromStorage<Classmate[]>("profile_classmates", [
      {
        id: "1",
        name: "Emeka Nnamdi",
        nickname: "Eme",
        institution: "University of Nigeria, Nsukka - Civil Engineering",
        period: "2020-2025",
        postsHeld: "Class Representative, NICE President",
        sportsPlayed: "Tennis, Chess",
        clubsAssociations: "Nigerian Institution of Civil Engineers (NICE), Rotaract Club",
        favouriteTeacher: "Dr. Peter Obiora",
        teacherNickname: "Dr. Pete",
        teacherHometown: "Awka",
        teacherSubject: "Structural Analysis",
        teacherPosition: "Senior Lecturer",
        privacy: "public"
      },
      {
        id: "2",
        name: "Amaka Okonkwo",
        nickname: "Amy",
        institution: "University of Nigeria, Nsukka - Civil Engineering",
        period: "2020-2025",
        postsHeld: "Course Rep, Female Engineers Forum Secretary",
        sportsPlayed: "Badminton, Swimming",
        clubsAssociations: "Female Engineers Forum, Environmental Club",
        favouriteTeacher: "Prof. Chinedu Agu",
        teacherNickname: "Prof. CA",
        teacherHometown: "Owerri",
        teacherSubject: "Hydraulic Engineering",
        teacherPosition: "Professor",
        privacy: "friends"
      }
    ])
  );
  const [ageMates, setAgeMates] = useState<AgeMate[]>(() => 
    loadFromStorage<AgeMate[]>("profile_ageMates", [
      {
        id: "1",
        name: "Chukwuemeka Okafor",
        community: "Onitsha Urban Community",
        ageGrade: "Otu Udo 1975",
        ageBrackets: "1970-1980",
        nickname: "The Peacemaker",
        postsHeld: "Youth Leader (1995-1998), Financial Secretary (2005-2010)",
        privacy: "public"
      },
      {
        id: "2",
        name: "Ifeanyi Nwosu",
        community: "Awka Community Development Union",
        ageGrade: "Ndi Oganiru 1976",
        ageBrackets: "1971-1981",
        nickname: "Odogwu",
        postsHeld: "PRO (2000-2005), Vice Chairman (2012-2015)",
        privacy: "public"
      }
    ])
  );
  const [workColleagues, setWorkColleagues] = useState<WorkColleague[]>(() => 
    loadFromStorage<WorkColleague[]>("profile_workColleagues", [
      {
        id: "1",
        name: "Ifeanyi Mbah",
        nickname: "Ify",
        workplaceName: "BeamColumn PCC Limited",
        workplaceLocation: "Onitsha, Anambra State",
        position: "Senior Engineer",
        duration: "2015-Present",
        superiority: "Colleague",
        specialSkills: "Project Management, Structural Design",
        privacy: "public"
      },
      {
        id: "2",
        name: "Obiageli Nwankwo",
        nickname: "Obi",
        workplaceName: "Kemjik Allied Resources Ltd",
        workplaceLocation: "Aba, Abia State",
        position: "Marketing Manager",
        duration: "2010-2024",
        superiority: "Subordinate",
        specialSkills: "Brand Development, Client Relations",
        privacy: "friends"
      }
    ])
  );
  const [loveFriendship, setLoveFriendship] = useState<LoveFriendship[]>(() => 
    loadFromStorage<LoveFriendship[]>("profile_loveFriendship", [])
  );
  const [socialCommunities, setSocialCommunities] = useState<SocialCommunity[]>(() => 
    loadFromStorage<SocialCommunity[]>("profile_socialCommunities", [
      {
        id: "1",
        name: "Onitsha Town Union",
        type: "Town Union",
        role: "Financial Secretary",
        joinDate: "2015-03-10",
        status: "Active",
        location: "Onitsha, Anambra State",
        privacy: "public"
      },
      {
        id: "2",
        name: "Rotary Club of Awka",
        type: "Club",
        role: "Member",
        joinDate: "2018-06-15",
        status: "Active",
        location: "Awka, Anambra State",
        privacy: "friends"
      },
      {
        id: "3",
        name: "Nigerian Bar Association (NBA)",
        type: "Association",
        role: "Member",
        joinDate: "2010-01-20",
        status: "Active",
        privacy: "public"
      }
    ])
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("profile_designations", JSON.stringify(designations));
  }, [designations]);

  useEffect(() => {
    localStorage.setItem("profile_locations", JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem("profile_education", JSON.stringify(education));
  }, [education]);

  useEffect(() => {
    localStorage.setItem("profile_work", JSON.stringify(work));
  }, [work]);

  useEffect(() => {
    localStorage.setItem("profile_basicInfo", JSON.stringify(basicInfo));
  }, [basicInfo]);

  useEffect(() => {
    localStorage.setItem("profile_relationship", JSON.stringify(relationship));
  }, [relationship]);

  useEffect(() => {
    localStorage.setItem("profile_family", JSON.stringify(family));
  }, [family]);

  useEffect(() => {
    localStorage.setItem("profile_contact", JSON.stringify(contact));
  }, [contact]);

  useEffect(() => {
    localStorage.setItem("profile_about", JSON.stringify(about));
  }, [about]);

  useEffect(() => {
    localStorage.setItem("profile_schoolMates", JSON.stringify(schoolMates));
  }, [schoolMates]);

  useEffect(() => {
    localStorage.setItem("profile_classmates", JSON.stringify(classmates));
  }, [classmates]);

  useEffect(() => {
    localStorage.setItem("profile_ageMates", JSON.stringify(ageMates));
  }, [ageMates]);

  useEffect(() => {
    localStorage.setItem("profile_workColleagues", JSON.stringify(workColleagues));
  }, [workColleagues]);

  useEffect(() => {
    localStorage.setItem("profile_loveFriendship", JSON.stringify(loveFriendship));
  }, [loveFriendship]);

  useEffect(() => {
    localStorage.setItem("profile_socialCommunities", JSON.stringify(socialCommunities));
  }, [socialCommunities]);

  useEffect(() => {
    localStorage.setItem("profile_refererUrl", JSON.stringify(refererUrl));
  }, [refererUrl]);

  useEffect(() => {
    localStorage.setItem("profile_currency", JSON.stringify(currency));
  }, [currency]);

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

  return (
    <div className="space-y-6">
      {/* User Category */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">User Category</h3>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">System Managed</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Verified User</p>
      </Card>

      {/* Designations */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Designations</h3>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">Auto-Assigned</Badge>
        </div>
        <p className="font-medium">{designations}</p>
      </Card>

      {/* Referer URL */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ExternalLink className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Referer URL</h3>
          </div>
          <div className="flex items-center gap-2">
            {refererUrl.privacy && (
              <PrivacyBadge 
                level={refererUrl.privacy as PrivacyLevel} 
                exceptionsCount={refererUrl.exceptions?.length}
              />
            )}
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => setEditRefererUrlOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Referred by:</p>
          <Button
            variant="link"
            className="h-auto p-0 font-medium text-primary hover:underline"
            onClick={() => navigate(`/profile/${refererUrl.refererId}`)}
          >
            {refererUrl.refererName}
          </Button>
          <p className="text-xs text-muted-foreground break-all">
            {refererUrl.url}
          </p>
        </div>
      </Card>

      {/* Location */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Location</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
            onClick={() => setEditLocationOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {locations.map((loc, index) => (
            <div key={loc.id}>
              {index > 0 && <Separator className="mb-4" />}
              <div>
                <p className="font-medium">{loc.place}</p>
                <p className="text-sm text-muted-foreground">{loc.description}</p>
                {loc.period && <p className="text-sm text-muted-foreground">{loc.period}</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Education */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <GraduationCap className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Education</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
            onClick={() => setEditEducationOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={edu.id}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{edu.school}</p>
                  {edu.privacy && (
                    <PrivacyBadge 
                      level={edu.privacy as PrivacyLevel} 
                      exceptionsCount={edu.exceptions?.length}
                    />
                  )}
                </div>
                {edu.faculty && <p className="text-sm text-muted-foreground">{edu.faculty}</p>}
                {edu.department && <p className="text-sm text-muted-foreground">{edu.department}</p>}
                <p className="text-sm text-muted-foreground">{edu.period}</p>
                {edu.extraSkills && <p className="text-sm text-muted-foreground">Skills: {edu.extraSkills}</p>}
              </div>
            </div>
          ))}
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
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-muted-foreground hover:text-primary"
              onClick={() => setEditSchoolMatesOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          {schoolMates.length > 0 ? (
            <div className="space-y-3">
              {schoolMates.map((mate, index) => (
                <div key={mate.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors flex-wrap sm:flex-nowrap min-w-0">
                    <div className="flex-shrink-0">
                      <Avatar 
                        className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-border cursor-pointer hover:ring-primary transition-all"
                        onClick={() => handleUserProfileClick(mate.id)}
                      >
                        <AvatarImage 
                          src={mate.linkedUserProfileImage || mate.profileImage} 
                          alt={mate.name} 
                        />
                        <AvatarFallback className="text-lg font-semibold">
                          {mate.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div 
                      onClick={() => handleUserProfileClick(mate.id)}
                      className="flex-1 cursor-pointer min-w-0"
                    >
                      <p className="font-medium text-primary hover:underline">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
                      <p className="text-sm text-muted-foreground">{mate.institution}</p>
                      {mate.period && <p className="text-sm text-muted-foreground">{mate.period}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openMateDetails(mate, "schoolmate")}
                      className="text-xs shrink-0 mt-2 sm:mt-0"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No school mates added</p>
          )}
        </div>

        <Separator className="my-6" />

        {/* Classmates */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Classmates</h4>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-muted-foreground hover:text-primary"
              onClick={() => setEditClassmatesOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          {classmates.length > 0 ? (
            <div className="space-y-3">
              {classmates.map((mate, index) => (
                <div key={mate.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors flex-wrap sm:flex-nowrap min-w-0">
                    <div className="flex-shrink-0">
                      <Avatar 
                        className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-border cursor-pointer hover:ring-primary transition-all"
                        onClick={() => handleUserProfileClick(mate.id)}
                      >
                        <AvatarImage 
                          src={mate.linkedUserProfileImage || mate.profileImage} 
                          alt={mate.name} 
                        />
                        <AvatarFallback className="text-lg font-semibold">
                          {mate.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div 
                      onClick={() => handleUserProfileClick(mate.id)}
                      className="flex-1 cursor-pointer min-w-0"
                    >
                      <p className="font-medium text-primary hover:underline">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
                      <p className="text-sm text-muted-foreground">{mate.institution}</p>
                      {mate.period && <p className="text-sm text-muted-foreground">{mate.period}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openMateDetails(mate, "classmate")}
                      className="text-xs shrink-0 mt-2 sm:mt-0"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No classmates added</p>
          )}
        </div>

        <Separator className="my-6" />

        {/* Age Mates */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Age Mates</h4>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-muted-foreground hover:text-primary"
              onClick={() => setEditAgeMatesOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          {ageMates.length > 0 ? (
            <div className="space-y-3">
              {ageMates.map((mate, index) => (
                <div key={mate.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors flex-wrap sm:flex-nowrap min-w-0">
                    <div className="flex-shrink-0">
                      <Avatar 
                        className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-border cursor-pointer hover:ring-primary transition-all"
                        onClick={() => handleUserProfileClick(mate.id)}
                      >
                        <AvatarImage 
                          src={mate.linkedUserProfileImage || mate.profileImage} 
                          alt={mate.name} 
                        />
                        <AvatarFallback className="text-lg font-semibold">
                          {mate.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div 
                      onClick={() => handleUserProfileClick(mate.id)}
                      className="flex-1 cursor-pointer min-w-0"
                    >
                      <p className="font-medium text-primary hover:underline">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
                      <p className="text-sm text-muted-foreground">{mate.community}</p>
                      {mate.ageGrade && <p className="text-sm text-muted-foreground">Age Grade: {mate.ageGrade}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openMateDetails(mate, "agemate")}
                      className="text-xs shrink-0 mt-2 sm:mt-0"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No age mates added</p>
          )}
        </div>

        <Separator className="my-6" />

        {/* Work Colleagues */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Work Colleagues</h4>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-muted-foreground hover:text-primary"
              onClick={() => setEditWorkColleaguesOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          {workColleagues.length > 0 ? (
            <div className="space-y-3">
              {workColleagues.map((colleague, index) => (
                <div key={colleague.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors flex-wrap sm:flex-nowrap min-w-0">
                    <div className="flex-shrink-0">
                      <Avatar 
                        className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-border cursor-pointer hover:ring-primary transition-all"
                        onClick={() => handleUserProfileClick(colleague.id)}
                      >
                        <AvatarImage 
                          src={colleague.linkedUserProfileImage || colleague.profileImage} 
                          alt={colleague.name} 
                        />
                        <AvatarFallback className="text-lg font-semibold">
                          {colleague.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div 
                      onClick={() => handleUserProfileClick(colleague.id)}
                      className="flex-1 cursor-pointer min-w-0"
                    >
                      <p className="font-medium text-primary hover:underline">{colleague.name}{colleague.nickname && ` (${colleague.nickname})`}</p>
                      <p className="text-sm text-muted-foreground">{colleague.workplaceName}{colleague.workplaceLocation && `, ${colleague.workplaceLocation}`}</p>
                      {colleague.position && <p className="text-sm text-muted-foreground">Position: {colleague.position}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openMateDetails(colleague, "colleague")}
                      className="text-xs shrink-0 mt-2 sm:mt-0"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No work colleagues added</p>
          )}
        </div>
      </Card>

      {/* Business/Career/Work */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Briefcase className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Business/Career/Work</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
            onClick={() => setEditWorkOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {work.map((workItem, index) => (
            <div key={workItem.id}>
              {index > 0 && <Separator className="mb-4" />}
              <div>
                <p className="font-medium">{workItem.workplaceName}</p>
                <p className="text-sm">{workItem.position}</p>
                <p className="text-sm text-muted-foreground">{workItem.period}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Extra Source */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Briefcase className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Extra Source</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Click on any option to navigate to the respective page
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-4 border rounded-lg border-muted">
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors"
              onClick={() => {
                toast({ title: "Navigating to My Mobi-Shop..." });
                navigate("/mobi-shop");
              }}
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-primary hover:underline">My Mobi-Shop @ Mobi-Store</h4>
                <p className="text-sm text-muted-foreground">Your personal online store</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toast({ title: "Edit My Mobi-Shop settings (Coming soon)" });
              }}
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 p-4 border rounded-lg border-muted">
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors"
              onClick={() => {
                toast({ title: "Navigating to Mobi-Circle..." });
                navigate("/mobi-circle");
              }}
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-primary hover:underline">Mobi-Circle</h4>
                <p className="text-sm text-muted-foreground">Connect with your community</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toast({ title: "Edit Mobi-Circle settings (Coming soon)" });
              }}
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 p-4 border rounded-lg border-muted">
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors"
              onClick={() => {
                toast({ title: "Navigating to Biz-Catalogue..." });
                navigate("/biz-catalogue");
              }}
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-primary hover:underline">Biz-Catalogue</h4>
                <p className="text-sm text-muted-foreground">Browse business offerings</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toast({ title: "Edit Biz-Catalogue settings (Coming soon)" });
              }}
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <User className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Basic Information</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
            onClick={() => setEditBasicInfoOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium">{basicInfo.gender}</p>
            <p className="text-sm text-muted-foreground">Gender</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">{new Date(basicInfo.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-sm text-muted-foreground">Birthday</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">{basicInfo.languages}</p>
            <p className="text-sm text-muted-foreground">Languages Spoken</p>
          </div>
        </div>
      </Card>

      {/* Relationship */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Heart className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Relationship</h3>
            {relationship.privacy && (
              <PrivacyBadge 
                level={relationship.privacy as PrivacyLevel} 
                exceptionsCount={relationship.exceptions?.length}
              />
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
            onClick={() => setEditRelationshipOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <p className="font-medium">{relationship.status}</p>
          <p className="text-sm text-muted-foreground">Status</p>
        </div>
      </Card>

      {/* Love Life & Friendship */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Heart className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Love Life & Friendship</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
            onClick={() => setEditLoveFriendshipOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {loveFriendship.length > 0 ? (
            loveFriendship.map((friendship, index) => (
              <div key={friendship.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div>
                  <p 
                    className="font-medium text-primary hover:underline cursor-pointer"
                    onClick={() => handleUserProfileClick(friendship.id)}
                  >
                    {friendship.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{friendship.relationshipTag}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No friendships added</p>
          )}
        </div>
      </Card>

      {/* Family */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Users className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Family</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
            onClick={() => setEditFamilyOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {family.map((member, index) => (
            <div key={member.id}>
              {index > 0 && <Separator className="mb-4" />}
              <div>
                <p 
                  className="font-medium text-primary hover:underline cursor-pointer"
                  onClick={() => handleUserProfileClick(member.id)}
                >
                  {member.name}
                </p>
                <p className="text-sm text-muted-foreground">{member.relation}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Social Community */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Users className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Social Community</h3>
            <Badge variant="secondary" className="text-xs px-2 py-0.5 shrink-0">System Managed</Badge>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
                  onClick={() => setEditSocialCommunityOpen(true)}
                >
                  <Shield className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage Privacy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-4">
          {socialCommunities.length > 0 ? (
            socialCommunities.map((community, index) => (
              <div key={community.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="space-y-2">
                  <div>
                    <p 
                      className="font-medium text-primary hover:underline cursor-pointer"
                      onClick={() => handleCommunityClick(community.id)}
                    >
                      {community.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {community.type}
                      {community.role && ` • ${community.role}`}
                      {` • ${community.status}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Member since: {new Date(community.joinDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    {community.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {community.location}
                      </p>
                    )}
                  </div>
                  <Badge 
                    variant={community.privacy === "public" ? "default" : community.privacy === "friends" ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {community.privacy === "public" && "🌐 Public"}
                    {community.privacy === "friends" && "👥 Friends"}
                    {community.privacy === "only_me" && "🔒 Only Me"}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              You haven't joined any Social Communities yet. Join Town Unions, Clubs, and Associations on Mobigate to see them here.
            </p>
          )}
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Phone className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Contact Information</h3>
            {contact.privacy && (
              <PrivacyBadge 
                level={contact.privacy as PrivacyLevel} 
                exceptionsCount={contact.exceptions?.length}
              />
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
            onClick={() => setEditContactOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">Tel: {contact.phone1}</p>
              {contact.phone2 && <p className="font-medium">{contact.phone2}</p>}
            </div>
          </div>
          <Separator />
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">E-mail: <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a></p>
            </div>
          </div>
        </div>
      </Card>

      {/* Currency */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <Banknote className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">Currency</h3>
            {currency.privacy && (
              <PrivacyBadge 
                level={currency.privacy as PrivacyLevel} 
                exceptionsCount={currency.exceptions?.length}
              />
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
            onClick={() => setEditCurrencyOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        
        <div>
          <p className="font-medium text-lg">{currency.currencySymbol} {currency.preferredCurrency}</p>
          <p className="text-sm text-muted-foreground">Preferred Currency</p>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            <User className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold min-w-0">About</h3>
            {about.privacy && (
              <PrivacyBadge 
                level={about.privacy as PrivacyLevel} 
                exceptionsCount={about.exceptions?.length}
              />
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
            onClick={() => setEditAboutOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="prose prose-sm max-w-none">
          {about.text.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-foreground leading-relaxed mt-3 first:mt-0">
              {paragraph}
            </p>
          ))}
        </div>
      </Card>

      {/* Edit Dialogs */}
      <EditSectionDialog
        open={editLocationOpen}
        onOpenChange={setEditLocationOpen}
        title="Edit Locations"
        maxWidth="lg"
      >
        <EditLocationForm
          currentData={locations}
          onSave={setLocations}
          onClose={() => setEditLocationOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editEducationOpen}
        onOpenChange={setEditEducationOpen}
        title="Edit Education"
        maxWidth="lg"
      >
        <EditEducationForm
          currentData={education}
          onSave={setEducation}
          onClose={() => setEditEducationOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editWorkOpen}
        onOpenChange={setEditWorkOpen}
        title="Edit Work Experience"
        maxWidth="lg"
      >
        <EditWorkForm
          currentData={work}
          onSave={setWork}
          onClose={() => setEditWorkOpen(false)}
        />
      </EditSectionDialog>


      <EditSectionDialog
        open={editBasicInfoOpen}
        onOpenChange={setEditBasicInfoOpen}
        title="Edit Basic Information"
      >
        <EditBasicInfoForm
          currentData={basicInfo}
          onSave={setBasicInfo}
          onClose={() => setEditBasicInfoOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editRelationshipOpen}
        onOpenChange={setEditRelationshipOpen}
        title="Edit Relationship Status"
      >
        <EditRelationshipForm
          currentData={relationship}
          onSave={setRelationship}
          onClose={() => setEditRelationshipOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editLoveFriendshipOpen}
        onOpenChange={setEditLoveFriendshipOpen}
        title="Edit Love Life & Friendship"
        maxWidth="lg"
      >
        <EditLoveFriendshipForm
          currentData={loveFriendship}
          onSave={setLoveFriendship}
          onClose={() => setEditLoveFriendshipOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editFamilyOpen}
        onOpenChange={setEditFamilyOpen}
        title="Edit Family Members"
        maxWidth="lg"
      >
        <EditFamilyForm
          currentData={family}
          onSave={setFamily}
          onClose={() => setEditFamilyOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editSocialCommunityOpen}
        onOpenChange={setEditSocialCommunityOpen}
        title="Manage Social Community Privacy"
        maxWidth="lg"
      >
        <EditSocialCommunityForm
          currentData={socialCommunities}
          onSave={setSocialCommunities}
          onClose={() => setEditSocialCommunityOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editContactOpen}
        onOpenChange={setEditContactOpen}
        title="Edit Contact Information"
      >
        <EditContactForm
          currentData={contact}
          onSave={setContact}
          onClose={() => setEditContactOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editAboutOpen}
        onOpenChange={setEditAboutOpen}
        title="Edit About"
        maxWidth="2xl"
      >
        <EditAboutForm
          currentData={about}
          onSave={setAbout}
          onClose={() => setEditAboutOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editRefererUrlOpen}
        onOpenChange={setEditRefererUrlOpen}
        title="Edit Referer URL"
        maxWidth="lg"
      >
        <EditRefererUrlForm
          currentData={refererUrl}
          onSave={(data) => {
            setRefererUrl(data);
            setEditRefererUrlOpen(false);
          }}
          onClose={() => setEditRefererUrlOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editCurrencyOpen}
        onOpenChange={setEditCurrencyOpen}
        title="Edit Currency Settings"
        maxWidth="lg"
      >
        <EditCurrencyForm
          currentData={currency}
          onSave={(data) => {
            setCurrency(data);
            setEditCurrencyOpen(false);
          }}
          onClose={() => setEditCurrencyOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editSchoolMatesOpen}
        onOpenChange={setEditSchoolMatesOpen}
        title="Edit School Mates"
        maxWidth="2xl"
      >
        <EditSchoolMatesForm
          currentData={schoolMates}
          onSave={setSchoolMates}
          onClose={() => setEditSchoolMatesOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editClassmatesOpen}
        onOpenChange={setEditClassmatesOpen}
        title="Edit Classmates"
        maxWidth="2xl"
      >
        <EditClassmatesForm
          currentData={classmates}
          onSave={setClassmates}
          onClose={() => setEditClassmatesOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editAgeMatesOpen}
        onOpenChange={setEditAgeMatesOpen}
        title="Edit Age Mates"
        maxWidth="lg"
      >
        <EditAgeMatesForm
          currentData={ageMates}
          onSave={setAgeMates}
          onClose={() => setEditAgeMatesOpen(false)}
        />
      </EditSectionDialog>

      <EditSectionDialog
        open={editWorkColleaguesOpen}
        onOpenChange={setEditWorkColleaguesOpen}
        title="Edit Work Colleagues"
        maxWidth="lg"
      >
        <EditWorkColleaguesForm
          currentData={workColleagues}
          onSave={setWorkColleagues}
          onClose={() => setEditWorkColleaguesOpen(false)}
        />
      </EditSectionDialog>

      <MateDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        mate={selectedMate}
        type={mateType}
      />
    </div>
  );
};
