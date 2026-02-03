import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Eye, 
  Calendar, 
  Clock, 
  Share2,
  Vote,
  MonitorSmartphone,
  ArrowLeft,
  Building2
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface CampaignPreviewData {
  candidateName: string;
  office: string;
  tagline: string;
  manifesto: string;
  startDate?: Date;
  endDate?: Date;
  campaignImage?: string | null;
  campaignColor: string;
  communityName?: string;
}

interface CampaignPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CampaignPreviewData;
}

const colorClasses: Record<string, string> = {
  green: "from-green-500/30 via-green-500/10 to-transparent",
  purple: "from-purple-600/30 via-purple-600/10 to-transparent",
  magenta: "from-pink-500/30 via-pink-500/10 to-transparent",
  orange: "from-orange-500/30 via-orange-500/10 to-transparent",
  blue: "from-blue-500/30 via-blue-500/10 to-transparent",
};

const colorBadgeClasses: Record<string, string> = {
  green: "bg-green-600 text-white",
  purple: "bg-purple-600 text-white",
  magenta: "bg-pink-500 text-white",
  orange: "bg-orange-500 text-white",
  blue: "bg-blue-600 text-white",
};

const colorBorderClasses: Record<string, string> = {
  green: "border-green-500/30",
  purple: "border-purple-500/30",
  magenta: "border-pink-500/30",
  orange: "border-orange-500/30",
  blue: "border-blue-500/30",
};

const colorBgClasses: Record<string, string> = {
  green: "bg-green-500/10",
  purple: "bg-purple-500/10",
  magenta: "bg-pink-500/10",
  orange: "bg-orange-500/10",
  blue: "bg-blue-500/10",
};

export function CampaignPreviewSheet({
  open,
  onOpenChange,
  data
}: CampaignPreviewSheetProps) {
  const { 
    candidateName, 
    office, 
    tagline, 
    manifesto, 
    startDate, 
    endDate, 
    campaignImage,
    campaignColor,
    communityName
  } = data;

  const daysRemaining = endDate ? Math.max(0, differenceInDays(endDate, new Date())) : 0;
  const campaignDuration = startDate && endDate ? differenceInDays(endDate, startDate) : 0;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent showClose={false}>
        <DrawerHeader className="sr-only">
          <DrawerTitle>Campaign Preview</DrawerTitle>
        </DrawerHeader>
        
        {/* Preview Mode Banner - Fixed at top */}
        <div className="shrink-0 bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 -ml-1"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <MonitorSmartphone className="h-4 w-4 text-amber-600" />
          <span className="text-xs font-medium text-amber-700">Live Preview - How voters will see your campaign</span>
        </div>
        
        {/* Scrollable Content using DrawerBody */}
        <DrawerBody className="px-0">
          {/* Header with Campaign Image */}
          <div className="relative">
            {campaignImage ? (
              <div className="h-40 overflow-hidden">
                <img 
                  src={campaignImage}
                  alt={`${candidateName || "Candidate"} campaign`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </div>
            ) : (
              <div className={cn(
                "h-32 bg-gradient-to-b",
                colorClasses[campaignColor] || colorClasses.green
              )} />
            )}
            
            {/* Candidate Avatar - Overlapping */}
            <div className={`absolute ${campaignImage ? '-bottom-8' : '-bottom-8'} left-4`}>
              <Avatar className="h-16 w-16 ring-4 ring-background shadow-lg">
                <AvatarFallback className={cn(
                  "text-lg font-bold",
                  colorBadgeClasses[campaignColor] || colorBadgeClasses.green
                )}>
                  {candidateName 
                    ? candidateName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
                    : "??"
                  }
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Campaign Badge */}
            <Badge className={cn(
              "absolute top-3 right-3",
              colorBadgeClasses[campaignColor] || colorBadgeClasses.green
            )}>
              <Vote className="h-3 w-3 mr-1" />
              Election Campaign
            </Badge>
          </div>
          
          <div className="px-4 pt-10 pb-2">
            <h2 className="text-lg font-bold">
              {candidateName || <span className="text-muted-foreground italic">Your Name</span>}
            </h2>
            <p className={cn(
              "text-sm font-medium",
              office ? "text-primary" : "text-muted-foreground italic"
            )}>
              {office ? `Candidate for ${office}` : "Select an office"}
            </p>
            {/* Community Name */}
            <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 bg-muted/50 rounded-md w-fit">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-foreground/80">
                {communityName || "Your Community Name"}
              </span>
            </div>
          </div>
          
          <div className="px-4 pb-6">
            {/* Tagline */}
            <div className={cn(
              "rounded-lg p-3 my-4 border",
              colorBgClasses[campaignColor] || colorBgClasses.green,
              colorBorderClasses[campaignColor] || colorBorderClasses.green
            )}>
              <p className="text-sm font-medium italic">
                "{tagline || <span className="text-muted-foreground">Your campaign tagline will appear here...</span>}"
              </p>
            </div>
            
            {/* Campaign Stats (Preview with mock data) */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Card>
                <CardContent className="p-3 text-center">
                  <Eye className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold text-muted-foreground">0</p>
                  <p className="text-[10px] text-muted-foreground">Views</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <MessageSquare className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold text-muted-foreground">0</p>
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
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {startDate && endDate 
                  ? `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`
                  : <span className="italic">Select campaign dates</span>
                }
              </span>
              {campaignDuration > 0 && (
                <Badge variant="outline" className="text-[10px] ml-auto">
                  {campaignDuration} days
                </Badge>
              )}
            </div>
            
            <Separator className="my-4" />
            
            {/* Manifesto */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Campaign Manifesto</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {manifesto || (
                  <span className="italic">
                    Your manifesto will appear here. Share your vision and plans for the office...
                  </span>
                )}
              </p>
            </div>
            
            {/* Placeholder for priorities */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Key Priorities</h4>
              <p className="text-xs text-muted-foreground italic">
                Your priorities will be displayed here after campaign setup.
              </p>
            </div>
            
            {/* Extra padding for bottom buttons */}
            <div className="h-4" />
          </div>
        </DrawerBody>
        
        {/* Action Buttons - Fixed at bottom using DrawerFooter */}
        <DrawerFooter>
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
