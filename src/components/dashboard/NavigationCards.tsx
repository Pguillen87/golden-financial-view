
import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { BarChart3, Target, Plus, List } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const NavigationCards: React.FC = () => {
  const { theme } = useTheme();

  const navigationItems = [
    {
      title: 'Lançamentos',
      description: 'Adicionar entradas e saídas',
      icon: Plus,
      href: '/lancamentos',
    },
    {
      title: 'Categorias',
      description: 'Gerenciar categorias',
      icon: List,
      href: '/categorias',
    },
    {
      title: 'Metas',
      description: 'Definir e acompanhar metas',
      icon: Target,
      href: '/metas',
    },
    {
      title: 'Analisar',
      description: 'Relatórios e análises',
      icon: BarChart3,
      href: '/analises',
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {navigationItems.map((item) => (
        <Card 
          key={item.title}
          className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
            theme === 'dark' 
              ? 'bg-gray-900 border-gray-700 hover:border-gold' 
              : 'bg-white border-gray-200 hover:border-navy'
          }`}
          onClick={() => window.location.href = item.href}
        >
          <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center min-h-[120px] md:min-h-[140px]">
            <div className={`p-3 rounded-lg mb-3 ${
              theme === 'dark' ? 'bg-gold/20' : 'bg-navy/10'
            }`}>
              <item.icon className={`h-8 w-8 md:h-10 md:w-10 group-hover:scale-110 transition-transform duration-300 ${
                theme === 'dark' ? 'text-gold' : 'text-navy'
              }`} />
            </div>
            <h3 className={`font-semibold text-sm md:text-base mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {item.title}
            </h3>
            <p className={`text-xs md:text-sm leading-tight ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NavigationCards;
