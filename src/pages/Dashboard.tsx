
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, Sun, Moon, Filter, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import FinancialChart from '@/components/charts/FinancialChart';
import StatsCard from '@/components/charts/StatsCard';

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
  const { cliente, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [entradas, setEntradas] = useState<FinanceiroEntrada[]>([]);
  const [saidas, setSaidas] = useState<FinanceiroSaida[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (cliente) {
      fetchFinancialData();
    }
  }, [cliente, selectedMonth, selectedYear]);

  const fetchFinancialData = async () => {
    if (!cliente) return;

    setIsLoading(true);
    try {
      // Buscar entradas
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

      // Buscar saídas
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

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const totalEntradas = entradas.reduce((total, entrada) => total + Number(entrada.valor), 0);
  const totalSaidas = saidas.reduce((total, saida) => total + Number(saida.valor), 0);
  const saldo = totalEntradas - totalSaidas;

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Preparar dados para gráficos
  const chartData = [
    {
      name: months[selectedMonth - 1],
      entradas: totalEntradas,
      saidas: totalSaidas,
    }
  ];

  // Dados para gráfico de pizza (distribuição de saídas por categoria)
  const saidasPorCategoria = saidas.reduce((acc, saida) => {
    const categoria = `Categoria ${saida.categoria_id}`;
    acc[categoria] = (acc[categoria] || 0) + Number(saida.valor);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(saidasPorCategoria).map(([categoria, valor]) => ({
    name: categoria,
    value: valor,
  }));

  // Dados para gráfico de linha (evolução do saldo)
  const saldoData = [
    { name: 'Saldo Atual', value: saldo },
  ];

  if (!cliente) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    }`}>
      {/* Header */}
      <header className={`p-6 shadow-lg backdrop-blur-sm transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900/80 border-b border-yellow-400/20' 
          : 'bg-white/80 border-b border-blue-200'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-4xl font-bold transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-blue-900'
            }`}>
              Dashboard Financeiro
            </h1>
            <p className={`text-xl mt-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Bem-vindo, <span className={theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'}>{cliente.nome}</span>!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className={`transition-all duration-300 ${
                theme === 'dark' 
                  ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' 
                  : 'border-blue-300 text-blue-600 hover:bg-blue-50'
              }`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className={`transition-all duration-300 ${
                theme === 'dark' 
                  ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-black' 
                  : 'border-red-300 text-red-600 hover:bg-red-50'
              }`}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Filtros */}
        <div className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-900/80 border border-yellow-400/20' 
            : 'bg-white/80 border border-blue-200'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <Filter className={`h-6 w-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'}`} />
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-blue-900'
            }`}>
              Filtros
            </h2>
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
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Entradas"
            value={`R$ ${totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Total de Saídas"
            value={`R$ ${totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={TrendingDown}
            color="red"
          />
          <StatsCard
            title="Saldo"
            value={`R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            changeType={saldo >= 0 ? 'positive' : 'negative'}
            icon={DollarSign}
            color={saldo >= 0 ? 'blue' : 'red'}
          />
          <StatsCard
            title="Categorias Ativas"
            value={Object.keys(saidasPorCategoria).length.toString()}
            icon={PieChart}
            color="yellow"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FinancialChart
            data={chartData}
            type="bar"
            title="Entradas x Saídas"
          />
          {pieData.length > 0 && (
            <FinancialChart
              data={pieData}
              type="pie"
              title="Distribuição por Categoria"
              dataKey="value"
              nameKey="name"
            />
          )}
        </div>

        {/* Evolução do Saldo */}
        <FinancialChart
          data={saldoData}
          type="line"
          title="Evolução do Saldo"
          dataKey="value"
          nameKey="name"
        />

        {/* Transações Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Entradas */}
          <div className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900/80 border border-yellow-400/20' 
              : 'bg-white/80 border border-blue-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-blue-900'
            }`}>
              Últimas Entradas
            </h3>
            {isLoading ? (
              <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Carregando...
              </p>
            ) : entradas.length > 0 ? (
              <div className="space-y-3">
                {entradas.slice(0, 5).map((entrada) => (
                  <div key={entrada.id} className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-green-50 hover:bg-green-100'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {entrada.descricao}
                      </span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-700'
                      }`}>
                        +R$ {Number(entrada.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(entrada.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Nenhuma entrada encontrada neste período.
              </p>
            )}
          </div>

          {/* Saídas */}
          <div className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900/80 border border-yellow-400/20' 
              : 'bg-white/80 border border-blue-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-blue-900'
            }`}>
              Últimas Saídas
            </h3>
            {isLoading ? (
              <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Carregando...
              </p>
            ) : saidas.length > 0 ? (
              <div className="space-y-3">
                {saidas.slice(0, 5).map((saida) => (
                  <div key={saida.id} className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-50 hover:bg-red-100'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {saida.descricao}
                      </span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-700'
                      }`}>
                        -R$ {Number(saida.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(saida.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Nenhuma saída encontrada neste período.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
