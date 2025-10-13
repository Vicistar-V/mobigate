import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Paperclip, Send, X } from "lucide-react";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: { type: 'image' | 'file'; url: string; name: string }[]) => void;
  disabled?: boolean;
  replyTo?: { messageId: string; content: string; senderName: string };
  onCancelReply?: () => void;
}

export const ChatInput = ({ onSendMessage, disabled, replyTo, onCancelReply }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<{ type: 'image' | 'file'; url: string; name: string }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((message.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(message, attachments.length > 0 ? attachments : undefined);
      setMessage("");
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      if (onCancelReply) {
        onCancelReply();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleGalleryClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachments((prev) => [
            ...prev,
            {
              type: 'image',
              url: event.target!.result as string,
              name: file.name,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachments((prev) => [
            ...prev,
            {
              type: 'file',
              url: event.target!.result as string,
              name: file.name,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="border-t bg-[#f9f9f9] border-[#e9edef] flex-shrink-0">
      {/* Reply Preview */}
      {replyTo && (
        <div className="px-4 py-2 bg-[#e9edef] flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#00a884] font-medium">Replying to {replyTo.senderName}</p>
            <p className="text-sm text-[#667781] truncate">{replyTo.content}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full text-[#54656f] hover:bg-[#e9e9e9]"
            onClick={onCancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 bg-white border-b border-[#e9edef] flex gap-2 overflow-x-auto max-w-full">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative group">
              {attachment.type === 'image' ? (
                <div className="relative flex-shrink-0">
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="h-20 w-20 object-cover rounded-lg border border-[#e9edef]"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#f9f9f9] hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="relative min-w-[120px] max-w-[160px] p-2 bg-white border border-[#e9edef] rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="h-4 w-4 text-[#54656f] flex-shrink-0" />
                    <span className="text-xs text-[#111b21] truncate">{attachment.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#f9f9f9] hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="px-2 sm:px-4 py-2.5 flex items-center gap-1 sm:gap-2">
        {/* Hidden File Inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={handleImageSelect}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.zip"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Gallery Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full text-[#54656f] hover:bg-[#e9e9e9]"
          onClick={handleGalleryClick}
          disabled={disabled}
        >
          <ImagePlus className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        {/* File Attachment */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full text-[#54656f] hover:bg-[#e9e9e9]"
          onClick={handleFileAttach}
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        {/* Message Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="flex-1 min-w-0 resize-none rounded-lg px-3 py-2 text-base leading-6 bg-white border-none outline-none focus:ring-0 max-h-24 overflow-y-auto"
          rows={1}
          disabled={disabled}
          style={{ height: "auto" }}
        />

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-[#00a884] hover:bg-[#00a884]/90 text-white"
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </div>
  );
};
