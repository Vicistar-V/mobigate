import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PrivacySelector } from "./PrivacySelector";

const formSchema = z.object({
  gender: z.string().min(1, "Gender is required"),
  birthday: z.string().min(1, "Birthday is required"),
  languages: z.string().min(1, "Languages are required"),
  birthdayPrivacy: z.enum(["full", "partial", "hidden"]),
});

interface BasicInfo {
  gender: string;
  birthday: string;
  languages: string;
  birthdayPrivacy?: "full" | "partial" | "hidden";
  privacy?: string;
  exceptions?: string[];
}

interface EditBasicInfoFormProps {
  currentData: BasicInfo;
  onSave: (data: BasicInfo) => void;
  onClose: () => void;
}

export const EditBasicInfoForm = ({ currentData, onSave, onClose }: EditBasicInfoFormProps) => {
  const [privacy, setPrivacy] = useState(currentData.privacy || "public");
  const [exceptions, setExceptions] = useState<string[]>(currentData.exceptions || []);
  
  const form = useForm<BasicInfo>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentData,
      birthdayPrivacy: currentData.birthdayPrivacy || "full",
    },
  });

  const onSubmit = (data: BasicInfo) => {
    onSave({ ...data, privacy, exceptions });
    toast.success("Basic information updated successfully");
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthdayPrivacy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday Display</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select display option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="full">Show Full Date (Day/Month/Year)</SelectItem>
                  <SelectItem value="partial">Show Only Day & Month (Hide Year)</SelectItem>
                  <SelectItem value="hidden">Hide Birthday</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages Spoken</FormLabel>
              <FormControl>
                <Input placeholder="e.g., English, French, Igbo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Who Can See This Information</FormLabel>
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
