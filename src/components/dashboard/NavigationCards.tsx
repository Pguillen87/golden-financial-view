
import React, { useState } from 'react';
import NavigationCard from './NavigationCard';
import { 
  TrendingUp, 
  FileText, 
  Target, 
  Settings,
  CreditCard
} from 'lucide-react';

interface NavigationCardsProps {
  onSectionChange: (section: string) => void;
}

const NavigationCards: React.FC<NavigationCardsProps> = ({ onSectionChange }) => {
  const [activeCard, setActiveCard] = useState('analytics');

  const handleCardClick = (cardId: string) => {
    setActiveCard(cardId);
    onSectionChange(cardId);
  };

  const cards = [
    {
      id: 'analytics',
      title: 'Análise por Categorias',
      description: 'Visualize gráficos detalhados das suas receitas e despesas organizados por categoria.',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-500'
    },
    {
      id: 'transactions',
      title: 'Gerenciar Lançamentos',
      description: 'Adicione, edite e visualize todas as suas transações financeiras.',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'goals',
      title: 'Metas Financeiras',
      description: 'Defina e acompanhe o progresso das suas metas de economia e receita.',
      icon: Target,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'categories',
      title: 'Gerenciar Categorias',
      description: 'Organize suas finanças criando e personalizando categorias.',
      icon: Settings,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'payments',
      title: 'Formas de Pagamento',
      description: 'Configure e gerencie as formas de pagamento disponíveis.',
      icon: CreditCard,
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => (
        <NavigationCard
          key={card.id}
          icon={card.icon}
          gradient={card.gradient}
          isActive={activeCard === card.id}
          onClick={() => handleCardClick(card.id)}
        />
      ))}
    </div>
  );
};

export default NavigationCards;
