import React, { useState } from 'react';
import { Search, Mail, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from './atoms/Button';
import { TextInput } from './atoms/TextInput';
import { Badge } from './atoms/Badge';
import { Loader } from './atoms/Loader';
import { Card } from './molecules/Card';
import { Modal } from './organisms/Modal';
import { AIStateIndicator } from './motion/AIStates';
import { Switch } from './forms/Switch';
import { Select } from './forms/Select';
import { Checkbox } from './forms/Checkbox';
import { EnterpriseTable } from './organisms/EnterpriseTable';
import { Sidebar } from './organisms/Sidebar';

const DesignSystemPreview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [selectedValue, setSelectedValue] = useState('1');

  return (
    <div className="min-h-screen bg-ds-background pl-[256px] text-ds-text-primary selection:bg-ds-accent selection:text-white pb-32">
      
      {/* Sidebar acts as navigation for the OS */}
      <Sidebar />
      
      <div className="max-w-6xl mx-auto p-12 space-y-24">
        
        {/* Header */}
        <header className="border-b border-ds-border pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">SalesPilot Design System</h1>
          <p className="text-ds-text-secondary text-lg">A highly consistent, cinematic component library.</p>
        </header>

        {/* --- ATOMS --- */}
        <section className="space-y-8">
           <h2 className="text-2xl font-bold border-b border-ds-border pb-4">Atoms (Foundations)</h2>
           
           {/* Buttons */}
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-ds-text-secondary uppercase tracking-wider">Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center p-6 bg-ds-surface border border-ds-border rounded-ds-2xl">
                 <Button variant="primary">Primary Button</Button>
                 <Button variant="secondary">Secondary Button</Button>
                 <Button variant="outline">Outline Button</Button>
                 <Button variant="ghost">Ghost Button</Button>
                 <Button variant="danger" icon={<Trash2 className="w-4 h-4" />}>Danger</Button>
                 
                 <div className="w-full h-px bg-ds-border my-2"></div>
                 
                 <Button variant="primary" icon={<Mail className="w-4 h-4" />}>With Icon</Button>
                 <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />} className="flex-row-reverse">Icon Right</Button>
                 <Button variant="primary" isLoading>Loading</Button>
                 <Button variant="primary" isDisabled>Disabled</Button>
                 
                 <div className="w-full h-px bg-ds-border my-2"></div>

                 <Button variant="primary" size="sm">Small</Button>
                 <Button variant="primary" size="md">Medium</Button>
                 <Button variant="primary" size="lg">Large</Button>
              </div>
           </div>

           {/* Inputs */}
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-ds-text-secondary uppercase tracking-wider">Inputs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-ds-surface border border-ds-border rounded-ds-2xl">
                 <TextInput label="Standard Input" placeholder="Type something..." />
                 <TextInput label="With Icon" placeholder="Search..." icon={<Search className="w-4 h-4" />} />
                 <TextInput label="Required Field" placeholder="john@doe.com" required />
                 
                 <TextInput label="Error State" placeholder="Invalid email" error="Please enter a valid email address." />
                 <TextInput label="Success State" placeholder="Valid email" success />
                 <TextInput label="Disabled" placeholder="Cannot edit" disabled className="opacity-50" />
                 
                 <div className="col-span-1 md:col-span-2 lg:col-span-3 h-px bg-ds-border my-2"></div>
                 
                 <Select 
                   label="Dropdown Menu" 
                   value={selectedValue}
                   onChange={setSelectedValue}
                   options={[
                     { label: 'Option 1: Sales Agent', value: '1' },
                     { label: 'Option 2: Support Agent', value: '2' },
                     { label: 'Option 3: Analytics Bot', value: '3' },
                   ]} 
                 />

                 <div className="flex flex-col gap-6 justify-center pl-4">
                    <Switch checked={isToggled} onChange={setIsToggled} label="Toggle Feature" />
                    <Checkbox checked={isChecked} onChange={setIsChecked} label="Accept Terms & Conditions" />
                 </div>
              </div>
           </div>

           {/* Badges */}
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-ds-text-secondary uppercase tracking-wider">Badges</h3>
              <div className="flex flex-wrap gap-4 items-center p-6 bg-ds-surface border border-ds-border rounded-ds-2xl">
                 <Badge variant="neutral">Draft</Badge>
                 <Badge variant="success">Active</Badge>
                 <Badge variant="warning">Pending</Badge>
                 <Badge variant="danger">Failed</Badge>
                 <Badge variant="info">New Update</Badge>
                 
                 <div className="w-full h-px bg-ds-border my-2"></div>

                 <Badge variant="success" pulse>Live Call</Badge>
                 <Badge variant="warning" pulse>Analyzing</Badge>
                 <Badge variant="danger" pulse>System Alert</Badge>
              </div>
           </div>

           {/* Loaders */}
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-ds-text-secondary uppercase tracking-wider">Loaders</h3>
              <div className="flex flex-wrap gap-12 items-center p-6 bg-ds-surface border border-ds-border rounded-ds-2xl">
                 <Loader type="spinner" size="sm" />
                 <Loader type="spinner" size="md" />
                 <Loader type="spinner" size="lg" />
                 
                 <div className="w-px h-12 bg-ds-border mx-4"></div>

                 <Loader type="pulse" size="sm" />
                 <Loader type="pulse" size="md" />
                 <Loader type="pulse" size="lg" />

                 <div className="w-px h-12 bg-ds-border mx-4"></div>

                 <div className="w-48 space-y-2">
                    <Loader type="skeleton" className="h-4 w-full" />
                    <Loader type="skeleton" className="h-4 w-3/4" />
                 </div>
              </div>
           </div>

        </section>

        {/* --- MOLECULES --- */}
        <section className="space-y-8">
           <h2 className="text-2xl font-bold border-b border-ds-border pb-4">Molecules (Components)</h2>
           
           {/* Cards */}
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-ds-text-secondary uppercase tracking-wider">Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 
                 <Card variant="default">
                    <h4 className="font-bold mb-2">Default Card</h4>
                    <p className="text-sm text-ds-text-secondary">Solid background surface. No hover effects.</p>
                 </Card>

                 <Card variant="interactive" onClick={() => console.log('clicked')}>
                    <h4 className="font-bold mb-2">Interactive Card</h4>
                    <p className="text-sm text-ds-text-secondary">Hover physics enabled. Notice the subtle lift and shadow expansion.</p>
                 </Card>

                 {/* Simulated background to show off glassmorphism */}
                 <div className="relative p-6 rounded-ds-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                    <Card variant="glass" padding="p-6">
                       <h4 className="font-bold mb-2">Glass Card</h4>
                       <p className="text-sm text-ds-text-secondary">Background blur and semi-transparent borders. Best used over gradients or images.</p>
                    </Card>
                 </div>

              </div>
           </div>

        </section>

        {/* --- ORGANISMS --- */}
        <section className="space-y-8">
           <h2 className="text-2xl font-bold border-b border-ds-border pb-4">Organisms (Layouts)</h2>
           
           {/* Modals */}
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-ds-text-secondary uppercase tracking-wider">Modals & Overlays</h3>
              <div className="p-6 bg-ds-surface border border-ds-border rounded-ds-2xl flex items-center justify-center h-64">
                 
                 <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Trigger Demo Modal
                 </Button>

                 <Modal 
                   isOpen={isModalOpen} 
                   onClose={() => setIsModalOpen(false)}
                   title="Deploy AI Agent"
                   footer={
                     <>
                       <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                       <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirm Deployment</Button>
                     </>
                   }
                 >
                    <div className="space-y-4">
                       <p className="text-sm text-ds-text-secondary">Are you sure you want to deploy the Sales Agent Alpha to production? This will consume API credits.</p>
                       <TextInput label="Deployment Name" placeholder="e.g. Q4 Outreach Bot" />
                    </div>
                 </Modal>

              </div>
           </div>

         </section>

         {/* --- ENTERPRISE TABLES --- */}
         <section className="space-y-8">
            <h2 className="text-2xl font-bold border-b border-ds-border pb-4">Data Tables</h2>
            <div className="space-y-4">
               <EnterpriseTable />
            </div>
         </section>

         {/* --- MOTION --- */}
        <section className="space-y-8">
           <h2 className="text-2xl font-bold border-b border-ds-border pb-4">Motion & Interactions</h2>
           
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-ds-text-secondary uppercase tracking-wider">AI States</h3>
              <div className="flex flex-wrap gap-12 items-center justify-center p-12 bg-ds-surface border border-ds-border rounded-ds-2xl overflow-hidden relative">
                 {/* Dark mode background for AI states visibility */}
                 <div className="absolute inset-0 bg-black pointer-events-none"></div>
                 
                 <div className="flex flex-col items-center gap-4">
                    <AIStateIndicator state="idle" size="lg" />
                    <span className="text-xs font-bold text-white/50 uppercase tracking-wider relative z-10">Idle</span>
                 </div>
                 
                 <div className="flex flex-col items-center gap-4">
                    <AIStateIndicator state="listening" size="lg" />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider relative z-10">Listening</span>
                 </div>
                 
                 <div className="flex flex-col items-center gap-4">
                    <AIStateIndicator state="thinking" size="lg" />
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider relative z-10">Thinking</span>
                 </div>
                 
                 <div className="flex flex-col items-center gap-4">
                    <AIStateIndicator state="speaking" size="lg" />
                    <span className="text-xs font-bold text-green-400 uppercase tracking-wider relative z-10">Speaking</span>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-sm font-bold text-ds-text-secondary uppercase tracking-wider">Global Motion Modules</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card variant="default">
                    <h4 className="font-bold mb-2">Custom Cursor</h4>
                    <p className="text-sm text-ds-text-secondary">Magnetic trailing cursor that replaces the OS default. (Available via CustomCursor wrapper)</p>
                 </Card>
                 <Card variant="default">
                    <h4 className="font-bold mb-2">Page Transitions</h4>
                    <p className="text-sm text-ds-text-secondary">Scale & blur transitions for routing. (Available via PageTransition wrapper)</p>
                 </Card>
                 <Card variant="default">
                    <h4 className="font-bold mb-2">Ambient Background</h4>
                    <p className="text-sm text-ds-text-secondary">Slowly moving noise gradients using HTML5 Canvas. (Available via AnimatedBackground)</p>
                 </Card>
              </div>
           </div>

        </section>

      </div>
    </div>
  );
};

export default DesignSystemPreview;
