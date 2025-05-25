
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-md font-semibold ${
          type === 'income' ? 'text-green-400' : 'text-red-400'
        }`}>
          {title}
        </h3>
        <Button 
          size="sm" 
          onClick={() => handleAddCategory(type)}
          className="bg-[#FFD700] hover:bg-[#E6C200] text-black"
        >
          <Plus className="h-3 w-3 mr-1" />
          Nova
        </Button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="flex items-center justify-between p-2 bg-gray-800 rounded-lg border border-gray-600"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              <div>
                <span className="text-white text-sm font-medium">{category.name}</span>
                {category.description && (
                  <p className="text-xs text-gray-400">{category.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CategoryToggleSwitch 
                checked={category.active}
                onCheckedChange={() => handleToggleCategory(category.id, type)}
              />
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleEditCategory(category, type)}
                className="text-gray-400 hover:text-white p-1 h-6 w-6"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleDeleteCategory(category.id, type)}
                className="text-red-400 hover:text-red-300 p-1 h-6 w-6"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700 rounded-lg">
          <TabsTrigger 
            value="analisar" 
            className="text-gray-300 data-[state=active]:bg-[#1a365d] data-[state=active]:text-[#FFD700] rounded-md mx-1"
          >
            Analisar
          </TabsTrigger>
          <TabsTrigger 
            value="gerenciar" 
            className="text-gray-300 data-[state=active]:bg-[#1a365d] data-[state=active]:text-[#FFD700] rounded-md mx-1"
          >
            Gerenciar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analisar" className="mt-4">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-[#FFD700] mb-3">
              Análise por Categorias
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Distribuição de suas receitas e despesas por categoria.
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div>
                <h4 className="text-md font-semibold text-green-400 mb-3">
                  Receitas por Categoria
                </h4>
                <div className="bg-gray-800 rounded-lg p-3 h-80">
                  <FinancialChart
                    data={incomeData}
                    type="pie"
                    title=""
                    dataKey="value"
                    nameKey="name"
                    showPercentage={true}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-red-400 mb-3">
                  Despesas por Categoria
                </h4>
                <div className="bg-gray-800 rounded-lg p-3 h-80">
                  <FinancialChart
                    data={expenseData}
                    type="pie"
                    title=""
                    dataKey="value"
                    nameKey="name"
                    showPercentage={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gerenciar" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
        </TabsContent>
      </Tabs>

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
