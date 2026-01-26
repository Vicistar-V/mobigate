import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  MessageCircle,
  Send,
  ThumbsUp,
  Flag,
  Clock,
  Search,
  Filter,
} from "lucide-react";

interface MemberCommentsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: ExecutiveMember;
  viewType: "add" | "view";
}

// Mock comments data
const mockComments = [
  {
    id: "1",
    authorName: "Adaeze Okonkwo",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "Excellent leadership! The transparency initiative has really improved trust in our community.",
    timestamp: "2024-01-15T10:30:00",
    likes: 24,
    isLiked: false,
    category: "general",
  },
  {
    id: "2",
    authorName: "Kwame Mensah",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "I appreciate the effort in organizing community events. The last one was fantastic!",
    timestamp: "2024-01-14T15:45:00",
    likes: 18,
    isLiked: true,
    category: "appreciation",
  },
  {
    id: "3",
    authorName: "Fatima Hassan",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    content: "Would love to see more youth programs. Our young members need more engagement opportunities.",
    timestamp: "2024-01-13T09:15:00",
    likes: 31,
    isLiked: false,
    category: "suggestion",
  },
  {
    id: "4",
    authorName: "Emmanuel Obi",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    content: "The financial reports have been very detailed. Keep up the good work!",
    timestamp: "2024-01-12T14:20:00",
    likes: 15,
    isLiked: false,
    category: "appreciation",
  },
  {
    id: "5",
    authorName: "Chiamaka Eze",
    authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    content: "Can we have more information about the building project timeline?",
    timestamp: "2024-01-11T11:00:00",
    likes: 8,
    isLiked: false,
    category: "question",
  },
];

const commentCategories = [
  { value: "all", label: "All Comments" },
  { value: "general", label: "General" },
  { value: "appreciation", label: "Appreciation" },
  { value: "suggestion", label: "Suggestions" },
  { value: "question", label: "Questions" },
];

export function MemberCommentsSheet({
  open,
  onOpenChange,
  member,
  viewType,
}: MemberCommentsSheetProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");
  const [commentCategory, setCommentCategory] = useState("general");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1,
        };
      }
      return c;
    }));
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please write something before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newCommentObj = {
      id: `new-${Date.now()}`,
      authorName: "You",
      authorImage: "",
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      category: commentCategory,
    };

    setComments(prev => [newCommentObj, ...prev]);
    setNewComment("");
    setIsSubmitting(false);

    toast({
      title: "Comment Posted",
      description: "Your comment has been submitted successfully",
    });
  };

  const handleReportComment = (commentId: string) => {
    toast({
      title: "Comment Reported",
      description: "Thank you for reporting. We'll review this comment.",
    });
  };

  const filteredComments = comments.filter(c => {
    const matchesCategory = filterCategory === "all" || c.category === filterCategory;
    const matchesSearch = c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      general: "bg-gray-100 text-gray-700",
      appreciation: "bg-green-100 text-green-700",
      suggestion: "bg-blue-100 text-blue-700",
      question: "bg-yellow-100 text-yellow-700",
    };
    return colors[category] || colors.general;
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Member Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-muted/30 shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.imageUrl} alt={member.name} />
          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{member.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{member.position}</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {comments.length} comments
        </Badge>
      </div>

      {/* Add Comment Section (if viewType is "add") */}
      {viewType === "add" && (
        <div className="p-4 border-b space-y-3 shrink-0">
          <Textarea
            placeholder={`Write a comment about ${member.name}...`}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex items-center gap-2">
            <Select value={commentCategory} onValueChange={setCommentCategory}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="appreciation">Appreciation</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
                <SelectItem value="question">Question</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleSubmitComment} 
              disabled={isSubmitting || !newComment.trim()}
              className="flex-1 h-10"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      )}

      {/* Search & Filter (if viewType is "view") */}
      {viewType === "view" && (
        <div className="p-4 border-b space-y-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="flex-1 h-10">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {commentCategories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Comments List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredComments.map((comment) => (
            <Card key={comment.id} className="overflow-hidden">
              <CardContent className="p-3 space-y-2">
                {/* Author row */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.authorImage} alt={comment.authorName} />
                    <AvatarFallback className="text-xs">{comment.authorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{comment.authorName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(comment.timestamp)}
                    </p>
                  </div>
                  <Badge className={`text-[10px] px-2 ${getCategoryBadge(comment.category)}`}>
                    {comment.category}
                  </Badge>
                </div>

                {/* Comment content */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {comment.content}
                </p>

                {/* Actions row */}
                <div className="flex items-center justify-between pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2 ${comment.isLiked ? 'text-primary' : ''}`}
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <ThumbsUp className={`h-4 w-4 mr-1 ${comment.isLiked ? 'fill-primary' : ''}`} />
                    <span className="text-xs">{comment.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                    onClick={() => handleReportComment(comment.id)}
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    <span className="text-xs">Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredComments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No comments found</p>
              {searchQuery && <p className="text-sm">Try adjusting your search</p>}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const title = viewType === "add" ? "Add Comment" : "View Comments";

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] h-[92vh] flex flex-col">
          <DrawerHeader className="shrink-0 pb-0 relative">
            <DrawerTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              {title}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-hidden">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="shrink-0 p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
