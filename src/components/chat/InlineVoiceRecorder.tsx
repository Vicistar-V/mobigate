import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface InlineVoiceRecorderProps {
  onSend: (audioData: { url: string; name: string; duration: number; blob: Blob }) => void;
  onCancel: () => void;
}

export const InlineVoiceRecorder = ({ onSend, onCancel }: InlineVoiceRecorderProps) => {
  const [duration,     setDuration]    = useState(0);
  const [isRecording,  setIsRecording]  = useState(false);
  const [isSending,    setIsSending]    = useState(false);

  const recorderRef    = useRef<MediaRecorder | null>(null);
  const chunksRef      = useRef<Blob[]>([]);
  const streamRef      = useRef<MediaStream | null>(null);
  const durationRef    = useRef(0);
  const sendOnStop     = useRef(false); // flag: stop was triggered by Send (not Cancel)

  useEffect(() => {
    startRecording();
    return () => stopAll();
  }, []);

  useEffect(() => {
    if (!isRecording) return;
    const t = setInterval(() => {
      durationRef.current += 1;
      setDuration(durationRef.current);
      if (durationRef.current >= 300) handleSend(); // auto-send at 5 min
    }, 1000);
    return () => clearInterval(t);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;
      chunksRef.current   = [];

      recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      // onstop fires AFTER the final ondataavailable — this is the correct place to build the blob
      recorder.onstop = () => {
        if (!sendOnStop.current) return; // cancelled — discard

        const finalMime = recorder.mimeType || "audio/webm";
        const blob      = new Blob(chunksRef.current, { type: finalMime });

        if (blob.size < 100) {
          toast.error("Recording too short");
          onCancel();
          return;
        }

        const ext  = finalMime.includes("mp4") ? "mp4" : "webm";
        onSend({
          url:      URL.createObjectURL(blob),
          name:     `voice-${Date.now()}.${ext}`,
          duration: durationRef.current,
          blob,
        });
      };

      recorder.start(100); // collect data every 100 ms
      setIsRecording(true);
    } catch {
      toast.error("Microphone access denied");
      onCancel();
    }
  };

  const stopAll = () => {
    if (recorderRef.current?.state !== "inactive") recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setIsRecording(false);
  };

  const handleSend = () => {
    if (durationRef.current < 1) { toast.error("Hold the button longer to record"); return; }
    setIsSending(true);
    sendOnStop.current = true; // tell onstop to send
    stopAll();
  };

  const handleCancel = () => {
    sendOnStop.current = false; // tell onstop to discard
    stopAll();
    onCancel();
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-[#2a2a2a] rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg border border-border z-10">
      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shrink-0" />
      <span className="text-base font-mono font-semibold tabular-nums w-12">{fmt(duration)}</span>

      {/* Waveform */}
      <div className="flex-1 flex items-center gap-0.5 h-6 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-1 bg-[#00a884] rounded-full animate-pulse shrink-0"
            style={{ height: `${(i % 4) * 5 + 6}px`, animationDelay: `${i * 60}ms` }} />
        ))}
      </div>

      {/* Cancel */}
      <Button onClick={handleCancel} variant="ghost" size="icon"
        className="h-9 w-9 text-destructive hover:bg-destructive/10 shrink-0" disabled={isSending}>
        <Trash2 className="h-5 w-5" />
      </Button>

      {/* Send */}
      <Button onClick={handleSend} size="icon" disabled={duration < 1 || isSending}
        className="h-9 w-9 bg-[#00a884] hover:bg-[#00a884]/90 shrink-0">
        <Check className="h-5 w-5" />
      </Button>
    </div>
  );
};
