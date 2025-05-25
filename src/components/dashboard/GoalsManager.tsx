
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Edit, Trash2 } from 'lucide-react';
import GoalFormDialog from './GoalFormDialog';

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

const GoalsManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([
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
  ]);

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

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const handleSaveGoal = (goalData: any) => {
    if (editingGoal) {
      setGoals(prev => prev.map(goal => 
        goal.id === editingGoal.id ? { ...goal, ...goalData } : goal
      ));
    } else {
      const newGoal = {
        id: Date.now(),
        ...goalData
      };
      setGoals(prev => [...prev, newGoal]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-[#FFD700] mb-1">
            Suas Metas Financeiras
          </h3>
          <p className="text-gray-400 text-sm">
            Acompanhe o progresso para alcançar seus objetivos.
          </p>
        </div>
        <Button 
          onClick={handleAddGoal}
          className="bg-[#FFD700] hover:bg-[#E6C200] text-black"
        >
          <Plus className="h-3 w-3 mr-1" />
          Nova Meta
        </Button>
      </div>

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 max-h-72 overflow-y-auto">
          {goals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            
            return (
              <div 
                key={goal.id} 
                className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-[#FFD700] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#1a365d] rounded-lg">
                      <Target className="h-4 w-4 text-[#4299e1]" />
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-white">{goal.name}</h4>
                      <p className="text-xs text-gray-400">{goal.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditGoal(goal)}
                      className="text-gray-400 hover:text-white p-1 h-6 w-6"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-400 hover:text-red-300 p-1 h-6 w-6"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">Progresso</span>
                      <span className="text-xs font-semibold text-[#FFD700]">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-2 bg-gray-700"
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="text-gray-400">Atual</p>
                      <p className="text-sm font-semibold text-green-400">
                        {formatCurrency(goal.currentAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">Meta</p>
                      <p className="text-sm font-semibold text-white">
                        {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-gray-400">Prazo: {formatDate(goal.deadline)}</p>
                      <p className="text-[#4299e1] font-medium">
                        Faltam: {formatCurrency(goal.targetAmount - goal.currentAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-gray-800 rounded-full">
              <Target className="h-8 w-8 text-gray-600" />
            </div>
          </div>
          <h4 className="text-md font-semibold text-white mb-1">
            Você ainda não cadastrou nenhuma meta.
          </h4>
          <p className="text-gray-400 mb-4 text-sm">
            Clique em "Nova Meta" para começar!
          </p>
          <Button 
            onClick={handleAddGoal}
            className="bg-[#FFD700] hover:bg-[#E6C200] text-black"
          >
            <Plus className="h-3 w-3 mr-1" />
            Nova Meta
          </Button>
        </div>
      )}

      <GoalFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveGoal}
        goal={editingGoal}
      />
    </div>
  );
};

export default GoalsManager;
