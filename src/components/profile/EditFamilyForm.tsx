import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const familySchema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
});

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
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

  const form = useForm({
    resolver: zodResolver(familySchema),
    defaultValues: { name: "", relation: "" },
  });

  const handleAdd = () => {
    setIsAdding(true);
    form.reset({ name: "", relation: "" });
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingId(member.id);
    form.reset(member);
  };

  const handleDelete = (id: string) => {
    setFamily(family.filter(m => m.id !== id));
  };

  const onSubmit = (data: z.infer<typeof familySchema>) => {
    if (isAdding) {
      const newMember: FamilyMember = { name: data.name, relation: data.relation, id: Date.now().toString() };
      setFamily([...family, newMember]);
      setIsAdding(false);
    } else if (editingId) {
      setFamily(family.map(m => m.id === editingId ? { name: data.name, relation: data.relation, id: editingId } : m));
      setEditingId(null);
    }
    form.reset({ name: "", relation: "" });
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
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.relation}</p>
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Brother, Sister, Son" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
