import { Shield, Users, BookOpen, UserPlus, CreditCard, FileText, Store, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMobi } from "@/lib/mobiCurrencyTranslation";

// Mock user eligibility data — in production, pulled from the system
const MOCK_ELIGIBILITY = {
  verifiedDays: 245,
  requiredVerifiedDays: 180,
  invitedFriends: 1342,
  requiredInvitedFriends: 1000,
  friends: 5800,
  requiredFriends: 5000,
  followers: 6200,
  requiredFollowers: 5000,
  eLibraryContents: 112,
  requiredELibraryContents: 100,
  contentLikesMin: 5400,
  requiredContentLikes: 5000,
  usersFollowed: 580,
  requiredUsersFollowed: 500,
};

export interface EligibilityItem {
  icon: React.ElementType;
  label: string;
  description: string;
  met: boolean;
  current: string;
  required: string;
}

export function getEligibilityItems(): EligibilityItem[] {
  const e = MOCK_ELIGIBILITY;
  return [
    {
      icon: Shield,
      label: "Verified User Duration",
      description: `Must be verified for minimum ${e.requiredVerifiedDays} days`,
      met: e.verifiedDays >= e.requiredVerifiedDays,
      current: `${e.verifiedDays} days`,
      required: `${e.requiredVerifiedDays} days`,
    },
    {
      icon: CreditCard,
      label: "Registration Fee",
      description: `One-time, non-refundable fee in local currency equivalent of ${formatMobi(1000000)}`,
      met: true, // Will be paid on submission
      current: "Payable",
      required: formatMobi(1000000),
    },
    {
      icon: CreditCard,
      label: "Initial Merchant Vouchers Subscription Deposit",
      description: `IMVSD: min deposit in local/default currency equivalent of ${formatMobi(1000000)}. Used for initial 12 Voucher allocations.`,
      met: true,
      current: "Payable",
      required: formatMobi(1000000),
    },
    {
      icon: FileText,
      label: "IMVSD Coverage",
      description: "IMVSD must equal or exceed total value of initial Mandatory Voucher Packs (100-Voucher-Units Pack × 12 Denominations)",
      met: true,
      current: "Covered",
      required: "100 × 12 packs",
    },
    {
      icon: Users,
      label: "Invited Friends",
      description: `Must have invited at least ${e.requiredInvitedFriends.toLocaleString()} active friends to Mobigate`,
      met: e.invitedFriends >= e.requiredInvitedFriends,
      current: e.invitedFriends.toLocaleString(),
      required: e.requiredInvitedFriends.toLocaleString(),
    },
    {
      icon: Users,
      label: "Friends & Followers",
      description: `Must have at least ${e.requiredFriends.toLocaleString()} friends and ${e.requiredFollowers.toLocaleString()} followers`,
      met: e.friends >= e.requiredFriends && e.followers >= e.requiredFollowers,
      current: `${e.friends.toLocaleString()} / ${e.followers.toLocaleString()}`,
      required: `${e.requiredFriends.toLocaleString()} / ${e.requiredFollowers.toLocaleString()}`,
    },
    {
      icon: BookOpen,
      label: "E-Library Contents",
      description: `Must have at least ${e.requiredELibraryContents} contents, each with ${e.requiredContentLikes.toLocaleString()}+ likes`,
      met: e.eLibraryContents >= e.requiredELibraryContents && e.contentLikesMin >= e.requiredContentLikes,
      current: `${e.eLibraryContents} contents (min ${e.contentLikesMin.toLocaleString()} likes)`,
      required: `${e.requiredELibraryContents} contents (${e.requiredContentLikes.toLocaleString()} likes each)`,
    },
    {
      icon: UserPlus,
      label: "Users Followed",
      description: `Must have followed at least ${e.requiredUsersFollowed} users or content creators`,
      met: e.usersFollowed >= e.requiredUsersFollowed,
      current: e.usersFollowed.toLocaleString(),
      required: e.requiredUsersFollowed.toLocaleString(),
    },
  ];
}

interface MerchantEligibilityCardProps {
  className?: string;
}

export function MerchantEligibilityCard({ className }: MerchantEligibilityCardProps) {
  const items = getEligibilityItems();
  const metCount = items.filter(i => i.met).length;
  const allMet = metCount === items.length;

  return (
    <div className={className}>
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {allMet ? (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px] gap-1">
              <CheckCircle2 className="h-3 w-3" /> All Requirements Met
            </Badge>
          ) : (
            <Badge variant="outline" className="border-amber-400/60 text-amber-700 dark:text-amber-400 text-[10px] gap-1">
              <Clock className="h-3 w-3" /> {metCount}/{items.length} Met
            </Badge>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">Auto-verified by system</p>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs ${
              item.met
                ? "bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200/50 dark:border-emerald-800/30"
                : "bg-destructive/5 border-destructive/20"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.met ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <item.icon className="h-3 w-3 text-muted-foreground shrink-0" />
                <p className="font-semibold text-[11px] truncate">{item.label}</p>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{item.description}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px]">
                  <span className="text-muted-foreground">You: </span>
                  <span className={`font-semibold ${item.met ? "text-emerald-700 dark:text-emerald-400" : "text-destructive"}`}>
                    {item.current}
                  </span>
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Req: <span className="font-medium">{item.required}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div className="mt-3 p-2.5 rounded-lg bg-muted/40 border border-border/50">
        <div className="flex items-start gap-2">
          <Store className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <div className="text-[10px] text-muted-foreground leading-relaxed space-y-1">
            <p>Only Mobi-Merchants can transact directly with the Mobigate central system.</p>
            <p>Purchased Vouchers can be credited to wallet, sent as e-PIN, or gifted to other users.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
