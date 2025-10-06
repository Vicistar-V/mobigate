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

const locationSchema = z.object({
  place: z.string().min(1, "Place is required"),
  description: z.string().min(1, "Description is required"),
  period: z.string().optional(),
});

interface Location {
  id: string;
  place: string;
  description: string;
  period?: string;
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

  const form = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: { place: "", description: "", period: "" },
  });

  const handleAdd = () => {
    setIsAdding(true);
    form.reset({ place: "", description: "", period: "" });
  };

  const handleEdit = (location: Location) => {
    setEditingId(location.id);
    form.reset(location);
  };

  const handleDelete = (id: string) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  const onSubmit = (data: z.infer<typeof locationSchema>) => {
    if (isAdding) {
      const newLocation: Location = { place: data.place, description: data.description, period: data.period, id: Date.now().toString() };
      setLocations([...locations, newLocation]);
      setIsAdding(false);
    } else if (editingId) {
      setLocations(locations.map(loc => loc.id === editingId ? { place: data.place, description: data.description, period: data.period, id: editingId } : loc));
      setEditingId(null);
    }
    form.reset({ place: "", description: "", period: "" });
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
                <p className="text-sm text-muted-foreground">{location.description}</p>
                {location.period && <p className="text-sm text-muted-foreground">{location.period}</p>}
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
                  <FormControl>
                    <Input placeholder="e.g., Current City, Hometown" {...field} />
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
                  <FormLabel>Period (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1992 - 1998" {...field} />
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
