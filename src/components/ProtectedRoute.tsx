
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, cliente, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-black text-yellow-400' 
          : 'bg-gradient-to-br from-blue-50 to-white text-blue-900'
      }`}>
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!cliente) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-black text-yellow-400' 
          : 'bg-gradient-to-br from-blue-50 to-white text-blue-900'
      }`}>
        <div className={`text-center p-8 rounded-2xl shadow-lg ${
          theme === 'dark' 
            ? 'bg-gray-900 border border-yellow-400/20' 
            : 'bg-white border border-blue-200'
        }`}>
          <h2 className="text-2xl font-bold mb-4">Erro de Acesso</h2>
          <p className="text-lg">Não foi possível carregar seus dados. Tente fazer login novamente.</p>
        </div>
      </div>
    );
  }

  if (!cliente.ativo) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-black text-yellow-400' 
          : 'bg-gradient-to-br from-blue-50 to-white text-blue-900'
      }`}>
        <div className={`text-center p-8 rounded-2xl shadow-lg ${
          theme === 'dark' 
            ? 'bg-gray-900 border border-red-400/20' 
            : 'bg-white border border-red-200'
        }`}>
          <h2 className={`text-3xl font-bold mb-4 ${
            theme === 'dark' ? 'text-red-400' : 'text-red-600'
          }`}>
            Assinatura Pendente
          </h2>
          <p className="text-xl mb-4">
            Sua conta está aguardando ativação.
          </p>
          <p className="text-lg opacity-80">
            Complete o pagamento da mensalidade para acessar o sistema financeiro.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
