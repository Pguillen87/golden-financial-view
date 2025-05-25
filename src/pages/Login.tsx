
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn(email, password);
    
    if (result.success) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao sistema financeiro.",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Erro no login",
        description: result.error || "Erro ao fazer login. Tente novamente.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-black text-yellow-400' 
        : 'bg-gradient-to-br from-blue-50 to-white text-blue-900'
    }`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900 border border-yellow-400/20' 
          : 'bg-white border border-blue-200'
      }`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Login</h1>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`h-14 text-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-yellow-400/30 text-yellow-400 focus:border-yellow-400' 
                  : 'bg-blue-50 border-blue-300 text-blue-900 focus:border-blue-500'
              }`}
              placeholder="Digite seu email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg font-medium">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`h-14 text-lg pr-12 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-yellow-400/30 text-yellow-400 focus:border-yellow-400' 
                    : 'bg-blue-50 border-blue-300 text-blue-900 focus:border-blue-500'
                }`}
                placeholder="Digite sua senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                  theme === 'dark' ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-blue-600 hover:bg-blue-100'
                }`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full h-14 text-lg font-semibold transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-lg">
            Não tem conta?{' '}
            <button
              onClick={() => navigate('/cadastro')}
              className={`font-semibold hover:underline ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
