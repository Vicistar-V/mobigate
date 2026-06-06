import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/types/chat";
import { formatMessageTime } from "@/data/chatData";
import { cn } from "@/lib/utils";
import mobichatLogo from "@/assets/mobiface-logo.png";
import { ChatAvatar } from "@/components/chat/ChatAvatar";

interface Props {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onBack?: () => void;
  onCloseSheet?: () => void;
  loading?: boolean;
}

export const ConversationsList = ({
  conversations, activeConversationId, onSelectConversation,
  onBack, onCloseSheet, loading = false,
}: Props) => {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter(c =>
    c.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full border-r border-border">
      {/* Header */}
      <div className="p-4 border-b-[6px] border-[hsl(252,73%,26%)] flex items-center justify-between gap-2 bg-[#f0e699]">
        {onBack ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <img src={mobichatLogo} alt="MobiChat" className="h-8 w-8 shrink-0" />
        )}
        <h2 className="font-bold text-lg flex-1 truncate">MobiChat</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search friend by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Title row */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-border">
        <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
          Chat Friends
        </span>
        <span className="text-xs text-primary cursor-pointer hover:underline">View all →</span>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading && !filtered.length ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading conversations...</p>
            </div>
          ) : !filtered.length ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Go to a user profile and tap Chat to start
              </p>
            </div>
          ) : filtered.map(conv => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                "hover:bg-accent",
                activeConversationId === conv.id && "bg-accent"
              )}
            >
              {/* Avatar — plain img, same as comments */}
              <Link
                to={`/profile/${conv.user.id}`}
                onClick={e => e.stopPropagation()}
                className="shrink-0"
              >
                <ChatAvatar
                  src={conv.user.avatar}
                  name={conv.user.name}
                  size={48}
                  isOnline={conv.user.isOnline}
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-semibold text-sm truncate">{conv.user.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {conv.unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {formatMessageTime(conv.lastMessageTime)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
