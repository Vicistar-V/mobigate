import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CommunityFormData, OfficialPosition, PositionLevel } from "@/types/communityForm";
import { Plus, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

    const newPosition: OfficialPosition = {
      id: `pos-${Date.now()}-${Math.random()}`,
      title: newPositionTitle.trim(),
      level: newPositionLevel
    };

    addPosition(newPosition);
    setNewPositionTitle("");
    setNewPositionLevel("topmost");
  };

  // Get available office titles based on what user selected
  const getAvailablePositions = () => {
    const topmost = formData.topmostOffices;
    const deputies = formData.deputyOffices;
    return [...topmost, ...deputies];
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
            <Plus className="h-4 w-4" />
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
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">S/N</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.positions.map((position, index) => (
                  <TableRow key={position.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{position.title}</TableCell>
                    <TableCell>
                      <span className={
                        position.level === "topmost" 
                          ? "text-primary font-medium" 
                          : "text-muted-foreground"
                      }>
                        {position.level === "topmost" ? "Topmost" : "Deputy"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePosition(position.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
