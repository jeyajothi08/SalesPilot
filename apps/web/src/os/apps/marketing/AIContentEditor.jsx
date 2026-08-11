import React, { useState } from 'react';
import { Sparkles, Save, ArrowLeft, Copy, Check, FileText, Image as ImageIcon, Send, Megaphone } from 'lucide-react';

export default function AIContentEditor({ onBack }) {
  const [contentType, setContentType] = useState('blog');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('professional');
  const [provider, setProvider] = useState('openai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call to /ai/generate-content
    setTimeout(() => {
      let result = '';
      if (contentType === 'blog') {
        result = `# 5 Ways to Leverage ${topic || 'AI'} for ${audience || 'Business Growth'}\n\nIn today's rapidly evolving market, staying ahead means adopting the right tools. Here is why you should focus on this right now...\n\n## 1. Automation at scale\nBy automating repetitive tasks, your team can focus on strategy.\n\n## 2. Better insights\nData-driven decision making is no longer optional.`;
      } else if (contentType === 'email') {
        result = `Subject: Elevate your strategy with ${topic || 'our new solution'}\n\nHi [Name],\n\nI noticed that ${audience || 'your company'} is scaling fast. I wanted to reach out because we help teams like yours achieve 3x ROI using our proprietary framework.\n\nWould you be open to a 10-minute chat next Tuesday?\n\nBest,\nSalesPilot Team`;
      } else if (contentType === 'ad') {
        result = `🚀 Ready to transform ${audience || 'your workflow'}?\n\nDiscover how ${topic || 'SalesPilot'} can save you 20 hours a week.\n\n✅ Automated Outreach\n✅ Smart Analytics\n✅ AI Content Generation\n\nClick the link below to start your free trial today! 👇\n[Link]`;
      }
      setGeneratedContent(result);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full bg-black text-white p-6 md:p-8 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-light text-white tracking-tight flex items-center">
              <Sparkles size={20} className="mr-2 text-blue-400" />
              AI Content Editor
            </h1>
            <p className="text-gray-400 text-sm mt-1">Generate high-converting copy in seconds</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center text-sm">
            <Save size={16} className="mr-2" />
            Save Draft
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Controls Panel */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 overflow-y-auto">
          <h2 className="text-lg font-medium text-white mb-6">Generation Settings</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Content Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['blog', 'email', 'ad', 'social'].map(type => (
                  <button
                    key={type}
                    onClick={() => setContentType(type)}
                    className={`py-2 px-3 text-sm rounded-lg border capitalize transition-colors flex items-center justify-center ${
                      contentType === type 
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                        : 'bg-black border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {type === 'blog' && <FileText size={14} className="mr-2" />}
                    {type === 'email' && <Send size={14} className="mr-2" />}
                    {type === 'ad' && <Megaphone size={14} className="mr-2" />}
                    {type === 'social' && <ImageIcon size={14} className="mr-2" />}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Topic / Goal</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Announcing our new Q3 features"
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-blue-500 h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Target Audience</label>
              <input 
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Marketing Executives"
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tone</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">AI Model</label>
                <select 
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="openai">GPT-4o</option>
                  <option value="claude">Claude 3.5</option>
                  <option value="gemini">Gemini 1.5 Pro</option>
                  <option value="deepseek">DeepSeek V3</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-4"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editor / Preview Panel */}
        <div className="lg:col-span-2 flex flex-col bg-black border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
            <h2 className="text-sm font-medium text-white">Preview</h2>
            <button 
              onClick={handleCopy}
              disabled={!generatedContent}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </div>
          <div className="flex-1 p-0">
            <textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              placeholder="Your AI-generated content will appear here..."
              className="w-full h-full bg-transparent border-none p-6 text-white text-sm leading-relaxed focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
