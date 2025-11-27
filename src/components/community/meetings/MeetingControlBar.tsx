import { Button } from "@/components/ui/button";
import { Pause, Play, PhoneOff, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeetingControlBarProps {
  isActive: boolean;
  isPaused: boolean;
  isChatOpen: boolean;
  onPause: () => void;
  onResume: () => void;
  onDisconnect: () => void;
  onToggleChat: () => void;
}

export const MeetingControlBar = ({
  isActive,
  isPaused,
  isChatOpen,
  onPause,
  onResume,
  onDisconnect,
  onToggleChat,
}: MeetingControlBarProps) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-card border-y border-border">
      {/* Status */}
      <div className="flex items-center justify-center gap-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          isActive ? "bg-green-500 animate-pulse" : "bg-muted"
        )} />
        <span className="text-sm font-medium">
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {!isPaused ? (
          <Button
            onClick={onPause}
            variant="secondary"
            className="gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause
          </Button>
        ) : (
          <Button
            onClick={onResume}
            variant="default"
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4" />
            Resume
          </Button>
        )}

        <Button
          onClick={onDisconnect}
          variant="destructive"
          className="gap-2"
        >
          <PhoneOff className="w-4 h-4" />
          Disconnect
        </Button>

        <Button
          onClick={onToggleChat}
          variant={isChatOpen ? "default" : "outline"}
          className="gap-2 col-span-2"
        >
          <MessageSquare className="w-4 h-4" />
          {isChatOpen ? "Close Chat" : "Chat-in"}
        </Button>
      </div>
    </div>
  );
};
