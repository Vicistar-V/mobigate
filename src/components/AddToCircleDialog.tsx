import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddToCircleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
}

const availableCircles = [
  { id: "close-friends", name: "Close Friends", icon: "❤️" },
  { id: "family", name: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: "work", name: "Work", icon: "💼" },
  { id: "school", name: "School", icon: "🎓" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "hobby", name: "Hobby", icon: "🎨" },
  { id: "neighbors", name: "Neighbors", icon: "🏘️" },
  { id: "travel", name: "Travel", icon: "✈️" },
];

export const AddToCircleDialog = ({
  open,
  onOpenChange,
  userName,
}: AddToCircleDialogProps) => {
  const [selectedCircles, setSelectedCircles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredCircles = availableCircles.filter((circle) =>
    circle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleCircle = (circleId: string) => {
    setSelectedCircles((prev) =>
      prev.includes(circleId)
        ? prev.filter((id) => id !== circleId)
        : [...prev, circleId]
    );
  };

  const handleDone = () => {
    if (selectedCircles.length > 0) {
      const selectedNames = availableCircles
        .filter((c) => selectedCircles.includes(c.id))
        .map((c) => c.name)
        .join(", ");
      
      toast({
        title: "Added to circles",
        description: `${userName} has been added to ${selectedNames}`,
      });
    }
    setSelectedCircles([]);
    setSearchQuery("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedCircles([]);
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {userName} to Circle</DialogTitle>
          <DialogDescription>
            Select which circles you want to add {userName} to
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search circles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredCircles.map((circle) => (
              <label
                key={circle.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedCircles.includes(circle.id)}
                  onCheckedChange={() => handleToggleCircle(circle.id)}
                />
                <span className="text-xl">{circle.icon}</span>
                <span className="flex-1 text-sm font-medium">{circle.name}</span>
              </label>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              toast({
                title: "Feature coming soon",
                description: "Create new circle functionality will be available soon",
              });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Circle
          </Button>

          {selectedCircles.length > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              {selectedCircles.length} circle{selectedCircles.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleDone} disabled={selectedCircles.length === 0}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
