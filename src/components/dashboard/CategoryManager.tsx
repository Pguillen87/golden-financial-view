
import React, { useState, useEffect } from 'react';
import { TrendingUp, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CategoryFormDialog from './CategoryFormDialog';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import SubTabs from './SubTabs';
import CategoryAnalytics from './CategoryAnalytics';
import CategoryList from './CategoryList';

interface Category {
  id: number;
  name: string;
  active: boolean;
  color: string;
  description?: string;
}

const CategoryManager: React.FC = () => {
  const { cliente } = useAuth();
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState('analisar');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'income' | 'expense'>('income');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);

  const subTabs = [
    {
      id: 'analisar',
      label: 'Analisar',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-500'
    },
    {
      id: 'gerenciar',
      label: 'Gerenciar',
      icon: Settings,
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  useEffect(() => {
    if (cliente) {
      fetchCategories();
    }
  }, [cliente]);

  const fetchCategories = async () => {
    if (!cliente) return;

    setIsLoading(true);
    try {
      console.log('Carregando categorias para cliente:', cliente.id);
      
      // Buscar categorias de entrada - REMOVIDO o filtro .eq('ativo', true)
      const { data: incomeData, error: incomeError } = await supabase
        .from('financeiro_categorias_entrada')
        .select('*')
        .eq('cliente_id', cliente.id)
        .order('nome');

      if (incomeError) {
        console.error('Erro ao buscar categorias de entrada:', incomeError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias de receita.",
          variant: "destructive",
        });
      } else {
        console.log('Categorias de entrada carregadas:', incomeData);
        const mappedIncomeCategories = incomeData?.map(cat => ({
          id: cat.id,
          name: cat.nome,
          active: cat.ativo,
          color: cat.cor || '#22c55e',
          description: cat.descricao
        })) || [];
        setIncomeCategories(mappedIncomeCategories);
      }

      // Buscar categorias de saída - REMOVIDO o filtro .eq('ativo', true)
      const { data: expenseData, error: expenseError } = await supabase
        .from('financeiro_categorias_saida')
        .select('*')
        .eq('cliente_id', cliente.id)
        .order('nome');

      if (expenseError) {
        console.error('Erro ao buscar categorias de saída:', expenseError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias de despesa.",
          variant: "destructive",
        });
      } else {
        console.log('Categorias de saída carregadas:', expenseData);
        const mappedExpenseCategories = expenseData?.map(cat => ({
          id: cat.id,
          name: cat.nome,
          active: cat.ativo,
          color: cat.cor || '#ef4444',
          description: cat.descricao
        })) || [];
        setExpenseCategories(mappedExpenseCategories);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleAddCategory = (type: 'income' | 'expense') => {
    setDialogType(type);
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category, type: 'income' | 'expense') => {
    setDialogType(type);
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (id: number, type: 'income' | 'expense', categoryName: string) => {
    setConfirmationDialog({
      isOpen: true,
      title: 'Confirmar Exclusão',
      description: `Tem certeza que deseja excluir a categoria "${categoryName}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        try {
          const table = type === 'income' ? 'financeiro_categorias_entrada' : 'financeiro_categorias_saida';
          const { error } = await supabase
            .from(table)
            .update({ ativo: false })
            .eq('id', id);

          if (error) throw error;

          // Atualizar estado local
          if (type === 'income') {
            setIncomeCategories(prev => prev.map(cat => 
              cat.id === id ? { ...cat, active: false } : cat
            ));
          } else {
            setExpenseCategories(prev => prev.map(cat => 
              cat.id === id ? { ...cat, active: false } : cat
            ));
          }

          toast({
            title: "Sucesso",
            description: "Categoria desativada com sucesso.",
          });
        } catch (error) {
          console.error('Erro ao desativar categoria:', error);
          toast({
            title: "Erro",
            description: "Não foi possível desativar a categoria.",
            variant: "destructive",
          });
        }
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleToggleCategory = async (id: number, type: 'income' | 'expense') => {
    try {
      const table = type === 'income' ? 'financeiro_categorias_entrada' : 'financeiro_categorias_saida';
      const categories = type === 'income' ? incomeCategories : expenseCategories;
      const category = categories.find(cat => cat.id === id);
      
      if (!category) return;

      const { error } = await supabase
        .from(table)
        .update({ ativo: !category.active })
        .eq('id', id);

      if (error) throw error;

      // Atualizar estado local
      if (type === 'income') {
        setIncomeCategories(prev => prev.map(cat => 
          cat.id === id ? { ...cat, active: !cat.active } : cat
        ));
      } else {
        setExpenseCategories(prev => prev.map(cat => 
          cat.id === id ? { ...cat, active: !cat.active } : cat
        ));
      }

      toast({
        title: "Sucesso",
        description: `Categoria ${!category.active ? 'ativada' : 'desativada'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao alterar status da categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da categoria.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCategory = async (categoryData: any) => {
    if (!cliente) return;

    try {
      console.log('Salvando categoria:', categoryData, 'Tipo:', dialogType);
      const table = dialogType === 'income' ? 'financeiro_categorias_entrada' : 'financeiro_categorias_saida';
      
      if (editingCategory) {
        // Editar categoria existente
        const { error } = await supabase
          .from(table)
          .update({
            nome: categoryData.name,
            descricao: categoryData.description,
            cor: categoryData.color
          })
          .eq('id', editingCategory.id);

        if (error) throw error;

        // Atualizar estado local
        const updatedCategory = { 
          ...editingCategory, 
          name: categoryData.name,
          description: categoryData.description,
          color: categoryData.color
        };
        if (dialogType === 'income') {
          setIncomeCategories(prev => prev.map(cat => 
            cat.id === editingCategory.id ? updatedCategory : cat
          ));
        } else {
          setExpenseCategories(prev => prev.map(cat => 
            cat.id === editingCategory.id ? updatedCategory : cat
          ));
        }
      } else {
        // Adicionar nova categoria
        const { data, error } = await supabase
          .from(table)
          .insert({
            cliente_id: cliente.id,
            nome: categoryData.name,
            descricao: categoryData.description,
            cor: categoryData.color,
            ativo: true
          })
          .select()
          .single();

        if (error) {
          console.error('Erro ao inserir categoria:', error);
          throw error;
        }

        console.log('Categoria criada:', data);

        const newCategory = {
          id: data.id,
          name: data.nome,
          active: data.ativo,
          color: data.cor,
          description: data.descricao
        };
        
        if (dialogType === 'income') {
          setIncomeCategories(prev => [...prev, newCategory]);
        } else {
          setExpenseCategories(prev => [...prev, newCategory]);
        }
      }

      toast({
        title: "Sucesso",
        description: editingCategory ? "Categoria atualizada com sucesso." : "Categoria criada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a categoria.",
        variant: "destructive",
      });
    }
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">Carregando categorias...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubTabs 
        tabs={subTabs}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
      />

      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeSubTab === 'analisar' && (
          <CategoryAnalytics 
            incomeCategories={incomeCategories.filter(cat => cat.active)}
            expenseCategories={expenseCategories.filter(cat => cat.active)}
          />
        )}

        {activeSubTab === 'gerenciar' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CategoryList 
              title="Categorias de Receita" 
              categories={incomeCategories} 
              type="income"
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
              onToggleCategory={handleToggleCategory}
            />
            <CategoryList 
              title="Categorias de Despesa" 
              categories={expenseCategories} 
              type="expense"
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
              onToggleCategory={handleToggleCategory}
            />
          </div>
        )}
      </motion.div>

      <CategoryFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveCategory}
        type={dialogType}
        category={editingCategory}
      />

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        description={confirmationDialog.description}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default CategoryManager;
