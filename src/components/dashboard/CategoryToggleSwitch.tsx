
import React from 'react';

interface CategoryToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const CategoryToggleSwitch: React.FC<CategoryToggleSwitchProps> = ({
  checked,
  onCheckedChange
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-gray-900
        ${checked ? 'bg-[#FFD700]' : 'bg-gray-600'}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 
          transition duration-200 ease-in-out
          ${checked ? 'translate-x-4' : 'translate-x-0'}
        `}
      />
    </button>
  );
};

export default CategoryToggleSwitch;
