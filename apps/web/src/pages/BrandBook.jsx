import React from 'react';
import { Logo } from '../design-system/brand/Logo';
import { BrandColors } from '../design-system/brand/BrandColors';
import { Button } from '../design-system/atoms/Button';

export const BrandBook = () => {
  return (
    <div className="min-h-screen bg-ds-background text-ds-text-primary p-12 md:p-24 selection:bg-ds-accent selection:text-white font-sans">
       
       <header className="mb-24 border-b border-ds-border pb-12">
          <h1 className="text-6xl font-extrabold tracking-tighter mb-4">SalesPilot Brand Identity</h1>
          <p className="text-xl text-ds-text-secondary">The official design system and visual language.</p>
       </header>

       {/* Logo Rules */}
       <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8">1. Logo System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* Primary */}
             <div className="p-12 bg-black border border-ds-border rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent"></div>
                <Logo variant="primary" size="xl" className="relative z-10" />
                <span className="absolute bottom-4 left-6 text-xs font-bold text-ds-text-tertiary uppercase">Primary Mark</span>
             </div>

             {/* Monochrome */}
             <div className="p-12 bg-black border border-ds-border rounded-3xl flex flex-col items-center justify-center relative">
                <Logo variant="monochrome" size="xl" />
                <span className="absolute bottom-4 left-6 text-xs font-bold text-ds-text-tertiary uppercase">Monochrome</span>
             </div>

             {/* Icon Only */}
             <div className="p-12 bg-black border border-ds-border rounded-3xl flex flex-col items-center justify-center relative">
                <Logo variant="icon-only" size="xl" />
                <span className="absolute bottom-4 left-6 text-xs font-bold text-ds-text-tertiary uppercase">Icon Only (App/Favicon)</span>
             </div>

             {/* Scaling */}
             <div className="p-12 bg-black border border-ds-border rounded-3xl flex items-center justify-center gap-8 relative">
                <Logo size="lg" />
                <Logo size="md" />
                <Logo size="sm" />
                <span className="absolute bottom-4 left-6 text-xs font-bold text-ds-text-tertiary uppercase">Responsive Scaling</span>
             </div>

          </div>
       </section>

       {/* Color Tokens */}
       <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8">2. Color Tokens</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             
             {Object.entries(BrandColors).map(([category, colors]) => (
                <div key={category} className="col-span-2 md:col-span-4 mb-4 mt-8 first:mt-0">
                   <h3 className="text-lg font-bold capitalize text-ds-text-secondary border-b border-ds-border pb-2 mb-4">{category}</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(colors).map(([name, hex]) => (
                         <div key={name} className="flex flex-col">
                            <div className="h-24 rounded-xl border border-white/10 mb-3 shadow-lg" style={{ background: hex }}></div>
                            <div className="flex justify-between items-center px-1">
                               <span className="text-sm font-bold capitalize">{name}</span>
                               <span className="text-xs text-ds-text-tertiary uppercase font-mono">{hex}</span>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             ))}

          </div>
       </section>

       {/* Typography */}
       <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8">3. Typography</h2>
          <div className="p-12 bg-ds-surface border border-ds-border rounded-3xl space-y-12">
             
             <div className="flex flex-col md:flex-row gap-8 items-start md:items-end border-b border-ds-border pb-8">
                <div className="w-48 text-sm text-ds-text-secondary uppercase tracking-widest font-bold">Display (H1)</div>
                <div className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-none">Outfit.</div>
             </div>

             <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-ds-border pb-8">
                <div className="w-48 text-sm text-ds-text-secondary uppercase tracking-widest font-bold">Headers (H2-H4)</div>
                <div className="text-3xl font-bold">Inter SemiBold.</div>
             </div>

             <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-ds-border pb-8">
                <div className="w-48 text-sm text-ds-text-secondary uppercase tracking-widest font-bold">Body</div>
                <div className="text-base text-ds-text-secondary max-w-xl">Inter Regular. Used for all long-form reading, dashboards, and OS UI elements to maximize legibility.</div>
             </div>

             <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-48 text-sm text-ds-text-secondary uppercase tracking-widest font-bold">UI Actions</div>
                <div className="flex gap-4">
                   <Button variant="primary">Primary Action</Button>
                   <Button variant="ghost">Secondary</Button>
                </div>
             </div>

          </div>
       </section>

    </div>
  );
};

export default BrandBook;
