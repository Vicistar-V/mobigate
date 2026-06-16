import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Mic, Gift, Gamepad2, MoreVertical, Camera, ImageIcon, FileIcon, Video } from "lucide-react";
import { useRef, useState } from "react";
import { SendGiftDialog, GiftSelection } from "./SendGiftDialog";
import { InlineVoiceRecorder } from "./InlineVoiceRecorder";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const API = "/api";

interface Attachment {
  type: 'image' | 'file' | 'gift' | 'audio' | 'video';
  url: string;
  name: string;
  duration?: number;
  giftData?: any;
}

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: Attachment[], replyToId?: string) => void;
  disabled?: boolean;
  replyTo?: { messageId: string; content: string; senderName: string } | null;
  onCancelReply?: () => void;
  recipientName?: string;
  onStartQuiz?: () => void;
}

// Upload any file to the server and return the public URL
async function uploadFile(file: File): Promise<{ url: string; name: string; type: string } | null> {
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API}/chat/upload.php`, { method: "POST", credentials: "include", body: fd });
    const data = await res.json();
    if (!data.url) throw new Error(data.error || "Upload failed");
    return { url: data.url, name: data.name || file.name, type: data.type || "file" };
  } catch (e: any) {
    toast.error(e.message || "Upload failed");
    return null;
  }
}

export const ChatInput = ({ onSendMessage, disabled, replyTo, onCancelReply, recipientName = "User", onStartQuiz }: ChatInputProps) => {
  const [message,         setMessage]         = useState("");
  const [attachments,     setAttachments]      = useState<Attachment[]>([]);
  const [isGiftOpen,      setIsGiftOpen]       = useState(false);
  const [isRecording,     setIsRecording]      = useState(false);
  const [uploading,       setUploading]        = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageRef    = useRef<HTMLInputElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const videoRef    = useRef<HTMLInputElement>(null);
  const cameraRef   = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() && !attachments.length) return;
    onSendMessage(message, attachments, replyTo?.messageId);
    setMessage("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // Generic file upload handler — uploads to server, stores permanent URL
  const handleFilesSelected = async (files: FileList | null, expectedType?: string) => {
    if (!files || !files.length) return;
    if (attachments.length >= 5) { toast.error("Max 5 attachments"); return; }
    setUploading(true);
    const toProcess = Array.from(files).slice(0, 5 - attachments.length);
    const results: Attachment[] = [];
    for (const file of toProcess) {
      if (file.size > 100 * 1024 * 1024) { toast.error(`${file.name} too large (max 100MB)`); continue; }
      toast.loading(`Uploading ${file.name}...`, { id: file.name });
      const result = await uploadFile(file);
      toast.dismiss(file.name);
      if (result) {
        results.push({ type: result.type as Attachment["type"], url: result.url, name: result.name });
        toast.success(`${file.name} uploaded`);
      }
    }
    if (results.length) setAttachments(prev => [...prev, ...results].slice(0, 5));
    setUploading(false);
  };

  // Voice message — upload blob to server, then send
  const handleAudioSend = async (audioData: { url: string; name: string; duration: number; blob: Blob }) => {
    setIsRecording(false);
    setUploading(true);
    toast.loading("Sending voice message...", { id: "voice" });
    const file   = new File([audioData.blob], audioData.name, { type: audioData.blob.type });
    const result = await uploadFile(file);
    toast.dismiss("voice");
    setUploading(false);
    if (result) {
      onSendMessage("", [{ type: "audio", url: result.url, name: result.name, duration: audioData.duration }], replyTo?.messageId);
    } else {
      toast.error("Failed to send voice message");
    }
  };

  const handleGiftSend = (giftData: GiftSelection) => {
    onSendMessage(`🎁 Sent a gift: ${giftData.giftData.name}`, [{ type: "gift", url: "", name: giftData.giftData.name, giftData: giftData.giftData }]);
    setIsGiftOpen(false);
  };

  const removeAttachment = (i: number) => setAttachments(prev => prev.filter((_, idx) => idx !== i));

  const previewIcon = (att: Attachment) => {
    if (att.type === "image") return <img src={att.url} className="h-full w-full object-cover" alt={att.name} />;
    if (att.type === "video") return <video src={att.url} className="h-full w-full object-cover" />;
    if (att.type === "audio") return <div className="flex items-center justify-center h-full"><Mic className="h-6 w-6 text-[#00a884]" /></div>;
    if (att.type === "gift") return <div className="flex items-center justify-center h-full text-lg">🎁</div>;
    return <div className="flex items-center justify-center h-full"><FileIcon className="h-6 w-6 text-blue-500" /></div>;
  };

  return (
    <>
      <SendGiftDialog
        isOpen={isGiftOpen}
        onClose={() => setIsGiftOpen(false)}
        recipientName={recipientName}
        onSendGift={handleGiftSend}
      />

      <div className="relative px-2 py-2 bg-[#f0f2f5] dark:bg-[#1e1e1e] border-t border-border">
        {/* Reply preview */}
        {replyTo && (
          <div className="flex items-center gap-2 mb-2 bg-white dark:bg-[#2a2a2a] rounded-lg px-3 py-2 border-l-4 border-[#00a884]">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#00a884]">{replyTo.senderName}</p>
              <p className="text-xs text-muted-foreground truncate">{replyTo.content}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={onCancelReply}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Attachment previews */}
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {attachments.map((att, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-border">
                {previewIcon(att)}
                <button
                  onClick={() => removeAttachment(i)}
                  className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-black/80"
                >×</button>
                {att.type === "audio" && att.duration && (
                  <span className="absolute bottom-0.5 left-0 right-0 text-center text-[10px] text-white bg-black/50">{Math.floor(att.duration / 60)}:{String(att.duration % 60).padStart(2, "0")}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Voice recorder */}
        {isRecording && (
          <InlineVoiceRecorder onSend={handleAudioSend} onCancel={() => setIsRecording(false)} />
        )}

        {/* Input row */}
        <div className="flex items-end gap-1">
          {/* Hidden inputs */}
          <input ref={imageRef}  type="file" accept="image/*"  multiple className="hidden" onChange={e => handleFilesSelected(e.target.files)} />
          <input ref={fileRef}   type="file" multiple          className="hidden" onChange={e => handleFilesSelected(e.target.files)} />
          <input ref={videoRef}  type="file" accept="video/*"  multiple className="hidden" onChange={e => handleFilesSelected(e.target.files)} />
          <input ref={cameraRef} type="file" accept="image/*"  capture="environment" className="hidden" onChange={e => handleFilesSelected(e.target.files)} />

          {/* Attachment button (+) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={disabled || isRecording || uploading} className="h-9 w-9 shrink-0 text-[#54656f] hover:text-foreground">
                <span className="text-xl font-light">+</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white dark:bg-gray-800 z-50">
              <DropdownMenuItem onClick={() => imageRef.current?.click()}>
                <ImageIcon className="h-4 w-4 mr-2 text-pink-500" /> Photo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => videoRef.current?.click()}>
                <Video className="h-4 w-4 mr-2 text-blue-500" /> Video
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileRef.current?.click()}>
                <FileIcon className="h-4 w-4 mr-2 text-orange-500" /> File / Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => cameraRef.current?.click()}>
                <Camera className="h-4 w-4 mr-2 text-green-500" /> Camera
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeout(() => setIsGiftOpen(true), 150)}>
                <Gift className="h-4 w-4 mr-2 text-purple-500" /> Send Gift
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStartQuiz?.()}>
                <Gamepad2 className="h-4 w-4 mr-2 text-indigo-500" /> Start Quiz
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Text area */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={uploading ? "Uploading..." : "Type a message..."}
            disabled={disabled || isRecording || uploading}
            className="flex-1 min-h-[40px] max-h-[120px] resize-none border-0 bg-white dark:bg-[#2a2a2a] rounded-lg focus-visible:ring-0 py-2 px-3 text-sm placeholder:text-[#667781]"
            rows={1}
          />

          {/* Send / Mic */}
          {message.trim() || attachments.length > 0 ? (
            <Button onClick={handleSend} disabled={disabled || uploading} size="icon"
              className="h-10 w-10 shrink-0 rounded-full bg-[#00a884] hover:bg-[#00a884]/90 text-white">
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button onClick={() => setIsRecording(true)} disabled={disabled || isRecording || uploading} size="icon"
              className="h-10 w-10 shrink-0 rounded-full bg-[#00a884] hover:bg-[#00a884]/90 text-white">
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
