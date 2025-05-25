
import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Filter, Calendar as CalendarIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FilterCardProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

const FilterCard: React.FC<FilterCardProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onDateRangeChange,
}) => {
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState<'month' | 'year' | 'custom'>('month');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleFilterTypeChange = (type: 'month' | 'year' | 'custom') => {
    setFilterType(type);
    if (type !== 'custom' && onDateRangeChange) {
      onDateRangeChange(undefined);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      setStartDate(range.from.toISOString().split('T')[0]);
    }
    if (range?.to) {
      setEndDate(range.to.toISOString().split('T')[0]);
    }
  };

  const handleApplyCustomDates = () => {
    if (startDate && endDate) {
      const newRange: DateRange = {
        from: new Date(startDate),
        to: new Date(endDate)
      };
      setDateRange(newRange);
      if (onDateRangeChange) {
        onDateRangeChange(newRange);
      }
    }
  };

  const handleManualDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 border border-gray-700' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
        }`}>
          <Filter className={`h-5 w-5 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} />
        </div>
        <h3 className={`text-xl font-semibold ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}>
          Filtros de Período
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Tipo de Filtro
          </Label>
          <Select value={filterType} onValueChange={handleFilterTypeChange}>
            <SelectTrigger className={`w-full ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
              <SelectItem value="custom">Período Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filterType === 'month' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Mês
              </Label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(Number(value))}>
                <SelectTrigger className={theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
                }>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Ano
              </Label>
              <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(Number(value))}>
                <SelectTrigger className={theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
                }>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025].map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {filterType === 'year' && (
          <div>
            <Label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Ano
            </Label>
            <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(Number(value))}>
              <SelectTrigger className={theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
              }>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2023, 2024, 2025].map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {filterType === 'custom' && (
          <div className="space-y-4">
            <Label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Período Personalizado
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className={`block text-xs font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Data de Início
                </Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleManualDateChange('start', e.target.value)}
                  className={theme === 'dark' 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                  }
                />
              </div>
              
              <div>
                <Label className={`block text-xs font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Data de Fim
                </Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleManualDateChange('end', e.target.value)}
                  className={theme === 'dark' 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <DatePickerWithRange
                date={dateRange}
                onDateChange={handleDateRangeChange}
                className="w-full"
              />
              
              <Button
                onClick={handleApplyCustomDates}
                className={`w-full ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                disabled={!startDate || !endDate}
              >
                <Check className="h-4 w-4 mr-2" />
                Aplicar Período
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterCard;
