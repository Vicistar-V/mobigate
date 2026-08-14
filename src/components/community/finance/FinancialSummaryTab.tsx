import { useState, useEffect } from "react";
import { FinancialSummaryTable } from "./FinancialSummaryTable";
import { OtherMembersFinancialSection } from "./OtherMembersFinancialSection";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { contentsAdSlots } from "@/data/profileAds";
import { DownloadFormatSheet, type DownloadFormat } from "@/components/common/DownloadFormatSheet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface FinancialSummaryTabProps {
  onClose?: () => void;
  communityId?: string;
}

export const FinancialSummaryTab = ({ onClose, communityId }: FinancialSummaryTabProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [sortFilter, setSortFilter] = useState("all");
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [memberRecord, setMemberRecord] = useState({
    memberId: user?.id || "", memberName: user?.name || "Member", memberRegistration: (user?.id || "").slice(0, 8).toUpperCase(),
    avatar: user?.avatar, items: [] as any[],
  });

  useEffect(() => {
    if (!communityId) return;
    fetch(`/api/community/finance.php?action=my_obligations&community_id=${communityId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const items = (d.obligations ?? []).map((o: any) => ({
          itemId: o.id,
          periods: [{
            year: new Date().getFullYear(), amount: o.amount,
            date: o.status === "paid" ? o.dueDate : null, status: o.status,
          }],
        }));
        setMemberRecord((prev) => ({ ...prev, items }));
      })
      .catch(() => {});
  }, [communityId]);

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
        member={memberRecord}
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
