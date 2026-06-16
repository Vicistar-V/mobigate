import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChatAvatar } from "@/components/chat/ChatAvatar";
import { Conversation, Message } from "@/types/chat";
import { formatChatTime } from "@/data/chatData";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import { MessageContextMenu } from "./MessageContextMenu";
import { EditMessageDialog } from "./EditMessageDialog";
import {
  Video, Phone, MoreVertical, ArrowLeft, X,
  CheckCheck, Check, Paperclip, Play, Pause, Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useCurrentUserId } from "@/hooks/useWindowData";

interface ChatInterfaceProps {
  conversation: Conversation | undefined;
  isTyping: boolean;
  onSendMessage: (content: string, attachments?: {
    type: 'image' | 'file' | 'gift' | 'audio' | 'video';
    url: string; name: string; duration?: number; giftData?: any;
  }[]) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  selectedMessages: Set<string>;
  onToggleSelectMessage: (messageId: string) => void;
  onClearSelection: () => void;
  onDeleteSelectedMessages: () => void;
  onBack?: () => void;
  onCloseSheet?: () => void;
  onStartQuiz?: () => void;
  onExitQuiz?: () => void;
  isGameMode?: boolean;
}

const fmtDur = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export const ChatInterface = ({
  conversation, isTyping, onSendMessage, onEditMessage, onDeleteMessage,
  onReactToMessage, selectedMessages, onToggleSelectMessage, onClearSelection,
  onDeleteSelectedMessages, onBack, onCloseSheet, onStartQuiz,
  isGameMode = false,
}: ChatInterfaceProps) => {
  const currentUserId = useCurrentUserId();
  const scrollRef     = useRef<HTMLDivElement>(null);
  const [editingMsg,  setEditingMsg]  = useState<{ id: string; content: string } | null>(null);
  const [replyTo,     setReplyTo]     = useState<{ messageId: string; content: string; senderName: string } | null>(null);
  const [playingId,   setPlayingId]   = useState<string | null>(null);
  const [imgViewer,   setImgViewer]   = useState<string | null>(null);
  const isSelectionMode = selectedMessages.size > 0;

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [conversation?.messages, isTyping]);

  const handleReply = (msg: Message) => {
    const name = msg.senderId === currentUserId ? "You" : (conversation?.user.name || "User");
    setReplyTo({ messageId: msg.id, content: msg.content || "📎 Attachment", senderName: name });
  };

  const handleEdit = (id: string) => {
    const msg = conversation?.messages.find(m => m.id === id);
    if (msg) setEditingMsg({ id, content: msg.content });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this message?")) onDeleteMessage(id);
  };

  const handleSendMessage = (content: string, attachments?: any[]) => {
    (onSendMessage as any)(content, attachments, replyTo?.messageId, replyTo?.content, replyTo?.senderName);
    setReplyTo(null);
  };

  const handleAudioClick = (msgId: string) => {
    const el = document.getElementById(`audio-${msgId}`) as HTMLAudioElement;
    if (!el) return;
    if (playingId === msgId) { el.pause(); setPlayingId(null); }
    else {
      (document.getElementById(`audio-${playingId}`) as HTMLAudioElement)?.pause();
      el.play().then(() => setPlayingId(msgId)).catch(() => {});
    }
  };

  if (!conversation) return (
    <div className="flex-1 flex items-center justify-center bg-[#E5DDD5]">
      <div className="text-center bg-white/80 rounded-xl px-8 py-6 shadow">
        <p className="text-lg font-semibold text-[#111b21]">Select a conversation</p>
        <p className="text-sm text-[#667781] mt-1">Choose a contact to start chatting</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">

      {/* ── Full-screen image viewer ── */}
      {imgViewer && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setImgViewer(null)}>
          <img src={imgViewer} className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg" />
          <button className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70">
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* ── Multi-select bar ── */}
      {isSelectionMode && (
        <div className="px-4 py-3 bg-[#00a884] flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={onClearSelection}>
              <X className="h-5 w-5" />
            </Button>
            <span className="font-medium">{selectedMessages.size} selected</span>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20"
            onClick={onDeleteSelectedMessages}>
            Delete
          </Button>
        </div>
      )}

      {/* ── Header ── */}
      {!isSelectionMode && (
        <div className="px-2 py-2 bg-[#f0f2f5] flex items-center gap-2 border-b border-border shrink-0">
          {onBack && (
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link to={`/profile/${conversation.user.id}`} onClick={() => onCloseSheet?.()}
            className="flex items-center flex-1 min-w-0 hover:bg-black/5 rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors">
            <ChatAvatar src={conversation.user.avatar} name={conversation.user.name}
              size={40} isOnline={conversation.user.isOnline} className="mr-3 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-[#111b21] truncate text-sm leading-tight">
                {conversation.user.name}
              </p>
              <p className="text-xs font-medium" style={{ color: conversation.user.isOnline ? "#00a884" : "#667781" }}>
                {conversation.user.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </Link>
          <div className="flex items-center shrink-0">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#54656f]"
              onClick={() => toast.info("Video call coming soon")}>
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#54656f]"
              onClick={() => toast.info("Voice call coming soon")}>
              <Phone className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-[#54656f]">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onStartQuiz}>
                  <Gamepad2 className="h-4 w-4 mr-2" /> Start Quiz
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Coming soon")}>View Contact</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => toast.success("Blocked")}>Block User</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[#E5DDD5] px-2 py-3"
      >
        {conversation.messages.map(msg => {
          const isMe     = msg.senderId === currentUserId;
          const selected = selectedMessages.has(msg.id);

          return (
            /* Outer row — full width, flex row, aligns bubble left or right */
            <div
              key={msg.id}
              className={cn(
                "flex mb-2",
                isMe ? "flex-row-reverse" : "flex-row",
                isSelectionMode && "items-center gap-2"
              )}
            >
              {/* Selection checkbox */}
              {isSelectionMode && (
                <Checkbox
                  checked={selected}
                  onCheckedChange={() => onToggleSelectMessage(msg.id)}
                  className="h-5 w-5 shrink-0"
                />
              )}

              {/* Bubble — max 72% width */}
              <div className={cn("max-w-[72%]", isMe ? "ml-auto" : "mr-auto")}>
                <MessageContextMenu
                  message={msg} isOwnMessage={isMe}
                  onReply={handleReply} onEdit={handleEdit}
                  onDelete={handleDelete} onReact={onReactToMessage}
                >
                  <div
                    className={cn(
                      "rounded-2xl shadow-sm overflow-hidden",
                      isMe
                        ? "bg-[#d9fdd3] rounded-tr-sm"
                        : "bg-white rounded-tl-sm",
                      selected && "ring-2 ring-[#00a884]"
                    )}
                    onClick={() => isSelectionMode && onToggleSelectMessage(msg.id)}
                  >
                    {/* Reply quote */}
                    {msg.replyTo && (
                      <div className={cn(
                        "mx-2 mt-2 pl-3 border-l-[3px] border-[#00a884] rounded-r-lg py-1.5 pr-2",
                        isMe ? "bg-[#b7f5ca]" : "bg-gray-100"
                      )}>
                        <p className="text-[11px] font-bold text-[#00a884] leading-tight">
                          {msg.replyTo.senderName}
                        </p>
                        <p className="text-[11px] text-[#667781] mt-0.5 line-clamp-2 leading-snug">
                          {msg.replyTo.content}
                        </p>
                      </div>
                    )}

                    {/* Attachments */}
                    {msg.attachments?.map((att, i) => (
                      <div key={i}>
                        {att.type === "image" && (
                          <img
                            src={att.url}
                            alt={att.name}
                            className="w-full max-w-[260px] object-cover cursor-pointer block"
                            style={{ maxHeight: 280 }}
                            onClick={e => { e.stopPropagation(); setImgViewer(att.url); }}
                          />
                        )}
                        {att.type === "video" && (
                          <video
                            src={att.url}
                            controls
                            className="w-full max-w-[260px] block"
                            style={{ maxHeight: 240 }}
                          />
                        )}
                        {att.type === "audio" && (
                          <div className="flex items-center gap-2 px-3 py-2 w-[240px]">
                            <button
                              onClick={e => { e.stopPropagation(); handleAudioClick(msg.id); }}
                              className={cn(
                                "h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                isMe ? "bg-[#00a884] text-white" : "bg-[#00a884] text-white"
                              )}>
                              {playingId === msg.id
                                ? <Pause className="h-4 w-4" />
                                : <Play className="h-4 w-4 ml-0.5" />}
                            </button>
                            <div className="flex-1 flex items-end gap-px h-8">
                              {Array.from({ length: 24 }).map((_, j) => (
                                <div key={j}
                                  className="rounded-full transition-colors"
                                  style={{
                                    width: 3,
                                    height: `${[4, 8, 14, 20, 14, 8, 4, 10, 18, 24, 18, 10, 6, 12, 22, 16, 8, 20, 14, 6, 16, 10, 18, 8][j] || 8}px`,
                                    background: playingId === msg.id ? "#00a884" : isMe ? "#64b5a0" : "#aaa",
                                  }} />
                              ))}
                            </div>
                            <span className="text-[11px] text-[#667781] tabular-nums shrink-0 w-9 text-right">
                              {att.duration ? fmtDur(att.duration) : "0:00"}
                            </span>
                            <audio id={`audio-${msg.id}`} src={att.url}
                              onEnded={() => setPlayingId(null)} className="hidden" />
                          </div>
                        )}
                        {att.type === "gift" && att.giftData && (
                          <div className="px-3 py-2 bg-gradient-to-br from-pink-50 to-purple-50 border-b border-pink-100">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{att.giftData.icon || "🎁"}</span>
                              <div>
                                <p className="font-semibold text-pink-900 text-sm leading-tight">{att.giftData.name}</p>
                                <p className="text-xs text-pink-600">{att.giftData.mobiValue?.toLocaleString()} Mobi</p>
                                {att.giftData.category && (
                                  <Badge className="mt-0.5 text-[10px] h-4 bg-pink-200 text-pink-800 border-0 px-1">
                                    {att.giftData.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        {att.type === "file" && (
                          <a href={att.url} download={att.name} target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 px-3 py-2 hover:bg-black/5 max-w-[240px]"
                            onClick={e => e.stopPropagation()}>
                            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                              <Paperclip className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate text-[#111b21]">{att.name}</p>
                              <p className="text-xs text-[#667781]">Tap to download</p>
                            </div>
                          </a>
                        )}
                      </div>
                    ))}

                    {/* Text content */}
                    {msg.content && (
                      <p className="px-3 py-2 text-sm text-[#111b21] break-words leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}

                    {/* Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="px-3 pb-1 flex flex-wrap gap-1">
                        {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => {
                          const count = msg.reactions!.filter(r => r.emoji === emoji).length;
                          const mine  = msg.reactions!.some(r => r.emoji === emoji && r.userId === currentUserId);
                          return (
                            <button key={emoji}
                              onClick={e => { e.stopPropagation(); onReactToMessage(msg.id, emoji); }}
                              className={cn(
                                "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border transition-colors",
                                mine ? "bg-[#00a884]/15 border-[#00a884]/40" : "bg-white/70 border-gray-200 hover:bg-gray-50"
                              )}>
                              {emoji}
                              {count > 1 && <span className="font-medium text-[10px] ml-0.5 text-[#667781]">{count}</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Footer: time + status */}
                    <div className={cn(
                      "flex items-center gap-1 px-3 pb-2",
                      isMe ? "justify-end" : "justify-start"
                    )}>
                      {msg.isEdited && (
                        <span className="text-[10px] text-[#667781] italic">edited</span>
                      )}
                      <span className="text-[10px] text-[#667781] tabular-nums">
                        {formatChatTime(msg.timestamp)}
                      </span>
                      {isMe && (
                        msg.isRead
                          ? <CheckCheck className="h-[13px] w-[13px] text-[#00a884] shrink-0" />
                          : <Check className="h-[13px] w-[13px] text-[#667781] shrink-0" />
                      )}
                    </div>
                  </div>
                </MessageContextMenu>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-row mb-2">
            <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm px-4 py-2.5 flex items-center gap-1.5 mr-auto">
              {[0, 160, 320].map(d => (
                <span key={d}
                  className="w-2 h-2 bg-[#667781] rounded-full animate-bounce"
                  style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={false}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        recipientName={conversation.user.name}
        onStartQuiz={onStartQuiz}
      />

      {/* ── Edit dialog ── */}
      <EditMessageDialog
        open={!!editingMsg}
        onOpenChange={open => !open && setEditingMsg(null)}
        initialContent={editingMsg?.content || ""}
        onSave={content => {
          if (editingMsg) { onEditMessage(editingMsg.id, content); setEditingMsg(null); }
        }}
      />
    </div>
  );
};
