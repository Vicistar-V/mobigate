import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Search, CheckCircle, XCircle } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";

interface AccreditedVoter {
  id: string;
  name: string;
  registration: string;
  avatar: string;
  status: "verified" | "pending" | "rejected";
  verifiedAt?: Date;
}

const mockAccreditedVoters: AccreditedVoter[] = [
  {
    id: "av-1",
    name: "Mark Anthony Orji",
    registration: "VR-2025/2865219",
    avatar: "/src/assets/profile-photo.jpg",
    status: "verified",
    verifiedAt: new Date("2025-02-15"),
  },
  {
    id: "av-2",
    name: "Theodore Ike Nwannunu",
    registration: "VR-2025/2865220",
    avatar: "/src/assets/profile-james-wilson.jpg",
    status: "verified",
    verifiedAt: new Date("2025-02-16"),
  },
  {
    id: "av-3",
    name: "Sarah Johnson",
    registration: "VR-2025/2865221",
    avatar: "/src/assets/profile-sarah-johnson.jpg",
    status: "pending",
  },
  {
    id: "av-4",
    name: "Michael Chen",
    registration: "VR-2025/2865222",
    avatar: "/src/assets/profile-michael-chen.jpg",
    status: "verified",
    verifiedAt: new Date("2025-02-17"),
  },
];

export const ElectionAccreditationTab = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVoters = mockAccreditedVoters.filter(
    (voter) =>
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.registration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Voter Accreditation</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">1,156</div>
          <div className="text-xs text-muted-foreground">Verified</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">44</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">12</div>
          <div className="text-xs text-muted-foreground">Rejected</div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or registration number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Voters List */}
      <div className="space-y-3">
        {filteredVoters.map((voter) => (
          <Card key={voter.id} className="p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={voter.avatar} alt={voter.name} />
                <AvatarFallback>{voter.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold">{voter.name}</h4>
                <p className="text-xs text-muted-foreground">{voter.registration}</p>
                {voter.verifiedAt && (
                  <p className="text-xs text-muted-foreground">
                    Verified: {voter.verifiedAt.toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge
                variant={
                  voter.status === "verified"
                    ? "default"
                    : voter.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
                className="flex items-center gap-1"
              >
                {voter.status === "verified" ? (
                  <CheckCircle className="w-3 h-3" />
                ) : voter.status === "rejected" ? (
                  <XCircle className="w-3 h-3" />
                ) : null}
                {voter.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-accreditation" />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
