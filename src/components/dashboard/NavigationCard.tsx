
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Target, Receipt, LucideIcon } from 'lucide-react';
import CategoryManager from './CategoryManager';
import GoalsManager from './GoalsManager';
import TransactionsManager from './TransactionsManager';

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
  const [activeTab, setActiveTab] = useState('categorias');

  const tabs: Tab[] = [
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
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
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
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`
        relative p-6 rounded-2xl border cursor-pointer transition-all duration-300
        ${isActive 
          ? `bg-gradient-to-br ${gradient} border-white/20 shadow-xl` 
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
          ${isActive ? 'bg-white/20' : 'bg-white/10'}
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
          <div className="flex justify-center mb-6">
            <div className="flex bg-black/30 rounded-2xl p-1 backdrop-blur-sm border border-gray-700/50">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(tab.id);
                  }}
                  className={`
                    relative py-2 px-4 text-sm font-medium rounded-xl
                    transition-all duration-300 flex items-center gap-2
                    ${activeTab === tab.id 
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg` 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
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
