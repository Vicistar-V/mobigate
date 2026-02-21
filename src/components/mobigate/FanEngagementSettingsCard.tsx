import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Share2, Star, Save, CheckCircle2, Users } from "lucide-react";
import { formatMobiAmount } from "@/lib/mobiCurrencyTranslation";
import {
  fanEngagementSettings,
  setFanLikeFee,
  setFanCommentFee,
  setFanShareFee,
  setFanJoinFansFee,
} from "@/data/liveScoreboardData";

export function FanEngagementSettingsCard() {
  const { toast } = useToast();
  const [likeFee, setLikeFeeLocal] = useState(fanEngagementSettings.likeFee.value);
  const [commentFee, setCommentFeeLocal] = useState(fanEngagementSettings.commentFee.value);
  const [shareFee, setShareFeeLocal] = useState(fanEngagementSettings.shareFee.value);
  const [joinFansFee, setJoinFansFeeLocal] = useState(fanEngagementSettings.joinFansFee.value);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    likeFee !== fanEngagementSettings.likeFee.value ||
    commentFee !== fanEngagementSettings.commentFee.value ||
    shareFee !== fanEngagementSettings.shareFee.value ||
    joinFansFee !== fanEngagementSettings.joinFansFee.value;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setFanLikeFee(likeFee);
    setFanCommentFee(commentFee);
    setFanShareFee(shareFee);
    setFanJoinFansFee(joinFansFee);
    toast({
      title: "Fan Engagement Fees Updated",
      description: `Like: ${formatMobiAmount(likeFee)}, Comment: ${formatMobiAmount(commentFee)}, Share: ${formatMobiAmount(shareFee)}, Join Fans: ${formatMobiAmount(joinFansFee)}.`,
    });
    setIsSaving(false);
  };

  const feeRows = [
    { icon: Heart, color: "text-red-500", bg: "bg-red-500/10", label: "Like Fee", value: likeFee, set: setLikeFeeLocal, config: fanEngagementSettings.likeFee },
    { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10", label: "Comment Fee", value: commentFee, set: setCommentFeeLocal, config: fanEngagementSettings.commentFee },
    { icon: Share2, color: "text-green-500", bg: "bg-green-500/10", label: "Share Fee", value: shareFee, set: setShareFeeLocal, config: fanEngagementSettings.shareFee },
    { icon: Star, color: "text-purple-500", bg: "bg-purple-500/10", label: "Join Fans Fee", value: joinFansFee, set: setJoinFansFeeLocal, config: fanEngagementSettings.joinFansFee },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base">Fan Engagement Charges</CardTitle>
              <CardDescription className="text-xs">Set fees for scoreboard interactions</CardDescription>
            </div>
          </div>
          {hasChanges && <Badge variant="default" className="text-xs">Modified</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {feeRows.map((row, idx) => (
          <div key={row.label}>
            {idx > 0 && <Separator className="mb-5" />}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <row.icon className={`h-4 w-4 ${row.color}`} />
                  <span className="text-sm font-medium">{row.label}</span>
                </div>
                <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
                  {formatMobiAmount(row.value)}
                </Badge>
              </div>

              <div className={`text-center p-3 rounded-lg ${row.bg}`}>
                <p className={`text-2xl font-bold ${row.color}`}>{formatMobiAmount(row.value)}</p>
                <p className="text-xs text-muted-foreground">per {row.label.replace(" Fee", "").toLowerCase()}</p>
              </div>

              <div className="px-1">
                <Slider
                  value={[row.value]}
                  onValueChange={(v) => row.set(v[0])}
                  min={row.config.min}
                  max={row.config.max}
                  step={row.config.step}
                  className="w-full touch-manipulation"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatMobiAmount(row.config.min)}</span>
                  <span className="font-medium text-foreground">{formatMobiAmount(row.value)}</span>
                  <span>{formatMobiAmount(row.config.max)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Separator />

        {/* Fee Summary */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Current Fee Structure</p>
          <div className="grid grid-cols-2 gap-2 text-center">
            {feeRows.map(row => (
              <div key={row.label} className={`p-2 rounded-lg ${row.bg} border`}>
                <row.icon className={`h-3.5 w-3.5 mx-auto mb-0.5 ${row.color}`} />
                <p className="text-[10px] text-muted-foreground">{row.label.replace(" Fee", "")}</p>
                <p className={`font-bold text-xs ${row.color}`}>{formatMobiAmount(row.value)}</p>
              </div>
            ))}
          </div>
        </div>

        {hasChanges ? (
          <Button className="w-full" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Fan Engagement Fees</>}
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Fees are up to date</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
