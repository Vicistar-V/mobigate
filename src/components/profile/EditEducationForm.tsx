import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PrivacySelector } from "./PrivacySelector";
import { ImageUploader } from "./ImageUploader";

const educationSchema = z.object({
  school: z.string().min(1, "School is required"),
  faculty: z.string().optional(),
  department: z.string().optional(),
  period: z.string().min(1, "Period is required"),
  extraSkills: z.string().optional(),
});

interface Education {
  id: string;
  school: string;
  faculty?: string;
  department?: string;
  period: string;
  extraSkills?: string;
  logo?: string;
  privacy?: string;
  exceptions?: string[];
}

interface EditEducationFormProps {
  currentData: Education[];
  onSave: (data: Education[]) => void;
  onClose: () => void;
}

export const EditEducationForm = ({ currentData, onSave, onClose }: EditEducationFormProps) => {
  const [education, setEducation] = useState<Education[]>(currentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [exceptions, setExceptions] = useState<string[]>([]);
  const [logo, setLogo] = useState<string | undefined>();

  const form = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: { school: "", faculty: "", department: "", period: "", extraSkills: "" },
  });

  const handleAdd = () => {
    setIsAdding(true);
    form.reset({ school: "", faculty: "", department: "", period: "", extraSkills: "" });
    setLogo(undefined);
    setPrivacy("public");
    setExceptions([]);
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    form.reset(edu);
    setLogo(edu.logo);
    setPrivacy(edu.privacy || "public");
    setExceptions(edu.exceptions || []);
  };

  const handleDelete = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const onSubmit = (data: z.infer<typeof educationSchema>) => {
    if (isAdding) {
      const newEducation: Education = { 
        school: data.school, 
        faculty: data.faculty, 
        department: data.department, 
        period: data.period, 
        extraSkills: data.extraSkills,
        logo,
        privacy,
        exceptions,
        id: Date.now().toString() 
      };
      setEducation([...education, newEducation]);
      setIsAdding(false);
    } else if (editingId) {
      setEducation(education.map(edu => edu.id === editingId ? { 
        school: data.school, 
        faculty: data.faculty, 
        department: data.department, 
        period: data.period, 
        extraSkills: data.extraSkills,
        logo,
        privacy,
        exceptions,
        id: editingId 
      } : edu));
      setEditingId(null);
    }
    form.reset({ school: "", faculty: "", department: "", period: "", extraSkills: "" });
    setLogo(undefined);
    setPrivacy("public");
    setExceptions([]);
  };

  const handleSave = () => {
    onSave(education);
    toast.success("Education updated successfully");
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {education.map((edu) => (
          <Card key={edu.id} className="p-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {edu.logo && (
                  <div className="h-10 w-10 rounded border flex items-center justify-center overflow-hidden bg-background">
                    <img src={edu.logo} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{edu.school}</p>
                  {edu.faculty && <p className="text-base text-muted-foreground">{edu.faculty}</p>}
                  {edu.department && <p className="text-base text-muted-foreground">{edu.department}</p>}
                  <p className="text-base text-muted-foreground">{edu.period}</p>
                  {edu.extraSkills && <p className="text-base text-muted-foreground">Skills: {edu.extraSkills}</p>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(edu)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(edu.id)}>
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
              <FormLabel>Institution Logo</FormLabel>
              <div className="mt-2">
                <ImageUploader
                  value={logo}
                  onChange={setLogo}
                  type="logo"
                  placeholder="Upload Institution Logo"
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School/Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., University of Nigeria, Nsukka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Faculty of Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Civil Engineering" {...field} />
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
                    <Input placeholder="e.g., Class of 2020 - 2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="extraSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra Skills (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AutoCAD, Project Management, Research" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Who Can See This</FormLabel>
              <div className="mt-2">
                <PrivacySelector 
                  value={privacy} 
                  onChange={setPrivacy}
                  exceptions={exceptions}
                  onExceptionsChange={setExceptions}
                />
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
          Add Education
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
