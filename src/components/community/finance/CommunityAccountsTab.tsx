import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Download, Menu } from "lucide-react";
import { TransactionTable } from "./TransactionTable";
import { FinancialSummaryTable } from "./FinancialSummaryTable";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { CheckIndebtednessSheet } from "../elections/CheckIndebtednessSheet";
import { mockTransactions, mockAccountBalance, mockMemberFinancialRecord } from "@/data/financialData";
import { contentsAdSlots } from "@/data/profileAds";
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";
import { FinancialStatusDialog } from "./FinancialStatusDialog";
import { toast } from "sonner";

export const CommunityAccountsTab = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'credit' | 'debit' | 'balance'>('all');
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [sortBy, setSortBy] = useState('all');
  const [showIndebtednessSheet, setShowIndebtednessSheet] = useState(false);
  const [showReceiptsFormatSheet, setShowReceiptsFormatSheet] = useState(false);
  const [debtsChecked, setDebtsChecked] = useState(false);
  const [receiptsChecked, setReceiptsChecked] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (activeFilter === 'credit') return transaction.type === 'credit';
    if (activeFilter === 'debit') return transaction.type === 'debit';
    return true;
  });

  const handleDebtsClearing = () => {
    if (debtsChecked) {
      setShowIndebtednessSheet(true);
    } else {
      toast.error("Please check the box to confirm debt clearance.");
    }
  };

  const handleDownloadReceipts = () => {
    if (receiptsChecked) {
      setShowReceiptsFormatSheet(true);
    } else {
      toast.error("Please check the box to confirm receipt download.");
    }
  };

  const handleReceiptsFormatDownload = (selectedFormat: DownloadFormat) => {
    toast.success(`Receipts downloaded as ${selectedFormat.toUpperCase()}`);
    setShowReceiptsFormatSheet(false);
  };

  const getBalanceInfo = () => {
    if (activeFilter === 'balance') {
      return (
        <Card className="p-3 bg-green-50 border-green-300 overflow-hidden">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs font-semibold min-w-0">Total Credit (Income):</span>
              <span className="text-xs text-green-700 font-bold tabular-nums shrink-0">₦{mockAccountBalance.totalCredit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs font-semibold min-w-0">Total Debit (Withdrawals):</span>
              <span className="text-xs text-red-700 font-bold tabular-nums shrink-0">₦{mockAccountBalance.totalDebit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center gap-2 pt-1.5 border-t border-green-400">
              <span className="text-sm font-bold min-w-0">Available Balance:</span>
              <span className="text-sm text-green-800 font-bold tabular-nums shrink-0">₦{mockAccountBalance.availableBalance.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 pb-20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold leading-tight">
          Community<br/>Accounts
        </h1>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="grid grid-cols-3 gap-1.5 min-w-0 overflow-hidden">
        <Button 
          variant={activeFilter === 'credit' ? 'default' : 'outline'}
          className={`border h-auto py-2.5 px-1.5 min-w-0 overflow-hidden ${activeFilter === 'credit' ? 'bg-green-600 border-green-700' : 'border-green-600 text-green-700 bg-white'}`}
          onClick={() => setActiveFilter('credit')}
        >
          <div className="text-center space-y-0.5 min-w-0 overflow-hidden">
            <div className="font-bold text-xs leading-tight truncate">All Credit</div>
            <div className="text-xs opacity-80 leading-tight truncate">All Income</div>
          </div>
        </Button>
        <Button 
          variant={activeFilter === 'debit' ? 'default' : 'outline'}
          className={`border h-auto py-2.5 px-1.5 min-w-0 overflow-hidden ${activeFilter === 'debit' ? 'bg-red-600 border-red-700' : 'bg-red-50 border-red-600 text-red-700'}`}
          onClick={() => setActiveFilter('debit')}
        >
          <div className="text-center space-y-0.5 min-w-0 overflow-hidden">
            <div className="font-bold text-xs leading-tight truncate">All Debit</div>
            <div className="text-xs opacity-80 leading-tight truncate">Withdrawals</div>
          </div>
        </Button>
        <Button 
          variant={activeFilter === 'balance' ? 'default' : 'outline'}
          className={`border h-auto py-2.5 px-1.5 min-w-0 overflow-hidden ${activeFilter === 'balance' ? 'bg-green-600 border-green-700' : 'border-green-600 text-green-700 bg-white'}`}
          onClick={() => setActiveFilter('balance')}
        >
          <div className="text-center space-y-0.5 min-w-0 overflow-hidden">
            <div className="font-bold text-xs leading-tight truncate">Balance</div>
            <div className="text-xs opacity-80 leading-tight truncate">Avail. Balance</div>
          </div>
        </Button>
      </div>

      {/* Balance Info */}
      {getBalanceInfo()}

      {/* Small Ad Banner */}
      <Card 
        className="p-2.5 bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform touch-manipulation"
        onClick={() => window.open("https://example.com/architect-services", "_blank")}
        role="link"
      >
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="min-w-0 truncate">Need an <strong>Architect</strong> for your Dream-Project?</span>
          <span className="text-red-600 text-xs font-semibold shrink-0">Click Here!</span>
        </div>
      </Card>

      {/* SORT BY Dropdown */}
      <div className="flex justify-end">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-auto border font-bold text-xs px-3">
            <SelectValue placeholder="SORT BY" />
          </SelectTrigger>
          <SelectContent className="bg-card z-50">
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="amount">By Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction Table */}
      <Collapsible open={!isTableCollapsed} onOpenChange={setIsTableCollapsed}>
        <CollapsibleContent>
          <TransactionTable 
            transactions={mockTransactions}
            filter={activeFilter}
          />
        </CollapsibleContent>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full mt-2 text-lg font-bold">
            {isTableCollapsed ? 'V   V' : '^   ^'}
          </Button>
        </CollapsibleTrigger>
      </Collapsible>

      {/* Green Info Text */}
      <div className="text-xs text-green-700 text-center p-3 bg-green-50 rounded border border-green-300">
        <p className="font-semibold">You can Clear up all your outstanding indebtedness now!</p>
        <p className="text-xs mt-1">You must fund your main Wallet adequately and sufficiently!</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5">
        <Button 
          className="bg-yellow-400 text-black hover:bg-yellow-500 w-full font-bold py-4 text-sm"
          onClick={() => setShowStatusDialog(true)}
        >
          Financial Status Report
        </Button>
        <Button 
          className="bg-red-600 hover:bg-red-700 w-full font-bold py-4 text-sm"
          onClick={() => setShowIndebtednessSheet(true)}
        >
          Check Total Indebtedness
        </Button>
        <div className="flex items-center gap-2.5">
          <Checkbox 
            id="debts-accounts"
            checked={debtsChecked}
            onCheckedChange={(checked) => setDebtsChecked(checked as boolean)}
            className="shrink-0"
          />
          <Button 
            className="bg-green-600 hover:bg-green-700 flex-1 font-bold py-4 text-sm min-w-0"
            onClick={handleDebtsClearing}
          >
            Debts Clearance Now
          </Button>
        </div>
        <div className="flex items-center gap-2.5">
          <Checkbox 
            id="receipts-accounts"
            checked={receiptsChecked}
            onCheckedChange={(checked) => setReceiptsChecked(checked as boolean)}
            className="shrink-0"
          />
          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex-1 font-bold py-4 text-sm min-w-0"
            onClick={handleDownloadReceipts}
          >
            <Download className="w-4 h-4 mr-1.5 shrink-0" />
            Download Receipts
          </Button>
        </div>
      </div>

      {/* Advert Section */}
      <PremiumAdRotation 
        slotId="community-accounts-ads"
        ads={contentsAdSlots[0]}
        context="profile"
      />

      {/* Financial Summary Section */}
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-3">Financial Summary</h2>
        <FinancialSummaryTable 
          member={mockMemberFinancialRecord}
          sortFilter="all"
          onSortChange={() => {}}
        />
      </div>

      {/* People You May Know */}
      <PeopleYouMayKnow />

      {/* Check Indebtedness Sheet */}
      <CheckIndebtednessSheet 
        open={showIndebtednessSheet} 
        onOpenChange={setShowIndebtednessSheet} 
      />
      
      {/* Download Format Sheet */}
      <DownloadFormatSheet
        open={showReceiptsFormatSheet}
        onOpenChange={setShowReceiptsFormatSheet}
        onDownload={handleReceiptsFormatDownload}
        title="Download Receipts"
        documentName="Financial Receipts"
        availableFormats={["pdf", "jpeg", "png", "txt"]}
      />

      {/* Financial Status Dialog */}
      <FinancialStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
      />
    </div>
  );
};
