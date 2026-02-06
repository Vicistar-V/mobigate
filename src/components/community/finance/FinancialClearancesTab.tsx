import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { financialItems, mockMembersWithClearance } from "@/data/financialData";
import { contentsAdSlots } from "@/data/profileAds";
import { FinancialStatusDialog } from "./FinancialStatusDialog";
import { CheckIndebtednessSheet } from "../elections/CheckIndebtednessSheet";
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";
import { toast } from "sonner";

export const FinancialClearancesTab = () => {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showIndebtednessSheet, setShowIndebtednessSheet] = useState(false);
  const [showReceiptsSheet, setShowReceiptsSheet] = useState(false);
  const [debtsChecked, setDebtsChecked] = useState(false);
  const [receiptsChecked, setReceiptsChecked] = useState(false);

  const handleDebtsClearing = () => {
    if (debtsChecked) {
      setShowIndebtednessSheet(true);
    } else {
      toast.error("Please check the box to confirm debt clearance.");
    }
  };

  const handleDownloadReceipts = () => {
    if (receiptsChecked) {
      setShowReceiptsSheet(true);
    } else {
      toast.error("Please check the box to confirm receipt download.");
    }
  };

  const handleReceiptsFormatDownload = (selectedFormat: DownloadFormat) => {
    toast.success(`Receipts downloaded as ${selectedFormat.toUpperCase()}`);
    setShowReceiptsSheet(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Financial Clearances</h1>
      </div>

      {/* Clearance Status Table */}
      <Card className="p-4 overflow-x-auto">
        <div className="text-xs text-muted-foreground pb-2">
          Scroll for more →
        </div>
        <div className="min-w-[700px]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-pink-200 p-2 border border-gray-300 text-center text-xs font-bold w-10">S/N</th>
                <th className="bg-pink-200 p-2 border border-gray-300 text-left text-xs font-bold min-w-[140px]">
                  Member Name
                </th>
                {financialItems.map(item => (
                  <th key={item.id} className="p-2 border border-gray-300 text-center min-w-[80px]">
                    <div className="text-[10px] font-semibold mb-1 leading-tight">{item.name}</div>
                    <div className="flex gap-0.5 justify-center">
                      <div className="bg-green-100 border border-green-600 px-1.5 py-0.5 text-[9px] font-bold">
                        ✓
                      </div>
                      <div className="bg-red-100 border border-red-600 px-1.5 py-0.5 text-[9px] font-bold">
                        X
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockMembersWithClearance.map((member, index) => (
                <tr key={member.id}>
                  <td className="bg-pink-200 p-2 border border-gray-300 text-center font-bold text-xs">
                    {index + 1}
                  </td>
                  <td className="bg-pink-200 p-2 border border-gray-300 font-semibold text-xs">
                    <div>{member.name}</div>
                    <div className="text-[10px] text-gray-600">{member.registration}</div>
                  </td>
                  {member.clearances.map(clearance => (
                    <td key={clearance.itemId} className="p-1 border border-gray-300 text-center bg-white">
                      {clearance.hasClearance ? (
                        <div className="text-green-600 text-lg font-bold">✓</div>
                      ) : (
                        <div className="text-red-600 text-lg font-bold">X</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Green Info Text */}
      <div className="text-xs text-green-700 text-center p-3 bg-green-50 rounded border border-green-300">
        <p className="font-semibold">You can Clear up all your outstanding indebtedness now!</p>
        <p className="text-xs mt-1">You must fund your main Wallet adequately and sufficiently!</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5">
        <Button 
          className="bg-yellow-400 text-black hover:bg-yellow-500 w-full font-bold py-4 text-sm touch-manipulation active:scale-[0.97] transition-transform"
          onClick={() => setShowStatusDialog(true)}
        >
          Financial Status Report
        </Button>
        <Button 
          className="bg-red-600 hover:bg-red-700 w-full font-bold py-4 text-sm touch-manipulation active:scale-[0.97] transition-transform"
          onClick={() => setShowIndebtednessSheet(true)}
        >
          Check Total Indebtedness
        </Button>
        <div className="flex items-center gap-2.5">
          <Checkbox 
            id="debts-clearances"
            checked={debtsChecked}
            onCheckedChange={(checked) => setDebtsChecked(checked as boolean)}
            className="shrink-0"
          />
          <Button 
            className="bg-green-600 hover:bg-green-700 flex-1 font-bold py-4 text-sm min-w-0 touch-manipulation active:scale-[0.97] transition-transform"
            onClick={handleDebtsClearing}
          >
            Debts Clearance Now
          </Button>
        </div>
        <div className="flex items-center gap-2.5">
          <Checkbox 
            id="receipts-clearances"
            checked={receiptsChecked}
            onCheckedChange={(checked) => setReceiptsChecked(checked as boolean)}
            className="shrink-0"
          />
          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex-1 font-bold py-4 text-sm min-w-0 touch-manipulation active:scale-[0.97] transition-transform"
            onClick={handleDownloadReceipts}
          >
            <Download className="w-4 h-4 mr-1.5 shrink-0" />
            Download Receipts
          </Button>
        </div>
      </div>

      {/* Ads */}
      <PremiumAdRotation 
        slotId="finance-clearances-ads"
        ads={contentsAdSlots[0]}
        context="profile"
      />

      {/* People You May Know */}
      <PeopleYouMayKnow />

      {/* Financial Status Dialog */}
      <FinancialStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
      />

      {/* Check Indebtedness Sheet */}
      <CheckIndebtednessSheet
        open={showIndebtednessSheet}
        onOpenChange={setShowIndebtednessSheet}
      />

      {/* Download Receipts Format Sheet */}
      <DownloadFormatSheet
        open={showReceiptsSheet}
        onOpenChange={setShowReceiptsSheet}
        onDownload={handleReceiptsFormatDownload}
        title="Download Receipts"
        documentName="Financial Clearance Receipts"
        availableFormats={["pdf", "jpeg", "png", "txt"]}
      />
    </div>
  );
};
