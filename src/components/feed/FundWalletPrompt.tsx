// FundWalletPrompt — reusable "insufficient funds" dialog
// -------------------------------------------------------
// Shown instantly whenever a user tries to use a charged sundry tool (Like,
// Comment, Share, Follow, Gift, Report) but has zero / insufficient Mobi in
// their wallet. Presents the same funding options used across the app, with a
// prominent "Fund Wallet Now" primary action (Retail Merchant voucher route)
// plus alternative funding methods. After funding the user is returned here.

import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Ticket,
  Building2,
  CreditCard,
  ArrowRight,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
    // Remember where to return after funding completes.
    const returnTo = `${location.pathname}${location.search}`;
    const sep = path.includes("?") ? "&" : "?";
    onOpenChange(false);
    navigate(`${path}${sep}returnTo=${encodeURIComponent(returnTo)}`);
  };

  const primaryFundPath = "/buy-vouchers?source=fund-wallet&type=retail";

  const altFundMethods = [
    {
      id: "bank",
      label: "Online Banking Transfer",
      subtitle: "Direct bank transfer to your wallet",
      icon: Building2,
      accentBg: "bg-indigo-500/10",
      accentText: "text-indigo-600",
      path: "/wallet?action=fund&method=bank",
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      subtitle: "Visa, Mastercard, Verve",
      icon: CreditCard,
      accentBg: "bg-blue-500/10",
      accentText: "text-blue-600",
      path: "/wallet?action=fund&method=card",
    },
  ];

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

        {/* Primary — Fund Wallet Now */}
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
                Instant top-up via Retail Merchant voucher
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary-foreground shrink-0" />
          </button>

          {altFundMethods.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => goFund(m.path)}
                className="w-full flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 active:bg-primary/10"
              >
                <span
                  className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                    m.accentBg,
                  )}
                >
                  <Icon className={cn("h-4 w-4", m.accentText)} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{m.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{m.subtitle}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            );
          })}

          <p className="text-[10px] text-muted-foreground text-center pt-1">
            You'll return right here after funding your wallet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
