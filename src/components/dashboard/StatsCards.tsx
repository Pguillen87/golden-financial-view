
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
    type: 'income' | 'expense' | 'balance',
    showToggle = false
  ) => {
    const IconComponent = icon;

    return (
      <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 border-2 ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-700 hover:border-gold' 
          : 'bg-white border-gray-200 hover:border-navy'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gold/20' : 'bg-navy/10'
            }`}>
              <IconComponent className={`h-6 w-6 ${
                type === 'income' ? 'text-green-500' :
                type === 'expense' ? 'text-red-500' :
                theme === 'dark' ? 'text-gold' : 'text-navy'
              }`} />
            </div>
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{title}</h3>
          </div>
          {showToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBalanceVisibility}
              className={`h-8 w-8 p-0 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-gold hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-navy hover:bg-gray-100'
              }`}
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
          <p className={`text-3xl font-bold ${
            type === 'income' ? 'text-green-500' :
            type === 'expense' ? 'text-red-500' :
            saldo >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {showToggle ? formatCurrency(value) : `R$ ${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </p>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {selectedMonth}
            </span>
            <div className="flex items-center gap-1">
              {type === 'income' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : type === 'expense' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : saldo >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${
                type === 'income' ? 'text-green-500' :
                type === 'expense' ? 'text-red-500' :
                saldo >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {type === 'income' ? 'Positivo' :
                 type === 'expense' ? 'Negativo' :
                 saldo >= 0 ? 'Positivo' : 'Negativo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {getStatCard('Total de Entradas', totalEntradas, TrendingUp, 'income')}
      {getStatCard('Total de Saídas', totalSaidas, TrendingDown, 'expense')}
      {getStatCard('Saldo Atual', saldo, DollarSign, 'balance', true)}
    </div>
  );
};

export default StatsCards;
