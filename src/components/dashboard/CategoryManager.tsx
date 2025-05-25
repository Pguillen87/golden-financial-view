
import React, { useState } from 'react';
import { TrendingUp, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [activeSubTab, setActiveSubTab] = useState('analisar');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'income' | 'expense'>('income');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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

  const [incomeCategories, setIncomeCategories] = useState<Category[]>([
    { id: 1, name: 'Freelancer', active: true, color: '#22c55e', description: 'Trabalhos freelance' },
    { id: 2, name: 'Salário', active: true, color: '#16a34a', description: 'Salário principal' },
    { id: 3, name: 'Investimentos', active: false, color: '#15803d', description: 'Rendimentos de investimentos' },
  ]);

  const [expenseCategories, setExpenseCategories] = useState<Category[]>([
    { id: 1, name: 'Aluguel', active: true, color: '#ef4444', description: 'Aluguel mensal' },
    { id: 2, name: 'Mercado', active: true, color: '#dc2626', description: 'Compras de supermercado' },
    { id: 3, name: 'Transporte', active: false, color: '#b91c1c', description: 'Gastos com transporte' },
  ]);

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
      onConfirm: () => {
        if (type === 'income') {
          setIncomeCategories(prev => prev.filter(cat => cat.id !== id));
        } else {
          setExpenseCategories(prev => prev.filter(cat => cat.id !== id));
        }
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleToggleCategory = (id: number, type: 'income' | 'expense') => {
    if (type === 'income') {
      setIncomeCategories(prev => prev.map(cat => 
        cat.id === id ? { ...cat, active: !cat.active } : cat
      ));
    } else {
      setExpenseCategories(prev => prev.map(cat => 
        cat.id === id ? { ...cat, active: !cat.active } : cat
      ));
    }
  };

  const handleSaveCategory = (categoryData: any) => {
    if (editingCategory) {
      // Editar categoria existente
      if (dialogType === 'income') {
        setIncomeCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat
        ));
      } else {
        setExpenseCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat
        ));
      }
    } else {
      // Adicionar nova categoria
      const newCategory = {
        id: Date.now(),
        active: true,
        ...categoryData
      };
      
      if (dialogType === 'income') {
        setIncomeCategories(prev => [...prev, newCategory]);
      } else {
        setExpenseCategories(prev => [...prev, newCategory]);
      }
    }
    setIsDialogOpen(false);
  };

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
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
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
