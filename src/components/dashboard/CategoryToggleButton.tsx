
import React from 'react';
import { Check, X } from 'lucide-react';

interface CategoryToggleButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

const CategoryToggleButton: React.FC<CategoryToggleButtonProps> = ({
  isActive,
  onToggle
}) => {
  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm font-medium
        transition-all duration-200 hover:opacity-90 min-w-[80px]
        ${isActive ? 'bg-green-500' : 'bg-red-500'}
      `}
    >
      {isActive ? (
        <>
          <Check className="h-3 w-3" />
          <span>Ativo</span>
        </>
      ) : (
        <>
          <X className="h-3 w-3" />
          <span>Inativo</span>
        </>
      )}
    </button>
  );
};

export default CategoryToggleButton;
