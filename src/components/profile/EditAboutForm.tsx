import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PrivacySelector } from "./PrivacySelector";

const formSchema = z.object({
  about: z.string().min(10, "About must be at least 10 characters").max(1000, "About must be less than 1000 characters"),
});

interface AboutInfo {
  text: string;
  privacy?: string;
  exceptions?: string[];
}

interface EditAboutFormProps {
  currentData: AboutInfo | string;
  onSave: (data: AboutInfo) => void;
  onClose: () => void;
}

export const EditAboutForm = ({ currentData, onSave, onClose }: EditAboutFormProps) => {
  const aboutData = typeof currentData === 'string' 
    ? { text: currentData, privacy: 'public', exceptions: [] }
    : currentData;
    
  const [privacy, setPrivacy] = useState(aboutData.privacy || "public");
  const [exceptions, setExceptions] = useState<string[]>(aboutData.exceptions || []);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { about: aboutData.text },
  });

  const aboutValue = form.watch("about");

  const onSubmit = (data: { about: string }) => {
    onSave({ text: data.about, privacy, exceptions });
    toast.success("About section updated successfully");
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about yourself..." 
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <div className="flex justify-between">
                <FormMessage />
                <span className="text-sm text-muted-foreground">
                  {aboutValue?.length || 0}/1000
                </span>
              </div>
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
