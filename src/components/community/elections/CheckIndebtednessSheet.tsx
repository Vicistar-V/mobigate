import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockIndebtednessItems } from "@/data/financialData";

interface CheckIndebtednessSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckIndebtednessSheet = ({ open, onOpenChange }: CheckIndebtednessSheetProps) => {
  const totalIndebtedness = mockIndebtednessItems.reduce((sum, item) => sum + item.amount, 0);
  const totalWithPenalty = mockIndebtednessItems.reduce((sum, item) => sum + item.totalWithPenalty, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Check Total Financial Indebtedness:</SheetTitle>
          <p className="text-sm text-muted-foreground">
            - - Penalty: +20% of Indebtedness.
          </p>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(85vh-120px)] mt-4">
          {/* Numbered list of indebtedness items */}
          <div className="space-y-3 py-4">
            {mockIndebtednessItems.map((item, index) => (
              <div key={item.id} className="flex justify-between items-start gap-4">
                <span className="text-sm flex-1">
                  {index + 1}. <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">{item.name}</span>
                </span>
                <span className="font-semibold text-sm whitespace-nowrap">
                  = ₦{item.amount.toLocaleString()}.{' '}
                  <span className="text-blue-600 cursor-pointer hover:text-blue-800">Details</span>
                </span>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg space-y-2">
            <div className="flex justify-between font-semibold">
              <span>Total Indebtedness:</span>
              <span>₦{totalIndebtedness.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-600 font-semibold">
              <span>Penalty (20%):</span>
              <span>₦{(totalWithPenalty - totalIndebtedness).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 border-black pt-2">
              <span>Total Amount Due:</span>
              <span>₦{totalWithPenalty.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Debts Clearance Now explanation */}
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-bold">'Debts Clearance Now'</h3>
            <p className="text-sm leading-relaxed">
              Clicking on this Button will do the following:
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-sm leading-relaxed">
              <li>
                Pull out funds from <strong>Members' User Wallet</strong> to pay off Member's any outstanding Debts to the Community.
              </li>
              <li>
                If the <strong>Wallet Balance</strong> is insufficient, it will still pull out whatever amount that's in it; and this will reduce the Member's total indebtedness by that amount so-pulled out from the <strong>Member's Wallet</strong>. Remaining <strong>Indebted Balance</strong> will automatically be calculated and noted.
              </li>
            </ol>
            <p className="text-sm mt-4 leading-relaxed">
              The <strong>System</strong> should send a <strong>Request</strong> to the <strong>Member</strong> to <strong>'Fund Wallet'</strong> adequately to proceed with the <strong>Account Clearance</strong> and <strong>Voter Accreditation Process</strong>.
            </p>
          </div>
          
          {/* Get Accreditation Now button */}
          <Button className="w-full bg-green-600 hover:bg-green-700 mt-8 text-lg font-bold py-6">
            'Get Accreditation Now!'
          </Button>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
