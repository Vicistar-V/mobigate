import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { validateCommentContent } from "@/lib/commentUtils";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  loading?: boolean;
  userAvatar?: string;
  userName?: string;
  placeholder?: string;
}

export const CommentInput = ({
  onSubmit,
  loading = false,
  userAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  userName = "You",
  placeholder = "Write a comment...",
}: CommentInputProps) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = () => {
    const validation = validateCommentContent(content);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    onSubmit(content);
    setContent("");
    setError(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const remainingChars = 500 - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="space-y-2">
      <div className="flex gap-2 sm:gap-3">
        <Avatar className="h-7 w-7 sm:h-9 sm:w-9 flex-shrink-0">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="text-xs">{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[48px] sm:min-h-[64px] resize-none text-sm"
            disabled={loading}
          />
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xs ${
                isOverLimit
                  ? "text-destructive font-semibold"
                  : remainingChars < 50
                  ? "text-orange-600"
                  : "text-muted-foreground"
              }`}
            >
              {remainingChars} left
            </span>
            <Button
              onClick={handleSubmit}
              disabled={loading || content.trim().length === 0 || isOverLimit}
              size="sm"
              className="h-7 sm:h-8 gap-1.5 text-xs px-2.5 sm:px-3"
            >
              <Send className="h-3 w-3" />
              <span className="hidden xs:inline sm:inline">{loading ? "Posting..." : "Post"}</span>
            </Button>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
      <p className="text-xs text-muted-foreground pl-9 sm:pl-12 hidden sm:block">
        Tip: Press Ctrl+Enter to submit
      </p>
    </div>
  );
};