
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import CategoryManager from './CategoryManager';
import GoalsManager from './GoalsManager';
import TransactionsManager from './TransactionsManager';

const NavigationCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categorias');

  return (
    <Card className="bg-black border border-gray-800 rounded-lg overflow-hidden">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Header com tabs minimalistas */}
          <div className="bg-black border-b border-gray-800">
            <TabsList className="h-12 w-full bg-transparent p-0 rounded-none justify-start overflow-x-auto">
              <div className="flex min-w-full md:min-w-0 md:w-full">
                <TabsTrigger 
                  value="categorias" 
                  className="
                    relative flex-1 md:flex-none md:px-8 px-4 py-3 text-gray-400 
                    bg-transparent border-0 rounded-none text-sm font-medium
                    hover:text-gray-200 transition-colors
                    data-[state=active]:text-[#FFD700] data-[state=active]:bg-transparent
                    data-[state=active]:shadow-none
                    after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5
                    after:bg-transparent data-[state=active]:after:bg-[#FFD700]
                    after:transition-colors after:duration-200
                  "
                >
                  Categorias
                </TabsTrigger>
                <TabsTrigger 
                  value="metas" 
                  className="
                    relative flex-1 md:flex-none md:px-8 px-4 py-3 text-gray-400 
                    bg-transparent border-0 rounded-none text-sm font-medium
                    hover:text-gray-200 transition-colors
                    data-[state=active]:text-[#FFD700] data-[state=active]:bg-transparent
                    data-[state=active]:shadow-none
                    after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5
                    after:bg-transparent data-[state=active]:after:bg-[#FFD700]
                    after:transition-colors after:duration-200
                  "
                >
                  Metas
                </TabsTrigger>
                <TabsTrigger 
                  value="lancamentos" 
                  className="
                    relative flex-1 md:flex-none md:px-8 px-4 py-3 text-gray-400 
                    bg-transparent border-0 rounded-none text-sm font-medium
                    hover:text-gray-200 transition-colors
                    data-[state=active]:text-[#FFD700] data-[state=active]:bg-transparent
                    data-[state=active]:shadow-none
                    after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5
                    after:bg-transparent data-[state=active]:after:bg-[#FFD700]
                    after:transition-colors after:duration-200
                  "
                >
                  Lançamentos
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          {/* Conteúdo das tabs */}
          <div className="p-6">
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
      </CardContent>
    </Card>
  );
};

export default NavigationCard;
