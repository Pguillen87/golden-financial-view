
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, TrendingUp, TrendingDown, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TransactionFormDialog from './TransactionFormDialog';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
  categoria_id?: number;
  status: string;
}

interface TransactionsManagerProps {
  selectedMonth?: number;
  selectedYear?: number;
  dateRange?: any;
}

const TransactionsManager: React.FC<TransactionsManagerProps> = ({
  selectedMonth,
  selectedYear,
  dateRange
}) => {
  const { cliente } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'income' | 'expense'>('income');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
      fetchTransactions();
    }
  }, [cliente, selectedMonth, selectedYear, dateRange]);

  const fetchTransactions = async () => {
    if (!cliente) return;

    setIsLoading(true);
    try {
      let startDate: string;
      let endDate: string;

      // Usar filtro de período
      if (dateRange?.from && dateRange?.to) {
        startDate = dateRange.from.toISOString().split('T')[0];
        endDate = dateRange.to.toISOString().split('T')[0];
      } else if (selectedMonth && selectedYear) {
        startDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`;
        const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
        const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
        endDate = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;
      } else {
        // Se não há filtros, usar mês atual
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        endDate = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;
      }

      console.log('Buscando transações do período:', startDate, 'até', endDate);

      // Buscar entradas
      const { data: incomeData, error: incomeError } = await supabase
        .from('financeiro_entradas')
        .select(`
          *,
          financeiro_categorias_entrada(nome)
        `)
        .eq('cliente_id', cliente.id)
        .gte('data', startDate)
        .lt('data', endDate)
        .order('data', { ascending: false });

      // Buscar saídas
      const { data: expenseData, error: expenseError } = await supabase
        .from('financeiro_saidas')
        .select(`
          *,
          financeiro_categorias_saida(nome)
        `)
        .eq('cliente_id', cliente.id)
        .gte('data', startDate)
        .lt('data', endDate)
        .order('data', { ascending: false });

      if (incomeError) {
        console.error('Erro ao buscar entradas:', incomeError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as receitas.",
          variant: "destructive",
        });
      }

      if (expenseError) {
        console.error('Erro ao buscar saídas:', expenseError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as despesas.",
          variant: "destructive",
        });
      }

      // Mapear e combinar transações
      const incomeTransactions = (incomeData || []).map(item => ({
        id: item.id,
        description: item.descricao || 'Receita',
        amount: Number(item.valor),
        date: item.data,
        type: 'income' as const,
        category: item.financeiro_categorias_entrada?.nome || 'Sem categoria',
        categoria_id: item.categoria_id,
        status: item.status || 'recebida'
      }));

      const expenseTransactions = (expenseData || []).map(item => ({
        id: item.id,
        description: item.descricao || 'Despesa',
        amount: Number(item.valor),
        date: item.data,
        type: 'expense' as const,
        category: item.financeiro_categorias_saida?.nome || 'Sem categoria',
        categoria_id: item.categoria_id,
        status: item.status || 'pago'
      }));

      const allTransactions = [...incomeTransactions, ...expenseTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setTransactions(allTransactions);
      console.log('Transações carregadas:', allTransactions.length);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os lançamentos.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'recebida':
      case 'pago':
        return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'a_receber':
      case 'a_vencer':
        return <Clock className="h-3 w-3 text-yellow-400" />;
      case 'vencida':
      case 'vencido':
        return <XCircle className="h-3 w-3 text-red-400" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusText = (status: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      switch (status) {
        case 'recebida':
          return 'Recebida';
        case 'a_receber':
          return 'A Receber';
        case 'vencida':
          return 'Vencida';
        default:
          return 'Recebida';
      }
    } else {
      switch (status) {
        case 'pago':
          return 'Pago';
        case 'a_vencer':
          return 'A Vencer';
        case 'vencido':
          return 'Vencido';
        default:
          return 'Pago';
      }
    }
  };

  const handleStatusChange = async (transactionId: number, newStatus: string, type: 'income' | 'expense') => {
    try {
      const table = type === 'income' ? 'financeiro_entradas' : 'financeiro_saidas';
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', transactionId);

      if (error) throw error;

      // Atualizar estado local
      setTransactions(prev => prev.map(t => 
        t.id === transactionId ? { ...t, status: newStatus } : t
      ));

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  // Calcular totais apenas de transações efetivadas
  const effectiveIncomeTransactions = incomeTransactions.filter(t => t.status === 'recebida');
  const effectiveExpenseTransactions = expenseTransactions.filter(t => t.status === 'pago');

  const handleAddTransaction = (type: 'income' | 'expense') => {
    setDialogType(type);
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setDialogType(transaction.type);
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleDeleteTransaction = (id: number, description: string) => {
    setConfirmationDialog({
      isOpen: true,
      title: 'Confirmar Exclusão',
      description: `Tem certeza que deseja excluir o lançamento "${description}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        try {
          const transaction = transactions.find(t => t.id === id);
          if (!transaction) return;

          const table = transaction.type === 'income' ? 'financeiro_entradas' : 'financeiro_saidas';
          const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

          if (error) throw error;

          setTransactions(prev => prev.filter(t => t.id !== id));
          toast({
            title: "Sucesso",
            description: "Lançamento excluído com sucesso.",
          });
        } catch (error) {
          console.error('Erro ao excluir lançamento:', error);
          toast({
            title: "Erro",
            description: "Não foi possível excluir o lançamento.",
            variant: "destructive",
          });
        }
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleSaveTransaction = async (transactionData: any) => {
    try {
      if (editingTransaction) {
        // Editar transação existente
        const table = editingTransaction.type === 'income' ? 'financeiro_entradas' : 'financeiro_saidas';
        const { error } = await supabase
          .from(table)
          .update({
            descricao: transactionData.description,
            valor: transactionData.amount,
            data: transactionData.date,
            categoria_id: transactionData.category_id,
            status: transactionData.status
          })
          .eq('id', editingTransaction.id);

        if (error) throw error;
      } else {
        // Adicionar nova transação
        const table = dialogType === 'income' ? 'financeiro_entradas' : 'financeiro_saidas';
        const { error } = await supabase
          .from(table)
          .insert({
            cliente_id: cliente?.id,
            descricao: transactionData.description,
            valor: transactionData.amount,
            data: transactionData.date,
            categoria_id: transactionData.category_id,
            status: transactionData.status
          });

        if (error) throw error;
      }

      await fetchTransactions(); // Recarregar dados
      toast({
        title: "Sucesso",
        description: editingTransaction ? "Lançamento atualizado com sucesso." : "Lançamento criado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar lançamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o lançamento.",
        variant: "destructive",
      });
    }
    setIsDialogOpen(false);
  };

  const TransactionCard = ({ title, transactions, type }: { 
    title: string; 
    transactions: Transaction[]; 
    type: 'income' | 'expense' 
  }) => (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-800 rounded-lg">
            {type === 'income' ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <h3 className={`text-md font-semibold ${
            type === 'income' ? 'text-green-400' : 'text-red-400'
          }`}>
            {title} ({transactions.length})
          </h3>
        </div>
        <Button 
          size="sm" 
          onClick={() => handleAddTransaction(type)}
          className="bg-[#FFD700] hover:bg-[#E6C200] text-black"
        >
          <Plus className="h-3 w-3 mr-1" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {isLoading ? (
          <p className="text-center py-6 text-gray-400 text-sm">
            Carregando...
          </p>
        ) : transactions.length > 0 ? transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-white text-sm">{transaction.description}</h4>
                <span className={`text-sm font-bold ${
                  type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  <span>{formatDate(transaction.date)}</span>
                </div>
                <span>•</span>
                <span>{transaction.category}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(transaction.status)}
                  <span>{getStatusText(transaction.status, type)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 ml-3">
              {/* Quick status change buttons */}
              {transaction.status !== (type === 'income' ? 'recebida' : 'pago') && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleStatusChange(transaction.id, type === 'income' ? 'recebida' : 'pago', type)}
                  className="text-green-400 hover:text-green-300 p-1 h-6 w-6"
                  title={`Marcar como ${type === 'income' ? 'recebida' : 'pago'}`}
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleEditTransaction(transaction)}
                className="text-gray-400 hover:text-white p-1 h-6 w-6"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleDeleteTransaction(transaction.id, transaction.description)}
                className="text-red-400 hover:text-red-300 p-1 h-6 w-6"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )) : (
          <p className="text-center py-6 text-gray-400 text-sm">
            Nenhuma transação encontrada no período filtrado
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-[#FFD700] mb-1">
            Gerenciar Lançamentos
          </h3>
          <p className="text-gray-400 text-sm">
            Visualize, edite, exclua e adicione novos lançamentos do período filtrado.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TransactionCard 
          title="Receitas" 
          transactions={incomeTransactions} 
          type="income" 
        />
        <TransactionCard 
          title="Despesas" 
          transactions={expenseTransactions} 
          type="expense" 
        />
      </div>

      {/* Resumo */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <h4 className="text-md font-semibold text-[#FFD700] mb-3">Resumo do Período (Apenas Efetivadas)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Total de Receitas</p>
            <p className="text-lg font-bold text-green-400">
              {formatCurrency(effectiveIncomeTransactions.reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Total de Despesas</p>
            <p className="text-lg font-bold text-red-400">
              {formatCurrency(effectiveExpenseTransactions.reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Saldo</p>
            <p className={`text-lg font-bold ${
              (effectiveIncomeTransactions.reduce((sum, t) => sum + t.amount, 0) - 
               effectiveExpenseTransactions.reduce((sum, t) => sum + t.amount, 0)) >= 0 
                ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatCurrency(
                effectiveIncomeTransactions.reduce((sum, t) => sum + t.amount, 0) - 
                effectiveExpenseTransactions.reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </div>
        </div>
      </div>

      <TransactionFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveTransaction}
        type={dialogType}
        transaction={editingTransaction}
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

export default TransactionsManager;
