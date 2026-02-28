import { useState, useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer, Package, ListChecks } from "lucide-react";
import { VoucherBatch } from "@/data/merchantVoucherData";

interface VoucherPrintDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: VoucherBatch;
  onPrintComplete: (cardIds: string[]) => void;
}

export function VoucherPrintDrawer({ open, onOpenChange, batch, onPrintComplete }: VoucherPrintDrawerProps) {
  const [selectedBundles, setSelectedBundles] = useState<Set<string>>(new Set());
  const [isPrinting, setIsPrinting] = useState(false);

  const bundlesWithAvailable = useMemo(() =>
    batch.bundles.map(b => ({
      ...b,
      availableCount: b.cards.filter(c => c.status === "available").length,
      availableCardIds: b.cards.filter(c => c.status === "available").map(c => c.id),
    })).filter(b => b.availableCount > 0),
  [batch.bundles]);

  const totalAvailable = bundlesWithAvailable.reduce((sum, b) => sum + b.availableCount, 0);

  const selectedCardIds = useMemo(() =>
    bundlesWithAvailable
      .filter(b => selectedBundles.has(b.id))
      .flatMap(b => b.availableCardIds),
  [bundlesWithAvailable, selectedBundles]);

  const allSelected = bundlesWithAvailable.length > 0 && selectedBundles.size === bundlesWithAvailable.length;

  const toggleBundle = (id: string) => {
    setSelectedBundles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (allSelected) {
      setSelectedBundles(new Set());
    } else {
      setSelectedBundles(new Set(bundlesWithAvailable.map(b => b.id)));
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsPrinting(false);
    onOpenChange(false);
    onPrintComplete(selectedCardIds);
    setSelectedBundles(new Set());
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="pb-2 border-b">
          <DrawerTitle className="flex items-center gap-2 text-base">
            <Printer className="h-5 w-5 text-primary" />
            Print Voucher Cards
          </DrawerTitle>
          <DrawerDescription className="text-sm">
            Select bundles to print. Only available cards will be included with full PINs.
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto touch-auto">
          <div className="p-4 space-y-3">
            {/* Select All */}
            <button
              onClick={selectAll}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 touch-manipulation active:scale-[0.98] ${
                allSelected
                  ? "border-primary bg-primary/5"
                  : "border-border/50 bg-card"
              }`}
            >
              <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 ${
                allSelected ? "bg-primary border-primary" : "border-muted-foreground/40"
              }`}>
                {allSelected && (
                  <svg className="h-3 w-3 text-primary-foreground" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">
                  {allSelected ? "Deselect All" : "Select All Available"}
                </p>
                <p className="text-xs text-muted-foreground">{totalAvailable} cards across {bundlesWithAvailable.length} bundles</p>
              </div>
              <ListChecks className="h-5 w-5 text-muted-foreground shrink-0" />
            </button>

            {/* Bundle list */}
            <div className="space-y-2">
              {bundlesWithAvailable.map(bundle => {
                const isSelected = selectedBundles.has(bundle.id);
                return (
                  <button
                    key={bundle.id}
                    onClick={() => toggleBundle(bundle.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 touch-manipulation active:scale-[0.98] ${
                      isSelected ? "border-primary bg-primary/5" : "border-border/50 bg-card"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleBundle(bundle.id)}
                      className="pointer-events-none"
                    />
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{bundle.serialPrefix}</p>
                      <p className="text-xs text-muted-foreground">{bundle.availableCount} available cards</p>
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-600 text-xs h-5 px-2">{bundle.availableCount}</Badge>
                  </button>
                );
              })}
            </div>

            {bundlesWithAvailable.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No available cards to print</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t bg-background sticky bottom-0">
          <Button
            onClick={handlePrint}
            disabled={selectedCardIds.length === 0 || isPrinting}
            className="w-full h-12 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]"
            size="lg"
          >
            {isPrinting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Printing...
              </>
            ) : (
              <>
                <Printer className="h-4 w-4 mr-2" />
                Print {selectedCardIds.length} Cards as PDF
              </>
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
