import { AlertTriangle, Users, FileText, Vote, Wallet, Scale, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PendingAction } from "@/data/adminDashboardData";

const getIconForType = (type: PendingAction['type']) => {
  switch (type) {
    case 'membership':
      return Users;
    case 'content':
      return FileText;
    case 'clearance':
      return Vote;
    case 'finance':
      return Wallet;
    case 'conflict':
      return Scale;
    default:
      return AlertTriangle;
  }
};

interface PendingItemProps {
  action: PendingAction;
  onClick: () => void;
}

const PendingItem = ({ action, onClick }: PendingItemProps) => {
  const Icon = getIconForType(action.type);
  
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
    >
      <div className={`p-2 rounded-lg ${action.urgent ? 'bg-amber-500/20' : 'bg-muted'}`}>
        <Icon className={`h-4 w-4 ${action.urgent ? 'text-amber-600' : 'text-muted-foreground'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{action.title}</span>
          <Badge 
            variant={action.urgent ? "destructive" : "secondary"} 
            className="text-[10px] px-1.5 py-0 shrink-0"
          >
            {action.count}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">{action.description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );
};

interface AdminPendingActionsCardProps {
  actions: PendingAction[];
  onActionClick: (action: PendingAction) => void;
}

export function AdminPendingActionsCard({ actions, onActionClick }: AdminPendingActionsCardProps) {
  const totalPending = actions.reduce((sum, action) => sum + action.count, 0);
  const urgentCount = actions.filter(a => a.urgent).length;

  if (totalPending === 0) {
    return null;
  }

  return (
    <Card className="border-amber-500/50 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <span>Needs Your Attention</span>
          {urgentCount > 0 && (
            <Badge variant="destructive" className="ml-auto text-[10px]">
              {urgentCount} Urgent
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-y divide-border/50">
          {actions.filter(a => a.count > 0).map((action) => (
            <PendingItem
              key={action.id}
              action={action}
              onClick={() => onActionClick(action)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
