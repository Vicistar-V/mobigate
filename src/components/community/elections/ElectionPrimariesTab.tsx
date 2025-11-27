import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Users, TrendingUp } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";

interface PrimaryResult {
  id: string;
  office: string;
  nominees: {
    id: string;
    name: string;
    avatar: string;
    votes: number;
    percentage: number;
    qualified: boolean;
  }[];
  totalVotes: number;
  date: Date;
  status: "completed" | "ongoing";
}

const mockPrimaries: PrimaryResult[] = [
  {
    id: "prim-1",
    office: "President General",
    nominees: [
      {
        id: "nom-1",
        name: "Paulson",
        avatar: "/src/assets/profile-james-wilson.jpg",
        votes: 187,
        percentage: 42.3,
        qualified: true,
      },
      {
        id: "nom-2",
        name: "Jerome",
        avatar: "/src/assets/profile-michael-chen.jpg",
        votes: 145,
        percentage: 32.8,
        qualified: true,
      },
      {
        id: "nom-3",
        name: "Jude",
        avatar: "/src/assets/profile-robert-brown.jpg",
        votes: 110,
        percentage: 24.9,
        qualified: true,
      },
    ],
    totalVotes: 442,
    date: new Date("2025-01-28"),
    status: "completed",
  },
  {
    id: "prim-2",
    office: "Vice President",
    nominees: [
      {
        id: "nom-4",
        name: "Sarah Johnson",
        avatar: "/src/assets/profile-sarah-johnson.jpg",
        votes: 203,
        percentage: 51.4,
        qualified: true,
      },
      {
        id: "nom-5",
        name: "David Martinez",
        avatar: "/src/assets/profile-david-martinez.jpg",
        votes: 192,
        percentage: 48.6,
        qualified: true,
      },
    ],
    totalVotes: 395,
    date: new Date("2025-01-29"),
    status: "completed",
  },
];

export const ElectionPrimariesTab = () => {
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Nomination Primaries</h1>
        </div>
      </div>

      {/* Description */}
      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          Primary elections determine which candidates will represent their groups in the general election.
          Only qualified nominees proceed to the main ballot.
        </p>
      </Card>

      {/* Primaries List */}
      <div className="space-y-6">
        {mockPrimaries.map((primary) => (
          <Card key={primary.id} className="p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{primary.office}</h3>
                <Badge variant={primary.status === "completed" ? "default" : "secondary"}>
                  {primary.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {primary.totalVotes} votes
                </span>
                <span>{primary.date.toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              {primary.nominees.map((nominee, idx) => (
                <div key={nominee.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xl font-bold text-muted-foreground">
                      #{idx + 1}
                    </span>
                    <Avatar>
                      <AvatarImage src={nominee.avatar} alt={nominee.name} />
                      <AvatarFallback>{nominee.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{nominee.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {nominee.votes} votes ({nominee.percentage.toFixed(1)}%)
                      </p>
                    </div>
                    {nominee.qualified && (
                      <Badge className="bg-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Qualified
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-primaries" />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
