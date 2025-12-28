import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { penaltyTiers, mockIndebtednessItems } from "@/data/financialData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface CheckActivitiesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActivitiesContent = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <h2 className="text-xl font-bold">Check All Activities Index [=&gt; 60%]:</h2>
      </div>
      
      <ScrollArea className="flex-1 px-4 min-h-0 touch-auto">
        <div className="pb-6">
          {/* Meetings Attendance Section */}
          <div className="py-4 border-b">
            <h3 className="font-bold text-lg mb-2">
              - All Meetings Attendance for<br/>a 36-Month Period to Date.
            </h3>
            <p className="text-sm font-semibold mt-3 mb-2">- - Penalty:</p>
            <div className="space-y-1 pl-6">
              {penaltyTiers.map((tier) => (
                <div key={tier.threshold} className="flex gap-3 text-sm items-center">
                  <span className="font-semibold w-16">{tier.threshold}</span>
                  <span>=</span>
                  <span className="font-semibold">₦{tier.amount.toLocaleString()}.</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Events & Public Functions Section */}
          <div className="py-4 border-b">
            <h3 className="font-bold text-lg mb-2">
              - All Events & Public Functions<br/>Attendance for a 36-Month Period.
            </h3>
            <p className="text-sm font-semibold mt-3 mb-2">- - Penalty:</p>
            <div className="space-y-1 pl-6">
              {penaltyTiers.map((tier) => (
                <div key={tier.threshold} className="flex gap-3 text-sm items-center">
                  <span className="font-semibold w-16">{tier.threshold}</span>
                  <span>=</span>
                  <span className="font-semibold">₦{tier.amount.toLocaleString()}.</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Invitations Honoured Section */}
          <div className="py-4 border-b">
            <h3 className="font-bold text-lg mb-2">
              - All Invitations Honoured for a<br/>36-Month Period.
            </h3>
            <p className="text-sm font-semibold mt-3 mb-2">- - Penalty:</p>
            <div className="space-y-1 pl-6">
              {penaltyTiers.map((tier) => (
                <div key={tier.threshold} className="flex gap-3 text-sm items-center">
                  <span className="font-semibold w-16">{tier.threshold}</span>
                  <span>=</span>
                  <span className="font-semibold">₦{tier.amount.toLocaleString()}.</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Financial Indebtedness Section */}
          <div className="py-4 border-b">
            <h3 className="font-bold text-lg mb-3">Check Total Financial Indebtedness:</h3>
            <p className="text-sm text-muted-foreground mb-3">- - Penalty: +20% of Indebtedness.</p>
            <div className="space-y-3">
              {mockIndebtednessItems.map((item, index) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <span className="text-sm flex-1">
                    {index + 1}. <span className="text-blue-600 underline cursor-pointer">{item.name}</span>
                  </span>
                  <span className="font-semibold text-sm whitespace-nowrap">
                    = ₦{item.amount.toLocaleString()}.{' '}
                    <span className="text-blue-600 cursor-pointer">Details</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Debts Clearance Now explanation */}
          <div className="mt-6 space-y-4">
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
        </div>
      </ScrollArea>
    </div>
  );
};

export const CheckActivitiesSheet = ({ open, onOpenChange }: CheckActivitiesSheetProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh] overflow-hidden touch-auto">
          <ActivitiesContent />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden p-0">
        <ActivitiesContent />
      </DialogContent>
    </Dialog>
  );
};
