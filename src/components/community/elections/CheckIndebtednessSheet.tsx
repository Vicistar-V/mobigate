import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockIndebtednessItems } from "@/data/financialData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

interface CheckIndebtednessSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IndebtednessContent = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [isAccrediting, setIsAccrediting] = useState(false);
  const [isAccredited, setIsAccredited] = useState(false);
  
  const totalIndebtedness = mockIndebtednessItems.reduce((sum, item) => sum + item.amount, 0);
  const totalWithPenalty = mockIndebtednessItems.reduce((sum, item) => sum + item.totalWithPenalty, 0);

  const handleClearDebt = () => {
    setIsClearing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsClearing(false);
      setIsCleared(true);
      toast.success(
        `Debt Cleared! M${totalWithPenalty.toLocaleString()} (₦${totalWithPenalty.toLocaleString()}) has been debited from your Mobi Wallet.`,
        { duration: 5000 }
      );
    }, 2000);
  };

  const handleGetAccreditation = () => {
    setIsAccrediting(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsAccrediting(false);
      setIsAccredited(true);
      toast.success(
        "Accreditation Successful! Your accreditation number has been sent to your registered email address.",
        { duration: 5000 }
      );
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <h2 className="text-xl font-bold">Check Total Financial Indebtedness:</h2>
        <p className="text-sm text-muted-foreground">
          - - Penalty: +20% of Indebtedness.
        </p>
      </div>
      
      <ScrollArea className="flex-1 px-4 min-h-0 touch-auto">
        <div className="pb-6">
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
          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between font-semibold">
              <span>Total Indebtedness:</span>
              <span>₦{totalIndebtedness.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-destructive font-semibold">
              <span>Penalty (20%):</span>
              <span>₦{(totalWithPenalty - totalIndebtedness).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 border-foreground pt-2">
              <span>Total Amount Due:</span>
              <span>₦{totalWithPenalty.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Clear Debt Now Button */}
          <div className="mt-8">
            {!isCleared ? (
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-lg font-bold py-6"
                onClick={handleClearDebt}
                disabled={isClearing}
              >
                {isClearing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing Debit...
                  </>
                ) : (
                  "Clear Debt Now"
                )}
              </Button>
            ) : (
              <Button 
                className="w-full bg-green-600 hover:bg-green-600 text-lg font-bold py-6"
                disabled
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Debt Cleared Successfully
              </Button>
            )}
            
            {!isCleared && (
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                This will debit <strong>M{totalWithPenalty.toLocaleString()}</strong> from your Mobi Wallet to clear all outstanding debts.
              </p>
            )}
          </div>
          
          {/* Get Accreditation Now button */}
          <div className="mt-6">
            {!isAccredited ? (
              <Button 
                className={`w-full text-lg font-bold py-6 ${isCleared ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`}
                disabled={!isCleared || isAccrediting}
                onClick={handleGetAccreditation}
              >
                {isAccrediting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing Accreditation...
                  </>
                ) : (
                  "Get Accreditation Now!"
                )}
              </Button>
            ) : (
              <Button 
                className="w-full bg-primary hover:bg-primary text-lg font-bold py-6"
                disabled
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Accredited Successfully!
              </Button>
            )}
            
            {!isCleared && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Clear your debt first to proceed with accreditation
              </p>
            )}
            
            {isAccredited && (
              <p className="text-xs text-center text-green-600 mt-2">
                Your accreditation number has been sent to your registered email address.
              </p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export const CheckIndebtednessSheet = ({ open, onOpenChange }: CheckIndebtednessSheetProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh] overflow-hidden touch-auto">
          <IndebtednessContent />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden p-0">
        <IndebtednessContent />
      </DialogContent>
    </Dialog>
  );
};
