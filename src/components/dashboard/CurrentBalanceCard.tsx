
import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Eye, Settings } from 'lucide-react';
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

  return (
    <div className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900/90 border border-yellow-400/30' 
        : 'bg-white/90 border border-blue-300'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Saldo Atual
            </span>
            <Eye className={`h-4 w-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <h2 className={`text-4xl font-bold ${
            saldo >= 0 
              ? (theme === 'dark' ? 'text-green-400' : 'text-green-600')
              : (theme === 'dark' ? 'text-red-400' : 'text-red-600')
          }`}>
            R$ {Math.abs(saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
            theme === 'dark' 
              ? 'bg-gray-800 text-gray-300' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {selectedMonth}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-black hover:bg-gray-200'
            }`}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <span className={`text-sm px-3 py-1 rounded-full ${
          theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
        }`}>
          Filtrar: <span className="font-medium">Este Mês</span>
        </span>
      </div>
    </div>
  );
};

export default CurrentBalanceCard;
