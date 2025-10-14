import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Conversation, Message } from "@/types/chat";
import { formatChatTime } from "@/data/chatData";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import { MessageContextMenu } from "./MessageContextMenu";
import { EditMessageDialog } from "./EditMessageDialog";
import { GiftsAndGamesMenu } from "./GiftsAndGamesMenu";
import { SendGiftDialog, GiftSelection } from "./SendGiftDialog";
import { Video, Phone, MoreVertical, ArrowLeft, X, CheckCheck, Check, Paperclip, Gift, Mic, Play, Pause, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ChatInterfaceProps {
  conversation: Conversation | undefined;
  isTyping: boolean;
  onSendMessage: (content: string, attachments?: { type: 'image' | 'file' | 'gift' | 'audio'; url: string; name: string; duration?: number; giftData?: any }[]) => void;
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

export const ChatInterface = ({
  conversation,
  isTyping,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
  selectedMessages,
  onToggleSelectMessage,
  onClearSelection,
  onDeleteSelectedMessages,
  onBack,
  onCloseSheet,
  onStartQuiz,
  onExitQuiz,
  isGameMode = false,
}: ChatInterfaceProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
  const [replyTo, setReplyTo] = useState<{ messageId: string; content: string; senderName: string } | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const isSelectionMode = selectedMessages.size > 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages, isTyping]);

  const handleVideoCall = () => {
    toast.success(`Starting video call with ${conversation?.user.name}...`);
  };

  const handleVoiceCall = () => {
    toast.success(`Starting voice call with ${conversation?.user.name}...`);
  };

  const handleReply = (message: Message) => {
    const senderName = message.senderId === "current-user" ? "You" : conversation?.user.name || "Unknown";
    setReplyTo({
      messageId: message.id,
      content: message.content,
      senderName,
    });
  };

  const handleEdit = (messageId: string) => {
    const message = conversation?.messages.find((m) => m.id === messageId);
    if (message) {
      setEditingMessage({ id: messageId, content: message.content });
    }
  };

  const handleSaveEdit = (newContent: string) => {
    if (editingMessage) {
      onEditMessage(editingMessage.id, newContent);
      setEditingMessage(null);
    }
  };

  const handleDelete = (messageId: string) => {
    if (confirm("Delete this message?")) {
      onDeleteMessage(messageId);
    }
  };

  const handleAudioPlayback = (messageId: string, audioUrl: string) => {
    const audioElement = document.getElementById(`audio-${messageId}`) as HTMLAudioElement;
    
    if (!audioElement) return;
    
    if (playingAudioId === messageId) {
      audioElement.pause();
      setPlayingAudioId(null);
    } else {
      if (playingAudioId) {
        const currentAudio = document.getElementById(`audio-${playingAudioId}`) as HTMLAudioElement;
        currentAudio?.pause();
      }
      
      audioElement.play();
      setPlayingAudioId(messageId);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">
            Select a conversation
          </p>
          <p className="text-sm text-muted-foreground">
            Choose a contact to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Selection Mode Action Bar */}
      {isSelectionMode && (
        <div className="px-4 py-3 bg-[#00a884] flex items-center justify-between text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={onClearSelection}
            >
              <X className="h-5 w-5" />
            </Button>
            <span className="font-medium">{selectedMessages.size} selected</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={onDeleteSelectedMessages}
          >
            Delete
          </Button>
        </div>
      )}

      {/* Chat Header */}
      {!isSelectionMode && (
        <div className="px-4 py-[10px] border-b flex items-center bg-[#f9f9f9] border-[#e9edef] flex-shrink-0">
          {onBack && (
            <Button
              variant="ghost"
              className="h-auto w-auto p-2 rounded-full text-[#54656f] hover:bg-[#e9e9e9] mr-2 sm:hidden"
              onClick={onBack}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          
          <Link
            to={`/profile/${conversation.user.id}`}
            className="flex items-center flex-1 min-w-0 hover:bg-[#f5f6f6] rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors"
            onClick={() => onCloseSheet?.()}
          >
            <div className="relative mr-[15px] shrink-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.user.avatar} />
                <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
              </Avatar>
              {conversation.user.isOnline && (
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-[#00a884] border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#111b21] text-lg">{conversation.user.name}</h3>
              <p className="text-[15px] text-[#667781]">
                {isGameMode ? (
                  <span className="flex items-center gap-1">
                    <Gamepad2 className="h-3 w-3" />
                    Playing Quiz
                  </span>
                ) : conversation.user.isOnline ? (
                  "online"
                ) : (
                  "Offline"
                )}
              </p>
            </div>
          </Link>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="h-auto w-auto p-2 rounded-full text-[#54656f] hover:bg-[#e9e9e9] ml-2"
              onClick={handleVideoCall}
            >
              <Video className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              className="h-auto w-auto p-2 rounded-full text-[#54656f] hover:bg-[#e9e9e9] ml-2"
              onClick={handleVoiceCall}
            >
              <Phone className="h-6 w-6" />
            </Button>

            {/* Gifts & Games Menu */}
            <GiftsAndGamesMenu
              onGiftClick={() => setIsGiftDialogOpen(true)}
              onQuizClick={() => onStartQuiz?.()}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto w-auto p-2 rounded-full text-[#54656f] hover:bg-[#e9e9e9] ml-2">
                  <MoreVertical className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.info("View contact info")}>
                  View Contact
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Notifications muted")}>
                  Mute Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Chat cleared")}>
                  Clear Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Coming soon")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("User blocked")} className="text-destructive">
                  Block User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Messages Area - Full Height */}
      <div
        className="flex-1 p-5 overflow-y-auto flex flex-col bg-[#E5DDD5]"
        style={{
          backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAA1BMVEXm5+i+5p7XAAAAR0lEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADeDcYqAAE0I2HfAAAAAElFTkSuQmCC")',
        }}
        ref={scrollRef}
      >
        {conversation.messages.map((message) => {
          const isCurrentUser = message.senderId === "current-user";
          const isSelected = selectedMessages.has(message.id);

          return (
            <MessageContextMenu
              key={message.id}
              message={message}
              isOwnMessage={isCurrentUser}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReact={onReactToMessage}
            >
              <div
                className={cn(
                  "flex gap-2 mb-4 max-w-[85%] sm:max-w-[70%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                  isCurrentUser ? "self-end" : "self-start"
                )}
              >
                {isSelectionMode && (
                  <div className="flex items-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelectMessage(message.id)}
                      className="h-5 w-5"
                    />
                  </div>
                )}
                <div
                  className={cn(
                    "px-2 sm:px-3 py-2 rounded-lg shadow-sm relative group",
                    isCurrentUser ? "bg-[#d9fdd3] rounded-br-none" : "bg-white rounded-bl-none",
                    isSelected && "ring-2 ring-[#00a884]"
                  )}
                  onClick={() => isSelectionMode && onToggleSelectMessage(message.id)}
                >
                  {/* Reply Preview */}
                  {message.replyTo && (
                    <div className="mb-2 p-2 bg-black/5 rounded border-l-2 border-[#00a884]">
                      <p className="text-xs text-[#00a884] font-medium">{message.replyTo.senderName}</p>
                      <p className="text-xs text-[#667781] truncate">{message.replyTo.content}</p>
                    </div>
                  )}

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div key={idx}>
                          {attachment.type === 'image' ? (
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="max-w-[240px] sm:max-w-[300px] w-full rounded-lg cursor-pointer"
                              onClick={() => window.open(attachment.url, '_blank')}
                            />
                          ) : attachment.type === 'gift' && attachment.giftData ? (
                            <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-2 border-pink-200 dark:border-pink-800">
                              <div className="flex items-center gap-3">
                                {attachment.giftData.icon && (
                                  <span className="text-4xl">{attachment.giftData.icon}</span>
                                )}
                                {!attachment.giftData.icon && (
                                  <Gift className="h-10 w-10 text-pink-500" />
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold text-pink-900 dark:text-pink-100">
                                    {attachment.giftData.name}
                                  </p>
                                  <p className="text-sm text-pink-700 dark:text-pink-300">
                                    {attachment.giftData.mobiValue.toLocaleString()} Mobi
                                  </p>
                                  {attachment.giftData.category && (
                                    <Badge className="mt-1 text-xs bg-pink-200 dark:bg-pink-900 text-pink-800 dark:text-pink-200 border-0">
                                      {attachment.giftData.category}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : attachment.type === 'audio' ? (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f0f2f5] dark:bg-[#2a2a2a] min-w-[200px] max-w-[300px]">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full bg-[#00a884] hover:bg-[#00a884]/90 text-white shrink-0"
                                onClick={() => handleAudioPlayback(message.id, attachment.url)}
                              >
                                {playingAudioId === message.id ? (
                                  <Pause className="h-5 w-5" />
                                ) : (
                                  <Play className="h-5 w-5 ml-0.5" />
                                )}
                              </Button>
                              
                              <div className="flex-1 flex items-center gap-0.5 h-8">
                                {[...Array(15)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1 bg-[#00a884] rounded-full"
                                    style={{
                                      height: `${Math.random() * 24 + 8}px`,
                                      opacity: playingAudioId === message.id ? 1 : 0.5
                                    }}
                                  />
                                ))}
                              </div>
                              
                              <span className="text-xs text-[#667781] shrink-0">
                                {attachment.duration ? formatDuration(attachment.duration) : '0:00'}
                              </span>
                              
                              <audio
                                id={`audio-${message.id}`}
                                src={attachment.url}
                                onEnded={() => setPlayingAudioId(null)}
                                className="hidden"
                              />
                            </div>
                          ) : (
                            <a
                              href={attachment.url}
                              download={attachment.name}
                              className="flex items-center gap-2 p-2 bg-black/5 rounded hover:bg-black/10"
                            >
                              <Paperclip className="h-4 w-4 text-[#54656f]" />
                              <span className="text-sm text-[#111b21]">{attachment.name}</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Content */}
                  {message.content && (
                    <p className="text-base text-[#111b21] break-words mb-1">{message.content}</p>
                  )}

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1 mt-1 mb-1">
                      {Array.from(new Set(message.reactions.map((r) => r.emoji))).map((emoji) => {
                        const count = message.reactions!.filter((r) => r.emoji === emoji).length;
                        return (
                          <span
                            key={emoji}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-black/5 rounded-full text-xs"
                          >
                            {emoji} {count > 1 && count}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Message Footer */}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-[#667781]">
                      {formatChatTime(message.timestamp)}
                    </span>
                    {message.isEdited && (
                      <span className="text-xs text-[#667781] italic">• edited</span>
                    )}
                    {isCurrentUser && (
                      <span className="text-xs text-[#667781] ml-1">
                        {message.isRead ? <CheckCheck className="h-3 w-3 text-[#00a884]" /> : <Check className="h-3 w-3" />}
                      </span>
                    )}
                  </div>

                  {/* Selection checkbox on hover (non-selection mode) */}
                  {!isSelectionMode && (
                    <div
                      className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelectMessage(message.id);
                      }}
                    >
                      <Checkbox className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </div>
            </MessageContextMenu>
          );
        })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex self-start mb-4">
              <div className="bg-white rounded-lg rounded-bl-none shadow-sm px-3 py-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-[#9E9E9E] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[#9E9E9E] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[#9E9E9E] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={onSendMessage}
        disabled={isTyping}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        recipientName={conversation.user.name}
      />

      {/* Edit Message Dialog */}
      <EditMessageDialog
        open={editingMessage !== null}
        onOpenChange={(open) => !open && setEditingMessage(null)}
        initialContent={editingMessage?.content || ""}
        onSave={handleSaveEdit}
      />

      {/* Send Gift Dialog */}
      <SendGiftDialog
        isOpen={isGiftDialogOpen}
        onClose={() => setIsGiftDialogOpen(false)}
        recipientName={conversation.user.name}
        onSendGift={handleGiftSend}
      />
    </div>
  );
};
