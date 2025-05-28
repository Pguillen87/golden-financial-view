
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Goal } from '@/types/goal';

export const useGoals = () => {
  const { cliente } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        toast({
          title: "Erro",
          description: "Não foi possível carregar as metas.",
          variant: "destructive",
        });
      } else {
        const formattedGoals = (goalsData || []).map(goal => {
          // Get category information based on goal type - handle as arrays from Supabase joins
          const incomeCategories = goal.financeiro_categorias_entrada as { nome: string; cor: string; }[] | null;
          const expenseCategories = goal.financeiro_categorias_saida as { nome: string; cor: string; }[] | null;
          
          // Determine category name and color - access first element of array if it exists
          const categoryName = incomeCategories?.[0]?.nome || expenseCategories?.[0]?.nome || 'Sem categoria';
          const categoryColor = incomeCategories?.[0]?.cor || expenseCategories?.[0]?.cor || '#6B7280';
          const goalType: 'income' | 'expense' = goal.categoria_id ? 'income' : 'expense';

          return {
            id: goal.id,
            name: goal.nome || 'Meta sem nome',
            targetAmount: Number(goal.valor_alvo),
            currentAmount: Number(goal.valor_atual || 0),
            deadline: goal.periodo_fim,
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

  const handleDeleteGoal = async (id: number) => {
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
  };

  const handleSaveGoal = async (goalData: any, editingGoal?: Goal | null) => {
    try {
      if (editingGoal) {
        // Update existing goal
        const { error } = await supabase
          .from('financeiro_metas')
          .update({
            nome: goalData.name,
            valor_alvo: goalData.targetAmount,
            valor_atual: goalData.currentAmount,
            periodo_fim: goalData.deadline,
            categoria_id: goalData.type === 'income' ? parseInt(goalData.category) : null,
            categoria_saida_id: goalData.type === 'expense' ? parseInt(goalData.category) : null,
            tipo: goalData.type === 'income' ? 'entrada' : 'saida'
          })
          .eq('id', editingGoal.id);

        if (error) throw error;
      } else {
        // Create new goal
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
            tipo: goalData.type === 'income' ? 'entrada' : 'saida',
            repetir: false,
            concluida: false
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
  };

  return {
    goals,
    isLoading,
    fetchGoals,
    handleDeleteGoal,
    handleSaveGoal
  };
};
