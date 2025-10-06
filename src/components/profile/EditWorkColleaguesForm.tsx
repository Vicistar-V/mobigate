import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, Save, X } from "lucide-react";
import { PrivacySelector } from "./PrivacySelector";

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
  workplaceName: string;
  workplaceLocation?: string;
  nickname?: string;
  position?: string;
  duration?: string;
  superiority?: string;
  specialSkills?: string;
  privacy?: string;
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(workColleagueSchema),
  });

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setPrivacy("public");
    setSuperiority("");
    reset({});
  };

  const handleEdit = (colleague: WorkColleague) => {
    setEditingId(colleague.id);
    setIsAdding(false);
    setPrivacy(colleague.privacy || "public");
    setSuperiority(colleague.superiority || "");
    reset(colleague);
  };

  const handleDelete = (id: string) => {
    setColleagues(colleagues.filter(c => c.id !== id));
  };

  const onSubmit = (data: any) => {
    const colleagueData = { ...data, superiority };
    
    if (isAdding) {
      const newColleague: WorkColleague = {
        id: Date.now().toString(),
        ...colleagueData,
        privacy,
      };
      setColleagues([...colleagues, newColleague]);
      setIsAdding(false);
    } else if (editingId) {
      setColleagues(colleagues.map(c => 
        c.id === editingId ? { ...c, ...colleagueData, privacy } : c
      ));
      setEditingId(null);
    }
    reset({});
    setSuperiority("");
  };

  const handleSave = () => {
    onSave(colleagues);
    onClose();
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      {colleagues.map((colleague) => (
        <div key={colleague.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <p className="font-medium">{colleague.name}{colleague.nickname && ` (${colleague.nickname})`}</p>
            <p className="text-sm text-muted-foreground">{colleague.workplaceName}</p>
            {colleague.workplaceLocation && <p className="text-sm text-muted-foreground">{colleague.workplaceLocation}</p>}
            {colleague.position && <p className="text-sm text-muted-foreground">Position: {colleague.position}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(colleague)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(colleague.id)}>
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
            <Label htmlFor="workplaceName">Workplace Name *</Label>
            <Input id="workplaceName" {...register("workplaceName")} />
            {errors.workplaceName && <p className="text-sm text-destructive mt-1">{errors.workplaceName.message as string}</p>}
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

          <div className="flex gap-2">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {isAdding ? "Add" : "Update"}
            </Button>
            <Button type="button" variant="outline" onClick={() => {
              setIsAdding(false);
              setEditingId(null);
              setSuperiority("");
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
          Add Work Colleague
        </Button>
      )}

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={handleSave} className="flex-1">Save All Changes</Button>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
    </div>
  );
};
