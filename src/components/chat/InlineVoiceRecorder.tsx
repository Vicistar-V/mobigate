import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface InlineVoiceRecorderProps {
  onSend: (audioData: { url: string; name: string; duration: number }) => void;
  onCancel: () => void;
}

export const InlineVoiceRecorder = ({ onSend, onCancel }: InlineVoiceRecorderProps) => {
  const [duration, setDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startRecording();
    return () => {
      stopRecording();
    };
  }, []);

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setDuration(prev => {
        if (prev >= 300) {
          handleSend();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("Could not access microphone. Please check permissions.");
      onCancel();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSend = () => {
    stopRecording();
    
    if (audioChunksRef.current.length === 0) {
      toast.error("No audio recorded");
      onCancel();
      return;
    }

    const audioBlob = new Blob(audioChunksRef.current, { 
      type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
    });
    
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioData = {
      url: audioUrl,
      name: `voice-message-${Date.now()}.webm`,
      duration: duration,
    };
    
    onSend(audioData);
  };

  const handleCancel = () => {
    stopRecording();
    onCancel();
  };

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#f0f2f5] dark:bg-[#2a2a2a] rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg border border-border">
      {/* Recording Indicator */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
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
          onClick={handleCancel}
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
          disabled={duration < 1}
        >
          <Check className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
