import { Crown, Users, History, Trophy, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    className="flex flex-col items-center p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors w-[72px] shrink-0"
  >
    <Avatar className="h-10 w-10 mb-1.5">
      <AvatarImage src={member.avatar} alt={member.name} />
      <AvatarFallback className="text-xs">
        {member.name.split(' ').map(n => n[0]).join('')}
      </AvatarFallback>
    </Avatar>
    <p className="font-medium text-[10px] text-center truncate w-full">{member.name.split(' ')[0]}</p>
    <p className="text-[9px] text-muted-foreground text-center truncate w-full">{member.position}</p>
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
      <AccordionItem value="leadership" className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-3 hover:no-underline">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-500/10 shrink-0">
              <Crown className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">Leadership</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {executives.length} executives • 3 ad-hoc
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="space-y-3 w-full overflow-hidden">
            {/* Current Executive Carousel */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-1.5 pt-2.5 px-2.5">
                <CardTitle className="text-xs flex items-center justify-between">
                  Current Executive
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={onManageLeadership}>
                    View All
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2.5 pb-2.5 pt-0">
                <ScrollArea className="w-full touch-auto">
                  <div className="flex gap-2 pb-2">
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
            <div className="grid grid-cols-2 gap-1.5">
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onManageLeadership}>
                <Crown className="h-3 w-3 mr-1" />
                Manage
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onApplyElectionResults}>
                <Trophy className="h-3 w-3 mr-1" />
                Apply Results
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onViewChangeHistory}>
                <History className="h-3 w-3 mr-1" />
                History
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onManageAdhoc}>
                <Users className="h-3 w-3 mr-1" />
                Ad-hoc
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-1.5">
              <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                <span className="text-base font-bold">{executives.length}</span>
                <span className="text-[9px] text-muted-foreground">Executives</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                <span className="text-base font-bold">3</span>
                <span className="text-[9px] text-muted-foreground">Committees</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                <span className="text-base font-bold">12</span>
                <span className="text-[9px] text-muted-foreground">Staff</span>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
