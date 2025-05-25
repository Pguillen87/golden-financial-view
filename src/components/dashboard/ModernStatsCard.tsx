
import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface ModernStatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue';
  trend?: 'up' | 'down';
  subtitle?: string;
}

const ModernStatsCard: React.FC<ModernStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
}) => {
  const { theme } = useTheme();

  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          bg: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-50',
          border: theme === 'dark' ? 'border-green-400/30' : 'border-green-200',
          text: theme === 'dark' ? 'text-green-400' : 'text-green-600',
          icon: theme === 'dark' ? 'text-green-400' : 'text-green-600',
          iconBg: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100',
        };
      case 'red':
        return {
          bg: theme === 'dark' ? 'bg-red-500/20' : 'bg-red-50',
          border: theme === 'dark' ? 'border-red-400/30' : 'border-red-200',
          text: theme === 'dark' ? 'text-red-400' : 'text-red-600',
          icon: theme === 'dark' ? 'text-red-400' : 'text-red-600',
          iconBg: theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100',
        };
      case 'blue':
        return {
          bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50',
          border: theme === 'dark' ? 'border-blue-400/30' : 'border-blue-200',
          text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
          icon: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
          iconBg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      colors.bg
    } ${colors.border} border`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-lg ${colors.iconBg}`}>
              <Icon className={`h-5 w-5 ${colors.icon}`} />
            </div>
            {trend && (
              <div className={`flex items-center ${
                trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
          
          <p className={`text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {title}
          </p>
          
          <p className={`text-2xl font-bold ${colors.text}`}>
            {value}
          </p>
          
          {subtitle && (
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernStatsCard;
