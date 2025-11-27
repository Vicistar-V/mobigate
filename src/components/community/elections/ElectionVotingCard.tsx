import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, MessageSquare, ChevronDown } from "lucide-react";
import { ElectionOffice } from "@/data/electionData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

interface ElectionVotingCardProps {
  office: ElectionOffice;
  onVote?: (candidateId: string, comment?: string) => void;
}

export const ElectionVotingCard = ({ office, onVote }: ElectionVotingCardProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [customComment, setCustomComment] = useState("");
  const [showCustomComment, setShowCustomComment] = useState<string | null>(null);

  const predefinedComments = [
    "Excellent choice!",
    "I trust this candidate",
    "Best for the community",
    "Strong leadership skills",
    "I have reservations",
    "Need more information"
  ];

  const handleVote = (candidateId: string) => {
    setSelectedCandidate(candidateId);
  };

  const handleCommentSelect = (candidateId: string, comment: string) => {
    setComments({ ...comments, [candidateId]: comment });
    setShowCustomComment(null);
  };

  const handleCustomCommentSave = (candidateId: string) => {
    if (customComment.trim()) {
      setComments({ ...comments, [candidateId]: customComment });
      setCustomComment("");
      setShowCustomComment(null);
    }
  };

  const getCandidateColorClass = (color: string, type: 'bg' | 'border' = 'bg') => {
    const colorMap = {
      green: type === 'bg' ? 'bg-green-500' : 'border-green-500',
      purple: type === 'bg' ? 'bg-purple-600' : 'border-purple-600',
      magenta: type === 'bg' ? 'bg-pink-500' : 'border-pink-500',
      orange: type === 'bg' ? 'bg-orange-500' : 'border-orange-500',
      blue: type === 'bg' ? 'bg-blue-500' : 'border-blue-500',
    };
    return colorMap[color as keyof typeof colorMap] || (type === 'bg' ? 'bg-gray-500' : 'border-gray-500');
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{office.name}</h3>
          <p className="text-sm text-muted-foreground">
            Code: {office.shortCode} | Voters: {office.totalAccreditedVoters}
          </p>
        </div>
        <Badge variant="secondary">Remark</Badge>
      </div>

      <div className="space-y-3">
        {office.candidates.map((candidate) => (
          <div key={candidate.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getCandidateColorClass(candidate.color)}`} />
                <span className="font-medium">+ {candidate.name}</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedCandidate === candidate.id ? "default" : "outline"}
                  className={
                    selectedCandidate === candidate.id
                      ? `${getCandidateColorClass(candidate.color)} text-white hover:opacity-90`
                      : ""
                  }
                  onClick={() => handleVote(candidate.id)}
                  disabled={selectedCandidate !== null && selectedCandidate !== candidate.id}
                >
                  {selectedCandidate === candidate.id && <Check className="w-4 h-4 mr-1" />}
                  Vote
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Comment
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {predefinedComments.map((comment) => (
                      <DropdownMenuItem
                        key={comment}
                        onClick={() => handleCommentSelect(candidate.id, comment)}
                      >
                        {comment}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={() => setShowCustomComment(candidate.id)}>
                      Write custom comment...
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {comments[candidate.id] && (
              <div className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
                Comment: {comments[candidate.id]}
              </div>
            )}

            {showCustomComment === candidate.id && (
              <div className="mt-2 space-y-2">
                <Textarea
                  placeholder="Write your comment..."
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleCustomCommentSave(candidate.id)}>
                    Save Comment
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowCustomComment(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
