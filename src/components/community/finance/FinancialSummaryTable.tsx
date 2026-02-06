import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberFinancialRecord, financialItems } from "@/data/financialData";

interface FinancialSummaryTableProps {
  member: MemberFinancialRecord;
  sortFilter: string;
  onSortChange: (value: string) => void;
  onDownload?: () => void;
  onClose?: () => void;
}

export const FinancialSummaryTable = ({ member, sortFilter, onSortChange, onDownload, onClose }: FinancialSummaryTableProps) => {
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
    <Card className="p-3 mb-4 overflow-hidden">
      {/* Header with Sort - Vertical stack on mobile */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="bg-gray-200 px-3 py-1.5 font-bold text-xs border border-gray-400 text-center">
          Financial Summary
        </div>
        <Select value={sortFilter} onValueChange={onSortChange}>
          <SelectTrigger className="w-full border font-bold text-xs touch-manipulation">
            <SelectValue placeholder="SORT BY" />
          </SelectTrigger>
          <SelectContent className="bg-card z-50">
            <SelectItem value="all">All Dues & Levies</SelectItem>
            <SelectItem value="fees">Classified Fees</SelectItem>
            <SelectItem value="donations">Donations</SelectItem>
            <SelectItem value="supports">Supports Received</SelectItem>
            <SelectItem value="fines">Fines Imposed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Horizontally Scrollable Table */}
      <div className="overflow-x-auto -mx-3 px-3">
        <div className="text-xs text-muted-foreground px-1 pb-1.5">
          Scroll for more →
        </div>
        <table className="min-w-[1000px] border-collapse">
          <thead>
            <tr>
              <th className="bg-pink-200 p-2 text-left min-w-[180px] sticky left-0 z-20 border border-gray-300">
                <div className="text-sm font-bold">
                  {member.memberName}<br/>
                  <span className="text-xs text-gray-600">{member.memberRegistration}</span>
                </div>
              </th>
              {years.map(year => (
                <>
                  <th key={`year-${year}`} className="bg-green-600 text-white p-2 text-center min-w-[100px] border border-gray-300">
                    <div className="text-sm font-bold">{year}</div>
                  </th>
                  <th key={`date-${year}`} className="bg-green-600 text-white p-2 text-center min-w-[80px] border border-gray-300">
                    <div className="text-sm font-bold">Date</div>
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
                      <span className="text-sm">{index + 1}.</span>
                      <span className="text-sm">{item.name}</span>
                    </div>
                  </td>
                  {years.map(year => {
                    const period = itemData?.periods.find(p => p.year === year);
                    return (
                      <>
                        <td key={`amount-${year}`} className="p-1 border border-gray-300 bg-white">
                          <div className="flex justify-center">
                            <div className="border border-green-600 bg-green-50 px-2 py-1 text-center min-w-[90px]">
                              <div className="text-sm font-bold tabular-nums">
                                {period?.amount ? period.amount.toLocaleString() : '---'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td key={`date-${year}`} className="p-1 border border-gray-300 bg-white">
                          <div className="flex justify-center">
                            <div className="border border-gray-400 bg-gray-50 px-2 py-1 text-center min-w-[75px]">
                              <div className="text-sm font-semibold">
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
        <div className="text-xs text-gray-500 text-right mt-1.5 mr-1">
          More scrolling out →
        </div>
      </div>

      {/* Side note - Outside scrollable area */}
      <div className="text-xs text-red-600 text-center mt-2 px-2">
        All other Previous Years Summaries following here!
      </div>

      {/* Action Buttons - Outside scrollable area, full width */}
      <div className="flex gap-2 w-full pt-3 border-t mt-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs touch-manipulation active:scale-[0.97] transition-transform"
          onClick={() => onDownload?.()}
        >
          DOWNLOAD SUMMARIES
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs touch-manipulation active:scale-[0.97] transition-transform"
          onClick={() => onClose?.()}
        >
          Close
        </Button>
      </div>
    </Card>
  );
};