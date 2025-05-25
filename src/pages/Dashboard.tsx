import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import FinancialChart from '@/components/charts/FinancialChart';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import MovableCard from '@/components/dashboard/MovableCard';
import FilterCard from '@/components/dashboard/FilterCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import FloatingActionButtons from '@/components/dashboard/FloatingActionButtons';
import NavigationCard from '@/components/dashboard/NavigationCard';

interface FinanceiroEntrada {
  id: number;
  valor: number;
  data: string;
  categoria_id: number;
  descricao: string;
}

interface FinanceiroSaida {
  id: number;
  valor: number;
  data: string;
  categoria_id: number;
  descricao: string;
}

const Dashboard = () => {
  const { cliente } = useAuth();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [entradas, setEntradas] = useState<FinanceiroEntrada[]>([]);
  const [saidas, setSaidas] = useState<FinanceiroSaida[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set());
  const [showHiddenCards, setShowHiddenCards] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (cliente) {
      fetchFinancialData();
    }
  }, [cliente, selectedMonth, selectedYear, dateRange]);

  const fetchFinancialData = async () => {
    if (!cliente) return;

    setIsLoading(true);
    try {
      let startDate: string;
      let endDate: string;

      if (dateRange?.from && dateRange?.to) {
        startDate = dateRange.from.toISOString().split('T')[0];
        endDate = dateRange.to.toISOString().split('T')[0];
      } else {
        startDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`;
        endDate = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-01`;
      }

      const { data: entradasData, error: entradasError } = await supabase
        .from('financeiro_entradas')
        .select('*')
        .eq('cliente_id', cliente.id)
        .gte('data', startDate)
        .lt('data', endDate);

      if (entradasError) {
        console.error('Erro ao buscar entradas:', entradasError);
      } else {
        setEntradas(entradasData || []);
      }

      const { data: saidasData, error: saidasError } = await supabase
        .from('financeiro_saidas')
        .select('*')
        .eq('cliente_id', cliente.id)
        .gte('data', startDate)
        .lt('data', endDate);

      if (saidasError) {
        console.error('Erro ao buscar saídas:', saidasError);
      } else {
        setSaidas(saidasData || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados financeiros.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const hideCard = (cardId: string) => {
    setHiddenCards(prev => new Set(prev).add(cardId));
  };

  const showCard = (cardId: string) => {
    setHiddenCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
  };

  const totalEntradas = entradas.reduce((total, entrada) => total + Number(entrada.valor), 0);
  const totalSaidas = saidas.reduce((total, saida) => total + Number(saida.valor), 0);
  const saldo = totalEntradas - totalSaidas;

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const chartData = [
    {
      name: months[selectedMonth - 1],
      entradas: totalEntradas,
      saidas: totalSaidas,
    }
  ];

  const saidasPorCategoria = saidas.reduce((acc, saida) => {
    const categoria = `Categoria ${saida.categoria_id}`;
    acc[categoria] = (acc[categoria] || 0) + Number(saida.valor);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(saidasPorCategoria).map(([categoria, valor]) => ({
    name: categoria,
    value: valor,
  }));

  const recentTransactions = [
    { id: 1, description: 'Salário', amount: 5000, date: '2024-05-20', type: 'income' as const },
    { id: 2, description: 'Freelance', amount: 1500, date: '2024-05-18', type: 'income' as const },
    { id: 3, description: 'Aluguel', amount: 1200, date: '2024-05-15', type: 'expense' as const },
    { id: 4, description: 'Mercado', amount: 350, date: '2024-05-14', type: 'expense' as const },
  ];

  if (!cliente) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader
        showHiddenCards={showHiddenCards}
        onToggleHiddenCards={() => setShowHiddenCards(!showHiddenCards)}
      />

      <div className="p-4 md:p-6 space-y-6 md:space-y-8 pb-32">
        {/* Cards de Estatísticas */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#FFD700]">
            Resumo Financeiro
          </h2>
          <StatsCards
            totalEntradas={totalEntradas}
            totalSaidas={totalSaidas}
            saldo={saldo}
            selectedMonth={months[selectedMonth - 1]}
          />
        </div>

        {/* Lançamentos Recentes */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#FFD700]">
            Lançamentos Recentes
          </h2>
          <RecentTransactions transactions={recentTransactions} />
        </div>

        {/* Filtros */}
        <MovableCard
          id="filters"
          title="Filtros de Período"
          isHidden={hiddenCards.has('filters')}
          onHide={() => hideCard('filters')}
          onShow={() => showCard('filters')}
          showControls={showHiddenCards}
        >
          <FilterCard
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            onDateRangeChange={setDateRange}
          />
        </MovableCard>

        {/* Gráficos */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#FFD700]">
            Análises Gráficas
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            <MovableCard
              id="chart-bar"
              title="Receitas vs. Despesas"
              isHidden={hiddenCards.has('chart-bar')}
              onHide={() => hideCard('chart-bar')}
              onShow={() => showCard('chart-bar')}
              showControls={showHiddenCards}
            >
              <FinancialChart
                data={chartData}
                type="bar"
                title=""
              />
            </MovableCard>

            {pieData.length > 0 && (
              <MovableCard
                id="chart-pie"
                title="Despesas por Categoria"
                isHidden={hiddenCards.has('chart-pie')}
                onHide={() => hideCard('chart-pie')}
                onShow={() => showCard('chart-pie')}
                showControls={showHiddenCards}
              >
                <FinancialChart
                  data={pieData}
                  type="pie"
                  title=""
                  dataKey="value"
                  nameKey="name"
                  showToggle={true}
                  incomeData={[]}
                  expenseData={pieData}
                />
              </MovableCard>
            )}
          </div>
        </div>

        {/* Navegação Principal como último card */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#FFD700]">
            Gestão Financeira
          </h2>
          <NavigationCard />
        </div>
      </div>

      {/* Botões Flutuantes */}
      <FloatingActionButtons />
    </div>
  );
};

export default Dashboard;
