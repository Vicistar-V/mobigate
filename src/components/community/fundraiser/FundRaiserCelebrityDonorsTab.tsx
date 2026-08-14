import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FundRaiserHeader } from "./FundRaiserHeader";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { useState, useEffect } from "react";
import { Trophy, Heart, DollarSign, Loader2, Star } from "lucide-react";

interface CelebrityDonor {
  user_id: string;
  name: string;
  avatar?: string | null;
  total_donated: string | number;
  star_level: number;
}

export const FundRaiserCelebrityDonorsTab = () => {
  const [celebrities, setCelebrities] = useState<CelebrityDonor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/community/fundraiser.php?action=celebrity_donors`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { celebrities: [] }))
      .then((d) => setCelebrities(d.celebrities ?? []))
      .catch(() => setCelebrities([]))
      .finally(() => setLoading(false));
  }, []);

  const sortedCelebrities = [...celebrities]
    .map((c) => ({ ...c, amount: parseFloat(String(c.total_donated)) }))
    .sort((a, b) => b.amount - a.amount);

  const totalDonated = sortedCelebrities.reduce((sum, donor) => sum + donor.amount, 0);

  return (
    <div className="space-y-6 pb-20">
      <FundRaiserHeader />

      <div className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h2 className="text-2xl font-bold">Celebrity Donors</h2>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-muted-foreground">
            Recognizing our most generous supporters
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-yellow-500" /></div>
        ) : sortedCelebrities.length === 0 ? (
          <Card className="p-8 text-center">
            <Trophy className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">No celebrity donors yet. Donate M1,000+ lifetime to become one!</p>
          </Card>
        ) : (
        <>
        {/* Total Stats */}
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Total Celebrity Donations</p>
            <p className="text-4xl font-bold text-green-600">
              M{totalDonated.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              From {sortedCelebrities.length} distinguished donors
            </p>
          </div>
        </Card>

        {/* Top 3 Recognition */}
        <div className="space-y-3">
          {sortedCelebrities.slice(0, 3).map((donor, index) => (
            <Card
              key={donor.user_id}
              className={`p-6 border-2 ${
                index === 0
                  ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100"
                  : index === 1
                  ? "border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100"
                  : "border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Position Badge */}
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                    <AvatarImage src={donor.avatar || undefined} />
                    <AvatarFallback className="text-2xl">
                      {(donor.name || "?").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -top-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-500"
                        : "bg-orange-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xl font-bold">{donor.name}</p>
                    <Badge className="bg-purple-600">Celebrity</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {Array.from({ length: donor.star_level }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-green-600 font-bold text-2xl">
                    <DollarSign className="h-6 w-6" />
                    <span>M{donor.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Lifetime donations across all campaigns</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Other Celebrity Donors */}
        {sortedCelebrities.length > 3 && (
          <>
            <h3 className="text-lg font-bold pt-4">Other Distinguished Donors</h3>
            <div className="space-y-3">
              {sortedCelebrities.slice(3).map((donor, index) => (
                <Card key={donor.user_id} className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={donor.avatar || undefined} />
                      <AvatarFallback>{(donor.name || "?").charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{donor.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          #{index + 4}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-bold">
                          M{donor.amount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: donor.star_level }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        </>
        )}

        {/* Recognition Message */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 text-center">
          <Heart className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-2">Thank You!</h3>
          <p className="text-sm text-muted-foreground">
            Your generosity inspires our community and makes a real difference in people's lives.
            Together, we are building a more compassionate world.
          </p>
        </Card>
      </div>

      {/* Ads */}
      <PremiumAdRotation
        slotId="fundraiser-celebrity-ad"
        ads={[]}
        context="feed"
      />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
