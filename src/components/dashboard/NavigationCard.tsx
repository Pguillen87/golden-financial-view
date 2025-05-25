
import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  selectedMonth?: number;
  selectedYear?: number;
  dateRange?: any;
}

const NavigationCard: React.FC<NavigationCardProps> = ({
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
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      id: 'metas',
      label: 'Metas',
      icon: Target,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'lancamentos',
      label: 'Lançamentos',
      icon: Receipt,
      gradient: 'from-orange-500 to-red-500'
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
    <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-6 text-[#FFD700] bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
        Gestão Financeira
      </h2>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-black/30 rounded-2xl p-1 backdrop-blur-sm border border-gray-700/50">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative py-3 px-6 text-sm font-medium rounded-xl
                transition-all duration-300 flex items-center gap-2
                ${activeTab === tab.id 
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg` 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default NavigationCard;
