import { useState, useMemo, useCallback } from "react";
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
import { VoucherBatch, formatNum } from "@/data/merchantVoucherData";

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
      availableCards: b.cards.filter(c => c.status === "available"),
      availableCardIds: b.cards.filter(c => c.status === "available").map(c => c.id),
    })).filter(b => b.availableCount > 0),
  [batch.bundles]);

  const totalAvailable = bundlesWithAvailable.reduce((sum, b) => sum + b.availableCount, 0);

  const selectedCardIds = useMemo(() =>
    bundlesWithAvailable
      .filter(b => selectedBundles.has(b.id))
      .flatMap(b => b.availableCardIds),
  [bundlesWithAvailable, selectedBundles]);

  const selectedCards = useMemo(() =>
    bundlesWithAvailable
      .filter(b => selectedBundles.has(b.id))
      .flatMap(b => b.availableCards),
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

  const handlePrint = useCallback(() => {
    if (selectedCards.length === 0) return;
    setIsPrinting(true);

    // Create print container
    const printContainer = document.createElement("div");
    printContainer.id = "voucher-print-area";
    printContainer.innerHTML = `
      <style>
        @media print {
          body > *:not(#voucher-print-area) { display: none !important; }
          #voucher-print-area { display: block !important; }
        }
        #voucher-print-area {
          font-family: 'Courier New', monospace;
          padding: 12mm;
        }
        .print-header {
          text-align: center;
          margin-bottom: 8mm;
          border-bottom: 2px solid #000;
          padding-bottom: 4mm;
        }
        .print-header h1 { font-size: 16pt; margin: 0 0 2mm 0; }
        .print-header p { font-size: 9pt; margin: 0; color: #555; }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3mm;
        }
        .voucher-card-print {
          border: 1.5px solid #333;
          border-radius: 2mm;
          padding: 3mm;
          page-break-inside: avoid;
          font-size: 8pt;
        }
        .voucher-card-print .denom {
          font-size: 12pt;
          font-weight: 900;
          text-align: center;
          border-bottom: 1px solid #ccc;
          padding-bottom: 1.5mm;
          margin-bottom: 1.5mm;
        }
        .voucher-card-print .field { margin-bottom: 1mm; }
        .voucher-card-print .label { color: #777; font-size: 6pt; text-transform: uppercase; }
        .voucher-card-print .value { font-weight: bold; font-size: 8pt; word-break: break-all; }
        .voucher-card-print .pin-value { font-size: 10pt; font-weight: 900; letter-spacing: 1px; text-align: center; padding: 2mm 0; background: #f5f5f5; border-radius: 1mm; margin: 1.5mm 0; }
        @page { size: A4; margin: 10mm; }
        .page-break { page-break-after: always; }
      </style>
      <div class="print-header">
        <h1>VOUCHER CARDS</h1>
        <p>Batch: ${batch.batchNumber} | Denomination: M${formatNum(batch.denomination)} | Date: ${new Date().toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })} | Cards: ${selectedCards.length}</p>
      </div>
      <div class="card-grid">
        ${selectedCards.map((card, i) => `
          ${i > 0 && i % 20 === 0 ? '</div><div class="page-break"></div><div class="card-grid">' : ''}
          <div class="voucher-card-print">
            <div class="denom">M${formatNum(card.denomination)}</div>
            <div class="field"><div class="label">Serial</div><div class="value">${card.serialNumber}</div></div>
            <div class="pin-value">${card.pin}</div>
            <div class="field"><div class="label">Bundle</div><div class="value">${card.bundleSerialPrefix}</div></div>
            <div class="field"><div class="label">Generated</div><div class="value">${card.createdAt.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}</div></div>
            <div class="field"><div class="label">Batch</div><div class="value" style="font-size:6pt">${batch.batchNumber}</div></div>
          </div>
        `).join("")}
      </div>
    `;

    printContainer.style.display = "none";
    document.body.appendChild(printContainer);

    const onAfterPrint = () => {
      document.body.removeChild(printContainer);
      window.removeEventListener("afterprint", onAfterPrint);
      setIsPrinting(false);
      onOpenChange(false);
      onPrintComplete(selectedCardIds);
      setSelectedBundles(new Set());
    };

    window.addEventListener("afterprint", onAfterPrint);

    // Show print area, trigger print
    printContainer.style.display = "block";
    setTimeout(() => {
      window.print();
    }, 100);
  }, [selectedCards, selectedCardIds, batch, onOpenChange, onPrintComplete]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="pb-2 border-b">
          <DrawerTitle className="flex items-center gap-2 text-base">
            <Printer className="h-5 w-5 text-primary" />
            Print Voucher Cards
          </DrawerTitle>
          <DrawerDescription className="text-sm">
            Select bundles to print. Cards will be printed with full PINs on A4 paper via your browser's print dialog.
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
                Opening Print Dialog...
              </>
            ) : (
              <>
                <Printer className="h-4 w-4 mr-2" />
                Print {selectedCardIds.length} Cards
              </>
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
