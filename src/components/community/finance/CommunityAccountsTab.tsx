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
import { mockTransactions, mockAccountBalance, mockMemberFinancialRecord } from "@/data/financialData";
import { contentsAdSlots } from "@/data/profileAds";

export const CommunityAccountsTab = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'credit' | 'debit' | 'balance'>('all');
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [sortBy, setSortBy] = useState('all');

  const getBalanceInfo = () => {
    if (activeFilter === 'balance') {
      return (
        <Card className="p-4 bg-green-50 border-green-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Credit (Income):</span>
              <span className="text-green-700 font-bold">₦{mockAccountBalance.totalCredit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Debit (Withdrawals):</span>
              <span className="text-red-700 font-bold">₦{mockAccountBalance.totalDebit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-green-400">
              <span className="font-bold text-lg">Available Balance:</span>
              <span className="text-green-800 font-bold text-lg">₦{mockAccountBalance.availableBalance.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold leading-tight">
          Community<br/>Accounts
        </h1>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant={activeFilter === 'credit' ? 'default' : 'outline'}
          className={`border-2 ${activeFilter === 'credit' ? 'bg-green-600 border-green-700' : 'border-green-600 text-green-700 bg-white'}`}
          onClick={() => setActiveFilter('credit')}
        >
          <div className="text-center">
            <div className="font-bold text-xs sm:text-sm">All Credit</div>
            <div className="text-[10px] sm:text-xs">All Income</div>
          </div>
        </Button>
        <Button 
          variant={activeFilter === 'debit' ? 'default' : 'outline'}
          className={`border-2 ${activeFilter === 'debit' ? 'bg-red-600 border-red-700' : 'bg-red-50 border-red-600 text-red-700'}`}
          onClick={() => setActiveFilter('debit')}
        >
          <div className="text-center">
            <div className="font-bold text-xs sm:text-sm">All Debit</div>
            <div className="text-[10px] sm:text-xs">All Withdrawals</div>
          </div>
        </Button>
        <Button 
          variant={activeFilter === 'balance' ? 'default' : 'outline'}
          className={`border-2 ${activeFilter === 'balance' ? 'bg-green-600 border-green-700' : 'border-green-600 text-green-700 bg-white'}`}
          onClick={() => setActiveFilter('balance')}
        >
          <div className="text-center">
            <div className="font-bold text-xs sm:text-sm">Balance</div>
            <div className="text-[10px] sm:text-xs">Available Balance</div>
          </div>
        </Button>
      </div>

      {/* Balance Info */}
      {getBalanceInfo()}

      {/* Small Ad Banner */}
      <Card className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span>Need an <strong>Architect</strong></span>
          <span className="hidden sm:inline">- for your Dream-Project?</span>
          <Button size="sm" variant="link" className="text-red-600 h-auto p-0 text-xs sm:text-sm">
            Click Here!
          </Button>
        </div>
      </Card>

      {/* SORT BY Dropdown */}
      <div className="flex justify-end">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px] border-2 border-black font-bold text-xs sm:text-sm">
            <SelectValue placeholder="SORT BY" />
          </SelectTrigger>
          <SelectContent>
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
      <div className="text-sm text-green-700 text-center p-4 bg-green-50 rounded border border-green-300">
        <p className="font-semibold">You can Clear up all your outstanding indebtedness now!</p>
        <p className="text-xs mt-1">You must fund your main Wallet adequately and sufficiently!</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button className="bg-yellow-400 text-black hover:bg-yellow-500 w-full font-bold">
          Financial Status Report
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 w-full font-bold">
          Check Total Indebtedness
        </Button>
        <div className="flex items-center gap-2">
          <Checkbox id="clearance" />
          <label htmlFor="clearance" className="flex-1">
            <Button className="bg-green-600 hover:bg-green-700 w-full font-bold">
              Debts Clearance Now
            </Button>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="download" />
          <label htmlFor="download" className="flex-1">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full font-bold">
              <Download className="w-4 h-4 mr-2" />
              Download Receipts
            </Button>
          </label>
        </div>
      </div>

      {/* Advert Section */}
      <PremiumAdRotation 
        slotId="community-accounts-ads"
        ads={contentsAdSlots[0]}
        context="profile"
      />

      {/* Financial Summary Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Financial Summary</h2>
        <FinancialSummaryTable 
          member={mockMemberFinancialRecord}
          sortFilter="all"
          onSortChange={() => {}}
        />
      </div>

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
