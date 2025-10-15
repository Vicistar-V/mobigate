import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PrivacySelector } from "./PrivacySelector";

const locationSchema = z.object({
  place: z.string().min(1, "Place is required"),
  description: z.string().min(1, "Description is required"),
  customDescription: z.string().optional(),
  period: z.string().optional(),
});

const descriptionOptions = [
  "Hometown",
  "Current City/Town",
  "Lived in",
  "Worked in",
  "Just Visited",
  "Grew Up in",
  "Schooled in",
  "Went to Prison in",
  "Jailed in",
  "Hospitalised in",
  "Just Passed By",
  "Other",
];

interface Location {
  id: string;
  place: string;
  description: string;
  period?: string;
  privacy?: string;
  exceptions?: string[];
}

interface EditLocationFormProps {
  currentData: Location[];
  onSave: (data: Location[]) => void;
  onClose: () => void;
}

export const EditLocationForm = ({ currentData, onSave, onClose }: EditLocationFormProps) => {
  const [locations, setLocations] = useState<Location[]>(currentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [exceptions, setExceptions] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const form = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: { place: "", description: "", customDescription: "", period: "" },
  });

  const handleAdd = () => {
    setIsAdding(true);
    setShowCustomInput(false);
    setExceptions([]);
    form.reset({ place: "", description: "", customDescription: "", period: "" });
  };

  const handleEdit = (location: Location) => {
    setEditingId(location.id);
    const isCustom = !descriptionOptions.slice(0, -1).includes(location.description);
    setShowCustomInput(isCustom);
    setExceptions(location.exceptions || []);
    form.reset({ 
      place: location.place, 
      description: isCustom ? "Other" : location.description, 
      customDescription: isCustom ? location.description : "",
      period: location.period || "" 
    });
  };

  const handleDelete = (id: string) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  const onSubmit = (data: z.infer<typeof locationSchema>) => {
    const finalDescription = data.description === "Other" ? (data.customDescription || "") : data.description;
    
    if (isAdding) {
      const newLocation: Location = { 
        place: data.place, 
        description: finalDescription, 
        period: data.period, 
        privacy,
        exceptions: privacy === "all-except" ? exceptions : undefined,
        id: Date.now().toString() 
      };
      setLocations([...locations, newLocation]);
      setIsAdding(false);
    } else if (editingId) {
      setLocations(locations.map(loc => loc.id === editingId ? { 
        place: data.place, 
        description: finalDescription, 
        period: data.period, 
        privacy,
        exceptions: privacy === "all-except" ? exceptions : undefined,
        id: editingId 
      } : loc));
      setEditingId(null);
    }
    setShowCustomInput(false);
    setExceptions([]);
    form.reset({ place: "", description: "", customDescription: "", period: "" });
  };

  const handleSave = () => {
    onSave(locations);
    toast.success("Locations updated successfully");
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {locations.map((location) => (
          <Card key={location.id} className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{location.place}</p>
                <p className="text-base text-muted-foreground">{location.description}</p>
                {location.period && <p className="text-base text-muted-foreground">{location.period}</p>}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(location)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(location.id)}>
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
              name="place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Place</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowCustomInput(value === "Other");
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select description" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-50 bg-background">
                      {descriptionOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showCustomInput && (
              <FormField
                control={form.control}
                name="customDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter custom description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1992 - 1998" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Privacy</FormLabel>
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
          Add Location
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
