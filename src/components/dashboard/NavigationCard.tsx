
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import CategoryManager from './CategoryManager';
import GoalsManager from './GoalsManager';
import TransactionsManager from './TransactionsManager';
import { BarChart3, Target, Plus } from 'lucide-react';

const NavigationCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categorias');

  const tabs = [
    { 
      id: 'categorias', 
      label: 'Categorias',
      icon: BarChart3,
      gradient: 'from-purple-500 to-blue-500'
    },
    { 
      id: 'metas', 
      label: 'Metas',
      icon: Target,
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'lancamentos', 
      label: 'Lançamentos',
      icon: Plus,
      gradient: 'from-cyan-500 to-teal-500'
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
      <CardContent className="p-0">
        {/* Header com tabs modernas */}
        <div className="relative bg-black/30 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex w-full overflow-x-auto scrollbar-hide">
            <div className="flex min-w-full md:min-w-0 md:w-full md:justify-center p-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative py-4 px-8 text-sm font-medium whitespace-nowrap
                    transition-all duration-300 rounded-xl mx-1 group
                    flex items-center gap-3
                    ${activeTab === tab.id 
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg shadow-blue-500/25` 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className={`h-4 w-4 transition-transform duration-300 ${
                    activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                  {tab.label}
                  
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo das tabs */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'categorias' && <CategoryManager />}
            {activeTab === 'metas' && <GoalsManager />}
            {activeTab === 'lancamentos' && <TransactionsManager />}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationCard;
