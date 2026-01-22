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
  <div className="flex items-start gap-3 py-3">
    <div className="p-2 rounded-lg bg-green-500/10 shrink-0">
      <Vote className="h-4 w-4 text-green-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{activity.action}</p>
      {activity.candidate && (
        <p className="text-sm text-muted-foreground truncate">
          {activity.candidate}
          {activity.position && ` • ${activity.position}`}
        </p>
      )}
    </div>
    <span className="text-sm text-muted-foreground shrink-0">
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
  <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 min-w-0">
    <Icon className="h-4 w-4 text-muted-foreground mb-1" />
    <span className="text-lg font-bold">{value}</span>
    <span className="text-sm text-muted-foreground truncate">{label}</span>
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
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-green-500/10 shrink-0">
              <Vote className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="font-semibold text-base truncate">Elections</h3>
              <p className="text-sm text-muted-foreground truncate">
                {stats.activeElections} active • {stats.accreditedVoters} accredited
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4 w-full overflow-hidden">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-2 w-full">
              <StatBadge value={stats.activeElections} label="Active" icon={Vote} />
              <StatBadge value={stats.accreditedVoters} label="Accredited" icon={Users} />
              <StatBadge value={stats.clearedCandidates} label="Cleared" icon={CheckCircle} />
              <StatBadge value={3} label="Pending" icon={Clock} />
            </div>

            {/* Current Election Management */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm">Manage Election</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onViewCampaigns}>
                    <FileText className="h-4 w-4 mr-2" />
                    Campaigns
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onViewResults}>
                    <Trophy className="h-4 w-4 mr-2" />
                    Results
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onManageAccreditation}>
                    <Users className="h-4 w-4 mr-2" />
                    Accreditation
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onProcessClearances}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Clearances
                    <Badge variant="destructive" className="ml-1 text-xs px-1.5">3</Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Election Settings */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm">Settings</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onConfigureVoting}>
                    <Settings className="h-4 w-4 mr-2" />
                    Voting Rules
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onAnnounceWinners}>
                    <Trophy className="h-4 w-4 mr-2" />
                    Announce
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Election Activity */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm flex items-center justify-between">
                  Recent Activity
                  <Button variant="ghost" size="sm" className="h-8 text-sm px-2">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
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