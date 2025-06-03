
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Check, AlertTriangle } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import CategorySelect from './CategorySelect';
import PaymentMethodSelect from './PaymentMethodSelect';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const { cliente } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date(),
    category_id: '',
    payment_method_id: '',
    status: type === 'income' ? 'a_receber' : 'a_vencer',
    observations: '',
    receipt_date: null as Date | null,
    current_installment: '1',
    total_installments: '1'
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isReceiptCalendarOpen, setIsReceiptCalendarOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(new Date());
  const [tempReceiptDate, setTempReceiptDate] = useState<Date | undefined>();

  useEffect(() => {
    if (transaction) {
      console.log('Carregando transação para edição:', transaction);
      setFormData({
        description: transaction.description || '',
        amount: transaction.amount?.toString() || '',
        date: transaction.date ? new Date(transaction.date) : new Date(),
        category_id: transaction.categoria_id?.toString() || '',
        payment_method_id: '',
        status: transaction.status || (type === 'income' ? 'a_receber' : 'a_vencer'),
        observations: transaction.observations || '',
        receipt_date: null,
        current_installment: '1',
        total_installments: '1'
      });
      setTempDate(transaction.date ? new Date(transaction.date) : new Date());
      
      // Buscar dados adicionais da transação
      fetchTransactionDetails(transaction.id);
    } else {
      setFormData({
        description: '',
        amount: '',
        date: new Date(),
        category_id: '',
        payment_method_id: '',
        status: type === 'income' ? 'a_receber' : 'a_vencer',
        observations: '',
        receipt_date: null,
        current_installment: '1',
        total_installments: '1'
      });
      setTempDate(new Date());
      setTempReceiptDate(undefined);
    }
  }, [transaction, isOpen, type]);

  const fetchTransactionDetails = async (transactionId: number) => {
    if (!cliente) return;

    try {
      const table = type === 'income' ? 'financeiro_entradas' : 'financeiro_saidas';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) {
        console.error('Erro ao buscar detalhes da transação:', error);
        return;
      }

      if (data) {
        console.log('Dados completos da transação:', data);
        setFormData(prev => ({
          ...prev,
          payment_method_id: data.forma_pagamento_id?.toString() || '',
          receipt_date: data.data_recebimento || data.data_pagamento ? new Date(data.data_recebimento || data.data_pagamento) : null,
          current_installment: data.parcela_atual?.toString() || '1',
          total_installments: data.total_parcelas?.toString() || '1'
        }));

        if (data.data_recebimento || data.data_pagamento) {
          setTempReceiptDate(new Date(data.data_recebimento || data.data_pagamento));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes da transação:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.trim() && formData.amount && formData.category_id) {
      const transactionData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: format(formData.date, 'yyyy-MM-dd'),
        category_id: parseInt(formData.category_id),
        payment_method_id: formData.payment_method_id ? parseInt(formData.payment_method_id) : null,
        status: formData.status,
        observations: formData.observations,
        receipt_date: formData.receipt_date ? format(formData.receipt_date, 'yyyy-MM-dd') : null,
        current_installment: parseInt(formData.current_installment),
        total_installments: parseInt(formData.total_installments)
      };
      
      console.log('Dados a serem salvos:', transactionData);
      onSave(transactionData);
    }
  };

  const handleChange = (field: string, value: string | Date | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateConfirm = () => {
    if (tempDate) {
      handleChange('date', tempDate);
      setIsCalendarOpen(false);
    }
  };

  const handleReceiptDateConfirm = () => {
    if (tempReceiptDate) {
      handleChange('receipt_date', tempReceiptDate);
      setIsReceiptCalendarOpen(false);
    }
  };

  const getStatusOptions = () => {
    if (type === 'income') {
      return [
        { value: 'a_receber', label: 'A Receber' },
        { value: 'recebida', label: 'Recebida' },
        { value: 'vencida', label: 'Vencida' }
      ];
    } else {
      return [
        { value: 'a_vencer', label: 'A Vencer' },
        { value: 'pago', label: 'Pago' },
        { value: 'vencido', label: 'Vencido' }
      ];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recebida':
      case 'pago':
        return 'text-green-400';
      case 'a_receber':
      case 'a_vencer':
        return 'text-yellow-400';
      case 'vencida':
      case 'vencido':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const isStatusReceived = formData.status === 'recebida' || formData.status === 'pago';
  const today = new Date();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md max-h-[90vh] overflow-y-auto">
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
            <Label htmlFor="payment_method" className="text-white">Forma de Pagamento</Label>
            <PaymentMethodSelect
              value={formData.payment_method_id}
              onChange={(value) => handleChange('payment_method_id', value)}
              placeholder="Selecione uma forma de pagamento"
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-white">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue>
                  <span className={getStatusColor(formData.status)}>
                    {getStatusOptions().find(opt => opt.value === formData.status)?.label}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 z-50">
                {getStatusOptions().map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700"
                  >
                    <span className={getStatusColor(option.value)}>
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600 z-50" align="start" side="bottom">
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
                    onClick={() => setIsCalendarOpen(false)}
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

          {isStatusReceived && (
            <div>
              <Label htmlFor="receipt_date" className="text-white flex items-center gap-2">
                Data de {type === 'income' ? 'Recebimento' : 'Pagamento'}
                {formData.receipt_date && new Date(formData.receipt_date) > today && (
                  <AlertTriangle className="h-4 w-4 text-yellow-400" title="Data não pode ser futura" />
                )}
              </Label>
              <Popover open={isReceiptCalendarOpen} onOpenChange={setIsReceiptCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white hover:bg-gray-700",
                      !formData.receipt_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.receipt_date ? format(formData.receipt_date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600 z-50" align="start" side="bottom">
                  <Calendar
                    mode="single"
                    selected={tempReceiptDate}
                    onSelect={setTempReceiptDate}
                    locale={ptBR}
                    initialFocus
                    disabled={(date) => date > today}
                    className="pointer-events-auto bg-gray-800 text-white"
                  />
                  <div className="flex justify-end gap-2 p-3 border-t border-gray-600">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsReceiptCalendarOpen(false)}
                      className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleReceiptDateConfirm}
                      className="bg-[#FFD700] hover:bg-[#E6C200] text-black"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Confirmar
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_installment" className="text-white">Parcela Atual</Label>
              <Input
                id="current_installment"
                type="number"
                min="1"
                value={formData.current_installment}
                onChange={(e) => handleChange('current_installment', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="total_installments" className="text-white">Total de Parcelas</Label>
              <Input
                id="total_installments"
                type="number"
                min="1"
                value={formData.total_installments}
                onChange={(e) => handleChange('total_installments', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
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
