import * as React from "react";

import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  allowImagePaste?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, allowImagePaste = false, onPaste, ...props }, ref) => {
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      // Call custom onPaste handler first if provided
      if (onPaste) {
        onPaste(e);
      }

      // Check for image data in clipboard
      const items = e.clipboardData?.items;
      if (!items) return;

      const hasImage = Array.from(items).some(
        (item) => item.kind === "file" && item.type.startsWith("image/")
      );

      if (hasImage && !allowImagePaste) {
        e.preventDefault();
        toast({
          title: "Image pasting not supported",
          description: "Image pasting is not supported in this field",
          variant: "destructive",
        });
      }
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        onPaste={handlePaste}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
