import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, MessageSquare, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EnhancedCampaign } from "@/types/campaignSystem";
import { generateAnonymousId } from "@/lib/campaignFeeDistribution";

interface CampaignFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: EnhancedCampaign | null;
  onSubmitFeedback?: (campaignId: string, feedback: string, anonymousId: string) => void;
}

export function CampaignFeedbackDialog({
  open,
  onOpenChange,
  campaign,
  onSubmitFeedback
}: CampaignFeedbackDialogProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxLength = 500;

  const handleSubmit = async () => {
    if (!feedback.trim() || !campaign) return;
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const anonymousId = generateAnonymousId();
    
    if (onSubmitFeedback) {
      onSubmitFeedback(campaign.id, feedback.trim(), anonymousId);
    }
    
    toast({
      title: "Feedback Sent Successfully! ✍️",
      description: `Your anonymous feedback has been delivered to ${campaign.candidateName}.`,
    });
    
    setFeedback("");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  if (!campaign) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-auto max-h-[92vh] rounded-t-2xl p-0 flex flex-col"
      >
        {/* Fixed Header */}
        <SheetHeader className="px-4 pt-4 pb-3 border-b bg-background shrink-0">
          <SheetTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5 text-primary" />
            Write Feedback
          </SheetTitle>
        </SheetHeader>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto touch-auto px-4 py-4 space-y-4">
          {/* Candidate Summary - Stacked Mobile Layout */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              {/* Avatar with supporters overlay */}
              <div className="relative shrink-0">
                <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                  <AvatarImage src={campaign.candidatePhoto} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {campaign.candidateName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {/* Small supporters avatars */}
                <div className="absolute -bottom-1 -left-1 flex -space-x-1.5">
                  <div className="h-5 w-5 rounded-full bg-muted border-2 border-background overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=12" alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-5 w-5 rounded-full bg-muted border-2 border-background overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=15" alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
              
              {/* Candidate Info - Stacked */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base leading-tight">
                  {campaign.candidateName}
                </h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Candidate for {campaign.office}
                </p>
              </div>
              
              {/* Responses Badge */}
              <Badge 
                variant="outline" 
                className="shrink-0 text-xs font-medium px-2.5 py-1 border-primary/30 bg-primary/5"
              >
                {campaign.feedbackCount} responses
              </Badge>
            </div>
          </div>
          
          {/* Feedback Input */}
          <div className="space-y-2">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value.slice(0, maxLength))}
              placeholder="Share your thoughts, questions, or encouragement with the candidate..."
              rows={6}
              className="resize-none text-base border-2 focus:border-primary/50 rounded-xl px-4 py-3 touch-manipulation"
              autoComplete="off"
              spellCheck={false}
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="text-xs text-muted-foreground text-right px-1">
              {feedback.length}/{maxLength} characters
            </div>
          </div>
          
          {/* Privacy Note */}
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/30">
            <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              Your feedback is <strong className="font-semibold">anonymous</strong>. The candidate can read your message but won't know who sent it. Your identity is protected.
            </p>
          </div>
        </div>
        
        {/* Fixed Footer */}
        <div className="shrink-0 px-4 py-4 border-t bg-background safe-area-bottom">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 text-base font-medium rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 text-base font-medium rounded-xl"
              onClick={handleSubmit}
              disabled={!feedback.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
