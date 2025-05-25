
import React from 'react';
import FinancialChart from '@/components/charts/FinancialChart';
import MovableCard from './MovableCard';

interface ChartsSectionProps {
  chartData: any[];
  pieData: any[];
  hiddenCards: Set<string>;
  onHideCard: (cardId: string) => void;
  onShowCard: (cardId: string) => void;
  showHiddenCards: boolean;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  chartData,
  pieData,
  hiddenCards,
  onHideCard,
  onShowCard,
  showHiddenCards
}) => {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#FFD700]">
        Análises Gráficas
      </h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <MovableCard
          id="chart-bar"
          title="Receitas vs. Despesas"
          isHidden={hiddenCards.has('chart-bar')}
          onHide={() => onHideCard('chart-bar')}
          onShow={() => onShowCard('chart-bar')}
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
            onHide={() => onHideCard('chart-pie')}
            onShow={() => onShowCard('chart-pie')}
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
  );
};

export default ChartsSection;
