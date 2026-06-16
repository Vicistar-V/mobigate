import { Message } from "@/types/chat";
import {
  ContextMenu, ContextMenuContent, ContextMenuItem,
  ContextMenuSeparator, ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Reply, Edit, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

interface MessageContextMenuProps {
  message: Message;
  isOwnMessage: boolean;
  onReply: (message: Message) => void;
  onEdit: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  children: React.ReactNode;
}

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export const MessageContextMenu = ({
  message, isOwnMessage, onReply, onEdit, onDelete, onReact, children,
}: MessageContextMenuProps) => {

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      toast.success("Copied");
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="inline-block w-full">{children}</div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-56 bg-white dark:bg-[#2a2a2a] shadow-xl rounded-xl p-1">
        {/* Emoji reaction row at top */}
        <div className="flex justify-around px-1 py-2 border-b border-border mb-1">
          {EMOJIS.map(emoji => (
            <button
              key={emoji}
              onClick={() => onReact(message.id, emoji)}
              className="text-xl hover:scale-125 transition-transform p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {emoji}
            </button>
          ))}
        </div>

        <ContextMenuItem onClick={() => onReply(message)} className="rounded-lg">
          <Reply className="mr-2 h-4 w-4 text-[#00a884]" /> Reply
        </ContextMenuItem>

        <ContextMenuItem onClick={handleCopy} className="rounded-lg">
          <Copy className="mr-2 h-4 w-4 text-gray-500" /> Copy
        </ContextMenuItem>

        {isOwnMessage && (
          <ContextMenuItem onClick={() => onEdit(message.id)} className="rounded-lg">
            <Edit className="mr-2 h-4 w-4 text-blue-500" /> Edit
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => onDelete(message.id)}
          className="text-destructive rounded-lg"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isOwnMessage ? "Delete for everyone" : "Delete for me"}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
