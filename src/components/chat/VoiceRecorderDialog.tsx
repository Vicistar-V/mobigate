import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Play, Pause, Trash2, Send, Square } from "lucide-react";
import { toast } from "sonner";

interface VoiceRecorderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSendAudio: (audioData: { url: string; name: string; duration: number }) => void;
  recipientName?: string;
}

export const VoiceRecorderDialog = ({
  isOpen,
  onClose,
  onSendAudio,
  recipientName = "User",
}: VoiceRecorderDialogProps) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isOpen && !mediaRecorder && !audioBlob) {
      startRecording();
    }

    return () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setDuration((prev) => {
          if (prev >= 300) {
            // 5 minutes max
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setDuration(0);
    } catch (err) {
      console.error("Microphone access error:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Microphone access denied. Please enable permissions in your browser settings.");
        } else if (err.name === "NotFoundError") {
          setError("No microphone found on this device.");
        } else {
          setError("Recording failed. Please try again.");
        }
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const togglePause = () => {
    if (!mediaRecorder) return;

    if (isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
    } else {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleDiscard = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    handleClose();
  };

  const handleSend = () => {
    if (audioUrl && audioBlob) {
      const timestamp = Date.now();
      onSendAudio({
        url: audioUrl,
        name: `voice-message-${timestamp}.webm`,
        duration: duration,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setMediaRecorder(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setIsRecording(false);
    setIsPaused(false);
    setIsPlaying(false);
    setDuration(0);
    setError(null);
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const WaveformAnimation = () => (
    <div className="flex items-center justify-center gap-1 h-20">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-[#00a884] rounded-full animate-pulse"
          style={{
            height: `${Math.random() * 40 + 20}px`,
            animationDelay: `${i * 50}ms`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );

  const StaticWaveform = () => (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="w-1.5 bg-[#00a884] rounded-full"
          style={{
            height: `${Math.random() * 40 + 10}px`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Message - {recipientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error ? (
            <div className="text-center space-y-3 py-8">
              <Mic className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={startRecording}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Waveform/Audio Player */}
              <div className="bg-muted/30 rounded-lg p-4">
                {isRecording ? (
                  <WaveformAnimation />
                ) : audioBlob ? (
                  <StaticWaveform />
                ) : (
                  <div className="h-20 flex items-center justify-center">
                    <Mic className="h-8 w-8 text-muted-foreground animate-pulse" />
                  </div>
                )}
              </div>

              {/* Duration Display */}
              <div className="text-center">
                <p className="text-3xl font-mono font-bold text-[#00a884]">
                  {formatDuration(duration)}
                </p>
                {duration >= 300 && (
                  <p className="text-xs text-destructive mt-1">Maximum duration reached</p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                {isRecording ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={togglePause}
                      size="lg"
                      className="rounded-full"
                    >
                      {isPaused ? <Mic className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <Button
                      onClick={stopRecording}
                      size="lg"
                      className="rounded-full bg-red-500 hover:bg-red-600"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop
                    </Button>
                  </>
                ) : audioBlob ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={isPlaying ? handlePausePlayback : handlePlay}
                      size="lg"
                      className="rounded-full"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDiscard}
                      size="lg"
                      className="rounded-full text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={handleSend}
                      size="lg"
                      className="rounded-full bg-[#00a884] hover:bg-[#00a884]/90"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Send
                    </Button>
                  </>
                ) : null}
              </div>

              {/* Hidden Audio Element */}
              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
