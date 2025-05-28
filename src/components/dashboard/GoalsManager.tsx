
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Edit, Trash2 } from 'lucide-react';
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
  categoryColor?: string;
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
      const { data, error } = await supabase
        .from('financeiro_metas')
        .select(`
          *,
          financeiro_categorias_entrada(nome, cor),
          financeiro_categorias_saida(nome, cor)
        `)
        .eq('cliente_id', cliente.id)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar metas:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as metas.",
          variant: "destructive",
        });
      } else {
        const mappedGoals = data?.map(meta => ({
          id: meta.id,
          name: meta.nome || 'Meta sem nome',
          targetAmount: Number(meta.valor_alvo) || 0,
          currentAmount: Number(meta.valor_atual) || 0,
          deadline: meta.periodo_fim,
          category: meta.financeiro_categorias_entrada?.nome || meta.financeiro_categorias_saida?.nome || 'Sem categoria',
          categoryColor: meta.financeiro_categorias_entrada?.cor || meta.financeiro_categorias_saida?.cor || '#666',
          type: meta.categoria_id ? 'income' : 'expense'
        })) || [];
        setGoals(mappedGoals);
      }
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar metas.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

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
        // Editar meta existente
        const { error } = await supabase
          .from('financeiro_metas')
          .update({
            nome: goalData.name,
            valor_alvo: goalData.targetAmount,
            valor_atual: goalData.currentAmount,
            periodo_fim: goalData.deadline,
            categoria_id: goalData.type === 'income' ? parseInt(goalData.category) : null,
            categoria_saida_id: goalData.type === 'expense' ? parseInt(goalData.category) : null,
            tipo: goalData.type === 'income' ? 'receita' : 'economia'
          })
          .eq('id', editingGoal.id);

        if (error) throw error;
      } else {
        // Criar nova meta
        const { error } = await supabase
          .from('financeiro_metas')
          .insert({
            cliente_id: cliente?.id,
            nome: goalData.name,
            valor_alvo: goalData.targetAmount,
            valor_atual: goalData.currentAmount,
            periodo_inicio: new Date().toISOString().split('T')[0],
            periodo_fim: goalData.deadline,
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
          {goals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            
            return (
              <div 
                key={goal.id} 
                className="bg-gray-900 rounded-lg p-3 border border-gray-700 hover:border-[#FFD700] transition-all duration-300 min-w-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1 bg-[#1a365d] rounded-lg flex-shrink-0">
                      <Target className="h-3 w-3 text-[#4299e1]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{goal.name}</h4>
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: goal.categoryColor }}
                        />
                        <p className="text-xs text-gray-400 truncate">{goal.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 flex-shrink-0">
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

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">Progresso</span>
                      <span className="text-xs font-semibold text-[#FFD700]">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-1.5 bg-gray-700"
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div className="min-w-0">
                      <p className="text-gray-400">Atual</p>
                      <p className="text-xs font-semibold text-green-400 truncate">
                        {formatCurrency(goal.currentAmount)}
                      </p>
                    </div>
                    <div className="text-right min-w-0">
                      <p className="text-gray-400">Meta</p>
                      <p className="text-xs font-semibold text-white truncate">
                        {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-gray-400 truncate">Prazo: {formatDate(goal.deadline)}</p>
                      <p className="text-[#4299e1] font-medium truncate">
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
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-gray-800 rounded-full">
              <Target className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">
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
