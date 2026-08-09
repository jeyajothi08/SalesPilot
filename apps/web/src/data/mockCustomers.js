export const mockCustomers = [
  {
    id: 1,
    name: 'Michael Scott',
    company: 'Dunder Mifflin',
    phone: '+1 (555) 123-4567',
    email: 'mscott@dundermifflin.com',
    website: 'www.dundermifflin.com',
    location: 'Scranton, PA',
    industry: 'Paper Supplies',
    type: 'Enterprise',
    service: 'SaaS Demo',
    budget: '$50,000/yr',
    priority: 'High',
    score: 92,
    status: 'Hot Lead',
    assignedAI: 'SalesBot Alpha',
    createdDate: 'Oct 24, 2026',
    tags: ['Enterprise', 'B2B', 'Urgent'],
    summary: 'Michael is looking to automate their sales follow-ups. They currently rely on manual phone calls. Budget is high. Highly interested in voice AI. Meeting booked for Friday.',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Scott&background=2563EB&color=fff'
  },
  {
    id: 2,
    name: 'Jim Halpert',
    company: 'Athlead',
    phone: '+1 (555) 234-5678',
    email: 'jim@athlead.com',
    website: 'www.athlead.com',
    location: 'Philadelphia, PA',
    industry: 'Sports Marketing',
    type: 'Startup',
    service: 'Consulting',
    budget: '$15,000/yr',
    priority: 'Medium',
    score: 65,
    status: 'Warm Lead',
    assignedAI: 'SalesBot Beta',
    createdDate: 'Oct 25, 2026',
    tags: ['Startup', 'Sports'],
    summary: 'Jim wants to explore AI for generating outreach emails to athletes. Still evaluating ROI.',
    avatar: 'https://ui-avatars.com/api/?name=Jim+Halpert&background=10B981&color=fff'
  },
  {
    id: 3,
    name: 'Pam Beesly',
    company: 'Freelance Art',
    phone: '+1 (555) 345-6789',
    email: 'pam@pambeeslyart.com',
    website: 'www.pambeeslyart.com',
    location: 'Austin, TX',
    industry: 'Design',
    type: 'Freelancer',
    service: 'Web Design',
    budget: '$2,000',
    priority: 'Low',
    score: 98,
    status: 'Converted',
    assignedAI: 'SalesBot Alpha',
    createdDate: 'Oct 20, 2026',
    tags: ['Freelancer', 'Design'],
    summary: 'Successfully purchased the basic Web Design package. Ensure onboarding email is sent.',
    avatar: 'https://ui-avatars.com/api/?name=Pam+Beesly&background=9333EA&color=fff'
  },
  {
    id: 4,
    name: 'Dwight Schrute',
    company: 'Schrute Farms',
    phone: '+1 (555) 456-7890',
    email: 'dwight@schrute.farms',
    website: 'www.schrutefarms.com',
    location: 'Scranton, PA',
    industry: 'Agriculture',
    type: 'Small Business',
    service: 'Agriculture AI',
    budget: '$5,000',
    priority: 'Low',
    score: 15,
    status: 'Not Interested',
    assignedAI: 'SalesBot Gamma',
    createdDate: 'Oct 22, 2026',
    tags: ['Agriculture', 'B2C'],
    summary: 'Dwight prefers manual labor and traditional sales. Explicitly told the AI to stop calling.',
    avatar: 'https://ui-avatars.com/api/?name=Dwight+Schrute&background=F59E0B&color=fff'
  },
  {
    id: 5,
    name: 'Stanley Hudson',
    company: 'Crossword Co',
    phone: '+1 (555) 567-8901',
    email: 'stanley@crossword.co',
    website: 'www.crossword.co',
    location: 'Florida',
    industry: 'Publishing',
    type: 'Small Business',
    service: 'Retirement Plan AI',
    budget: '$10,000',
    priority: 'Medium',
    score: 80,
    status: 'Proposal Sent',
    assignedAI: 'SalesBot Alpha',
    createdDate: 'Oct 26, 2026',
    tags: ['Publishing'],
    summary: 'Requested a proposal on Tuesday. Awaiting response. Very interested in hands-off automation.',
    avatar: 'https://ui-avatars.com/api/?name=Stanley+Hudson&background=EF4444&color=fff'
  }
];

export const getStatusBadge = (status) => {
  switch(status) {
    case 'Hot Lead': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30';
    case 'Warm Lead': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30';
    case 'Cold Lead': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30';
    case 'Interested': return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30';
    case 'Meeting Booked': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30';
    case 'Proposal Sent': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30';
    case 'Converted': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30';
    case 'Not Interested': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30';
    case 'Lost': return 'bg-zinc-800 text-zinc-100 border-zinc-700 dark:bg-zinc-100 dark:text-zinc-800';
    default: return 'bg-gray-100 text-gray-700';
  }
};
