import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Quote, Target, CheckCircle2, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ElectionCandidate } from "@/data/electionData";

interface ManifestoViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: ElectionCandidate | null;
  officeName: string;
  onWriteFeedback?: () => void;
}

export const ManifestoViewerDialog = ({
  open,
  onOpenChange,
  candidate,
  officeName,
  onWriteFeedback,
}: ManifestoViewerDialogProps) => {
  const isMobile = useIsMobile();

  if (!candidate) return null;

  const getCandidateColorClass = (color: string) => {
    const colorMap = {
      green: 'bg-green-500',
      purple: 'bg-purple-600',
      magenta: 'bg-pink-500',
      orange: 'bg-orange-500',
      blue: 'bg-blue-500',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Candidate Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Avatar className={`h-16 w-16 ${getCandidateColorClass(candidate.color)}`}>
          <AvatarFallback className="text-white text-xl font-bold">
            {candidate.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground">{officeName}</p>
        </div>
      </div>

      {/* Campaign Slogan */}
      {candidate.campaignSlogan && (
        <div className="p-4 bg-muted/50 border-b">
          <div className="flex items-start gap-2">
            <Quote className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-base italic font-medium text-foreground">
              "{candidate.campaignSlogan}"
            </p>
          </div>
        </div>
      )}

      {/* Manifesto Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Main Manifesto */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-lg">Campaign Manifesto</h4>
            </div>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {candidate.manifesto || "No manifesto available for this candidate."}
            </p>
          </div>

          {/* Key Priorities - Parsed from manifesto */}
          {candidate.keyPriorities && candidate.keyPriorities.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-lg">Key Priorities</h4>
              </div>
              <ul className="space-y-2">
                {candidate.keyPriorities.map((priority, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{priority}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="p-4 border-t flex gap-2">
        {onWriteFeedback && (
          <Button 
            className="flex-1" 
            variant="default"
            onClick={() => {
              onOpenChange(false);
              onWriteFeedback();
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Write Feedback
          </Button>
        )}
        <Button 
          className={onWriteFeedback ? "" : "w-full"} 
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Campaign Manifesto
            </DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Campaign Manifesto
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
