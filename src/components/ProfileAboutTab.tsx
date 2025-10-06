import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase, GraduationCap, User, Heart, Users, Mail, Phone, CheckCircle, Pencil, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { MateDetailDialog } from "./profile/MateDetailDialog";

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
  period: string;
}

interface Work {
  id: string;
  position: string;
  period: string;
}

interface BasicInfo {
  gender: string;
  birthday: string;
  languages: string;
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
}

export const ProfileAboutTab = ({ userName }: ProfileAboutTabProps) => {
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
  const [editFamilyOpen, setEditFamilyOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [editAboutOpen, setEditAboutOpen] = useState(false);
  
  // Detail dialog states
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMate, setSelectedMate] = useState<SchoolMate | Classmate | AgeMate | WorkColleague | null>(null);
  const [mateType, setMateType] = useState<"schoolmate" | "classmate" | "agemate" | "colleague">("schoolmate");

  const openMateDetails = (mate: SchoolMate | Classmate | AgeMate | WorkColleague, type: typeof mateType) => {
    setSelectedMate(mate);
    setMateType(type);
    setDetailDialogOpen(true);
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
      { id: "1", school: "Studied at Nike Grammar School, Enugu, Nigeria", period: "Class of 2013 - 2019." },
      { id: "2", school: "Studied Civil Engineering at University of Nigeria, Nsukka, Nigeria", period: "Class of 2020 - 2025." },
    ])
  );
  const [work, setWork] = useState<Work[]>(() => 
    loadFromStorage("profile_work", [
      { id: "1", position: "CEO at BeamColumn PCC Limited, Onitsha.", period: "January 5, 1995 - Present" },
      { id: "2", position: "MD at Kemjik Allied Resources Ltd, Aba, Abia State", period: "July 22, 2010 - December 10, 2024." },
    ])
  );
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(() => 
    loadFromStorage("profile_basicInfo", {
      gender: "Female",
      birthday: "1976-09-20",
      languages: "English, French and Igbo",
    })
  );
  const [relationship, setRelationship] = useState<string>(() => 
    loadFromStorage("profile_relationship", "Married")
  );
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
  const [about, setAbout] = useState<string>(() => 
    loadFromStorage("profile_about", 
      "I'm a Lawyer, Media Professional and Schola, with unique passion and experince in real estates, property development and management.\n\nI work with BeamColumn PCC Limited as Legal Adviser on Property Investments and Corporate Law; and also Senior Negotiator and Evaluator, etc."
    )
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
        community: "Onitsha Urban Community",
        ageGrade: "Otu Udo 1975",
        ageBrackets: "1970-1980",
        nickname: "The Peacemaker",
        postsHeld: "Youth Leader (1995-1998), Financial Secretary (2005-2010)",
        privacy: "public"
      },
      {
        id: "2",
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

  return (
    <div className="space-y-6">
      {/* User Category */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">User Category</h3>
          </div>
          <Badge variant="secondary" className="text-xs">System Managed</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Verified User</p>
      </Card>

      {/* Designations */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Designations</h3>
          </div>
          <Badge variant="secondary" className="text-xs">Auto-Assigned</Badge>
        </div>
        <p className="font-medium">{designations}</p>
      </Card>

      {/* Location */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Location</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Education</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => setEditEducationOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={edu.id}>
              {index > 0 && <Separator className="mb-4" />}
              <div>
                <p className="font-medium">{edu.school}</p>
                <p className="text-sm text-muted-foreground">{edu.period}</p>
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
                  <div 
                    onClick={() => openMateDetails(mate, "schoolmate")}
                    className="cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <p className="font-medium">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
                    <p className="text-sm text-muted-foreground">{mate.institution}</p>
                    {mate.period && <p className="text-sm text-muted-foreground">{mate.period}</p>}
                    <p className="text-xs text-primary mt-1">Click to view full details</p>
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
                  <div 
                    onClick={() => openMateDetails(mate, "classmate")}
                    className="cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <p className="font-medium">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
                    <p className="text-sm text-muted-foreground">{mate.institution}</p>
                    {mate.period && <p className="text-sm text-muted-foreground">{mate.period}</p>}
                    <p className="text-xs text-primary mt-1">Click to view full details</p>
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
                  <div 
                    onClick={() => openMateDetails(mate, "agemate")}
                    className="cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <p className="font-medium">{mate.community}</p>
                    {mate.ageGrade && <p className="text-sm text-muted-foreground">Age Grade: {mate.ageGrade}</p>}
                    {mate.nickname && <p className="text-sm text-muted-foreground">Nickname: {mate.nickname}</p>}
                    <p className="text-xs text-primary mt-1">Click to view full details</p>
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
                  <div 
                    onClick={() => openMateDetails(colleague, "colleague")}
                    className="cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <p className="font-medium">{colleague.name}{colleague.nickname && ` (${colleague.nickname})`}</p>
                    <p className="text-sm text-muted-foreground">{colleague.workplaceName}{colleague.workplaceLocation && `, ${colleague.workplaceLocation}`}</p>
                    {colleague.position && <p className="text-sm text-muted-foreground">Position: {colleague.position}</p>}
                    <p className="text-xs text-primary mt-1">Click to view full details</p>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Business/Career/Work</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
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
                <p className="font-medium">{workItem.position}</p>
                <p className="text-sm text-muted-foreground">{workItem.period}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Basic Information</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Relationship</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => setEditRelationshipOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <p className="font-medium">{relationship}</p>
          <p className="text-sm text-muted-foreground">Status</p>
        </div>
      </Card>

      {/* Family */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Family</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
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
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.relation}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Contact Information</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
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

      {/* About */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">About</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => setEditAboutOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="prose prose-sm max-w-none">
          {about.split('\n\n').map((paragraph, index) => (
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
