
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialChart from '@/components/charts/FinancialChart';

const CategoryManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('analisar');

  // Dados mock para demonstração
  const incomeCategories = [
    { id: 1, name: 'Freelancer', active: true },
    { id: 2, name: 'Salário', active: true },
    { id: 3, name: 'Investimentos', active: false },
  ];

  const expenseCategories = [
    { id: 1, name: 'Aluguel', active: true },
    { id: 2, name: 'Mercado', active: true },
    { id: 3, name: 'Transporte', active: false },
  ];

  const incomeData = [
    { name: 'Freelancer', value: 3000 },
    { name: 'Salário', value: 5000 },
    { name: 'Investimentos', value: 800 },
  ];

  const expenseData = [
    { name: 'Aluguel', value: 1200 },
    { name: 'Mercado', value: 800 },
    { name: 'Transporte', value: 300 },
  ];

  const CategoryList = ({ title, categories, type }: { 
    title: string; 
    categories: any[]; 
    type: 'income' | 'expense' 
  }) => (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-lg font-semibold ${
          type === 'income' ? 'text-green-400' : 'text-red-400'
        }`}>
          {title}
        </h3>
        <Button 
          size="sm" 
          className="bg-[#4299e1] hover:bg-[#3182ce] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova
        </Button>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                type === 'income' ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className="text-white font-medium">{category.name}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Switch 
                checked={category.active} 
                className="data-[state=checked]:bg-[#4299e1]"
              />
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-gray-700">
          <TabsTrigger 
            value="analisar" 
            className="text-gray-300 data-[state=active]:bg-[#1a365d] data-[state=active]:text-[#4299e1]"
          >
            Analisar
          </TabsTrigger>
          <TabsTrigger 
            value="gerenciar" 
            className="text-gray-300 data-[state=active]:bg-[#1a365d] data-[state=active]:text-[#4299e1]"
          >
            Gerenciar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analisar" className="mt-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-[#FFD700] mb-4">
              Análise por Categorias
            </h3>
            <p className="text-gray-400 mb-6">
              Distribuição de suas receitas e despesas por categoria.
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-4">
                  Receitas por Categoria
                </h4>
                <div className="bg-gray-800 rounded-lg p-4">
                  <FinancialChart
                    data={incomeData}
                    type="pie"
                    title=""
                    dataKey="value"
                    nameKey="name"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-4">
                  Despesas por Categoria
                </h4>
                <div className="bg-gray-800 rounded-lg p-4">
                  <FinancialChart
                    data={expenseData}
                    type="pie"
                    title=""
                    dataKey="value"
                    nameKey="name"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gerenciar" className="mt-6">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#FFD700] mb-2">
                Gerenciar Categorias
              </h3>
              <p className="text-gray-400">
                Adicione, edite, ative/desative ou exclua suas categorias.
              </p>
            </div>

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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryManager;
