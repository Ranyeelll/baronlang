import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isBefore, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarModal } from '../components/CalendarModal';
import { useCalendar } from '../contexts/CalendarContext';

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    addImportantDay,
    updateImportantDay,
    deleteImportantDay,
    getImportantDay
  } = useCalendar();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });
  const handleDateClick = (date: Date) => {
    if (isBefore(date, new Date()) && !isToday(date)) return;
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  const handleSave = (data: {
    title: string;
    description: string;
  }) => {
    if (!selectedDate) return;
    const existingDay = getImportantDay(selectedDate);
    if (existingDay) {
      updateImportantDay(existingDay.id, {
        ...existingDay,
        ...data,
        date: selectedDate
      });
    } else {
      addImportantDay({
        date: selectedDate,
        ...data
      });
    }
    setIsModalOpen(false);
  };
  const handleDelete = () => {
    if (!selectedDate) return;
    const existingDay = getImportantDay(selectedDate);
    if (existingDay) {
      deleteImportantDay(existingDay.id);
    }
    setIsModalOpen(false);
  };
  return <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Calendar</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-medium text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-500">
          {day}
        </div>)}
        {daysInMonth.map(day => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isPast = isBefore(day, new Date()) && !isToday(day);
          const hasEvent = getImportantDay(day);
          return <button key={day.toISOString()} onClick={() => handleDateClick(day)} disabled={!isCurrentMonth || isPast} className={`
                  relative p-3 text-center transition-all hover:bg-blue-50
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-300' : 'bg-white'}
                  ${isPast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-900'}
                  ${isToday(day) ? 'font-bold' : ''}
                `}>
            {format(day, 'd')}
            {hasEvent && <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
            </div>}
          </button>;
        })}
      </div>
    </div>
    {selectedDate && <CalendarModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} date={selectedDate} existingData={getImportantDay(selectedDate)} onSave={handleSave} onDelete={handleDelete} />}
  </div>;
};