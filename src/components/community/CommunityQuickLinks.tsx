import { Gift, Store, GamepadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleFundRaiser = () => {
    toast({
      title: "FundRaiser",
      description: "Community fundraiser feature coming soon!",
    });
  };

  const handleStore = () => {
    toast({
      title: "Mobi-Store",
      description: "Community store feature coming soon!",
    });
  };

  const handleQuiz = () => {
    toast({
      title: "Mobi-Quiz Game",
      description: "Community quiz game coming soon!",
    });
  };

  const links = [
    { enabled: fundRaiserEnabled, label: "FundRaiser", icon: Gift, onClick: handleFundRaiser },
    { enabled: mobiStoreEnabled, label: "Mobi-Store", icon: Store, onClick: handleStore },
    { enabled: quizGameEnabled, label: "Play Mobi-Quiz Game", icon: GamepadIcon, onClick: handleQuiz },
  ].filter((link) => link.enabled);

  if (links.length === 0) return null;

  return (
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
  );
}
