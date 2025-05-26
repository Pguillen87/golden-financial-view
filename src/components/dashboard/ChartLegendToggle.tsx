
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartLegendToggleProps {
  showLegend: boolean;
  onToggle: () => void;
}

const ChartLegendToggle: React.FC<ChartLegendToggleProps> = ({
  showLegend,
  onToggle
}) => {
  return (
    <Button
      onClick={onToggle}
      size="sm"
      variant="ghost"
      className="text-gray-400 hover:text-white p-2 h-8 w-8 rounded-lg hover:bg-white/10 absolute top-2 right-2 z-10"
      title={showLegend ? "Ocultar legenda" : "Mostrar legenda"}
    >
      {showLegend ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ChartLegendToggle;
