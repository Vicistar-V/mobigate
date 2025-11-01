import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Check, ChevronsUpDown, Search, Globe, Users, ExternalLink, X, User } from "lucide-react";
import { toast } from "sonner";
import { PrivacySelector } from "./PrivacySelector";
import { ImageUploader } from "./ImageUploader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MobigateUserSearch, MobigateUser } from "./MobigateUserSearch";
import { FriendsListSearch, Friend } from "./FriendsListSearch";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useFriendsList } from "@/hooks/useWindowData";
import { mockFriends as fallbackFriends } from "@/data/profileData";

const familySchema = z.object({
  friendId: z.string().min(1, "Please select a friend"),
  relation: z.string().min(1, "Relation is required"),
});

interface FamilyMember {
  id: string;
  name: string;
  originalName?: string;
  linkedUserId?: string;
  linkedUserName?: string;
  linkedUserProfileImage?: string;
  isActive?: boolean;
  relation: string;
  privacy?: string;
  profileImage?: string;
}

interface EditFamilyFormProps {
  currentData: FamilyMember[];
  onSave: (data: FamilyMember[]) => void;
  onClose: () => void;
}

export const EditFamilyForm = ({ currentData, onSave, onClose }: EditFamilyFormProps) => {
  const phpFriends = useFriendsList();
  const friends = phpFriends || fallbackFriends;
  const mockFriends = friends.map(f => ({ id: f.id, name: f.name }));
  
  const [family, setFamily] = useState<FamilyMember[]>(currentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MobigateUser | Friend | null>(null);
  const [searchMobigateOpen, setSearchMobigateOpen] = useState(false);
  const [searchFriendsOpen, setSearchFriendsOpen] = useState(false);

  const form = useForm<z.infer<typeof familySchema>>({
    resolver: zodResolver(familySchema),
    defaultValues: { friendId: "", relation: "" },
  });

  const handleAdd = () => {
    setIsAdding(true);
    form.reset({ friendId: "", relation: "" });
    setProfileImage(undefined);
    setSelectedUser(null);
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingId(member.id);
    form.reset({ friendId: "", relation: member.relation });
    setPrivacy(member.privacy || "public");
    setProfileImage(member.profileImage);
  };

  const handleDelete = (id: string) => {
    setFamily(family.filter(m => m.id !== id));
  };

  const onSubmit = (data: z.infer<typeof familySchema>) => {
    const memberData: FamilyMember = {
      id: isAdding ? Date.now().toString() : editingId!,
      originalName: !selectedUser && data.friendId ? mockFriends.find(f => f.id === data.friendId)?.name : undefined,
      name: selectedUser ? selectedUser.name : (mockFriends.find(f => f.id === data.friendId)?.name || ""),
      linkedUserId: selectedUser?.id,
      linkedUserName: selectedUser?.name,
      linkedUserProfileImage: selectedUser?.profileImage,
      isActive: !!selectedUser,
      relation: data.relation,
      privacy,
      profileImage: selectedUser?.profileImage || profileImage,
    };

    if (isAdding) {
      setFamily([...family, memberData]);
      setIsAdding(false);
    } else if (editingId) {
      setFamily(family.map(m => m.id === editingId ? memberData : m));
      setEditingId(null);
    }
    form.reset({ friendId: "", relation: "" });
    setPrivacy("public");
    setProfileImage(undefined);
    setSelectedUser(null);
  };

  const handleSave = () => {
    onSave(family);
    toast.success("Family information updated successfully");
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {family.map((member) => (
          <Card key={member.id} className="p-3">
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.profileImage} alt={member.name} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium truncate">{member.name}</p>
                    {member.isActive && (
                      <Badge variant="secondary" className="text-base">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  {member.originalName && member.originalName !== member.name && (
                    <p className="text-base text-muted-foreground">Originally: {member.originalName}</p>
                  )}
                  <p className="text-base text-muted-foreground">{member.relation}</p>
                  {member.isActive && member.linkedUserId && (
                    <button
                      onClick={() => window.location.href = `/profile?id=${member.linkedUserId}`}
                      className="text-base text-primary hover:underline flex items-center gap-1 mt-1"
                    >
                      View Profile
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(member)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(member.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {(isAdding || editingId) && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 border-t pt-4">
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
              <p className="text-sm text-muted-foreground">
                Link a Mobigate user or select from friends below
              </p>
            </div>

            <div>
              <FormLabel>Profile Picture</FormLabel>
              <div className="mt-2">
                <ImageUploader
                  value={selectedUser?.profileImage || profileImage}
                  onChange={setProfileImage}
                  type="avatar"
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="friendId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Or Select Friend (Optional if linked above)</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? mockFriends.find((friend) => friend.id === field.value)?.name
                            : "Search friend's name..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search friend's name..." />
                        <CommandList>
                          <CommandEmpty>No friend found.</CommandEmpty>
                          <CommandGroup>
                            {mockFriends.map((friend) => (
                              <CommandItem
                                key={friend.id}
                                value={friend.name}
                                onSelect={() => {
                                  form.setValue("friendId", friend.id);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    friend.id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {friend.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family Relation</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-50 bg-background">
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Brother">Brother</SelectItem>
                      <SelectItem value="Sister">Sister</SelectItem>
                      <SelectItem value="Son">Son</SelectItem>
                      <SelectItem value="Daughter">Daughter</SelectItem>
                      <SelectItem value="Husband">Husband</SelectItem>
                      <SelectItem value="Wife">Wife</SelectItem>
                      <SelectItem value="Uncle">Uncle</SelectItem>
                      <SelectItem value="Aunt">Aunt</SelectItem>
                      <SelectItem value="Cousin">Cousin</SelectItem>
                      <SelectItem value="Nephew">Nephew</SelectItem>
                      <SelectItem value="Niece">Niece</SelectItem>
                      <SelectItem value="Grandfather">Grandfather</SelectItem>
                      <SelectItem value="Grandmother">Grandmother</SelectItem>
                      <SelectItem value="Brother-Inlaw">Brother-Inlaw</SelectItem>
                      <SelectItem value="Sister-Inlaw">Sister-Inlaw</SelectItem>
                      <SelectItem value="Father-Inlaw">Father-Inlaw</SelectItem>
                      <SelectItem value="Mother-Inlaw">Mother-Inlaw</SelectItem>
                      <SelectItem value="Extended-Inlaw">Extended-Inlaw</SelectItem>
                      <SelectItem value="Kinsfolk">Kinsfolk</SelectItem>
                      <SelectItem value="Extended Relative">Extended Relative</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Privacy</FormLabel>
              <div className="mt-2">
                <PrivacySelector value={privacy} onChange={setPrivacy} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" size="sm" className="flex-1 sm:flex-initial">{editingId ? "Update" : "Add"}</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex-1 sm:flex-initial">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}

      <MobigateUserSearch
        open={searchMobigateOpen}
        onOpenChange={setSearchMobigateOpen}
        onSelect={(user) => setSelectedUser(user)}
      />

      <FriendsListSearch
        open={searchFriendsOpen}
        onOpenChange={setSearchFriendsOpen}
        onSelect={(friend) => setSelectedUser(friend)}
      />

      {!isAdding && !editingId && (
        <Button variant="outline" className="w-full" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Family Member
        </Button>
      )}

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleSave}>Save All Changes</Button>
      </div>
    </div>
  );
};
