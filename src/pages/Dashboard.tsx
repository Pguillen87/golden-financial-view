
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, Sun, Moon, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const { cliente, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
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

  if (!cliente) {
    navigate('/login');
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-black text-yellow-400' 
        : 'bg-gradient-to-br from-blue-50 to-white text-blue-900'
    }`}>
      {/* Header */}
      <header className={`p-6 shadow-lg transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900 border-b border-yellow-400/20' 
          : 'bg-white border-b border-blue-200'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
            <p className="text-lg mt-1">Bem-vindo, {cliente.nome}!</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className={`${
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
              className={`${
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

      <div className="p-6">
        {/* Filtros */}
        <div className={`p-6 rounded-2xl shadow-lg mb-6 transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-900 border border-yellow-400/20' 
            : 'bg-white border border-blue-200'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Filtros</h2>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className={`p-3 rounded-lg text-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-yellow-400/30 text-yellow-400' 
                  : 'bg-blue-50 border-blue-300 text-blue-900'
              }`}
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={`p-3 rounded-lg text-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-yellow-400/30 text-yellow-400' 
                  : 'bg-blue-50 border-blue-300 text-blue-900'
              }`}
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-green-400/20' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-700'
            }`}>
              Total de Entradas
            </h3>
            <p className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-green-400' : 'text-green-700'
            }`}>
              R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-red-400/20' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-700'
            }`}>
              Total de Saídas
            </h3>
            <p className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-red-400' : 'text-red-700'
            }`}>
              R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-blue-400/20' 
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
            }`}>
              Saldo
            </h3>
            <p className={`text-3xl font-bold ${
              saldo >= 0 
                ? theme === 'dark' ? 'text-green-400' : 'text-green-700'
                : theme === 'dark' ? 'text-red-400' : 'text-red-700'
            }`}>
              R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Listas de Transações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Entradas */}
          <div className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-yellow-400/20' 
              : 'bg-white border border-blue-200'
          }`}>
            <h3 className="text-xl font-semibold mb-4">Últimas Entradas</h3>
            {isLoading ? (
              <p>Carregando...</p>
            ) : entradas.length > 0 ? (
              <div className="space-y-3">
                {entradas.slice(0, 5).map((entrada) => (
                  <div key={entrada.id} className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-green-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{entrada.descricao}</span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-700'
                      }`}>
                        +R$ {Number(entrada.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <p className="text-sm opacity-70">{new Date(entrada.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 opacity-70">Nenhuma entrada encontrada neste período.</p>
            )}
          </div>

          {/* Saídas */}
          <div className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-yellow-400/20' 
              : 'bg-white border border-blue-200'
          }`}>
            <h3 className="text-xl font-semibold mb-4">Últimas Saídas</h3>
            {isLoading ? (
              <p>Carregando...</p>
            ) : saidas.length > 0 ? (
              <div className="space-y-3">
                {saidas.slice(0, 5).map((saida) => (
                  <div key={saida.id} className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-red-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{saida.descricao}</span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-700'
                      }`}>
                        -R$ {Number(saida.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <p className="text-sm opacity-70">{new Date(saida.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 opacity-70">Nenhuma saída encontrada neste período.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
