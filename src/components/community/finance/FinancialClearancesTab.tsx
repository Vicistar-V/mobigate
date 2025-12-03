import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { financialItems, mockMembersWithClearance } from "@/data/financialData";
import { contentsAdSlots } from "@/data/profileAds";

export const FinancialClearancesTab = () => {
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

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button className="bg-yellow-400 text-black hover:bg-yellow-500 w-full font-bold">
          Financial Status Report
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 w-full font-bold">
          Check Total Indebtedness
        </Button>
        <div className="text-sm text-green-700 text-center p-4 bg-green-50 rounded border border-green-300">
          <p className="font-semibold">You can Clear up all your outstanding indebtedness now!</p>
          <p className="text-xs mt-1">You must fund your main Wallet adequately and sufficiently!</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 w-full font-bold">
          Debts Clearance Now
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full font-bold">
          <Download className="w-4 h-4 mr-2" />
          Download Receipts
        </Button>
      </div>

      {/* Ads */}
      <PremiumAdRotation 
        slotId="finance-clearances-ads"
        ads={contentsAdSlots[0]}
        context="profile"
      />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
