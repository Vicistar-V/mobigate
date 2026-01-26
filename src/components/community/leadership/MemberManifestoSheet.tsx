import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import {
  X,
  FileText,
  Target,
  CheckSquare,
  Lightbulb,
  Calendar,
  ThumbsUp,
  MessageCircle,
  Share2,
  Quote,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MemberManifestoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: ExecutiveMember;
}

// Mock manifesto data
const mockManifesto = {
  publishedDate: "2023-11-15",
  electionCycle: "2024-2028",
  slogan: "Building Together, Growing Stronger",
  vision: "To transform our community into a thriving, inclusive, and innovative hub where every member has equal opportunities to grow, contribute, and benefit from collective success.",
  missionStatements: [
    "Strengthen community bonds through regular engagement programs",
    "Improve transparency in all financial and administrative matters",
    "Create sustainable development projects that benefit all members",
    "Foster innovation and technological advancement within the community",
  ],
  keyPriorities: [
    {
      title: "Financial Transparency",
      description: "Implement quarterly financial reports accessible to all members with detailed breakdowns of income and expenditure.",
      progress: 75,
    },
    {
      title: "Member Welfare",
      description: "Establish a comprehensive welfare scheme covering health, education, and emergency support for members and their families.",
      progress: 60,
    },
    {
      title: "Infrastructure Development",
      description: "Complete the community center renovation and establish modern facilities for member gatherings and events.",
      progress: 45,
    },
    {
      title: "Youth Empowerment",
      description: "Launch skill acquisition programs and mentorship initiatives targeting young members aged 18-35.",
      progress: 30,
    },
  ],
  achievements: [
    "Increased community revenue by 40% in first year",
    "Launched successful scholarship program for 50+ students",
    "Established emergency response fund of M500,000",
    "Organized 12 community events with 80%+ attendance",
  ],
  engagement: {
    likes: 234,
    comments: 45,
    shares: 28,
  },
};

export function MemberManifestoSheet({
  open,
  onOpenChange,
  member,
}: MemberManifestoSheetProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "Like Removed" : "Liked!",
      description: liked ? "You unliked this manifesto" : "You liked this manifesto",
    });
  };

  const handleComment = () => {
    toast({
      title: "Coming Soon",
      description: "Manifesto comments feature is coming soon",
    });
  };

  const handleShare = () => {
    toast({
      title: "Shared!",
      description: "Manifesto link copied to clipboard",
    });
  };

  const content = (
    <ScrollArea className="h-full">
      <div className="flex flex-col pb-8">
        {/* Member Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
          <Avatar className="h-14 w-14">
            <AvatarImage src={member.imageUrl} alt={member.name} />
            <AvatarFallback className="text-lg">{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{member.name}</h3>
            <p className="text-sm text-primary truncate">{member.position}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {mockManifesto.electionCycle}
              </Badge>
            </div>
          </div>
        </div>

        {/* Slogan */}
        <div className="p-4 bg-primary/5 border-b">
          <div className="flex items-start gap-2">
            <Quote className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-lg font-semibold italic text-primary">
              "{mockManifesto.slogan}"
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Published {new Date(mockManifesto.publishedDate).toLocaleDateString()}
          </p>
        </div>

        {/* Vision */}
        <div className="p-4 space-y-2">
          <h4 className="font-semibold flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Vision
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {mockManifesto.vision}
          </p>
        </div>

        <Separator />

        {/* Mission Statements */}
        <div className="p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-red-500" />
            Mission Statements
          </h4>
          <div className="space-y-2">
            {mockManifesto.missionStatements.map((mission, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{mission}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Key Priorities with Progress */}
        <div className="p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-blue-500" />
            Key Priorities & Progress
          </h4>
          <div className="space-y-3">
            {mockManifesto.keyPriorities.map((priority, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-medium text-sm">{priority.title}</h5>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {priority.progress}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{priority.description}</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${priority.progress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Achievements */}
        <div className="p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2 text-base">
            <Award className="h-4 w-4 text-yellow-500" />
            Achievements So Far
          </h4>
          <div className="space-y-2">
            {mockManifesto.achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-green-600">{index + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground">{achievement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Bar */}
        <div className="px-4 pt-4 border-t mt-4">
          <div className="flex items-center justify-around">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex flex-col items-center gap-1 h-auto py-2 ${liked ? 'text-primary' : ''}`}
              onClick={handleLike}
            >
              <ThumbsUp className={`h-5 w-5 ${liked ? 'fill-primary' : ''}`} />
              <span className="text-xs">{mockManifesto.engagement.likes + (liked ? 1 : 0)}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={handleComment}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">{mockManifesto.engagement.comments}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              <span className="text-xs">{mockManifesto.engagement.shares}</span>
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] h-[92vh] flex flex-col">
          <DrawerHeader className="shrink-0 pb-0 relative">
            <DrawerTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Campaign Manifesto
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-hidden">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="shrink-0 p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Campaign Manifesto
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
