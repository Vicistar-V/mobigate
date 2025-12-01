import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, X, UserX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { communityPeople } from "@/data/communityPeopleData";

interface AudienceExclusionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "browse" | "view";
  excludedIds: string[];
  onExcludedIdsChange: (ids: string[]) => void;
}

export const AudienceExclusionDialog = ({
  open,
  onOpenChange,
  mode,
  excludedIds,
  onExcludedIdsChange,
}: AudienceExclusionDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPeople = communityPeople.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const excludedPeople = communityPeople.filter((person) =>
    excludedIds.includes(person.id)
  );

  const toggleExclusion = (personId: string) => {
    if (excludedIds.includes(personId)) {
      onExcludedIdsChange(excludedIds.filter((id) => id !== personId));
    } else {
      onExcludedIdsChange([...excludedIds, personId]);
    }
  };

  const removeFromExclusion = (personId: string) => {
    onExcludedIdsChange(excludedIds.filter((id) => id !== personId));
  };

  const clearAll = () => {
    onExcludedIdsChange([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {mode === "browse"
              ? "Browse & Exclude Members"
              : "Excluded Members List"}
          </DialogTitle>
        </DialogHeader>

        {mode === "browse" ? (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Members List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredPeople.map((person) => {
                  const isExcluded = excludedIds.includes(person.id);
                  return (
                    <div
                      key={person.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isExcluded ? "bg-destructive/5 border-destructive/20" : ""
                      }`}
                    >
                      <Checkbox
                        checked={isExcluded}
                        onCheckedChange={() => toggleExclusion(person.id)}
                      />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={person.imageUrl} alt={person.name} />
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {person.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {person.title}
                        </p>
                      </div>
                      {isExcluded && (
                        <Badge variant="destructive" className="text-xs">
                          <UserX className="h-3 w-3 mr-1" />
                          Excluded
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Summary */}
            {excludedIds.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {excludedIds.length} member(s) excluded
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header with Clear All */}
            {excludedPeople.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {excludedPeople.length} member(s) excluded
                </p>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            )}

            {/* Excluded Members List */}
            <ScrollArea className="h-[400px]">
              {excludedPeople.length > 0 ? (
                <div className="space-y-2">
                  {excludedPeople.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-destructive/5 border-destructive/20"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={person.imageUrl} alt={person.name} />
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {person.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {person.title}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromExclusion(person.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <UserX className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">No Excluded Members</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All members can view this content
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
