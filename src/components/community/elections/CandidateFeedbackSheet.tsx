import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Search, User, Clock, CheckCheck, Filter } from "lucide-react";
import { CampaignFeedback, EnhancedCampaign } from "@/types/campaignSystem";
import { formatDistanceToNow } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CandidateFeedbackSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: EnhancedCampaign | null;
  onMarkAsRead?: (feedbackId: string) => void;
}

export function CandidateFeedbackSheet({
  open,
  onOpenChange,
  campaign,
  onMarkAsRead
}: CandidateFeedbackSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">("all");
  
  if (!campaign) return null;

  const filteredFeedbacks = campaign.feedbacks
    .filter(fb => {
      const matchesSearch = fb.feedbackText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           fb.anonymousId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterStatus === "all" || 
                           (filterStatus === "read" && fb.isRead) ||
                           (filterStatus === "unread" && !fb.isRead);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const unreadCount = campaign.feedbacks.filter(fb => !fb.isRead).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] max-h-[92vh] rounded-t-2xl p-0 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          {/* Sticky header zone */}
          <div className="shrink-0 px-4 pt-4">
            <SheetHeader className="pb-2">
              <SheetTitle className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="h-5 w-5 text-primary shrink-0" />
                  <span className="truncate">Campaign Feedback</span>
                </div>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs shrink-0">
                    {unreadCount} unread
                  </Badge>
                )}
              </SheetTitle>
            </SheetHeader>

            {/* Campaign Info */}
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium break-words">{campaign.candidateName}</p>
              <p className="text-xs text-muted-foreground break-words">for {campaign.office}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {campaign.feedbackCount} total responses received
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search feedback..."
                  className="pl-9 h-11 text-base"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-11 w-11 shrink-0">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All ({campaign.feedbacks.length})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("unread")}>
                    Unread ({unreadCount})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("read")}>
                    Read ({campaign.feedbacks.length - unreadCount})
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator className="mb-4" />
          </div>

          {/* Scrollable list */}
          <div className="flex-1 min-h-0 px-4 pb-4">
            <ScrollArea className="h-full">
              {filteredFeedbacks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-2">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm">No Feedback Yet</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                    {searchQuery
                      ? "No feedback matches your search"
                      : "Feedback from your audience will appear here"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pr-2">
                  {filteredFeedbacks.map((feedback) => (
                    <FeedbackCard
                      key={feedback.id}
                      feedback={feedback}
                      onMarkAsRead={onMarkAsRead}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface FeedbackCardProps {
  feedback: CampaignFeedback;
  onMarkAsRead?: (feedbackId: string) => void;
}

function FeedbackCard({ feedback, onMarkAsRead }: FeedbackCardProps) {
  const handleClick = () => {
    if (!feedback.isRead && onMarkAsRead) {
      onMarkAsRead(feedback.id);
    }
  };

  return (
    <Card 
      className={`transition-all ${!feedback.isRead ? "border-primary/30 bg-primary/5" : ""}`}
      onClick={handleClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-primary">
                {feedback.anonymousId}
              </span>
              {!feedback.isRead && (
                <Badge variant="destructive" className="text-[10px] h-4 px-1">
                  New
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-foreground/90 leading-relaxed">
              {feedback.feedbackText}
            </p>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(feedback.submittedAt), { addSuffix: true })}
              </span>
              {feedback.isRead && (
                <span className="flex items-center gap-1">
                  <CheckCheck className="h-3 w-3" />
                  Read
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
