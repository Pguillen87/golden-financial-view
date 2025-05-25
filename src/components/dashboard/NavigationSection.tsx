
import React from 'react';
import { DateRange } from 'react-day-picker';
import NavigationCard from './NavigationCard';

interface NavigationSectionProps {
  selectedMonth?: number;
  selectedYear?: number;
  dateRange?: DateRange;
}

const NavigationSection: React.FC<NavigationSectionProps> = ({
  selectedMonth,
  selectedYear,
  dateRange
}) => {
  return (
    <NavigationCard 
      selectedMonth={selectedMonth}
      selectedYear={selectedYear}
      dateRange={dateRange}
    />
  );
};

export default NavigationSection;
