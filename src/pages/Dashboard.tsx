import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/integrations/supabase/client';
import { Filter, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FinancialChart from '@/components/charts/FinancialChart';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CurrentBalanceCard from '@/components/dashboard/CurrentBalanceCard';
import ModernStatsCard from '@/components/dashboard/ModernStatsCard';
import MovableCard from '@/components/dashboard/MovableCard';

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

  useEffect(() => {
    if (cliente) {
      fetchFinancialData();
    }
  }, [cliente, selectedMonth, selectedYear]);

  const fetchFinancialData = async () => {
    if (!cliente) return;

    setIsLoading(true);
    try {
      const { data: entradasData, error: entradasError } = await supabase
        .from('financeiro_entradas')
        .select('*')
        .eq('cliente_id', cliente.id)
        .gte('data', `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`)
        .lt('data', `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-01`);

      if (entradasError) {
        console.error('Erro ao buscar entradas:', entradasError);
      } else {
        setEntradas(entradasData || []);
      }

      const { data: saidasData, error: saidasError } = await supabase
        .from('financeiro_saidas')
        .select('*')
        .eq('cliente_id', cliente.id)
        .gte('data', `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`)
        .lt('data', `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-01`);

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

  if (!cliente) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    }`}>
      <DashboardHeader
        showHiddenCards={showHiddenCards}
        onToggleHiddenCards={() => setShowHiddenCards(!showHiddenCards)}
      />

      <div className="p-6 space-y-8">
        {/* Saldo Atual */}
        <CurrentBalanceCard 
          saldo={saldo} 
          selectedMonth={months[selectedMonth - 1]} 
        />

        {/* Filtros */}
        <MovableCard
          id="filters"
          title="Filtros"
          isHidden={hiddenCards.has('filters')}
          onHide={() => hideCard('filters')}
          onShow={() => showCard('filters')}
          showControls={showHiddenCards}
        >
          <div className="flex items-center gap-4 mb-4">
            <Filter className={`h-6 w-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'}`} />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className={`p-3 rounded-xl text-lg transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-yellow-400/30 text-yellow-400 focus:border-yellow-400' 
                  : 'bg-blue-50 border-blue-300 text-blue-900 focus:border-blue-500'
              }`}
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={`p-3 rounded-xl text-lg transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-yellow-400/30 text-yellow-400 focus:border-yellow-400' 
                  : 'bg-blue-50 border-blue-300 text-blue-900 focus:border-blue-500'
              }`}
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </MovableCard>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MovableCard
            id="receitas"
            title="Receitas"
            isHidden={hiddenCards.has('receitas')}
            onHide={() => hideCard('receitas')}
            onShow={() => showCard('receitas')}
            showControls={showHiddenCards}
          >
            <ModernStatsCard
              title="Total de Entradas"
              value={`R$ ${totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={TrendingUp}
              color="green"
              trend="up"
              subtitle="Receitas do mês"
            />
          </MovableCard>

          <MovableCard
            id="despesas"
            title="Despesas"
            isHidden={hiddenCards.has('despesas')}
            onHide={() => hideCard('despesas')}
            onShow={() => showCard('despesas')}
            showControls={showHiddenCards}
          >
            <ModernStatsCard
              title="Total de Saídas"
              value={`R$ ${totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={TrendingDown}
              color="red"
              trend="down"
              subtitle="Despesas do mês"
            />
          </MovableCard>

          <MovableCard
            id="saldo"
            title="Saldo"
            isHidden={hiddenCards.has('saldo')}
            onHide={() => hideCard('saldo')}
            onShow={() => showCard('saldo')}
            showControls={showHiddenCards}
          >
            <ModernStatsCard
              title="Saldo Atual"
              value={`R$ ${Math.abs(saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={DollarSign}
              color={saldo >= 0 ? 'blue' : 'red'}
              trend={saldo >= 0 ? 'up' : 'down'}
              subtitle={saldo >= 0 ? 'Positivo' : 'Negativo'}
            />
          </MovableCard>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MovableCard
            id="chart-bar"
            title="Receitas vs. Despesas por Mês"
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
              />
            </MovableCard>
          )}
        </div>

        {/* Tendências Mensais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MovableCard
            id="evolucao-receitas"
            title="Evolução das Receitas"
            isHidden={hiddenCards.has('evolucao-receitas')}
            onHide={() => hideCard('evolucao-receitas')}
            onShow={() => showCard('evolucao-receitas')}
            showControls={showHiddenCards}
          >
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Tendência de suas receitas mensais.
            </p>
            <FinancialChart
              data={[{ name: months[selectedMonth - 1], value: totalEntradas }]}
              type="line"
              title=""
              dataKey="value"
              nameKey="name"
            />
          </MovableCard>

          <MovableCard
            id="evolucao-despesas"
            title="Evolução das Despesas"
            isHidden={hiddenCards.has('evolucao-despesas')}
            onHide={() => hideCard('evolucao-despesas')}
            onShow={() => showCard('evolucao-despesas')}
            showControls={showHiddenCards}
          >
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Tendência de suas despesas mensais.
            </p>
            <FinancialChart
              data={[{ name: months[selectedMonth - 1], value: totalSaidas }]}
              type="line"
              title=""
              dataKey="value"
              nameKey="name"
            />
          </MovableCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
