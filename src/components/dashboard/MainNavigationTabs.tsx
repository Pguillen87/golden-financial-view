
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryManager from './CategoryManager';
import GoalsManager from './GoalsManager';
import TransactionsManager from './TransactionsManager';

const MainNavigationTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categorias');

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black border border-[#FFD700] rounded-lg">
          <TabsTrigger 
            value="categorias" 
            className="text-gray-300 data-[state=active]:bg-[#1a365d] data-[state=active]:text-[#FFD700] data-[state=active]:border-[#FFD700] rounded-md mx-1"
          >
            Categorias
          </TabsTrigger>
          <TabsTrigger 
            value="metas" 
            className="text-gray-300 data-[state=active]:bg-[#1a365d] data-[state=active]:text-[#FFD700] data-[state=active]:border-[#FFD700] rounded-md mx-1"
          >
            Metas
          </TabsTrigger>
          <TabsTrigger 
            value="lancamentos" 
            className="text-gray-300 data-[state=active]:bg-[#1a365d] data-[state=active]:text-[#FFD700] data-[state=active]:border-[#FFD700] rounded-md mx-1"
          >
            Lançamentos
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 max-h-96 overflow-y-auto">
          <TabsContent value="categorias" className="mt-0">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="metas" className="mt-0">
            <GoalsManager />
          </TabsContent>

          <TabsContent value="lancamentos" className="mt-0">
            <TransactionsManager />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MainNavigationTabs;
