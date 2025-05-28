
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartData {
  name: string;
  entradas: number;
  saidas: number;
}

interface PieData {
  name: string;
  value: number;
}

interface FinancialChartProps {
  chartData: ChartData[];
  pieData: PieData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const FinancialChart: React.FC<FinancialChartProps> = ({ chartData, pieData }) => {
  const [showEntradas, setShowEntradas] = useState(true);
  const [showSaidas, setShowSaidas] = useState(true);

  const toggleEntradas = () => setShowEntradas(!showEntradas);
  const toggleSaidas = () => setShowSaidas(!showSaidas);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey === 'entradas' ? 'Receitas' : 'Despesas'}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const customPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-white text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Receitas vs Despesas</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleEntradas}
              className={`flex items-center gap-1 ${showEntradas ? 'text-green-400' : 'text-gray-500'}`}
            >
              {showEntradas ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              Receitas
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleSaidas}
              className={`flex items-center gap-1 ${showSaidas ? 'text-red-400' : 'text-gray-500'}`}
            >
              {showSaidas ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              Despesas
            </Button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis tickFormatter={formatCurrency} stroke="#9CA3AF" />
            <Tooltip content={customTooltip} />
            <Legend 
              formatter={(value) => (
                <span className="text-white">
                  {value === 'entradas' ? 'Receitas' : 'Despesas'}
                </span>
              )}
            />
            {showEntradas && <Bar dataKey="entradas" fill="#22c55e" />}
            {showSaidas && <Bar dataKey="saidas" fill="#ef4444" />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Despesas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={customPieTooltip} />
              <Legend 
                formatter={(value) => <span className="text-white">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default FinancialChart;
