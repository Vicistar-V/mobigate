import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Save, TrendingUp, Percent, Gift, Clock, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { SLOT_PACKS } from "@/data/slotPacks";
import { useToast } from "@/hooks/use-toast";

const initialDurations = [
  { label: "7 Days", days: 7, price: 500 },
  { label: "14 Days", days: 14, price: 900 },
  { label: "1 Month", days: 30, price: 1500 },
  { label: "2 Months", days: 60, price: 2800 },
  { label: "3 Months", days: 90, price: 4000 },
  { label: "6 Months", days: 180, price: 7500 },
  { label: "12 Months", days: 365, price: 14000 },
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
  
  const [dpdPackages, setDpdPackages] = useState(initialDpdPackages.map(p => ({ ...p })));
  const [editingDpdIndex, setEditingDpdIndex] = useState<number | null>(null);
  const [durations, setDurations] = useState(initialDurations.map(d => ({ ...d })));

  const [slotPacks, setSlotPacks] = useState(
    SLOT_PACKS.map(p => ({ ...p }))
  );

  const handleSaveSlotRates = () => {
    toast({ title: "Slot Rates Updated", description: "Base rate and pack discounts saved successfully." });
  };


  const handleSaveDurations = () => {
    toast({ title: "Community Duration Rates Updated", description: "Duration pricing for communities saved successfully." });
  };

  const handleSaveDpd = () => {
    toast({ title: "DPD Packages Updated", description: "Display-per-day packages saved successfully." });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <div className="h-[calc(100vh-80px)] overflow-y-auto touch-auto overscroll-contain">
        <div className="px-3 pt-3 pb-1">
          <h1 className="text-lg font-bold">Ad Slot Rates</h1>
        </div>
        <div className="px-3 pb-6 space-y-3">

          {/* ── Slot Pack Discounts ── */}
          <Card>
            <CardHeader className="px-3 py-2.5">
              <CardTitle className="text-sm flex items-center gap-2">
                <Percent className="h-4 w-4 text-primary" />
                Slot Pack Discounts
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-2">
              {slotPacks.map((pack, i) => {
                const effectiveRate = Math.round(baseRate * (1 - pack.discountPercentage / 100));
                return (
                  <div key={pack.id} className="p-2.5 bg-muted/30 rounded-lg space-y-2">
                    {/* Row 1: Name + Badge */}
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate">{pack.name}</p>
                      <Badge variant={pack.discountPercentage > 0 ? "default" : "secondary"} className="text-xs shrink-0 ml-2">
                        {pack.discountPercentage > 0 ? `-${pack.discountPercentage}%` : "Full"}
                      </Badge>
                    </div>
                    {/* Row 2: 3-col inputs */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">Min</label>
                        <Input
                          type="number"
                          min={1}
                          value={pack.minSlots}
                          onChange={e => {
                            const updated = [...slotPacks];
                            updated[i] = { ...pack, minSlots: Number(e.target.value) };
                            setSlotPacks(updated);
                          }}
                          className="h-9 text-center font-bold text-sm px-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">Max</label>
                        <Input
                          type="number"
                          min={1}
                          value={pack.maxSlots}
                          onChange={e => {
                            const updated = [...slotPacks];
                            updated[i] = { ...pack, maxSlots: Number(e.target.value) };
                            setSlotPacks(updated);
                          }}
                          className="h-9 text-center font-bold text-sm px-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">Disc %</label>
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
                          className="h-9 text-center font-bold text-sm px-1"
                        />
                      </div>
                    </div>
                    {/* Row 3: Effective rate */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Effective rate:</span>
                      <span className="font-bold text-primary whitespace-nowrap">{effectiveRate.toLocaleString()} Mobi/slot</span>
                    </div>
                  </div>
                );
              })}
              <Button onClick={handleSaveSlotRates} className="w-full h-11 mt-1 text-sm touch-manipulation">
                <Save className="h-4 w-4 mr-2" />
                Save Slot Rates
              </Button>
            </CardContent>
          </Card>

          {/* ── Special Bonus [1-FREE] ── */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="px-3 py-2.5">
              <CardTitle className="text-sm flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                Special Bonus [1-FREE] Advert Slot
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-1.5">
              {[
                { label: "Basic Slot Pack", slots: "3-4 Slots", multiplier: 15, minimum: 45 },
                { label: "Standard Slot Pack", slots: "5-7 Slots", multiplier: 9, minimum: 45 },
                { label: "Business Slot Pack", slots: "8-10 Slots", multiplier: 6, minimum: 48 },
                { label: "Enterprise Slot Pack", slots: "11-15 Slots", multiplier: 4, minimum: 44 },
                { label: "Cumulative Slot Pack", slots: "45 Randomly", multiplier: null, minimum: null },
              ].map((item, i) => (
                <div key={i} className="py-2 px-2.5 bg-background rounded-lg border border-border/40">
                  {/* Row 1: Label + Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate">{String.fromCharCode(97 + i)}. {item.label}</p>
                    <Badge variant="outline" className="shrink-0 text-primary border-primary/40 text-[10px]">1-Free</Badge>
                  </div>
                  {/* Row 2: Metadata */}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    [{item.slots}]{item.multiplier ? ` × ${item.multiplier}` : ""}{item.minimum ? ` (Min ${item.minimum})` : ""}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ── Community Duration Pricing ── */}
          <Card className="border-accent/30">
            <CardHeader className="px-3 py-2.5">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent-foreground" />
                Community Duration Pricing
              </CardTitle>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <Users className="h-3 w-3" />
                Community adverts only
              </p>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-1.5">
              {durations.map((dur, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-2.5 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium whitespace-nowrap">{dur.label}</span>
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      value={dur.price}
                      onChange={e => {
                        const updated = [...durations];
                        updated[i] = { ...dur, price: Number(e.target.value) };
                        setDurations(updated);
                      }}
                      className="h-8 w-20 text-right text-sm font-bold px-2"
                    />
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">Mobi</span>
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveDurations} variant="outline" className="w-full h-11 mt-1 text-sm touch-manipulation">
                <Save className="h-4 w-4 mr-2" />
                Save Community Rates
              </Button>
            </CardContent>
          </Card>

          {/* ── DPD Packages ── */}
          <Card>
            <CardHeader className="px-3 py-2.5">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                DPD Rates Per Month
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-0">
              {dpdPackages.map((pkg, i) => (
                <div key={i} className="py-1.5 px-2 border-b border-border/20 last:border-0">
                  {editingDpdIndex === i ? (
                    <div className="space-y-2 py-1">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-muted-foreground block mb-0.5">DPD</label>
                          <Input
                            type="number"
                            value={pkg.dpd ?? ""}
                            placeholder="Unlimited"
                            onChange={e => {
                              const updated = [...dpdPackages];
                              updated[i] = { ...pkg, dpd: e.target.value ? Number(e.target.value) : null };
                              setDpdPackages(updated);
                            }}
                            className="h-8 text-sm px-2"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground block mb-0.5">Price</label>
                          <Input
                            type="number"
                            value={pkg.price}
                            onChange={e => {
                              const updated = [...dpdPackages];
                              updated[i] = { ...pkg, price: Number(e.target.value) };
                              setDpdPackages(updated);
                            }}
                            className="h-8 text-sm px-2"
                          />
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs touch-manipulation" onClick={() => setEditingDpdIndex(null)}>
                        Done
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-foreground">{pkg.name}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          {pkg.dpd ? `${pkg.dpd.toLocaleString()}` : "∞"} DPD
                        </span>
                      </div>
                      <span className="text-xs font-bold text-foreground whitespace-nowrap">{pkg.price.toLocaleString()}</span>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] shrink-0 touch-manipulation" onClick={() => setEditingDpdIndex(i)}>
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <Button onClick={handleSaveDpd} variant="outline" className="w-full h-11 mt-2 text-sm touch-manipulation">
                <Save className="h-4 w-4 mr-2" />
                Save DPD Packages
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
