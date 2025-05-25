
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, cliente, isLoading, signOut } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

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
    const handleBackToLogin = async () => {
      await signOut();
      navigate('/login');
    };

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-black text-yellow-400' 
          : 'bg-gradient-to-br from-blue-50 to-white text-blue-900'
      }`}>
        <div className="relative">
          {/* Branding Guillen IA no topo */}
          <div className={`text-center mb-6 ${
            theme === 'dark' ? 'text-yellow-400' : 'text-blue-900'
          }`}>
            <h1 className="text-4xl font-bold tracking-wider">
              GUILLEN <span className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>IA</span>
            </h1>
          </div>

          {/* Cartão principal com gradiente */}
          <div className={`relative text-center p-10 rounded-3xl shadow-2xl max-w-lg mx-auto overflow-hidden ${
            theme === 'dark' 
              ? 'border border-yellow-400/30' 
              : 'border border-blue-200/30'
          }`}>
            {/* Gradiente de fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/80 via-yellow-500/60 to-blue-500/20 opacity-90"></div>
            
            {/* Conteúdo sobre o gradiente */}
            <div className="relative z-10 text-gray-900">
              <h2 className="text-4xl font-bold mb-6 text-blue-900">
                Assinatura Pendente
              </h2>
              
              <p className="text-xl mb-6 font-medium">
                Sua conta está aguardando ativação.
              </p>
              
              <p className="text-lg mb-8 opacity-80">
                Complete o pagamento da mensalidade para acessar o sistema financeiro.
              </p>

              {/* Frase motivacional */}
              <div className="bg-white/90 rounded-2xl p-6 mb-8 shadow-lg">
                <p className="text-2xl font-semibold text-blue-900 italic">
                  "Organize suas finanças, transforme seu futuro com Guillen IA!"
                </p>
              </div>

              {/* Botão Voltar para Login */}
              <Button
                onClick={handleBackToLogin}
                size="lg"
                className="w-full h-16 text-xl font-bold bg-blue-900 hover:bg-blue-800 text-white transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-blue-300"
                aria-label="Voltar para a tela de login"
                tabIndex={0}
              >
                <LogOut className="mr-3 h-6 w-6" />
                Voltar para Login
              </Button>
            </div>
          </div>

          {/* Rodapé com branding adicional */}
          <div className={`text-center mt-6 ${
            theme === 'dark' ? 'text-yellow-400/70' : 'text-blue-700/70'
          }`}>
            <p className="text-sm font-medium">
              Powered by Guillen IA - Inteligência Artificial Financeira
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
