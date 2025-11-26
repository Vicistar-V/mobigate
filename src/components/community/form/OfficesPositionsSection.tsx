import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CommunityFormData, OfficialPosition, PositionLevel } from "@/types/communityForm";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

interface OfficesPositionsSectionProps {
  formData: CommunityFormData;
  addPosition: (position: OfficialPosition) => void;
  removePosition: (positionId: string) => void;
  updatePosition: (positionId: string, updates: Partial<OfficialPosition>) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function OfficesPositionsSection({ 
  formData, 
  addPosition, 
  removePosition,
  updatePosition,
  errors 
}: OfficesPositionsSectionProps) {
  const [newPositionTitle, setNewPositionTitle] = useState("");
  const [newPositionLevel, setNewPositionLevel] = useState<PositionLevel>("topmost");

  const handleAddPosition = () => {
    if (!newPositionTitle.trim()) return;

    // Check if position with same title already exists
    const positionExists = formData.positions.some(
      p => p.title.toLowerCase() === newPositionTitle.trim().toLowerCase()
    );

    if (positionExists) {
      toast({
        title: "Duplicate Position",
        description: `"${newPositionTitle}" has already been added. Each position can only be assigned once.`,
        variant: "destructive",
      });
      return;
    }

    const nextSlotNumber = formData.positions.length + 1;

    const newPosition: OfficialPosition = {
      id: `pos-${Date.now()}-${Math.random()}`,
      title: newPositionTitle.trim(),
      level: newPositionLevel,
      adminId: `admin-${nextSlotNumber}`,
      adminName: `Admin-${nextSlotNumber}`, // Auto-assigned!
    };

    addPosition(newPosition);
    setNewPositionTitle("");
    setNewPositionLevel("topmost");
  };

  const handleToggleAdmin = (positionId: string, currentAdminName: string | undefined) => {
    const position = formData.positions.find(p => p.id === positionId);
    if (!position) return;

    // Get the position's slot number (1-indexed)
    const slotNumber = formData.positions.indexOf(position) + 1;

    if (currentAdminName) {
      // Toggle to unassigned
      updatePosition(positionId, { adminId: undefined, adminName: undefined });
    } else {
      // Toggle back to assigned
      updatePosition(positionId, { 
        adminId: `admin-${slotNumber}`,
        adminName: `Admin-${slotNumber}`
      });
    }
  };

  const handleViewFullList = () => {
    toast({
      title: "Full Positions List",
      description: `Total positions: ${formData.positions.length}`,
    });
  };

  // Get available office titles based on what user selected
  const getAvailablePositions = () => {
    const positions: string[] = [];
    if (formData.topmostOffice) positions.push(formData.topmostOffice);
    if (formData.deputyOffice) positions.push(formData.deputyOffice);
    
    // Filter out positions that have already been added
    const existingTitles = formData.positions.map(p => p.title);
    return positions.filter(title => !existingTitles.includes(title));
  };

  // Format serial number with leading zero
  const formatSerialNumber = (index: number) => {
    return String(index + 1).padStart(2, '0');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-4 rounded-md border bg-muted/50">
        <Label className="text-sm font-semibold">Add New Position</Label>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Position Level</Label>
            <RadioGroup 
              value={newPositionLevel}
              onValueChange={(value) => setNewPositionLevel(value as PositionLevel)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="topmost" id="level-topmost" />
                <Label htmlFor="level-topmost" className="font-normal cursor-pointer text-sm">
                  Topmost
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deputy" id="level-deputy" />
                <Label htmlFor="level-deputy" className="font-normal cursor-pointer text-sm">
                  Deputy
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Position Title</Label>
            {getAvailablePositions().length > 0 ? (
              <Select 
                value={newPositionTitle}
                onValueChange={setNewPositionTitle}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position title" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailablePositions().map(title => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder="Enter position title"
                value={newPositionTitle}
                onChange={(e) => setNewPositionTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddPosition()}
              />
            )}
          </div>

          <Button 
            type="button"
            onClick={handleAddPosition}
            disabled={!newPositionTitle.trim()}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Position
          </Button>
        </div>
      </div>

      {errors.positions && (
        <p className="text-xs text-destructive">{errors.positions}</p>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Positions List ({formData.positions.length})
        </Label>
        
        {formData.positions.length === 0 ? (
          <div className="p-8 text-center border rounded-md bg-muted/30">
            <p className="text-sm text-muted-foreground">No positions added yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add at least one position to continue
            </p>
          </div>
        ) : (
          <>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="w-16 text-primary-foreground font-semibold">S/N</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">POSITION</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">ADMINS</TableHead>
                    <TableHead className="w-12 text-primary-foreground"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.positions.map((position, index) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-medium text-muted-foreground">
                        {formatSerialNumber(index)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {position.title}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAdmin(position.id, position.adminName)}
                          className="w-full text-center hover:opacity-70 transition-opacity cursor-pointer py-1"
                        >
                          {position.adminName ? (
                            <span className="text-yellow-600 dark:text-yellow-500 font-medium">
                              {position.adminName}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">- - - - - -</span>
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePosition(position.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleViewFullList}
                className="text-primary hover:text-primary/80 gap-1"
              >
                View Full list
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
