import * as React from "react";

import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export interface InputProps extends React.ComponentProps<"input"> {
  allowImagePaste?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, allowImagePaste = false, onPaste, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (onClick) {
        onClick(e);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
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
      <input
        type={type}
        dir="ltr"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-base text-left ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm touch-manipulation",
          className,
        )}
        ref={ref}
        onPaste={handlePaste}
        onClick={handleClick}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
