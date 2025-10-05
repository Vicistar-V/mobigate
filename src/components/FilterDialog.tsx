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

export const FilterDialog = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    toast({
      title: "Filter Applied",
      description: "Your wall status has been filtered successfully.",
    });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Filter Posts
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto">
        <SheetHeader>
          <SheetTitle>Filter Wall Status</SheetTitle>
          <SheetDescription>
            Choose how you want to filter the wall status posts.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-3">
            <Label>Post Type</Label>
            <RadioGroup defaultValue="all">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal cursor-pointer">
                  All Posts
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recent" id="recent" />
                <Label htmlFor="recent" className="font-normal cursor-pointer">
                  Most Recent
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="popular" id="popular" />
                <Label htmlFor="popular" className="font-normal cursor-pointer">
                  Most Popular
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trending" id="trending" />
                <Label htmlFor="trending" className="font-normal cursor-pointer">
                  Trending
                </Label>
              </div>
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
