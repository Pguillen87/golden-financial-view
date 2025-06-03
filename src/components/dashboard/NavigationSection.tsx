
import React from 'react';
import NavigationCards from './NavigationCards';
import CategoryAnalytics from './CategoryAnalytics';
import TransactionsManager from './TransactionsManager';
import GoalsManager from './GoalsManager';
import CategoryManager from './CategoryManager';
import PaymentMethodManager from './PaymentMethodManager';

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
  const [activeSection, setActiveSection] = React.useState('analytics');

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'analytics':
        return (
          <CategoryAnalytics
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            dateRange={dateRange}
          />
        );
      case 'transactions':
        return (
          <TransactionsManager
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            dateRange={dateRange}
          />
        );
      case 'goals':
        return <GoalsManager />;
      case 'categories':
        return <CategoryManager />;
      case 'payments':
        return <PaymentMethodManager />;
      default:
        return (
          <CategoryAnalytics
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            dateRange={dateRange}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <NavigationCards onSectionChange={handleSectionChange} />
      {renderActiveSection()}
    </div>
  );
};

export default NavigationSection;
