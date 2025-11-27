import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, ThumbsUp, MessageCircle } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";

interface Opinion {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: Date;
}

const mockOpinions: Opinion[] = [
  {
    id: "op-1",
    author: "James Wilson",
    avatar: "/src/assets/profile-james-wilson.jpg",
    content: "I believe we should vote based on merit and experience. Each candidate brings unique strengths to the table.",
    likes: 24,
    comments: 8,
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: "op-2",
    author: "Sarah Johnson",
    avatar: "/src/assets/profile-sarah-johnson.jpg",
    content: "The transparency in this election process is commendable. We need leaders who prioritize community development.",
    likes: 31,
    comments: 12,
    timestamp: new Date(Date.now() - 14400000),
  },
];

export const ElectionOpinionsTab = () => {
  const [newOpinion, setNewOpinion] = useState("");

  const handleSubmit = () => {
    console.log("Submitting opinion:", newOpinion);
    setNewOpinion("");
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Public Opinions</h1>
        </div>
      </div>

      {/* Add Opinion Form */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Share Your Opinion</h3>
        <Textarea
          placeholder="What are your thoughts on the election?"
          value={newOpinion}
          onChange={(e) => setNewOpinion(e.target.value)}
          className="mb-3"
          rows={4}
        />
        <Button onClick={handleSubmit} disabled={!newOpinion.trim()}>
          Post Opinion
        </Button>
      </Card>

      {/* Opinions List */}
      <div className="space-y-4">
        {mockOpinions.map((opinion) => (
          <Card key={opinion.id} className="p-4">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={opinion.avatar} alt={opinion.author} />
                <AvatarFallback>{opinion.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">{opinion.author}</h4>
                  <span className="text-xs text-muted-foreground">
                    {opinion.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm mb-3">{opinion.content}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-primary">
                    <ThumbsUp className="w-4 h-4" />
                    {opinion.likes}
                  </button>
                  <button className="flex items-center gap-1 hover:text-primary">
                    <MessageCircle className="w-4 h-4" />
                    {opinion.comments}
                  </button>
                </div>
              </div>
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
