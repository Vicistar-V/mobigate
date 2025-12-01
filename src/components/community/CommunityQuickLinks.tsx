import { useState } from "react";
import { Gift, Store, GamepadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobiStoreDialog } from "./MobiStoreDialog";
import { MobiQuizGameDialog } from "./MobiQuizGameDialog";

interface CommunityQuickLinksProps {
  fundRaiserEnabled?: boolean;
  mobiStoreEnabled?: boolean;
  quizGameEnabled?: boolean;
}

export function CommunityQuickLinks({
  fundRaiserEnabled = false,
  mobiStoreEnabled = false,
  quizGameEnabled = false,
}: CommunityQuickLinksProps) {
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

  const links = [
    { enabled: fundRaiserEnabled, label: "FundRaiser", icon: Gift, onClick: handleFundRaiser },
    { enabled: mobiStoreEnabled, label: "Mobi-Store", icon: Store, onClick: handleStore },
    { enabled: quizGameEnabled, label: "Play Mobi-Quiz Game", icon: GamepadIcon, onClick: handleQuiz },
  ].filter((link) => link.enabled);

  if (links.length === 0) return null;

  return (
    <>
      <div className="flex items-center justify-center gap-2 py-3 px-4 border-y border-border bg-muted/20">
        {links.map((link, index) => (
          <span key={link.label}>
            <Button
              variant="link"
              className="h-auto p-0 text-xs sm:text-sm text-primary hover:text-primary/80 font-medium"
              onClick={link.onClick}
            >
              <link.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {link.label}
            </Button>
            {index < links.length - 1 && <span className="mx-2 text-muted-foreground">|</span>}
          </span>
        ))}
      </div>

      <MobiStoreDialog open={storeOpen} onOpenChange={setStoreOpen} />
      <MobiQuizGameDialog open={quizOpen} onOpenChange={setQuizOpen} />
    </>
  );
}
