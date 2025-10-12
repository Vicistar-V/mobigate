import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder, Lock, Users, Globe } from "lucide-react";
import { Album } from "@/data/posts";
import { cn } from "@/lib/utils";

interface AlbumCardProps {
  album: Album & { isSystem?: boolean };
  onClick: () => void;
  variant?: "carousel" | "grid";
}

export const AlbumCard = ({ album, onClick, variant = "carousel" }: AlbumCardProps) => {
  const getPrivacyIcon = () => {
    if (album.privacy === "Private") return <Lock className="h-3 w-3" />;
    if (album.privacy === "Friends") return <Users className="h-3 w-3" />;
    return <Globe className="h-3 w-3" />;
  };

  return (
    <Card
      className={cn(
        "aspect-square overflow-hidden relative group cursor-pointer hover:scale-105 transition-transform duration-200",
        variant === "carousel" 
          ? "flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[200px]" 
          : "w-full"
      )}
      onClick={onClick}
    >
      {/* Album Cover Image */}
      {album.coverImage ? (
        <img
          src={album.coverImage}
          alt={album.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Folder className="h-12 w-12 text-primary/40" />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Privacy Badge */}
      <div className="absolute top-2 right-2 z-10">
        <Badge
          variant={album.privacy === "Private" ? "destructive" : "secondary"}
          className="backdrop-blur-sm bg-black/30 text-white border-0 gap-1 px-2 py-0.5"
        >
          {getPrivacyIcon()}
        </Badge>
      </div>

      {/* Album Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <h3 className="text-white text-sm sm:text-base font-semibold truncate mb-1">
          {album.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-xs">
            {album.itemCount} {album.itemCount === 1 ? "item" : "items"}
          </span>
          {album.isSystem && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-white/20 text-white border-white/30">
              System
            </Badge>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-200" />
    </Card>
  );
};
