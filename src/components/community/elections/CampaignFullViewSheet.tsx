import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Eye, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Share2,
  Vote,
  Building2
} from "lucide-react";
import { EnhancedCampaign } from "@/types/campaignSystem";
import { calculateDaysRemaining, getAudienceLabel } from "@/lib/campaignFeeDistribution";
import { format } from "date-fns";

interface CampaignFullViewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: EnhancedCampaign | null;
  onWriteFeedback?: () => void;
}

export function CampaignFullViewSheet({
  open,
  onOpenChange,
  campaign,
  onWriteFeedback
}: CampaignFullViewSheetProps) {
  const navigate = useNavigate();
  if (!campaign) return null;

  const daysRemaining = calculateDaysRemaining(campaign.endDate);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0">
        {/* Header with Campaign Image */}
        <div className="relative">
          {campaign.campaignImage ? (
            <div className="h-40 overflow-hidden">
              <img 
                src={campaign.campaignImage}
                alt={`${campaign.candidateName} campaign`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
          ) : (
            <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/5" />
          )}
          
          {/* Candidate Avatar - Overlapping & Clickable */}
          <div 
            className={`absolute ${campaign.campaignImage ? '-bottom-8' : '-bottom-6'} left-4 cursor-pointer touch-manipulation active:scale-[0.95]`}
            onClick={() => navigate(`/profile/${campaign.candidateId}`)}
          >
            <Avatar className="h-16 w-16 ring-4 ring-background shadow-lg">
              <AvatarImage src={campaign.candidatePhoto} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {campaign.candidateName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Campaign Badge */}
          <Badge className="absolute top-3 right-3">
            <Vote className="h-3 w-3 mr-1" />
            Election Campaign
          </Badge>
        </div>
        
        <SheetHeader className="px-4 pt-10 pb-2">
          <div>
            <SheetTitle 
              className="text-lg cursor-pointer touch-manipulation active:opacity-80 underline-offset-2 hover:underline w-fit"
              onClick={() => navigate(`/profile/${campaign.candidateId}`)}
            >
              {campaign.candidateName}
            </SheetTitle>
            <p className="text-sm text-primary font-medium">Candidate for {campaign.office}</p>
            {/* Community Name */}
            <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 bg-muted/50 rounded-md w-fit">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-foreground/80">
                {campaign.communityName}
              </span>
            </div>
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100%-280px)] px-4">
          {/* Tagline */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 my-4">
            <p className="text-sm font-medium italic">"{campaign.tagline}"</p>
          </div>
          
          {/* Campaign Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Card>
              <CardContent className="p-3 text-center">
                <Eye className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-bold">{campaign.views.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Views</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <MessageSquare className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-bold">{campaign.feedbackCount}</p>
                <p className="text-[10px] text-muted-foreground">Responses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-bold">{daysRemaining}</p>
                <p className="text-[10px] text-muted-foreground">Days Left</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Campaign Duration */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {format(new Date(campaign.startDate), "MMM d")} - {format(new Date(campaign.endDate), "MMM d, yyyy")}
            </span>
            <Badge variant="outline" className="text-[10px] ml-auto">
              {campaign.durationDays} days
            </Badge>
          </div>
          
          <Separator className="my-4" />
          
          {/* Manifesto */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Campaign Manifesto</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {campaign.manifesto}
            </p>
          </div>
          
          {/* Key Priorities */}
          {campaign.priorities.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Key Priorities</h4>
              <div className="space-y-2">
                {campaign.priorities.map((priority) => (
                  <div 
                    key={priority.id}
                    className="flex items-start gap-2 bg-muted/50 rounded-lg p-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{priority.title}</p>
                      {priority.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {priority.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Audience Reach */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Campaign Reach</h4>
            <div className="flex flex-wrap gap-1.5">
              {campaign.audienceTargets.map((audience) => (
                <Badge key={audience} variant="secondary" className="text-xs">
                  {getAudienceLabel(audience)}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="h-4" />
        </ScrollArea>
        
        {/* Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                // Share functionality
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              className="flex-1"
              onClick={onWriteFeedback}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Write Feedback
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
