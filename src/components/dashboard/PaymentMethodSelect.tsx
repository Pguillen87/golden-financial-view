
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethod {
  id: number;
  nome: string;
}

interface PaymentMethodSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({
  value,
  onChange,
  placeholder = "Selecione uma forma de pagamento"
}) => {
  const { cliente } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-800 border-gray-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:border-gray-500"
        >
          {selectedPaymentMethod ? (
            selectedPaymentMethod.nome
          ) : (
            <span className="text-gray-400">
              {isLoading ? "Carregando..." : placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0 bg-gray-800 border-gray-600 z-50" 
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={8}
      >
        <Command className="bg-gray-800">
          <CommandInput 
            placeholder="Buscar forma de pagamento..." 
            className="bg-gray-800 border-gray-600 text-white"
          />
          <CommandList className="max-h-60">
            <CommandEmpty className="text-gray-400 text-sm py-6 text-center">
              {paymentMethods.length === 0 && !isLoading ? "Nenhuma forma de pagamento encontrada" : "Carregando..."}
            </CommandEmpty>
            {paymentMethods.map((paymentMethod) => (
              <CommandItem
                key={paymentMethod.id}
                value={paymentMethod.nome}
                onSelect={() => {
                  onChange(paymentMethod.id.toString());
                  setOpen(false);
                }}
                className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === paymentMethod.id.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
                {paymentMethod.nome}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PaymentMethodSelect;
