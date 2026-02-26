import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, ArrowLeft, Info, Megaphone } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

const DURATION_PRICING = [
  { label: "7 Days", cost: 500, perDay: 71 },
  { label: "14 Days", cost: 900, perDay: 64 },
  { label: "30 Days", cost: 1600, perDay: 53 },
  { label: "60 Days", cost: 2750, perDay: 46 },
  { label: "90 Days", cost: 3750, perDay: 42 },
];

export default function CommunityAdvertRatesPage() {
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <ScrollArea className="h-[calc(100vh-80px)]">
        {/* Top Bar */}
        <div className="px-4 pt-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate(`/community/${communityId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Community Advert Rates</h1>
            <p className="text-xs text-muted-foreground">Pricing guide for community advertisements</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Info Banner */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex gap-3 items-start">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Rates shown are the current community prices. Longer durations offer better daily rates.
            </p>
          </div>

          {/* Duration Pricing */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Duration Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Longer durations = lower daily cost</p>
              {DURATION_PRICING.map((dur) => (
                <div key={dur.label} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{dur.label}</p>
                    <p className="text-xs text-muted-foreground">≈ {dur.perDay} Mobi/day</p>
                  </div>
                  <p className="font-bold text-sm">{dur.cost.toLocaleString()} Mobi</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="pt-4 pb-6">
            <Button
              className="w-full h-12 text-base font-semibold gap-2"
              onClick={() => navigate(`/community/${communityId}/create-advert`)}
            >
              <Megaphone className="h-5 w-5" />
              Create Advertisement
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
