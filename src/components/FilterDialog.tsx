import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDialogProps {
  title?: string;
  description?: string;
  options: FilterOption[];
  defaultValue?: string;
  onApply?: (value: string) => void;
  triggerLabel?: string;
}

export const FilterDialog = ({
  title = "Filter Options",
  description = "Choose how you want to filter the content.",
  options,
  defaultValue = "all",
  onApply,
  triggerLabel = "Filter",
}: FilterDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleApply = () => {
    onApply?.(selectedValue);
    toast({
      title: "Filter Applied",
      description: "Your content has been filtered successfully.",
    });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <SlidersHorizontal className="w-3 h-3" />
          {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-3">
            <Label>Filter Options</Label>
            <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <SheetFooter className="flex gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleApply} className="flex-1">Apply Filter</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
