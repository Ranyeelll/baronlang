import React, { useEffect, useState, createContext, useContext } from 'react';
import { isBefore, startOfDay } from 'date-fns';

interface ImportantDay {
  id: string;
  date: Date;
  title: string;
  description?: string;
}

interface CalendarContextType {
  importantDays: ImportantDay[];
  addImportantDay: (day: Omit<ImportantDay, 'id'>) => void;
  updateImportantDay: (id: string, day: Partial<ImportantDay>) => void;
  deleteImportantDay: (id: string) => void;
  getImportantDay: (date: Date) => ImportantDay | undefined;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [importantDays, setImportantDays] = useState<ImportantDay[]>(() => {
    const saved = localStorage.getItem('importantDays');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    }) : [];
  });

  // Auto-delete past events on mount and when the day changes
  useEffect(() => {
    const today = startOfDay(new Date());
    setImportantDays(prev => prev.filter(d => !isBefore(startOfDay(d.date), today)));
    // Set up a timer to run this at midnight
    const now = new Date();
    const msUntilMidnight = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)).getTime() - now.getTime();
    const timer = setTimeout(() => {
      setImportantDays(prev => prev.filter(d => !isBefore(startOfDay(d.date), startOfDay(new Date()))));
    }, msUntilMidnight + 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('importantDays', JSON.stringify(importantDays));
  }, [importantDays]);

  const addImportantDay = (day: Omit<ImportantDay, 'id'>) => {
    setImportantDays([...importantDays, {
      ...day,
      id: Date.now().toString()
    }]);
  };

  const updateImportantDay = (id: string, day: Partial<ImportantDay>) => {
    setImportantDays(importantDays.map(d => d.id === id ? {
      ...d,
      ...day
    } : d));
  };

  const deleteImportantDay = (id: string) => {
    setImportantDays(importantDays.filter(d => d.id !== id));
  };

  const getImportantDay = (date: Date) => {
    return importantDays.find(d => d.date.toDateString() === date.toDateString());
  };

  return (
    <CalendarContext.Provider value={{
      importantDays,
      addImportantDay,
      updateImportantDay,
      deleteImportantDay,
      getImportantDay
    }}>
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};