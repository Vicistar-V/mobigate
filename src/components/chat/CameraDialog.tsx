import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, RotateCw, X } from "lucide-react";
import { toast } from "sonner";

interface CameraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSendPhoto: (photoData: { url: string; name: string }) => void;
  recipientName?: string;
}

export const CameraDialog = ({
  isOpen,
  onClose,
  onSendPhoto,
  recipientName = "User",
}: CameraDialogProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && !photoDataUrl) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: 1280, height: 720 },
        audio: false,
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Camera access denied. Please enable camera permissions in your browser settings.");
        } else if (err.name === "NotFoundError") {
          setError("No camera found on this device.");
        } else {
          setError("Unable to access camera. Please try again.");
        }
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setPhotoDataUrl(dataUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setPhotoDataUrl(null);
    startCamera();
  };

  const handleSend = () => {
    if (photoDataUrl) {
      const timestamp = Date.now();
      onSendPhoto({
        url: photoDataUrl,
        name: `photo-${timestamp}.jpg`,
      });
      handleClose();
    }
  };

  const handleSwitchCamera = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleClose = () => {
    stopCamera();
    setPhotoDataUrl(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[85vh] p-4">
        <DialogHeader>
          <DialogTitle>Camera - Send to {recipientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Camera Preview or Captured Photo */}
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center space-y-3">
                  <Camera className="h-12 w-12 text-red-500 mx-auto" />
                  <p className="text-sm text-white">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startCamera}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : photoDataUrl ? (
              <img
                src={photoDataUrl}
                alt="Captured"
                className="w-full h-full object-contain"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Camera className="h-12 w-12 text-white mx-auto animate-pulse" />
                      <p className="text-sm text-white">Loading camera...</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {photoDataUrl ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleRetake}
                  className="gap-2"
                >
                  <RotateCw className="h-4 w-4" />
                  Retake
                </Button>
                <Button
                  onClick={handleSend}
                  className="bg-[#00a884] hover:bg-[#00a884]/90 gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Send Photo
                </Button>
              </>
            ) : (
              <>
                {isCameraActive && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleSwitchCamera}
                      size="icon"
                      className="rounded-full"
                    >
                      <RotateCw className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={capturePhoto}
                      size="lg"
                      className="rounded-full h-16 w-16 bg-[#00a884] hover:bg-[#00a884]/90"
                    >
                      <Camera className="h-6 w-6" />
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={handleClose}
                  size="icon"
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
