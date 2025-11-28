import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { mockMembersWithClearance } from "@/data/financialData";
import { contentsAdSlots } from "@/data/profileAds";

export const FinancialAccreditationTab = () => {
  // Calculate accreditation status based on clearances
  const membersWithAccreditation = mockMembersWithClearance.map(member => {
    const clearedCount = member.clearances.filter(c => c.hasClearance).length;
    const totalCount = member.clearances.length;
    const isAccredited = clearedCount === totalCount;
    
    return {
      ...member,
      isAccredited,
      clearedCount,
      totalCount,
      accreditationDate: isAccredited ? 'Jan; 15, 2025' : null
    };
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Financial Accreditation</h1>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-green-50 border-green-300">
          <div className="text-2xl font-bold text-green-700">
            {membersWithAccreditation.filter(m => m.isAccredited).length}
          </div>
          <div className="text-sm text-green-600">Accredited Members</div>
        </Card>
        <Card className="p-4 bg-yellow-50 border-yellow-300">
          <div className="text-2xl font-bold text-yellow-700">
            {membersWithAccreditation.filter(m => !m.isAccredited).length}
          </div>
          <div className="text-sm text-yellow-600">Pending Accreditation</div>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-300">
          <div className="text-2xl font-bold text-blue-700">
            {membersWithAccreditation.length}
          </div>
          <div className="text-sm text-blue-600">Total Members</div>
        </Card>
      </div>

      {/* Accreditation List */}
      <Card className="p-4">
        <h3 className="font-bold text-lg mb-4">Member Accreditation Status</h3>
        <div className="space-y-3">
          {membersWithAccreditation.map(member => (
            <div 
              key={member.id} 
              className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                member.isAccredited 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-yellow-50 border-yellow-300'
              }`}
            >
              <Avatar className="h-14 w-14">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="font-semibold text-base">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.registration}</div>
                <div className="flex items-center gap-2 mt-1">
                  {member.isAccredited ? (
                    <>
                      <Badge className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Accredited
                      </Badge>
                      <span className="text-xs text-green-700">
                        Verified: {member.accreditationDate}
                      </span>
                    </>
                  ) : (
                    <>
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        <XCircle className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                      <span className="text-xs text-yellow-700">
                        {member.clearedCount}/{member.totalCount} items cleared
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Button 
                size="sm" 
                variant={member.isAccredited ? "outline" : "default"}
                className={member.isAccredited ? "" : "bg-yellow-500 hover:bg-yellow-600"}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Information Card */}
      <Card className="p-4 bg-blue-50 border-blue-300">
        <h3 className="font-bold text-blue-900 mb-2">About Financial Accreditation</h3>
        <p className="text-sm text-blue-800">
          Financial accreditation confirms that a member has fulfilled all financial obligations 
          and is in good standing with the community. Members with full accreditation have cleared 
          all outstanding dues, levies, and fees.
        </p>
      </Card>

      {/* Ads */}
      <PremiumAdRotation 
        slotId="finance-accreditation-ads"
        ads={contentsAdSlots[0]}
        context="profile"
      />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
