import { 
  ArrowDownLeft, ArrowUpRight, ArrowDown, ArrowUp,
  Calendar, Hash, Tag, User, FileText, Clock,
  CheckCircle, AlertTriangle, XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { formatLocalAmount, formatMobiAmount } from "@/lib/mobiCurrencyTranslation";

// Unified transaction type that covers both main wallet and quiz wallet
export interface TransactionDetail {
  id: string;
  description: string;
  amount: number;
  date: Date;
  // Main wallet fields
  type?: "credit" | "debit";
  status?: "completed" | "pending" | "failed";
  category?: string;
  // Quiz wallet fields
  quizType?: "stake_income" | "winning_payout" | "transfer_in" | "transfer_out";
  reference?: string;
  playerName?: string;
  relatedQuizId?: string;
}

interface TransactionDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionDetail | null;
}

const quizTypeConfig: Record<string, { icon: typeof ArrowDown; color: string; bg: string; label: string }> = {
  stake_income:   { icon: ArrowDownLeft,  color: "text-green-600",  bg: "bg-green-100 dark:bg-green-900/40",  label: "Stake In" },
  winning_payout: { icon: ArrowUpRight,   color: "text-red-600",    bg: "bg-red-100 dark:bg-red-900/40",      label: "Payout" },
  transfer_in:    { icon: ArrowDown,      color: "text-blue-600",   bg: "bg-blue-100 dark:bg-blue-900/40",    label: "Transfer In" },
  transfer_out:   { icon: ArrowUp,        color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/40", label: "Transfer Out" },
};

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  completed: { icon: CheckCircle,    color: "text-green-600",  bg: "bg-green-100 dark:bg-green-900/40" },
  pending:   { icon: AlertTriangle,  color: "text-amber-600",  bg: "bg-amber-100 dark:bg-amber-900/40" },
  failed:    { icon: XCircle,        color: "text-red-600",    bg: "bg-red-100 dark:bg-red-900/40" },
};

export function TransactionDetailDrawer({ open, onOpenChange, transaction }: TransactionDetailDrawerProps) {
  if (!transaction) return null;

  const isQuizTx = !!transaction.quizType;
  const isDebit = isQuizTx
    ? (transaction.quizType === "winning_payout" || transaction.quizType === "transfer_out")
    : transaction.type === "debit";

  const typeLabel = isQuizTx
    ? quizTypeConfig[transaction.quizType!]?.label || transaction.quizType
    : transaction.type === "credit" ? "Credit" : "Debit";

  const TypeIcon = isQuizTx
    ? quizTypeConfig[transaction.quizType!]?.icon || ArrowDown
    : isDebit ? ArrowUpRight : ArrowDownLeft;

  const iconBg = isQuizTx
    ? quizTypeConfig[transaction.quizType!]?.bg || "bg-muted"
    : isDebit ? "bg-red-100 dark:bg-red-900/40" : "bg-green-100 dark:bg-green-900/40";

  const iconColor = isQuizTx
    ? quizTypeConfig[transaction.quizType!]?.color || "text-muted-foreground"
    : isDebit ? "text-red-600" : "text-green-600";

  const status = transaction.status || "completed";
  const StatusIcon = statusConfig[status]?.icon || CheckCircle;
  const statusColor = statusConfig[status]?.color || "text-muted-foreground";
  const statusBg = statusConfig[status]?.bg || "bg-muted";

  const formattedDate = new Date(transaction.date).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(transaction.date).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] p-0">
        <div className="overflow-y-auto touch-auto overscroll-contain">
          <div className="px-4 py-5 pb-8 space-y-5">
            {/* Header: Icon + Amount */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className={cn("p-3 rounded-full", iconBg)}>
                <TypeIcon className={cn("h-6 w-6", iconColor)} />
              </div>
              <div>
                <p className={cn(
                  "text-2xl font-bold",
                  isDebit ? "text-red-600" : "text-green-600"
                )}>
                  {isDebit ? "-" : "+"}₦{transaction.amount.toLocaleString()}.00
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  ({isDebit ? "-" : "+"}M{transaction.amount.toLocaleString()})
                </p>
              </div>
              <Badge 
                variant="outline" 
                className={cn("text-xs px-2 py-0.5", iconColor)}
              >
                {typeLabel}
              </Badge>
            </div>

            <Separator />

            {/* Transaction Details */}
            <div className="space-y-3">
              {/* Description */}
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-muted/50 shrink-0 mt-0.5">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm font-medium break-words">{transaction.description}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-muted/50 shrink-0 mt-0.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">{formattedDate}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-muted/50 shrink-0 mt-0.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium">{formattedTime}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start gap-3">
                <div className={cn("p-1.5 rounded-lg shrink-0 mt-0.5", statusBg)}>
                  <StatusIcon className={cn("h-4 w-4", statusColor)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium capitalize">{status}</p>
                </div>
              </div>

              {/* Category (main wallet) */}
              {transaction.category && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-muted/50 shrink-0 mt-0.5">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-medium">{transaction.category}</p>
                  </div>
                </div>
              )}

              {/* Reference (quiz wallet) */}
              {transaction.reference && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-muted/50 shrink-0 mt-0.5">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Reference</p>
                    <p className="text-sm font-medium font-mono">{transaction.reference}</p>
                  </div>
                </div>
              )}

              {/* Player Name (quiz wallet) */}
              {transaction.playerName && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-muted/50 shrink-0 mt-0.5">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Player</p>
                    <p className="text-sm font-medium">{transaction.playerName}</p>
                  </div>
                </div>
              )}

              {/* Transaction ID */}
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-muted/50 shrink-0 mt-0.5">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Transaction ID</p>
                  <p className="text-sm font-medium font-mono text-muted-foreground">{transaction.id}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Amount Summary Card */}
            <div className="p-3 rounded-lg bg-muted/30 border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Amount (₦)</span>
                <span className={cn("text-sm font-bold", isDebit ? "text-red-600" : "text-green-600")}>
                  {isDebit ? "-" : "+"}₦{transaction.amount.toLocaleString()}.00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Amount (Mobi)</span>
                <span className={cn("text-sm font-bold", isDebit ? "text-red-600" : "text-green-600")}>
                  {isDebit ? "-" : "+"}M{transaction.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
