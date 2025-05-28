import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Edit, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GoalFormDialog from './GoalFormDialog';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  categoryColor: string;
  type: 'income' | 'expense';
}

const GoalsManager: React.FC = () => {
  const { cliente } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (cliente) {
      fetchGoals();
    }
  }, [cliente]);

  const fetchGoals = async () => {
    if (!cliente) return;

    setIsLoading(true);
    try {
      const { data: goalsData, error } = await supabase
        .from('financeiro_metas')
        .select(`
          *,
          financeiro_categorias_entrada(nome, cor),
          financeiro_categorias_saida(nome, cor)
        `)
        .eq('cliente_id', cliente.id)
        .order('periodo_fim', { ascending: true });

      if (error) {
        console.error('Erro ao buscar metas:', error);
      } else {
        const formattedGoals = (goalsData || []).map(goal => {
          // Handle the join results properly
          const incomeCategory = goal.financeiro_categorias_entrada;
          const expenseCategory = goal.financeiro_categorias_saida;
          
          // Fix: Access properties correctly from the category objects
          const categoryName = (incomeCategory && Array.isArray(incomeCategory) ? incomeCategory[0]?.nome : incomeCategory?.nome) || 
                              (expenseCategory && Array.isArray(expenseCategory) ? expenseCategory[0]?.nome : expenseCategory?.nome) || 
                              'Sem categoria';
          const categoryColor = (incomeCategory && Array.isArray(incomeCategory) ? incomeCategory[0]?.cor : incomeCategory?.cor) || 
                               (expenseCategory && Array.isArray(expenseCategory) ? expenseCategory[0]?.cor : expenseCategory?.cor) || 
                               '#6B7280';
          const goalType: 'income' | 'expense' = goal.categoria_id ? 'income' : 'expense';

          return {
            id: goal.id,
            name: goal.nome || 'Meta sem nome',
            targetAmount: Number(goal.valor_alvo), // Fix: Use correct field name
            currentAmount: Number(goal.valor_atual || 0),
            deadline: goal.periodo_fim, // Fix: Use correct field name
            category: categoryName,
            categoryColor: categoryColor,
            type: goalType
          };
        });

        setGoals(formattedGoals);
      }
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as metas.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

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

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = (id: number, goalName: string) => {
    setConfirmationDialog({
      isOpen: true,
      title: 'Confirmar Exclusão',
      description: `Tem certeza que deseja excluir a meta "${goalName}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('financeiro_metas')
            .delete()
            .eq('id', id);

          if (error) throw error;

          await fetchGoals();
          toast({
            title: "Sucesso",
            description: "Meta excluída com sucesso.",
          });
        } catch (error) {
          console.error('Erro ao excluir meta:', error);
          toast({
            title: "Erro",
            description: "Não foi possível excluir a meta.",
            variant: "destructive",
          });
        }
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleSaveGoal = async (goalData: any) => {
    try {
      if (editingGoal) {
        // Fix: Use correct field names for update
        const { error } = await supabase
          .from('financeiro_metas')
          .update({
            nome: goalData.name,
            valor_alvo: goalData.targetAmount, // Fix: Use correct field name
            valor_atual: goalData.currentAmount,
            periodo_fim: goalData.deadline, // Fix: Use correct field name
            categoria_id: goalData.type === 'income' ? parseInt(goalData.category) : null,
            categoria_saida_id: goalData.type === 'expense' ? parseInt(goalData.category) : null,
            tipo: goalData.type === 'income' ? 'receita' : 'economia'
          })
          .eq('id', editingGoal.id);

        if (error) throw error;
      } else {
        // Fix: Use correct field names for insert
        const { error } = await supabase
          .from('financeiro_metas')
          .insert({
            cliente_id: cliente?.id,
            nome: goalData.name,
            valor_alvo: goalData.targetAmount, // Fix: Use correct field name
            valor_atual: goalData.currentAmount,
            periodo_inicio: new Date().toISOString().split('T')[0], // Add required field
            periodo_fim: goalData.deadline, // Fix: Use correct field name
            categoria_id: goalData.type === 'income' ? parseInt(goalData.category) : null,
            categoria_saida_id: goalData.type === 'expense' ? parseInt(goalData.category) : null,
            tipo: goalData.type === 'income' ? 'receita' : 'economia'
          });

        if (error) throw error;
      }

      await fetchGoals();
      toast({
        title: "Sucesso",
        description: editingGoal ? "Meta atualizada com sucesso." : "Meta criada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a meta.",
        variant: "destructive",
      });
    }
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

      {/* Goals List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {isLoading ? (
          <p className="text-center py-6 text-gray-400 text-sm">
            Carregando metas...
          </p>
        ) : goals.length > 0 ? goals.map((goal) => {
          const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
          const progressColor = getProgressColor(progress);
          
          return (
            <div key={goal.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
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
                    onClick={() => handleEditGoal(goal)}
                    className="text-gray-400 hover:text-white p-1 h-6 w-6"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteGoal(goal.id, goal.name)}
                    className="text-red-400 hover:text-red-300 p-1 h-6 w-6"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-8 text-gray-400">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhuma meta encontrada</p>
            <p className="text-xs mt-1">Comece criando sua primeira meta financeira</p>
          </div>
        )}
      </div>

      <GoalFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveGoal}
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
