
import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const { theme } = useTheme();

  const incomeTransactions = transactions.filter(t => t.type === 'income').slice(0, 3);
  const expenseTransactions = transactions.filter(t => t.type === 'expense').slice(0, 3);

  const TransactionCard = ({ title, transactions, type }: { 
    title: string; 
    transactions: Transaction[]; 
    type: 'income' | 'expense' 
  }) => (
    <div className={`p-6 rounded-2xl shadow-lg border-2 ${
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${
          theme === 'dark' ? 'bg-gold/20' : 'bg-navy/10'
        }`}>
          {type === 'income' ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
        </div>
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-gold' : 'text-navy'
        }`}>
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {transactions.length > 0 ? transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex-1">
              <p className={`font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {transaction.description}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <div className={`text-lg font-bold ${
              type === 'income' ? 'text-green-500' : 'text-red-500'
            }`}>
              R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        )) : (
          <p className={`text-center py-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Nenhuma transação encontrada
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
      <TransactionCard 
        title="Últimas Receitas" 
        transactions={incomeTransactions} 
        type="income" 
      />
      <TransactionCard 
        title="Últimas Despesas" 
        transactions={expenseTransactions} 
        type="expense" 
      />
    </div>
  );
};

export default RecentTransactions;
