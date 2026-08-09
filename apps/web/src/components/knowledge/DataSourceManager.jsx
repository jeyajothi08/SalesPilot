import React, { useState } from 'react';
import { UploadCloud, Link as LinkIcon, FileText, Trash2, CheckCircle, Clock } from 'lucide-react';

const mockFiles = [
  { id: 1, name: 'Company_Brochure_2026.pdf', size: '2.4 MB', type: 'PDF', status: 'Trained', date: 'Oct 20, 2026' },
  { id: 2, name: 'Pricing_Tiers_Q4.csv', size: '156 KB', type: 'CSV', status: 'Trained', date: 'Oct 22, 2026' },
  { id: 3, name: 'Sales_Script_Draft.docx', size: '1.1 MB', type: 'DOCX', status: 'Pending', date: 'Just now' },
];

const DataSourceManager = () => {
  const [url, setUrl] = useState('');

  return (
    <div className="space-y-8 max-w-5xl mx-auto h-full flex flex-col">
      
      {/* File Upload Section */}
      <div>
        <h2 className="text-lg font-bold text-text-main mb-4">Document Upload</h2>
        <div className="border-2 border-dashed border-primary/30 rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
           <div className="w-16 h-16 bg-white dark:bg-bg-primary rounded-2xl shadow-sm border border-border flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform">
             <UploadCloud className="w-8 h-8 text-primary" />
           </div>
           <h4 className="text-base font-bold text-text-main mb-2">Click to upload or drag & drop files</h4>
           <p className="text-sm text-text-muted max-w-md">
             Supported formats: PDF, DOCX, TXT, CSV, PPTX. Maximum file size is 50MB.
             Perfect for Company Brochures, Price Lists, and Policies.
           </p>
        </div>
      </div>

      {/* Website URL Crawler */}
      <div>
        <h2 className="text-lg font-bold text-text-main mb-4">Website Crawling</h2>
        <div className="flex gap-4">
           <div className="relative flex-1">
             <LinkIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
             <input 
               type="url" 
               placeholder="https://yourcompany.com" 
               className="w-full pl-12 pr-4 py-4 bg-bg-secondary border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
               value={url}
               onChange={(e) => setUrl(e.target.value)}
             />
           </div>
           <button className="px-8 py-4 bg-text-main hover:bg-black dark:hover:bg-white dark:text-bg-primary text-white rounded-2xl font-bold transition-transform hover:-translate-y-1 shadow-md">
             Crawl Website
           </button>
        </div>
        <p className="text-xs text-text-muted mt-3 font-medium ml-2">
          The AI will automatically crawl the provided URL and subpages to extract context.
        </p>
      </div>

      {/* Uploaded Files Table */}
      <div className="flex-1">
        <h2 className="text-lg font-bold text-text-main mb-4">Uploaded Data Sources</h2>
        <div className="border border-border rounded-2xl overflow-hidden bg-bg-secondary/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-secondary/50">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-text-muted">File Name</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-text-muted">Size</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-text-muted">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockFiles.map((file) => (
                <tr key={file.id} className="hover:bg-white dark:hover:bg-bg-secondary transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <FileText className={`w-5 h-5 ${file.type === 'PDF' ? 'text-red-500' : file.type === 'CSV' ? 'text-green-500' : 'text-blue-500'}`} />
                      <div>
                        <p className="font-bold text-sm text-text-main">{file.name}</p>
                        <p className="text-xs text-text-muted font-medium">{file.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-muted">{file.size}</td>
                  <td className="px-6 py-4">
                     <span className={`flex items-center text-xs font-bold uppercase tracking-wider ${file.status === 'Trained' ? 'text-green-500' : 'text-orange-500'}`}>
                        {file.status === 'Trained' ? <CheckCircle className="w-4 h-4 mr-1.5" /> : <Clock className="w-4 h-4 mr-1.5" />}
                        {file.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default DataSourceManager;
