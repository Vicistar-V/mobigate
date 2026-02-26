import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const initialBonusTiers = [
  { label: "Basic Slot Pack", slots: "3-4 Slots", multiplier: 15 as number | null, minimum: 45 as number | null },
  { label: "Standard Slot Pack", slots: "5-7 Slots", multiplier: 9 as number | null, minimum: 45 as number | null },
  { label: "Business Slot Pack", slots: "8-10 Slots", multiplier: 6 as number | null, minimum: 48 as number | null },
  { label: "Enterprise Slot Pack", slots: "11-15 Slots", multiplier: 4 as number | null, minimum: 44 as number | null },
  { label: "Cumulative Slot Pack", slots: "45 Randomly", multiplier: null as number | null, minimum: null as number | null },
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
  const [bonusTiers, setBonusTiers] = useState(initialBonusTiers.map(b => ({ ...b })));

  const [slotPacks, setSlotPacks] = useState(
    SLOT_PACKS.map(p => ({ ...p }))
  );

  const handleSaveSlotRates = () => {
    toast({ title: "Slot Rates Updated", description: "Base rate and pack discounts saved successfully." });
  };


  const handleSaveDurations = () => {
    toast({ title: "Community Duration Rates Updated", description: "Duration pricing for communities saved successfully." });
  };

  const handleSaveBonus = () => {
    toast({ title: "Bonus Tiers Updated", description: "Special bonus advert slot tiers saved successfully." });
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
              {slotPacks.map((pack, i) => (
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
                  </div>
              ))}
              <Button onClick={handleSaveSlotRates} className="w-full h-12 mt-2">
                <Save className="h-4 w-4 mr-2" />
                Save Slot Rates
              </Button>
            </CardContent>
          </Card>

          {/* Special Bonus Advert Slot - Editable */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Special Bonus [1-FREE] Advert Slot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bonusTiers.map((item, i) => (
                <div key={i} className="p-3 bg-background rounded-lg border border-border/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{String.fromCharCode(97 + i)}. {item.label}</p>
                    <Badge variant="outline" className="shrink-0 text-primary border-primary/40">1-Free</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Slots</label>
                      <Input
                        value={item.slots}
                        onChange={e => {
                          const updated = [...bonusTiers];
                          updated[i] = { ...item, slots: e.target.value };
                          setBonusTiers(updated);
                        }}
                        className="h-10 text-center text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Multiplier</label>
                      <Input
                        type="number"
                        value={item.multiplier ?? ""}
                        placeholder="—"
                        onChange={e => {
                          const updated = [...bonusTiers];
                          updated[i] = { ...item, multiplier: e.target.value ? Number(e.target.value) : null };
                          setBonusTiers(updated);
                        }}
                        className="h-10 text-center text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Minimum</label>
                      <Input
                        type="number"
                        value={item.minimum ?? ""}
                        placeholder="—"
                        onChange={e => {
                          const updated = [...bonusTiers];
                          updated[i] = { ...item, minimum: e.target.value ? Number(e.target.value) : null };
                          setBonusTiers(updated);
                        }}
                        className="h-10 text-center text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveBonus} variant="outline" className="w-full h-12 mt-2">
                <Save className="h-4 w-4 mr-2" />
                Save Bonus Tiers
              </Button>
            </CardContent>
          </Card>


          {/* Community Duration Pricing */}
          <Card className="border-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent-foreground" />
                Community Duration Pricing
              </CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Users className="h-3.5 w-3.5" />
                These rates apply to community adverts only
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {durations.map((dur, i) => (
                <div key={i} className="py-3 px-3 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{dur.label}</span>
                    <Badge variant="secondary" className="text-xs">{dur.days} days</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={dur.price}
                      onChange={e => {
                        const updated = [...durations];
                        updated[i] = { ...dur, price: Number(e.target.value) };
                        setDurations(updated);
                      }}
                      className="h-10 flex-1 text-sm font-bold"
                    />
                    <span className="text-sm text-muted-foreground shrink-0">Mobi</span>
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveDurations} variant="outline" className="w-full h-12 mt-2">
                <Save className="h-4 w-4 mr-2" />
                Save Durations
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
                <div key={i} className="py-2 px-3 border-b border-border/30 last:border-0">
                  {editingDpdIndex === i ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">DPD</label>
                          <Input
                            type="number"
                            value={pkg.dpd ?? ""}
                            placeholder="Unlimited"
                            onChange={e => {
                              const updated = [...dpdPackages];
                              updated[i] = { ...pkg, dpd: e.target.value ? Number(e.target.value) : null };
                              setDpdPackages(updated);
                            }}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Price (₦/Mobi)</label>
                          <Input
                            type="number"
                            value={pkg.price}
                            onChange={e => {
                              const updated = [...dpdPackages];
                              updated[i] = { ...pkg, price: Number(e.target.value) };
                              setDpdPackages(updated);
                            }}
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setEditingDpdIndex(null)}>
                        Done
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-foreground">{pkg.name}: </span>
                        <span className="text-sm text-muted-foreground">
                          {pkg.dpd ? `${pkg.dpd.toLocaleString()} DPD` : "Unlimited DPD"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {" "}@ ₦{pkg.price.toLocaleString()}/{pkg.price.toLocaleString()} Mobi
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-xs shrink-0" onClick={() => setEditingDpdIndex(i)}>
                        Edit
                      </Button>
                    </div>
                  )}
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
