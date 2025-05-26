
import React from 'react';
import { motion } from 'framer-motion';
import CategoryAnalytics from './CategoryAnalytics';
import CategoryList from './CategoryList';

interface Category {
  id: number;
  name: string;
  active: boolean;
  color: string;
  description?: string;
}

interface CategoryManagerContentProps {
  activeSubTab: string;
  incomeCategories: Category[];
  expenseCategories: Category[];
  onAddCategory: (type: 'income' | 'expense') => void;
  onEditCategory: (category: Category, type: 'income' | 'expense') => void;
  onDeleteCategory: (id: number, type: 'income' | 'expense', categoryName: string) => void;
  onToggleCategory: (id: number, type: 'income' | 'expense') => void;
}

const CategoryManagerContent: React.FC<CategoryManagerContentProps> = ({
  activeSubTab,
  incomeCategories,
  expenseCategories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onToggleCategory
}) => {
  return (
    <motion.div
      key={activeSubTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {activeSubTab === 'analisar' && (
        <CategoryAnalytics />
      )}

      {activeSubTab === 'gerenciar' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CategoryList 
            title="Categorias de Receita" 
            categories={incomeCategories} 
            type="income"
            onAddCategory={onAddCategory}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            onToggleCategory={onToggleCategory}
          />
          <CategoryList 
            title="Categorias de Despesa" 
            categories={expenseCategories} 
            type="expense"
            onAddCategory={onAddCategory}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            onToggleCategory={onToggleCategory}
          />
        </div>
      )}
    </motion.div>
  );
};

export default CategoryManagerContent;
