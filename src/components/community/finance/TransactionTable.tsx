import { useState } from "react";
import { Transaction } from "@/data/financialData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface TransactionTableProps {
  transactions: Transaction[];
  filter: 'all' | 'credit' | 'debit' | 'balance';
}

export const TransactionTable = ({ transactions, filter }: TransactionTableProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto -mx-0 min-w-0">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-pink-200 p-2 border border-gray-300 text-left font-bold text-xs whitespace-nowrap">
                  S/N
                </th>
                <th className="bg-pink-200 p-2 border border-gray-300 text-left font-bold text-xs">
                  Transaction Descriptions<br/>
                  <span className="text-xs text-blue-600 font-normal">Click for Details</span>
                </th>
                <th className="bg-yellow-300 p-2 border border-gray-300 text-center font-bold text-xs whitespace-nowrap">
                  ₦<br/>Amount
                </th>
                <th className="bg-green-500 text-white p-2 border border-gray-300 text-center font-bold text-xs whitespace-nowrap">
                  ✓<br/>Approval
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className="hover:bg-gray-50 cursor-pointer active:bg-muted/50 touch-manipulation transition-colors"
                  onClick={() => handleRowClick(transaction)}
                >
                  <td className="bg-pink-200 p-2 border border-gray-300 font-bold text-xs whitespace-nowrap">
                    {transaction.serialNumber}.
                  </td>
                  <td className="bg-pink-200 p-2 border border-gray-300 text-xs leading-snug">
                    <span className="line-clamp-2">{transaction.description} ....</span>
                  </td>
                  <td className="bg-yellow-100 p-2 border border-gray-300 text-center font-bold text-xs tabular-nums whitespace-nowrap">
                    {transaction.creditAmount?.toLocaleString() || '---'}/
                    <br/>
                    {transaction.debitAmount?.toLocaleString() || '---'}
                  </td>
                  <td className="bg-green-100 p-2 border border-gray-300 text-center text-xs">
                    {transaction.approvalCode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Detail Drawer */}
      <Drawer open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-base font-bold">Transaction Details</DrawerTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedTransaction(null)}
                className="h-8 w-8 touch-manipulation"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>

          {selectedTransaction && (
            <div className="p-4 space-y-4 overflow-y-auto touch-auto">
              {/* Serial Number */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">S/N:</span>
                <span className="text-sm font-bold">{selectedTransaction.serialNumber}</span>
              </div>

              {/* Full Description */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Description</span>
                <p className="text-sm leading-relaxed bg-muted/30 p-3 rounded-lg">
                  {selectedTransaction.description}
                </p>
              </div>

              {/* Amount Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Credit</span>
                  <p className="text-base font-bold text-green-700 tabular-nums">
                    {selectedTransaction.creditAmount 
                      ? `₦${selectedTransaction.creditAmount.toLocaleString()}` 
                      : '---'}
                  </p>
                  {selectedTransaction.creditAmount && (
                    <p className="text-[10px] text-muted-foreground">
                      (M{selectedTransaction.creditAmount.toLocaleString()})
                    </p>
                  )}
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Debit</span>
                  <p className="text-base font-bold text-red-700 tabular-nums">
                    {selectedTransaction.debitAmount 
                      ? `₦${selectedTransaction.debitAmount.toLocaleString()}` 
                      : '---'}
                  </p>
                  {selectedTransaction.debitAmount && (
                    <p className="text-[10px] text-muted-foreground">
                      (M{selectedTransaction.debitAmount.toLocaleString()})
                    </p>
                  )}
                </div>
              </div>

              {/* Approval Code */}
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                <span className="text-xs text-muted-foreground font-medium">Approval Code</span>
                <Badge variant="outline" className="text-xs font-mono">
                  {selectedTransaction.approvalCode}
                </Badge>
              </div>

              {/* Transaction Type */}
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                <span className="text-xs text-muted-foreground font-medium">Type</span>
                <Badge 
                  className={
                    selectedTransaction.type === 'credit' 
                      ? 'bg-green-100 text-green-700 border-green-300' 
                      : 'bg-red-100 text-red-700 border-red-300'
                  }
                >
                  {selectedTransaction.type === 'credit' ? 'Credit (Income)' : 'Debit (Withdrawal)'}
                </Badge>
              </div>

              {/* Close Button */}
              <Button 
                className="w-full mt-2 touch-manipulation active:scale-[0.97] transition-transform"
                variant="outline"
                onClick={() => setSelectedTransaction(null)}
              >
                Close
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
