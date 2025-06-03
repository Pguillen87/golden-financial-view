
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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from 'lucide-react';
import { Goal } from '@/types/goal';

interface Category {
  id: number;
  name: string;
  color: string;
}

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
  const { cliente } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
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

  useEffect(() => {
    if (cliente && isOpen) {
      fetchCategories();
    }
  }, [cliente, formData.type, isOpen]);

  const fetchCategories = async () => {
    if (!cliente) return;

    try {
      const table = formData.type === 'income' ? 'financeiro_categorias_entrada' : 'financeiro_categorias_saida';
      
      const { data, error } = await supabase
        .from(table)
        .select('id, nome, cor')
        .eq('cliente_id', cliente.id)
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar categorias:', error);
      } else {
        const mappedCategories = data?.map(cat => ({
          id: cat.id,
          name: cat.nome,
          color: cat.cor || (formData.type === 'income' ? '#22c55e' : '#ef4444')
        })) || [];
        setCategories(mappedCategories);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

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

  const selectedCategory = categories.find(cat => cat.id.toString() === formData.category);

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
            <Select value={formData.type} onValueChange={(value) => {
              handleChange('type', value);
              handleChange('category', ''); // Reset category when type changes
            }}>
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
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:border-gray-500">
                <SelectValue>
                  {selectedCategory ? (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: selectedCategory.color }}
                      />
                      {selectedCategory.name}
                    </div>
                  ) : (
                    <span className="text-gray-400">
                      {`Selecione uma categoria de ${formData.type === 'income' ? 'receita' : 'despesa'}`}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 z-50">
                {categories.map((category) => (
                  <SelectItem 
                    key={category.id} 
                    value={category.id.toString()} 
                    className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
