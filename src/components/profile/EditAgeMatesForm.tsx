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

const ageMateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  community: z.string().min(1, "Community is required"),
  ageGrade: z.string().optional(),
  ageBrackets: z.string().optional(),
  postsHeld: z.string().optional(),
  nickname: z.string().optional(),
});

export interface AgeMate {
  id: string;
  name: string;
  originalName?: string;
  linkedUserId?: string;
  linkedUserName?: string;
  linkedUserProfileImage?: string;
  isActive?: boolean;
  community: string;
  ageGrade?: string;
  ageBrackets?: string;
  postsHeld?: string;
  nickname?: string;
  privacy?: string;
  profileImage?: string;
}

interface EditAgeMatesFormProps {
  currentData: AgeMate[];
  onSave: (data: AgeMate[]) => void;
  onClose: () => void;
}

export const EditAgeMatesForm = ({ currentData, onSave, onClose }: EditAgeMatesFormProps) => {
  const [ageMates, setAgeMates] = useState<AgeMate[]>(currentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [selectedUser, setSelectedUser] = useState<MobigateUser | Friend | null>(null);
  const [searchMobigateOpen, setSearchMobigateOpen] = useState(false);
  const [searchFriendsOpen, setSearchFriendsOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(ageMateSchema),
  });

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setPrivacy("public");
    setProfileImage(undefined);
    setSelectedUser(null);
    reset({});
  };

  const handleEdit = (mate: AgeMate) => {
    setEditingId(mate.id);
    setIsAdding(false);
    setPrivacy(mate.privacy || "public");
    setProfileImage(mate.profileImage);
    reset(mate);
  };

  const handleDelete = (id: string) => {
    setAgeMates(ageMates.filter(m => m.id !== id));
  };

  const onSubmit = (data: any) => {
    const mateData: AgeMate = {
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
    };

    if (isAdding) {
      setAgeMates([...ageMates, mateData]);
      setIsAdding(false);
    } else if (editingId) {
      setAgeMates(ageMates.map(m => 
        m.id === editingId ? mateData : m
      ));
      setEditingId(null);
    }
    setProfileImage(undefined);
    setSelectedUser(null);
    reset({});
  };

  const handleSave = () => {
    onSave(ageMates);
    onClose();
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      {ageMates.map((mate) => (
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
                  <Badge variant="secondary" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              {mate.originalName && mate.originalName !== mate.name && (
                <p className="text-xs text-muted-foreground">Originally: {mate.originalName}</p>
              )}
              <p className="text-sm text-muted-foreground truncate">{mate.community}</p>
              {mate.ageGrade && <p className="text-sm text-muted-foreground">{mate.ageGrade}</p>}
              {mate.isActive && mate.linkedUserId && (
                <button
                  onClick={() => window.location.href = `/profile?id=${mate.linkedUserId}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
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
              <Label className="text-sm font-medium">Link to Mobigate User</Label>
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
                  <p className="text-sm font-medium truncate">{selectedUser.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{'username' in selectedUser ? selectedUser.username : ''}</p>
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
            <p className="text-xs text-muted-foreground mt-1">
              Type manually or search above to link a Mobigate user
            </p>
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message as string}</p>}
          </div>

          <div>
            <Label htmlFor="ageGrade">Age-Grade</Label>
            <Input id="ageGrade" placeholder="e.g., 1975 Age Grade" {...register("ageGrade")} />
          </div>

          <div>
            <Label htmlFor="community">Community *</Label>
            <Input id="community" {...register("community")} />
            {errors.community && <p className="text-sm text-destructive mt-1">{errors.community.message as string}</p>}
          </div>

          <div>
            <Label htmlFor="ageBrackets">Age-Brackets</Label>
            <Input id="ageBrackets" placeholder="e.g., 45-50 years" {...register("ageBrackets")} />
          </div>

          <div>
            <Label htmlFor="nickname">Nickname</Label>
            <Input id="nickname" {...register("nickname")} />
          </div>

          <div>
            <Label htmlFor="postsHeld">Posts Held (with Dates)</Label>
            <Textarea id="postsHeld" placeholder="e.g., Secretary (2015-2018)" {...register("postsHeld")} />
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
          Add Age Mate
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
