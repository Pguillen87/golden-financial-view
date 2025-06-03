
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

interface PaymentMethodFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentMethodData: any) => void;
  paymentMethod?: any;
}

const PaymentMethodFormDialog: React.FC<PaymentMethodFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  paymentMethod
}) => {
  const [formData, setFormData] = useState({
    nome: ''
  });

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        nome: paymentMethod.nome || ''
      });
    } else {
      setFormData({
        nome: ''
      });
    }
  }, [paymentMethod, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nome.trim()) {
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
            {paymentMethod ? 'Editar' : 'Adicionar'} Forma de Pagamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome" className="text-white">Nome da Forma de Pagamento</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Ex: Cartão de Crédito, PIX, Dinheiro"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
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

export default PaymentMethodFormDialog;
