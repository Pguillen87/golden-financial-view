
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Target, Receipt, TrendingUp, CreditCard, LucideIcon } from 'lucide-react';
import CategoryManager from './CategoryManager';
import GoalsManager from './GoalsManager';
import TransactionsManager from './TransactionsManager';
import CategoryAnalytics from './CategoryAnalytics';
import PaymentMethodManager from './PaymentMethodManager';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
}

interface NavigationCardProps {
  icon: LucideIcon;
  gradient: string;
  isActive: boolean;
  onClick: () => void;
  selectedMonth?: number;
  selectedYear?: number;
  dateRange?: any;
}

const NavigationCard: React.FC<NavigationCardProps> = ({
  icon: CardIcon,
  gradient,
  isActive,
  onClick,
  selectedMonth,
  selectedYear,
  dateRange
}) => {
  const [activeTab, setActiveTab] = useState('analytics');

  const tabs: Tab[] = [
    {
      id: 'analytics',
      label: 'Análise por Categorias',
      icon: TrendingUp,
      gradient: 'from-emerald-600 to-green-700'
    },
    {
      id: 'categorias',
      label: 'Categorias',
      icon: BarChart3,
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      id: 'metas',
      label: 'Metas',
      icon: Target,
      gradient: 'from-slate-600 to-slate-700'
    },
    {
      id: 'lancamentos',
      label: 'Lançamentos',
      icon: Receipt,
      gradient: 'from-gray-600 to-gray-700'
    },
    {
      id: 'payments',
      label: 'Formas de Pagamento',
      icon: CreditCard,
      gradient: 'from-indigo-600 to-purple-700'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <CategoryAnalytics
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            dateRange={dateRange}
          />
        );
      case 'categorias':
        return <CategoryManager />;
      case 'metas':
        return <GoalsManager />;
      case 'lancamentos':
        return (
          <TransactionsManager 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            dateRange={dateRange}
          />
        );
      case 'payments':
        return <PaymentMethodManager />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`
        relative p-6 rounded-2xl border cursor-pointer transition-all duration-300
        ${isActive 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 shadow-xl' 
          : 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700/30 hover:border-gray-600/50'
        }
      `}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`
          p-3 rounded-xl transition-all duration-300
          ${isActive ? 'bg-gray-700' : 'bg-gray-700/50'}
        `}>
          <CardIcon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-gray-300'}`} />
        </div>
        <h3 className={`text-lg font-semibold transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-300'}`}>
          Gestão Financeira
        </h3>
      </div>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-6 overflow-x-auto">
            <div className="flex bg-gray-800/80 rounded-2xl p-1 backdrop-blur-sm border border-gray-600 min-w-max">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(tab.id);
                  }}
                  className={`
                    relative py-2 px-3 text-xs md:text-sm font-medium rounded-xl
                    transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                    ${activeTab === tab.id 
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg` 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div 
            className="min-h-[400px]"
            layout 
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 25,
                  duration: 0.3 
                }}
                layout
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NavigationCard;
