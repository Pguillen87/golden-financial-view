
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: number;
  name: string;
  active: boolean;
  color: string;
  description?: string;
}

interface CategoryListProps {
  title: string;
  categories: Category[];
  type: 'income' | 'expense';
  onAddCategory: (type: 'income' | 'expense') => void;
  onEditCategory: (category: Category, type: 'income' | 'expense') => void;
  onDeleteCategory: (id: number, type: 'income' | 'expense', categoryName: string) => void;
  onToggleCategory: (id: number, type: 'income' | 'expense') => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  title,
  categories,
  type,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onToggleCategory
}) => {
  const [showInactive, setShowInactive] = useState(false);
  const { cliente } = useAuth();
  const { toast } = useToast();

  const filteredCategories = categories.filter(cat => showInactive || cat.active);

  const handleDeleteWithCheck = async (categoryId: number, categoryName: string) => {
    if (!cliente) return;

    try {
      // Check for linked transactions and goals
      const transactionTable = type === 'income' ? 'financeiro_entradas' : 'financeiro_saidas';
      
      // Check entries/saídas
      const { data: transactionData } = await supabase
        .from(transactionTable)
        .select('id')
        .eq('categoria_id', categoryId);

      // Check goals (metas) - check both tipos since categories can be used for either type
      const { data: metasData } = await supabase
        .from('financeiro_metas')
        .select('id')
        .eq('categoria_id', categoryId);

      const hasLinkedData = (transactionData && transactionData.length > 0) || (metasData && metasData.length > 0);

      if (hasLinkedData) {
        toast({
          title: "Não é possível excluir",
          description: `A categoria "${categoryName}" possui transações ou metas vinculadas. Ela será inativada ao invés de excluída.`,
          variant: "destructive",
        });

        // Deactivate instead of delete
        const table = type === 'income' ? 'financeiro_categorias_entrada' : 'financeiro_categorias_saida';
        const { error } = await supabase
          .from(table)
          .update({ ativo: false })
          .eq('id', categoryId);

        if (error) throw error;

        onToggleCategory(categoryId, type);
      } else {
        onDeleteCategory(categoryId, type, categoryName);
      }
    } catch (error) {
      console.error('Erro ao verificar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar os vínculos da categoria.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className={`text-lg font-semibold bg-gradient-to-r ${
          type === 'income' ? 'from-green-400 to-emerald-400' : 'from-red-400 to-pink-400'
        } bg-clip-text text-transparent`}>
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowInactive(!showInactive)}
            className="text-gray-400 hover:text-white p-2 h-8 w-8"
            title={showInactive ? "Ocultar inativas" : "Mostrar inativas"}
          >
            {showInactive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button 
            size="sm" 
            onClick={() => onAddCategory(type)}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#E6C200] hover:to-[#FF8C00] text-black font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div 
          className="space-y-3 max-h-full overflow-y-auto pr-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)',
          }}
        >
          {filteredCategories.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 group flex-shrink-0 ${!category.active ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" 
                  style={{ backgroundColor: category.color }}
                />
                <div className="min-w-0 flex-1">
                  <span className={`text-sm font-medium truncate block ${category.active ? 'text-white' : 'text-gray-400'}`}>
                    {category.name}
                  </span>
                  {category.description && (
                    <p className="text-xs text-gray-400 mt-1 truncate">{category.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <Switch
                  checked={category.active}
                  onCheckedChange={() => onToggleCategory(category.id, type)}
                  className="rounded-full"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onEditCategory(category, type)}
                  className="text-gray-400 hover:text-white p-2 h-8 w-8 rounded-lg hover:bg-white/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleDeleteWithCheck(category.id, category.name)}
                  className="text-red-400 hover:text-red-300 p-2 h-8 w-8 rounded-lg hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>
        {`
          .space-y-3::-webkit-scrollbar {
            width: 6px;
          }
          .space-y-3::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .space-y-3::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
          }
          .space-y-3::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        `}
      </style>
    </motion.div>
  );
};

export default CategoryList;
