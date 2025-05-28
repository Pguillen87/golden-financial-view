
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
  color: string;
}

interface CategorySelectProps {
  type: 'income' | 'expense';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  type,
  value,
  onChange,
  placeholder = "Selecione uma categoria"
}) => {
  const { cliente } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (cliente) {
      fetchCategories();
    }
  }, [cliente, type]);

  const fetchCategories = async () => {
    if (!cliente) return;

    setIsLoading(true);
    try {
      const table = type === 'income' ? 'financeiro_categorias_entrada' : 'financeiro_categorias_saida';
      
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
          color: cat.cor || (type === 'income' ? '#22c55e' : '#ef4444')
        })) || [];
        setCategories(mappedCategories);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id.toString() === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-800 border-gray-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:border-gray-500"
        >
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
              {isLoading ? "Carregando..." : placeholder}
            </span>
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
              {categories.length === 0 && !isLoading ? "Nenhuma categoria encontrada" : "Carregando..."}
            </CommandEmpty>
            {categories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name}
                onSelect={() => {
                  onChange(category.id.toString());
                  setOpen(false);
                }}
                className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === category.id.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelect;
