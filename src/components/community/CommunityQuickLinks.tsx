import { useState } from "react";
import { Gift, Store, GamepadIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobiStoreDialog } from "./MobiStoreDialog";
import { MobiQuizGameDialog } from "./MobiQuizGameDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface CommunityQuickLinksProps {
  fundRaiserEnabled?: boolean;
  mobiStoreEnabled?: boolean;
  quizGameEnabled?: boolean;
}

export function CommunityQuickLinks({
  fundRaiserEnabled = true,
  mobiStoreEnabled = true,
  quizGameEnabled = true,
}: CommunityQuickLinksProps) {
  const { toast } = useToast();
  const [storeOpen, setStoreOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const handleFundRaiser = () => {
    // Navigate to fundraiser tab - this will be handled by parent component
    const fundraiserTab = document.querySelector('[data-value="fundraiser-campaigns"]');
    if (fundraiserTab instanceof HTMLElement) {
      fundraiserTab.click();
    }
  };

  const handleStore = () => {
    setStoreOpen(true);
  };

  const handleQuiz = () => {
    setQuizOpen(true);
  };

  const handleOthers = (option: string) => {
    toast({
      title: option,
      description: `${option} feature coming soon!`,
    });
  };

  // Core links that are always shown
  const coreLinks = [
    { enabled: quizGameEnabled, label: "Quiz Games", icon: GamepadIcon, onClick: handleQuiz },
    { enabled: mobiStoreEnabled, label: "Mobi-Store", icon: Store, onClick: handleStore },
  ].filter((link) => link.enabled);

  return (
    <>
      <div className="flex items-center justify-center gap-1 py-3 px-4 border-y border-border bg-muted/20 flex-wrap">
        {coreLinks.map((link, index) => (
          <span key={link.label} className="flex items-center">
            <Button
              variant="link"
              className="h-auto p-0 text-xs sm:text-sm text-primary hover:text-primary/80 font-medium"
              onClick={link.onClick}
            >
              <link.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {link.label}
            </Button>
            <span className="mx-2 text-muted-foreground">|</span>
          </span>
        ))}
        
        {/* Others Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="link"
              className="h-auto p-0 text-xs sm:text-sm text-primary hover:text-primary/80 font-medium"
            >
              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Others
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="bg-background z-50">
            <DropdownMenuItem onClick={() => handleOthers("Community Forum")}>
              Community Forum
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOthers("Help Center")}>
              Help Center
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOthers("FAQs")}>
              FAQs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOthers("Contact Support")}>
              Contact Support
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <MobiStoreDialog open={storeOpen} onOpenChange={setStoreOpen} />
      <MobiQuizGameDialog open={quizOpen} onOpenChange={setQuizOpen} />
    </>
  );
}
