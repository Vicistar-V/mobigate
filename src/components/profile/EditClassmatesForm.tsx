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

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(classmateSchema),
  });

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setPrivacy("public");
    reset({});
  };

  const handleEdit = (mate: Classmate) => {
    setEditingId(mate.id);
    setIsAdding(false);
    setPrivacy(mate.privacy || "public");
    reset(mate);
  };

  const handleDelete = (id: string) => {
    setClassmates(classmates.filter(m => m.id !== id));
  };

  const onSubmit = (data: any) => {
    if (isAdding) {
      const newMate: Classmate = {
        id: Date.now().toString(),
        ...data,
        privacy,
      };
      setClassmates([...classmates, newMate]);
      setIsAdding(false);
    } else if (editingId) {
      setClassmates(classmates.map(m => 
        m.id === editingId ? { ...m, ...data, privacy } : m
      ));
      setEditingId(null);
    }
    reset({});
  };

  const handleSave = () => {
    onSave(classmates);
    onClose();
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      {classmates.map((mate) => (
        <div key={mate.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <p className="font-medium">{mate.name}{mate.nickname && ` (${mate.nickname})`}</p>
            <p className="text-sm text-muted-foreground">{mate.institution}</p>
            {mate.period && <p className="text-sm text-muted-foreground">{mate.period}</p>}
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
            <Label htmlFor="institution">School/Institution *</Label>
            <Input id="institution" {...register("institution")} />
            {errors.institution && <p className="text-sm text-destructive mt-1">{errors.institution.message as string}</p>}
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
          Add Classmate
        </Button>
      )}

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={handleSave} className="flex-1">Save All Changes</Button>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
    </div>
  );
};
