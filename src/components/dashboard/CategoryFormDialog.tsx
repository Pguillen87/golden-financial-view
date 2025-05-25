
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
import { Textarea } from '@/components/ui/textarea';

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: any) => void;
  type: 'income' | 'expense';
  category?: any;
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  type,
  category
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: type === 'income' ? '#22c55e' : '#ef4444'
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        color: category.color || (type === 'income' ? '#22c55e' : '#ef4444')
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: type === 'income' ? '#22c55e' : '#ef4444'
      });
    }
  }, [category, type, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
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
            {category ? 'Editar' : 'Adicionar'} Categoria de {type === 'income' ? 'Receita' : 'Despesa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Nome da Categoria</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Salário, Alimentação"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ex: Despesas mensais com supermercado"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="color" className="text-white">Cor da Categoria</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-16 h-10 bg-gray-800 border-gray-600"
              />
              <Input
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="#000000"
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
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
              Salvar Categoria
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
