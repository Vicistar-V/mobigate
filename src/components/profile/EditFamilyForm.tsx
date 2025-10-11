import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { PrivacySelector } from "./PrivacySelector";
import { ImageUploader } from "./ImageUploader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const familySchema = z.object({
  friendId: z.string().min(1, "Please select a friend"),
  relation: z.string().min(1, "Relation is required"),
});

// Mock friends data - in real app this would come from backend
const mockFriends = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
  { id: "4", name: "Sarah Williams" },
  { id: "5", name: "David Brown" },
];

interface FamilyMember {
  id: string;
  name: string;
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
  const [family, setFamily] = useState<FamilyMember[]>(currentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof familySchema>>({
    resolver: zodResolver(familySchema),
    defaultValues: { friendId: "", relation: "" },
  });

  const handleAdd = () => {
    setIsAdding(true);
    form.reset({ friendId: "", relation: "" });
    setProfileImage(undefined);
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
    const selectedFriend = mockFriends.find(f => f.id === data.friendId);
    if (!selectedFriend) return;

    if (isAdding) {
      const newMember: FamilyMember = { 
        name: selectedFriend.name, 
        relation: data.relation, 
        id: Date.now().toString(),
        privacy,
        profileImage
      };
      setFamily([...family, newMember]);
      setIsAdding(false);
    } else if (editingId) {
      setFamily(family.map(m => m.id === editingId ? { 
        name: selectedFriend.name, 
        relation: data.relation, 
        id: editingId,
        privacy,
        profileImage
      } : m));
      setEditingId(null);
    }
    form.reset({ friendId: "", relation: "" });
    setPrivacy("public");
    setProfileImage(undefined);
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
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.profileImage} alt={member.name} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.relation}</p>
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
            <div>
              <FormLabel>Profile Picture</FormLabel>
              <div className="mt-2">
                <ImageUploader
                  value={profileImage}
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
                  <FormLabel>Select Friend</FormLabel>
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
            <div className="flex gap-2">
              <Button type="submit" size="sm">{editingId ? "Update" : "Add"}</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => { setIsAdding(false); setEditingId(null); }}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!isAdding && !editingId && (
        <Button variant="outline" className="w-full" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Family Member
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
