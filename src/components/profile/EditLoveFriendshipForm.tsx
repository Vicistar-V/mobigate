import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, User, Search, Globe, Users, ExternalLink, Check, X } from "lucide-react";
import { toast } from "sonner";
import { PrivacySelector } from "./PrivacySelector";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MobigateUserSearch, MobigateUser } from "./MobigateUserSearch";
import { FriendsListSearch, Friend } from "./FriendsListSearch";
import { useFriendsList } from "@/hooks/useWindowData";
import { mockFriends as fallbackFriends } from "@/data/profileData";

const loveFriendshipSchema = z.object({
  friendId: z.string().min(1, "Please select a friend"),
  relationshipTag: z.string().min(1, "Relationship tag is required"),
});

export interface LoveFriendship {
  id: string;
  name: string;
  originalName?: string;
  linkedUserId?: string;
  linkedUserName?: string;
  linkedUserProfileImage?: string;
  isActive?: boolean;
  relationshipTag: string;
  privacy?: string;
  profileImage?: string;
}

interface EditLoveFriendshipFormProps {
  currentData: LoveFriendship[];
  onSave: (data: LoveFriendship[]) => void;
  onClose: () => void;
}

export const EditLoveFriendshipForm = ({ currentData, onSave, onClose }: EditLoveFriendshipFormProps) => {
  const phpFriends = useFriendsList();
  const friends = phpFriends || fallbackFriends;
  const mockFriends = friends.map(f => ({ id: f.id, name: f.name }));
  
  const [friendships, setFriendships] = useState<LoveFriendship[]>(currentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [selectedUser, setSelectedUser] = useState<MobigateUser | Friend | null>(null);
  const [searchMobigateOpen, setSearchMobigateOpen] = useState(false);
  const [searchFriendsOpen, setSearchFriendsOpen] = useState(false);

  const form = useForm<z.infer<typeof loveFriendshipSchema>>({
    resolver: zodResolver(loveFriendshipSchema),
    defaultValues: { friendId: "", relationshipTag: "" },
  });

  const handleAdd = () => {
    if (friendships.length >= 25) {
      toast.error("Maximum 25 friends allowed");
      return;
    }
    setIsAdding(true);
    setSelectedUser(null);
    form.reset({ friendId: "", relationshipTag: "" });
  };

  const handleEdit = (friendship: LoveFriendship) => {
    setEditingId(friendship.id);
    form.reset({ friendId: "", relationshipTag: friendship.relationshipTag });
    setPrivacy(friendship.privacy || "public");
  };

  const handleDelete = (id: string) => {
    setFriendships(friendships.filter(f => f.id !== id));
  };

  const onSubmit = (data: z.infer<typeof loveFriendshipSchema>) => {
    const friendData: LoveFriendship = {
      id: isAdding ? Date.now().toString() : editingId!,
      originalName: !selectedUser && data.friendId ? mockFriends.find(f => f.id === data.friendId)?.name : undefined,
      name: selectedUser ? selectedUser.name : (mockFriends.find(f => f.id === data.friendId)?.name || ""),
      linkedUserId: selectedUser?.id,
      linkedUserName: selectedUser?.name,
      linkedUserProfileImage: selectedUser?.profileImage,
      isActive: !!selectedUser,
      relationshipTag: data.relationshipTag,
      privacy,
      profileImage: selectedUser?.profileImage,
    };

    if (isAdding) {
      setFriendships([...friendships, friendData]);
      setIsAdding(false);
    } else if (editingId) {
      setFriendships(friendships.map(f => f.id === editingId ? friendData : f));
      setEditingId(null);
    }
    form.reset({ friendId: "", relationshipTag: "" });
    setSelectedUser(null);
    setPrivacy("public");
  };

  const handleSave = () => {
    onSave(friendships);
    toast.success("Love Life & Friendship updated successfully");
    onClose();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        You can add up to 25 friends with different relationship tags ({friendships.length}/25)
      </p>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {friendships.map((friendship) => (
          <Card key={friendship.id} className="p-3">
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={friendship.profileImage} alt={friendship.name} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium truncate">{friendship.name}</p>
                    {friendship.isActive && (
                      <Badge variant="secondary" className="text-base">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  {friendship.originalName && friendship.originalName !== friendship.name && (
                    <p className="text-base text-muted-foreground">Originally: {friendship.originalName}</p>
                  )}
                  <p className="text-base text-muted-foreground">{friendship.relationshipTag}</p>
                  {friendship.isActive && friendship.linkedUserId && (
                    <button
                      onClick={() => window.location.href = `/profile?id=${friendship.linkedUserId}`}
                      className="text-base text-primary hover:underline flex items-center gap-1 mt-1"
                    >
                      View Profile
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(friendship)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(friendship.id)}>
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

            <FormField
              control={form.control}
              name="friendId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Or Select Friend (Optional if linked above)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a friend" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-50 bg-background">
                      {mockFriends.map((friend) => (
                        <SelectItem key={friend.id} value={friend.id}>
                          {friend.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relationshipTag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Tag</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship tag" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-50 bg-background">
                      <SelectItem value="In Love with">In Love with</SelectItem>
                      <SelectItem value="Married to">Married to</SelectItem>
                      <SelectItem value="Besty with">Besty with</SelectItem>
                      <SelectItem value="Best of Friends with">Best of Friends with</SelectItem>
                      <SelectItem value="Close Friends with">Close Friends with</SelectItem>
                      <SelectItem value="Business Friends with">Business Friends with</SelectItem>
                      <SelectItem value="Platonic Friends with">Platonic Friends with</SelectItem>
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
            <div className="flex gap-2">
              <Button type="submit" size="sm">{editingId ? "Update" : "Add"}</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => { setIsAdding(false); setEditingId(null); }}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!isAdding && !editingId && friendships.length < 25 && (
        <Button variant="outline" className="w-full" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Friend
        </Button>
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

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleSave}>Save All Changes</Button>
      </div>
    </div>
  );
};
