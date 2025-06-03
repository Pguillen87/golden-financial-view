
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PaymentMethodFormDialog from './PaymentMethodFormDialog';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';

interface PaymentMethod {
  id: number;
  nome: string;
  ativo: boolean;
}

const PaymentMethodManager: React.FC = () => {
  const { cliente } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
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
      fetchPaymentMethods();
    }
  }, [cliente]);

  const fetchPaymentMethods = async () => {
    if (!cliente) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('financeiro_formas_pagamento')
        .select('*')
        .eq('cliente_id', cliente.id)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar formas de pagamento:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as formas de pagamento.",
          variant: "destructive",
        });
      } else {
        setPaymentMethods(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar formas de pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as formas de pagamento.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleAddPaymentMethod = () => {
    setEditingPaymentMethod(null);
    setIsDialogOpen(true);
  };

  const handleEditPaymentMethod = (paymentMethod: PaymentMethod) => {
    setEditingPaymentMethod(paymentMethod);
    setIsDialogOpen(true);
  };

  const handleDeletePaymentMethod = (id: number, name: string) => {
    setConfirmationDialog({
      isOpen: true,
      title: 'Confirmar Exclusão',
      description: `Tem certeza que deseja excluir a forma de pagamento "${name}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('financeiro_formas_pagamento')
            .delete()
            .eq('id', id);

          if (error) throw error;

          await fetchPaymentMethods();
          toast({
            title: "Sucesso",
            description: "Forma de pagamento excluída com sucesso.",
          });
        } catch (error) {
          console.error('Erro ao excluir forma de pagamento:', error);
          toast({
            title: "Erro",
            description: "Não foi possível excluir a forma de pagamento.",
            variant: "destructive",
          });
        }
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleTogglePaymentMethod = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('financeiro_formas_pagamento')
        .update({ ativo: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      await fetchPaymentMethods();
      toast({
        title: "Sucesso",
        description: `Forma de pagamento ${!currentStatus ? 'ativada' : 'desativada'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar forma de pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a forma de pagamento.",
        variant: "destructive",
      });
    }
  };

  const handleSavePaymentMethod = async (paymentMethodData: any) => {
    try {
      if (editingPaymentMethod) {
        // Editar forma de pagamento existente
        const { error } = await supabase
          .from('financeiro_formas_pagamento')
          .update({
            nome: paymentMethodData.nome
          })
          .eq('id', editingPaymentMethod.id);

        if (error) throw error;
      } else {
        // Adicionar nova forma de pagamento
        const { error } = await supabase
          .from('financeiro_formas_pagamento')
          .insert({
            cliente_id: cliente?.id,
            nome: paymentMethodData.nome,
            ativo: true
          });

        if (error) throw error;
      }

      await fetchPaymentMethods();
      toast({
        title: "Sucesso",
        description: editingPaymentMethod ? "Forma de pagamento atualizada com sucesso." : "Forma de pagamento criada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar forma de pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a forma de pagamento.",
        variant: "destructive",
      });
    }
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">Carregando formas de pagamento...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-[#FFD700] mb-1">
            Formas de Pagamento
          </h3>
          <p className="text-gray-400 text-sm">
            Gerencie as formas de pagamento disponíveis.
          </p>
        </div>
        <Button 
          onClick={handleAddPaymentMethod}
          className="bg-[#FFD700] hover:bg-[#E6C200] text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Forma
        </Button>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {paymentMethods.length > 0 ? paymentMethods.map((paymentMethod) => (
            <div key={paymentMethod.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className={`font-medium text-sm ${paymentMethod.ativo ? 'text-white' : 'text-gray-500'}`}>
                    {paymentMethod.nome}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    paymentMethod.ativo 
                      ? 'bg-green-900 text-green-400' 
                      : 'bg-red-900 text-red-400'
                  }`}>
                    {paymentMethod.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-3">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleTogglePaymentMethod(paymentMethod.id, paymentMethod.ativo)}
                  className={`p-1 h-6 w-16 text-xs ${
                    paymentMethod.ativo 
                      ? 'text-red-400 hover:text-red-300' 
                      : 'text-green-400 hover:text-green-300'
                  }`}
                >
                  {paymentMethod.ativo ? 'Desativar' : 'Ativar'}
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleEditPaymentMethod(paymentMethod)}
                  className="text-gray-400 hover:text-white p-1 h-6 w-6"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleDeletePaymentMethod(paymentMethod.id, paymentMethod.nome)}
                  className="text-red-400 hover:text-red-300 p-1 h-6 w-6"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )) : (
            <p className="text-center py-6 text-gray-400 text-sm">
              Nenhuma forma de pagamento cadastrada
            </p>
          )}
        </div>
      </div>

      <PaymentMethodFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSavePaymentMethod}
        paymentMethod={editingPaymentMethod}
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

export default PaymentMethodManager;
