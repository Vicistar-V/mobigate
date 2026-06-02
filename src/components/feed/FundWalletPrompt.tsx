// FundWalletPrompt — reusable "insufficient funds" dialog
// -------------------------------------------------------
// Shown instantly whenever a user tries to use a charged sundry tool (Like,
// Comment, Share, Follow, Gift, Report) but has zero / insufficient Mobi in
// their wallet.
//
// Funding goes through the SAME Retail Merchant (sub-merchant) voucher system
// used everywhere else in the app — `/buy-vouchers?source=fund-wallet`. That
// page already honours the `returnTo` query param, so once the user buys and
// redeems a voucher from a sub-merchant they are sent straight back to the
// exact page (and tab/section) they were on when they hit this prompt.

import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Ticket, Store, ArrowRight, Wallet, AlertTriangle } from "lucide-react";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";

interface FundWalletPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What the user was trying to do, e.g. "Like this post". */
  actionLabel?: string;
  /** Service charge required for the action (Mobi). */
  requiredAmount?: number;
  /** Current wallet balance (Mobi). */
  balance?: number;
}

export function FundWalletPrompt({
  open,
  onOpenChange,
  actionLabel,
  requiredAmount = 0,
  balance = 0,
}: FundWalletPromptProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const shortfall = Math.max(0, requiredAmount - balance);

  const goFund = (path: string) => {
    // Remember exactly where to return after funding completes — the
    // buy-vouchers page reads this `returnTo` and navigates back here.
    const returnTo = `${location.pathname}${location.search}`;
    const sep = path.includes("?") ? "&" : "?";
    onOpenChange(false);
    navigate(`${path}${sep}returnTo=${encodeURIComponent(returnTo)}`);
  };

  // Retail (sub-merchant) voucher funding — the platform's standard top-up flow.
  const primaryFundPath = "/buy-vouchers?source=fund-wallet&type=retail";
  // Browse the full voucher marketplace (still returns here when done).
  const browseFundPath = "/buy-vouchers?source=fund-wallet";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-4 pt-4 pb-3 text-left">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-base">Insufficient Wallet Balance</DialogTitle>
              <DialogDescription className="text-xs">
                {actionLabel
                  ? `${actionLabel} requires a service charge.`
                  : "This action requires a service charge."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Balance summary */}
        <div className="mx-4 mb-3 rounded-xl border bg-muted/40 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Wallet className="h-4 w-4" /> Your balance
            </span>
            <span className="font-semibold">{formatMobi(balance)}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-muted-foreground">Service charge</span>
            <span className="font-semibold">{formatMobi(requiredAmount)}</span>
          </div>
          <div className="flex items-center justify-between mt-1 pt-1 border-t">
            <span className="font-medium text-destructive">You need</span>
            <span className="font-bold text-destructive">{formatMobi(shortfall)} more</span>
          </div>
        </div>

        {/* Primary — Fund Wallet Now via Retail Merchant (sub-merchant) */}
        <div className="px-4 pb-4 space-y-2">
          <button
            onClick={() => goFund(primaryFundPath)}
            className="w-full flex items-center gap-3 rounded-xl border-2 border-primary bg-primary px-3 py-3 text-left transition-all hover:bg-primary/90 active:scale-[0.98] shadow-sm"
          >
            <span className="h-10 w-10 rounded-lg bg-primary-foreground/15 flex items-center justify-center shrink-0">
              <Ticket className="h-5 w-5 text-primary-foreground" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary-foreground">Fund Wallet Now</p>
              <p className="text-[11px] text-primary-foreground/80">
                Buy a voucher from a Retail Merchant — credited instantly
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary-foreground shrink-0" />
          </button>

          {/* Secondary — browse the full voucher marketplace */}
          <button
            onClick={() => goFund(browseFundPath)}
            className="w-full flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 active:bg-primary/10"
          >
            <span className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Store className="h-4 w-4 text-primary" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                Browse all Merchants
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                Compare voucher discounts before you buy
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>

          <p className="text-[10px] text-muted-foreground text-center pt-1">
            You'll return right here after funding your wallet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
