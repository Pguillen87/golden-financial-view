
import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface FinancialChartProps {
  data: any[];
  type: 'bar' | 'pie' | 'line';
  title?: string;
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
  showToggle?: boolean;
  incomeData?: any[];
  expenseData?: any[];
}

const defaultColors = [
  '#22c55e', // Green
  '#ef4444', // Red  
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
];

const FinancialChart: React.FC<FinancialChartProps> = ({
  data,
  type,
  title,
  dataKey = 'value',
  nameKey = 'name',
  colors = defaultColors,
  showToggle = false,
  incomeData = [],
  expenseData = [],
}) => {
  const { theme } = useTheme();
  const [showIncome, setShowIncome] = useState(true);

  const chartConfig = {
    value: {
      label: "Valor",
      color: theme === 'dark' ? '#FFD700' : '#1E3A8A',
    },
    entradas: {
      label: "Entradas",
      color: '#22c55e',
    },
    saidas: {
      label: "Saídas", 
      color: '#ef4444',
    },
  };

  const textColor = theme === 'dark' ? '#ffffff' : '#374151';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  const currentData = showToggle ? (showIncome ? incomeData : expenseData) : data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}>
          {label && (
            <p className="font-medium mb-2 text-white">{label}</p>
          )}
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-white">
              {`${entry.name || entry.dataKey}: R$ ${entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    if (!payload) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-white">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (type === 'bar') {
    return (
      <div className={`p-6 rounded-2xl shadow-lg border-2 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-gold' : 'text-navy'
            }`}>
              {title}
            </h3>
          )}
          {showToggle && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="chart-toggle" className="text-sm text-gray-400">
                Despesas
              </Label>
              <Switch
                id="chart-toggle"
                checked={showIncome}
                onCheckedChange={setShowIncome}
              />
              <Label htmlFor="chart-toggle" className="text-sm text-green-500">
                Receitas
              </Label>
            </div>
          )}
        </div>
        <div className="h-80 w-full">
          <ChartContainer config={chartConfig}>
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
              <XAxis 
                dataKey={nameKey}
                tick={{ fill: textColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis 
                tick={{ fill: textColor, fontSize: 12 }}
                tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                axisLine={{ stroke: gridColor }}
              />
              <ChartTooltip content={<CustomTooltip />} />
              {!showToggle ? (
                <>
                  <Bar dataKey="entradas" fill="#22c55e" radius={[4, 4, 0, 0]} name="Entradas" />
                  <Bar dataKey="saidas" fill="#ef4444" radius={[4, 4, 0, 0]} name="Saídas" />
                </>
              ) : (
                <Bar 
                  dataKey={dataKey} 
                  fill={showIncome ? "#22c55e" : "#ef4444"} 
                  radius={[4, 4, 0, 0]} 
                  name={showIncome ? "Receitas" : "Despesas"} 
                />
              )}
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div className={`p-6 rounded-2xl shadow-lg border-2 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-gold' : 'text-navy'
            }`}>
              {title}
            </h3>
          )}
          {showToggle && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="pie-toggle" className="text-sm text-gray-400">
                Despesas
              </Label>
              <Switch
                id="pie-toggle"
                checked={showIncome}
                onCheckedChange={setShowIncome}
              />
              <Label htmlFor="pie-toggle" className="text-sm text-green-500">
                Receitas
              </Label>
            </div>
          )}
        </div>
        <div className="h-80 w-full">
          <ChartContainer config={chartConfig}>
            <PieChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
              <Pie
                data={currentData}
                cx="50%"
                cy="40%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={2}
                dataKey={dataKey}
              >
                {currentData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
              </Pie>
              <ChartTooltip content={<CustomTooltip />} />
            </PieChart>
          </ChartContainer>
          <CustomLegend 
            payload={currentData.map((item, index) => ({
              value: item[nameKey],
              color: colors[index % colors.length]
            }))}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default FinancialChart;
