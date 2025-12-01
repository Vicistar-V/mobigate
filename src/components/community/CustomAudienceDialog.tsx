import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { communityPeople } from "@/data/communityPeopleData";
import { useToast } from "@/hooks/use-toast";

interface CustomAudience {
  id: string;
  name: string;
  memberIds: string[];
  createdAt: string;
}

interface CustomAudienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "view";
  audiences: CustomAudience[];
  onAudiencesChange: (audiences: CustomAudience[]) => void;
}

export const CustomAudienceDialog = ({
  open,
  onOpenChange,
  mode,
  audiences,
  onAudiencesChange,
}: CustomAudienceDialogProps) => {
  const [createMode, setCreateMode] = useState(false);
  const [audienceName, setAudienceName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredPeople = communityPeople.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMemberSelection = (personId: string) => {
    if (selectedMemberIds.includes(personId)) {
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== personId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, personId]);
    }
  };

  const handleCreateAudience = () => {
    if (!audienceName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your audience",
        variant: "destructive",
      });
      return;
    }

    if (selectedMemberIds.length === 0) {
      toast({
        title: "No Members Selected",
        description: "Please select at least one member",
        variant: "destructive",
      });
      return;
    }

    const newAudience: CustomAudience = {
      id: `audience-${Date.now()}`,
      name: audienceName,
      memberIds: selectedMemberIds,
      createdAt: new Date().toISOString(),
    };

    onAudiencesChange([...audiences, newAudience]);

    toast({
      title: "Audience Created",
      description: `${audienceName} created with ${selectedMemberIds.length} member(s)`,
    });

    // Reset form
    setAudienceName("");
    setSelectedMemberIds([]);
    setSearchQuery("");
    setCreateMode(false);
  };

  const handleDeleteAudience = (audienceId: string) => {
    const audience = audiences.find((a) => a.id === audienceId);
    onAudiencesChange(audiences.filter((a) => a.id !== audienceId));
    
    toast({
      title: "Audience Deleted",
      description: `${audience?.name} has been removed`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" || createMode
              ? "Create Custom Audience"
              : "Custom Audiences"}
          </DialogTitle>
        </DialogHeader>

        {mode === "view" && !createMode ? (
          <div className="space-y-4">
            {/* Create New Button */}
            <Button
              onClick={() => setCreateMode(true)}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Audience
            </Button>

            <Separator />

            {/* Audiences List */}
            <ScrollArea className="h-[400px]">
              {audiences.length > 0 ? (
                <div className="space-y-3">
                  {audiences.map((audience) => {
                    const members = communityPeople.filter((p) =>
                      audience.memberIds.includes(p.id)
                    );

                    return (
                      <div
                        key={audience.id}
                        className="p-4 rounded-lg border space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{audience.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Created {new Date(audience.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAudience(audience.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {audience.memberIds.length} member(s)
                          </span>
                        </div>

                        {/* Member Avatars */}
                        <div className="flex -space-x-2">
                          {members.slice(0, 5).map((member) => (
                            <Avatar
                              key={member.id}
                              className="h-8 w-8 border-2 border-background"
                            >
                              <AvatarImage
                                src={member.imageUrl}
                                alt={member.name}
                              />
                              <AvatarFallback>
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {members.length > 5 && (
                            <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                              <span className="text-xs font-medium">
                                +{members.length - 5}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">No Custom Audiences</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Create audience groups for targeted content
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Audience Name Input */}
            <div className="space-y-2">
              <Label>Audience Name</Label>
              <Input
                placeholder="e.g., Team Leaders, Local Members..."
                value={audienceName}
                onChange={(e) => setAudienceName(e.target.value)}
              />
            </div>

            <Separator />

            {/* Search Members */}
            <div className="space-y-2">
              <Label>Select Members</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Selected Count */}
            {selectedMemberIds.length > 0 && (
              <Badge variant="secondary" className="w-fit">
                {selectedMemberIds.length} member(s) selected
              </Badge>
            )}

            {/* Members List */}
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {filteredPeople.map((person) => {
                  const isSelected = selectedMemberIds.includes(person.id);
                  return (
                    <div
                      key={person.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isSelected ? "bg-primary/5 border-primary/20" : ""
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleMemberSelection(person.id)}
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
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (mode === "view") {
                    setCreateMode(false);
                    setAudienceName("");
                    setSelectedMemberIds([]);
                    setSearchQuery("");
                  } else {
                    onOpenChange(false);
                  }
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAudience} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Create Audience
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
