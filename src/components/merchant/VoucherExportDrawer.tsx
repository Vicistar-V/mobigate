import { useState, useMemo, useCallback } from "react";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Package, Check, Download, FileText } from "lucide-react";
import { VoucherBatch, formatNum } from "@/data/merchantVoucherData";
import jsPDF from "jspdf";

interface VoucherPrintDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: VoucherBatch;
  onPrintComplete: (cardIds: string[]) => void;
}

// Paper layout specs — voucher 1.25"×2.25" rendered landscape (2.25W × 1.25H per cell)
type PaperKey = "a4" | "letter" | "legal" | "a3";
interface PaperSpec {
  key: PaperKey;
  label: string;
  // jsPDF page format
  format: string;
  orientation: "portrait" | "landscape";
  // Grid (cols × rows)
  cols: number;
  rows: number;
  perPage: number;
}

const VOUCHER_W_IN = 2.25; // landscape — wider than tall
const VOUCHER_H_IN = 1.25;
// Cutting gutters — extra blank space between vouchers so guillotine/scissors
// have room to cut without shaving content. Horizontal rows get more space
// because most cutters slice along horizontal lines first.
const GUTTER_X_IN = 0.08; // ~2mm between columns
const GUTTER_Y_IN = 0.20; // ~5mm between rows (generous for horizontal cuts)

const PAPER_SPECS: PaperSpec[] = [
  { key: "a4",     label: "A4 — 3 × 7 (21/page)",   format: "a4",     orientation: "portrait", cols: 3, rows: 7,  perPage: 21 },
  { key: "letter", label: "Letter — 3 × 7 (21/page)", format: "letter", orientation: "portrait", cols: 3, rows: 7,  perPage: 21 },
  { key: "legal",  label: "Legal — 3 × 8 (24/page)",  format: "legal",  orientation: "portrait", cols: 3, rows: 8,  perPage: 24 },
  { key: "a3",     label: "A3 — 4 × 10 (40/page)",   format: "a3",     orientation: "portrait", cols: 4, rows: 10, perPage: 40 },
];

interface PrintableCard {
  id: string;
  serialNumber: string;
  pin: string;
  denomination: number;
  bundleSerialPrefix: string;
}

export function VoucherPrintDrawer({ open, onOpenChange, batch, onPrintComplete }: VoucherPrintDrawerProps) {
  const [selectedBundles, setSelectedBundles] = useState<Set<string>>(new Set());
  const [isPrinting, setIsPrinting] = useState(false);
  const [paperKey, setPaperKey] = useState<PaperKey>("a4");

  const paperSpec = PAPER_SPECS.find(p => p.key === paperKey)!;

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

  const selectedCards: PrintableCard[] = useMemo(() =>
    bundlesWithAvailable
      .filter(b => selectedBundles.has(b.id))
      .flatMap(b => b.availableCards),
  [bundlesWithAvailable, selectedBundles]);

  const allSelected = bundlesWithAvailable.length > 0 && selectedBundles.size === bundlesWithAvailable.length;

  const totalPages = Math.max(1, Math.ceil(selectedCards.length / paperSpec.perPage));

  const toggleBundle = (id: string) => {
    setSelectedBundles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (allSelected) setSelectedBundles(new Set());
    else setSelectedBundles(new Set(bundlesWithAvailable.map(b => b.id)));
  };

  const drawVoucher = (
    pdf: jsPDF,
    card: PrintableCard,
    x: number,
    y: number,
    w: number,
    h: number,
  ) => {
    // Border (cut line)
    pdf.setDrawColor(40, 40, 40);
    pdf.setLineWidth(0.3);
    pdf.rect(x, y, w, h);

    const pad = 2; // mm inner padding

    // Header strip — brand + denomination
    pdf.setFillColor(15, 23, 42);
    pdf.rect(x, y, w, 5, "F");

    // Mobigate logo icon — small rounded square with "M"
    const logoSize = 3.6;
    const logoX = x + pad;
    const logoY = y + (5 - logoSize) / 2;
    pdf.setFillColor(168, 85, 247); // fuchsia/purple accent
    pdf.roundedRect(logoX, logoY, logoSize, logoSize, 0.6, 0.6, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6);
    pdf.text("M", logoX + logoSize / 2, logoY + logoSize / 2 + 1, { align: "center" });

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.text("MOBIGATE", logoX + logoSize + 1.2, y + 3.5);
    pdf.setFontSize(8);
    pdf.text(`M${formatNum(card.denomination)}`, x + w - pad, y + 3.6, { align: "right" });

    // Body
    pdf.setTextColor(40, 40, 40);
    let cy = y + 5 + pad + 1.2;

    // Serial
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(5);
    pdf.setTextColor(120, 120, 120);
    pdf.text("SERIAL", x + pad, cy);
    pdf.setFont("courier", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(20, 20, 20);
    pdf.text(card.serialNumber, x + pad, cy + 2.6);

    // PIN box — center, prominent
    const pinBoxY = cy + 4.4;
    const pinBoxH = h - (pinBoxY - y) - pad - 4.5;
    pdf.setFillColor(243, 244, 246);
    pdf.rect(x + pad, pinBoxY, w - pad * 2, pinBoxH, "F");
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.15);
    pdf.rect(x + pad, pinBoxY, w - pad * 2, pinBoxH);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(4.5);
    pdf.setTextColor(120, 120, 120);
    pdf.text("PIN", x + pad + 1, pinBoxY + 2);

    pdf.setFont("courier", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.text(
      card.pin,
      x + w / 2,
      pinBoxY + pinBoxH / 2 + 1.6,
      { align: "center" },
    );

    // Footer — bundle + batch
    const footY = y + h - pad - 1.2;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(4.5);
    pdf.setTextColor(110, 110, 110);
    pdf.text(`Bundle: ${card.bundleSerialPrefix}`, x + pad, footY);
    pdf.text(`Batch: ${batch.batchNumber}`, x + w - pad, footY, { align: "right" });
  };

  const handlePrint = useCallback(async () => {
    if (selectedCards.length === 0) return;
    setIsPrinting(true);

    try {
      const spec = paperSpec;
      const pdf = new jsPDF({
        orientation: spec.orientation,
        unit: "in",
        format: spec.format,
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      const gridW = spec.cols * VOUCHER_W_IN;
      const gridH = spec.rows * VOUCHER_H_IN;
      const marginX = Math.max(0, (pageW - gridW) / 2);
      const marginY = Math.max(0, (pageH - gridH) / 2);

      // Convert to mm for jsPDF drawing (we passed "in" unit, so use inches directly)
      // jsPDF was created with unit "in", but our drawVoucher uses small numeric values like 2, 5
      // which were calibrated in mm. We need to re-do the unit handling: use "mm" for the pdf
      // and convert inch dimensions to mm.
      // Recreate with mm for cleaner drawing:
      const IN_TO_MM = 25.4;
      const pdfMM = new jsPDF({
        orientation: spec.orientation,
        unit: "mm",
        format: spec.format,
      });
      const pageWmm = pdfMM.internal.pageSize.getWidth();
      const pageHmm = pdfMM.internal.pageSize.getHeight();
      const vW = VOUCHER_W_IN * IN_TO_MM;
      const vH = VOUCHER_H_IN * IN_TO_MM;
      const gutterXmm = GUTTER_X_IN * IN_TO_MM;
      const gutterYmm = GUTTER_Y_IN * IN_TO_MM;
      const gridWmm = spec.cols * vW + (spec.cols - 1) * gutterXmm;
      const gridHmm = spec.rows * vH + (spec.rows - 1) * gutterYmm;
      const marginXmm = Math.max(0, (pageWmm - gridWmm) / 2);
      const marginYmm = Math.max(0, (pageHmm - gridHmm) / 2);

      let page = 0;
      for (let i = 0; i < selectedCards.length; i++) {
        const slot = i % spec.perPage;
        if (slot === 0) {
          if (i > 0) pdfMM.addPage(spec.format, spec.orientation);
          page++;
        }
        const row = Math.floor(slot / spec.cols);
        const col = slot % spec.cols;
        const x = marginXmm + col * (vW + gutterXmm);
        const y = marginYmm + row * (vH + gutterYmm);
        drawVoucher(pdfMM, selectedCards[i], x, y, vW, vH);
      }

      pdfMM.save(`vouchers-${batch.batchNumber}-${spec.key}.pdf`);
      // touch pdf to avoid unused-var lint
      void pdf;

      setIsPrinting(false);
      onOpenChange(false);
      onPrintComplete(selectedCardIds);
      setSelectedBundles(new Set());
    } catch (err) {
      console.error("PDF generation failed:", err);
      setIsPrinting(false);
    }
  }, [selectedCards, selectedCardIds, batch, onOpenChange, onPrintComplete, paperSpec]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92dvh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 px-4 pt-3 pb-2 border-b border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <Printer className="h-4 w-4 text-primary shrink-0" />
            <p className="text-sm font-bold text-foreground">Print Voucher Cards</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Vouchers print at exactly 1.25" × 2.25" with no cropping. Extra cards spill onto additional pages automatically.
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain min-h-0">
          <div className="px-4 py-3 space-y-3">
            {/* Paper Size Selector */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <FileText className="h-3 w-3" /> Paper Size
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {PAPER_SPECS.map((spec) => {
                  const active = paperKey === spec.key;
                  return (
                    <button
                      key={spec.key}
                      type="button"
                      onClick={() => setPaperKey(spec.key)}
                      className={`p-2.5 rounded-lg border-2 text-left touch-manipulation active:scale-[0.98] transition-all ${
                        active
                          ? "border-primary bg-primary/5"
                          : "border-border/40 bg-card"
                      }`}
                    >
                      <p className="text-xs font-bold uppercase">{spec.key === "a4" ? "A4" : spec.key === "a3" ? "A3" : spec.key.charAt(0).toUpperCase() + spec.key.slice(1)}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        {spec.cols} × {spec.rows} = {spec.perPage}/page
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Page count summary */}
            {selectedCards.length > 0 && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">
                    {selectedCards.length} voucher{selectedCards.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {totalPages} page{totalPages !== 1 ? "s" : ""} · {paperSpec.perPage}/page
                  </p>
                </div>
                <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] h-5">
                  {paperKey.toUpperCase()}
                </Badge>
              </div>
            )}

            {/* Select All */}
            <button
              onClick={selectAll}
              className={`w-full flex items-center gap-2.5 p-3 rounded-xl border-2 touch-manipulation active:scale-[0.98] transition-all ${
                allSelected ? "border-primary bg-primary/5" : "border-border/40 bg-card"
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

        {/* Sticky Footer */}
        <div className="shrink-0 px-4 py-3 border-t border-border/30 bg-card/95 backdrop-blur-sm pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <Button
            onClick={handlePrint}
            disabled={selectedCardIds.length === 0 || isPrinting}
            className="w-full h-12 rounded-xl text-sm font-bold touch-manipulation active:scale-[0.97]"
          >
            {isPrinting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download {selectedCardIds.length} Voucher{selectedCardIds.length !== 1 ? "s" : ""} · {totalPages} pg
              </>
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
