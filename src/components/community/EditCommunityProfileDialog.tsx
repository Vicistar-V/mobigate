import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { ExecutiveMember, ExecutiveProfile } from "@/data/communityExecutivesData";
import { nigerianStates } from "@/data/communityFormOptions";
import { EditableListSection } from "./EditableListSection";
import { 
  User, GraduationCap, Briefcase, Trophy, Star, Building, Phone, Award,
  ChevronDown, Plus, X, Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditCommunityProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: ExecutiveMember;
  onSave: (updatedProfile: Partial<ExecutiveProfile>, updatedMilestones?: string[]) => void;
}

interface EducationEntry {
  institution: string;
  qualification: string;
  year?: string;
}

interface PositionEntry {
  position: string;
  period: string;
}

interface AwardEntry {
  title: string;
  organization: string;
  year?: string;
}

interface CollapsibleEditSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleEditSection = ({ icon, title, children, defaultOpen = false }: CollapsibleEditSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg">
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-semibold">{title}</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 pb-3 pt-1 border-t">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const EditCommunityProfileDialog = ({
  open,
  onOpenChange,
  member,
  onSave,
}: EditCommunityProfileDialogProps) => {
  const profile = member.profile || {};

  // Personal Info
  const [bio, setBio] = useState(profile.bio || "");
  const [profession, setProfession] = useState(profile.profession || "");
  const [stateOfOrigin, setStateOfOrigin] = useState(profile.stateOfOrigin || "");
  const [lga, setLga] = useState(profile.lga || "");
  const [hometown, setHometown] = useState(profile.hometown || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [email, setEmail] = useState(profile.email || "");

  // Education
  const [education, setEducation] = useState<EducationEntry[]>(profile.education || []);
  const [newEduInstitution, setNewEduInstitution] = useState("");
  const [newEduQualification, setNewEduQualification] = useState("");
  const [newEduYear, setNewEduYear] = useState("");

  // Skills
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [newSkill, setNewSkill] = useState("");

  // Professional Achievements
  const [achievements, setAchievements] = useState<string[]>(profile.professionalAchievements || []);

  // Awards
  const [awards, setAwards] = useState<AwardEntry[]>(profile.awards || []);
  const [newAwardTitle, setNewAwardTitle] = useState("");
  const [newAwardOrg, setNewAwardOrg] = useState("");
  const [newAwardYear, setNewAwardYear] = useState("");

  // Previous Positions
  const [positions, setPositions] = useState<PositionEntry[]>(profile.previousPositions || []);
  const [newPosTitle, setNewPosTitle] = useState("");
  const [newPosPeriod, setNewPosPeriod] = useState("");

  // Milestones
  const [milestones, setMilestones] = useState<string[]>(member.milestones || []);

  useEffect(() => {
    if (open) {
      setBio(profile.bio || "");
      setProfession(profile.profession || "");
      setStateOfOrigin(profile.stateOfOrigin || "");
      setLga(profile.lga || "");
      setHometown(profile.hometown || "");
      setPhone(profile.phone || "");
      setEmail(profile.email || "");
      setEducation(profile.education || []);
      setSkills(profile.skills || []);
      setAchievements(profile.professionalAchievements || []);
      setAwards(profile.awards || []);
      setPositions(profile.previousPositions || []);
      setMilestones(member.milestones || []);
    }
  }, [open, profile, member.milestones]);

  const handleSave = () => {
    onSave({
      bio,
      profession,
      stateOfOrigin,
      lga,
      hometown,
      phone,
      email,
      education,
      skills,
      professionalAchievements: achievements,
      awards,
      previousPositions: positions,
    }, milestones);
    toast.success("Community profile updated successfully");
    onOpenChange(false);
  };

  // Add handlers
  const handleAddEducation = () => {
    if (newEduInstitution.trim() && newEduQualification.trim()) {
      setEducation([...education, { 
        institution: newEduInstitution.trim(), 
        qualification: newEduQualification.trim(),
        year: newEduYear.trim() || undefined
      }]);
      setNewEduInstitution("");
      setNewEduQualification("");
      setNewEduYear("");
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleAddAward = () => {
    if (newAwardTitle.trim() && newAwardOrg.trim()) {
      setAwards([...awards, {
        title: newAwardTitle.trim(),
        organization: newAwardOrg.trim(),
        year: newAwardYear.trim() || undefined
      }]);
      setNewAwardTitle("");
      setNewAwardOrg("");
      setNewAwardYear("");
    }
  };

  const handleAddPosition = () => {
    if (newPosTitle.trim() && newPosPeriod.trim()) {
      setPositions([...positions, {
        position: newPosTitle.trim(),
        period: newPosPeriod.trim()
      }]);
      setNewPosTitle("");
      setNewPosPeriod("");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh] flex flex-col touch-auto overflow-hidden">
        <DrawerHeader className="border-b pb-3 flex-shrink-0">
          <DrawerTitle className="text-center">Edit Community Profile</DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto min-h-0 touch-auto">
          <div className="px-4 py-4 space-y-3">
            
            {/* PERSONAL INFORMATION */}
            <CollapsibleEditSection
              icon={<User className="h-4 w-4 text-primary" />}
              title="Personal Information"
              defaultOpen={true}
            >
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="bio" className="text-xs">Bio / About</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the community about yourself..."
                    rows={3}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profession" className="text-xs">Profession</Label>
                  <Input
                    id="profession"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Legal Practitioner"
                    className="h-9 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">State of Origin</Label>
                    <Select value={stateOfOrigin} onValueChange={setStateOfOrigin}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lga" className="text-xs">LGA</Label>
                    <Input
                      id="lga"
                      value={lga}
                      onChange={(e) => setLga(e.target.value)}
                      placeholder="LGA"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="hometown" className="text-xs">Hometown</Label>
                  <Input
                    id="hometown"
                    value={hometown}
                    onChange={(e) => setHometown(e.target.value)}
                    placeholder="Your hometown"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </CollapsibleEditSection>

            {/* EDUCATION */}
            <CollapsibleEditSection
              icon={<GraduationCap className="h-4 w-4 text-primary" />}
              title="Education / Qualifications"
            >
              <div className="space-y-3 pt-2">
                {education.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No education entries added</p>
                ) : (
                  <ul className="space-y-2">
                    {education.map((edu, index) => (
                      <li key={index} className="flex items-start gap-2 group bg-muted/30 rounded-md p-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{edu.qualification}</p>
                          <p className="text-xs text-muted-foreground">{edu.institution}{edu.year && ` (${edu.year})`}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => setEducation(education.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="space-y-2 pt-2 border-t">
                  <Input
                    value={newEduQualification}
                    onChange={(e) => setNewEduQualification(e.target.value)}
                    placeholder="Qualification (e.g. B.Sc. Accounting)"
                    className="h-9 text-sm"
                  />
                  <Input
                    value={newEduInstitution}
                    onChange={(e) => setNewEduInstitution(e.target.value)}
                    placeholder="Institution"
                    className="h-9 text-sm"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newEduYear}
                      onChange={(e) => setNewEduYear(e.target.value)}
                      placeholder="Year (optional)"
                      className="h-9 text-sm flex-1"
                    />
                    <Button size="sm" variant="outline" onClick={handleAddEducation} disabled={!newEduInstitution.trim() || !newEduQualification.trim()}>
                      <Plus className="h-3.5 w-3.5 mr-1" />Add
                    </Button>
                  </div>
                </div>
              </div>
            </CollapsibleEditSection>

            {/* SKILLS */}
            <CollapsibleEditSection
              icon={<Wrench className="h-4 w-4 text-primary" />}
              title="Skills"
            >
              <div className="space-y-3 pt-2">
                {skills.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No skills added</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {skill}
                        <button onClick={() => setSkills(skills.filter((_, i) => i !== index))} className="hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    className="h-9 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                  <Button size="sm" variant="outline" onClick={handleAddSkill} disabled={!newSkill.trim()}>
                    <Plus className="h-3.5 w-3.5 mr-1" />Add
                  </Button>
                </div>
              </div>
            </CollapsibleEditSection>

            {/* PROFESSIONAL ACHIEVEMENTS */}
            <CollapsibleEditSection
              icon={<Trophy className="h-4 w-4 text-primary" />}
              title="Professional Achievements"
            >
              <div className="pt-2">
                <EditableListSection
                  items={achievements}
                  onItemsChange={setAchievements}
                  placeholder="Add achievement..."
                  emptyMessage="No achievements added"
                />
              </div>
            </CollapsibleEditSection>

            {/* AWARDS */}
            <CollapsibleEditSection
              icon={<Award className="h-4 w-4 text-primary" />}
              title="Awards & Recognitions"
            >
              <div className="space-y-3 pt-2">
                {awards.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No awards added</p>
                ) : (
                  <ul className="space-y-2">
                    {awards.map((award, index) => (
                      <li key={index} className="flex items-start gap-2 group bg-muted/30 rounded-md p-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{award.title}</p>
                          <p className="text-xs text-muted-foreground">{award.organization}{award.year && ` (${award.year})`}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => setAwards(awards.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="space-y-2 pt-2 border-t">
                  <Input
                    value={newAwardTitle}
                    onChange={(e) => setNewAwardTitle(e.target.value)}
                    placeholder="Award title"
                    className="h-9 text-sm"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newAwardOrg}
                      onChange={(e) => setNewAwardOrg(e.target.value)}
                      placeholder="Organization"
                      className="h-9 text-sm flex-1"
                    />
                    <Input
                      value={newAwardYear}
                      onChange={(e) => setNewAwardYear(e.target.value)}
                      placeholder="Year"
                      className="h-9 text-sm w-20"
                    />
                  </div>
                  <Button size="sm" variant="outline" onClick={handleAddAward} disabled={!newAwardTitle.trim() || !newAwardOrg.trim()} className="w-full">
                    <Plus className="h-3.5 w-3.5 mr-1" />Add Award
                  </Button>
                </div>
              </div>
            </CollapsibleEditSection>

            {/* PREVIOUS POSITIONS */}
            <CollapsibleEditSection
              icon={<Building className="h-4 w-4 text-primary" />}
              title="Previous Community Positions"
            >
              <div className="space-y-3 pt-2">
                {positions.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No positions added</p>
                ) : (
                  <ul className="space-y-2">
                    {positions.map((pos, index) => (
                      <li key={index} className="flex items-start gap-2 group bg-muted/30 rounded-md p-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{pos.position}</p>
                          <p className="text-xs text-muted-foreground">{pos.period}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => setPositions(positions.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="space-y-2 pt-2 border-t">
                  <Input
                    value={newPosTitle}
                    onChange={(e) => setNewPosTitle(e.target.value)}
                    placeholder="Position title"
                    className="h-9 text-sm"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newPosPeriod}
                      onChange={(e) => setNewPosPeriod(e.target.value)}
                      placeholder="Period (e.g. 2020 - 2024)"
                      className="h-9 text-sm flex-1"
                    />
                    <Button size="sm" variant="outline" onClick={handleAddPosition} disabled={!newPosTitle.trim() || !newPosPeriod.trim()}>
                      <Plus className="h-3.5 w-3.5 mr-1" />Add
                    </Button>
                  </div>
                </div>
              </div>
            </CollapsibleEditSection>

            {/* LEADERSHIP MILESTONES */}
            <CollapsibleEditSection
              icon={<Star className="h-4 w-4 text-primary" />}
              title="Leadership / Administrative Milestones"
              defaultOpen={true}
            >
              <div className="pt-2">
                <EditableListSection
                  items={milestones}
                  onItemsChange={setMilestones}
                  placeholder="Add milestone..."
                  emptyMessage="No milestones added"
                />
              </div>
            </CollapsibleEditSection>

            {/* CONTACT INFORMATION */}
            <CollapsibleEditSection
              icon={<Phone className="h-4 w-4 text-primary" />}
              title="Contact Information"
            >
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234-XXX-XXX-XXXX"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </CollapsibleEditSection>

          </div>
        </ScrollArea>

        <DrawerFooter className="border-t pt-3 flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
