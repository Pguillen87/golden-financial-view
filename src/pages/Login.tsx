
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Sun, Moon, Shield } from 'lucide-react';

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
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    }`}>
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className={`transition-all duration-300 ${
              theme === 'dark' 
                ? 'border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400' 
                : 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400'
            }`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Main Card */}
        <div className={`p-8 rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-500 border ${
          theme === 'dark' 
            ? 'bg-gray-900/80 border-yellow-400/20 shadow-yellow-400/10' 
            : 'bg-white/90 border-blue-200/30 shadow-blue-500/10'
        }`}>
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-500/20' 
                : 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20'
            }`}>
              <Shield className="h-10 w-10 text-white" />
            </div>
            
            {/* Title */}
            <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-blue-900'
            }`}>
              Gestão de Finanças
            </h1>
            
            <p className={`text-sm mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              by <span className={theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}>GuillenIA</span>
            </p>
            
            <p className={`text-sm mb-4 italic ${
              theme === 'dark' ? 'text-yellow-400/80' : 'text-blue-600'
            }`}>
              Energia positiva para suas finanças, clareza para sua vida.
            </p>
            
            <p className={`text-lg font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Acesse sua conta para simplificar sua vida financeira.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className={`text-sm font-medium flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                📧 Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`h-12 text-base transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="seu@email.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className={`text-sm font-medium flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                🔐 Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`h-12 text-base pr-12 transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-100'
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:ring-4 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500/30 shadow-lg shadow-blue-500/20' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500/30 shadow-lg shadow-blue-500/20'
              }`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Não tem uma conta?{' '}
              <button
                onClick={() => navigate('/cadastro')}
                className={`font-semibold hover:underline transition-colors duration-300 ${
                  theme === 'dark' ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Cadastre-se
              </button>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <div className={`flex items-center justify-center gap-2 text-sm ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              <Shield className="h-4 w-4" />
              <span>Ambiente Seguro by GuillenIA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
