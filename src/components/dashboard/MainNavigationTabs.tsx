
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
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-[#1a365d]">
          <TabsTrigger 
            value="categorias" 
            className="text-gray-300 data-[state=active]:bg-[#1a365d] data-[state=active]:text-[#4299e1] data-[state=active]:border-[#4299e1]"
          >
            Categorias
          </TabsTrigger>
          <TabsTrigger 
            value="metas" 
            className="text-gray-300 data-[state=active]:bg-[#1a365d] data-[state=active]:text-[#4299e1] data-[state=active]:border-[#4299e1]"
          >
            Metas
          </TabsTrigger>
          <TabsTrigger 
            value="lancamentos" 
            className="text-gray-300 data-[state=active]:bg-[#1a365d] data-[state=active]:text-[#4299e1] data-[state=active]:border-[#4299e1]"
          >
            Lançamentos
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
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
