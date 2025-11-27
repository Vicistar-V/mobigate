import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FloatingEmoji {
  id: string;
  emoji: string;
  left: number;
}

interface MeetingEmojiBarProps {
  onEmojiSelect: (emoji: string) => void;
}

const emojis = ["😀", "😊", "👍", "❤️", "👏", "🎉", "😮", "😢"];

export const MeetingEmojiBar = ({ onEmojiSelect }: MeetingEmojiBarProps) => {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    
    // Create floating emoji
    const newEmoji: FloatingEmoji = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      left: Math.random() * 80 + 10, // Random position 10-90%
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

      {/* Emoji Bar */}
      <div className="flex items-center justify-center gap-2 p-3 bg-card/80 backdrop-blur-sm border-t border-border">
        <p className="text-xs text-muted-foreground mr-2">React:</p>
        {emojis.map((emoji) => (
          <Button
            key={emoji}
            variant="ghost"
            size="icon"
            onClick={() => handleEmojiClick(emoji)}
            className="text-2xl h-10 w-10 hover:scale-125 transition-transform active:scale-95"
          >
            {emoji}
          </Button>
        ))}
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
      `}</style>
    </div>
  );
};
