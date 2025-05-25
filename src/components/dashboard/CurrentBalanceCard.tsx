
import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurrentBalanceCardProps {
  saldo: number;
  selectedMonth: string;
}

const CurrentBalanceCard: React.FC<CurrentBalanceCardProps> = ({
  saldo,
  selectedMonth,
}) => {
  const { theme } = useTheme();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Saldo Atual
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBalanceVisibility}
              className={`h-6 w-6 p-0 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-black hover:bg-gray-100'
              }`}
              aria-label={isBalanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
            >
              {isBalanceVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </div>
          <h2 className={`text-4xl font-bold ${
            saldo >= 0 
              ? (theme === 'dark' ? 'text-green-400' : 'text-green-600')
              : (theme === 'dark' ? 'text-red-400' : 'text-red-600')
          }`}>
            {isBalanceVisible ? (
              `R$ ${Math.abs(saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            ) : (
              'R$ ***,**'
            )}
          </h2>
        </div>
        <div className="flex items-center">
          <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
            theme === 'dark' 
              ? 'bg-gray-700 text-gray-300' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {selectedMonth}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <span className={`text-sm px-3 py-1 rounded-full ${
          theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
        }`}>
          Filtrar: <span className="font-medium">Este Mês</span>
        </span>
      </div>
    </div>
  );
};

export default CurrentBalanceCard;
