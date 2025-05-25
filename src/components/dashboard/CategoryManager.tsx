
import React, { useState } from 'react';
import { TrendingUp, Settings } from 'lucide-react';
import SubTabs from './SubTabs';
import CategoryManagerContent from './CategoryManagerContent';
import CategoryFormDialog from './CategoryFormDialog';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { useCategoryManager } from '@/hooks/useCategoryManager';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';

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

  const {
    isLoading,
    incomeCategories,
    expenseCategories,
    handleToggleCategory,
    handleSaveCategory,
    handleDeleteCategory
  } = useCategoryManager();

  const { confirmationDialog, openConfirmationDialog, closeConfirmationDialog } = useConfirmationDialog();

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

  const handleDeleteCategoryWithConfirmation = (id: number, type: 'income' | 'expense', categoryName: string) => {
    openConfirmationDialog(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a categoria "${categoryName}"? Esta ação não pode ser desfeita.`,
      async () => {
        await handleDeleteCategory(id, type);
        closeConfirmationDialog();
      }
    );
  };

  const handleSaveCategoryWrapper = async (categoryData: any) => {
    await handleSaveCategory(categoryData, dialogType, editingCategory);
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

      <CategoryManagerContent
        activeSubTab={activeSubTab}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategoryWithConfirmation}
        onToggleCategory={handleToggleCategory}
      />

      <CategoryFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveCategoryWrapper}
        type={dialogType}
        category={editingCategory}
      />

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={closeConfirmationDialog}
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
