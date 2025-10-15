import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PrivacySelector } from "./PrivacySelector";
import { PrivacyLevel } from "@/types/privacy";

const formSchema = z.object({
  refererName: z.string().min(1, "Referer name is required").max(100, "Name must be less than 100 characters"),
  refererId: z.string().min(1, "Referer user ID is required").max(50, "User ID must be less than 50 characters"),
  url: z.string().url("Must be a valid URL").max(500, "URL must be less than 500 characters"),
});

interface RefererUrlData {
  url: string;
  refererName: string;
  refererId: string;
  privacy?: string;
  exceptions?: string[];
}

interface EditRefererUrlFormProps {
  currentData: RefererUrlData;
  onSave: (data: RefererUrlData) => void;
  onClose: () => void;
}

export const EditRefererUrlForm = ({ currentData, onSave, onClose }: EditRefererUrlFormProps) => {
  const [privacy, setPrivacy] = useState<PrivacyLevel>(
    (currentData.privacy as PrivacyLevel) || "public"
  );
  const [exceptions, setExceptions] = useState<string[]>(currentData.exceptions || []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      refererName: currentData.refererName,
      refererId: currentData.refererId,
      url: currentData.url,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave({
      refererName: data.refererName,
      refererId: data.refererId,
      url: data.url,
      privacy,
      exceptions,
    });
    toast.success("Referer URL updated successfully");
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="refererName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="refererId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referer User ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., user-123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referer Profile URL</FormLabel>
              <FormControl>
                <Input placeholder="https://mobigate.com/profile/username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <PrivacySelector
          value={privacy}
          onChange={(value) => setPrivacy(value as PrivacyLevel)}
          exceptions={exceptions}
          onExceptionsChange={setExceptions}
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
