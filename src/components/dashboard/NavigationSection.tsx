
import React from 'react';
import NavigationCard from './NavigationCard';
import { Settings } from 'lucide-react';

interface NavigationSectionProps {
  selectedMonth?: number;
  selectedYear?: number;
  dateRange?: any;
}

const NavigationSection: React.FC<NavigationSectionProps> = ({
  selectedMonth,
  selectedYear,
  dateRange
}) => {
  const [activeCard, setActiveCard] = React.useState('management');

  const handleCardClick = (cardId: string) => {
    setActiveCard(cardId);
  };

  return (
    <div className="space-y-6">
      <NavigationCard
        icon={Settings}
        gradient="from-purple-500 to-pink-500"
        isActive={activeCard === 'management'}
        onClick={() => handleCardClick('management')}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        dateRange={dateRange}
      />
    </div>
  );
};

export default NavigationSection;
