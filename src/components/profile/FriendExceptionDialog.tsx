import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock friends data - will be replaced with actual data from backend
const mockFriends = [
  { id: "1", name: "John Doe", email: "john.doe@example.com" },
  { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
  { id: "3", name: "Mike Johnson", email: "mike.j@example.com" },
  { id: "4", name: "Sarah Williams", email: "sarah.w@example.com" },
  { id: "5", name: "David Brown", email: "david.brown@example.com" },
  { id: "6", name: "Emily Davis", email: "emily.d@example.com" },
  { id: "7", name: "Chris Wilson", email: "chris.wilson@example.com" },
  { id: "8", name: "Lisa Anderson", email: "lisa.a@example.com" },
];

interface Friend {
  id: string;
  name: string;
  email: string;
}

interface FriendExceptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedExceptions: string[];
  onSave: (exceptions: string[]) => void;
}

export const FriendExceptionDialog = ({
  open,
  onOpenChange,
  selectedExceptions,
  onSave,
}: FriendExceptionDialogProps) => {
  const [localExceptions, setLocalExceptions] = useState<string[]>(selectedExceptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [suggestions, setSuggestions] = useState<Friend[]>([]);

  // Filter friends based on search query
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return mockFriends;
    
    const query = searchQuery.toLowerCase();
    return mockFriends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(query) ||
        (friend.email && friend.email.toLowerCase().includes(query))
    );
  }, [searchQuery, mockFriends]);

  // Auto-suggestion for custom input
  const handleCustomInputChange = (value: string) => {
    setCustomInput(value);
    
    if (value.length > 0) {
      const query = value.toLowerCase();
      const matches = mockFriends.filter(
        (friend) =>
          !localExceptions.includes(friend.id) &&
          (friend.name.toLowerCase().includes(query) ||
           (friend.email && friend.email.toLowerCase().includes(query)))
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const toggleException = (id: string) => {
    setLocalExceptions((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const addCustomException = (friendId?: string, customName?: string) => {
    if (friendId) {
      if (!localExceptions.includes(friendId)) {
        setLocalExceptions([...localExceptions, friendId]);
      }
    } else if (customName && customName.trim()) {
      // For custom entries (non-friends), use a special format
      const customId = `custom_${customName.trim()}`;
      if (!localExceptions.includes(customId)) {
        setLocalExceptions([...localExceptions, customId]);
      }
    }
    setCustomInput("");
    setSuggestions([]);
  };

  const removeException = (id: string) => {
    setLocalExceptions(localExceptions.filter((e) => e !== id));
  };

  const handleSave = () => {
    onSave(localExceptions);
    onOpenChange(false);
  };

  const getExceptionDisplay = (id: string) => {
    if (id.startsWith("custom_")) {
      return id.replace("custom_", "");
    }
    const friend = mockFriends.find((f) => f.id === id);
    return friend ? friend.name : id;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select People to Exclude</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Exceptions Display */}
          {localExceptions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected ({localExceptions.length})</Label>
              <div className="flex flex-wrap gap-2">
                {localExceptions.map((id) => (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {getExceptionDisplay(id)}
                    <button
                      type="button"
                      onClick={() => removeException(id)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Custom Input with Auto-suggestion */}
          <div className="space-y-2">
            <Label htmlFor="custom-input">Add by Name or Email</Label>
            <div className="relative">
              <Input
                id="custom-input"
                placeholder="Type name or email..."
                value={customInput}
                onChange={(e) => handleCustomInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customInput.trim()) {
                    e.preventDefault();
                    addCustomException(undefined, customInput);
                  }
                }}
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-50 max-h-40 overflow-y-auto">
                  {suggestions.map((friend) => (
                    <button
                      key={friend.id}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-accent flex flex-col text-base"
                      onClick={() => addCustomException(friend.id)}
                    >
                      <span className="font-medium">{friend.name}</span>
                      <span className="text-sm text-muted-foreground">{friend.email}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Type a name/email and press Enter, or select from suggestions
            </p>
          </div>

          {/* Friends List */}
          <div className="space-y-2">
            <Label htmlFor="search-friends">Select from Friends List</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-friends"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[250px] rounded-md border p-2">
              <div className="space-y-2">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center space-x-3 rounded-md p-2 hover:bg-accent"
                    >
                      <Checkbox
                        id={`friend-${friend.id}`}
                        checked={localExceptions.includes(friend.id)}
                        onCheckedChange={() => toggleException(friend.id)}
                      />
                      <label
                        htmlFor={`friend-${friend.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-base">{friend.name}</div>
                        <div className="text-sm text-muted-foreground">{friend.email}</div>
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No friends found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Exceptions ({localExceptions.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
