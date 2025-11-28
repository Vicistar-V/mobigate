import { useState } from "react";
import { FinancialSummaryTable } from "./FinancialSummaryTable";
import { OtherMembersFinancialSection } from "./OtherMembersFinancialSection";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { mockMemberFinancialRecord } from "@/data/financialData";
import { contentsAdSlots } from "@/data/profileAds";

export const FinancialSummaryTab = () => {
  const [sortFilter, setSortFilter] = useState("all");

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Financial Summary</h1>
      </div>

      {/* Financial Summary Table */}
      <FinancialSummaryTable 
        member={mockMemberFinancialRecord}
        sortFilter={sortFilter}
        onSortChange={setSortFilter}
      />

      {/* Other Members' Financial Summaries */}
      <OtherMembersFinancialSection />

      {/* Ads */}
      <PremiumAdRotation 
        slotId="finance-summary-ads"
        ads={contentsAdSlots[0]}
        context="profile"
      />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
