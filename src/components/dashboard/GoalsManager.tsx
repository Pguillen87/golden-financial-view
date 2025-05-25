
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Target } from 'lucide-react';

const GoalsManager: React.FC = () => {
  // Dados mock para demonstração
  const goals = [
    {
      id: 1,
      name: 'Emergência',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: '2024-12-31',
      category: 'Poupança',
    },
    {
      id: 2,
      name: 'Viagem',
      targetAmount: 5000,
      currentAmount: 2800,
      deadline: '2024-08-15',
      category: 'Lazer',
    },
    {
      id: 3,
      name: 'Curso',
      targetAmount: 2000,
      currentAmount: 1200,
      deadline: '2024-06-30',
      category: 'Educação',
    },
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-[#FFD700] mb-2">
            Suas Metas Financeiras
          </h3>
          <p className="text-gray-400">
            Acompanhe o progresso para alcançar seus objetivos.
          </p>
        </div>
        <Button className="bg-[#4299e1] hover:bg-[#3182ce] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            
            return (
              <div 
                key={goal.id} 
                className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-[#FFD700] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1a365d] rounded-lg">
                      <Target className="h-5 w-5 text-[#4299e1]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{goal.name}</h4>
                      <p className="text-sm text-gray-400">{goal.category}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Progresso</span>
                      <span className="text-sm font-semibold text-[#FFD700]">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-3 bg-gray-700"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Atual</p>
                      <p className="text-lg font-semibold text-green-400">
                        {formatCurrency(goal.currentAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Meta</p>
                      <p className="text-lg font-semibold text-white">
                        {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400">Prazo</p>
                      <p className="text-sm font-medium text-white">
                        {formatDate(goal.deadline)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-400">Faltam</p>
                      <p className="text-sm font-medium text-[#4299e1]">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg p-12 border border-gray-700 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-800 rounded-full">
              <Target className="h-12 w-12 text-gray-600" />
            </div>
          </div>
          <h4 className="text-xl font-semibold text-white mb-2">
            Você ainda não cadastrou nenhuma meta.
          </h4>
          <p className="text-gray-400 mb-6">
            Clique em "Nova Meta" para começar!
          </p>
          <Button className="bg-[#4299e1] hover:bg-[#3182ce] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nova Meta
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoalsManager;
