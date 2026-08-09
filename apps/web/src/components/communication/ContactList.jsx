import React, { useState } from 'react';
import { Users, Search, Download, Upload, Filter, Tag, MoreHorizontal } from 'lucide-react';

const mockContacts = [
  { id: 1, name: 'Alice Cooper', company: 'TechNova', email: 'alice@technova.com', phone: '+1 234 567 890', tags: ['Enterprise', 'Hot Lead'], lastActive: '2 hours ago' },
  { id: 2, name: 'Bob Dylan', company: 'MusicStream', email: 'bob@musicstream.io', phone: '+1 987 654 321', tags: ['SaaS', 'Negotiation'], lastActive: '1 day ago' },
  { id: 3, name: 'Charlie Sheen', company: 'Winner Corp', email: 'charlie@winner.co', phone: '+44 123 456 789', tags: ['Startup'], lastActive: '3 days ago' },
];

const ContactList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Contact List
          </h2>
          <p className="text-sm text-text-muted mt-1">Manage leads, segment audiences, and export data.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <button className="px-4 py-2 border border-border rounded-xl font-bold text-sm bg-bg-secondary hover:bg-bg-secondary/80 text-text-main transition-colors flex items-center gap-2 shadow-sm">
             <Upload className="w-4 h-4" />
             Import CSV
           </button>
           <button className="px-4 py-2 border border-border rounded-xl font-bold text-sm bg-bg-secondary hover:bg-bg-secondary/80 text-text-main transition-colors flex items-center gap-2 shadow-sm">
             <Download className="w-4 h-4" />
             Export CSV
           </button>
           <button className="px-4 py-2 btn-primary flex items-center gap-2 font-bold text-sm shadow-md">
             <Users className="w-4 h-4" />
             Add Contact
           </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search by name, company, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text-main focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2 border border-border rounded-lg hover:bg-bg-secondary text-text-muted hover:text-text-main transition-colors">
             <Filter className="w-4 h-4" />
           </button>
           <button className="p-2 border border-border rounded-lg hover:bg-bg-secondary text-text-muted hover:text-text-main transition-colors">
             <Tag className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="glass-card bg-bg-secondary/50 rounded-3xl border border-border overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-border bg-bg-primary/30">
                 <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Contact</th>
                 <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Contact Info</th>
                 <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Tags / Segments</th>
                 <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Last Active</th>
                 <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               {mockContacts.map((contact) => (
                 <tr key={contact.id} className="hover:bg-bg-primary/50 transition-colors group">
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                         {contact.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-bold text-sm text-text-main group-hover:text-primary transition-colors">{contact.name}</p>
                         <p className="text-xs text-text-muted">{contact.company}</p>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="text-sm font-medium text-text-main">{contact.email}</div>
                     <div className="text-xs text-text-muted mt-0.5">{contact.phone}</div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex flex-wrap gap-1">
                       {contact.tags.map(tag => (
                         <span key={tag} className="px-2 py-0.5 bg-bg-secondary border border-border rounded-md text-[10px] font-bold text-text-muted uppercase tracking-wide">
                           {tag}
                         </span>
                       ))}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <span className="text-sm text-text-muted">{contact.lastActive}</span>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button className="p-2 hover:bg-bg-secondary rounded-lg text-text-muted transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>

    </div>
  );
};

export default ContactList;
