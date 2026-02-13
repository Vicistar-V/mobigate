import { ReactNode } from "react";
import { Shield, Users, Wallet, Vote, FileText, Crown, Settings, Lock, LucideIcon } from "lucide-react";
import { AuthorizationModule } from "@/types/adminAuthorization";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ActionConfig {
  title: string;
  description: string;
  icon: ReactNode;
  iconComponent: LucideIcon;
  iconColorClass: string;
}

// Map of icon colors by module for consistency
const MODULE_ICON_COLORS: Record<AuthorizationModule, string> = {
  members: "text-blue-600",
  finances: "text-amber-600",
  elections: "text-green-600",
  content: "text-purple-600",
  leadership: "text-indigo-600",
  settings: "text-gray-600",
};

// Pre-configured action templates for common administrative actions
export const MODULE_ACTION_CONFIGS: Record<AuthorizationModule, Record<string, ActionConfig>> = {
  members: {
    approve_member: {
      title: "Approve Member Request",
      description: "Multi-signature authorization to approve new membership",
      icon: <Users className="h-5 w-5 text-blue-600" />,
      iconComponent: Users,
      iconColorClass: "text-blue-600",
    },
    reject_member: {
      title: "Reject Member Request",
      description: "Multi-signature authorization to reject membership application",
      icon: <Users className="h-5 w-5 text-red-600" />,
      iconComponent: Users,
      iconColorClass: "text-red-600",
    },
    remove_member: {
      title: "Remove Member",
      description: "Multi-signature authorization to remove existing member",
      icon: <Users className="h-5 w-5 text-red-600" />,
      iconComponent: Users,
      iconColorClass: "text-red-600",
    },
    block_member: {
      title: "Block User",
      description: "Multi-signature authorization to block a user",
      icon: <Shield className="h-5 w-5 text-red-600" />,
      iconComponent: Shield,
      iconColorClass: "text-red-600",
    },
    unblock_member: {
      title: "Unblock User",
      description: "Multi-signature authorization to unblock a user",
      icon: <Shield className="h-5 w-5 text-green-600" />,
      iconComponent: Shield,
      iconColorClass: "text-green-600",
    },
  },
  finances: {
    transfer: {
      title: "Transfer Authorization",
      description: "Multi-signature authorization for fund transfer",
      icon: <Wallet className="h-5 w-5 text-amber-600" />,
      iconComponent: Wallet,
      iconColorClass: "text-amber-600",
    },
    withdrawal: {
      title: "Withdrawal Authorization",
      description: "Multi-signature authorization for fund withdrawal",
      icon: <Wallet className="h-5 w-5 text-amber-600" />,
      iconComponent: Wallet,
      iconColorClass: "text-amber-600",
    },
    disbursement: {
      title: "Disbursement Authorization",
      description: "Multi-signature authorization for fund disbursement",
      icon: <Wallet className="h-5 w-5 text-amber-600" />,
      iconComponent: Wallet,
      iconColorClass: "text-amber-600",
    },
    budget_approval: {
      title: "Budget Approval",
      description: "Multi-signature authorization to approve budget",
      icon: <Wallet className="h-5 w-5 text-green-600" />,
      iconComponent: Wallet,
      iconColorClass: "text-green-600",
    },
    income: {
      title: "Income Authorization",
      description: "Multi-signature authorization for income record",
      icon: <Wallet className="h-5 w-5 text-green-600" />,
      iconComponent: Wallet,
      iconColorClass: "text-green-600",
    },
    expense: {
      title: "Expense Authorization",
      description: "Multi-signature authorization for expense approval",
      icon: <Wallet className="h-5 w-5 text-red-600" />,
      iconComponent: Wallet,
      iconColorClass: "text-red-600",
    },
  },
  elections: {
    announce_results: {
      title: "Announce Election Results",
      description: "Multi-signature authorization to publish election results",
      icon: <Vote className="h-5 w-5 text-green-600" />,
      iconComponent: Vote,
      iconColorClass: "text-green-600",
    },
    clear_candidate: {
      title: "Clear Candidate",
      description: "Multi-signature authorization to clear election candidate",
      icon: <Vote className="h-5 w-5 text-blue-600" />,
      iconComponent: Vote,
      iconColorClass: "text-blue-600",
    },
    disqualify_candidate: {
      title: "Disqualify Candidate",
      description: "Multi-signature authorization to disqualify candidate",
      icon: <Vote className="h-5 w-5 text-red-600" />,
      iconComponent: Vote,
      iconColorClass: "text-red-600",
    },
    start_voting: {
      title: "Start Voting Session",
      description: "Multi-signature authorization to open voting",
      icon: <Vote className="h-5 w-5 text-primary" />,
      iconComponent: Vote,
      iconColorClass: "text-primary",
    },
    end_voting: {
      title: "End Voting Session",
      description: "Multi-signature authorization to close voting",
      icon: <Vote className="h-5 w-5 text-amber-600" />,
      iconComponent: Vote,
      iconColorClass: "text-amber-600",
    },
    accredit_voters: {
      title: "Accredit Voters",
      description: "Multi-signature authorization to grant voting accreditation",
      icon: <Vote className="h-5 w-5 text-green-600" />,
      iconComponent: Vote,
      iconColorClass: "text-green-600",
    },
    revoke_accreditation: {
      title: "Revoke Accreditation",
      description: "Multi-signature authorization to revoke voting accreditation",
      icon: <Vote className="h-5 w-5 text-red-600" />,
      iconComponent: Vote,
      iconColorClass: "text-red-600",
    },
    update_election_setting: {
      title: "Update Election Setting",
      description: "Multi-signature authorization to modify election rules",
      icon: <Settings className="h-5 w-5 text-green-600" />,
      iconComponent: Settings,
      iconColorClass: "text-green-600",
    },
  },
  content: {
    publish_news: {
      title: "Publish News",
      description: "Multi-signature authorization to publish news",
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      iconComponent: FileText,
      iconColorClass: "text-purple-600",
    },
    publish_event: {
      title: "Publish Event",
      description: "Multi-signature authorization to publish event",
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      iconComponent: FileText,
      iconColorClass: "text-purple-600",
    },
    publish_announcement: {
      title: "Publish Announcement",
      description: "Multi-signature authorization for public announcement",
      icon: <FileText className="h-5 w-5 text-primary" />,
      iconComponent: FileText,
      iconColorClass: "text-primary",
    },
    remove_content: {
      title: "Remove Content",
      description: "Multi-signature authorization to remove published content",
      icon: <FileText className="h-5 w-5 text-red-600" />,
      iconComponent: FileText,
      iconColorClass: "text-red-600",
    },
    publish: {
      title: "Publish Content",
      description: "Multi-signature authorization to publish content",
      icon: <FileText className="h-5 w-5 text-green-600" />,
      iconComponent: FileText,
      iconColorClass: "text-green-600",
    },
    remove: {
      title: "Remove Content",
      description: "Multi-signature authorization to remove content",
      icon: <FileText className="h-5 w-5 text-red-600" />,
      iconComponent: FileText,
      iconColorClass: "text-red-600",
    },
  },
  leadership: {
    apply_results: {
      title: "Apply Election Results",
      description: "Multi-signature authorization to update leadership from election",
      icon: <Crown className="h-5 w-5 text-indigo-600" />,
      iconComponent: Crown,
      iconColorClass: "text-indigo-600",
    },
    apply_single_result: {
      title: "Apply Election Result",
      description: "Multi-signature authorization to update single leadership position",
      icon: <Crown className="h-5 w-5 text-indigo-600" />,
      iconComponent: Crown,
      iconColorClass: "text-indigo-600",
    },
    apply_batch_results: {
      title: "Apply Multiple Results",
      description: "Multi-signature authorization to update multiple leadership positions",
      icon: <Crown className="h-5 w-5 text-green-600" />,
      iconComponent: Crown,
      iconColorClass: "text-green-600",
    },
    add_executive: {
      title: "Add Executive Member",
      description: "Multi-signature authorization to add executive",
      icon: <Crown className="h-5 w-5 text-green-600" />,
      iconComponent: Crown,
      iconColorClass: "text-green-600",
    },
    remove_executive: {
      title: "Remove Executive Member",
      description: "Multi-signature authorization to remove executive",
      icon: <Crown className="h-5 w-5 text-red-600" />,
      iconComponent: Crown,
      iconColorClass: "text-red-600",
    },
    assign_adhoc: {
      title: "Assign Ad-hoc Committee",
      description: "Multi-signature authorization for ad-hoc appointment",
      icon: <Crown className="h-5 w-5 text-blue-600" />,
      iconComponent: Crown,
      iconColorClass: "text-blue-600",
    },
  },
  settings: {
    update_constitution: {
      title: "Update Constitution",
      description: "Multi-signature authorization to modify constitution",
      icon: <Settings className="h-5 w-5 text-gray-600" />,
      iconComponent: Settings,
      iconColorClass: "text-gray-600",
    },
    change_privacy: {
      title: "Change Privacy Settings",
      description: "Multi-signature authorization for privacy changes",
      icon: <Shield className="h-5 w-5 text-gray-600" />,
      iconComponent: Shield,
      iconColorClass: "text-gray-600",
    },
    update_rules: {
      title: "Update Community Rules",
      description: "Multi-signature authorization to update rules",
      icon: <Settings className="h-5 w-5 text-gray-600" />,
      iconComponent: Settings,
      iconColorClass: "text-gray-600",
    },
    upload_constitution: {
      title: "Upload Constitution",
      description: "Multi-signature authorization to upload new constitution document",
      icon: <FileText className="h-5 w-5 text-green-600" />,
      iconComponent: FileText,
      iconColorClass: "text-green-600",
    },
    delete_constitution: {
      title: "Delete Constitution",
      description: "Multi-signature authorization to delete constitution document",
      icon: <FileText className="h-5 w-5 text-red-600" />,
      iconComponent: FileText,
      iconColorClass: "text-red-600",
    },
    deactivate_constitution: {
      title: "Deactivate Constitution",
      description: "Multi-signature authorization to deactivate constitution document",
      icon: <FileText className="h-5 w-5 text-amber-600" />,
      iconComponent: FileText,
      iconColorClass: "text-amber-600",
    },
    enable_feature: {
      title: "Enable Feature",
      description: "Multi-signature authorization to enable system feature",
      icon: <Settings className="h-5 w-5 text-green-600" />,
      iconComponent: Settings,
      iconColorClass: "text-green-600",
    },
    disable_feature: {
      title: "Disable Feature",
      description: "Multi-signature authorization to disable system feature",
      icon: <Settings className="h-5 w-5 text-red-600" />,
      iconComponent: Settings,
      iconColorClass: "text-red-600",
    },
    approve_setting: {
      title: "Approve Setting Change",
      description: "Multi-signature authorization to approve a proposed setting change",
      icon: <Settings className="h-5 w-5 text-green-600" />,
      iconComponent: Settings,
      iconColorClass: "text-green-600",
    },
    disapprove_setting: {
      title: "Disapprove Setting Change",
      description: "Multi-signature authorization to disapprove a proposed setting change",
      icon: <Settings className="h-5 w-5 text-red-600" />,
      iconComponent: Settings,
      iconColorClass: "text-red-600",
    },
  },
};

// Helper to get action config
export function getActionConfig(
  module: AuthorizationModule,
  action: string
): ActionConfig | undefined {
  return MODULE_ACTION_CONFIGS[module]?.[action];
}

// Helper to get module icon color
export function getModuleIconColor(module: AuthorizationModule): string {
  return MODULE_ICON_COLORS[module];
}

// Helper to get module background color class
export function getModuleBackgroundClass(module: AuthorizationModule): string {
  const bgMap: Record<AuthorizationModule, string> = {
    members: "bg-blue-500/10",
    finances: "bg-amber-500/10",
    elections: "bg-green-500/10",
    content: "bg-purple-500/10",
    leadership: "bg-indigo-500/10",
    settings: "bg-gray-500/10",
  };
  return bgMap[module];
}

// Standardized action details component props
export interface ActionDetailsProps {
  config: ActionConfig;
  primaryText: string;
  secondaryText: string;
  module: AuthorizationModule;
  avatar?: {
    src?: string;
    fallback: string;
  };
  additionalInfo?: {
    label: string;
    value: string;
  };
}

// Standardized action details renderer
export function renderActionDetails({
  config,
  primaryText,
  secondaryText,
  module,
  avatar,
  additionalInfo,
}: ActionDetailsProps): React.ReactNode {
  const IconComponent = config.iconComponent;
  const bgClass = getModuleBackgroundClass(module);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {avatar ? (
          <Avatar className="h-10 w-10">
            {avatar.src && <AvatarImage src={avatar.src} alt={primaryText} />}
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        ) : (
          <div className={`p-2 rounded-lg ${bgClass}`}>
            <IconComponent className={`h-5 w-5 ${config.iconColorClass}`} />
          </div>
        )}
        <div>
          <p className="font-medium text-sm line-clamp-1">{primaryText}</p>
          <p className="text-xs text-muted-foreground">{secondaryText}</p>
        </div>
      </div>
      {additionalInfo && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{additionalInfo.label}</span>
          <span className="font-bold">{additionalInfo.value}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-xs">
        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">
          Action: {config.title}
        </span>
      </div>
    </div>
  );
}
