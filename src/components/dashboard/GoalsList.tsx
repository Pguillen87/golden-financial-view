
import React from 'react';
import { Target } from 'lucide-react';
import { Goal } from '@/types/goal';
import GoalCard from './GoalCard';

interface GoalsListProps {
  goals: Goal[];
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: number, goalName: string) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, onEditGoal, onDeleteGoal }) => {
  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Nenhuma meta encontrada</p>
        <p className="text-xs mt-1">Comece criando sua primeira meta financeira</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEditGoal}
          onDelete={onDeleteGoal}
        />
      ))}
    </div>
  );
};

export default GoalsList;
