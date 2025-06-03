
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentMethod {
  id: number;
  nome: string;
}

interface PaymentMethodSelectImprovedProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const PaymentMethodSelectImproved: React.FC<PaymentMethodSelectImprovedProps> = ({
  value,
  onChange,
  placeholder = "Selecione uma forma de pagamento"
}) => {
  const { cliente } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cliente) {
      fetchPaymentMethods();
    }
  }, [cliente]);

  const fetchPaymentMethods = async () => {
    if (!cliente) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('financeiro_formas_pagamento')
        .select('id, nome')
        .eq('cliente_id', cliente.id)
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar formas de pagamento:', error);
      } else {
        setPaymentMethods(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar formas de pagamento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPaymentMethod = paymentMethods.find(pm => pm.id.toString() === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:border-gray-500">
        <SelectValue>
          {selectedPaymentMethod ? (
            selectedPaymentMethod.nome
          ) : (
            <span className="text-gray-400">
              {isLoading ? "Carregando..." : placeholder}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-600 z-50">
        {paymentMethods.map((paymentMethod) => (
          <SelectItem 
            key={paymentMethod.id} 
            value={paymentMethod.id.toString()} 
            className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          >
            {paymentMethod.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PaymentMethodSelectImproved;
