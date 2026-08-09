import React from 'react';
import { Plus, FileText, Pin, Clock, UploadCloud, File } from 'lucide-react';

const mockNotes = [
  { id: 1, title: 'Discovery Call Notes', content: 'Customer is very interested in the automation aspect. Budget is fully approved. Needs a final demo with stakeholders.', author: 'Jeya (Admin)', time: 'Oct 24, 2026', isPinned: true },
  { id: 2, title: 'Pricing Feedback', content: 'Requested a 10% discount on the yearly plan. Sent revised proposal.', author: 'SalesBot Alpha', time: 'Oct 24, 2026', isPinned: false },
];

const mockDocs = [
  { id: 1, name: 'Proposal_DunderMifflin_v2.pdf', type: 'PDF', size: '2.4 MB', date: 'Oct 24, 2026' },
  { id: 2, name: 'Service_Contract_Draft.docx', type: 'DOCX', size: '1.1 MB', date: 'Oct 25, 2026' },
];

const NotesAndDocs = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Notes Section */}
      <div className="glass-card bg-bg-primary p-6 md:p-8 rounded-3xl border border-border flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-text-main flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary" /> Internal Notes
          </h3>
          <button className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {mockNotes.map((note) => (
            <div key={note.id} className="p-4 rounded-2xl bg-bg-secondary border border-border relative group">
              {note.isPinned && (
                <div className="absolute top-4 right-4 text-orange-500">
                  <Pin className="w-4 h-4 fill-current" />
                </div>
              )}
              <h4 className="text-sm font-bold text-text-main mb-2 pr-8">{note.title}</h4>
              <p className="text-sm text-text-muted mb-4">{note.content}</p>
              <div className="flex items-center justify-between text-xs font-medium text-text-muted/80">
                 <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {note.time}</span>
                 <span>By {note.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Docs Section */}
      <div className="glass-card bg-bg-primary p-6 md:p-8 rounded-3xl border border-border flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-text-main flex items-center">
            <File className="w-5 h-5 mr-2 text-accent-purple" /> Documents
          </h3>
        </div>
        
        {/* Upload Area */}
        <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center mb-6 bg-bg-secondary/50 hover:bg-bg-secondary transition-colors cursor-pointer group">
           <div className="p-3 bg-white dark:bg-bg-primary rounded-xl shadow-sm mb-3 group-hover:-translate-y-1 transition-transform border border-border">
             <UploadCloud className="w-6 h-6 text-primary" />
           </div>
           <h4 className="text-sm font-bold text-text-main mb-1">Click to upload or drag & drop</h4>
           <p className="text-xs text-text-muted">PDF, DOCX, XLSX (max 10MB)</p>
        </div>

        <div className="space-y-3">
          {mockDocs.map((doc) => (
            <div key={doc.id} className="p-3 rounded-xl bg-bg-secondary border border-border flex items-center justify-between group hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 rounded-lg shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-text-main truncate group-hover:text-primary transition-colors">{doc.name}</p>
                  <p className="text-xs text-text-muted font-medium">{doc.size} • {doc.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default NotesAndDocs;
