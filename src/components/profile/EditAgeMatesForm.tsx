import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, Save, X } from "lucide-react";
import { PrivacySelector } from "./PrivacySelector";

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
  community: string;
  ageGrade?: string;
  ageBrackets?: string;
  postsHeld?: string;
  nickname?: string;
  privacy?: string;
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(ageMateSchema),
  });

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setPrivacy("public");
    reset({});
  };

  const handleEdit = (mate: AgeMate) => {
    setEditingId(mate.id);
    setIsAdding(false);
    setPrivacy(mate.privacy || "public");
    reset(mate);
  };

  const handleDelete = (id: string) => {
    setAgeMates(ageMates.filter(m => m.id !== id));
  };

  const onSubmit = (data: any) => {
    if (isAdding) {
      const newMate: AgeMate = {
        id: Date.now().toString(),
        ...data,
        privacy,
      };
      setAgeMates([...ageMates, newMate]);
      setIsAdding(false);
    } else if (editingId) {
      setAgeMates(ageMates.map(m => 
        m.id === editingId ? { ...m, ...data, privacy } : m
      ));
      setEditingId(null);
    }
    reset({});
  };

  const handleSave = () => {
    onSave(ageMates);
    onClose();
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      {ageMates.map((mate) => (
        <div key={mate.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <p className="font-medium">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
            <p className="text-sm text-muted-foreground">{mate.community}</p>
            {mate.ageGrade && <p className="text-sm text-muted-foreground">Age Grade: {mate.ageGrade}</p>}
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
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} />
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
          Add Age Mate
        </Button>
      )}

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={handleSave} className="flex-1">Save All Changes</Button>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
    </div>
  );
};
