import { Clock, Users, FileText, Vote, Wallet, Settings, Crown, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminActivity, formatRelativeTime } from "@/data/adminDashboardData";

const getIconForType = (type: AdminActivity['type']) => {
  switch (type) {
    case 'membership':
      return Users;
    case 'content':
      return FileText;
    case 'election':
      return Vote;
    case 'finance':
      return Wallet;
    case 'settings':
      return Settings;
    case 'leadership':
      return Crown;
    case 'meeting':
      return Calendar;
    default:
      return Clock;
  }
};

const getColorForType = (type: AdminActivity['type']) => {
  switch (type) {
    case 'membership':
      return 'text-blue-600 bg-blue-500/10';
    case 'content':
      return 'text-purple-600 bg-purple-500/10';
    case 'election':
      return 'text-green-600 bg-green-500/10';
    case 'finance':
      return 'text-amber-600 bg-amber-500/10';
    case 'settings':
      return 'text-gray-600 bg-gray-500/10';
    case 'leadership':
      return 'text-indigo-600 bg-indigo-500/10';
    case 'meeting':
      return 'text-teal-600 bg-teal-500/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

interface ActivityItemProps {
  activity: AdminActivity;
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const Icon = getIconForType(activity.type);
  const colorClass = getColorForType(activity.type);
  
  return (
    <div className="flex items-start gap-2.5 py-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={activity.adminAvatar} alt={activity.adminName} />
        <AvatarFallback className="text-xs">
          {activity.adminName.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="text-sm leading-relaxed">
          <span className="font-medium">{activity.adminName}</span>
          <span className="text-muted-foreground"> {activity.action} </span>
          <span className="font-medium break-words">{activity.target}</span>
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className={`p-1 rounded shrink-0 ${colorClass}`}>
            <Icon className="h-3 w-3" />
          </div>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

interface AdminActivityLogProps {
  activities: AdminActivity[];
  maxHeight?: string;
}

export function AdminActivityLog({ activities, maxHeight = "300px" }: AdminActivityLogProps) {
  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">Recent Admin Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          className="overflow-y-auto touch-auto overscroll-contain" 
          style={{ maxHeight }}
        >
          <div className="divide-y divide-border">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
