import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ChevronRight, Vote, Building2 } from "lucide-react";
import { EnhancedCampaign } from "@/types/campaignSystem";
import { calculateDaysRemaining } from "@/lib/campaignFeeDistribution";

interface CampaignBannerCardProps {
  campaign: EnhancedCampaign;
  onViewCampaign: (campaign: EnhancedCampaign) => void;
  onWriteFeedback?: (campaign: EnhancedCampaign) => void;
  compact?: boolean;
}

export function CampaignBannerCard({ 
  campaign, 
  onViewCampaign,
  onWriteFeedback,
  compact = false 
}: CampaignBannerCardProps) {
  const daysRemaining = calculateDaysRemaining(campaign.endDate);
  
  if (compact) {
    return (
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-primary/20"
        onClick={() => onViewCampaign(campaign)}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={campaign.candidatePhoto} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {campaign.candidateName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{campaign.candidateName}</p>
              <p className="text-xs text-primary font-medium">
                for {campaign.office} • <span className="text-muted-foreground">{campaign.communityName}</span>
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <Badge variant="secondary" className="text-[10px] h-5">
                <Vote className="h-3 w-3 mr-1" />
                Campaign
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3 mr-1" />
                {campaign.feedbackCount}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-background to-primary/5">
      {/* Campaign Image Banner */}
      {campaign.campaignImage && (
        <div className="relative h-24 overflow-hidden">
          <img 
            src={campaign.campaignImage} 
            alt={`${campaign.candidateName} campaign`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <Badge className="absolute top-2 right-2 text-[10px]">
            <Vote className="h-3 w-3 mr-1" />
            Election Campaign
          </Badge>
        </div>
      )}
      
      <CardContent className={`p-4 ${campaign.campaignImage ? '-mt-6 relative' : ''}`}>
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-background shadow-lg">
            <AvatarImage src={campaign.candidatePhoto} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
              {campaign.candidateName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm">{campaign.candidateName}</h4>
            <p className="text-xs text-primary font-medium">for {campaign.office}</p>
          </div>
          
          {daysRemaining > 0 && (
            <Badge variant="outline" className="text-[10px] shrink-0">
              {daysRemaining}d left
            </Badge>
          )}
        </div>
        
        {/* Community Name - prominently displayed for external audiences */}
        <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 bg-muted/50 rounded-md">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-foreground/80 truncate">
            {campaign.communityName}
          </span>
        </div>
        
        {/* Tagline */}
        <p className="text-sm mt-3 font-medium text-foreground/90 line-clamp-2">
          "{campaign.tagline}"
        </p>
        
        {/* Stats & Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {campaign.feedbackCount} Responses
            </span>
          </div>
          
          <div className="flex gap-2">
            {onWriteFeedback && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onWriteFeedback(campaign);
                }}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Respond
              </Button>
            )}
            <Button 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => onViewCampaign(campaign)}
            >
              View
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
