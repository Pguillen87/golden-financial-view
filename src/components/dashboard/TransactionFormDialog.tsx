
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TransactionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactionData: any) => void;
  type: 'income' | 'expense';
  transaction?: any;
}

const TransactionFormDialog: React.FC<TransactionFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  type,
  transaction
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    category: '',
    type: type
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: transaction.amount?.toString() || '',
        date: transaction.date || '',
        category: transaction.category || '',
        type: transaction.type || type
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        type: type
      });
    }
  }, [transaction, type, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.trim() && formData.amount && formData.date) {
      onSave({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {transaction ? 'Editar' : 'Novo'} Lançamento - {type === 'income' ? 'Receita' : 'Despesa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description" className="text-white">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ex: Salário, Aluguel"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-white">Categoria</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="Ex: Trabalho, Moradia"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="amount" className="text-white">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-white">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#4299e1] hover:bg-[#3182ce] text-white"
            >
              Salvar Lançamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormDialog;
