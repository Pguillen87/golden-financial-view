
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CategorySelect from './CategorySelect';
import PaymentMethodSelect from './PaymentMethodSelect';
import { Calendar, Info } from 'lucide-react';

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
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    payment_method_id: '',
    status: type === 'income' ? 'a_receber' : 'a_vencer',
    observations: '',
    receipt_date: '',
    current_installment: 1,
    total_installments: 1
  });

  useEffect(() => {
    if (transaction) {
      // Verificar se é receita ou despesa e acessar o campo correto
      const receiptDate = type === 'income' 
        ? (transaction as any).data_recebimento 
        : (transaction as any).data_pagamento;

      setFormData({
        description: transaction.description || '',
        amount: transaction.amount?.toString() || '',
        date: transaction.date || new Date().toISOString().split('T')[0],
        category_id: transaction.categoria_id?.toString() || '',
        payment_method_id: transaction.payment_method_id?.toString() || '',
        status: transaction.status || (type === 'income' ? 'a_receber' : 'a_vencer'),
        observations: transaction.observations || '',
        receipt_date: receiptDate || '',
        current_installment: transaction.current_installment || 1,
        total_installments: transaction.total_installments || 1
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category_id: '',
        payment_method_id: '',
        status: type === 'income' ? 'a_receber' : 'a_vencer',
        observations: '',
        receipt_date: '',
        current_installment: 1,
        total_installments: 1
      });
    }
  }, [transaction, isOpen, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.trim() && formData.amount && formData.category_id) {
      onSave({
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
        payment_method_id: formData.payment_method_id ? parseInt(formData.payment_method_id) : null,
        current_installment: parseInt(formData.current_installment.toString()),
        total_installments: parseInt(formData.total_installments.toString())
      });
      onClose();
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const isReceiptStatusSelected = () => {
    return (type === 'income' && formData.status === 'recebida') ||
           (type === 'expense' && formData.status === 'pago');
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {transaction ? 'Editar' : 'Adicionar'} {type === 'income' ? 'Receita' : 'Despesa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-white">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descrição da transação"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <Label htmlFor="amount" className="text-white">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0,00"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-white">Data</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <Label className="text-white">Categoria</Label>
              <CategorySelect
                type={type}
                value={formData.category_id}
                onChange={(value) => handleChange('category_id', value)}
                placeholder={`Selecione uma categoria de ${type === 'income' ? 'receita' : 'despesa'}`}
              />
            </div>

            <div>
              <Label className="text-white">Forma de Pagamento</Label>
              <PaymentMethodSelect
                value={formData.payment_method_id}
                onChange={(value) => handleChange('payment_method_id', value)}
                placeholder="Selecione uma forma de pagamento"
              />
            </div>

            <div>
              <Label className="text-white">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {getStatusOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isReceiptStatusSelected() && (
              <div>
                <Label className="text-white flex items-center gap-2">
                  Data de {type === 'income' ? 'Recebimento' : 'Pagamento'}
                  <Info className="h-3 w-3 text-gray-400" />
                </Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={formData.receipt_date}
                    onChange={(e) => handleChange('receipt_date', e.target.value)}
                    max={getTodayDate()}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Data deve ser igual ou anterior a hoje
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="total_installments" className="text-white">Total de Parcelas</Label>
              <Input
                id="total_installments"
                type="number"
                min="1"
                max="999"
                value={formData.total_installments}
                onChange={(e) => handleChange('total_installments', parseInt(e.target.value) || 1)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            {formData.total_installments > 1 && (
              <div>
                <Label htmlFor="current_installment" className="text-white">Parcela Atual</Label>
                <Input
                  id="current_installment"
                  type="number"
                  min="1"
                  max={formData.total_installments}
                  value={formData.current_installment}
                  onChange={(e) => handleChange('current_installment', parseInt(e.target.value) || 1)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <Label htmlFor="observations" className="text-white">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                placeholder="Observações adicionais (opcional)"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 resize-none"
                rows={3}
              />
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
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormDialog;
