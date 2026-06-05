import { useState, useEffect } from "react";

interface ChatAvatarProps {
  src?: string | null;
  name: string;
  size?: number;          // pixel size, default 48
  className?: string;
  isOnline?: boolean;
}

/**
 * Self-contained avatar that reliably shows a profile image.
 * - Uses a plain <img> (no Radix) so async src changes always render.
 * - Falls back to a colored initial circle if no image or load fails.
 * - Resets error state when the src changes (so new conversations work).
 */
export function ChatAvatar({ src, name, size = 48, className = "", isOnline }: ChatAvatarProps) {
  const [errored, setErrored] = useState(false);

  useEffect(() => { setErrored(false); }, [src]);

  const initial = (name || "U").charAt(0).toUpperCase();
  const showImage = src && src.trim().length > 0 && !errored;

  return (
    <div
      className={`relative shrink-0 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <img
          src={src as string}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span
          className="font-bold text-purple-700 select-none"
          style={{ fontSize: size * 0.4 }}
        >
          {initial}
        </span>
      )}
      {isOnline && (
        <span
          className="absolute bottom-0 right-0 bg-green-500 border-2 border-white rounded-full"
          style={{ width: size * 0.25, height: size * 0.25 }}
        />
      )}
    </div>
  );
}
