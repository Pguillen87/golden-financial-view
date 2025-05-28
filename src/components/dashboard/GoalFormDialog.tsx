
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
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
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: new Date(),
    category: '',
    type: 'expense'
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || '',
        targetAmount: goal.targetAmount?.toString() || '',
        currentAmount: goal.currentAmount?.toString() || '',
        deadline: goal.deadline ? new Date(goal.deadline) : new Date(),
        category: goal.category || '',
        type: 'expense'
      });
      setTempDate(goal.deadline ? new Date(goal.deadline) : new Date());
    } else {
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: new Date(),
        category: '',
        type: 'expense'
      });
      setTempDate(new Date());
    }
  }, [goal, isOpen]);

  useEffect(() => {
    if (cliente && isOpen) {
      fetchCategories();
    }
  }, [cliente, isOpen, formData.type]);

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
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.targetAmount && formData.deadline) {
      onSave({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        deadline: format(formData.deadline, 'yyyy-MM-dd'),
        category: formData.category,
        type: formData.type
      });
    }
  };

  const handleChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateConfirm = () => {
    if (tempDate) {
      handleChange('deadline', tempDate);
      setIsCalendarOpen(false);
    }
  };

  const handleDateCancel = () => {
    setTempDate(formData.deadline);
    setIsCalendarOpen(false);
  };

  const selectedCategory = categories.find(cat => cat.id.toString() === formData.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {goal ? 'Editar' : 'Nova'} Meta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Nome da Meta</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Viagem, Emergência, etc."
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="type" className="text-white">Tipo</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white" side="bottom" align="start">
                <SelectItem value="expense" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  Meta de Economia (Despesa)
                </SelectItem>
                <SelectItem value="income" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  Meta de Receita
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="text-white">Categoria</Label>
            <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isCategoryOpen}
                  className="w-full justify-between bg-gray-800 border-gray-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:border-gray-500"
                >
                  {selectedCategory ? (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: selectedCategory.cor || '#666' }}
                      />
                      {selectedCategory.nome}
                    </div>
                  ) : (
                    <span className="text-gray-400">Selecione uma categoria</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-full p-0 bg-gray-800 border-gray-600" 
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <Command className="bg-gray-800">
                  <CommandInput 
                    placeholder="Buscar categoria..." 
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <CommandList className="max-h-60">
                    <CommandEmpty className="text-gray-400 text-sm py-6 text-center">
                      Nenhuma categoria encontrada
                    </CommandEmpty>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.nome}
                        onSelect={() => {
                          handleChange('category', category.id.toString());
                          setIsCategoryOpen(false);
                        }}
                        className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.category === category.id.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.cor || '#666' }}
                          />
                          {category.nome}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetAmount" className="text-white">Valor Alvo</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                value={formData.targetAmount}
                onChange={(e) => handleChange('targetAmount', e.target.value)}
                placeholder="0,00"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <Label htmlFor="currentAmount" className="text-white">Valor Atual</Label>
              <Input
                id="currentAmount"
                type="number"
                step="0.01"
                value={formData.currentAmount}
                onChange={(e) => handleChange('currentAmount', e.target.value)}
                placeholder="0,00"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deadline" className="text-white">Prazo</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white hover:bg-gray-700",
                    !formData.deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.deadline ? format(formData.deadline, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
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
