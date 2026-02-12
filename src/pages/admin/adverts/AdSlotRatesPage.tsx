import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DollarSign, Clock, Save, TrendingUp, Percent } from "lucide-react";
import { MobigateAdminHeader } from "@/components/mobigate/MobigateAdminHeader";
import { SLOT_PACKS } from "@/data/slotPacks";
import { useToast } from "@/hooks/use-toast";

const initialDurations = [
  { days: 7, label: "7 Days", multiplier: 1.0 },
  { days: 14, label: "14 Days", multiplier: 1.8 },
  { days: 30, label: "30 Days", multiplier: 3.2 },
  { days: 60, label: "60 Days", multiplier: 5.5 },
  { days: 90, label: "90 Days", multiplier: 7.5 },
];

const initialDpdTiers = [
  { label: "Tier 1 (1-100 views/day)", rate: 50 },
  { label: "Tier 2 (101-500 views/day)", rate: 120 },
  { label: "Tier 3 (501-2000 views/day)", rate: 300 },
  { label: "Tier 4 (2000+ views/day)", rate: 500 },
];

export default function AdSlotRatesPage() {
  const { toast } = useToast();
  const [baseRate, setBaseRate] = useState(500);
  const [durations, setDurations] = useState(initialDurations);
  const [dpdTiers, setDpdTiers] = useState(initialDpdTiers);

  const handleSaveSlotRates = () => {
    toast({ title: "Slot Rates Updated", description: "Base rate and pack discounts saved successfully." });
  };

  const handleSaveDurations = () => {
    toast({ title: "Duration Rates Updated", description: "Duration multipliers saved successfully." });
  };

  const handleSaveDpd = () => {
    toast({ title: "DPD Tiers Updated", description: "Display-per-day pricing saved successfully." });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobigateAdminHeader title="Ad Slot Rates" subtitle="Configure pricing & discounts" />

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-4 space-y-4">
          {/* Base Rate */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Base Rate per Slot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground shrink-0">Mobi per slot:</span>
                <Input
                  type="number"
                  value={baseRate}
                  onChange={e => setBaseRate(Number(e.target.value))}
                  className="h-12 text-lg font-bold"
                />
              </div>
              <p className="text-xs text-muted-foreground">This is the full price for 1 ad slot before any pack discounts.</p>
            </CardContent>
          </Card>

          {/* Slot Packs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Percent className="h-5 w-5 text-amber-500" />
                Slot Pack Discounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {SLOT_PACKS.map(pack => {
                const effectiveRate = Math.round(baseRate * (1 - pack.discountPercentage / 100));
                return (
                  <div key={pack.id} className="p-3 bg-muted/30 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{pack.name}</p>
                        <p className="text-xs text-muted-foreground">{pack.minSlots}–{pack.maxSlots} slots</p>
                      </div>
                      <Badge variant={pack.discountPercentage > 0 ? "default" : "secondary"}>
                        {pack.discountPercentage > 0 ? `-${pack.discountPercentage}%` : "Full Price"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Effective rate:</span>
                      <span className="font-bold text-primary">{effectiveRate} Mobi/slot</span>
                    </div>
                  </div>
                );
              })}
              <Button onClick={handleSaveSlotRates} className="w-full h-12 mt-2">
                <Save className="h-4 w-4 mr-2" />
                Save Slot Rates
              </Button>
            </CardContent>
          </Card>

          {/* Duration Multipliers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Duration Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {durations.map((dur, i) => (
                <div key={dur.days} className="flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{dur.label}</p>
                    <p className="text-xs text-muted-foreground">Cost: {Math.round(baseRate * dur.multiplier)} Mobi</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">×</span>
                    <Input
                      type="number"
                      step="0.1"
                      value={dur.multiplier}
                      onChange={e => {
                        const updated = [...durations];
                        updated[i] = { ...dur, multiplier: Number(e.target.value) };
                        setDurations(updated);
                      }}
                      className="h-10 w-20 text-center font-bold"
                    />
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveDurations} variant="outline" className="w-full h-12 mt-2">
                <Save className="h-4 w-4 mr-2" />
                Save Duration Rates
              </Button>
            </CardContent>
          </Card>

          {/* DPD Pricing Tiers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                DPD Pricing Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">Display-Per-Day rate based on estimated daily impressions.</p>
              {dpdTiers.map((tier, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm flex-1">{tier.label}</p>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={tier.rate}
                      onChange={e => {
                        const updated = [...dpdTiers];
                        updated[i] = { ...tier, rate: Number(e.target.value) };
                        setDpdTiers(updated);
                      }}
                      className="h-10 w-20 text-center font-bold"
                    />
                    <span className="text-xs text-muted-foreground shrink-0">Mobi</span>
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveDpd} variant="outline" className="w-full h-12 mt-2">
                <Save className="h-4 w-4 mr-2" />
                Save DPD Tiers
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
