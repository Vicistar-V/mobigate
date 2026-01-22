import { Users, Wallet, Vote, FileText, Crown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  badge?: number;
}

const QuickActionButton = ({ icon: Icon, label, onClick, badge }: QuickActionButtonProps) => (
  <Button
    variant="outline"
    className="h-auto py-3 px-3 flex flex-col items-center gap-2 relative w-full min-w-0"
    onClick={onClick}
  >
    <div className="relative">
      <Icon className="h-6 w-6 text-primary" />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1.5 -right-2.5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
    <span className="text-sm font-medium text-center break-words w-full leading-tight">{label}</span>
  </Button>
);

interface AdminQuickActionsProps {
  onManageMembers: () => void;
  onViewFinances: () => void;
  onManageElections: () => void;
  onManageContent: () => void;
  onManageLeadership: () => void;
  onCommunitySettings: () => void;
  pendingMembers?: number;
  pendingContent?: number;
}

export function AdminQuickActions({
  onManageMembers,
  onViewFinances,
  onManageElections,
  onManageContent,
  onManageLeadership,
  onCommunitySettings,
  pendingMembers,
  pendingContent,
}: AdminQuickActionsProps) {
  return (
    <div className="space-y-3 w-full overflow-hidden">
      <h2 className="text-base font-semibold text-muted-foreground">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 w-full">
        <QuickActionButton
          icon={Users}
          label="Members"
          onClick={onManageMembers}
          badge={pendingMembers}
        />
        <QuickActionButton
          icon={Wallet}
          label="Finances"
          onClick={onViewFinances}
        />
        <QuickActionButton
          icon={Vote}
          label="Elections"
          onClick={onManageElections}
        />
        <QuickActionButton
          icon={FileText}
          label="Content"
          onClick={onManageContent}
          badge={pendingContent}
        />
        <QuickActionButton
          icon={Crown}
          label="Leadership"
          onClick={onManageLeadership}
        />
        <QuickActionButton
          icon={Settings}
          label="Settings"
          onClick={onCommunitySettings}
        />
      </div>
    </div>
  );
}