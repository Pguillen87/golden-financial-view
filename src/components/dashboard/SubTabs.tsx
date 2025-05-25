
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SubTab {
  id: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
}

interface SubTabsProps {
  tabs: SubTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const SubTabs: React.FC<SubTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center">
      <div className="flex bg-black/30 rounded-2xl p-1 backdrop-blur-sm border border-gray-700/50">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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
  );
};

export default SubTabs;
