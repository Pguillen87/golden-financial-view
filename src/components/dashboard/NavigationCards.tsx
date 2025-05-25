
import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { BarChart3, Target, Plus, TrendingUp, PieChart, List } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const NavigationCards: React.FC = () => {
  const { theme } = useTheme();

  const navigationItems = [
    {
      title: 'Lançamentos',
      description: 'Adicionar entradas e saídas',
      icon: Plus,
      href: '/lancamentos',
      color: 'blue'
    },
    {
      title: 'Categorias',
      description: 'Gerenciar categorias',
      icon: List,
      href: '/categorias',
      color: 'green'
    },
    {
      title: 'Metas',
      description: 'Definir e acompanhar metas',
      icon: Target,
      href: '/metas',
      color: 'purple'
    },
    {
      title: 'Analisar',
      description: 'Relatórios e análises',
      icon: BarChart3,
      href: '/analises',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: theme === 'dark' 
        ? 'from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700' 
        : 'from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600',
      green: theme === 'dark'
        ? 'from-green-600 to-green-800 hover:from-green-500 hover:to-green-700'
        : 'from-green-500 to-green-700 hover:from-green-400 hover:to-green-600',
      purple: theme === 'dark'
        ? 'from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700'
        : 'from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600',
      orange: theme === 'dark'
        ? 'from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700'
        : 'from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {navigationItems.map((item) => (
        <Card 
          key={item.title}
          className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 overflow-hidden ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}
          onClick={() => window.location.href = item.href}
        >
          <CardContent className="p-0">
            <div className={`bg-gradient-to-br ${getColorClasses(item.color)} p-6 h-full flex flex-col items-center justify-center text-center text-white min-h-[120px] md:min-h-[140px]`}>
              <item.icon className="h-8 w-8 md:h-10 md:w-10 mb-3 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-semibold text-sm md:text-base mb-1">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm opacity-90 leading-tight">
                {item.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NavigationCards;
