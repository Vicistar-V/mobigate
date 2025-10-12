import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Paperclip, Send } from "lucide-react";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
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
    toast.info("Gallery coming soon!");
  };

  const handleFileAttach = () => {
    toast.info("File attachment coming soon!");
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="px-4 py-2.5 border-t flex items-center gap-2 bg-[#f9f9f9] border-[#e9edef] flex-shrink-0">
      {/* Gallery Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full text-[#54656f] hover:bg-[#e9e9e9]"
        onClick={handleGalleryClick}
        disabled={disabled}
      >
        <ImagePlus className="h-6 w-6" />
      </Button>

      {/* File Attachment */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full text-[#54656f] hover:bg-[#e9e9e9]"
        onClick={handleFileAttach}
        disabled={disabled}
      >
        <Paperclip className="h-6 w-6" />
      </Button>

      {/* Message Input */}
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 border-none bg-[#f0f2f5] rounded-[18px] px-4 py-2.5 text-[15px] outline-none resize-none max-h-[100px] focus:shadow-[0_0_0_2px_#00a884]"
        disabled={disabled}
        rows={1}
      />

      {/* Send Button */}
      <Button
        onClick={handleSend}
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full text-[#54656f] hover:bg-[#e9e9e9] bg-transparent"
        disabled={disabled || !message.trim()}
        variant="ghost"
      >
        <Send className="h-6 w-6" />
      </Button>
    </div>
  );
};
