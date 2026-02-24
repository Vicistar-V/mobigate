import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Save, TrendingUp, Percent } from "lucide-react";
import { Header } from "@/components/Header";
import { SLOT_PACKS } from "@/data/slotPacks";
import { useToast } from "@/hooks/use-toast";

const initialDurations = [
  { days: 7, label: "7 Days", multiplier: 1.0 },
  { days: 14, label: "14 Days", multiplier: 1.8 },
  { days: 30, label: "30 Days", multiplier: 3.2 },
  { days: 60, label: "60 Days", multiplier: 5.5 },
  { days: 90, label: "90 Days", multiplier: 7.5 },
];

const initialDpdPackages = [
  { name: "Basic", dpd: 1000, price: 10000 },
  { name: "Standard", dpd: 2000, price: 20000 },
  { name: "Professional", dpd: 3000, price: 30000 },
  { name: "Business", dpd: 4000, price: 40000 },
  { name: "Enterprise", dpd: 5000, price: 50000 },
  { name: "Entrepreneur", dpd: 6000, price: 60000 },
  { name: "Deluxe", dpd: 7000, price: 70000 },
  { name: "Deluxe Super", dpd: 8000, price: 80000 },
  { name: "Deluxe Super Plus", dpd: 9000, price: 90000 },
  { name: "Deluxe Silver", dpd: 10000, price: 100000 },
  { name: "Deluxe Bronze", dpd: 12000, price: 120000 },
  { name: "Deluxe Gold", dpd: 14000, price: 140000 },
  { name: "Deluxe Gold Plus", dpd: 16000, price: 160000 },
  { name: "Deluxe Diamond", dpd: 18000, price: 180000 },
  { name: "Deluxe Diamond Plus", dpd: 20000, price: 200000 },
  { name: "Deluxe Platinum", dpd: 25000, price: 250000 },
  { name: "Deluxe Platinum Plus", dpd: 30000, price: 300000 },
  { name: "Bumper Gold", dpd: 35000, price: 350000 },
  { name: "Bumper Diamond", dpd: 40000, price: 400000 },
  { name: "Bumper Platinum", dpd: 45000, price: 450000 },
  { name: "Bumper Infinity", dpd: 50000, price: 500000 },
  { name: "Unlimited", dpd: null, price: 600000 },
];

export default function AdSlotRatesPage() {
  const { toast } = useToast();
  const baseRate = 10000;
  const [durations, setDurations] = useState(initialDurations);
  const [dpdPackages, setDpdPackages] = useState(initialDpdPackages.map(p => ({ ...p })));
  const [slotPacks, setSlotPacks] = useState(
    SLOT_PACKS.map(p => ({ ...p }))
  );

  const handleSaveSlotRates = () => {
    toast({ title: "Slot Rates Updated", description: "Base rate and pack discounts saved successfully." });
  };

  const handleSaveDurations = () => {
    toast({ title: "Duration Rates Updated", description: "Duration multipliers saved successfully." });
  };

  const handleSaveDpd = () => {
    toast({ title: "DPD Packages Updated", description: "Display-per-day packages saved successfully." });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="px-4 pt-4">
          <h1 className="text-lg font-bold mb-3">Ad Slot Rates</h1>
        </div>
        <div className="p-4 space-y-4">
          {/* Slot Packs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Percent className="h-5 w-5 text-amber-500" />
                Slot Pack Discounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {slotPacks.map((pack, i) => {
                const effectiveRate = Math.round(baseRate * (1 - pack.discountPercentage / 100));
                return (
                  <div key={pack.id} className="p-3 bg-muted/30 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{pack.name}</p>
                      <Badge variant={pack.discountPercentage > 0 ? "default" : "secondary"}>
                        {pack.discountPercentage > 0 ? `-${pack.discountPercentage}%` : "Full Price"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Min Slots</label>
                        <Input
                          type="number"
                          min={1}
                          value={pack.minSlots}
                          onChange={e => {
                            const updated = [...slotPacks];
                            updated[i] = { ...pack, minSlots: Number(e.target.value) };
                            setSlotPacks(updated);
                          }}
                          className="h-10 text-center font-bold text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Max Slots</label>
                        <Input
                          type="number"
                          min={1}
                          value={pack.maxSlots}
                          onChange={e => {
                            const updated = [...slotPacks];
                            updated[i] = { ...pack, maxSlots: Number(e.target.value) };
                            setSlotPacks(updated);
                          }}
                          className="h-10 text-center font-bold text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Discount %</label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={pack.discountPercentage}
                          onChange={e => {
                            const updated = [...slotPacks];
                            updated[i] = { ...pack, discountPercentage: Number(e.target.value) };
                            setSlotPacks(updated);
                          }}
                          className="h-10 text-center font-bold text-sm"
                        />
                      </div>
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

          {/* DPD Packages */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                DPD Rates Per Month
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {dpdPackages.map((pkg, i) => (
                <div key={i} className="flex items-center justify-between gap-2 py-2 px-3 border-b border-border/30 last:border-0">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-foreground">{pkg.name}: </span>
                    <span className="text-sm text-muted-foreground">
                      {pkg.dpd ? `${pkg.dpd.toLocaleString()} DPD` : "Unlimited DPD"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {" "}@ ₦{pkg.price.toLocaleString()}/{pkg.price.toLocaleString()} Mobi
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">
                    Edit
                  </Button>
                </div>
              ))}
              <div className="pt-2">
                <Button onClick={handleSaveDpd} variant="outline" className="w-full h-12 mt-2">
                  <Save className="h-4 w-4 mr-2" />
                  Save DPD Packages
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
