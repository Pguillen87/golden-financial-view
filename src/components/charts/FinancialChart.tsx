
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FinancialChartProps {
  data: any[];
  type: 'bar' | 'pie';
  title?: string;
  dataKey?: string;
  nameKey?: string;
  showToggle?: boolean;
  showLegend?: boolean;
  incomeData?: any[];
  expenseData?: any[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({
  data,
  type,
  title,
  dataKey = 'value',
  nameKey = 'name',
  showToggle = true
}) => {
  const [showLegend, setShowLegend] = useState(true);

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white text-sm">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === 'bar') {
    return (
      <div className="relative">
        {showToggle && (
          <Button
            onClick={() => setShowLegend(!showLegend)}
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 z-10 text-gray-400 hover:text-white p-2 h-8 w-8 rounded-lg hover:bg-white/10"
            title={showLegend ? "Ocultar legenda" : "Mostrar legenda"}
          >
            {showLegend ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="entradas" fill="#22c55e" />
            <Bar dataKey="saidas" fill="#ef4444" />
            {showLegend && <Legend content={<CustomLegend />} />}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div className="relative">
        {showToggle && (
          <Button
            onClick={() => setShowLegend(!showLegend)}
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 z-10 text-gray-400 hover:text-white p-2 h-8 w-8 rounded-lg hover:bg-white/10"
            title={showLegend ? "Ocultar legenda" : "Mostrar legenda"}
          >
            {showLegend ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || `hsl(${index * 45}, 70%, 50%)`} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend content={<CustomLegend />} />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export default FinancialChart;
