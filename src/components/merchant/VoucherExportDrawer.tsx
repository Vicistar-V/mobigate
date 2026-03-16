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
import { Printer, Package, ListChecks, Check, Download } from "lucide-react";
import { VoucherBatch, formatNum } from "@/data/merchantVoucherData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

    const printContainer = document.createElement("div");
    printContainer.id = "voucher-print-area";
    printContainer.innerHTML = `
      <style>
        #voucher-print-area {
          position: fixed;
          left: -9999px;
          top: 0;
          width: 210mm;
          font-family: 'Courier New', monospace;
          padding: 12mm;
        }
        @media print {
          body > *:not(#voucher-print-area) { display: none !important; visibility: hidden !important; }
          #voucher-print-area {
            display: block !important;
            visibility: visible !important;
            position: static !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
          }
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
    setTimeout(() => { window.print(); }, 200);
  }, [selectedCards, selectedCardIds, batch, onOpenChange, onPrintComplete]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 px-4 pt-3 pb-2 border-b border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <Printer className="h-4 w-4 text-primary shrink-0" />
            <p className="text-sm font-bold text-foreground">Print Voucher Cards</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Select bundles to print. Cards will be printed with full PINs on A4 paper via your browser's print dialog.
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain min-h-0">
          <div className="px-4 py-3 space-y-2">
            {/* Select All */}
            <button
              onClick={selectAll}
              className={`w-full flex items-center gap-2.5 p-3 rounded-xl border-2 touch-manipulation active:scale-[0.98] transition-all ${
                allSelected
                  ? "border-primary bg-primary/5"
                  : "border-border/40 bg-card"
              }`}
            >
              <div className={`h-5 w-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                allSelected ? "bg-primary border-primary" : "border-2 border-muted-foreground/40"
              }`}>
                {allSelected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-foreground">
                  {allSelected ? "Deselect All" : "Select All Available"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalAvailable} cards across {bundlesWithAvailable.length} bundle{bundlesWithAvailable.length !== 1 ? "s" : ""}
                </p>
              </div>
            </button>

            {/* Bundle list */}
            {bundlesWithAvailable.map(bundle => {
              const isSelected = selectedBundles.has(bundle.id);
              return (
                <button
                  key={bundle.id}
                  onClick={() => toggleBundle(bundle.id)}
                  className={`w-full flex items-center gap-2 p-3 rounded-xl border-2 touch-manipulation active:scale-[0.98] transition-all ${
                    isSelected ? "border-primary bg-primary/5" : "border-border/40 bg-card"
                  }`}
                >
                  <div className={`h-5 w-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "bg-primary border-primary" : "border-2 border-muted-foreground/40"
                  }`}>
                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{bundle.serialPrefix}</p>
                    <p className="text-xs text-muted-foreground">{bundle.availableCount} Available cards</p>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-200 text-xs h-5 px-1.5 shrink-0 whitespace-nowrap">
                    {bundle.availableCount}
                  </Badge>
                </button>
              );
            })}

            {bundlesWithAvailable.length === 0 && (
              <div className="text-center py-10">
                <Package className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No Available cards to print</p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer - always visible */}
        <div className="shrink-0 px-4 py-3 border-t border-border/30 bg-card/95 backdrop-blur-sm pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <Button
            onClick={handlePrint}
            disabled={selectedCardIds.length === 0 || isPrinting}
            className="w-full h-12 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97]"
          >
            {isPrinting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Opening Print Dialog...
              </>
            ) : (
              <>
                <Printer className="h-4 w-4 mr-2" />
                Print {selectedCardIds.length} Card{selectedCardIds.length !== 1 ? "s" : ""} Now
              </>
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
