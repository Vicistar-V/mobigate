import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, MessageSquare, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CandidateComment {
  id: string;
  candidateName: string;
  candidateColor: string;
  comment: string;
  timestamp: Date;
}

interface CandidateCommentsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  officeName: string;
  comments: CandidateComment[];
}

// Generate unique but consistent identifiers for privacy
const getVoterIdentifier = (index: number) => {
  const identifiers = [
    "Voter #7291",
    "Member #4583",
    "Voter #8126",
    "Member #3947",
    "Voter #6052",
    "Member #2814",
    "Voter #9375",
    "Member #1628",
    "Voter #5439",
    "Member #7164"
  ];
  return identifiers[index % identifiers.length];
};

const getTimeAgo = (date: Date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const getCandidateColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500',
    purple: 'bg-purple-600',
    magenta: 'bg-pink-500',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
  };
  return colorMap[color] || 'bg-gray-500';
};

export const CandidateCommentsDrawer = ({
  open,
  onOpenChange,
  officeName,
  comments
}: CandidateCommentsDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] touch-auto overflow-hidden">
        <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
          {/* Fixed Header */}
          <DrawerHeader className="flex-shrink-0 px-4 pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <DrawerTitle className="text-lg">
                  Voter Comments
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription className="mt-1 text-left">
              {officeName} • {comments.length} Comment{comments.length !== 1 ? 's' : ''}
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable Content Area */}
          <ScrollArea className="flex-1 min-h-0 touch-auto">
            <div className="px-4 py-4">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground px-4">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment, index) => (
                    <div 
                      key={comment.id} 
                      className="bg-muted/50 rounded-xl p-4 border border-border"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full bg-muted flex-shrink-0">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {getVoterIdentifier(index)}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {getTimeAgo(comment.timestamp)}
                        </span>
                      </div>
                      
                      {/* Candidate Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getCandidateColorClass(comment.candidateColor)}`} />
                        <span className="text-xs text-muted-foreground">
                          on <span className="font-medium text-foreground">{comment.candidateName}</span>
                        </span>
                      </div>
                      
                      {/* Comment */}
                      <p className="text-sm text-foreground leading-relaxed break-words">
                        "{comment.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
