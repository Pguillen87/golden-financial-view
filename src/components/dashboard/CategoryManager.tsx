import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, TrendingUp, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import FinancialChart from '@/components/charts/FinancialChart';
import CategoryFormDialog from './CategoryFormDialog';
import CategoryToggleSwitch from './CategoryToggleSwitch';

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

  const incomeData = incomeCategories.map(cat => ({
    name: cat.name,
    value: Math.random() * 5000 + 1000,
    color: cat.color
  }));

  const expenseData = expenseCategories.map(cat => ({
    name: cat.name,
    value: Math.random() * 3000 + 500,
    color: cat.color
  }));

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

  const handleDeleteCategory = (id: number, type: 'income' | 'expense') => {
    if (type === 'income') {
      setIncomeCategories(prev => prev.filter(cat => cat.id !== id));
    } else {
      setExpenseCategories(prev => prev.filter(cat => cat.id !== id));
    }
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

  const CategoryList = ({ title, categories, type }: { 
    title: string; 
    categories: Category[]; 
    type: 'income' | 'expense' 
  }) => (
    <motion.div 
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-lg font-semibold bg-gradient-to-r ${
          type === 'income' ? 'from-green-400 to-emerald-400' : 'from-red-400 to-pink-400'
        } bg-clip-text text-transparent`}>
          {title}
        </h3>
        <Button 
          size="sm" 
          onClick={() => handleAddCategory(type)}
          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#E6C200] hover:to-[#FF8C00] text-black font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova
        </Button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {categories.map((category, index) => (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full shadow-sm" 
                style={{ backgroundColor: category.color }}
              />
              <div>
                <span className="text-white text-sm font-medium">{category.name}</span>
                {category.description && (
                  <p className="text-xs text-gray-400 mt-1">{category.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
              <CategoryToggleSwitch 
                checked={category.active}
                onCheckedChange={() => handleToggleCategory(category.id, type)}
              />
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleEditCategory(category, type)}
                className="text-gray-400 hover:text-white p-2 h-8 w-8 rounded-lg hover:bg-white/10"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleDeleteCategory(category.id, type)}
                className="text-red-400 hover:text-red-300 p-2 h-8 w-8 rounded-lg hover:bg-red-500/10"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Sub-tabs modernas */}
      <div className="flex justify-center">
        <div className="flex bg-black/30 rounded-2xl p-1 backdrop-blur-sm border border-gray-700/50">
          {subTabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`
                relative py-3 px-6 text-sm font-medium rounded-xl
                transition-all duration-300 flex items-center gap-2
                ${activeSubTab === tab.id 
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg` 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Conteúdo das sub-tabs */}
      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeSubTab === 'analisar' && (
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-[#FFD700] mb-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Análise por Categorias
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              Distribuição de suas receitas e despesas por categoria.
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h4 className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                  Receitas por Categoria
                </h4>
                <div className="bg-black/20 rounded-2xl p-4 h-80 border border-gray-600/20">
                  <FinancialChart
                    data={incomeData}
                    type="pie"
                    title=""
                    dataKey="value"
                    nameKey="name"
                    showPercentage={true}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h4 className="text-lg font-semibold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  Despesas por Categoria
                </h4>
                <div className="bg-black/20 rounded-2xl p-4 h-80 border border-gray-600/20">
                  <FinancialChart
                    data={expenseData}
                    type="pie"
                    title=""
                    dataKey="value"
                    nameKey="name"
                    showPercentage={true}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeSubTab === 'gerenciar' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CategoryList 
              title="Categorias de Receita" 
              categories={incomeCategories} 
              type="income" 
            />
            <CategoryList 
              title="Categorias de Despesa" 
              categories={expenseCategories} 
              type="expense" 
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
    </div>
  );
};

export default CategoryManager;
