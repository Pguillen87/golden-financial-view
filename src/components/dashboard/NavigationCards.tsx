
import React from 'react';
import NavigationCard from './NavigationCard';
import { BarChart3, Target, FileText } from 'lucide-react';

interface NavigationCardsProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

const NavigationCards: React.FC<NavigationCardsProps> = ({
  onNavigate,
  activeSection
}) => {
  const cards = [
    {
      id: 'categorias',
      title: 'Categorias',
      description: 'Gerencie suas categorias de receitas e despesas',
      icon: BarChart3,
      gradient: 'from-blue-500 to-purple-600',
      isActive: activeSection === 'categorias'
    },
    {
      id: 'metas',
      title: 'Metas',
      description: 'Defina e acompanhe suas metas financeiras',
      icon: Target,
      gradient: 'from-indigo-500 to-blue-600',
      isActive: activeSection === 'metas'
    },
    {
      id: 'lancamentos',
      title: 'Lançamentos',
      description: 'Visualize e gerencie todos os seus lançamentos',
      icon: FileText,
      gradient: 'from-purple-500 to-indigo-600',
      isActive: activeSection === 'lancamentos'
    }
  ];

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#FFD700]">
        Central de Controle
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card) => (
          <NavigationCard
            key={card.id}
            title={card.title}
            description={card.description}
            icon={card.icon}
            gradient={card.gradient}
            onClick={() => onNavigate(card.id)}
            isActive={card.isActive}
          />
        ))}
      </div>
    </div>
  );
};

export default NavigationCards;
