import React, { useEffect, useState, useRef } from 'react';
import { Search, Bell, Moon, Sun, ChevronDown } from 'lucide-react';
import NotificationsPanel from './NotificationsPanel';

const TopHeader = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <header className="h-24 flex items-center justify-between px-8 sticky top-0 bg-bg-secondary/80 backdrop-blur-xl z-30 border-b border-border/50">
      
      {/* Left side: Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main">
          Good Morning, Jeya <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
        </h1>
        <p className="text-sm text-text-muted mt-1 font-medium">{currentDate}</p>
      </div>

      {/* Right side: Search, Theme, Notifications, Profile */}
      <div className="flex items-center space-x-6">
        
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search customers, calls..." 
            className="pl-10 pr-4 py-2.5 bg-bg-primary border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary w-72 shadow-sm transition-all"
          />
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-bg-primary border border-transparent hover:border-border transition-all text-text-muted hover:text-text-main"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 rounded-full border transition-all text-text-muted hover:text-text-main ${isNotifOpen ? 'bg-bg-primary border-border' : 'hover:bg-bg-primary border-transparent hover:border-border'}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-bg-secondary"></span>
          </button>
          
          <NotificationsPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>

        {/* Company Switcher / Profile */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors">Acme Corp</p>
            <p className="text-xs text-text-muted">Administrator</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent-purple p-[2px] shadow-sm">
               <div className="w-full h-full rounded-full bg-bg-primary flex items-center justify-center border-2 border-bg-primary overflow-hidden">
                 <img src="https://ui-avatars.com/api/?name=Jeya&background=random" alt="Avatar" className="w-full h-full object-cover" />
               </div>
            </div>
            <ChevronDown className="w-4 h-4 text-text-muted group-hover:text-text-main transition-colors" />
          </div>
        </div>

      </div>
    </header>
  );
};

export default TopHeader;
