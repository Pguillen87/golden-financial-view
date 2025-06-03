
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CategorySelectImproved from './CategorySelectImproved';
import { Calendar } from 'lucide-react';
import { Goal } from '@/types/goal';

interface GoalFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: any) => void;
  goal?: Goal | null;
}

const GoalFormDialog: React.FC<GoalFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  goal
}) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: '',
    type: 'expense' as 'income' | 'expense'
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || '',
        targetAmount: goal.targetAmount?.toString() || '',
        currentAmount: goal.currentAmount?.toString() || '',
        deadline: goal.deadline || '',
        category: '', // Will be set from the goal's category id
        type: goal.type || 'expense'
      });
    } else {
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        deadline: '',
        category: '',
        type: 'expense'
      });
    }
  }, [goal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.targetAmount && formData.deadline && formData.category) {
      onSave({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || '0')
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {goal ? 'Editar' : 'Adicionar'} Meta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Nome da Meta</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Economizar para viagem"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Label className="text-white">Tipo de Meta</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="expense" className="text-white hover:bg-gray-700">
                  Meta de Despesa
                </SelectItem>
                <SelectItem value="income" className="text-white hover:bg-gray-700">
                  Meta de Receita
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white">Categoria</Label>
            <CategorySelectImproved
              type={formData.type}
              value={formData.category}
              onChange={(value) => handleChange('category', value)}
              placeholder={`Selecione uma categoria de ${formData.type === 'income' ? 'receita' : 'despesa'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="targetAmount" className="text-white">Valor Alvo (R$)</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.targetAmount}
                onChange={(e) => handleChange('targetAmount', e.target.value)}
                placeholder="0,00"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <Label htmlFor="currentAmount" className="text-white">Valor Atual (R$)</Label>
              <Input
                id="currentAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.currentAmount}
                onChange={(e) => handleChange('currentAmount', e.target.value)}
                placeholder="0,00"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deadline" className="text-white">Data Limite</Label>
            <div className="relative">
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#4299e1] hover:bg-[#3182ce] text-white"
            >
              Salvar Meta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalFormDialog;
