
import React from 'react';
import { Button } from '@/components/ui/button';
import { Target, Edit, Trash2, Calendar } from 'lucide-react';
import { Goal } from '@/types/goal';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: number, goalName: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'text-green-400';
    if (progress >= 50) return 'text-yellow-400';
    return 'text-red-400';
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

  const progressColor = getProgressColor(progress);

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: goal.categoryColor }}
            />
            <h4 className="font-medium text-white text-sm">{goal.name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              goal.type === 'income' 
                ? 'bg-green-900 text-green-300' 
                : 'bg-red-900 text-red-300'
            }`}>
              {goal.type === 'income' ? 'Receita' : 'Despesa'}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
            <div className="flex items-center gap-1">
              <Target className="h-2.5 w-2.5" />
              <span>{goal.category}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5" />
              <span>até {formatDate(goal.deadline)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">
                {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
              </span>
              <span className={`font-medium ${progressColor}`}>
                {progress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300`}
                style={{ 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: progressColor === 'text-green-400' ? '#22c55e' : 
                                 progressColor === 'text-yellow-400' ? '#eab308' : '#ef4444'
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-3">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onEdit(goal)}
            className="text-gray-400 hover:text-white p-1 h-6 w-6"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onDelete(goal.id, goal.name)}
            className="text-red-400 hover:text-red-300 p-1 h-6 w-6"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
