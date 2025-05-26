
import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import TransactionFormDialog from './TransactionFormDialog';
import { useNavigation } from '@/contexts/NavigationContext';

const FloatingActionButtons: React.FC = () => {
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const { hideFloatingButtons } = useNavigation();

  const handleSaveTransaction = (transactionData: any) => {
    console.log('Nova transação:', transactionData);
    setIsIncomeDialogOpen(false);
    setIsExpenseDialogOpen(false);
  };

  if (hideFloatingButtons) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
        {/* Botão de Receita */}
        <button
          onClick={() => setIsIncomeDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
          title="Adicionar Receita"
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-medium">Receita</span>
        </button>

        {/* Botão de Despesa */}
        <button
          onClick={() => setIsExpenseDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
          title="Adicionar Despesa"
        >
          <TrendingDown className="h-5 w-5" />
          <span className="text-sm font-medium">Despesa</span>
        </button>
      </div>

      <TransactionFormDialog
        isOpen={isIncomeDialogOpen}
        onClose={() => setIsIncomeDialogOpen(false)}
        onSave={handleSaveTransaction}
        type="income"
      />

      <TransactionFormDialog
        isOpen={isExpenseDialogOpen}
        onClose={() => setIsExpenseDialogOpen(false)}
        onSave={handleSaveTransaction}
        type="expense"
      />
    </>
  );
};

export default FloatingActionButtons;
