import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Users, Globe, Gamepad2 } from "lucide-react";
import { CommunityQuizDialog } from "./CommunityQuizDialog";
import { MobigateQuizHub } from "./mobigate-quiz/MobigateQuizHub";

interface QuizSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showCommunityQuiz?: boolean;
}

export function QuizSelectionSheet({
  open,
  onOpenChange,
  showCommunityQuiz = true,
}: QuizSelectionSheetProps) {
  const [communityQuizOpen, setCommunityQuizOpen] = useState(false);
  const [mobiQuizOpen, setMobiQuizOpen] = useState(false);

  const handleSelectCommunityQuiz = () => {
    onOpenChange(false);
    setTimeout(() => setCommunityQuizOpen(true), 200);
  };

  const handleSelectMobiQuiz = () => {
    onOpenChange(false);
    setTimeout(() => setMobiQuizOpen(true), 200);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="pb-6">
          <DrawerHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Gamepad2 className="h-5 w-5 text-primary" />
              <DrawerTitle className="text-lg font-bold">Choose Your Quiz Game</DrawerTitle>
            </div>
            <p className="text-xs text-muted-foreground">Select a quiz type to start playing</p>
          </DrawerHeader>

          <div className={`px-4 ${showCommunityQuiz ? "grid grid-cols-2 gap-3" : "flex justify-center"}`}>
            {showCommunityQuiz && (
              <button
                onClick={handleSelectCommunityQuiz}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-blue-200 bg-blue-50/60 dark:bg-blue-950/30 dark:border-blue-800 hover:border-blue-400 hover:shadow-md transition-all active:scale-[0.97]"
              >
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-blue-700 dark:text-blue-300">Community Quiz</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                    Community-specific knowledge & local topics
                  </p>
                </div>
              </button>
            )}

            <button
              onClick={handleSelectMobiQuiz}
              className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-amber-200 bg-amber-50/60 dark:bg-amber-950/30 dark:border-amber-800 hover:border-amber-400 hover:shadow-md transition-all active:scale-[0.97] ${!showCommunityQuiz ? "max-w-[200px]" : ""}`}
            >
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Globe className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm text-amber-700 dark:text-amber-300">Mobi Quiz</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                  Platform-wide Mobigate quiz challenges
                </p>
              </div>
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      <CommunityQuizDialog open={communityQuizOpen} onOpenChange={setCommunityQuizOpen} />
      <MobigateQuizHub open={mobiQuizOpen} onOpenChange={setMobiQuizOpen} />
    </>
  );
}
