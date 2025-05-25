
import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
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
  title: string;
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
}

const defaultColors = [
  '#FFD700', // Gold
  '#1E90FF', // Blue
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Light blue
  '#96CEB4', // Light green
  '#FFEAA7', // Light yellow
  '#DDA0DD', // Plum
];

const FinancialChart: React.FC<FinancialChartProps> = ({
  data,
  type,
  title,
  dataKey = 'value',
  nameKey = 'name',
  colors = defaultColors,
}) => {
  const { theme } = useTheme();

  const chartConfig = {
    value: {
      label: "Valor",
      color: theme === 'dark' ? '#FFD700' : '#1E90FF',
    },
    entradas: {
      label: "Entradas",
      color: '#4CAF50',
    },
    saidas: {
      label: "Saídas", 
      color: '#F44336',
    },
  };

  const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  if (type === 'bar') {
    return (
      <div className={`p-4 md:p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        {title && (
          <h3 className={`text-lg md:text-xl font-semibold mb-4 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
              : 'text-blue-900'
          }`}>
            {title}
          </h3>
        )}
        <div className="h-64 md:h-80 w-full">
          <ChartContainer config={chartConfig}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="entradas" fill="#4CAF50" radius={[4, 4, 0, 0]} name="Entradas" />
              <Bar dataKey="saidas" fill="#F44336" radius={[4, 4, 0, 0]} name="Saídas" />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div className={`p-4 md:p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        {title && (
          <h3 className={`text-lg md:text-xl font-semibold mb-4 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
              : 'text-blue-900'
          }`}>
            {title}
          </h3>
        )}
        <div className="h-64 md:h-80 w-full">
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey={dataKey}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className={`p-4 md:p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        {title && (
          <h3 className={`text-lg md:text-xl font-semibold mb-4 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent' 
              : 'text-blue-900'
          }`}>
            {title}
          </h3>
        )}
        <div className="h-64 md:h-80 w-full">
          <ChartContainer config={chartConfig}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={theme === 'dark' ? '#FFD700' : '#1E90FF'} 
                strokeWidth={3}
                dot={{ fill: theme === 'dark' ? '#FFD700' : '#1E90FF', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: theme === 'dark' ? '#FFD700' : '#1E90FF' }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    );
  }

  return null;
};

export default FinancialChart;
