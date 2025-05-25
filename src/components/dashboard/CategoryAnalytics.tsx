
import React from 'react';
import { motion } from 'framer-motion';
import FinancialChart from '@/components/charts/FinancialChart';

interface Category {
  id: number;
  name: string;
  active: boolean;
  color: string;
  description?: string;
}

interface CategoryAnalyticsProps {
  incomeCategories: Category[];
  expenseCategories: Category[];
}

const CategoryAnalytics: React.FC<CategoryAnalyticsProps> = ({
  incomeCategories,
  expenseCategories
}) => {
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

  return (
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
  );
};

export default CategoryAnalytics;
