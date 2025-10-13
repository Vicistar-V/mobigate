import { Message } from "@/types/chat";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Reply, Forward, Edit, Trash2, Copy, Flag } from "lucide-react";
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

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];

export const MessageContextMenu = ({
  message,
  isOwnMessage,
  onReply,
  onEdit,
  onDelete,
  onReact,
  children,
}: MessageContextMenuProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success("Message copied to clipboard");
  };

  const handleForward = () => {
    toast.info("Forward feature coming soon");
  };

  const handleFlag = () => {
    toast.info("Message reported");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={() => onReply(message)}>
          <Reply className="mr-2 h-4 w-4" />
          Reply
        </ContextMenuItem>
        
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <span className="mr-2">😊</span>
            React
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {REACTION_EMOJIS.map((emoji) => (
              <ContextMenuItem
                key={emoji}
                onClick={() => onReact(message.id, emoji)}
                className="text-2xl justify-center"
              >
                {emoji}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuItem onClick={handleForward}>
          <Forward className="mr-2 h-4 w-4" />
          Forward
        </ContextMenuItem>

        {isOwnMessage && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onEdit(message.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => onDelete(message.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </>
        )}

        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Text
        </ContextMenuItem>
        
        {!isOwnMessage && (
          <ContextMenuItem onClick={handleFlag}>
            <Flag className="mr-2 h-4 w-4" />
            Report
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
