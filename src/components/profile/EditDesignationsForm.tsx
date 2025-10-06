import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  designations: z.string().min(1, "Designations are required"),
});

interface EditDesignationsFormProps {
  currentData: string;
  onSave: (data: string) => void;
  onClose: () => void;
}

export const EditDesignationsForm = ({ currentData, onSave, onClose }: EditDesignationsFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { designations: currentData },
  });

  const onSubmit = (data: { designations: string }) => {
    onSave(data.designations);
    toast.success("Designations updated successfully");
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="designations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designations</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2-Star User, Mobi-Celebrity" {...field} />
              </FormControl>
              <FormMessage />
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
