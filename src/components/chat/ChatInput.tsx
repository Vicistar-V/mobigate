import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Camera, Mic, Gift, Gamepad2, Play } from "lucide-react";
import { useRef, useState } from "react";
import { SendGiftDialog, GiftSelection } from "./SendGiftDialog";
import { AttachmentMenu } from "./AttachmentMenu";
import { InlineVoiceRecorder } from "./InlineVoiceRecorder";

import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: { type: 'image' | 'file' | 'gift' | 'audio' | 'video'; url: string; name: string; duration?: number; giftData?: any }[]) => void;
  disabled?: boolean;
  replyTo?: { messageId: string; content: string; senderName: string } | null;
  onCancelReply?: () => void;
  recipientName?: string;
  onStartQuiz?: () => void;
}

export const ChatInput = ({ onSendMessage, disabled, replyTo, onCancelReply, recipientName = "User", onStartQuiz }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<{ type: 'image' | 'file' | 'gift' | 'audio' | 'video'; url: string; name: string; duration?: number; giftData?: any }[]>([]);
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage("");
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    toast.info(`Processing ${files.length} photo(s)...`);
    
    const newAttachments: typeof attachments = [];
    let processedCount = 0;

    for (let i = 0; i < files.length && i < 5; i++) {
      const file = files[i];
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`);
        processedCount++;
        continue;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        processedCount++;
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        newAttachments.push({
          type: 'image' as const,
          url,
          name: file.name,
        });
        
        processedCount++;
        if (processedCount === Math.min(files.length, 5)) {
          setAttachments(prev => [...prev, ...newAttachments].slice(0, 5));
          if (newAttachments.length > 0) {
            toast.success(`${newAttachments.length} photo(s) added!`);
          }
        }
      };
      reader.onerror = () => {
        toast.error(`Failed to read ${file.name}`);
        processedCount++;
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 50MB limit`);
        continue;
      }

      newAttachments.push({
        type: 'file' as const,
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }

    if (newAttachments.length > 0) {
      setAttachments(prev => [...prev, ...newAttachments].slice(0, 5));
      toast.success(`${newAttachments.length} file(s) added!`);
    }
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleGiftSend = (giftData: GiftSelection) => {
    if (!giftData) return;
    
    const giftAttachment = {
      type: 'gift' as const,
      url: '',
      name: giftData.giftData.name,
      giftData: giftData.giftData
    };
    
    onSendMessage(
      `🎁 Sent a gift: ${giftData.giftData.name}`,
      [giftAttachment]
    );
    
    setIsGiftDialogOpen(false);
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Photo exceeds 10MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setAttachments(prev => [...prev, {
        type: 'image' as const,
        url,
        name: file.name,
      }].slice(0, 5));
      toast.success("Photo captured!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    toast.info("Processing video...");
    
    const newAttachments: typeof attachments = [];

    for (let i = 0; i < files.length && i < 2; i++) {
      const file = files[i];
      
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 100MB limit`);
        continue;
      }

      if (!file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a video`);
        continue;
      }

      newAttachments.push({
        type: 'video' as const,
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }

    if (newAttachments.length > 0) {
      setAttachments(prev => [...prev, ...newAttachments].slice(0, 5));
      toast.success(`${newAttachments.length} video(s) added!`);
    }

    e.target.value = "";
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAudioSend = (audioData: { url: string; name: string; duration: number }) => {
    const audioAttachment = {
      type: 'audio' as const,
      url: audioData.url,
      name: audioData.name,
      duration: audioData.duration,
    };
    
    onSendMessage(
      `🎤 Voice message (${formatDuration(audioData.duration)})`,
      [audioAttachment]
    );
    
    setIsRecording(false);
    toast.success("Voice message sent!");
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <>
      <SendGiftDialog
        isOpen={isGiftDialogOpen}
        onClose={() => setIsGiftDialogOpen(false)}
        recipientName={recipientName}
        onSendGift={handleGiftSend}
      />
      
      <div className="p-3 sm:p-4 border-t border-border bg-card relative">
        {replyTo && (
          <div className="mb-2 p-2 bg-muted/50 rounded-lg flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-base text-muted-foreground">Replying to {replyTo.senderName}</p>
              <p className="text-base truncate">{replyTo.content}</p>
            </div>
            <Button
              onClick={onCancelReply}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative group">
                {attachment.type === 'video' ? (
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden border-2 border-border">
                    <video 
                      src={attachment.url} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute top-1 right-1 bg-destructive/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : attachment.type === 'image' ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-border">
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute top-1 right-1 bg-destructive/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : attachment.type === 'audio' ? (
                  <div className="flex items-center gap-2 p-2 pr-8 rounded-lg border-2 border-border bg-muted/50 relative min-w-[180px]">
                    <Mic className="h-4 w-4 text-[#00a884]" />
                    <div className="flex-1">
                      <span className="text-base font-medium">Voice message</span>
                      {attachment.duration && (
                        <span className="text-base text-muted-foreground ml-2">
                          {formatDuration(attachment.duration)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-destructive hover:bg-destructive/10 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 pr-8 rounded-lg border-2 border-border bg-muted/50 relative">
                    <X className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base truncate max-w-[150px]">{attachment.name}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-destructive hover:bg-destructive/10 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Inline Voice Recorder */}
        {isRecording && (
          <InlineVoiceRecorder
            onSend={handleAudioSend}
            onCancel={() => setIsRecording(false)}
          />
        )}

        <div className="flex items-end gap-2">
          <div className="flex-1 flex items-end gap-0.5 px-2 py-1">
            <div className="flex gap-0">
              {/* Hidden file inputs */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCameraCapture}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={handleVideoSelect}
              />

              {/* Plus Button - More Tools */}
              <AttachmentMenu
                onImageSelect={() => imageInputRef.current?.click()}
                onFileSelect={() => fileInputRef.current?.click()}
                onVideoSelect={() => videoInputRef.current?.click()}
                disabled={disabled || isRecording}
              />
              
              {/* Camera Button - Toast Only */}
              <Button
                onClick={handleCameraClick}
                variant="ghost"
                size="icon"
                disabled={disabled || isRecording}
                className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-[#54656f] hover:text-foreground"
              >
                <Camera className="h-5 w-5" />
              </Button>
              
              {/* Gift Button */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setIsGiftDialogOpen(true)}
                type="button"
                disabled={disabled || isRecording}
              >
                <Gift className="h-5 w-5" />
              </Button>

              {/* Quiz Game Button */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => onStartQuiz?.()}
                type="button"
                disabled={disabled || isRecording}
              >
                <Gamepad2 className="h-5 w-5" />
              </Button>

              {/* Text Input */}
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={disabled || isRecording}
                className="flex-1 min-h-[40px] max-h-[120px] resize-none border-0 bg-[#f0f2f5] dark:bg-[#2a2a2a] rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 py-2 px-2 text-base placeholder:text-[#667781]"
                rows={1}
              />
            </div>
          </div>

          {/* Dynamic Send/Voice Button */}
          {message.trim() || attachments.length > 0 ? (
            <Button
              onClick={handleSend}
              disabled={disabled || isRecording}
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full bg-[#00a884] hover:bg-[#00a884]/90 text-white"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              onClick={() => setIsRecording(true)}
              disabled={disabled || isRecording}
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full bg-[#00a884] hover:bg-[#00a884]/90 text-white"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
