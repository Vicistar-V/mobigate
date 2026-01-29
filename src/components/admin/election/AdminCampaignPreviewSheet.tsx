import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
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
  MonitorSmartphone
} from "lucide-react";
import { AdminCampaign } from "@/data/adminElectionData";
import { format, differenceInDays } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminCampaignPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: AdminCampaign | null;
}

export function AdminCampaignPreviewSheet({
  open,
  onOpenChange,
  campaign
}: AdminCampaignPreviewSheetProps) {
  const isMobile = useIsMobile();

  if (!campaign) return null;

  const daysRemaining = Math.max(0, differenceInDays(campaign.endDate, new Date()));

  const content = (
    <div className="flex flex-col h-full">
      {/* Preview Mode Banner */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-2.5 flex items-center gap-2">
        <MonitorSmartphone className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-primary">Live Preview - As public will see it</span>
      </div>
      
      {/* Header with Campaign Image */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />
        
        {/* Candidate Avatar - Overlapping */}
        <div className="absolute -bottom-8 left-4">
          <Avatar className="h-16 w-16 ring-4 ring-background shadow-lg">
            <AvatarImage src={campaign.candidateAvatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
              {campaign.candidateName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Campaign Badge */}
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          <Vote className="h-3 w-3 mr-1" />
          Election Campaign
        </Badge>
      </div>
      
      <div className="px-4 pt-10 pb-2">
        <h2 className="text-lg font-bold">{campaign.candidateName}</h2>
        <p className="text-sm text-primary font-medium">Candidate for {campaign.office}</p>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        {/* Tagline */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 my-4">
          <p className="text-sm font-medium italic">"{campaign.slogan}"</p>
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
              <p className="text-lg font-bold">{campaign.endorsements}</p>
              <p className="text-[10px] text-muted-foreground">Endorsements</p>
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
            {format(campaign.startDate, "MMM d")} - {format(campaign.endDate, "MMM d, yyyy")}
          </span>
          <Badge variant="outline" className="text-[10px] ml-auto">
            {differenceInDays(campaign.endDate, campaign.startDate)} days
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
              {campaign.priorities.map((priority, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 bg-muted/50 rounded-lg p-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{priority}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="h-20" />
      </ScrollArea>
      
      {/* Action Buttons (Preview Only) */}
      <div className="shrink-0 p-4 border-t bg-background">
        <p className="text-[10px] text-center text-muted-foreground mb-2">
          These buttons are shown for preview only
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" disabled>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button className="flex-1" disabled>
            <MessageSquare className="h-4 w-4 mr-2" />
            Write Feedback
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Campaign Preview</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="sr-only">
          <SheetTitle>Campaign Preview</SheetTitle>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  );
}
