
export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  categoryColor: string;
  type: 'income' | 'expense';
}
