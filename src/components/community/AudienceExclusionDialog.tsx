import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, X, UserX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { communityPeople } from "@/data/communityPeopleData";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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

  // Member Card Component - stacked layout for mobile
  const MemberCard = ({ person, isExcluded, showRemoveButton = false }: { 
    person: typeof communityPeople[0]; 
    isExcluded: boolean;
    showRemoveButton?: boolean;
  }) => (
    <div
      className={`flex flex-col p-3 rounded-lg border ${
        isExcluded ? "bg-destructive/5 border-destructive/20" : ""
      }`}
    >
      {/* Top row: Checkbox/Avatar + Name */}
      <div className="flex items-center gap-3">
        {!showRemoveButton && (
          <Checkbox
            checked={isExcluded}
            onCheckedChange={() => toggleExclusion(person.id)}
            className="flex-shrink-0"
          />
        )}
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={person.imageUrl} alt={person.name} />
          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{person.name}</p>
          <p className="text-xs text-muted-foreground truncate">{person.title}</p>
        </div>
        {showRemoveButton && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => removeFromExclusion(person.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Bottom row: Excluded badge (only in browse mode when excluded) */}
      {isExcluded && !showRemoveButton && (
        <div className="flex justify-end mt-2 pt-2 border-t border-destructive/20">
          <Badge variant="destructive" className="text-xs">
            <UserX className="h-3 w-3 mr-1" />
            Excluded
          </Badge>
        </div>
      )}
    </div>
  );

  // Browse Mode Content
  const BrowseContent = () => (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="relative px-4 pt-2 pb-3">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-4">
          {filteredPeople.map((person) => {
            const isExcluded = excludedIds.includes(person.id);
            return (
              <MemberCard 
                key={person.id} 
                person={person} 
                isExcluded={isExcluded} 
              />
            );
          })}
        </div>
      </ScrollArea>

      {/* Fixed Footer Summary */}
      <div className="sticky bottom-0 p-4 bg-background border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {excludedIds.length} member(s) excluded
          </span>
          <Button
            variant="default"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );

  // View Mode Content
  const ViewContent = () => (
    <div className="flex flex-col h-full">
      {/* Header with Clear All */}
      {excludedPeople.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <p className="text-sm text-muted-foreground">
            {excludedPeople.length} member(s) excluded
          </p>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      )}

      {/* Excluded Members List */}
      <ScrollArea className="flex-1 px-4">
        {excludedPeople.length > 0 ? (
          <div className="space-y-2 py-4">
            {excludedPeople.map((person) => (
              <MemberCard 
                key={person.id} 
                person={person} 
                isExcluded={true}
                showRemoveButton={true}
              />
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

      {/* Fixed Footer */}
      <div className="sticky bottom-0 p-4 bg-background border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      </div>
    </div>
  );

  const title = mode === "browse" ? "Browse & Exclude Members" : "Excluded Members List";

  // Mobile: Use Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          {mode === "browse" ? <BrowseContent /> : <ViewContent />}
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Use Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {mode === "browse" ? <BrowseContent /> : <ViewContent />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
