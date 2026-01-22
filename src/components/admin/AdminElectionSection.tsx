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
  <div className="flex items-start gap-3 py-2.5">
    <div className="p-2 rounded-lg bg-green-500/10 shrink-0">
      <Vote className="h-4 w-4 text-green-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm">{activity.action}</p>
      {activity.candidate && (
        <p className="text-xs text-muted-foreground">
          {activity.candidate}
          {activity.position && ` • ${activity.position}`}
        </p>
      )}
    </div>
    <span className="text-xs text-muted-foreground shrink-0">
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
  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
    <Icon className="h-4 w-4 text-muted-foreground mb-1" />
    <span className="text-lg font-bold">{value}</span>
    <span className="text-[10px] text-muted-foreground">{label}</span>
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
      <AccordionItem value="election" className="border rounded-lg">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Vote className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Election Management</h3>
              <p className="text-xs text-muted-foreground">
                {stats.activeElections} active elections • {stats.accreditedVoters} accredited
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-2">
              <StatBadge value={stats.activeElections} label="Active" icon={Vote} />
              <StatBadge value={stats.accreditedVoters} label="Accredited" icon={Users} />
              <StatBadge value={stats.clearedCandidates} label="Cleared" icon={CheckCircle} />
              <StatBadge value={3} label="Pending" icon={Clock} />
            </div>

            {/* Current Election Management */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm">Manage Current Election</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={onViewCampaigns}>
                    <FileText className="h-4 w-4 mr-2" />
                    Campaigns
                  </Button>
                  <Button variant="outline" size="sm" onClick={onViewResults}>
                    <Trophy className="h-4 w-4 mr-2" />
                    Results
                  </Button>
                  <Button variant="outline" size="sm" onClick={onManageAccreditation}>
                    <Users className="h-4 w-4 mr-2" />
                    Accreditation
                  </Button>
                  <Button variant="outline" size="sm" onClick={onProcessClearances}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Clearances
                    <Badge variant="destructive" className="ml-1 text-[10px] px-1">3</Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Election Settings */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm">Election Settings</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={onConfigureVoting}>
                    <Settings className="h-4 w-4 mr-2" />
                    Voting Rules
                  </Button>
                  <Button variant="outline" size="sm" onClick={onAnnounceWinners}>
                    <Trophy className="h-4 w-4 mr-2" />
                    Announce Winners
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Election Activity */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Recent Activity
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    View All
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
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
