import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FundRaiserHeader } from "./FundRaiserHeader";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { mockCelebrityDonors } from "@/data/fundraiserData";
import { Trophy, Heart, DollarSign } from "lucide-react";

export const FundRaiserCelebrityDonorsTab = () => {
  // Sort by amount descending
  const sortedCelebrities = [...mockCelebrityDonors].sort((a, b) => b.amount - a.amount);
  
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

        {/* Total Stats */}
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Total Celebrity Donations</p>
            <p className="text-4xl font-bold text-green-600">
              ${totalDonated.toLocaleString()}
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
              key={donor.id}
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
                    <AvatarImage src={donor.avatar} />
                    <AvatarFallback className="text-2xl">
                      {donor.name.charAt(0)}
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
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold">{donor.name}</p>
                    <Badge className="bg-purple-600">Celebrity</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-green-600 font-bold text-2xl">
                    <DollarSign className="h-6 w-6" />
                    <span>${donor.amount.toLocaleString()}</span>
                  </div>

                  {donor.message && (
                    <div className="flex items-start gap-2 mt-3 p-3 bg-white/60 rounded-lg">
                      <Heart className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm italic">{donor.message}</p>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Donated on {new Date(donor.date).toLocaleDateString()}
                  </p>
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
                <Card key={donor.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={donor.avatar} />
                      <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{donor.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          #{index + 4}
                        </Badge>
                      </div>

                      {donor.message && (
                        <p className="text-sm italic text-muted-foreground line-clamp-1">
                          "{donor.message}"
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-bold">
                          ${donor.amount.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(donor.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
