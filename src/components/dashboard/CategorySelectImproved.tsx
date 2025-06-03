
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Category {
  id: number;
  name: string;
  color: string;
}

interface CategorySelectImprovedProps {
  type: 'income' | 'expense';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CategorySelectImproved: React.FC<CategorySelectImprovedProps> = ({
  type,
  value,
  onChange,
  placeholder = "Selecione uma categoria"
}) => {
  const { cliente } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    <Select value={value} onValueChange={onChange}>
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
              {isLoading ? "Carregando..." : placeholder}
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
  );
};

export default CategorySelectImproved;
