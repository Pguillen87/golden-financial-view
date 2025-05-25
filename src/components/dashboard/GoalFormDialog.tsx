
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

interface GoalFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: any) => void;
  goal?: any;
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
    category: ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || '',
        targetAmount: goal.targetAmount?.toString() || '',
        currentAmount: goal.currentAmount?.toString() || '',
        deadline: goal.deadline || '',
        category: goal.category || ''
      });
    } else {
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        deadline: '',
        category: ''
      });
    }
  }, [goal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.targetAmount && formData.deadline) {
      onSave({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0
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
            {goal ? 'Editar Meta' : 'Nova Meta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Nome da Meta</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Emergência, Viagem"
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
              placeholder="Ex: Poupança, Lazer"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="targetAmount" className="text-white">Valor Meta</Label>
              <Input
                id="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => handleChange('targetAmount', e.target.value)}
                placeholder="10000"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <Label htmlFor="currentAmount" className="text-white">Valor Atual</Label>
              <Input
                id="currentAmount"
                type="number"
                value={formData.currentAmount}
                onChange={(e) => handleChange('currentAmount', e.target.value)}
                placeholder="0"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deadline" className="text-white">Data Limite</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
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
              className="bg-[#FFD700] hover:bg-[#E6C200] text-black font-medium"
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
