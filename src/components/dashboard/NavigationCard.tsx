
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CategoryManager from './CategoryManager';
import GoalsManager from './GoalsManager';
import TransactionsManager from './TransactionsManager';

const NavigationCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categorias');

  const tabs = [
    { id: 'categorias', label: 'Categorias' },
    { id: 'metas', label: 'Metas' },
    { id: 'lancamentos', label: 'Lançamentos' },
  ];

  return (
    <Card className="bg-black border border-gray-800 rounded-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Header com tabs minimalistas */}
        <div className="bg-black border-b border-gray-800">
          <div className="flex w-full overflow-x-auto scrollbar-hide">
            <div className="flex min-w-full md:min-w-0 md:w-full md:justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative py-3 px-6 text-sm font-medium whitespace-nowrap
                    transition-colors duration-200 border-b-2
                    ${activeTab === tab.id 
                      ? 'text-[#FFD700] border-[#FFD700] font-semibold' 
                      : 'text-gray-400 border-transparent hover:text-gray-200'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo das tabs */}
        <div className="p-6">
          {activeTab === 'categorias' && (
            <div className="mt-0">
              <CategoryManager />
            </div>
          )}

          {activeTab === 'metas' && (
            <div className="mt-0">
              <GoalsManager />
            </div>
          )}

          {activeTab === 'lancamentos' && (
            <div className="mt-0">
              <TransactionsManager />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationCard;
