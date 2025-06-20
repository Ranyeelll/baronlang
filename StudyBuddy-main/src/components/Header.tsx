import React, { useState } from 'react';
import { BookOpen, LogOut, LayoutDashboard, CheckSquare, User, BoxIcon, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, NavLink } from 'react-router-dom';
const navigation = [{
  name: 'Dashboard',
  icon: LayoutDashboard,
  href: '/dashboard'
}, {
  name: 'Tasks',
  icon: CheckSquare,
  href: '/tasks'
}, {
  name: 'Calendar',
  icon: CalendarIcon,
  href: '/calendar'
}];
export const Header = () => {
  const {
    logout,
    user
  } = useAuth();
  return <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#800020] via-[#8B0000] to-[#B22222] px-4">
    <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-8">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-2">
          <BookOpen className="text-white" />
          <h1 className="text-xl font-semibold text-white">StudyBuddy</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map(item => <NavLink key={item.name} to={item.href} className={({
            isActive
          }) => `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>)}
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <User className="h-4 w-4" />
            {user?.name || 'Student'}
          </Link>
          <button onClick={logout} className="flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  </header>;
};