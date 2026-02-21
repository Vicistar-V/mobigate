import { useState } from "react";
import { Link } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, FolderOpen, Layers, PenSquare, ListChecks, Activity, Building2, Users, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizAdminDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const generalLinks = [
  { label: "Quiz Games Played", url: "/mobigate-admin/quiz/games-played", icon: History },
];

const quizSections = [
  {
    key: "group",
    label: "Group Quiz",
    emoji: "👥",
    gradient: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30",
    links: [
      { label: "Categories", url: "/mobigate-admin/quiz/group/categories", icon: FolderOpen },
      { label: "Levels", url: "/mobigate-admin/quiz/group/levels", icon: Layers },
      { label: "Create Questions", url: "/mobigate-admin/quiz/group/questions/create", icon: PenSquare },
      { label: "Manage Questions", url: "/mobigate-admin/quiz/group/questions", icon: ListChecks },
      { label: "Monitor", url: "/mobigate-admin/quiz/group/monitor", icon: Activity },
    ],
  },
  {
    key: "standard",
    label: "Standard Solo Quiz",
    emoji: "🎯",
    gradient: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    links: [
      { label: "Categories", url: "/mobigate-admin/quiz/standard/categories", icon: FolderOpen },
      { label: "Levels", url: "/mobigate-admin/quiz/standard/levels", icon: Layers },
      { label: "Create Questions", url: "/mobigate-admin/quiz/standard/questions/create", icon: PenSquare },
      { label: "Manage Questions", url: "/mobigate-admin/quiz/standard/questions", icon: ListChecks },
      { label: "Monitor", url: "/mobigate-admin/quiz/standard/monitor", icon: Activity },
    ],
  },
  {
    key: "interactive",
    label: "Interactive Quiz",
    emoji: "🏪",
    gradient: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/30",
    links: [
      { label: "Merchant Management", url: "/mobigate-admin/quiz/interactive/merchants", icon: Building2 },
      { label: "Categories", url: "/mobigate-admin/quiz/interactive/categories", icon: FolderOpen },
      { label: "Levels", url: "/mobigate-admin/quiz/interactive/levels", icon: Layers },
      { label: "Create Questions", url: "/mobigate-admin/quiz/interactive/questions/create", icon: PenSquare },
      { label: "Manage Questions", url: "/mobigate-admin/quiz/interactive/questions", icon: ListChecks },
      { label: "Fan Engagement Fees", url: "/mobigate-admin/quiz/interactive/fan-engagement", icon: Users },
      { label: "Monitor", url: "/mobigate-admin/quiz/interactive/monitor", icon: Activity },
    ],
  },
  {
    key: "food",
    label: "Food for Home Quiz",
    emoji: "🍲",
    gradient: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    links: [
      { label: "Categories", url: "/mobigate-admin/quiz/food/categories", icon: FolderOpen },
      { label: "Levels", url: "/mobigate-admin/quiz/food/levels", icon: Layers },
      { label: "Create Questions", url: "/mobigate-admin/quiz/food/questions/create", icon: PenSquare },
      { label: "Manage Questions", url: "/mobigate-admin/quiz/food/questions", icon: ListChecks },
      { label: "Monitor", url: "/mobigate-admin/quiz/food/monitor", icon: Activity },
    ],
  },
  {
    key: "scholarship",
    label: "Scholarship Quiz",
    emoji: "🎓",
    gradient: "from-rose-500/20 to-rose-600/10",
    border: "border-rose-500/30",
    links: [
      { label: "Categories", url: "/mobigate-admin/quiz/scholarship/categories", icon: FolderOpen },
      { label: "Levels", url: "/mobigate-admin/quiz/scholarship/levels", icon: Layers },
      { label: "Create Questions", url: "/mobigate-admin/quiz/scholarship/questions/create", icon: PenSquare },
      { label: "Manage Questions", url: "/mobigate-admin/quiz/scholarship/questions", icon: ListChecks },
      { label: "Monitor", url: "/mobigate-admin/quiz/scholarship/monitor", icon: Activity },
    ],
  },
];

export function QuizAdminDrawer({ open, onOpenChange }: QuizAdminDrawerProps) {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (key: string) => {
    setExpanded(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleNav = () => {
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] p-0 flex flex-col">
        <DrawerHeader className="shrink-0 px-4 pt-2 pb-3">
          <DrawerTitle className="text-lg font-bold">Quiz Administration</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 pb-8 space-y-3">
          {/* General Links */}
          <div className="space-y-0.5">
            {generalLinks.map(link => (
              <Link
                key={link.url}
                to={link.url}
                onClick={handleNav}
                className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/40 active:bg-accent/60 transition-colors touch-manipulation"
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {quizSections.map(section => {
            const isOpen = expanded.includes(section.key);
            return (
              <Collapsible key={section.key} open={isOpen} onOpenChange={() => toggle(section.key)}>
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    "flex items-center gap-3 p-3.5 rounded-xl border bg-gradient-to-r transition-all active:scale-[0.98]",
                    section.gradient,
                    section.border,
                  )}>
                    <span className="text-2xl">{section.emoji}</span>
                    <span className="flex-1 text-left text-sm font-semibold">{section.label}</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )} />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-1.5 ml-4 border-l-2 border-muted pl-3 space-y-0.5">
                    {section.links.map(link => (
                      <Link
                        key={link.url}
                        to={link.url}
                        onClick={handleNav}
                        className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/40 active:bg-accent/60 transition-colors touch-manipulation"
                      >
                        <link.icon className="h-4 w-4 shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
