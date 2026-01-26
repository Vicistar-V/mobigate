import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Coins,
  Edit2,
  Save,
  Crown,
  Briefcase,
  Users,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { nominationFeeStructures } from "@/data/nominationFeesData";
import { NominationFeeStructure } from "@/types/nominationProcess";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";
import { ServiceChargeConfigCard } from "./ServiceChargeConfigCard";

interface EditFeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  office: NominationFeeStructure | null;
  onSave: (officeId: string, newFee: number) => void;
}

function EditFeeDialog({ open, onOpenChange, office, onSave }: EditFeeDialogProps) {
  const [newFee, setNewFee] = useState(office?.feeInMobi || 0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!office) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(office.officeId, newFee);
    setIsSaving(false);
    onOpenChange(false);
  };

  if (!office) return null;

  const processingFee = newFee * 0.05; // 5% processing fee
  const totalFee = newFee + processingFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Nomination Fee</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Crown className="h-5 w-5 text-primary" />
            <span className="font-medium">{office.officeName}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fee">Nomination Fee (Mobi)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                M
              </span>
              <Input
                id="fee"
                type="number"
                value={newFee}
                onChange={(e) => setNewFee(Number(e.target.value))}
                className="pl-8"
                min={1000}
                step={1000}
              />
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nomination Fee:</span>
              <span>{formatMobi(newFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing (5%):</span>
              <span>{formatMobi(processingFee)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total:</span>
              <span>{formatMobi(totalFee)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'executive':
      return <Crown className="h-4 w-4 text-amber-500" />;
    case 'administrative':
      return <Briefcase className="h-4 w-4 text-blue-500" />;
    case 'support':
      return <Users className="h-4 w-4 text-emerald-500" />;
    default:
      return <Coins className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'executive':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400';
    case 'administrative':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400';
    case 'support':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400';
    default:
      return '';
  }
};

export function NominationFeeSettingsSection() {
  const { toast } = useToast();
  const [fees, setFees] = useState<NominationFeeStructure[]>(nominationFeeStructures);
  const [editingOffice, setEditingOffice] = useState<NominationFeeStructure | null>(null);
  const [serviceChargeRate, setServiceChargeRate] = useState(20);

  const handleSaveFee = (officeId: string, newFee: number) => {
    const processingFee = newFee * 0.05;
    setFees(prev => prev.map(f => {
      if (f.officeId !== officeId) return f;
      return {
        ...f,
        feeInMobi: newFee,
        processingFee,
        totalFee: newFee + processingFee,
      };
    }));
    toast({
      title: "Fee Updated",
      description: `Nomination fee for ${fees.find(f => f.officeId === officeId)?.officeName} updated.`,
    });
  };

  const groupedFees = {
    executive: fees.filter(f => f.category === 'executive'),
    administrative: fees.filter(f => f.category === 'administrative'),
    support: fees.filter(f => f.category === 'support'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Coins className="h-5 w-5 text-primary" />
        <h2 className="font-bold text-lg">Nomination Fee Settings</h2>
      </div>

      <p className="text-sm text-muted-foreground">
        Configure nomination fees for all elective offices. These fees are automatically 
        debited when candidates declare interest.
      </p>

      {/* Service Charge Config */}
      <ServiceChargeConfigCard
        currentRate={serviceChargeRate}
        onSave={(rate) => setServiceChargeRate(rate)}
      />

      {/* Fee List by Category */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Office-Specific Fees</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Accordion type="single" collapsible defaultValue="executive">
            {Object.entries(groupedFees).map(([category, officeList]) => (
              <AccordionItem key={category} value={category} className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="capitalize font-medium">{category} Positions</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {officeList.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <div className="space-y-2">
                    {officeList.map((office) => (
                      <div
                        key={office.officeId}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {office.officeName}
                            </span>
                            {office.requiresPrimary && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Fee: {formatMobi(office.feeInMobi)} + {formatMobi(office.processingFee)} processing
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-bold text-primary">
                            {formatMobi(office.totalFee)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingOffice(office)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditFeeDialog
        open={!!editingOffice}
        onOpenChange={(open) => !open && setEditingOffice(null)}
        office={editingOffice}
        onSave={handleSaveFee}
      />

      {/* Info Box */}
      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
        <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Important Notes:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Nomination fees go directly to the Community Account</li>
            <li>Service charges go to Mobigate Platform Revenue</li>
            <li>Processing fees are included in the total debited amount</li>
            <li>Changes apply to new declarations only</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
