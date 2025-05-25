
import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { TrendingUp, TrendingDown, DollarSign, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatsCardsProps {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  selectedMonth: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalEntradas,
  totalSaidas,
  saldo,
  selectedMonth,
}) => {
  const { theme } = useTheme();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formatCurrency = (value: number) => {
    return isBalanceVisible 
      ? `R$ ${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      : 'R$ ***,**';
  };

  const getStatCard = (
    title: string,
    value: number,
    icon: React.ElementType,
    color: 'green' | 'red' | 'blue',
    trend?: 'up' | 'down',
    showToggle = false
  ) => {
    const colorClasses = {
      green: theme === 'dark' 
        ? 'from-green-600 to-green-800 text-white' 
        : 'from-green-500 to-green-700 text-white',
      red: theme === 'dark'
        ? 'from-red-600 to-red-800 text-white'
        : 'from-red-500 to-red-700 text-white',
      blue: saldo >= 0
        ? (theme === 'dark' ? 'from-blue-600 to-blue-800 text-white' : 'from-blue-500 to-blue-700 text-white')
        : (theme === 'dark' ? 'from-red-600 to-red-800 text-white' : 'from-red-500 to-red-700 text-white')
    };

    const IconComponent = icon;

    return (
      <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br ${colorClasses[color]}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20">
              <IconComponent className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          {showToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBalanceVisibility}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              aria-label={isBalanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
            >
              {isBalanceVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-3xl font-bold">
            {showToggle ? formatCurrency(value) : `R$ ${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90">
              {selectedMonth}
            </span>
            {trend && (
              <div className="flex items-center gap-1">
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm opacity-90">
                  {trend === 'up' ? 'Positivo' : 'Negativo'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {getStatCard('Total de Entradas', totalEntradas, TrendingUp, 'green', 'up')}
      {getStatCard('Total de Saídas', totalSaidas, TrendingDown, 'red', 'down')}
      {getStatCard('Saldo Atual', saldo, DollarSign, 'blue', saldo >= 0 ? 'up' : 'down', true)}
    </div>
  );
};

export default StatsCards;
