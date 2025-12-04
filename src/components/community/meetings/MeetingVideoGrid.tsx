import { MeetingParticipant } from "@/data/meetingsData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Grid3x3, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeetingVideoGridProps {
  participants: MeetingParticipant[];
  expandedParticipantId: string | null;
  onExpandParticipant: (id: string | null) => void;
}

export const MeetingVideoGrid = ({
  participants,
  expandedParticipantId,
  onExpandParticipant,
}: MeetingVideoGridProps) => {
  const displayParticipants = participants.slice(0, 4);

  if (expandedParticipantId) {
    const expandedParticipant = participants.find(p => p.id === expandedParticipantId);
    if (!expandedParticipant) return null;

    return (
      <div className="fixed inset-0 z-50 bg-background animate-in fade-in duration-300">
        <div className="relative w-full h-full">
          {/* Video Cell - Expanded */}
          <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Avatar className="w-72 h-72 border-[6px] border-primary">
              <AvatarImage src={expandedParticipant.avatar} alt={expandedParticipant.name} />
              <AvatarFallback className="text-8xl">{expandedParticipant.name[0]}</AvatarFallback>
            </Avatar>

            {/* Speaking Indicator */}
            {expandedParticipant.isSpeaking && (
              <div className="absolute inset-0 border-4 border-green-500 rounded-lg animate-pulse" />
            )}

            {/* Name Badge */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full">
              <p className="text-white font-semibold text-xl">{expandedParticipant.name}</p>
              <p className="text-white/70 text-base text-center">{expandedParticipant.position}</p>
            </div>

            {/* Status Indicators */}
            <div className="absolute bottom-20 right-4 flex gap-2">
              {expandedParticipant.isMuted ? (
                <div className="bg-red-500 p-2 rounded-full">
                  <MicOff className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="bg-green-500 p-2 rounded-full">
                  <Mic className="w-5 h-5 text-white" />
                </div>
              )}
              {expandedParticipant.isCameraOff ? (
                <div className="bg-red-500 p-2 rounded-full">
                  <VideoOff className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="bg-green-500 p-2 rounded-full">
                  <Video className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Back to Grid Button */}
          <Button
            onClick={() => onExpandParticipant(null)}
            className="absolute top-4 left-4 gap-2"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Grid
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-2 p-2">
        {displayParticipants.map((participant) => (
          <button
            key={participant.id}
            onClick={() => onExpandParticipant(participant.id)}
            className={cn(
              "relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95",
              "flex items-center justify-center",
              participant.isSpeaking && "ring-2 ring-green-500"
            )}
          >
            {/* Avatar */}
            <Avatar className="w-20 h-20 md:w-24 md:h-24 border-2 border-primary">
              <AvatarImage src={participant.avatar} alt={participant.name} />
              <AvatarFallback className="text-2xl">{participant.name[0]}</AvatarFallback>
            </Avatar>

            {/* Speaking Pulse Animation */}
            {participant.isSpeaking && (
              <div className="absolute inset-0 border-2 border-green-500 rounded-lg animate-pulse" />
            )}

            {/* Name Badge */}
            <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
              <p className="text-white text-xs md:text-sm font-medium truncate">
                {participant.name}
              </p>
            </div>

            {/* Status Indicators */}
            <div className="absolute top-2 right-2 flex gap-1">
              {participant.isMuted && (
                <div className="bg-red-500 p-1 rounded-full">
                  <MicOff className="w-3 h-3 text-white" />
                </div>
              )}
              {participant.isCameraOff && (
                <div className="bg-red-500 p-1 rounded-full">
                  <VideoOff className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
