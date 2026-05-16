import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Crown,
  Briefcase,
  Users,
  AlertCircle,
} from "lucide-react";
import { nominationFeeStructures } from "@/data/nominationFeesData";
import { NominationFeeStructure } from "@/types/nominationProcess";
import { formatMobi, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { ServiceChargeConfigCard } from "./ServiceChargeConfigCard";
import { MobiCurrencyInfoBanner } from "@/components/common/MobiExplainerTooltip";
import { LockableSetting } from "@/components/common/LockableSetting";

interface EditFeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  office: NominationFeeStructure | null;
  serviceChargeRate: number;
  onSave: (officeId: string, newFee: number) => void;
}

function EditFeeDialog({ open, onOpenChange, office, serviceChargeRate, onSave }: EditFeeDialogProps) {
  const [newFee, setNewFee] = useState(office?.feeInMobi || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [locked, setLocked] = useState(true);

  // Reset state whenever the dialog is reopened for a new office
  if (office && open && newFee === 0) {
    setNewFee(office.feeInMobi);
  }

  const handleSave = async () => {
    if (!office) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(office.officeId, newFee);
    setIsSaving(false);
    setLocked(true);
    onOpenChange(false);
  };

  if (!office) return null;

  // Unified Service Charge / Processing Fee (single charge, both wallets pay)
  const serviceCharge = newFee * (serviceChargeRate / 100);
  const candidatePays = newFee + serviceCharge;
  const communityPays = serviceCharge;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setLocked(true);
          setNewFee(office.feeInMobi);
        }
      }}
    >
      <DialogContent className="sm:max-w-md max-h-[92dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Nomination Fee</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Crown className="h-5 w-5 text-primary" />
            <span className="font-medium">{office.officeName}</span>
          </div>

          <LockableSetting
            label="Nomination Fee"
            description="Manual input · Mobi value"
            locked={locked}
            onLockedChange={setLocked}
            displayValue={`M${newFee.toLocaleString()}`}
          >
            {(unlocked) => (
              <div className="space-y-2">
                <Label htmlFor="fee" className="text-xs text-muted-foreground">
                  Nomination Fee (Mobi)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    M
                  </span>
                  <Input
                    id="fee"
                    type="number"
                    value={newFee}
                    onChange={(e) => setNewFee(Number(e.target.value))}
                    onBlur={(e) => setNewFee(Math.max(1000, Number(e.target.value) || 1000))}
                    disabled={!unlocked}
                    className="pl-8"
                    min={1000}
                    step={1000}
                  />
                </div>
              </div>
            )}
          </LockableSetting>

          <div className="bg-muted/30 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nomination Fee:</span>
              <div className="text-right">
                <span>{formatMobi(newFee)}</span>
                <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(newFee, "NGN")}</p>
              </div>
            </div>
            <div className="flex justify-between text-amber-600">
              <span className="leading-tight">Service Charge / Processing Fee ({serviceChargeRate}%):</span>
              <div className="text-right">
                <span>{formatMobi(serviceCharge)}</span>
                <p className="text-[10px] text-amber-600/70">× 2 wallets</p>
              </div>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Candidate Pays:</span>
              <div className="text-right">
                <span>{formatMobi(candidatePays)}</span>
                <p className="text-xs font-normal text-muted-foreground">≈ {formatLocalAmount(candidatePays, "NGN")}</p>
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Community Wallet Debited:</span>
              <span className="font-semibold">{formatMobi(communityPays)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || locked}>
            {isSaving ? "Saving..." : locked ? "Unlock to Save" : "Save Changes"}
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

export function NominationFeeSettingsSection() {
  const { toast } = useToast();
  const [fees, setFees] = useState<NominationFeeStructure[]>(nominationFeeStructures);
  const [editingOffice, setEditingOffice] = useState<NominationFeeStructure | null>(null);
  const [serviceChargeRate, setServiceChargeRate] = useState(20);

  const handleSaveFee = (officeId: string, newFee: number) => {
    const charge = newFee * (serviceChargeRate / 100);
    setFees(prev => prev.map(f => {
      if (f.officeId !== officeId) return f;
      return {
        ...f,
        feeInMobi: newFee,
        // Unified charge — same value occupies both fields for compat
        processingFee: charge,
        totalFee: newFee + charge,
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Coins className="h-5 w-5 text-primary" />
        <h2 className="font-bold text-lg">Nomination Fee Settings</h2>
      </div>

      <p className="text-sm text-muted-foreground">
        Configure nomination fees for all elective offices. Fees are automatically
        debited when candidates declare interest.
      </p>

      {/* Service Charge / Processing Fee — single unified setting */}
      <ServiceChargeConfigCard
        currentRate={serviceChargeRate}
        onSave={(rate) => {
          setServiceChargeRate(rate);
          // Recompute office totals with new charge rate
          setFees(prev => prev.map(f => {
            const charge = f.feeInMobi * (rate / 100);
            return { ...f, processingFee: charge, totalFee: f.feeInMobi + charge };
          }));
        }}
      />

      {/* Fee List by Category */}
      <Card>
        <CardHeader className="pb-2 px-3">
          <CardTitle className="text-base">Office-Specific Fees</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Accordion type="single" collapsible defaultValue="executive">
            {Object.entries(groupedFees).map(([category, officeList]) => (
              <AccordionItem key={category} value={category} className="border-0">
                <AccordionTrigger className="px-3 py-3 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="capitalize font-medium">{category} Positions</span>
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {officeList.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="space-y-2">
                    {officeList.map((office) => {
                      const charge = office.feeInMobi * (serviceChargeRate / 100);
                      const candidatePays = office.feeInMobi + charge;
                      return (
                        <div
                          key={office.officeId}
                          className="rounded-xl border border-border/50 bg-muted/30 p-3"
                        >
                          {/* Row 1: Name + Edit */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-medium text-sm truncate">
                                {office.officeName}
                              </span>
                              {office.requiresPrimary && (
                                <Badge variant="outline" className="text-xs shrink-0">
                                  Primary
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 shrink-0 touch-manipulation active:scale-90"
                              onClick={() => setEditingOffice(office)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {/* Fee breakdown — unified charge */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Nomination Fee</span>
                              <span className="text-sm font-semibold">{formatMobi(office.feeInMobi)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground leading-tight">
                                Service Charge / Processing Fee ({serviceChargeRate}%)
                              </span>
                              <span className="text-sm text-amber-600">{formatMobi(charge)}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-border/40">
                              <span className="text-xs font-semibold">Candidate Pays</span>
                              <div className="text-right">
                                <span className="text-sm font-bold text-primary">{formatMobi(candidatePays)}</span>
                                <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(candidatePays, "NGN")}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-muted-foreground">Community Wallet Debited</span>
                              <span className="text-xs font-semibold text-foreground">{formatMobi(charge)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
        serviceChargeRate={serviceChargeRate}
        onSave={handleSaveFee}
      />

      {/* Info Box */}
      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
        <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Important Notes:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Nomination fee goes to the Community Account</li>
            <li><strong>Service Charge / Processing Fee is a single unified charge</strong></li>
            <li>That charge is debited from <strong>both</strong> the Candidate's Wallet and the Community Wallet</li>
            <li>All settings re-lock automatically after save</li>
          </ul>
        </div>
      </div>

      {/* Currency Info Banner */}
      <MobiCurrencyInfoBanner currencyCode="NGN" />
    </div>
  );
}
