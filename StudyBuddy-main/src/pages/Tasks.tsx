import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { TaskCard } from '../components/TaskCard';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

type Task = {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
};
export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [{
      id: 1,
      title: 'Complete Math Homework',
      subject: 'Mathematics',
      dueDate: 'Today at 5:00 PM',
      completed: false
    }, {
      id: 2,
      title: 'Read Chapter 5',
      subject: 'History',
      dueDate: 'Tomorrow at 3:00 PM',
      completed: false
    }, {
      id: 3,
      title: 'Submit Science Project',
      subject: 'Science',
      dueDate: 'Friday at 12:00 PM',
      completed: true
    }];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    dueDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalData, setDeleteModalData] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const handleAddTask = () => {
    if (newTask.title && newTask.subject && newTask.dueDate) {
      const updatedTasks = [...tasks, {
        id: Date.now(),
        ...newTask,
        completed: false
      }];
      setTasks(updatedTasks);
      setNewTask({
        title: '',
        subject: '',
        dueDate: ''
      });
      setShowForm(false);
    }
  };
  const toggleTask = (taskId: number) => {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    setTasks(newTasks);
  };
  const handleEditTask = (taskId: number, updatedData: {
    title: string;
    subject: string;
    dueDate: string;
  }) => {
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      ...updatedData
    } : task));
  };
  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const activeTasks = tasks.filter(task => !task.completed && (task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.subject.toLowerCase().includes(searchTerm.toLowerCase())));
  const completedTasks = tasks.filter(task => task.completed && (task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.subject.toLowerCase().includes(searchTerm.toLowerCase())));

  return <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Task Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>
      {showForm && <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
        <input type="text" placeholder="Task title" value={newTask.title} onChange={e => setNewTask({
          ...newTask,
          title: e.target.value
        })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        <input type="text" placeholder="Subject" value={newTask.subject} onChange={e => setNewTask({
          ...newTask,
          subject: e.target.value
        })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        <input type="text" placeholder="Due date (e.g., Today at 5:00 PM)" value={newTask.dueDate} onChange={e => setNewTask({
          ...newTask,
          dueDate: e.target.value
        })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-700 hover:text-gray-900">
            Cancel
          </button>
          <button onClick={handleAddTask} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Add Task
          </button>
        </div>
      </div>}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        </div>
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Active Tasks</h3>
        <div className="space-y-4">
          {activeTasks.map(task => <TaskCard key={task.id} id={task.id} title={task.title} subject={task.subject} dueDate={task.dueDate} completed={task.completed} onToggle={() => toggleTask(task.id)} onEdit={handleEditTask} onDelete={id => setDeleteModalData({
            id,
            title: task.title
          })} />)}
          {activeTasks.length === 0 && <p className="text-center text-gray-500 py-4">No active tasks</p>}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Completed Tasks</h3>
        <div className="space-y-4">
          {completedTasks.map(task => <TaskCard key={task.id} id={task.id} title={task.title} subject={task.subject} dueDate={task.dueDate} completed={task.completed} onToggle={() => toggleTask(task.id)} onEdit={handleEditTask} onDelete={id => setDeleteModalData({
            id,
            title: task.title
          })} />)}
          {completedTasks.length === 0 && <p className="text-center text-gray-500 py-4">No completed tasks</p>}
        </div>
      </div>
    </div>
    <DeleteConfirmationModal isOpen={deleteModalData !== null} onClose={() => setDeleteModalData(null)} onConfirm={() => {
      if (deleteModalData) {
        handleDeleteTask(deleteModalData.id);
      }
    }} title={deleteModalData?.title || ''} />
  </div>;
};