import { 
  ImagePlus, 
  MessageSquare, 
  DollarSign, 
  FileText, 
  Sparkles, 
  PartyPopper,
  ChevronRight 
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

export type PostType = 
  | "gallery" 
  | "wall-status" 
  | "contents" 
  | "articles" 
  | "vibes" 
  | "special-events";

interface PostTypeOption {
  type: PostType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const postTypeOptions: PostTypeOption[] = [
  {
    type: "gallery",
    title: "Community Gallery",
    description: "Upload photos & videos to gallery albums",
    icon: <ImagePlus className="h-5 w-5" />,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    type: "wall-status",
    title: "Wall Status Posts",
    description: "Share updates, thoughts & polls with the community",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    type: "contents",
    title: "Community Contents",
    description: "Create monetized premium content",
    icon: <DollarSign className="h-5 w-5" />,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    type: "articles",
    title: "Community Articles",
    description: "Write long-form articles & news",
    icon: <FileText className="h-5 w-5" />,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    type: "vibes",
    title: "Community Vibes",
    description: "Post emotions, moods & vibes",
    icon: <Sparkles className="h-5 w-5" />,
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    type: "special-events",
    title: "Special Events",
    description: "Announce birthdays, achievements & milestones",
    icon: <PartyPopper className="h-5 w-5" />,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
];

interface CreatePostTypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: PostType) => void;
}

export function CreatePostTypeSelector({ 
  open, 
  onOpenChange, 
  onSelectType 
}: CreatePostTypeSelectorProps) {
  const handleSelect = (type: PostType) => {
    onOpenChange(false);
    // Small delay to allow drawer close animation
    setTimeout(() => {
      onSelectType(type);
    }, 150);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] flex flex-col touch-auto overflow-hidden">
        <DrawerHeader className="text-center pb-2">
          <DrawerTitle className="text-xl font-bold">Create Post</DrawerTitle>
          <DrawerDescription className="text-sm">
            Choose where to post your content
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="px-4 pb-6 max-h-[60vh] min-h-0 touch-auto">
          <div className="space-y-2">
            {postTypeOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleSelect(option.type)}
                className="w-full flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all active:scale-[0.98] text-left"
              >
                <div className={`p-3 rounded-xl ${option.color}`}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{option.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {option.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
