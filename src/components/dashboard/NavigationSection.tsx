
import React from 'react';
import NavigationCard from './NavigationCard';

const NavigationSection: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#FFD700]">
        Gestão Financeira
      </h2>
      <NavigationCard />
    </div>
  );
};

export default NavigationSection;
