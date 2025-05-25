
import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue' | 'yellow';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color,
}) => {
  const { theme } = useTheme();

  const getColorClasses = () => {
    const baseClasses = theme === 'dark' ? 'bg-gray-900 border' : 'bg-white border';
    
    switch (color) {
      case 'green':
        return `${baseClasses} ${theme === 'dark' ? 'border-green-400/20 shadow-green-400/10' : 'border-green-200 shadow-green-500/10'}`;
      case 'red':
        return `${baseClasses} ${theme === 'dark' ? 'border-red-400/20 shadow-red-400/10' : 'border-red-200 shadow-red-500/10'}`;
      case 'blue':
        return `${baseClasses} ${theme === 'dark' ? 'border-blue-400/20 shadow-blue-400/10' : 'border-blue-200 shadow-blue-500/10'}`;
      case 'yellow':
        return `${baseClasses} ${theme === 'dark' ? 'border-yellow-400/20 shadow-yellow-400/10' : 'border-yellow-200 shadow-yellow-500/10'}`;
      default:
        return baseClasses;
    }
  };

  const getIconColor = () => {
    switch (color) {
      case 'green':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'red':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      case 'blue':
        return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'yellow':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getValueColor = () => {
    switch (color) {
      case 'green':
        return theme === 'dark' ? 'text-green-400' : 'text-green-700';
      case 'red':
        return theme === 'dark' ? 'text-red-400' : 'text-red-700';
      case 'blue':
        return theme === 'dark' ? 'text-blue-400' : 'text-blue-700';
      case 'yellow':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700';
      default:
        return theme === 'dark' ? 'text-white' : 'text-gray-900';
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${getColorClasses()}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mb-1 ${getValueColor()}`}>
            {value}
          </p>
          {change && (
            <p className={`text-sm font-medium ${getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-xl ${
          theme === 'dark' 
            ? 'bg-gray-800' 
            : color === 'green' ? 'bg-green-50' 
            : color === 'red' ? 'bg-red-50'
            : color === 'blue' ? 'bg-blue-50'
            : 'bg-yellow-50'
        }`}>
          <Icon className={`h-8 w-8 ${getIconColor()}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
