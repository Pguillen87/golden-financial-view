
import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Move, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MovableCardProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  isHidden?: boolean;
  onHide?: () => void;
  onShow?: () => void;
  showControls?: boolean;
}

const MovableCard: React.FC<MovableCardProps> = ({
  id,
  title,
  children,
  className = '',
  isHidden = false,
  onHide,
  onShow,
  showControls = true,
}) => {
  const { theme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);

  if (isHidden) {
    return (
      <div className={`p-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
        theme === 'dark' 
          ? 'border-gray-600 bg-gray-800/50' 
          : 'border-gray-300 bg-gray-100/50'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {title} (Oculto)
          </span>
          {showControls && onShow && (
            <Button
              onClick={onShow}
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
              }`}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative group transition-all duration-300 ${
        isDragging ? 'scale-105 z-50' : 'z-10'
      } ${className}`}
      draggable={showControls}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <div className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        theme === 'dark' 
          ? 'bg-gray-900/80 border border-yellow-400/20' 
          : 'bg-white/80 border border-blue-200'
      }`}>
        {showControls && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 cursor-move ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
              }`}
            >
              <Move className="h-4 w-4" />
            </Button>
            {onHide && (
              <Button
                onClick={onHide}
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-gray-200'
                }`}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        <h3 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
            : 'text-blue-900'
        }`}>
          {title}
        </h3>
        
        {children}
      </div>
    </div>
  );
};

export default MovableCard;
