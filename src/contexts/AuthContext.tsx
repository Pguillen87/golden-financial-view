
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Cliente {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
  auth_user_id: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  cliente: Cliente | null;
  isLoading: boolean;
  signUp: (email: string, password: string, nome: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Aguardar um pouco para garantir que o trigger foi executado (apenas para novos usuários)
          if (event === 'SIGNED_IN') {
            setTimeout(async () => {
              await fetchClienteData(session.user.id);
            }, 100);
          } else {
            await fetchClienteData(session.user.id);
          }
        } else {
          setCliente(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          await fetchClienteData(session.user.id);
        }, 0);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchClienteData = async (authUserId: string, retryCount = 0) => {
    try {
      console.log('Buscando dados do cliente para:', authUserId, 'tentativa:', retryCount + 1);
      
      const { data, error } = await supabase
        .from('financeiro_clientes')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do cliente:', error);
        
        // Se não encontrou o cliente e é a primeira tentativa, tentar novamente após 2 segundos
        if (error.code === 'PGRST116' && retryCount < 3) {
          console.log('Cliente não encontrado, tentando novamente em 2 segundos...');
          setTimeout(() => {
            fetchClienteData(authUserId, retryCount + 1);
          }, 2000);
          return;
        }
        
        setCliente(null);
        return;
      }

      if (data) {
        console.log('Dados do cliente encontrados:', data);
        setCliente({
          id: data.id,
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          ativo: data.ativo,
          auth_user_id: data.auth_user_id
        });
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      setCliente(null);
    }
  };

  const signUp = async (email: string, password: string, nome: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Usuário cadastrado com sucesso. O trigger deve criar o registro em financeiro_clientes.');
        return { success: true };
      }

      return { success: false, error: 'Erro inesperado no cadastro' };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, error: 'Erro inesperado no cadastro' };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro no login:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: 'Erro inesperado no login' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro inesperado no login' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setCliente(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      cliente, 
      isLoading, 
      signUp, 
      signIn, 
      signOut 
    }}>
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
