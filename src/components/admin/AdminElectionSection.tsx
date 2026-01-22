import { Vote, Users, CheckCircle, Clock, Trophy, FileText, Settings, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdminStats, ElectionActivity, formatRelativeTime } from "@/data/adminDashboardData";

interface ElectionActivityItemProps {
  activity: ElectionActivity;
}

const ElectionActivityItem = ({ activity }: ElectionActivityItemProps) => (
  <div className="flex items-start gap-2 py-2">
    <div className="p-1.5 rounded-lg bg-green-500/10 shrink-0">
      <Vote className="h-3.5 w-3.5 text-green-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-xs truncate">{activity.action}</p>
      {activity.candidate && (
        <p className="text-[10px] text-muted-foreground truncate">
          {activity.candidate}
          {activity.position && ` • ${activity.position}`}
        </p>
      )}
    </div>
    <span className="text-[10px] text-muted-foreground shrink-0">
      {formatRelativeTime(activity.timestamp)}
    </span>
  </div>
);

interface StatBadgeProps {
  value: number;
  label: string;
  icon: React.ElementType;
}

const StatBadge = ({ value, label, icon: Icon }: StatBadgeProps) => (
  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 min-w-0">
    <Icon className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
    <span className="text-base sm:text-lg font-bold">{value}</span>
    <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{label}</span>
  </div>
);

interface AdminElectionSectionProps {
  stats: AdminStats;
  electionActivities: ElectionActivity[];
  onViewCampaigns: () => void;
  onViewResults: () => void;
  onManageAccreditation: () => void;
  onProcessClearances: () => void;
  onConfigureVoting: () => void;
  onAnnounceWinners: () => void;
}

export function AdminElectionSection({
  stats,
  electionActivities,
  onViewCampaigns,
  onViewResults,
  onManageAccreditation,
  onProcessClearances,
  onConfigureVoting,
  onAnnounceWinners,
}: AdminElectionSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="election" className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-3 hover:no-underline">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10 shrink-0">
              <Vote className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">Elections</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {stats.activeElections} active • {stats.accreditedVoters} accredited
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="space-y-3 w-full overflow-hidden">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-1.5 w-full">
              <StatBadge value={stats.activeElections} label="Active" icon={Vote} />
              <StatBadge value={stats.accreditedVoters} label="Accredited" icon={Users} />
              <StatBadge value={stats.clearedCandidates} label="Cleared" icon={CheckCircle} />
              <StatBadge value={3} label="Pending" icon={Clock} />
            </div>

            {/* Current Election Management */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-1.5 pt-2.5 px-2.5">
                <CardTitle className="text-xs">Manage Election</CardTitle>
              </CardHeader>
              <CardContent className="px-2.5 pb-2.5 pt-0">
                <div className="grid grid-cols-2 gap-1.5">
                  <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onViewCampaigns}>
                    <FileText className="h-3 w-3 mr-1" />
                    Campaigns
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onViewResults}>
                    <Trophy className="h-3 w-3 mr-1" />
                    Results
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onManageAccreditation}>
                    <Users className="h-3 w-3 mr-1" />
                    Accreditation
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onProcessClearances}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Clearances
                    <Badge variant="destructive" className="ml-1 text-[8px] px-1">3</Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Election Settings */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-1.5 pt-2.5 px-2.5">
                <CardTitle className="text-xs">Settings</CardTitle>
              </CardHeader>
              <CardContent className="px-2.5 pb-2.5 pt-0">
                <div className="grid grid-cols-2 gap-1.5">
                  <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onConfigureVoting}>
                    <Settings className="h-3 w-3 mr-1" />
                    Voting Rules
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onAnnounceWinners}>
                    <Trophy className="h-3 w-3 mr-1" />
                    Announce
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Election Activity */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-1.5 pt-2.5 px-2.5">
                <CardTitle className="text-xs flex items-center justify-between">
                  Recent Activity
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2">
                    View All
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2.5 pb-2.5 pt-0">
                <div className="divide-y divide-border">
                  {electionActivities.slice(0, 3).map((activity) => (
                    <ElectionActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
