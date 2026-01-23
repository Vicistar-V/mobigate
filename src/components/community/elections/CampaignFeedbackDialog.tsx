import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
      <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Write Feedback
          </SheetTitle>
        </SheetHeader>
        
        {/* Campaign Summary Card */}
        <Card className="mb-4">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage src={campaign.candidatePhoto} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                  {campaign.candidateName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{campaign.candidateName}</h4>
                <p className="text-xs text-muted-foreground">Candidate for {campaign.office}</p>
              </div>
              
              <Badge variant="secondary" className="text-xs">
                {campaign.feedbackCount} responses
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Feedback Input */}
        <div className="space-y-3">
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value.slice(0, maxLength))}
            placeholder="Share your thoughts, questions, or encouragement with the candidate..."
            rows={5}
            className="resize-none"
          />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{feedback.length}/{maxLength} characters</span>
          </div>
          
          {/* Privacy Note */}
          <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
            <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Your feedback is <strong>anonymous</strong>. The candidate can read your message but won't know who sent it. Your identity is protected.
            </p>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={!feedback.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Feedback
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
