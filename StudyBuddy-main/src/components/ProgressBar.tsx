import React from 'react';
interface ProgressBarProps {
  completed: number;
  total: number;
}
export const ProgressBar = ({
  completed,
  total
}: ProgressBarProps) => {
  const percentage = Math.round(completed / total * 100);
  const getProgressColor = () => {
    if (percentage >= 80) return 'bg-gradient-to-r from-emerald-500 to-teal-500';
    if (percentage >= 40) return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    return 'bg-gradient-to-r from-amber-500 to-orange-500';
  };
  return <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between mb-2">
        <h2 className="font-medium text-gray-900">Today's Progress</h2>
        <span className={`font-medium ${percentage >= 80 ? 'text-emerald-600' : percentage >= 40 ? 'text-blue-600' : 'text-amber-600'}`}>
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor()}`} style={{
        width: `${percentage}%`
      }} />
      </div>
    </div>;
};