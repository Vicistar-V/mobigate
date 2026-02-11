import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Layers, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

// Lazy-style imports for sub-tabs
import { MobigateQuizLevelsManagement } from "./MobigateQuizLevelsManagement";
import { AdminQuizQuestionsManager } from "./AdminQuizQuestionsManager";

type SubTab = "levels" | "questions";

export function MobigateQuizManagement() {
  const [subTab, setSubTab] = useState<SubTab>("levels");

  return (
    <div className="space-y-3">
      {/* Sub-tab toggle */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 h-10 text-sm font-medium rounded-md",
            subTab === "levels" && "bg-background shadow-sm"
          )}
          onClick={() => setSubTab("levels")}
        >
          <Layers className="h-4 w-4 mr-1.5" />
          Levels
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 h-10 text-sm font-medium rounded-md",
            subTab === "questions" && "bg-background shadow-sm"
          )}
          onClick={() => setSubTab("questions")}
        >
          <FileQuestion className="h-4 w-4 mr-1.5" />
          Questions
        </Button>
      </div>

      {/* Content */}
      {subTab === "levels" ? <MobigateQuizLevelsManagement /> : <AdminQuizQuestionsManager />}
    </div>
  );
}
