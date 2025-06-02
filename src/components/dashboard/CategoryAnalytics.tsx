
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import FinancialChart from '@/components/charts/FinancialChart';
import ChartLegendToggle from './ChartLegendToggle';

interface CategoryAnalyticsProps {
  selectedMonth?: number;
  selectedYear?: number;
  dateRange?: any;
}

const CategoryAnalytics: React.FC<CategoryAnalyticsProps> = ({
  selectedMonth,
  selectedYear,
  dateRange
}) => {
  const { cliente } = useAuth();
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showIncomeLegend, setShowIncomeLegend] = useState(true);
  const [showExpenseLegend, setShowExpenseLegend] = useState(true);

  useEffect(() => {
    if (cliente) {
      fetchCategoryData();
    }
  }, [cliente, selectedMonth, selectedYear, dateRange]);

  const fetchCategoryData = async () => {
    if (!cliente) return;

    setIsLoading(true);
    try {
      let startDate: string;
      let endDate: string;

      if (dateRange?.from && dateRange?.to) {
        startDate = dateRange.from.toISOString().split('T')[0];
        endDate = dateRange.to.toISOString().split('T')[0];
      } else if (selectedMonth && selectedYear) {
        startDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`;
        const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
        const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
        endDate = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;
      } else {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        endDate = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;
      }

      console.log('Buscando dados de categorias do período:', startDate, 'até', endDate);

      // Buscar dados de entrada com join nas categorias
      const { data: incomeResults, error: incomeError } = await supabase
        .from('financeiro_entradas')
        .select(`
          valor,
          financeiro_categorias_entrada!inner(nome, cor)
        `)
        .eq('cliente_id', cliente.id)
        .gte('data', startDate)
        .lt('data', endDate);

      // Buscar dados de saída com join nas categorias
      const { data: expenseResults, error: expenseError } = await supabase
        .from('financeiro_saidas')
        .select(`
          valor,
          financeiro_categorias_saida!inner(nome, cor)
        `)
        .eq('cliente_id', cliente.id)
        .gte('data', startDate)
        .lt('data', endDate);

      if (incomeError) {
        console.error('Erro ao buscar entradas:', incomeError);
      }
      if (expenseError) {
        console.error('Erro ao buscar saídas:', expenseError);
      }

      // Processar dados de entrada
      const incomeByCategory = new Map();
      incomeResults?.forEach(item => {
        const categoryName = item.financeiro_categorias_entrada?.nome || 'Sem categoria';
        const categoryColor = item.financeiro_categorias_entrada?.cor || '#22c55e';
        const currentValue = incomeByCategory.get(categoryName) || { value: 0, color: categoryColor };
        incomeByCategory.set(categoryName, {
          value: currentValue.value + Number(item.valor),
          color: categoryColor
        });
      });

      // Processar dados de saída
      const expenseByCategory = new Map();
      expenseResults?.forEach(item => {
        const categoryName = item.financeiro_categorias_saida?.nome || 'Sem categoria';
        const categoryColor = item.financeiro_categorias_saida?.cor || '#ef4444';
        const currentValue = expenseByCategory.get(categoryName) || { value: 0, color: categoryColor };
        expenseByCategory.set(categoryName, {
          value: currentValue.value + Number(item.valor),
          color: categoryColor
        });
      });

      // Converter para array para os gráficos
      const incomeChartData = Array.from(incomeByCategory.entries()).map(([name, data]) => ({
        name,
        value: data.value,
        fill: data.color
      }));

      const expenseChartData = Array.from(expenseByCategory.entries()).map(([name, data]) => ({
        name,
        value: data.value,
        fill: data.color
      }));

      console.log('Dados de receitas por categoria:', incomeChartData);
      console.log('Dados de despesas por categoria:', expenseChartData);

      setIncomeData(incomeChartData);
      setExpenseData(expenseChartData);
    } catch (error) {
      console.error('Erro ao carregar dados de categoria:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">Carregando análise por categorias...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-2 text-[#FFD700]">
          Análise por Categorias
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Distribuição de suas receitas e despesas por categoria.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gráfico de Receitas */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-green-400">
              Receitas por Categoria
            </h3>
            <ChartLegendToggle 
              showLegend={showIncomeLegend}
              onToggle={() => setShowIncomeLegend(!showIncomeLegend)}
            />
          </div>
          
          {incomeData.length > 0 ? (
            <FinancialChart
              pieData={incomeData}
              type="pie"
              showLegend={showIncomeLegend}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              Nenhuma receita encontrada no período
            </div>
          )}
        </div>

        {/* Gráfico de Despesas */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-red-400">
              Despesas por Categoria
            </h3>
            <ChartLegendToggle 
              showLegend={showExpenseLegend}
              onToggle={() => setShowExpenseLegend(!showExpenseLegend)}
            />
          </div>
          
          {expenseData.length > 0 ? (
            <FinancialChart
              pieData={expenseData}
              type="pie"
              showLegend={showExpenseLegend}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              Nenhuma despesa encontrada no período
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryAnalytics;
