
import React from 'react';
import { DateRange } from 'react-day-picker';
import MovableCard from './MovableCard';
import FilterCard from './FilterCard';

interface FiltersSectionProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  hiddenCards: Set<string>;
  onHideCard: (cardId: string) => void;
  onShowCard: (cardId: string) => void;
  showHiddenCards: boolean;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onDateRangeChange,
  hiddenCards,
  onHideCard,
  onShowCard,
  showHiddenCards
}) => {
  return (
    <MovableCard
      id="filters"
      title="Filtros de Período"
      isHidden={hiddenCards.has('filters')}
      onHide={() => onHideCard('filters')}
      onShow={() => onShowCard('filters')}
      showControls={showHiddenCards}
    >
      <FilterCard
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
        onDateRangeChange={onDateRangeChange}
      />
    </MovableCard>
  );
};

export default FiltersSection;
