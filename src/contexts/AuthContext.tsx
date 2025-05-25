
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Cliente {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
}

interface AuthContextType {
  cliente: Cliente | null;
  login: (identifier: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um cliente salvo no localStorage
    const savedCliente = localStorage.getItem('financeiro_cliente');
    if (savedCliente) {
      setCliente(JSON.parse(savedCliente));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, senha: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('financeiro_clientes')
        .select('id, nome, email, telefone, ativo')
        .or(`nome.eq.${identifier},email.eq.${identifier}`)
        .eq('senha', senha)
        .single();

      if (error || !data) {
        return false;
      }

      if (!data.ativo) {
        return false;
      }

      const clienteData = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        ativo: data.ativo
      };

      setCliente(clienteData);
      localStorage.setItem('financeiro_cliente', JSON.stringify(clienteData));
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    setCliente(null);
    localStorage.removeItem('financeiro_cliente');
  };

  return (
    <AuthContext.Provider value={{ cliente, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
