
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TransactionFormDialog from './TransactionFormDialog';

const FloatingActionButtons: React.FC = () => {
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  const handleSaveTransaction = (transactionData: any) => {
    console.log('Nova transação:', transactionData);
    setIsIncomeDialogOpen(false);
    setIsExpenseDialogOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
        {/* Botão de Receita */}
        <button
          onClick={() => setIsIncomeDialogOpen(true)}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          title="Adicionar Receita"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* Botão de Despesa */}
        <button
          onClick={() => setIsExpenseDialogOpen(true)}
          className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          title="Adicionar Despesa"
        >
          <Plus className="h-6 w-6 rotate-45" />
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
