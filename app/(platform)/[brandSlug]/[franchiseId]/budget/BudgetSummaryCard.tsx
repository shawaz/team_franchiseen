import React from 'react';
import { Card } from '@/components/ui/card';

const budget = 52000;
const spent = 43230;
const remaining = 8770;

// Colors for the progress bar segments (match the previous categories for demo)
const progressSegments = [
  { color: '#222', width: 0.23 }, // Concept
  { color: '#34C759', width: 0.22 }, // Design
  { color: '#FF3B30', width: 0.18 }, // Development
  { color: '#FFA500', width: 0.17 }, // SEO
  { color: '#00A3FF', width: 0.13 }, // Extra
  { color: '#E5EAF1', width: 0.07 }, // Remaining (gray)
];

// const iconBoxStyle = (bg: string, color: string) => ({
//   marginLeft: 'auto',
//   background: bg,
//   borderRadius: '50%',
//   width: 48,
//   height: 48,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// });

const BudgetSummaryCard: React.FC = () => {
  return (
    <Card className="p-6 bg-white dark:bg-stone-800">
      <div className="font-semibold text-2xl text-black dark:text-white">Budget</div>
      <div className="flex border-y border-gray-200 dark:border-stone-700">
        {/* Total Budget */}
        <div className="flex-1 flex items-center gap-4">
          <div>
            <div className="text-3xl text-green-500 font-bold">${budget.toLocaleString()}</div>
            <div className="text-gray-500 font-medium text-sm">Total Budget</div>
          </div>

        </div>
        {/* Total Spent */}
        <div className="flex-1 p-6 flex items-center gap-4 border-l border-gray-200 dark:border-stone-700">
          <div>
            <div className="text-3xl text-blue-500 font-bold">${spent.toLocaleString()}</div>
            <div className="text-gray-500 font-medium text-sm">Total Spent</div>
          </div>

        </div>
        {/* Remaining */}
        <div className="flex-1 p-6 flex items-center gap-4 border-l border-gray-200 dark:border-stone-700">
          <div>
            <div className="text-3xl text-red-500 font-bold">${remaining.toLocaleString()}</div>
            <div className="text-gray-500 font-medium text-sm">Remaining</div>
          </div>

        </div>
      </div>
      
      <div className="h-2 rounded-md overflow-hidden bg-gray-200 dark:bg-stone-700 ">
        {progressSegments.map((seg, i) => (
          <div key={i} className={`bg-${seg.color} w-[${seg.width * 100}%] h-full`} />
        ))}
      </div>
      
    </Card>
  );
};

export default BudgetSummaryCard; 