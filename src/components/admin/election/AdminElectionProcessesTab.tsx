import { useState } from "react";
import { 
  UserPlus, 
  Vote, 
  Trophy,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminNominationsSection } from "./AdminNominationsSection";
import { AdminPrimaryElectionsSection } from "./AdminPrimaryElectionsSection";
import { AdminMainElectionSection } from "./AdminMainElectionSection";
import { 
  getNominationStats, 
  getPrimaryStats, 
  getMainElectionStats 
} from "@/data/electionProcessesData";
import { cn } from "@/lib/utils";

interface ProcessCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  stats: { label: string; value: number; color: string }[];
  isActive?: boolean;
  onClick: () => void;
}

const ProcessCard = ({ icon, title, subtitle, stats, isActive, onClick }: ProcessCardProps) => (
  <Card 
    className={cn(
      "cursor-pointer transition-all active:scale-[0.98]",
      isActive && "ring-2 ring-green-500 border-green-300"
    )}
    onClick={onClick}
  >
    <CardContent className="p-3">
      <div className="flex items-start gap-3">
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
          isActive ? "bg-green-600 text-white" : "bg-primary/10 text-primary"
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">{title}</h4>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
          <div className="flex gap-2 mt-2">
            {stats.map((stat, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className={cn("text-[10px] py-0", stat.color)}
              >
                {stat.value} {stat.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function AdminElectionProcessesTab() {
  const [activeProcess, setActiveProcess] = useState<'overview' | 'nominations' | 'primary' | 'main'>('overview');

  const nominationStats = getNominationStats();
  const primaryStats = getPrimaryStats();
  const mainStats = getMainElectionStats();

  if (activeProcess === 'nominations') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setActiveProcess('overview')}
          className="flex items-center gap-1 text-sm text-primary font-medium"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Back to Overview
        </button>
        <AdminNominationsSection />
      </div>
    );
  }

  if (activeProcess === 'primary') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setActiveProcess('overview')}
          className="flex items-center gap-1 text-sm text-primary font-medium"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Back to Overview
        </button>
        <AdminPrimaryElectionsSection />
      </div>
    );
  }

  if (activeProcess === 'main') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setActiveProcess('overview')}
          className="flex items-center gap-1 text-sm text-primary font-medium"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Back to Overview
        </button>
        <AdminMainElectionSection />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="text-center py-3">
        <h3 className="font-bold text-base">Election Processes</h3>
        <p className="text-xs text-muted-foreground">Manage all stages of the election</p>
      </div>

      {/* Process Cards */}
      <div className="space-y-3">
        <ProcessCard
          icon={<UserPlus className="h-5 w-5" />}
          title="Nominations"
          subtitle="Manage candidate nominations"
          stats={[
            { label: "Approved", value: nominationStats.approved, color: "bg-emerald-100 text-emerald-700" },
            { label: "Pending", value: nominationStats.pending, color: "bg-amber-100 text-amber-700" },
          ]}
          onClick={() => setActiveProcess('nominations')}
        />

        <ProcessCard
          icon={<Vote className="h-5 w-5" />}
          title="Primary Elections"
          subtitle="Run party/internal primaries"
          stats={[
            { label: "Completed", value: primaryStats.completed, color: "bg-emerald-100 text-emerald-700" },
            { label: "Scheduled", value: primaryStats.scheduled, color: "bg-blue-100 text-blue-700" },
          ]}
          onClick={() => setActiveProcess('primary')}
        />

        <ProcessCard
          icon={<Trophy className="h-5 w-5" />}
          title="Main Election"
          subtitle="The general election day"
          stats={[
            { label: "Offices", value: mainStats.totalOffices, color: "bg-blue-100 text-blue-700" },
            { label: "Done", value: mainStats.completedOffices, color: "bg-emerald-100 text-emerald-700" },
          ]}
          onClick={() => setActiveProcess('main')}
        />
      </div>

      {/* Quick Stats Summary */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-3 text-green-800 dark:text-green-200">
            Election Progress Summary
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{nominationStats.total}</p>
              <p className="text-[10px] text-muted-foreground">Total Nominations</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{primaryStats.total}</p>
              <p className="text-[10px] text-muted-foreground">Primaries</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{mainStats.turnout}%</p>
              <p className="text-[10px] text-muted-foreground">Turnout</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
