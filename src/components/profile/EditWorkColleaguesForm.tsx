import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const workColleagueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  workplaceName: z.string().min(1, "Workplace name is required"),
  workplaceLocation: z.string().optional(),
  nickname: z.string().optional(),
  position: z.string().optional(),
  duration: z.string().optional(),
  superiority: z.string().optional(),
  specialSkills: z.string().optional(),
});

export interface WorkColleague {
  id: string;
  name: string;
  originalName?: string;
  linkedUserId?: string;
  linkedUserName?: string;
  linkedUserProfileImage?: string;
  isActive?: boolean;
  workplaceName: string;
  workplaceLocation?: string;
  nickname?: string;
  position?: string;
  duration?: string;
  superiority?: string;
  specialSkills?: string;
  privacy?: string;
  profileImage?: string;
  workplaceLogo?: string;
}

interface EditWorkColleaguesFormProps {
  currentData: WorkColleague[];
  onSave: (data: WorkColleague[]) => void;
  onClose: () => void;
}

export const EditWorkColleaguesForm = ({ currentData, onSave, onClose }: EditWorkColleaguesFormProps) => {
  const [colleagues, setColleagues] = useState<WorkColleague[]>(currentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [superiority, setSuperiority] = useState("");
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [workplaceLogo, setWorkplaceLogo] = useState<string | undefined>();
  const [selectedUser, setSelectedUser] = useState<MobigateUser | Friend | null>(null);
  const [searchMobigateOpen, setSearchMobigateOpen] = useState(false);
  const [searchFriendsOpen, setSearchFriendsOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(workColleagueSchema),
  });

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setPrivacy("public");
    setSuperiority("");
    setProfileImage(undefined);
    setWorkplaceLogo(undefined);
    setSelectedUser(null);
    reset({});
  };

  const handleEdit = (colleague: WorkColleague) => {
    setEditingId(colleague.id);
    setIsAdding(false);
    setPrivacy(colleague.privacy || "public");
    setSuperiority(colleague.superiority || "");
    setProfileImage(colleague.profileImage);
    setWorkplaceLogo(colleague.workplaceLogo);
    reset(colleague);
  };

  const handleDelete = (id: string) => {
    setColleagues(colleagues.filter(c => c.id !== id));
  };

  const onSubmit = (data: any) => {
    const colleagueData: WorkColleague = {
      id: isAdding ? Date.now().toString() : editingId!,
      ...data,
      originalName: !selectedUser ? data.name : (data.name || undefined),
      name: selectedUser ? selectedUser.name : data.name,
      linkedUserId: selectedUser?.id,
      linkedUserName: selectedUser?.name,
      linkedUserProfileImage: selectedUser?.profileImage,
      isActive: !!selectedUser,
      superiority,
      privacy,
      profileImage: selectedUser?.profileImage || profileImage,
      workplaceLogo,
    };
    
    if (isAdding) {
      setColleagues([...colleagues, colleagueData]);
      setIsAdding(false);
    } else if (editingId) {
      setColleagues(colleagues.map(c => 
        c.id === editingId ? colleagueData : c
      ));
      setEditingId(null);
    }
    setProfileImage(undefined);
    setWorkplaceLogo(undefined);
    setSelectedUser(null);
    reset({});
    setSuperiority("");
  };

  const handleSave = () => {
    onSave(colleagues);
    onClose();
  };

  return (
    <div className="space-y-4">
      {colleagues.map((colleague) => (
        <div key={colleague.id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/50 rounded-lg flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={colleague.profileImage} alt={colleague.name} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium">{colleague.name}{colleague.nickname && ` (${colleague.nickname})`}</p>
                {colleague.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              {colleague.originalName && colleague.originalName !== colleague.name && (
                <p className="text-xs text-muted-foreground">Originally: {colleague.originalName}</p>
              )}
              <div className="flex items-center gap-2">
                {colleague.workplaceLogo && (
                  <img src={colleague.workplaceLogo} alt="" className="h-4 w-4 object-contain" />
                )}
                <p className="text-sm text-muted-foreground truncate">{colleague.workplaceName}</p>
              </div>
              {colleague.workplaceLocation && <p className="text-sm text-muted-foreground truncate">{colleague.workplaceLocation}</p>}
              {colleague.position && <p className="text-sm text-muted-foreground">Position: {colleague.position}</p>}
              {colleague.isActive && colleague.linkedUserId && (
                <button
                  onClick={() => window.location.href = `/profile?id=${colleague.linkedUserId}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  View Profile
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2 shrink-0 flex-col sm:flex-row w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(colleague)} className="w-full sm:w-auto">
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(colleague.id)} className="w-full sm:w-auto">
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
            <Label htmlFor="workplaceName">Workplace Name *</Label>
            <Input id="workplaceName" {...register("workplaceName")} />
            {errors.workplaceName && <p className="text-sm text-destructive mt-1">{errors.workplaceName.message as string}</p>}
          </div>

          <div>
            <Label>Workplace Logo</Label>
            <ImageUploader
              value={workplaceLogo}
              onChange={setWorkplaceLogo}
              type="logo"
              placeholder="Upload Workplace Logo"
            />
          </div>

          <div>
            <Label htmlFor="workplaceLocation">Workplace Location</Label>
            <Input id="workplaceLocation" placeholder="e.g., Lagos, Nigeria" {...register("workplaceLocation")} />
          </div>

          <div>
            <Label htmlFor="nickname">Nickname</Label>
            <Input id="nickname" {...register("nickname")} />
          </div>

          <div>
            <Label htmlFor="position">Position</Label>
            <Input id="position" placeholder="e.g., Senior Engineer" {...register("position")} />
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input id="duration" placeholder="e.g., 2010 - 2015" {...register("duration")} />
          </div>

          <div>
            <Label htmlFor="superiority">Superiority</Label>
            <Select value={superiority} onValueChange={setSuperiority}>
              <SelectTrigger>
                <SelectValue placeholder="Select superiority level" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-background">
                <SelectItem value="subordinate">Subordinate</SelectItem>
                <SelectItem value="superior">Superior</SelectItem>
                <SelectItem value="head">Head</SelectItem>
                <SelectItem value="boss">Boss</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="specialSkills">Special Skills</Label>
            <Textarea id="specialSkills" placeholder="e.g., Project Management, Technical Leadership" {...register("specialSkills")} />
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
              setSuperiority("");
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
          Add Work Colleague
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
