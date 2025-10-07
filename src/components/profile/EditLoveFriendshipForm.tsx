import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { PrivacySelector } from "./PrivacySelector";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const loveFriendshipSchema = z.object({
  friendId: z.string().min(1, "Please select a friend"),
  relationshipTag: z.string().min(1, "Relationship tag is required"),
});

// Mock friends data - in real app this would come from backend
const mockFriends = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
  { id: "4", name: "Sarah Williams" },
  { id: "5", name: "David Brown" },
];

export interface LoveFriendship {
  id: string;
  name: string;
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
  const [friendships, setFriendships] = useState<LoveFriendship[]>(currentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [privacy, setPrivacy] = useState("public");

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
    const selectedFriend = mockFriends.find(f => f.id === data.friendId);
    if (!selectedFriend) return;

    if (isAdding) {
      const newFriendship: LoveFriendship = { 
        name: selectedFriend.name, 
        relationshipTag: data.relationshipTag, 
        id: Date.now().toString(),
        privacy 
      };
      setFriendships([...friendships, newFriendship]);
      setIsAdding(false);
    } else if (editingId) {
      setFriendships(friendships.map(f => f.id === editingId ? { 
        name: selectedFriend.name, 
        relationshipTag: data.relationshipTag, 
        id: editingId,
        privacy 
      } : f));
      setEditingId(null);
    }
    form.reset({ friendId: "", relationshipTag: "" });
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
                <div>
                  <p className="font-medium">{friendship.name}</p>
                  <p className="text-sm text-muted-foreground">{friendship.relationshipTag}</p>
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
            <FormField
              control={form.control}
              name="friendId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Friend</FormLabel>
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

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleSave}>Save All Changes</Button>
      </div>
    </div>
  );
};
