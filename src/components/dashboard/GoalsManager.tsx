
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Goal } from '@/types/goal';
import { useGoals } from '@/hooks/useGoals';
import GoalFormDialog from './GoalFormDialog';
import GoalsList from './GoalsList';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';

const GoalsManager: React.FC = () => {
  const { goals, isLoading, handleDeleteGoal, handleSaveGoal } = useGoals();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDeleteGoalWithConfirmation = (id: number, goalName: string) => {
    setConfirmationDialog({
      isOpen: true,
      title: 'Confirmar Exclusão',
      description: `Tem certeza que deseja excluir a meta "${goalName}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        await handleDeleteGoal(id);
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleSaveGoalAndClose = async (goalData: any) => {
    await handleSaveGoal(goalData, editingGoal);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">Carregando metas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-[#FFD700] mb-1">
            Gerenciar Metas
          </h3>
          <p className="text-gray-400 text-sm">
            Defina e acompanhe suas metas financeiras.
          </p>
        </div>
        <Button 
          onClick={handleAddGoal}
          className="bg-[#FFD700] hover:bg-[#E6C200] text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      <GoalsList
        goals={goals}
        onEditGoal={handleEditGoal}
        onDeleteGoal={handleDeleteGoalWithConfirmation}
      />

      <GoalFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveGoalAndClose}
        goal={editingGoal}
      />

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        description={confirmationDialog.description}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default GoalsManager;
