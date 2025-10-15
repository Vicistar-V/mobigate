import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface InlineVoiceRecorderProps {
  onSend: (audioData: { url: string; name: string; duration: number }) => void;
  onCancel: () => void;
}

export const InlineVoiceRecorder = ({ onSend, onCancel }: InlineVoiceRecorderProps) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => {
        if (prev >= 300) {
          // Auto-send after 5 minutes
          handleSend();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSend = () => {
    // Simulated audio data
    const audioData = {
      url: `data:audio/webm;base64,simulated-audio-${Date.now()}`,
      name: `voice-message-${Date.now()}.webm`,
      duration: duration,
    };
    onSend(audioData);
  };

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#f0f2f5] dark:bg-[#2a2a2a] rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg border border-border">
      {/* Recording Indicator */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        <span className="text-base font-medium">Recording</span>
      </div>

      {/* Timer */}
      <span className="text-lg font-mono font-semibold">
        {formatDuration(duration)}
      </span>

      {/* Waveform Animation */}
      <div className="flex-1 flex items-center gap-0.5 h-6">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-[#00a884] rounded-full animate-pulse"
            style={{
              height: `${Math.random() * 20 + 8}px`,
              animationDelay: `${i * 80}ms`
            }}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {/* Cancel */}
        <Button
          onClick={onCancel}
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-5 w-5" />
        </Button>

        {/* Send */}
        <Button
          onClick={handleSend}
          variant="default"
          size="icon"
          className="h-9 w-9 bg-[#00a884] hover:bg-[#00a884]/90"
        >
          <Check className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
