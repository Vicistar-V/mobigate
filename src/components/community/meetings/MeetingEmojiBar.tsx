import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FloatingEmoji {
  id: string;
  emoji: string;
  left: number;
}

interface MeetingEmojiBarProps {
  onEmojiSelect: (emoji: string) => void;
}

// Quick access emojis (shown in collapsed state)
const quickEmojis = ["😀", "😊", "👍", "❤️", "👏", "🎉", "😮", "😢"];

// Full emoji collection organized by categories
const emojiCategories = [
  {
    name: "Smileys & Emotions",
    icon: "😀",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊",
      "😇", "🥰", "😍", "🤩", "😘", "😗", "😋", "😛", "😜", "🤪",
      "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑",
      "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤",
      "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴",
      "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "😟"
    ]
  },
  {
    name: "Gestures & Hands",
    icon: "👍",
    emojis: [
      "👍", "👎", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✋", "🤚",
      "🖐", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇",
      "☝️", "👋", "🤏", "💪", "🦾", "🖖", "✍️", "🤳", "💅", "🦶",
      "🦵", "🤌", "👊", "✊", "🤛", "🤜", "🫰", "🫵", "🫶", "👌"
    ]
  },
  {
    name: "Hearts & Love",
    icon: "❤️",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️",
      "😻", "💑", "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", "💏", "😘", "😍", "🥰", "😚"
    ]
  },
  {
    name: "Celebration & Fun",
    icon: "🎉",
    emojis: [
      "🎉", "🎊", "🎈", "🎁", "🎀", "🎗️", "🏆", "🥇", "🥈", "🥉",
      "⭐", "🌟", "✨", "💫", "🔥", "💥", "💯", "🎯", "🚀", "🎸",
      "🎵", "🎶", "🎤", "🎧", "🎬", "🎪", "🎭", "🎨", "🎲", "🎮",
      "🎰", "🎳", "🎱", "🏅", "🎖️", "🏵️", "🎏", "🎐", "🎑", "🎄"
    ]
  },
  {
    name: "Reactions & Expressions",
    icon: "🤔",
    emojis: [
      "🤔", "😮", "😲", "😳", "🥺", "😢", "😭", "😤", "😠", "😡",
      "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻",
      "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀",
      "😿", "😾", "🫠", "🫣", "🫢", "🫡", "🫥", "🥱", "🤫", "🤭"
    ]
  },
  {
    name: "Animals & Nature",
    icon: "🐾",
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
      "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🦍",
      "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗",
      "🐴", "🦄", "🐝", "🦋", "🐌", "🐛", "🐜", "🐞", "🦀", "🐙"
    ]
  }
];

export const MeetingEmojiBar = ({ onEmojiSelect }: MeetingEmojiBarProps) => {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    
    // Create floating emoji
    const newEmoji: FloatingEmoji = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      left: Math.random() * 80 + 10,
    };
    
    setFloatingEmojis(prev => [...prev, newEmoji]);
    
    // Remove emoji after animation
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 2000);
  };

  return (
    <div className="relative w-full">
      {/* Floating Emojis */}
      <div className="absolute inset-x-0 bottom-16 pointer-events-none overflow-hidden h-32">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute animate-emoji-float"
            style={{
              left: `${item.left}%`,
              bottom: 0,
              fontSize: '2rem',
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Expanded Emoji Panel */}
      {isExpanded && (
        <div className="animate-fade-in bg-card/95 backdrop-blur-md border border-border rounded-t-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
            <span className="text-sm font-medium text-foreground">React to Meeting</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="h-4 w-4 mr-1" />
              Less
            </Button>
          </div>

          {/* Scrollable Emoji Grid */}
          <ScrollArea className="h-64">
            <div className="p-3 space-y-4">
              {emojiCategories.map((category) => (
                <div key={category.name}>
                  {/* Category Header */}
                  <div className="flex items-center gap-2 mb-2 sticky top-0 bg-card/80 backdrop-blur-sm py-1">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-xs font-medium text-muted-foreground">{category.name}</span>
                  </div>
                  
                  {/* Emoji Grid */}
                  <div className="grid grid-cols-8 gap-1">
                    {category.emojis.map((emoji, idx) => (
                      <Button
                        key={`${category.name}-${idx}`}
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-xl h-10 w-10 hover:scale-110 hover:bg-accent transition-all active:scale-95 rounded-lg"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Collapsed Emoji Bar */}
      <div className={cn(
        "flex items-center justify-between gap-2 p-3 bg-card/80 backdrop-blur-sm border-t border-border",
        isExpanded && "border-t-0"
      )}>
        <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
          <span className="text-xs text-muted-foreground mr-1 shrink-0">React:</span>
          {quickEmojis.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="icon"
              onClick={() => handleEmojiClick(emoji)}
              className="text-2xl h-10 w-10 hover:scale-125 transition-transform active:scale-95 shrink-0"
            >
              {emoji}
            </Button>
          ))}
        </div>
        
        {/* Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-9 px-3 text-xs shrink-0 border-primary/30 hover:border-primary hover:bg-primary/10"
        >
          {isExpanded ? (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Less
            </>
          ) : (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              More
            </>
          )}
        </Button>
      </div>

      <style>{`
        @keyframes emoji-float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-50px) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-120px) scale(1);
            opacity: 0;
          }
        }
        .animate-emoji-float {
          animation: emoji-float 2s ease-out forwards;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
