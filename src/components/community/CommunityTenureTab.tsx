import { Card } from "@/components/ui/card";
import { PremiumAdCard } from "@/components/PremiumAdCard";
import { officeTenures } from "@/data/communityExecutivesData";

export const CommunityTenureTab = () => {
  const premiumAd = {
    id: "tenure-premium-1",
    advertiser: {
      name: "Leadership Training Institute",
      verified: true,
    },
    content: {
      headline: "Empower Your Leadership Team",
      description: "Professional development programs for community executives. Enroll now for Q1 2025.",
      ctaText: "View Programs",
      ctaUrl: "https://example.com/leadership",
    },
    media: {
      type: "carousel" as const,
      items: [
        {
          url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
          caption: "Executive Leadership Training",
        },
        {
          url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
          caption: "Team Building Workshops",
        },
      ],
    },
    layout: "standard" as const,
    duration: 15,
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="bg-primary text-primary-foreground p-3">
          <h3 className="font-semibold text-sm">Office Tenure Information</h3>
        </div>
        <div className="divide-y">
          {officeTenures.map((tenure) => (
            <div key={tenure.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{tenure.position}</h4>
                  <p className="text-sm text-muted-foreground">{tenure.currentHolder}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{tenure.termStart} - {tenure.termEnd}</p>
                  <p className="text-primary font-medium mt-1">{tenure.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Advertisement */}
      <PremiumAdCard {...premiumAd} />
    </div>
  );
};
