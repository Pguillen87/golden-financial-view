
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentTransactionsSection from '@/components/dashboard/RecentTransactionsSection';
import FiltersSection from '@/components/dashboard/FiltersSection';
import ChartsSection from '@/components/dashboard/ChartsSection';
import NavigationSection from '@/components/dashboard/NavigationSection';
import FloatingActionButtons from '@/components/dashboard/FloatingActionButtons';

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
        <DashboardStats
          totalEntradas={totalEntradas}
          totalSaidas={totalSaidas}
          saldo={saldo}
          selectedMonth={months[selectedMonth - 1]}
        />

        <RecentTransactionsSection transactions={recentTransactions} />

        <FiltersSection
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          onDateRangeChange={setDateRange}
          hiddenCards={hiddenCards}
          onHideCard={hideCard}
          onShowCard={showCard}
          showHiddenCards={showHiddenCards}
        />

        <ChartsSection
          chartData={chartData}
          pieData={pieData}
          hiddenCards={hiddenCards}
          onHideCard={hideCard}
          onShowCard={showCard}
          showHiddenCards={showHiddenCards}
        />

        <NavigationSection />
      </div>

      <FloatingActionButtons />
    </div>
  );
};

export default Dashboard;
