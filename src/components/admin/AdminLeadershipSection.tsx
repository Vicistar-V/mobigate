import { Crown, Users, History, Trophy, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ExecutiveMember {
  id: string;
  name: string;
  position: string;
  avatar: string;
}

interface ExecutiveCardProps {
  member: ExecutiveMember;
  onClick: (id: string) => void;
}

const ExecutiveCard = ({ member, onClick }: ExecutiveCardProps) => (
  <button
    onClick={() => onClick(member.id)}
    className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-w-[100px]"
  >
    <Avatar className="h-12 w-12 mb-2">
      <AvatarImage src={member.avatar} alt={member.name} />
      <AvatarFallback className="text-sm">
        {member.name.split(' ').map(n => n[0]).join('')}
      </AvatarFallback>
    </Avatar>
    <p className="font-medium text-xs text-center truncate w-full">{member.name.split(' ')[0]}</p>
    <p className="text-[10px] text-muted-foreground text-center truncate w-full">{member.position}</p>
  </button>
);

interface AdminLeadershipSectionProps {
  executives: ExecutiveMember[];
  onManageLeadership: () => void;
  onApplyElectionResults: () => void;
  onViewChangeHistory: () => void;
  onManageAdhoc: () => void;
  onViewExecutive: (id: string) => void;
}

export function AdminLeadershipSection({
  executives,
  onManageLeadership,
  onApplyElectionResults,
  onViewChangeHistory,
  onManageAdhoc,
  onViewExecutive,
}: AdminLeadershipSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="leadership" className="border rounded-lg">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <Crown className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Leadership Management</h3>
              <p className="text-xs text-muted-foreground">
                {executives.length} executives • 3 ad-hoc committees
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Current Executive Carousel */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Current Executive
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onManageLeadership}>
                    View All
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <ScrollArea className="w-full touch-auto">
                  <div className="flex gap-3 pb-2">
                    {executives.slice(0, 6).map((member) => (
                      <ExecutiveCard
                        key={member.id}
                        member={member}
                        onClick={onViewExecutive}
                      />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={onManageLeadership}>
                <Crown className="h-4 w-4 mr-2" />
                Manage Leaders
              </Button>
              <Button variant="outline" size="sm" onClick={onApplyElectionResults}>
                <Trophy className="h-4 w-4 mr-2" />
                Apply Results
              </Button>
              <Button variant="outline" size="sm" onClick={onViewChangeHistory}>
                <History className="h-4 w-4 mr-2" />
                Change History
              </Button>
              <Button variant="outline" size="sm" onClick={onManageAdhoc}>
                <Users className="h-4 w-4 mr-2" />
                Ad-hoc Committees
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                <span className="text-lg font-bold">{executives.length}</span>
                <span className="text-[10px] text-muted-foreground">Executives</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                <span className="text-lg font-bold">3</span>
                <span className="text-[10px] text-muted-foreground">Committees</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                <span className="text-lg font-bold">12</span>
                <span className="text-[10px] text-muted-foreground">Staff</span>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
