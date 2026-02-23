import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Timer,
  Trophy,
  Save,
  AlertCircle,
  CheckCircle2,
  Eye,
  PenLine,
  Wallet,
} from "lucide-react";
import {
  platformQuizSettings,
  platformQuestionViewSettings,
  platformSolvencySettings,
  setObjectiveTimePerQuestion,
  setNonObjectiveTimePerQuestion,
  setPartialWinPercentage,
  setQuestionViewFee,
  setMerchantSolvencyPercent,
} from "@/data/platformSettingsData";
import { formatMobiAmount } from "@/lib/mobiCurrencyTranslation";

export function QuizSettingsCard() {
  const { toast } = useToast();
  const [objTime, setObjTime] = useState(platformQuizSettings.objectiveTimePerQuestion);
  const [nonObjTime, setNonObjTime] = useState(platformQuizSettings.nonObjectiveTimePerQuestion);
  const [winPercentage, setWinPercentage] = useState(platformQuizSettings.partialWinPercentage);
  const [viewFee, setViewFee] = useState(platformQuestionViewSettings.questionViewFee);
  const [solvencyPercent, setSolvencyPercent] = useState(platformSolvencySettings.merchantSolvencyPercent);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    objTime !== platformQuizSettings.objectiveTimePerQuestion ||
    nonObjTime !== platformQuizSettings.nonObjectiveTimePerQuestion ||
    winPercentage !== platformQuizSettings.partialWinPercentage ||
    viewFee !== platformQuestionViewSettings.questionViewFee ||
    solvencyPercent !== platformSolvencySettings.merchantSolvencyPercent;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setObjectiveTimePerQuestion(objTime);
    setNonObjectiveTimePerQuestion(nonObjTime);
    setPartialWinPercentage(winPercentage);
    setQuestionViewFee(viewFee);
    setMerchantSolvencyPercent(solvencyPercent);

    toast({
      title: "Quiz Settings Updated",
      description: `Objective: ${objTime}s, Non-Objective: ${nonObjTime}s, Partial Win: ${winPercentage}%, View Fee: ${formatMobiAmount(viewFee)}, Solvency: ${solvencyPercent}%. Changes apply platform-wide.`,
    });
    setIsSaving(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Timer className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-base">Quiz Game Settings</CardTitle>
              <CardDescription className="text-xs">
                Platform-wide quiz configuration
              </CardDescription>
            </div>
          </div>
          {hasChanges && (
            <Badge variant="default" className="text-xs">
              Modified
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Objective Time Per Question */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Objective Time</span>
            </div>
            <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
              {objTime}s
            </Badge>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-amber-600">{objTime}</p>
            <p className="text-sm text-muted-foreground">seconds per objective question</p>
          </div>

          <div className="px-1">
            <Slider
              value={[objTime]}
              onValueChange={(values) => setObjTime(values[0])}
              min={platformQuizSettings.objectiveTimeMin}
              max={platformQuizSettings.objectiveTimeMax}
              step={1}
              className="w-full touch-manipulation"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{platformQuizSettings.objectiveTimeMin}s</span>
              <span className="font-medium text-foreground">{objTime}s</span>
              <span>{platformQuizSettings.objectiveTimeMax}s</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Non-Objective Time Per Question */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Non-Objective Time</span>
            </div>
            <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
              {nonObjTime}s
            </Badge>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-amber-600">{nonObjTime}</p>
            <p className="text-sm text-muted-foreground">seconds per written question</p>
          </div>

          <div className="px-1">
            <Slider
              value={[nonObjTime]}
              onValueChange={(values) => setNonObjTime(values[0])}
              min={platformQuizSettings.nonObjectiveTimeMin}
              max={platformQuizSettings.nonObjectiveTimeMax}
              step={1}
              className="w-full touch-manipulation"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{platformQuizSettings.nonObjectiveTimeMin}s</span>
              <span className="font-medium text-foreground">{nonObjTime}s</span>
              <span>{platformQuizSettings.nonObjectiveTimeMax}s</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Partial Win Percentage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Partial Win (8-9/10)</span>
            </div>
            <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
              {winPercentage}%
            </Badge>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-amber-600">{winPercentage}%</p>
            <p className="text-sm text-muted-foreground">of winning amount for 8-9 correct</p>
          </div>

          <div className="px-1">
            <Slider
              value={[winPercentage]}
              onValueChange={(values) => setWinPercentage(values[0])}
              min={platformQuizSettings.partialWinMin}
              max={platformQuizSettings.partialWinMax}
              step={5}
              className="w-full touch-manipulation"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{platformQuizSettings.partialWinMin}%</span>
              <span className="font-medium text-foreground">{winPercentage}%</span>
              <span>{platformQuizSettings.partialWinMax}%</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Question View Fee */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Question View Fee</span>
            </div>
            <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
              {formatMobiAmount(viewFee)}
            </Badge>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-amber-600">{formatMobiAmount(viewFee)}</p>
            <p className="text-sm text-muted-foreground">charged per quiz view</p>
          </div>

          <div className="px-1">
            <Slider
              value={[viewFee]}
              onValueChange={(values) => setViewFee(values[0])}
              min={platformQuestionViewSettings.questionViewFeeMin}
              max={platformQuestionViewSettings.questionViewFeeMax}
              step={500}
              className="w-full touch-manipulation"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatMobiAmount(platformQuestionViewSettings.questionViewFeeMin)}</span>
              <span className="font-medium text-foreground">{formatMobiAmount(viewFee)}</span>
              <span>{formatMobiAmount(platformQuestionViewSettings.questionViewFeeMax)}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 bg-muted/30 rounded-lg">
            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Players will be charged this amount from their main wallet to view played quiz questions in their history.
            </p>
          </div>
        </div>

        <Separator />

        {/* Merchant Solvency Requirement */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Solvency Requirement</span>
            </div>
            <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
              {solvencyPercent}%
            </Badge>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-amber-600">{solvencyPercent}%</p>
            <p className="text-sm text-muted-foreground">of prize pool required in wallet</p>
          </div>

          <div className="px-1">
            <Slider
              value={[solvencyPercent]}
              onValueChange={(values) => setSolvencyPercent(values[0])}
              min={platformSolvencySettings.merchantSolvencyMin}
              max={platformSolvencySettings.merchantSolvencyMax}
              step={5}
              className="w-full touch-manipulation"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{platformSolvencySettings.merchantSolvencyMin}%</span>
              <span className="font-medium text-foreground">{solvencyPercent}%</span>
              <span>{platformSolvencySettings.merchantSolvencyMax}%</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 bg-muted/30 rounded-lg">
            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Merchants must have at least this percentage of their total prize pool in their wallet to create a season without requesting a waiver.
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Current Winning Structure</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-200">
              <p className="text-xs text-muted-foreground">10/10</p>
              <p className="font-bold text-green-600">100%</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-200">
              <p className="text-xs text-muted-foreground">8-9/10</p>
              <p className="font-bold text-yellow-600">{winPercentage}%</p>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-200">
              <p className="text-xs text-muted-foreground">&lt;8/10</p>
              <p className="font-bold text-red-600">0%</p>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-0.5">Platform-Wide Setting</p>
            <p>
              These settings apply to all quiz types: Community Quizzes, 
              Mobigate Quizzes, and newly created quizzes. Changes take effect immediately.
            </p>
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>Saving Changes...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Quiz Settings
              </>
            )}
          </Button>
        )}

        {!hasChanges && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Settings are up to date</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
