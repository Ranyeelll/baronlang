import { useEffect, useState } from 'react';
import { EmotionLogger } from '../components/EmotionLogger';
import { ProgressBar } from '../components/ProgressBar';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import { useCalendar } from '../contexts/CalendarContext';
import { format } from 'date-fns';

// Define a simple task type for the dashboard display
type Task = {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
};

export const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { importantDays } = useCalendar();

  // This effect will listen for changes in localStorage and update the dashboard
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTasks = localStorage.getItem('tasks');
      setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check on component mount
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleTask = (taskId: number) => {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks)); // Update localStorage
  };

  const upcomingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <EmotionLogger />
        <ProgressBar completed={completedTasks.length} total={tasks.length} />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h2>
          <ul className="space-y-3">
            {importantDays.length > 0 ? (
              importantDays.slice(0, 3).map(event => (
                <li key={event.id} className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-gray-700">{event.title}</p>
                    <p className="text-sm text-gray-500">{format(new Date(event.date), 'MMMM d')}</p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No upcoming events.</p>
            )}
          </ul>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Tasks</h2>
          <ul className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.slice(0, 5).map(task => (
                <li key={task.id} className="flex items-center gap-3 cursor-pointer" onClick={() => toggleTask(task.id)}>
                  <Circle className="h-5 w-5 text-slate-400" />
                  <span className="text-gray-700">{task.title}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No upcoming tasks. Great job!</p>
            )}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Completed Tasks</h2>
          <ul className="space-y-3">
            {completedTasks.length > 0 ? (
              completedTasks.slice(0, 5).map(task => (
                <li key={task.id} className="flex items-center gap-3 text-gray-500 line-through cursor-pointer" onClick={() => toggleTask(task.id)}>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>{task.title}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No tasks completed yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};