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
import { PrivacySelector } from "./PrivacySelector";

const workSchema = z.object({
  position: z.string().min(1, "Position is required"),
  period: z.string().min(1, "Period is required"),
});

interface Work {
  id: string;
  position: string;
  period: string;
  privacy?: string;
}

interface EditWorkFormProps {
  currentData: Work[];
  onSave: (data: Work[]) => void;
  onClose: () => void;
}

export const EditWorkForm = ({ currentData, onSave, onClose }: EditWorkFormProps) => {
  const [work, setWork] = useState<Work[]>(currentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [privacy, setPrivacy] = useState("public");

  const form = useForm<z.infer<typeof workSchema>>({
    resolver: zodResolver(workSchema),
    defaultValues: { position: "", period: "" },
  });

  const handleAdd = () => {
    setIsAdding(true);
    form.reset({ position: "", period: "" });
  };

  const handleEdit = (workItem: Work) => {
    setEditingId(workItem.id);
    form.reset({ position: workItem.position, period: workItem.period });
    setPrivacy(workItem.privacy || "public");
  };

  const handleDelete = (id: string) => {
    setWork(work.filter(w => w.id !== id));
  };

  const onSubmit = (data: z.infer<typeof workSchema>) => {
    if (isAdding) {
      const newWork: Work = { 
        position: data.position, 
        period: data.period, 
        id: Date.now().toString(),
        privacy 
      };
      setWork([...work, newWork]);
      setIsAdding(false);
    } else if (editingId) {
      setWork(work.map(w => w.id === editingId ? { 
        position: data.position, 
        period: data.period, 
        id: editingId,
        privacy 
      } : w));
      setEditingId(null);
    }
    form.reset({ position: "", period: "" });
    setPrivacy("public");
  };

  const handleSave = () => {
    onSave(work);
    toast.success("Work experience updated successfully");
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {work.map((workItem) => (
          <Card key={workItem.id} className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{workItem.position}</p>
                <p className="text-sm text-muted-foreground">{workItem.period}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(workItem)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(workItem.id)}>
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
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CEO at BeamColumn PCC Limited" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., January 5, 1995 - Present" {...field} />
                  </FormControl>
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
          Add Work Experience
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
