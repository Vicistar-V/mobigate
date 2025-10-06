import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface AdCardProps {
  image?: string;
  content?: string;
  timeRemaining?: string;
}

export const AdCard = ({ image, content, timeRemaining }: AdCardProps) => {
  return (
    <Card className="p-4 col-span-3 bg-muted/30">
      <div className="relative h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        {image ? (
          <>
            <img 
              src={image} 
              alt="Advertisement" 
              className="w-full h-full object-cover"
            />
            {content && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                <span className="text-white text-sm font-medium">{content}</span>
              </div>
            )}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">Ad Space 300x250</span>
        )}
        {timeRemaining && (
          <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {timeRemaining}
          </div>
        )}
      </div>
    </Card>
  );
};
