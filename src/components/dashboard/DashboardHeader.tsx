
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { LogOut, Sun, Moon, Settings, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  showHiddenCards: boolean;
  onToggleHiddenCards: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  showHiddenCards,
  onToggleHiddenCards,
}) => {
  const { cliente, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <header className={`p-6 shadow-lg backdrop-blur-sm transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900/80 border-b border-yellow-400/20' 
        : 'bg-white/80 border-b border-blue-200'
    }`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-4xl font-bold transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
              : 'text-blue-900'
          }`}>
            Gestão de Finanças
          </h1>
          <p className={`text-sm mt-1 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            GuillenIA. Simplificando a complexidade, potencializando seus ganhos.
          </p>
          <p className={`text-lg mt-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Bem-vindo, <span className={theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'}>{cliente?.nome}</span>!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={onToggleHiddenCards}
            variant="outline"
            size="icon"
            className={`transition-all duration-300 ${
              theme === 'dark' 
                ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black' 
                : 'border-blue-300 text-blue-600 hover:bg-blue-50'
            }`}
          >
            {showHiddenCards ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className={`transition-all duration-300 ${
              theme === 'dark' 
                ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' 
                : 'border-blue-300 text-blue-600 hover:bg-blue-50'
            }`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`transition-all duration-300 ${
              theme === 'dark' 
                ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-black' 
                : 'border-red-300 text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
