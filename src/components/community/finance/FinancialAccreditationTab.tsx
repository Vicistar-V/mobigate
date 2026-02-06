import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { mockMembersWithClearance } from "@/data/financialData";
import { contentsAdSlots } from "@/data/profileAds";
import { FinancialStatusDialog } from "./FinancialStatusDialog";
import { CheckIndebtednessSheet } from "../elections/CheckIndebtednessSheet";

export const FinancialAccreditationTab = () => {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showIndebtednessSheet, setShowIndebtednessSheet] = useState(false);

  const membersWithAccreditation = mockMembersWithClearance.map(member => {
    const clearedCount = member.clearances.filter(c => c.hasClearance).length;
    const totalCount = member.clearances.length;
    const isAccredited = clearedCount === totalCount;
    
    return {
      ...member,
      isAccredited,
      clearedCount,
      totalCount,
      accreditationDate: isAccredited ? 'Jan 15, 2025' : null
    };
  });

  const handleViewDetails = (isAccredited: boolean) => {
    if (isAccredited) {
      setShowStatusDialog(true);
    } else {
      setShowIndebtednessSheet(true);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <h1 className="text-lg font-bold px-1">Financial Accreditation</h1>

      {/* Stats Summary - Always 3 cols */}
      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="py-2.5 px-2 text-center">
            <div className="text-2xl font-bold text-green-600 leading-none">
              {membersWithAccreditation.filter(m => m.isAccredited).length}
            </div>
            <div className="text-xs text-green-600 mt-1">Accredited</div>
          </div>
          <div className="py-2.5 px-2 text-center">
            <div className="text-2xl font-bold text-amber-600 leading-none">
              {membersWithAccreditation.filter(m => !m.isAccredited).length}
            </div>
            <div className="text-xs text-amber-600 mt-1">Pending</div>
          </div>
          <div className="py-2.5 px-2 text-center">
            <div className="text-2xl font-bold text-blue-600 leading-none">
              {membersWithAccreditation.length}
            </div>
            <div className="text-xs text-blue-600 mt-1">Total</div>
          </div>
        </div>
      </Card>

      {/* Accreditation List */}
      <Card className="p-2">
        <h3 className="font-bold text-base mb-2 px-0.5">Member Accreditation Status</h3>
        <div className="space-y-2">
          {membersWithAccreditation.map(member => (
            <div 
              key={member.id} 
              className={`space-y-2 p-2.5 rounded-lg border-2 ${
                member.isAccredited 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-yellow-50 border-yellow-300'
              }`}
            >
              {/* Row 1: Avatar + Identity */}
              <div className="flex items-center gap-2.5">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm leading-tight">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.registration}</div>
                </div>
              </div>

              {/* Row 2: Status info only */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {member.isAccredited ? (
                  <>
                    <Badge className="bg-green-600 hover:bg-green-700 text-xs px-1.5 py-0.5 shrink-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Accredited
                    </Badge>
                    <span className="text-xs text-green-700">
                      {member.accreditationDate}
                    </span>
                  </>
                ) : (
                  <>
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-xs px-1.5 py-0.5 shrink-0">
                      <XCircle className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                    <span className="text-xs text-amber-700 font-medium">
                      {member.clearedCount}/{member.totalCount} items cleared
                    </span>
                  </>
                )}
              </div>

              {/* Row 3: Full-width action button */}
              <Button 
                size="sm" 
                variant={member.isAccredited ? "outline" : "default"}
                className={`w-full touch-manipulation active:scale-[0.97] text-xs h-9 ${
                  member.isAccredited 
                    ? "border-green-600 text-green-700 hover:bg-green-100" 
                    : "bg-amber-700 hover:bg-amber-800 text-white"
                }`}
                onClick={() => handleViewDetails(member.isAccredited)}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Information Card */}
      <Card className="p-3 bg-blue-50 border-blue-300">
        <h3 className="font-bold text-blue-900 text-sm mb-1.5">About Financial Accreditation</h3>
        <p className="text-xs text-blue-800 leading-relaxed">
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

      {/* Dialogs */}
      <FinancialStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
      />

      <CheckIndebtednessSheet
        open={showIndebtednessSheet}
        onOpenChange={setShowIndebtednessSheet}
      />
    </div>
  );
};
