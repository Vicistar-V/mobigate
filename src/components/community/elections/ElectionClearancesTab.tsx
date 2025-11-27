import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";

interface CandidateClearance {
  id: string;
  candidateName: string;
  office: string;
  avatar: string;
  status: "approved" | "pending" | "rejected";
  documentsSubmitted: string[];
  submittedAt: Date;
  reviewedAt?: Date;
}

const mockClearances: CandidateClearance[] = [
  {
    id: "cl-1",
    candidateName: "Paulson",
    office: "President General",
    avatar: "/src/assets/profile-james-wilson.jpg",
    status: "approved",
    documentsSubmitted: [
      "Application Form",
      "ID Verification",
      "Financial Clearance",
      "Conduct Certificate",
    ],
    submittedAt: new Date("2025-02-01"),
    reviewedAt: new Date("2025-02-05"),
  },
  {
    id: "cl-2",
    candidateName: "Jerome",
    office: "President General",
    avatar: "/src/assets/profile-michael-chen.jpg",
    status: "approved",
    documentsSubmitted: [
      "Application Form",
      "ID Verification",
      "Financial Clearance",
      "Conduct Certificate",
    ],
    submittedAt: new Date("2025-02-02"),
    reviewedAt: new Date("2025-02-06"),
  },
  {
    id: "cl-3",
    candidateName: "Jude",
    office: "President General",
    avatar: "/src/assets/profile-robert-brown.jpg",
    status: "pending",
    documentsSubmitted: [
      "Application Form",
      "ID Verification",
      "Financial Clearance",
    ],
    submittedAt: new Date("2025-02-10"),
  },
];

export const ElectionClearancesTab = () => {
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Candidate Clearances</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">8</div>
          <div className="text-xs text-muted-foreground">Approved</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">3</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">1</div>
          <div className="text-xs text-muted-foreground">Rejected</div>
        </Card>
      </div>

      {/* Clearances List */}
      <div className="space-y-4">
        {mockClearances.map((clearance) => (
          <Card key={clearance.id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="mt-1">
                <AvatarImage src={clearance.avatar} alt={clearance.candidateName} />
                <AvatarFallback>{clearance.candidateName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{clearance.candidateName}</h4>
                    <p className="text-sm text-muted-foreground">{clearance.office}</p>
                  </div>
                  <Badge
                    variant={
                      clearance.status === "approved"
                        ? "default"
                        : clearance.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="flex items-center gap-1"
                  >
                    {clearance.status === "approved" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : clearance.status === "pending" ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {clearance.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Documents Submitted:</span>
                    <ul className="mt-1 space-y-1">
                      {clearance.documentsSubmitted.map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="w-3 h-3" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>Submitted: {clearance.submittedAt.toLocaleDateString()}</p>
                    {clearance.reviewedAt && (
                      <p>Reviewed: {clearance.reviewedAt.toLocaleDateString()}</p>
                    )}
                  </div>

                  <Button size="sm" variant="outline" className="mt-2">
                    View Documents
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-clearances" />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
