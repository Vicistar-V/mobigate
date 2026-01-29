import { Users, Wallet, Vote, FileText, Crown, Settings, Gamepad2, Store, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    className="h-auto py-3 px-2 flex flex-col items-center gap-2 relative"
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
    <span className="text-sm font-medium text-center leading-tight">{label}</span>
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

  const handleQuizGames = () => {
    toast({
      title: "Quiz Games",
      description: "Opening Quiz Games management...",
    });
  };

  const handleMobiStore = () => {
    toast({
      title: "Mobi-Store",
      description: "Opening Mobi-Store management...",
    });
  };

  const handleOthersOption = (option: string) => {
    toast({
      title: option,
      description: `Opening ${option}...`,
    });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-muted-foreground">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-2">
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

      {/* Quick Links Row */}
      <div className="flex items-center justify-center gap-1 pt-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs font-medium text-primary hover:text-primary"
          onClick={handleQuizGames}
        >
          <Gamepad2 className="h-3.5 w-3.5 mr-1.5" />
          Quiz Games
        </Button>
        <span className="text-muted-foreground/50">|</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs font-medium text-primary hover:text-primary"
          onClick={handleMobiStore}
        >
          <Store className="h-3.5 w-3.5 mr-1.5" />
          Mobi-Store
        </Button>
        <span className="text-muted-foreground/50">|</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs font-medium text-primary hover:text-primary"
            >
              <MoreHorizontal className="h-3.5 w-3.5 mr-1.5" />
              Others
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => handleOthersOption("Community Forum")}>
              Community Forum
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOthersOption("Help Center")}>
              Help Center
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOthersOption("FAQs")}>
              FAQs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
