import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export const FilterDialog = () => {
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: "Filter Applied",
      description: "Your wall status has been filtered successfully.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Filter Posts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Wall Status</DialogTitle>
          <DialogDescription>
            Choose how you want to filter the wall status posts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
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
        <div className="flex justify-end gap-3">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button onClick={handleApply}>Apply Filter</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
