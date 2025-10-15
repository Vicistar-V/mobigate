import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PrivacySelector } from "./PrivacySelector";
import { PrivacyLevel } from "@/types/privacy";
import { Card } from "@/components/ui/card";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
];

const formSchema = z.object({
  preferredCurrency: z.string().min(1, "Please select a currency"),
  currencySymbol: z.string().min(1, "Currency symbol is required"),
});

interface CurrencyData {
  preferredCurrency: string;
  currencySymbol: string;
  accountSummaryPrivacy?: string;
  accountSummaryExceptions?: string[];
  privacy?: string;
  exceptions?: string[];
}

interface EditCurrencyFormProps {
  currentData: CurrencyData;
  onSave: (data: CurrencyData) => void;
  onClose: () => void;
}

export const EditCurrencyForm = ({ currentData, onSave, onClose }: EditCurrencyFormProps) => {
  const [privacy, setPrivacy] = useState<PrivacyLevel>(
    (currentData.privacy as PrivacyLevel) || "public"
  );
  const [exceptions, setExceptions] = useState<string[]>(currentData.exceptions || []);
  
  const [accountSummaryPrivacy, setAccountSummaryPrivacy] = useState<PrivacyLevel>(
    (currentData.accountSummaryPrivacy as PrivacyLevel) || "only-me"
  );
  const [accountSummaryExceptions, setAccountSummaryExceptions] = useState<string[]>(
    currentData.accountSummaryExceptions || []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredCurrency: currentData.preferredCurrency,
      currencySymbol: currentData.currencySymbol,
    },
  });

  const handleCurrencyChange = (currencyName: string) => {
    const selectedCurrency = currencies.find(c => c.name === currencyName);
    if (selectedCurrency) {
      form.setValue("preferredCurrency", selectedCurrency.name);
      form.setValue("currencySymbol", selectedCurrency.symbol);
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave({
      preferredCurrency: data.preferredCurrency,
      currencySymbol: data.currencySymbol,
      privacy,
      exceptions,
      accountSummaryPrivacy,
      accountSummaryExceptions,
    });
    toast.success("Currency settings updated successfully");
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="preferredCurrency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Currency</FormLabel>
              <Select
                onValueChange={handleCurrencyChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.name}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card className="p-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Currency Visibility</h4>
            <FormDescription className="mb-3">
              Control who can see your preferred currency
            </FormDescription>
            <PrivacySelector
              value={privacy}
              onChange={(value: PrivacyLevel) => setPrivacy(value)}
              exceptions={exceptions}
              onExceptionsChange={setExceptions}
            />
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Account Summary Visibility</h4>
            <FormDescription className="mb-3">
              Control who can view your account summary (separate from currency visibility)
            </FormDescription>
            <PrivacySelector
              value={accountSummaryPrivacy}
              onChange={(value: PrivacyLevel) => setAccountSummaryPrivacy(value)}
              exceptions={accountSummaryExceptions}
              onExceptionsChange={setAccountSummaryExceptions}
            />
          </div>
        </Card>

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
