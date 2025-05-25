
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '@/components/navigation/NavigationMenu';

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
    <header className={`p-4 md:p-6 shadow-lg backdrop-blur-sm transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900/90 border-b border-gray-700' 
        : 'bg-white/90 border-b border-gray-200'
    }`}>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
        <div className="flex-1">
          <h1 className={`text-2xl md:text-4xl font-bold transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
              : 'text-blue-900'
          }`}>
            Gestão de Finanças
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            GuillenIA. Simplificando a complexidade, potencializando seus ganhos.
          </p>
          <p className={`text-sm md:text-lg mt-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Bem-vindo, <span className={theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'}>{cliente?.nome}</span>!
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-4">
          <DashboardNavigation />
          
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              onClick={onToggleHiddenCards}
              variant="outline"
              size="sm"
              className={`text-xs md:text-sm transition-all duration-300 ${
                theme === 'dark' 
                  ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black' 
                  : 'border-blue-300 text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Menu className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              {showHiddenCards ? 'Ocultar Controles' : 'Mostrar Controles'}
            </Button>
            
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className={`h-8 w-8 md:h-10 md:w-10 transition-all duration-300 ${
                theme === 'dark' 
                  ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' 
                  : 'border-blue-300 text-blue-600 hover:bg-blue-50'
              }`}
            >
              {theme === 'dark' ? <Sun className="h-3 w-3 md:h-4 md:w-4" /> : <Moon className="h-3 w-3 md:h-4 md:w-4" />}
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className={`text-xs md:text-sm transition-all duration-300 ${
                theme === 'dark' 
                  ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-black' 
                  : 'border-red-300 text-red-600 hover:bg-red-50'
              }`}
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
