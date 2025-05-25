
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Sun, Moon, DollarSign, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { cliente } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Se o usuário já está logado, redireciona para o dashboard
  React.useEffect(() => {
    if (cliente) {
      navigate('/dashboard');
    }
  }, [cliente, navigate]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-black text-yellow-400' 
        : 'bg-gradient-to-br from-blue-50 to-white text-blue-900'
    }`}>
      <div className="absolute top-6 right-6">
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className={`${
            theme === 'dark' 
              ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' 
              : 'border-blue-300 text-blue-600 hover:bg-blue-50'
          }`}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <DollarSign className={`h-16 w-16 mr-4 ${
            theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'
          }`} />
          <h1 className="text-6xl font-bold">Sistema Financeiro</h1>
        </div>
        
        <p className="text-2xl mb-12 opacity-80">
          Gerencie suas finanças de forma simples e eficiente
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className={`w-64 h-16 text-xl font-semibold transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Fazer Login
          </Button>
          
          <Button
            onClick={() => navigate('/cadastro')}
            variant="outline"
            size="lg"
            className={`w-64 h-16 text-xl font-semibold transition-colors duration-300 ${
              theme === 'dark' 
                ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' 
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
          >
            Cadastrar-se
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-yellow-400/20' 
              : 'bg-white border border-blue-200'
          }`}>
            <TrendingUp className={`h-12 w-12 mb-4 mx-auto ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`} />
            <h3 className="text-xl font-semibold mb-2">Controle de Entradas</h3>
            <p className="opacity-80">Acompanhe todas as suas receitas e ganhos</p>
          </div>

          <div className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-yellow-400/20' 
              : 'bg-white border border-blue-200'
          }`}>
            <DollarSign className={`h-12 w-12 mb-4 mx-auto ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`} />
            <h3 className="text-xl font-semibold mb-2">Gestão de Gastos</h3>
            <p className="opacity-80">Monitore e categorize todas as suas despesas</p>
          </div>

          <div className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-yellow-400/20' 
              : 'bg-white border border-blue-200'
          }`}>
            <TrendingUp className={`h-12 w-12 mb-4 mx-auto ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <h3 className="text-xl font-semibold mb-2">Relatórios Simples</h3>
            <p className="opacity-80">Visualize seu saldo e histórico financeiro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
