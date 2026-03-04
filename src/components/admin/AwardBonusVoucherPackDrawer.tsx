import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Gift,
  Ticket,
  CheckCircle,
  AlertTriangle,
  Wallet,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Info,
  ShieldCheck,
} from "lucide-react";

// ─── Bonus Voucher Pack Definitions ───
interface BonusVoucherPack {
  id: string;
  units: number;
  denomination: number;
  totalValue: number;
}

const bonusVoucherPacks: BonusVoucherPack[] = [
  { id: "bp-25-500", units: 25, denomination: 500, totalValue: 12500 },
  { id: "bp-50-500", units: 50, denomination: 500, totalValue: 25000 },
  { id: "bp-75-500", units: 75, denomination: 500, totalValue: 37500 },
  { id: "bp-100-500", units: 100, denomination: 500, totalValue: 50000 },
  { id: "bp-25-5000", units: 25, denomination: 5000, totalValue: 125000 },
  { id: "bp-50-5000", units: 50, denomination: 5000, totalValue: 250000 },
  { id: "bp-75-5000", units: 75, denomination: 5000, totalValue: 375000 },
  { id: "bp-100-5000", units: 100, denomination: 5000, totalValue: 500000 },
];

const formatMobi = (n: number) => `M${n.toLocaleString()}`;
const formatNaira = (n: number) => `₦${n.toLocaleString()}.00`;

// ─── Props ───
interface AwardBonusVoucherPackDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchantName: string;
  merchantId: string;
}

// ─── Mock Award History ───
interface AwardHistoryItem {
  id: string;
  pack: string;
  awardedAt: string;
  awardedBy: string;
  totalValue: number;
}

const mockAwardHistory: AwardHistoryItem[] = [
  {
    id: "ah-1",
    pack: "Pack of 50 Units of M500",
    awardedAt: "2024-02-10T14:30:00",
    awardedBy: "Admin (Mobigate HQ)",
    totalValue: 25000,
  },
  {
    id: "ah-2",
    pack: "Pack of 25 Units of M5,000",
    awardedAt: "2023-11-22T09:15:00",
    awardedBy: "Admin (Mobigate HQ)",
    totalValue: 125000,
  },
];

export function AwardBonusVoucherPackDrawer({
  open,
  onOpenChange,
  merchantName,
  merchantId,
}: AwardBonusVoucherPackDrawerProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "confirm" | "success" | "history">("select");
  const [selectedPack, setSelectedPack] = useState<BonusVoucherPack | null>(null);
  const [isAwarding, setIsAwarding] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleSelectPack = (pack: BonusVoucherPack) => {
    setSelectedPack(pack);
    setStep("confirm");
  };

  const handleAward = async () => {
    if (!selectedPack) return;
    setIsAwarding(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsAwarding(false);
    setStep("success");
  };

  const handleClose = () => {
    if (step === "confirm") {
      setShowCancelConfirm(true);
      return;
    }
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep("select");
    setSelectedPack(null);
    setIsAwarding(false);
    setShowCancelConfirm(false);
    onOpenChange(false);
  };

  const handleBack = () => {
    if (step === "confirm") {
      setStep("select");
      setSelectedPack(null);
    } else if (step === "history") {
      setStep("select");
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const getPackLabel = (pack: BonusVoucherPack) =>
    `Pack of ${pack.units} Units of ${formatMobi(pack.denomination)}`;

  // Group packs by denomination
  const m500Packs = bonusVoucherPacks.filter((p) => p.denomination === 500);
  const m5000Packs = bonusVoucherPacks.filter((p) => p.denomination === 5000);

  // ─── Step: Select Pack ───
  const renderSelectStep = () => (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Merchant Recipient Header */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Awarding bonus to</p>
                <p className="font-bold text-sm text-foreground truncate">{merchantName}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary h-7 px-2"
                onClick={() => setStep("history")}
              >
                History
              </Button>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-3 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-700">Important</p>
                <p className="text-xs text-amber-700/80 mt-0.5 leading-relaxed">
                  Bonus Voucher Packs are <strong>not tradable</strong> on the Merchant's offers. 
                  The value is credited directly to the Merchant's <strong>main‑Wallet</strong> and remains as such.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* M500 Packs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Ticket className="h-4 w-4 text-primary" />
              <p className="text-sm font-bold text-foreground">{formatMobi(500)} Denomination</p>
            </div>
            <div className="space-y-2">
              {m500Packs.map((pack) => (
                <Card
                  key={pack.id}
                  className="overflow-hidden active:scale-[0.98] transition-transform touch-manipulation cursor-pointer border-border hover:border-primary/30"
                  onClick={() => handleSelectPack(pack)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-black text-emerald-600">{pack.units}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Pack of {pack.units} Units</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {pack.units} × {formatMobi(pack.denomination)} = <span className="font-semibold text-emerald-600">{formatMobi(pack.totalValue)}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">{formatNaira(pack.totalValue)}</p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto mt-0.5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* M5,000 Packs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Ticket className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-bold text-foreground">{formatMobi(5000)} Denomination</p>
            </div>
            <div className="space-y-2">
              {m5000Packs.map((pack) => (
                <Card
                  key={pack.id}
                  className="overflow-hidden active:scale-[0.98] transition-transform touch-manipulation cursor-pointer border-border hover:border-primary/30"
                  onClick={() => handleSelectPack(pack)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-black text-amber-600">{pack.units}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Pack of {pack.units} Units</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {pack.units} × {formatMobi(pack.denomination)} = <span className="font-semibold text-amber-600">{formatMobi(pack.totalValue)}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">{formatNaira(pack.totalValue)}</p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto mt-0.5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  // ─── Step: Confirm ───
  const renderConfirmStep = () => {
    if (!selectedPack) return null;
    return (
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            {/* Award Summary */}
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">Confirm Award</p>
              <p className="text-sm text-muted-foreground mt-1">Review the details before proceeding</p>
            </div>

            {/* Details Card */}
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="p-3 border-b border-border/50 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Recipient</span>
                  <span className="text-sm font-semibold truncate ml-4">{merchantName}</span>
                </div>
                <div className="p-3 border-b border-border/50 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Pack</span>
                  <span className="text-sm font-semibold">{getPackLabel(selectedPack)}</span>
                </div>
                <div className="p-3 border-b border-border/50 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Units</span>
                  <span className="text-sm font-semibold">{selectedPack.units} voucher cards</span>
                </div>
                <div className="p-3 border-b border-border/50 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Denomination</span>
                  <span className="text-sm font-semibold">{formatMobi(selectedPack.denomination)}</span>
                </div>
                <div className="p-3 flex justify-between items-center bg-emerald-500/5">
                  <span className="text-xs font-semibold text-emerald-700">Total Value</span>
                  <div className="text-right">
                    <p className="text-base font-black text-emerald-600">{formatMobi(selectedPack.totalValue)}</p>
                    <p className="text-xs text-muted-foreground">({formatNaira(selectedPack.totalValue)})</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Destination */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-3 flex items-start gap-2">
                <Wallet className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-700">Credit Destination</p>
                  <p className="text-xs text-blue-700/80 mt-0.5 leading-relaxed">
                    This bonus will be credited directly to <strong>{merchantName}'s main‑Wallet</strong>. 
                    The value is <strong>non‑tradable</strong> and cannot be listed on the merchant's voucher offers.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-700">This action cannot be undone</p>
                  <p className="text-xs text-amber-700/80 mt-0.5">
                    Once awarded, the bonus voucher pack value will be immediately available in the merchant's main‑Wallet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="p-4 border-t space-y-2 shrink-0">
          <Button
            onClick={handleAward}
            disabled={isAwarding}
            className="w-full h-12 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]"
          >
            <Gift className="h-4 w-4 mr-2" />
            {isAwarding ? "Awarding Bonus Pack..." : `Award ${formatMobi(selectedPack.totalValue)} Bonus Pack`}
          </Button>
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isAwarding}
            className="w-full h-10 text-sm touch-manipulation"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pack Selection
          </Button>
        </div>
      </div>
    );
  };

  // ─── Step: Success ───
  const renderSuccessStep = () => {
    if (!selectedPack) return null;
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Bonus Awarded!</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">
            <strong>{getPackLabel(selectedPack)}</strong> has been successfully credited to <strong>{merchantName}'s main‑Wallet</strong>.
          </p>

          <Card className="w-full border-emerald-200 bg-emerald-50 mb-6">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-emerald-700 mb-1">Total Value Credited</p>
              <p className="text-2xl font-black text-emerald-600">{formatMobi(selectedPack.totalValue)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">({formatNaira(selectedPack.totalValue)})</p>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
            <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground text-left">
              This bonus is non‑tradable and has been logged in the award history.
            </p>
          </div>
        </div>

        <div className="p-4 border-t shrink-0">
          <Button
            onClick={resetAndClose}
            className="w-full h-12 text-sm font-semibold touch-manipulation active:scale-[0.97]"
          >
            Done
          </Button>
        </div>
      </div>
    );
  };

  // ─── Step: History ───
  const renderHistory = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold text-sm">Award History</span>
        <Badge variant="secondary" className="ml-auto text-xs">{mockAwardHistory.length}</Badge>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {mockAwardHistory.length === 0 ? (
            <div className="text-center py-10">
              <Gift className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No bonus packs awarded yet</p>
            </div>
          ) : (
            <>
              {/* Total Awarded Summary */}
              <Card className="border-primary/20 bg-primary/5 mb-4">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total Bonuses Awarded</p>
                  <p className="text-lg font-black text-primary mt-1">
                    {formatMobi(mockAwardHistory.reduce((sum, h) => sum + h.totalValue, 0))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ({formatNaira(mockAwardHistory.reduce((sum, h) => sum + h.totalValue, 0))})
                  </p>
                </CardContent>
              </Card>

              {mockAwardHistory.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Gift className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{item.pack}</p>
                          <p className="text-xs text-muted-foreground">{item.awardedBy}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-emerald-600">{formatMobi(item.totalValue)}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(item.awardedAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  // ─── Main Content Router ───
  const renderContent = () => {
    switch (step) {
      case "select": return renderSelectStep();
      case "confirm": return renderConfirmStep();
      case "success": return renderSuccessStep();
      case "history": return renderHistory();
    }
  };

  const getTitle = () => {
    switch (step) {
      case "select": return "Award Bonus Voucher Pack";
      case "confirm": return "Confirm Award";
      case "success": return "Award Complete";
      case "history": return "Award History";
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={(v) => { if (!v) handleClose(); else onOpenChange(v); }}>
        <DrawerContent className="max-h-[92vh] h-[92vh] flex flex-col">
          <DrawerHeader className="shrink-0 pb-0 relative">
            <DrawerTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              {getTitle()}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="absolute right-4 top-2 h-8 w-8" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            {renderContent()}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Cancel Confirmation */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent className="max-w-[340px] rounded-xl z-[200]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">Cancel Award?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to cancel? The selected bonus pack will not be awarded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10">Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={resetAndClose} className="h-10 bg-destructive hover:bg-destructive/90">
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
