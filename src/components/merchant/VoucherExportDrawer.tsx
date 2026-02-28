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
import { Printer, Package, CheckSquare } from "lucide-react";
import { VoucherBatch } from "@/data/merchantVoucherData";
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";

interface VoucherExportDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: VoucherBatch;
  onExportComplete: (cardIds: string[]) => void;
}

export function VoucherExportDrawer({ open, onOpenChange, batch, onExportComplete }: VoucherExportDrawerProps) {
  const [selectedBundles, setSelectedBundles] = useState<Set<string>>(new Set());
  const [showFormatSheet, setShowFormatSheet] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownload = async (_format: DownloadFormat) => {
    setIsDownloading(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsDownloading(false);
    setShowFormatSheet(false);
    onOpenChange(false);
    onExportComplete(selectedCardIds);
    setSelectedBundles(new Set());
  };

  return (
    <>
      <Drawer open={open && !showFormatSheet} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="pb-2 border-b">
            <DrawerTitle className="flex items-center gap-2 text-base">
              <Printer className="h-5 w-5 text-primary" />
              Export Voucher Cards
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              Select bundles to export. Only available cards will be included.
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="flex-1 overflow-y-auto touch-auto">
            <div className="p-4 space-y-3">
              {/* Select All */}
              <button
                onClick={selectAll}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5 touch-manipulation active:scale-[0.98]"
              >
                <CheckSquare className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-foreground">
                    {allSelected ? "Deselect All" : "Select All Available"}
                  </p>
                  <p className="text-xs text-muted-foreground">{totalAvailable} cards across {bundlesWithAvailable.length} bundles</p>
                </div>
              </button>

              {/* Bundle list */}
              <div className="space-y-2">
                {bundlesWithAvailable.map(bundle => (
                  <button
                    key={bundle.id}
                    onClick={() => toggleBundle(bundle.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card touch-manipulation active:scale-[0.98]"
                  >
                    <Checkbox
                      checked={selectedBundles.has(bundle.id)}
                      onCheckedChange={() => toggleBundle(bundle.id)}
                      className="pointer-events-none"
                    />
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{bundle.serialPrefix}</p>
                      <p className="text-[10px] text-muted-foreground">{bundle.availableCount} available cards</p>
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-600 text-[10px]">{bundle.availableCount}</Badge>
                  </button>
                ))}
              </div>

              {bundlesWithAvailable.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No available cards to export</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t bg-background sticky bottom-0">
            <Button
              onClick={() => setShowFormatSheet(true)}
              disabled={selectedCardIds.length === 0}
              className="w-full h-12 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]"
              size="lg"
            >
              <Printer className="h-4 w-4 mr-2" />
              Continue to Download ({selectedCardIds.length} cards)
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <DownloadFormatSheet
        open={showFormatSheet}
        onOpenChange={setShowFormatSheet}
        onDownload={handleDownload}
        title="Export Voucher Cards"
        documentName={`${batch.batchNumber} — ${selectedCardIds.length} cards`}
        availableFormats={["pdf", "csv"]}
        isDownloading={isDownloading}
      />
    </>
  );
}
