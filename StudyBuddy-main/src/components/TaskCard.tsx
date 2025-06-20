import React, { useState } from 'react';
import { Clock, CheckCircle2, Circle, Timer, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
interface TaskCardProps {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
  onToggle: () => void;
  onEdit: (id: number, data: {
    title: string;
    subject: string;
    dueDate: string;
  }) => void;
  onDelete: (id: number) => void;
}
export const TaskCard = ({
  id,
  title,
  subject,
  dueDate,
  completed,
  onToggle,
  onEdit,
  onDelete
}: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title,
    subject,
    dueDate
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(id, editedTask);
    setIsEditing(false);
  };
  const cardClass = completed ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100 hover:bg-gray-50';
  const icon = completed ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5 text-slate-400" />;
  const getPriority = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isDueToday = dueDate.toLowerCase().includes('today');
    const isDueTomorrow = dueDate.toLowerCase().includes('tomorrow');
    if (isDueToday && !completed) {
      return {
        label: 'High Priority',
        color: 'text-red-600',
        icon: <AlertTriangle className="h-4 w-4" />,
        message: 'Due today - Complete ASAP!'
      };
    } else if (isDueTomorrow && !completed) {
      return {
        label: 'Medium Priority',
        color: 'text-amber-600',
        icon: <Timer className="h-4 w-4" />,
        message: 'Due tomorrow - Plan to complete soon'
      };
    }
    return null;
  };
  const priority = getPriority();
  if (isEditing) {
    return <div className="p-4 rounded-lg shadow-sm border border-blue-100 bg-blue-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={editedTask.title} onChange={e => setEditedTask({
          ...editedTask,
          title: e.target.value
        })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500" placeholder="Task title" required />
        <input type="text" value={editedTask.subject} onChange={e => setEditedTask({
          ...editedTask,
          subject: e.target.value
        })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500" placeholder="Subject" required />
        <input type="text" value={editedTask.dueDate} onChange={e => setEditedTask({
          ...editedTask,
          dueDate: e.target.value
        })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500" placeholder="Due date (e.g., Today at 5:00 PM)" required />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>;
  }
  return <div onClick={onToggle} className={`p-4 rounded-lg shadow-sm border transition-all duration-200 cursor-pointer ${cardClass} hover:shadow-md group`} role="button" tabIndex={0} onKeyDown={e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  }} aria-pressed={completed}>
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-500">{subject}</p>
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Due: {dueDate}</span>
        </div>
        {priority && <div className={`flex items-center gap-1 text-sm ${priority.color} mt-2 bg-white/50 px-2 py-1 rounded-md`}>
          {priority.icon}
          <span>{priority.message}</span>
        </div>}
      </div>
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={e => {
            e.stopPropagation();
            setIsEditing(true);
          }} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Edit task">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={e => {
            e.stopPropagation();
            onDelete(id);
          }} className="p-1 text-gray-400 hover:text-red-600 transition-colors" aria-label="Delete task">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <input type="checkbox" checked={completed} onChange={e => {
          e.stopPropagation();
          onToggle();
        }} onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" aria-label={`Mark ${title} as ${completed ? 'incomplete' : 'complete'}`} />
      </div>
    </div>
  </div>;
};