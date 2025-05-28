
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Check } from 'lucide-react';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import CategorySelect from './CategorySelect';

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
    date: new Date(),
    category_id: '',
    observations: ''
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: transaction.amount?.toString() || '',
        date: transaction.date ? new Date(transaction.date) : new Date(),
        category_id: transaction.categoria_id?.toString() || '',
        observations: transaction.observations || ''
      });
      setTempDate(transaction.date ? new Date(transaction.date) : new Date());
    } else {
      setFormData({
        description: '',
        amount: '',
        date: new Date(),
        category_id: '',
        observations: ''
      });
      setTempDate(new Date());
    }
  }, [transaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.trim() && formData.amount && formData.category_id) {
      onSave({
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: format(formData.date, 'yyyy-MM-dd'),
        category_id: parseInt(formData.category_id),
        observations: formData.observations
      });
    }
  };

  const handleChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateConfirm = () => {
    if (tempDate) {
      handleChange('date', tempDate);
      setIsCalendarOpen(false);
    }
  };

  const handleDateCancel = () => {
    setTempDate(formData.date);
    setIsCalendarOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {transaction ? 'Editar' : 'Novo'} {type === 'income' ? 'Receita' : 'Despesa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description" className="text-white">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ex: Salário, Mercado, etc."
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-white">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0,00"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-white">Categoria</Label>
            <CategorySelect
              type={type}
              value={formData.category_id}
              onChange={(value) => handleChange('category_id', value)}
              placeholder="Selecione uma categoria"
            />
          </div>

          <div>
            <Label htmlFor="date" className="text-white">Data</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white hover:bg-gray-700",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={tempDate}
                  onSelect={setTempDate}
                  locale={ptBR}
                  initialFocus
                  className="pointer-events-auto bg-gray-800 text-white"
                />
                <div className="flex justify-end gap-2 p-3 border-t border-gray-600">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDateCancel}
                    className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDateConfirm}
                    className="bg-[#FFD700] hover:bg-[#E6C200] text-black"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Confirmar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="observations" className="text-white">Observações (opcional)</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              placeholder="Observações adicionais..."
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 resize-none"
              rows={3}
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
              Salvar {type === 'income' ? 'Receita' : 'Despesa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormDialog;
