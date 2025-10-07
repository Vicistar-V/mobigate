import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, Save, X, User } from "lucide-react";
import { PrivacySelector } from "./PrivacySelector";
import { ImageUploader } from "./ImageUploader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const schoolMateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  institution: z.string().min(1, "Institution is required"),
  period: z.string().optional(),
  postsHeld: z.string().optional(),
  nickname: z.string().optional(),
  sportsPlayed: z.string().optional(),
  clubsAssociations: z.string().optional(),
  favouriteTeacher: z.string().optional(),
  teacherNickname: z.string().optional(),
  teacherHometown: z.string().optional(),
  teacherSubject: z.string().optional(),
  teacherPosition: z.string().optional(),
});

export interface SchoolMate {
  id: string;
  name: string;
  institution: string;
  period?: string;
  postsHeld?: string;
  nickname?: string;
  sportsPlayed?: string;
  clubsAssociations?: string;
  favouriteTeacher?: string;
  teacherNickname?: string;
  teacherHometown?: string;
  teacherSubject?: string;
  teacherPosition?: string;
  privacy?: string;
  profileImage?: string;
  institutionLogo?: string;
}

interface EditSchoolMatesFormProps {
  currentData: SchoolMate[];
  onSave: (data: SchoolMate[]) => void;
  onClose: () => void;
}

export const EditSchoolMatesForm = ({ currentData, onSave, onClose }: EditSchoolMatesFormProps) => {
  const [schoolMates, setSchoolMates] = useState<SchoolMate[]>(currentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [institutionLogo, setInstitutionLogo] = useState<string | undefined>();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schoolMateSchema),
  });

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setPrivacy("public");
    setProfileImage(undefined);
    setInstitutionLogo(undefined);
    reset({});
  };

  const handleEdit = (mate: SchoolMate) => {
    setEditingId(mate.id);
    setIsAdding(false);
    setPrivacy(mate.privacy || "public");
    setProfileImage(mate.profileImage);
    setInstitutionLogo(mate.institutionLogo);
    reset(mate);
  };

  const handleDelete = (id: string) => {
    setSchoolMates(schoolMates.filter(m => m.id !== id));
  };

  const onSubmit = (data: any) => {
    if (isAdding) {
      const newMate: SchoolMate = {
        id: Date.now().toString(),
        ...data,
        privacy,
        profileImage,
        institutionLogo,
      };
      setSchoolMates([...schoolMates, newMate]);
      setIsAdding(false);
    } else if (editingId) {
      setSchoolMates(schoolMates.map(m => 
        m.id === editingId ? { ...m, ...data, privacy, profileImage, institutionLogo } : m
      ));
      setEditingId(null);
    }
    setProfileImage(undefined);
    setInstitutionLogo(undefined);
    reset({});
  };

  const handleSave = () => {
    onSave(schoolMates);
    onClose();
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      {schoolMates.map((mate) => (
        <div key={mate.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src={mate.profileImage} alt={mate.name} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
              <div className="flex items-center gap-2">
                {mate.institutionLogo && (
                  <img src={mate.institutionLogo} alt="" className="h-4 w-4 object-contain" />
                )}
                <p className="text-sm text-muted-foreground">{mate.institution}</p>
              </div>
              {mate.period && <p className="text-sm text-muted-foreground">{mate.period}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(mate)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(mate.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg">
          <div>
            <Label>Profile Picture</Label>
            <ImageUploader
              value={profileImage}
              onChange={setProfileImage}
              type="avatar"
            />
          </div>

          <div>
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message as string}</p>}
          </div>

          <div>
            <Label htmlFor="institution">School/Institution *</Label>
            <Input id="institution" {...register("institution")} />
            {errors.institution && <p className="text-sm text-destructive mt-1">{errors.institution.message as string}</p>}
          </div>

          <div>
            <Label>Institution Logo</Label>
            <ImageUploader
              value={institutionLogo}
              onChange={setInstitutionLogo}
              type="logo"
              placeholder="Upload Institution Logo"
            />
          </div>

          <div>
            <Label htmlFor="period">Period</Label>
            <Input id="period" placeholder="e.g., 2010 - 2015" {...register("period")} />
          </div>

          <div>
            <Label htmlFor="nickname">Nickname</Label>
            <Input id="nickname" {...register("nickname")} />
          </div>

          <div>
            <Label htmlFor="postsHeld">Posts Held (with Dates)</Label>
            <Textarea id="postsHeld" placeholder="e.g., Class Prefect (2013-2014)" {...register("postsHeld")} />
          </div>

          <div>
            <Label htmlFor="sportsPlayed">Sports Played (Teams)</Label>
            <Textarea id="sportsPlayed" placeholder="e.g., Football - School Team Captain" {...register("sportsPlayed")} />
          </div>

          <div>
            <Label htmlFor="clubsAssociations">Clubs & Associations (Names, Posts, Dates)</Label>
            <Textarea id="clubsAssociations" placeholder="e.g., Debate Club - President (2013-2015)" {...register("clubsAssociations")} />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Favourite Class Teacher</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="favouriteTeacher">Name</Label>
                <Input id="favouriteTeacher" {...register("favouriteTeacher")} />
              </div>
              <div>
                <Label htmlFor="teacherNickname">Nickname</Label>
                <Input id="teacherNickname" {...register("teacherNickname")} />
              </div>
              <div>
                <Label htmlFor="teacherHometown">Hometown</Label>
                <Input id="teacherHometown" {...register("teacherHometown")} />
              </div>
              <div>
                <Label htmlFor="teacherSubject">Course/Subject Taught</Label>
                <Input id="teacherSubject" {...register("teacherSubject")} />
              </div>
              <div>
                <Label htmlFor="teacherPosition">Position/Office</Label>
                <Input id="teacherPosition" {...register("teacherPosition")} />
              </div>
            </div>
          </div>

          <PrivacySelector value={privacy} onChange={setPrivacy} />

          <div className="flex gap-2">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {isAdding ? "Add" : "Update"}
            </Button>
            <Button type="button" variant="outline" onClick={() => {
              setIsAdding(false);
              setEditingId(null);
              reset({});
            }}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      )}

      {!isAdding && !editingId && (
        <Button onClick={handleAdd} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add School Mate
        </Button>
      )}

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={handleSave} className="flex-1">Save All Changes</Button>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
    </div>
  );
};
