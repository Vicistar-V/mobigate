import { MeetingParticipant } from "@/data/meetingsData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";

interface MeetingParticipantsListProps {
  participants: MeetingParticipant[];
  onSelectParticipant: (participant: MeetingParticipant) => void;
}

export const MeetingParticipantsList = ({
  participants,
  onSelectParticipant,
}: MeetingParticipantsListProps) => {
  return (
    <div className="py-4 border-b border-border">
      <h3 className="text-lg font-semibold px-4 mb-3">Connect</h3>
      
      <ScrollArea className="w-full">
        <div className="flex gap-3 px-4 pb-2">
          {participants.map((participant) => (
            <Card
              key={participant.id}
              className="flex-shrink-0 w-32 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelectParticipant(participant)}
            >
              <CardContent className="p-3 flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback>{participant.name[0]}</AvatarFallback>
                  </Avatar>
                  {participant.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                
                <Badge variant="secondary" className="gap-1 text-xs">
                  <MessageSquare className="w-3 h-3" />
                  Chat
                </Badge>
                
                <div className="text-center w-full">
                  <p className="text-xs font-medium truncate">{participant.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{participant.position}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
