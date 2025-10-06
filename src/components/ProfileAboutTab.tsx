import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase, GraduationCap, User, Heart, Users, Mail, Phone, CheckCircle } from "lucide-react";

interface ProfileAboutTabProps {
  userName: string;
}

export const ProfileAboutTab = ({ userName }: ProfileAboutTabProps) => {
  return (
    <div className="space-y-6">
      {/* User Category */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">User Category</h3>
        </div>
        <Badge variant="secondary" className="text-sm">Verified User</Badge>
      </Card>

      {/* Designations */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Designations</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="text-sm">2-Star</Badge>
          <Badge variant="default" className="text-sm">Mobi-Celebrity</Badge>
        </div>
      </Card>

      {/* Location */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Location</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Onitsha, Anambra State, Nigeria.</p>
            <p className="text-sm text-muted-foreground">Current City</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Awka, Anambra State, Nigeria.</p>
            <p className="text-sm text-muted-foreground">Hometown</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Lived in Aba, Abia, Nigeria</p>
            <p className="text-sm text-muted-foreground">1992 - 1998</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Lived in Port-Harcourt, Rivers, Nigeria</p>
            <p className="text-sm text-muted-foreground">2002 - 2009</p>
          </div>
        </div>
      </Card>

      {/* Education */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Education</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Studied at Nike Grammar School, Enugu, Nigeria</p>
            <p className="text-sm text-muted-foreground">Class of 2013 - 2019.</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Studied Civil Engineering at University of Nigeria, Nsukka, Nigeria</p>
            <p className="text-sm text-muted-foreground">Class of 2020 - 2025.</p>
          </div>
        </div>
      </Card>

      {/* Business/Career/Work */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Business/Career/Work</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium">CEO at BeamColumn PCC Limited, Onitsha.</p>
            <p className="text-sm text-muted-foreground">January 5, 1995 - Present</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">MD at Kemjik Allied Resources Ltd, Aba, Abia State</p>
            <p className="text-sm text-muted-foreground">July 22, 2010 - December 10, 2024.</p>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Basic Information</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Female</p>
            <p className="text-sm text-muted-foreground">Gender</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">September 20, 1976</p>
            <p className="text-sm text-muted-foreground">Birthday</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">English, French and Igbo</p>
            <p className="text-sm text-muted-foreground">Languages Spoken</p>
          </div>
        </div>
      </Card>

      {/* Relationship */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Relationship</h3>
        </div>
        <div>
          <p className="font-medium">Married</p>
          <p className="text-sm text-muted-foreground">Status</p>
        </div>
      </Card>

      {/* Family */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Family</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Emeka Anigbogu</p>
            <p className="text-sm text-muted-foreground">Brother</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Stella Anthonia Obi</p>
            <p className="text-sm text-muted-foreground">Wife</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Michael Johnson Obi</p>
            <p className="text-sm text-muted-foreground">Son</p>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Contact Information</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">Tel: +234-806-408-9171</p>
              <p className="font-medium">+234-803-477-1843</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">E-mail: <a href="mailto:kemjikng@yahoo.com" className="text-primary hover:underline">kemjikng@yahoo.com</a></p>
            </div>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">About</h3>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground leading-relaxed">
            I'm a Lawyer, Media Professional and Schola, with unique passion and experince in real estates, property development and management.
          </p>
          <p className="text-foreground leading-relaxed mt-3">
            I work with BeamColumn PCC Limited as Legal Adviser on Property Investments and Corporate Law; and also Senior Negotiator and Evaluator, etc.
          </p>
        </div>
      </Card>
    </div>
  );
};
