import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase, GraduationCap, User, Heart, Users, Mail, Phone, CheckCircle, Pencil } from "lucide-react";
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

interface ProfileAboutTabProps {
  userName: string;
}

export const ProfileAboutTab = ({ userName }: ProfileAboutTabProps) => {
  // Dialog states
  const [editLocationOpen, setEditLocationOpen] = useState(false);
  const [editEducationOpen, setEditEducationOpen] = useState(false);
  const [editWorkOpen, setEditWorkOpen] = useState(false);
  const [editBasicInfoOpen, setEditBasicInfoOpen] = useState(false);
  const [editRelationshipOpen, setEditRelationshipOpen] = useState(false);
  const [editFamilyOpen, setEditFamilyOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [editAboutOpen, setEditAboutOpen] = useState(false);

  // Data states
  const [designations, setDesignations] = useState("2-Star User, Mobi-Celebrity");
  const [locations, setLocations] = useState<{ id: string; place: string; description: string; period?: string }[]>([
    { id: "1", place: "Onitsha, Anambra State, Nigeria.", description: "Current City" },
    { id: "2", place: "Awka, Anambra State, Nigeria.", description: "Hometown" },
    { id: "3", place: "Lived in Aba, Abia, Nigeria", description: "1992 - 1998", period: "1992 - 1998" },
    { id: "4", place: "Lived in Port-Harcourt, Rivers, Nigeria", description: "2002 - 2009", period: "2002 - 2009" },
  ]);
  const [education, setEducation] = useState([
    { id: "1", school: "Studied at Nike Grammar School, Enugu, Nigeria", period: "Class of 2013 - 2019." },
    { id: "2", school: "Studied Civil Engineering at University of Nigeria, Nsukka, Nigeria", period: "Class of 2020 - 2025." },
  ]);
  const [work, setWork] = useState([
    { id: "1", position: "CEO at BeamColumn PCC Limited, Onitsha.", period: "January 5, 1995 - Present" },
    { id: "2", position: "MD at Kemjik Allied Resources Ltd, Aba, Abia State", period: "July 22, 2010 - December 10, 2024." },
  ]);
  const [basicInfo, setBasicInfo] = useState({
    gender: "Female",
    birthday: "1976-09-20",
    languages: "English, French and Igbo",
  });
  const [relationship, setRelationship] = useState("Married");
  const [family, setFamily] = useState([
    { id: "1", name: "Emeka Anigbogu", relation: "Brother" },
    { id: "2", name: "Stella Anthonia Obi", relation: "Wife" },
    { id: "3", name: "Michael Johnson Obi", relation: "Son" },
  ]);
  const [contact, setContact] = useState<{ phone1: string; phone2?: string; email: string }>({
    phone1: "+234-806-408-9171",
    phone2: "+234-803-477-1843",
    email: "kemjikng@yahoo.com",
  });
  const [about, setAbout] = useState(
    "I'm a Lawyer, Media Professional and Schola, with unique passion and experince in real estates, property development and management.\n\nI work with BeamColumn PCC Limited as Legal Adviser on Property Investments and Corporate Law; and also Senior Negotiator and Evaluator, etc."
  );

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
    </div>
  );
};
