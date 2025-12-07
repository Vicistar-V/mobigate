import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Video,
  VideoOff
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientAvatar?: string;
}

export const ActiveCallDialog = ({
  isOpen,
  onClose,
  recipientName,
  recipientAvatar
}: ActiveCallDialogProps) => {
  const [callStatus, setCallStatus] = useState<"calling" | "connected" | "ended">("calling");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  // Format call duration as MM:SS
  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Simulate call connection after 2-3 seconds
  useEffect(() => {
    if (isOpen && callStatus === "calling") {
      const connectTimer = setTimeout(() => {
        setCallStatus("connected");
      }, 2500);
      return () => clearTimeout(connectTimer);
    }
  }, [isOpen, callStatus]);

  // Call duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === "connected") {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCallStatus("calling");
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeakerOn(false);
      setIsVideoOn(false);
    }
  }, [isOpen]);

  const handleEndCall = () => {
    setCallStatus("ended");
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const getStatusText = () => {
    switch (callStatus) {
      case "calling":
        return "Calling...";
      case "connected":
        return formatDuration(callDuration);
      case "ended":
        return "Call Ended";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 border-0">
        <div className="flex flex-col items-center justify-between min-h-[70vh] py-8 px-6">
          {/* Top Section - Recipient Info */}
          <div className="flex flex-col items-center space-y-4 flex-1 justify-center">
            {/* Avatar with Pulse Animation */}
            <div className="relative">
              <div 
                className={cn(
                  "absolute inset-0 rounded-full bg-primary/20",
                  callStatus === "calling" && "animate-ping"
                )}
                style={{ animationDuration: "1.5s" }}
              />
              <div 
                className={cn(
                  "absolute inset-0 rounded-full",
                  callStatus === "calling" && "animate-pulse bg-primary/10"
                )}
              />
              <Avatar className="h-32 w-32 border-4 border-primary/30 relative z-10">
                <AvatarImage src={recipientAvatar} alt={recipientName} className="object-cover" />
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                  {recipientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              {/* Connected indicator */}
              {callStatus === "connected" && (
                <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 rounded-full border-3 border-background z-20 flex items-center justify-center">
                  <Phone className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            {/* Recipient Name */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{recipientName}</h2>
              <p 
                className={cn(
                  "text-lg font-medium transition-colors",
                  callStatus === "calling" && "text-muted-foreground animate-pulse",
                  callStatus === "connected" && "text-green-600",
                  callStatus === "ended" && "text-destructive"
                )}
              >
                {getStatusText()}
              </p>
            </div>

            {/* Video Preview Placeholder (when video is on) */}
            {isVideoOn && callStatus === "connected" && (
              <div className="w-full h-32 rounded-xl bg-muted flex items-center justify-center mt-4">
                <Video className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Video Preview</span>
              </div>
            )}
          </div>

          {/* Bottom Section - Call Controls */}
          <div className="w-full space-y-6">
            {/* Secondary Controls */}
            {callStatus !== "ended" && (
              <div className="flex items-center justify-center gap-6">
                {/* Mute Button */}
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="lg"
                  className="h-14 w-14 rounded-full"
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={callStatus === "calling"}
                >
                  {isMuted ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>

                {/* Video Toggle */}
                <Button
                  variant={isVideoOn ? "default" : "outline"}
                  size="lg"
                  className="h-14 w-14 rounded-full"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  disabled={callStatus === "calling"}
                >
                  {isVideoOn ? (
                    <Video className="h-6 w-6" />
                  ) : (
                    <VideoOff className="h-6 w-6" />
                  )}
                </Button>

                {/* Speaker Button */}
                <Button
                  variant={isSpeakerOn ? "default" : "outline"}
                  size="lg"
                  className="h-14 w-14 rounded-full"
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  disabled={callStatus === "calling"}
                >
                  {isSpeakerOn ? (
                    <Volume2 className="h-6 w-6" />
                  ) : (
                    <VolumeX className="h-6 w-6" />
                  )}
                </Button>
              </div>
            )}

            {/* End Call Button */}
            <div className="flex justify-center">
              <Button
                variant="destructive"
                size="lg"
                className="h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={handleEndCall}
                disabled={callStatus === "ended"}
              >
                <PhoneOff className="h-7 w-7" />
              </Button>
            </div>

            {/* End Call Label */}
            <p className="text-center text-sm text-muted-foreground">
              {callStatus === "ended" ? "Call ended" : "Tap to end call"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
