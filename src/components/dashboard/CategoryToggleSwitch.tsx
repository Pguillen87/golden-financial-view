
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface CategoryToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const CategoryToggleSwitch: React.FC<CategoryToggleSwitchProps> = ({
  checked,
  onCheckedChange
}) => {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={`
        data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500
        transition-colors duration-300 ease-in-out
        focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-gray-900
      `}
    />
  );
};

export default CategoryToggleSwitch;
