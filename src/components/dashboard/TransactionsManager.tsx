
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
}

const TransactionsManager: React.FC = () => {
  // Dados mock para demonstração
  const [transactions] = useState<Transaction[]>([
    { id: 1, description: 'Salário', amount: 5000, date: '2024-05-20', type: 'income', category: 'Trabalho' },
    { id: 2, description: 'Freelance', amount: 1500, date: '2024-05-18', type: 'income', category: 'Extra' },
    { id: 3, description: 'Aluguel', amount: 1200, date: '2024-05-15', type: 'expense', category: 'Moradia' },
    { id: 4, description: 'Mercado', amount: 350, date: '2024-05-14', type: 'expense', category: 'Alimentação' },
    { id: 5, description: 'Gasolina', amount: 200, date: '2024-05-12', type: 'expense', category: 'Transporte' },
    { id: 6, description: 'Dividendos', amount: 80, date: '2024-05-10', type: 'income', category: 'Investimentos' },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const TransactionCard = ({ title, transactions, type }: { 
    title: string; 
    transactions: Transaction[]; 
    type: 'income' | 'expense' 
  }) => (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-800 rounded-lg">
            {type === 'income' ? (
              <TrendingUp className="h-5 w-5 text-green-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
          </div>
          <h3 className={`text-lg font-semibold ${
            type === 'income' ? 'text-green-400' : 'text-red-400'
          }`}>
            {title}
          </h3>
        </div>
        <Button 
          size="sm" 
          className={`${
            type === 'income' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'
          } text-white`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {transactions.length > 0 ? transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{transaction.description}</h4>
                <span className={`text-lg font-bold ${
                  type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(transaction.date)}</span>
                </div>
                <span>•</span>
                <span>{transaction.category}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )) : (
          <p className="text-center py-8 text-gray-400">
            Nenhuma transação encontrada
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-[#FFD700] mb-2">
            Gerenciar Lançamentos
          </h3>
          <p className="text-gray-400">
            Visualize, edite, exclua e adicione novos lançamentos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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

      {/* Resumo */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-[#FFD700] mb-4">Resumo do Período</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Total de Receitas</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(incomeTransactions.reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Total de Despesas</p>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(expenseTransactions.reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Saldo</p>
            <p className={`text-2xl font-bold ${
              (incomeTransactions.reduce((sum, t) => sum + t.amount, 0) - 
               expenseTransactions.reduce((sum, t) => sum + t.amount, 0)) >= 0 
                ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatCurrency(
                incomeTransactions.reduce((sum, t) => sum + t.amount, 0) - 
                expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsManager;
