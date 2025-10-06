import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  phone1: z.string().min(1, "Primary phone is required"),
  phone2: z.string().optional(),
  email: z.string().email("Invalid email address"),
});

interface ContactInfo {
  phone1: string;
  phone2?: string;
  email: string;
}

interface EditContactFormProps {
  currentData: ContactInfo;
  onSave: (data: ContactInfo) => void;
  onClose: () => void;
}

export const EditContactForm = ({ currentData, onSave, onClose }: EditContactFormProps) => {
  const form = useForm<ContactInfo>({
    resolver: zodResolver(formSchema),
    defaultValues: currentData,
  });

  const onSubmit = (data: ContactInfo) => {
    onSave(data);
    toast.success("Contact information updated successfully");
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phone1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Phone</FormLabel>
              <FormControl>
                <Input placeholder="+234-806-408-9171" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Phone (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="+234-803-477-1843" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@email.com" {...field} />
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
