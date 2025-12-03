import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";

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

const FilterContent = ({
  options,
  selectedValue,
  onValueChange,
}: {
  options: FilterOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}) => (
  <div className="space-y-3 py-4 px-4">
    <Label>Filter Options</Label>
    <RadioGroup value={selectedValue} onValueChange={onValueChange}>
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
);

export const FilterDialog = ({
  title = "Filter Options",
  description = "Choose how you want to filter the content.",
  options,
  defaultValue = "all",
  onApply,
  triggerLabel = "Filter",
}: FilterDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
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

  const TriggerButton = (
    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
      <SlidersHorizontal className="w-3 h-3" />
      {triggerLabel}
    </Button>
  );

  if (isMobile) {
    return (
      <>
        {TriggerButton}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="h-auto">
            <DrawerHeader className="text-left">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <FilterContent
              options={options}
              selectedValue={selectedValue}
              onValueChange={setSelectedValue}
            />
            <DrawerFooter className="flex-row gap-3 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleApply} className="flex-1">Apply Filter</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {TriggerButton}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <FilterContent
            options={options}
            selectedValue={selectedValue}
            onValueChange={setSelectedValue}
          />
          <DialogFooter className="flex gap-3 sm:flex-row">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleApply} className="flex-1">Apply Filter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
