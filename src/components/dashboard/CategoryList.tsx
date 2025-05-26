
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import CategoryToggleButton from './CategoryToggleButton';

interface Category {
  id: number;
  name: string;
  active: boolean;
  color: string;
  description?: string;
}

interface CategoryListProps {
  title: string;
  categories: Category[];
  type: 'income' | 'expense';
  onAddCategory: (type: 'income' | 'expense') => void;
  onEditCategory: (category: Category, type: 'income' | 'expense') => void;
  onDeleteCategory: (id: number, type: 'income' | 'expense', categoryName: string) => void;
  onToggleCategory: (id: number, type: 'income' | 'expense') => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  title,
  categories,
  type,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onToggleCategory
}) => {
  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h3 className={`text-lg font-semibold bg-gradient-to-r ${
          type === 'income' ? 'from-green-400 to-emerald-400' : 'from-red-400 to-pink-400'
        } bg-clip-text text-transparent`}>
          {title}
        </h3>
        <Button 
          size="sm" 
          onClick={() => onAddCategory(type)}
          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#E6C200] hover:to-[#FF8C00] text-black font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div 
          className="space-y-3 max-h-full overflow-y-auto pr-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)',
          }}
        >
          {categories.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 group flex-shrink-0"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" 
                  style={{ backgroundColor: category.color }}
                />
                <div className="min-w-0 flex-1">
                  <span className="text-white text-sm font-medium truncate block">{category.name}</span>
                  {category.description && (
                    <p className="text-xs text-gray-400 mt-1 truncate">{category.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <CategoryToggleButton 
                  isActive={category.active}
                  onToggle={() => onToggleCategory(category.id, type)}
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onEditCategory(category, type)}
                  className="text-gray-400 hover:text-white p-2 h-8 w-8 rounded-lg hover:bg-white/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onDeleteCategory(category.id, type, category.name)}
                  className="text-red-400 hover:text-red-300 p-2 h-8 w-8 rounded-lg hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>
        {`
          .space-y-3::-webkit-scrollbar {
            width: 6px;
          }
          .space-y-3::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .space-y-3::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
          }
          .space-y-3::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        `}
      </style>
    </motion.div>
  );
};

export default CategoryList;
