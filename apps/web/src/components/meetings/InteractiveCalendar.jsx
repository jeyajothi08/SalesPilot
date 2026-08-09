import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Video, Phone, Users, MapPin } from 'lucide-react';

const mockEvents = [
  { id: 1, title: 'Demo with Michael Scott', time: '10:00 AM - 10:45 AM', type: 'Zoom', day: 2, color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30' },
  { id: 2, title: 'Pricing Review - Athlead', time: '1:00 PM - 1:30 PM', type: 'Google Meet', day: 2, color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30' },
  { id: 3, title: 'Discovery Call', time: '11:00 AM - 11:30 AM', type: 'Phone', day: 4, color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30' },
  { id: 4, title: 'Office Visit - Dwight', time: '3:00 PM - 4:00 PM', type: 'In-Person', day: 5, color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-500/30' },
];

const InteractiveCalendar = ({ onMeetingClick }) => {
  const [view, setView] = useState('week'); // week, month
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [22, 23, 24, 25, 26, 27, 28]; // Mock current week

  const getIconForType = (type) => {
    switch(type) {
      case 'Zoom': return <Video className="w-3.5 h-3.5 mr-1.5" />;
      case 'Google Meet': return <Video className="w-3.5 h-3.5 mr-1.5" />;
      case 'Phone': return <Phone className="w-3.5 h-3.5 mr-1.5" />;
      case 'In-Person': return <MapPin className="w-3.5 h-3.5 mr-1.5" />;
      default: return <Users className="w-3.5 h-3.5 mr-1.5" />;
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center space-x-4">
           <h2 className="text-xl font-bold text-text-main">October 2026</h2>
           <div className="flex space-x-1">
             <button className="p-1.5 bg-bg-secondary hover:bg-border border border-border rounded-lg transition-colors text-text-main"><ChevronLeft className="w-5 h-5" /></button>
             <button className="px-3 py-1.5 bg-bg-secondary hover:bg-border border border-border rounded-lg text-sm font-bold transition-colors text-text-main">Today</button>
             <button className="p-1.5 bg-bg-secondary hover:bg-border border border-border rounded-lg transition-colors text-text-main"><ChevronRight className="w-5 h-5" /></button>
           </div>
         </div>

         <div className="flex bg-bg-secondary p-1 rounded-xl border border-border">
            <button onClick={() => setView('month')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${view === 'month' ? 'bg-white text-text-main shadow-sm dark:bg-bg-primary' : 'text-text-muted hover:text-text-main'}`}>Month</button>
            <button onClick={() => setView('week')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${view === 'week' ? 'bg-white text-text-main shadow-sm dark:bg-bg-primary' : 'text-text-muted hover:text-text-main'}`}>Week</button>
         </div>
      </div>

      {/* Custom Week Grid View (Mockup) */}
      <div className="flex-1 border border-border rounded-2xl overflow-hidden flex flex-col bg-bg-secondary/30">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-border bg-bg-secondary/80">
          {daysOfWeek.map((day, idx) => (
            <div key={day} className="py-3 text-center border-r border-border last:border-r-0">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{day}</p>
              <p className={`text-lg font-bold mt-1 ${idx === 2 ? 'text-primary' : 'text-text-main'}`}>
                {idx === 2 ? (
                  <span className="bg-primary text-white w-8 h-8 rounded-full inline-flex items-center justify-center">{dates[idx]}</span>
                ) : (
                  dates[idx]
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Time Grid (Simplified) */}
        <div className="flex-1 grid grid-cols-7 overflow-y-auto relative min-h-[400px]">
          
          {/* Horizontal lines for hours (decorative) */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-30">
             {[...Array(6)].map((_, i) => <div key={i} className="border-b border-border w-full h-1/6" />)}
          </div>

          {/* Columns */}
          {[...Array(7)].map((_, colIdx) => (
            <div key={colIdx} className="border-r border-border last:border-r-0 relative p-2">
               
               {/* Events for this day */}
               {mockEvents.filter(e => e.day === colIdx).map(event => (
                 <div 
                   key={event.id}
                   onClick={() => onMeetingClick(event)}
                   className={`p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 mb-3 ${event.color}`}
                 >
                    <p className="text-xs font-bold mb-1 opacity-80 flex items-center">
                      {getIconForType(event.type)} {event.time}
                    </p>
                    <p className="text-sm font-bold leading-tight">{event.title}</p>
                 </div>
               ))}

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default InteractiveCalendar;
