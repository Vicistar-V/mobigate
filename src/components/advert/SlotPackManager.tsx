import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { SlotPackDraft } from "@/types/advert";
import { getSlotPack } from "@/data/slotPacks";

interface SlotPackManagerProps {
  packDraft: SlotPackDraft;
  onAddSlot: () => void;
  onEditSlot: (slotId: string) => void;
  onDeleteSlot: (slotId: string) => void;
  onPublishPack: () => void;
  canPublish: boolean;
}

export function SlotPackManager({
  packDraft,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
  onPublishPack,
  canPublish
}: SlotPackManagerProps) {
  const pack = getSlotPack(packDraft.packId);
  if (!pack) return null;

  const filledSlots = packDraft.slots.length;
  const progress = (filledSlots / pack.minSlots) * 100;
  const canAddMore = filledSlots < pack.maxSlots;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{pack.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {filledSlots} of {pack.minSlots}-{pack.maxSlots} slots filled
            </p>
          </div>
          <Badge variant={canPublish ? "default" : "secondary"}>
            {canPublish ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready to Publish
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                {pack.minSlots - filledSlots} more needed
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Minimum Progress</span>
            <span className="font-medium">{Math.min(progress, 100).toFixed(0)}%</span>
          </div>
          <Progress value={Math.min(progress, 100)} />
        </div>

        {/* Slot List */}
        <div className="space-y-2">
          {packDraft.slots.map((slot) => (
            <Card key={slot.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Slot {slot.slotNumber}</Badge>
                    <span className="text-sm font-medium">
                      {slot.formData.category} • {slot.formData.size}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {slot.formData.dpdPackage} • ₦{slot.pricing.totalCost.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditSlot(slot.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteSlot(slot.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button
            className="flex-1 w-full sm:w-auto"
            variant="outline"
            onClick={onAddSlot}
            disabled={!canAddMore}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Slot ({filledSlots}/{pack.maxSlots})
          </Button>
          <Button
            className="flex-1 w-full sm:w-auto"
            onClick={onPublishPack}
            disabled={!canPublish}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Publish Pack
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
