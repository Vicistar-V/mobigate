import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  about: z.string().min(10, "About must be at least 10 characters").max(1000, "About must be less than 1000 characters"),
});

interface EditAboutFormProps {
  currentData: string;
  onSave: (data: string) => void;
  onClose: () => void;
}

export const EditAboutForm = ({ currentData, onSave, onClose }: EditAboutFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { about: currentData },
  });

  const aboutValue = form.watch("about");

  const onSubmit = (data: { about: string }) => {
    onSave(data.about);
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
