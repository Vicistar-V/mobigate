import { useState } from "react";
import { FinancialSummaryTable } from "./FinancialSummaryTable";
import { OtherMembersFinancialSection } from "./OtherMembersFinancialSection";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { mockMemberFinancialRecord } from "@/data/financialData";
import { contentsAdSlots } from "@/data/profileAds";
import { DownloadFormatSheet, type DownloadFormat } from "@/components/common/DownloadFormatSheet";
import { useToast } from "@/hooks/use-toast";

interface FinancialSummaryTabProps {
  onClose?: () => void;
}

export const FinancialSummaryTab = ({ onClose }: FinancialSummaryTabProps) => {
  const { toast } = useToast();
  const [sortFilter, setSortFilter] = useState("all");
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (format: DownloadFormat) => {
    setIsDownloading(true);
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDownloading(false);
    setShowDownloadSheet(false);
    toast({
      title: "Download Complete",
      description: `Financial Summary downloaded as ${format.toUpperCase()}`,
    });
  };

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
        onDownload={() => setShowDownloadSheet(true)}
        onClose={onClose}
      />

      {/* Download Format Sheet */}
      <DownloadFormatSheet
        open={showDownloadSheet}
        onOpenChange={setShowDownloadSheet}
        onDownload={handleDownload}
        documentName="Financial Summary"
        isDownloading={isDownloading}
        availableFormats={["pdf", "docx", "csv"]}
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
