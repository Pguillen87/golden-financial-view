
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingActionButtonsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  isVisible?: boolean;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onAddIncome,
  onAddExpense,
  isVisible = true
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          onClick={onAddIncome}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          title="Nova Receita"
        >
          <TrendingUp className="h-6 w-6" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={onAddExpense}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          title="Nova Despesa"
        >
          <TrendingDown className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
};

export default FloatingActionButtons;
