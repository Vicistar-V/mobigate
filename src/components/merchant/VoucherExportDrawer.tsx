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

  const handlePrint = useCallback(async () => {
    if (selectedCards.length === 0) return;
    setIsPrinting(true);

    try {
      const printContainer = document.createElement("div");
      printContainer.style.cssText = "position:fixed;left:-9999px;top:0;width:800px;background:#fff;padding:24px;";
      printContainer.innerHTML = `
        <div style="text-align:center;margin-bottom:16px;border-bottom:2px solid #000;padding-bottom:8px;">
          <h1 style="font-size:18pt;margin:0 0 4px 0;font-family:'Courier New',monospace;">VOUCHER CARDS</h1>
          <p style="font-size:9pt;margin:0;color:#555;font-family:'Courier New',monospace;">Batch: ${batch.batchNumber} | M${formatNum(batch.denomination)} | ${new Date().toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })} | Cards: ${selectedCards.length}</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
          ${selectedCards.map(card => `
            <div style="border:1.5px solid #333;border-radius:6px;padding:8px;font-family:'Courier New',monospace;font-size:8pt;">
              <div style="font-size:14pt;font-weight:900;text-align:center;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:4px;">M${formatNum(card.denomination)}</div>
              <div style="margin-bottom:2px;"><span style="color:#777;font-size:6pt;text-transform:uppercase;">Serial</span><div style="font-weight:bold;word-break:break-all;">${card.serialNumber}</div></div>
              <div style="font-size:12pt;font-weight:900;letter-spacing:1px;text-align:center;padding:6px 0;background:#f5f5f5;border-radius:4px;margin:4px 0;">${card.pin}</div>
              <div style="margin-bottom:2px;"><span style="color:#777;font-size:6pt;text-transform:uppercase;">Bundle</span><div style="font-weight:bold;">${card.bundleSerialPrefix}</div></div>
              <div><span style="color:#777;font-size:6pt;text-transform:uppercase;">Batch</span><div style="font-weight:bold;font-size:6pt;">${batch.batchNumber}</div></div>
            </div>
          `).join("")}
        </div>
      `;

      document.body.appendChild(printContainer);
      await new Promise(r => setTimeout(r, 300));

      const canvas = await html2canvas(printContainer, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const padding = 10;
      const availableWidth = pageWidth - padding * 2;
      const ratio = availableWidth / canvas.width;
      const scaledHeight = canvas.height * ratio;

      let heightLeft = scaledHeight;
      let position = padding;
      pdf.addImage(imgData, "PNG", padding, position, availableWidth, scaledHeight);
      heightLeft -= (pageHeight - padding * 2);

      while (heightLeft > 0) {
        pdf.addPage();
        position = padding - (scaledHeight - heightLeft);
        pdf.addImage(imgData, "PNG", padding, position, availableWidth, scaledHeight);
        heightLeft -= (pageHeight - padding * 2);
      }

      pdf.save(`voucher-cards-${batch.batchNumber}.pdf`);
      document.body.removeChild(printContainer);

      setIsPrinting(false);
      onOpenChange(false);
      onPrintComplete(selectedCardIds);
      setSelectedBundles(new Set());
    } catch (err) {
      console.error("PDF generation failed:", err);
      setIsPrinting(false);
    }
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
            Select bundles to print. Cards will be exported as a PDF with full PINs on A4 layout.
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
