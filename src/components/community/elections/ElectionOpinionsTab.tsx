import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Menu, ThumbsUp, MessageCircle, Share2, Send, TrendingUp, Clock } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Opinion {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  hasLiked: boolean;
}

const mockOpinions: Opinion[] = [
  {
    id: "op-1",
    author: "James Wilson",
    avatar: "/src/assets/profile-james-wilson.jpg",
    role: "Community Elder",
    content: "I believe we should vote based on merit and experience. Each candidate brings unique strengths to the table. We need leaders who have proven track records.",
    likes: 45,
    comments: 12,
    shares: 8,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    hasLiked: false,
  },
  {
    id: "op-2",
    author: "Sarah Johnson",
    avatar: "/src/assets/profile-sarah-johnson.jpg",
    role: "Youth Coordinator",
    content: "The transparency in this election process is commendable. We need leaders who prioritize community development and youth empowerment programs.",
    likes: 38,
    comments: 15,
    shares: 6,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    hasLiked: true,
  },
  {
    id: "op-3",
    author: "Michael Chen",
    avatar: "/src/assets/profile-michael-chen.jpg",
    role: "Healthcare Advocate",
    content: "Healthcare accessibility is critical. Our leaders must ensure every member has access to quality medical services regardless of their financial status.",
    likes: 52,
    comments: 20,
    shares: 11,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    hasLiked: false,
  },
];

export const ElectionOpinionsTab = () => {
  const [opinions, setOpinions] = useState<Opinion[]>(mockOpinions);
  const [newOpinion, setNewOpinion] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "recent">("popular");
  const { toast } = useToast();

  const handleLike = (opinionId: string) => {
    setOpinions((prev) =>
      prev.map((op) =>
        op.id === opinionId
          ? {
              ...op,
              likes: op.hasLiked ? op.likes - 1 : op.likes + 1,
              hasLiked: !op.hasLiked,
            }
          : op
      )
    );
  };

  const handleComment = (opinionId: string) => {
    toast({
      title: "Comments",
      description: "Comment feature coming soon!",
    });
  };

  const handleShare = (opinionId: string) => {
    toast({
      title: "Shared",
      description: "Opinion shared successfully!",
    });
  };

  const handleSubmit = () => {
    if (!newOpinion.trim()) {
      toast({
        title: "Empty Opinion",
        description: "Please write your opinion before posting",
        variant: "destructive",
      });
      return;
    }

    const newOp: Opinion = {
      id: `op-${Date.now()}`,
      author: "You",
      avatar: "/placeholder.svg",
      role: "Community Member",
      content: newOpinion,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date(),
      hasLiked: false,
    };

    setOpinions([newOp, ...opinions]);
    setNewOpinion("");

    toast({
      title: "Opinion Posted",
      description: "Your opinion has been shared with the community",
    });
  };

  const sortedOpinions = [...opinions].sort((a, b) => {
    if (sortBy === "popular") {
      return b.likes - a.likes;
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header Card */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-xl font-bold">Public Opinions</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Share your thoughts on what qualities and priorities our next leaders should have
        </p>
      </Card>

      {/* Write Opinion */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold">Share Your Opinion</h3>
        <Textarea
          placeholder="What qualities do you want to see in our next leaders? What issues should they prioritize?"
          value={newOpinion}
          onChange={(e) => setNewOpinion(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleSubmit} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          Post Opinion
        </Button>
      </Card>

      {/* Sort Options */}
      <div className="flex gap-2">
        <Button
          variant={sortBy === "popular" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("popular")}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Popular
        </Button>
        <Button
          variant={sortBy === "recent" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("recent")}
        >
          <Clock className="h-4 w-4 mr-2" />
          Recent
        </Button>
      </div>

      {/* Opinions Feed */}
      <div className="space-y-3">
        {sortedOpinions.map((opinion) => (
          <Card key={opinion.id} className="p-4 space-y-3">
            {/* Author Info */}
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={opinion.avatar} alt={opinion.author} />
                <AvatarFallback>{opinion.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{opinion.author}</p>
                <p className="text-sm text-muted-foreground">{opinion.role}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(opinion.timestamp, { addSuffix: true })}
                </p>
              </div>
              <Badge variant={opinion.likes > 50 ? "default" : "secondary"} className="text-xs">
                {opinion.likes > 50 ? "Trending" : "Active"}
              </Badge>
            </div>

            {/* Opinion Content */}
            <p className="text-sm leading-relaxed">{opinion.content}</p>

            <Separator />

            {/* Engagement Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={opinion.hasLiked ? "default" : "ghost"}
                size="sm"
                onClick={() => handleLike(opinion.id)}
                className="flex-1"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span className="text-xs">{opinion.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleComment(opinion.id)}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">{opinion.comments}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(opinion.id)}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span className="text-xs">{opinion.shares}</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-opinions" />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
