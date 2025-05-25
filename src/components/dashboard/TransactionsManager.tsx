
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import TransactionFormDialog from './TransactionFormDialog';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
}

const TransactionsManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'income' | 'expense'>('income');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([
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

  const handleAddTransaction = (type: 'income' | 'expense') => {
    setDialogType(type);
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setDialogType(transaction.type);
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveTransaction = (transactionData: any) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => 
        t.id === editingTransaction.id ? { ...t, ...transactionData } : t
      ));
    } else {
      const newTransaction = {
        id: Date.now(),
        ...transactionData
      };
      setTransactions(prev => [...prev, newTransaction]);
    }
    setIsDialogOpen(false);
  };

  const TransactionCard = ({ title, transactions, type }: { 
    title: string; 
    transactions: Transaction[]; 
    type: 'income' | 'expense' 
  }) => (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-800 rounded-lg">
            {type === 'income' ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <h3 className={`text-md font-semibold ${
            type === 'income' ? 'text-green-400' : 'text-red-400'
          }`}>
            {title}
          </h3>
        </div>
        <Button 
          size="sm" 
          onClick={() => handleAddTransaction(type)}
          className="bg-[#FFD700] hover:bg-[#E6C200] text-black"
        >
          <Plus className="h-3 w-3 mr-1" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {transactions.length > 0 ? transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-white text-sm">{transaction.description}</h4>
                <span className={`text-sm font-bold ${
                  type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  <span>{formatDate(transaction.date)}</span>
                </div>
                <span>•</span>
                <span>{transaction.category}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 ml-3">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleEditTransaction(transaction)}
                className="text-gray-400 hover:text-white p-1 h-6 w-6"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleDeleteTransaction(transaction.id)}
                className="text-red-400 hover:text-red-300 p-1 h-6 w-6"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )) : (
          <p className="text-center py-6 text-gray-400 text-sm">
            Nenhuma transação encontrada
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-[#FFD700] mb-1">
            Gerenciar Lançamentos
          </h3>
          <p className="text-gray-400 text-sm">
            Visualize, edite, exclua e adicione novos lançamentos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <h4 className="text-md font-semibold text-[#FFD700] mb-3">Resumo do Período</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Total de Receitas</p>
            <p className="text-lg font-bold text-green-400">
              {formatCurrency(incomeTransactions.reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Total de Despesas</p>
            <p className="text-lg font-bold text-red-400">
              {formatCurrency(expenseTransactions.reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Saldo</p>
            <p className={`text-lg font-bold ${
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

      <TransactionFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveTransaction}
        type={dialogType}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default TransactionsManager;
