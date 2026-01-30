import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Sparkles, Coins, X } from "lucide-react";
import { rechargeVouchers, RechargeVoucher, SelectedVoucher, calculateVoucherTotals } from "@/data/rechargeVouchersData";

interface VoucherDenominationSelectorProps {
  selectedVouchers: SelectedVoucher[];
  onSelectionChange: (vouchers: SelectedVoucher[]) => void;
}

export function VoucherDenominationSelector({
  selectedVouchers,
  onSelectionChange,
}: VoucherDenominationSelectorProps) {
  const activeVouchers = rechargeVouchers.filter((v) => v.isActive);

  const isVoucherSelected = (voucherId: string) => {
    return selectedVouchers.some((sv) => sv.voucher.id === voucherId);
  };

  const getVoucherQuantity = (voucherId: string) => {
    const found = selectedVouchers.find((sv) => sv.voucher.id === voucherId);
    return found?.quantity || 0;
  };

  // NOTE: keep these handlers resilient on mobile: stop propagation so the parent
  // scroll container doesn't "helpfully" jump/focus to the top.
  const handleToggleVoucher = (voucher: RechargeVoucher, checked: boolean, event: React.SyntheticEvent) => {
    // Prevent scroll jump by stopping propagation
    event.stopPropagation();
    
    if (checked) {
      onSelectionChange([...selectedVouchers, { voucher, quantity: 1 }]);
    } else {
      onSelectionChange(selectedVouchers.filter((sv) => sv.voucher.id !== voucher.id));
    }
  };

  const handleQuantityChange = (voucherId: string, delta: number, event: React.SyntheticEvent) => {
    event.stopPropagation();
    // Prevent browser from shifting scroll when buttons receive focus
    // (common in mobile drawers).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event as any).preventDefault?.();
    
    onSelectionChange(
      selectedVouchers.map((sv) => {
        if (sv.voucher.id === voucherId) {
          const newQty = Math.max(1, sv.quantity + delta);
          return { ...sv, quantity: newQty };
        }
        return sv;
      })
    );
  };

  const handleClearAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelectionChange([]);
  };

  const totals = calculateVoucherTotals(selectedVouchers);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">
          Select Voucher Denominations
        </h4>
        {selectedVouchers.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Voucher list - no nested ScrollArea */}
      <div className="space-y-2">
        {activeVouchers.map((voucher) => {
          const isSelected = isVoucherSelected(voucher.id);
          const quantity = getVoucherQuantity(voucher.id);

          return (
            <Card
              key={voucher.id}
              className={`p-3 transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={voucher.id}
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    // Direct handler without event
                    if (checked) {
                      onSelectionChange([...selectedVouchers, { voucher, quantity: 1 }]);
                    } else {
                      onSelectionChange(selectedVouchers.filter((sv) => sv.voucher.id !== voucher.id));
                    }
                  }}
                  onPointerDown={(e) => {
                    // Prevent focus/scroll adjustments within the parent scroll container
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />

                <label
                  htmlFor={voucher.id}
                  className="flex-1 cursor-pointer"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {voucher.mobiValue.toLocaleString()} Mobi
                    </span>
                    {voucher.isPopular && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      >
                        <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ₦{voucher.ngnPrice.toLocaleString()} / (US${voucher.usdPrice})
                  </p>
                </label>

                {isSelected && (
                  <div className="flex items-center gap-1 animate-fade-in">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 touch-manipulation"
                      onClick={(e) => handleQuantityChange(voucher.id, -1, e)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 touch-manipulation"
                      onClick={(e) => handleQuantityChange(voucher.id, 1, e)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Running Totals */}
      {selectedVouchers.length > 0 && (
        <Card className="p-3 bg-muted/50 border-dashed animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Coins className="h-4 w-4" />
                Selected
              </span>
              <Badge variant="secondary" className="font-medium">
                {totals.totalVouchers} voucher{totals.totalVouchers !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Total Amount</span>
              <div className="text-right">
                <p className="font-bold text-lg">₦{totals.totalNgn.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">(US${totals.totalUsd})</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-muted-foreground text-sm">Mobi Credit</span>
              <span className="font-semibold text-primary">
                {totals.totalMobi.toLocaleString()} Mobi
              </span>
            </div>
          </div>
        </Card>
      )}

      {selectedVouchers.length === 0 && (
        <p className="text-center text-xs text-muted-foreground py-2">
          Select one or more voucher denominations to continue
        </p>
      )}
    </div>
  );
}
