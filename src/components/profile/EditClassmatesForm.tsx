import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, Save, X, User, Search, Globe, Users, ExternalLink, Check } from "lucide-react";
import { PrivacySelector } from "./PrivacySelector";
import { ImageUploader } from "./ImageUploader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MobigateUserSearch, MobigateUser } from "./MobigateUserSearch";
import { FriendsListSearch, Friend } from "./FriendsListSearch";

const classmateSchema = z.object({
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

export interface Classmate {
  id: string;
  name: string;
  originalName?: string;
  linkedUserId?: string;
  linkedUserName?: string;
  linkedUserProfileImage?: string;
  isActive?: boolean;
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

interface EditClassmatesFormProps {
  currentData: Classmate[];
  onSave: (data: Classmate[]) => void;
  onClose: () => void;
}

export const EditClassmatesForm = ({ currentData, onSave, onClose }: EditClassmatesFormProps) => {
  const [classmates, setClassmates] = useState<Classmate[]>(currentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [institutionLogo, setInstitutionLogo] = useState<string | undefined>();
  const [selectedUser, setSelectedUser] = useState<MobigateUser | Friend | null>(null);
  const [searchMobigateOpen, setSearchMobigateOpen] = useState(false);
  const [searchFriendsOpen, setSearchFriendsOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(classmateSchema),
  });

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setPrivacy("public");
    setProfileImage(undefined);
    setInstitutionLogo(undefined);
    setSelectedUser(null);
    reset({});
  };

  const handleEdit = (mate: Classmate) => {
    setEditingId(mate.id);
    setIsAdding(false);
    setPrivacy(mate.privacy || "public");
    setProfileImage(mate.profileImage);
    setInstitutionLogo(mate.institutionLogo);
    reset(mate);
  };

  const handleDelete = (id: string) => {
    setClassmates(classmates.filter(m => m.id !== id));
  };

  const onSubmit = (data: any) => {
    const mateData: Classmate = {
      id: isAdding ? Date.now().toString() : editingId!,
      ...data,
      originalName: !selectedUser ? data.name : (data.name || undefined),
      name: selectedUser ? selectedUser.name : data.name,
      linkedUserId: selectedUser?.id,
      linkedUserName: selectedUser?.name,
      linkedUserProfileImage: selectedUser?.profileImage,
      isActive: !!selectedUser,
      privacy,
      profileImage: selectedUser?.profileImage || profileImage,
      institutionLogo,
    };

    if (isAdding) {
      setClassmates([...classmates, mateData]);
      setIsAdding(false);
    } else if (editingId) {
      setClassmates(classmates.map(m => 
        m.id === editingId ? mateData : m
      ));
      setEditingId(null);
    }
    setProfileImage(undefined);
    setInstitutionLogo(undefined);
    setSelectedUser(null);
    reset({});
  };

  const handleSave = () => {
    onSave(classmates);
    onClose();
  };

  return (
    <div className="space-y-4">
      {classmates.map((mate) => (
        <div key={mate.id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/50 rounded-lg flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={mate.profileImage} alt={mate.name} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
                {mate.isActive && (
                  <Badge variant="secondary" className="text-base">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              {mate.originalName && mate.originalName !== mate.name && (
                <p className="text-base text-muted-foreground">Originally: {mate.originalName}</p>
              )}
              <div className="flex items-center gap-2">
                {mate.institutionLogo && (
                  <img src={mate.institutionLogo} alt="" className="h-4 w-4 object-contain" />
                )}
                <p className="text-base text-muted-foreground truncate">{mate.institution}</p>
              </div>
              {mate.period && <p className="text-base text-muted-foreground">{mate.period}</p>}
              {mate.isActive && mate.linkedUserId && (
                <button
                  onClick={() => window.location.href = `/profile?id=${mate.linkedUserId}`}
                  className="text-base text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  View Profile
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2 shrink-0 flex-col sm:flex-row w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(mate)} className="w-full sm:w-auto">
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(mate.id)} className="w-full sm:w-auto">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 p-2 sm:p-4 border rounded-lg">
          <div className="space-y-3 p-3 sm:p-4 bg-muted/20 rounded-lg border-2 border-dashed">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-medium">Link to Mobigate User</Label>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSearchMobigateOpen(true)}
                className="w-full"
              >
                <Globe className="h-4 w-4 mr-2" />
                Search on Mobigate
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setSearchFriendsOpen(true)}
                className="w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                Select from Friends
              </Button>
            </div>
            
            {selectedUser && (
              <div className="flex items-center gap-3 p-2 sm:p-3 bg-background rounded-md border">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={selectedUser.profileImage} />
                  <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium truncate">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{'username' in selectedUser ? selectedUser.username : ''}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedUser(null)}
                  className="h-8 w-8 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label>Profile Picture</Label>
            <ImageUploader
              value={selectedUser?.profileImage || profileImage}
              onChange={setProfileImage}
              type="avatar"
            />
          </div>

          <div>
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name" 
              {...register("name")} 
              value={selectedUser?.name || undefined}
              placeholder="Type manually or search above"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Type manually or search above to link a Mobigate user
            </p>
            {errors.name && <p className="text-base text-destructive mt-1">{errors.name.message as string}</p>}
          </div>

          <div>
            <Label htmlFor="institution">School/Institution *</Label>
            <Input id="institution" {...register("institution")} />
            {errors.institution && <p className="text-base text-destructive mt-1">{errors.institution.message as string}</p>}
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

          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              {isAdding ? "Add" : "Update"}
            </Button>
            <Button type="button" variant="outline" onClick={() => {
              setIsAdding(false);
              setEditingId(null);
              reset({});
            }} className="w-full sm:w-auto">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      )}

      {!isAdding && !editingId && (
        <Button onClick={handleAdd} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Classmate
        </Button>
      )}

      <MobigateUserSearch
        open={searchMobigateOpen}
        onOpenChange={setSearchMobigateOpen}
        onSelect={(user) => {
          setSelectedUser(user);
          reset({ ...reset, name: user.name });
        }}
      />

      <FriendsListSearch
        open={searchFriendsOpen}
        onOpenChange={setSearchFriendsOpen}
        onSelect={(friend) => {
          setSelectedUser(friend);
          reset({ ...reset, name: friend.name });
        }}
      />

      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
        <Button onClick={handleSave} className="flex-1">Save All Changes</Button>
        <Button onClick={onClose} variant="outline" className="sm:w-auto">Close</Button>
      </div>
    </div>
  );
};
