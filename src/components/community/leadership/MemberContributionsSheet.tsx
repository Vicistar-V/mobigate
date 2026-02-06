import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import {
  X,
  Heart,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  FolderOpen,
  Lightbulb,
  Users,
  HandHeart,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";
import { format } from "date-fns";

interface MemberContributionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: ExecutiveMember;
}

// Contribution types
type ContributionType = "project" | "initiative" | "event" | "service" | "engagement";
type ContributionStatus = "completed" | "ongoing" | "planned";

interface ContributionItem {
  id: string;
  type: ContributionType;
  title: string;
  description: string;
  date: string;
  status: ContributionStatus;
  impact?: string;
  category: string;
}

interface ContributionStats {
  totalProjects: number;
  totalInitiatives: number;
  eventsOrganized: number;
  impactScore: number;
}

// Mock community contributions data
const mockContributions: ContributionItem[] = [
  {
    id: "1",
    type: "project",
    title: "Anambra Hospital Project, Jos",
    description: "Led fundraising and coordination for hospital construction in Anambra community, Jos",
    date: "2024-01-15",
    status: "ongoing",
    impact: "200+ beneficiaries",
    category: "Healthcare",
  },
  {
    id: "2",
    type: "initiative",
    title: "Free Scholarship Scheme",
    description: "Established scholarship program for less-privileged students in the community",
    date: "2023-06-01",
    status: "completed",
    impact: "25 students sponsored",
    category: "Education",
  },
  {
    id: "3",
    type: "event",
    title: "Annual Community Summit 2024",
    description: "Organized and hosted the annual gathering with over 500 attendees",
    date: "2024-02-20",
    status: "completed",
    impact: "500+ attendees",
    category: "Community",
  },
  {
    id: "4",
    type: "service",
    title: "Youth Mentorship Program",
    description: "Weekly mentorship sessions for young professionals in the community",
    date: "2023-09-01",
    status: "ongoing",
    impact: "40 mentees",
    category: "Youth Development",
  },
  {
    id: "5",
    type: "project",
    title: "Community Center Renovation",
    description: "Coordinated renovation of the main community center facilities",
    date: "2023-04-15",
    status: "completed",
    impact: "1 facility upgraded",
    category: "Infrastructure",
  },
  {
    id: "6",
    type: "initiative",
    title: "Small Business Grant Fund",
    description: "Created micro-grant program to support community entrepreneurs",
    date: "2024-01-01",
    status: "ongoing",
    impact: "12 businesses funded",
    category: "Economic",
  },
  {
    id: "7",
    type: "event",
    title: "Cultural Heritage Day",
    description: "Annual celebration of Anambra cultural heritage and traditions",
    date: "2023-11-15",
    status: "completed",
    impact: "300+ participants",
    category: "Culture",
  },
  {
    id: "8",
    type: "service",
    title: "Community Outreach Visits",
    description: "Regular visits to support elderly and less-privileged community members",
    date: "2023-03-01",
    status: "ongoing",
    impact: "60+ families reached",
    category: "Welfare",
  },
];

const contributionStats: ContributionStats = {
  totalProjects: 5,
  totalInitiatives: 8,
  eventsOrganized: 12,
  impactScore: 92,
};

const getTypeIcon = (type: ContributionType) => {
  switch (type) {
    case "project":
      return <FolderOpen className="h-4 w-4" />;
    case "initiative":
      return <Lightbulb className="h-4 w-4" />;
    case "event":
      return <Calendar className="h-4 w-4" />;
    case "service":
      return <HandHeart className="h-4 w-4" />;
    case "engagement":
      return <Users className="h-4 w-4" />;
    default:
      return <Star className="h-4 w-4" />;
  }
};

const getTypeColor = (type: ContributionType) => {
  switch (type) {
    case "project":
      return "text-blue-600 bg-blue-500/10";
    case "initiative":
      return "text-amber-600 bg-amber-500/10";
    case "event":
      return "text-green-600 bg-green-500/10";
    case "service":
      return "text-pink-600 bg-pink-500/10";
    case "engagement":
      return "text-purple-600 bg-purple-500/10";
    default:
      return "text-muted-foreground bg-muted";
  }
};

const getStatusBadge = (status: ContributionStatus) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500/10 text-green-600 text-xs px-2 py-0.5">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case "ongoing":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 text-xs px-2 py-0.5">
          <TrendingUp className="h-3 w-3 mr-1" />
          Ongoing
        </Badge>
      );
    case "planned":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 text-xs px-2 py-0.5">
          <Clock className="h-3 w-3 mr-1" />
          Planned
        </Badge>
      );
    default:
      return null;
  }
};

export function MemberContributionsSheet({
  open,
  onOpenChange,
  member,
}: MemberContributionsSheetProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("all");

  const filteredContributions = activeTab === "all" 
    ? mockContributions 
    : mockContributions.filter(c => c.type === activeTab);

  const content = (
    <div className="flex flex-col h-full">
      {/* Member Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
        <Avatar className="h-12 w-12">
          <AvatarImage src={member.imageUrl} alt={member.name} />
          <AvatarFallback className="text-lg">{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{member.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{member.position}</p>
        </div>
      </div>

      {/* Stats Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <FolderOpen className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">Projects</span>
            </div>
            <p className="font-bold text-xl">{contributionStats.totalProjects}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <span className="text-xs text-muted-foreground">Initiatives</span>
            </div>
            <p className="font-bold text-xl">{contributionStats.totalInitiatives}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Events</span>
            </div>
            <p className="font-bold text-xl">{contributionStats.eventsOrganized}</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-muted-foreground">Impact Score</span>
            </div>
            <p className="font-bold text-xl">{contributionStats.impactScore}<span className="text-sm font-normal text-muted-foreground">/100</span></p>
          </CardContent>
        </Card>
      </div>

      {/* Horizontal scrolling tab filters */}
      <div className="px-4 pb-2">
        <ScrollArea className="w-full touch-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-max">
            <TabsList className="h-9 bg-muted/50 p-0.5">
              <TabsTrigger value="all" className="text-xs px-3 h-8">All</TabsTrigger>
              <TabsTrigger value="project" className="text-xs px-3 h-8">Projects</TabsTrigger>
              <TabsTrigger value="initiative" className="text-xs px-3 h-8">Initiatives</TabsTrigger>
              <TabsTrigger value="event" className="text-xs px-3 h-8">Events</TabsTrigger>
              <TabsTrigger value="service" className="text-xs px-3 h-8">Service</TabsTrigger>
            </TabsList>
          </Tabs>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Contributions List */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3 pb-6">
          {filteredContributions.map((contribution) => (
            <Card key={contribution.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex flex-col gap-2">
                  {/* Header Row: Type Icon + Title + Status */}
                  <div className="flex items-start gap-2">
                    <div className={`p-2 rounded-lg shrink-0 ${getTypeColor(contribution.type)}`}>
                      {getTypeIcon(contribution.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2 leading-snug">{contribution.title}</p>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(contribution.status)}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {contribution.description}
                  </p>

                  {/* Footer Row: Date + Category + Impact */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(contribution.date), "MMM yyyy")}
                    </span>
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      {contribution.category}
                    </Badge>
                    {contribution.impact && (
                      <span className="text-xs font-medium text-primary flex items-center gap-1 ml-auto">
                        <Target className="h-3 w-3" />
                        {contribution.impact}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredContributions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No contributions found</p>
              <p className="text-xs mt-1">This member hasn't contributed in this category yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] h-[92vh] flex flex-col">
          <DrawerHeader className="shrink-0 pb-0 relative">
            <DrawerTitle className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Community Contributions
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-hidden">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="shrink-0 p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Community Contributions
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
