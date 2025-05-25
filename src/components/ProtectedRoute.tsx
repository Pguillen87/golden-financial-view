
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { LogOut, Sun, Moon } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, cliente, isLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
            <h1 className={`text-4xl font-bold tracking-wider ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-blue-900'
            }`}>
              GUILLEN <span className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>IA</span>
            </h1>
          </div>

          {/* Cartão principal com fundo sólido */}
          <div className={`relative text-center p-10 rounded-3xl shadow-2xl max-w-lg mx-auto ${
            theme === 'dark' 
              ? 'bg-black border border-yellow-400/30' 
              : 'bg-white border border-blue-200/30'
          }`}>
            {/* Toggle de tema no canto superior direito */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-yellow-500' : 'text-gray-400'}`} />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                aria-label="Alternar entre modo claro e escuro"
                className="data-[state=checked]:bg-yellow-400"
              />
              <Moon className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-400' : 'text-gray-400'}`} />
            </div>
            
            {/* Conteúdo do cartão */}
            <div className="pt-8">
              <h2 className={`text-4xl font-bold mb-6 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
                  : 'text-blue-900'
              }`}>
                Assinatura Pendente
              </h2>
              
              <p className={`text-xl mb-6 font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Sua conta está aguardando ativação.
              </p>
              
              <p className={`text-lg mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Complete o pagamento da mensalidade para acessar o sistema financeiro.
              </p>

              {/* Frase motivacional */}
              <div className={`rounded-2xl p-6 mb-8 shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gray-900 border border-yellow-400/20' 
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`text-2xl font-semibold italic ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
                    : 'text-blue-900'
                }`}>
                  "Organize suas finanças, transforme seu futuro com Guillen IA!"
                </p>
              </div>

              {/* Botão Voltar para Login */}
              <Button
                onClick={handleBackToLogin}
                size="lg"
                className={`w-full h-16 text-xl font-bold transition-all duration-300 transform hover:scale-105 focus:ring-4 ${
                  theme === 'dark'
                    ? 'bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-yellow-300'
                    : 'bg-blue-900 text-white hover:bg-blue-800 focus:ring-blue-300'
                }`}
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
