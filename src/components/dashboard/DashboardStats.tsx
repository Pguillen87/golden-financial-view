
import React from 'react';
import StatsCards from './StatsCards';

interface DashboardStatsProps {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  selectedMonth: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalEntradas,
  totalSaidas,
  saldo,
  selectedMonth
}) => {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#FFD700]">
        Resumo Financeiro
      </h2>
      <StatsCards
        totalEntradas={totalEntradas}
        totalSaidas={totalSaidas}
        saldo={saldo}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};

export default DashboardStats;
