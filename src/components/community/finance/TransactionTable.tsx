import { Transaction } from "@/data/financialData";
import { Card } from "@/components/ui/card";

interface TransactionTableProps {
  transactions: Transaction[];
  filter: 'all' | 'credit' | 'debit' | 'balance';
}

export const TransactionTable = ({ transactions, filter }: TransactionTableProps) => {
  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  return (
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
              <tr key={transaction.id} className="hover:bg-gray-50">
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
  );
};