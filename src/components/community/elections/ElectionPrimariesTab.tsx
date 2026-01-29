import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, TrendingUp, ChevronRight } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";
import { VoteBoxGroup } from "../shared/VoteBoxGroup";
import { useNavigate } from "react-router-dom";

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

const getCandidateColors = (index: number) => {
  const colors = [
    { header: "bg-green-600 text-white", cell: "border-green-600 bg-green-50" },
    { header: "bg-yellow-400 text-black", cell: "border-yellow-500 bg-yellow-50" },
    { header: "bg-pink-500 text-white", cell: "border-pink-500 bg-pink-50" },
  ];
  return colors[index % colors.length];
};

export const ElectionPrimariesTab = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-10 w-10 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Nomination Primaries</h1>
      </div>

      {/* Description */}
      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          Primary elections determine which candidates will represent their groups in the general election.
          Only qualified nominees proceed to the main ballot.
        </p>
      </Card>

      {/* Primaries Tables */}
      <div className="space-y-6">
        {mockPrimaries.map((primary) => (
          <Card key={primary.id} className="p-3">
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

            {/* Horizontally Scrollable Table */}
            <div className="overflow-x-auto -mx-3">
              <div className="inline-flex gap-1 px-3 pb-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  More scrolling out <ChevronRight className="w-3 h-3" />
                </div>
              </div>
              <table className="min-w-[650px] border-collapse">
                <thead>
                  <tr>
                    <th className="bg-pink-200 p-2 text-left min-w-[100px] sticky left-0 z-10 border border-gray-300">
                      <div className="font-bold text-sm">Primary for</div>
                      <div className="text-xs font-normal">{primary.office}</div>
                      <div className="text-[10px] text-muted-foreground">[{primary.totalVotes}]</div>
                    </th>
                    {primary.nominees.map((nominee, index) => {
                      const colors = getCandidateColors(index);
                      return (
                        <th key={nominee.id} className={`${colors.header} p-3 text-center min-w-[160px] border border-gray-300`}>
                          <div className="flex flex-col items-center gap-1">
                            <Avatar className="h-10 w-10 border-2 border-white">
                              <AvatarImage src={nominee.avatar} alt={nominee.name} />
                              <AvatarFallback>{nominee.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="font-bold text-sm">{nominee.name}</div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bg-pink-200 p-2 font-bold text-sm sticky left-0 z-10 border border-gray-300">
                      Performance
                    </td>
                    {primary.nominees.map((nominee, index) => {
                      const colors = getCandidateColors(index);
                      return (
                        <td key={nominee.id} className="p-3 border border-gray-300 bg-white">
                          <VoteBoxGroup
                            values={[nominee.votes, `${nominee.percentage.toFixed(0)}%`, index + 1]}
                            labels={['Votes', '%', 'Rank']}
                            colorClass={colors.cell}
                            isLarge={false}
                          />
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="bg-pink-200 p-2 font-bold text-sm sticky left-0 z-10 border border-gray-300">
                      Qualification
                    </td>
                    {primary.nominees.map((nominee) => (
                      <td key={nominee.id} className="p-3 text-center border border-gray-300 bg-white">
                        {nominee.qualified && (
                          <Badge className="bg-green-600 flex items-center gap-1 justify-center text-xs">
                            <TrendingUp className="w-3 h-3" />
                            Qualified
                          </Badge>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
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
