import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PrivacySelector } from "./PrivacySelector";

const formSchema = z.object({
  status: z.string().min(1, "Relationship status is required"),
});

interface RelationshipInfo {
  status: string;
  privacy?: string;
  exceptions?: string[];
}

interface EditRelationshipFormProps {
  currentData: RelationshipInfo | string;
  onSave: (data: RelationshipInfo) => void;
  onClose: () => void;
}

export const EditRelationshipForm = ({ currentData, onSave, onClose }: EditRelationshipFormProps) => {
  const relationshipData = typeof currentData === 'string' 
    ? { status: currentData, privacy: 'public', exceptions: [] }
    : currentData;
    
  const [privacy, setPrivacy] = useState(relationshipData.privacy || "public");
  const [exceptions, setExceptions] = useState<string[]>(relationshipData.exceptions || []);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { status: relationshipData.status },
  });

  const onSubmit = (data: { status: string }) => {
    onSave({ status: data.status, privacy, exceptions });
    toast.success("Relationship status updated successfully");
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="In a relationship">In a relationship</SelectItem>
                  <SelectItem value="In a Serious Relationship">In a Serious Relationship</SelectItem>
                  <SelectItem value="In an Open Relationship">In an Open Relationship</SelectItem>
                  <SelectItem value="In Domestic Partnership">In Domestic Partnership</SelectItem>
                  <SelectItem value="Engaged">Engaged</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                  <SelectItem value="Complicated">Complicated</SelectItem>
                  <SelectItem value="Undisclosed">Undisclosed</SelectItem>
                </SelectContent>
              </Select>
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
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};
