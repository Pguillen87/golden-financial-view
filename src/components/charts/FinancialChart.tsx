
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
  title?: string;
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
}

const defaultColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Light blue
  '#96CEB4', // Light green
  '#FFEAA7', // Light yellow
  '#DDA0DD', // Plum
  '#FFD93D', // Gold
  '#6C5CE7', // Purple
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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}>
          {label && (
            <p className="font-medium mb-2">{label}</p>
          )}
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name || entry.dataKey}: R$ ${entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend component
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
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (type === 'bar') {
    return (
      <div className={`p-4 md:p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900 border border-gray-700' 
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
        <div className="h-80 md:h-96 w-full">
          <ChartContainer config={chartConfig}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
          ? 'bg-gray-900 border border-gray-700' 
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
        <div className="h-80 md:h-96 w-full">
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="40%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey={dataKey}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
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
            payload={data.map((item, index) => ({
              value: item[nameKey],
              color: colors[index % colors.length]
            }))}
          />
        </div>
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className={`p-4 md:p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900 border border-gray-700' 
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
        <div className="h-80 md:h-96 w-full">
          <ChartContainer config={chartConfig}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
