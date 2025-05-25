
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const FloatingActionButtons: React.FC = () => {
  const { toast } = useToast();

  const handleAddIncome = () => {
    toast({
      title: "Adicionar Receita",
      description: "Redirecionando para cadastro de receita...",
    });
    // Aqui você pode redirecionar para a página de cadastro de receita
  };

  const handleAddExpense = () => {
    toast({
      title: "Adicionar Despesa",
      description: "Redirecionando para cadastro de despesa...",
    });
    // Aqui você pode redirecionar para a página de cadastro de despesa
  };

  return (
    <>
      <Button
        onClick={handleAddIncome}
        className="fab fab-add"
        size="icon"
        aria-label="Adicionar receita"
      >
        <Plus className="h-6 w-6" />
      </Button>
      
      <Button
        onClick={handleAddExpense}
        className="fab fab-subtract"
        size="icon"
        aria-label="Adicionar despesa"
      >
        <Minus className="h-6 w-6" />
      </Button>
    </>
  );
};

export default FloatingActionButtons;
