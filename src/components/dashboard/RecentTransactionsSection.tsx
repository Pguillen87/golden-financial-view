
import React from 'react';
import RecentTransactions from './RecentTransactions';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface RecentTransactionsSectionProps {
  transactions: Transaction[];
}

const RecentTransactionsSection: React.FC<RecentTransactionsSectionProps> = ({
  transactions
}) => {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#FFD700]">
        Lançamentos Recentes
      </h2>
      <RecentTransactions transactions={transactions} />
    </div>
  );
};

export default RecentTransactionsSection;
