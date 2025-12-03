import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberFinancialRecord, financialItems } from "@/data/financialData";

interface FinancialSummaryTableProps {
  member: MemberFinancialRecord;
  sortFilter: string;
  onSortChange: (value: string) => void;
}

export const FinancialSummaryTable = ({ member, sortFilter, onSortChange }: FinancialSummaryTableProps) => {
  const years = [2025, 2024, 2023, 2022];
  
  const filteredItems = financialItems.filter(item => {
    if (sortFilter === 'all') return true;
    if (sortFilter === 'fees') return item.category === 'fees';
    if (sortFilter === 'donations') return item.category === 'donations';
    if (sortFilter === 'supports') return item.category === 'supports';
    if (sortFilter === 'fines') return item.category === 'fines';
    return true;
  });

  return (
    <Card className="p-4 mb-4">
      {/* Header with Sort */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="bg-gray-200 px-3 py-1.5 font-bold text-sm border border-gray-400">
          Financial Summary
        </div>
        <Select value={sortFilter} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] border-2 border-black font-bold">
            <SelectValue placeholder="SORT BY" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dues & Levies</SelectItem>
            <SelectItem value="fees">Classified Fees</SelectItem>
            <SelectItem value="donations">Donations</SelectItem>
            <SelectItem value="supports">Supports Received</SelectItem>
            <SelectItem value="fines">Fines Imposed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Horizontally Scrollable Table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="text-xs text-muted-foreground px-3 pb-2">
          Scroll for more →
        </div>
        <table className="min-w-[900px] border-collapse">
          <thead>
            <tr>
              <th className="bg-pink-200 p-3 text-left min-w-[180px] sticky left-0 z-20 border border-gray-300">
                <div className="text-sm font-bold">
                  {member.memberName}<br/>
                  <span className="text-xs text-gray-600">{member.memberRegistration}</span>
                </div>
              </th>
              {years.map(year => (
                <>
                  <th key={`year-${year}`} className="bg-green-600 text-white p-2 text-center min-w-[110px] border border-gray-300">
                    <div className="text-xs font-bold">{year}</div>
                  </th>
                  <th key={`date-${year}`} className="bg-green-600 text-white p-2 text-center min-w-[90px] border border-gray-300">
                    <div className="text-xs font-bold">Date</div>
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => {
              const itemData = member.items.find(i => i.itemId === item.id);
              return (
                <tr key={item.id}>
                  <td className="bg-pink-200 p-2 font-semibold sticky left-0 z-20 border border-gray-300">
                    <div className="flex items-start gap-1">
                      <span className="text-xs">{index + 1}.</span>
                      <span className="text-xs">{item.name}</span>
                    </div>
                  </td>
                  {years.map(year => {
                    const period = itemData?.periods.find(p => p.year === year);
                    return (
                      <>
                        <td key={`amount-${year}`} className="p-1 border border-gray-300 bg-white">
                          <div className="flex justify-center">
                            <div className="border-2 border-green-600 bg-green-50 px-2 py-1 text-center min-w-[90px]">
                              <div className="text-sm font-bold">
                                {period?.amount ? period.amount.toLocaleString() : '---'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td key={`date-${year}`} className="p-1 border border-gray-300 bg-white">
                          <div className="flex justify-center">
                            <div className="border-2 border-gray-400 bg-gray-50 px-2 py-1 text-center min-w-[70px]">
                              <div className="text-xs font-semibold">
                                {period?.date || '---'}
                              </div>
                            </div>
                          </div>
                        </td>
                      </>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Scrolling Indicator */}
        <div className="text-xs text-gray-500 text-right mt-2 mr-2">
          More scrolling out →
        </div>
        
        {/* Side note */}
        <div className="text-xs text-red-600 text-right mt-2 mr-2">
          All other Previous Years Summaries following here!
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end pt-4 border-t mt-4 flex-wrap">
        <Button variant="outline" size="sm">
          DOWNLOAD SUMMARIES
        </Button>
        <Button variant="outline" size="sm">
          Close
        </Button>
      </div>
    </Card>
  );
};
