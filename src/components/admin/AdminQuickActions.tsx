import { Users, Wallet, Vote, FileText, Crown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  badge?: number;
}

const QuickActionButton = ({ icon: Icon, label, onClick, badge }: QuickActionButtonProps) => (
  <Button
    variant="outline"
    className="h-auto py-2.5 px-2 flex flex-col items-center gap-1.5 relative min-w-0"
    onClick={onClick}
  >
    <div className="relative">
      <Icon className="h-5 w-5 text-primary" />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
    <span className="text-xs font-medium text-center leading-tight truncate w-full">{label}</span>
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
  const { toast } = useToast();

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-muted-foreground">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-1.5">
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
