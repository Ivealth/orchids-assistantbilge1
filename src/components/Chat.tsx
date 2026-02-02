'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowUp, 
  Sparkles,
  Search,
  BookOpen,
  History,
  Hash,
  Maximize2,
  Copy,
  RotateCcw,
  Menu,
  X,
  Plus,
  Image as ImageIcon,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Moon,
  Sun,
  ChevronDown,
  BrainCircuit,
  FileText,
  FolderOpen,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { useTheme } from 'next-themes';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  feedback?: 'helpful' | 'unhelpful';
  feedbackComment?: string;
  feedbackSubmitted?: boolean;
}

const ThoughtBlock = ({ thought, isStreaming }: { thought: string; isStreaming?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!thought && !isStreaming) return null;

  return (
    <div className="mb-3 w-full max-w-[70ch]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/[0.06] dark:bg-white/[0.03] border border-black/20 dark:border-white/[0.05] hover:bg-black/[0.1] dark:hover:bg-white/[0.05] transition-all group"
        >
        <div className="w-5 h-5 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <BrainCircuit className={`w-3.5 h-3.5 text-indigo-500 ${isStreaming ? 'animate-pulse' : ''}`} />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
          {isStreaming ? 'Thinking...' : 'Thought Process'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-black/20 dark:text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 rounded-2xl bg-black/[0.05] dark:bg-white/[0.02] border border-black/20 dark:border-white/[0.03] font-sans text-[13px] leading-relaxed text-black/40 dark:text-white/40 italic whitespace-pre-wrap">
              {thought}
              {isStreaming && <span className="inline-block w-1 h-3 ml-1 bg-black/10 dark:bg-white/10 animate-pulse align-middle" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const parseThought = (text: string) => {
  const thinkRegex = /<think>([\s\S]*?)<\/think>/;
  const match = text.match(thinkRegex);
  
  if (match) {
    const thought = match[1].trim();
    const content = text.replace(thinkRegex, '').trim();
    return { thought, content };
  }

  const openMatch = text.match(/<think>([\s\S]*)/);
  if (openMatch) {
    return { thought: openMatch[1].trim(), content: '' };
  }

  return { thought: '', content: text };
};

export default function Chat() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "The workspace is initialized. I am prepared to synthesize academic literature, analyze theoretical frameworks, or assist in scholarly composition. How shall we proceed with your inquiry?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'library' | 'collections' | 'manuscripts' | 'seminar'>('chat');
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [activeFeedbackIndex, setActiveFeedbackIndex] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNewInquiry = () => {
    setMessages([
      {
        role: 'assistant',
        content: "The workspace is initialized. I am prepared to synthesize academic literature, analyze theoretical frameworks, or assist in scholarly composition. How shall we proceed with your inquiry?",
      },
    ]);
    setActiveView('chat');
    setIsSidebarOpen(false);
  };

  const scrollToBottom = () => {
    // Automatic scroll disabled to prevent jumping during long responses
    /*
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    */
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, isLoading]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
    setAutoScroll(isAtBottom);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleFeedback = (index: number, feedback: 'helpful' | 'unhelpful') => {
    if (messages[index].feedbackSubmitted) return;

    if (feedback === 'helpful') {
      setMessages(prev => prev.map((msg, i) => 
        i === index ? { ...msg, feedback: 'helpful', feedbackSubmitted: true } : msg
      ));
      console.log('Feedback Recorded:', {
        messageIndex: index,
        type: 'helpful',
        timestamp: new Date().toISOString()
      });
    } else {
      setActiveFeedbackIndex(index);
      setFeedbackText('');
    }
  };

  const submitFeedback = (index: number) => {
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { 
        ...msg, 
        feedback: 'unhelpful', 
        feedbackComment: feedbackText, 
        feedbackSubmitted: true 
      } : msg
    ));
    console.log('Feedback Recorded:', {
      messageIndex: index,
      type: 'unhelpful',
      comment: feedbackText,
      timestamp: new Date().toISOString()
    });
    setActiveFeedbackIndex(null);
    setFeedbackText('');
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleRegenerate = async (index: number) => {
    if (isLoading) return;
    
    const previousMessages = messages.slice(0, index);
    const lastUserMessage = previousMessages[previousMessages.length - 1];
    
    if (!lastUserMessage || lastUserMessage.role !== 'user') return;

    const newMessages = messages.slice(0, index);
    setMessages(newMessages);
    
    handleSendWithInquiry(lastUserMessage.content, newMessages.slice(0, -1));
  };

  const handleSendWithInquiry = async (inquiry: string, context: Message[]) => {
    const userMessage: Message = { role: 'user', content: inquiry };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');
    // Removed setAutoScroll(true) to respect user preference of no automatic scroll

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...context, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch response');
      }

      const reader = response.body?.getReader();
      const textDecoder = new TextDecoder();
      let fullContent = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = textDecoder.decode(value, { stream: true });
          fullContent += chunk;
          setStreamingContent(fullContent);
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: fullContent }]);
      setStreamingContent('');
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${error.message || 'Something went wrong.'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    handleSendWithInquiry(input, messages);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 space-y-12">
        {/* Research Core */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 dark:text-white/30 block">Research Engine</span>
          <div className="space-y-2">
            <button 
              onClick={handleNewInquiry}
              className="flex items-center gap-3 text-[11px] font-bold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all w-full text-left group"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-500" />
              <span>New Inquiry</span>
            </button>
            <button 
              onClick={() => { setActiveView('library'); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 text-[11px] font-bold transition-all w-full text-left group ${activeView === 'library' ? 'text-black dark:text-white' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'}`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeView === 'library' ? 'text-indigo-500' : 'text-black/20 dark:text-white/20'}`} />
              <span>Personal Library</span>
            </button>
            <button 
              onClick={() => { setActiveView('collections'); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 text-[11px] font-bold transition-all w-full text-left group ${activeView === 'collections' ? 'text-black dark:text-white' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'}`}
            >
              <FolderOpen className={`w-3.5 h-3.5 ${activeView === 'collections' ? 'text-indigo-500' : 'text-black/20 dark:text-white/20'}`} />
              <span>Research Collections</span>
            </button>
          </div>
        </div>

        {/* Recent Syntheses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 dark:text-white/30 block">Recent Syntheses</span>
            <RotateCcw className="w-3 h-3 text-black/20 dark:text-white/20 cursor-pointer hover:text-black/40 dark:hover:text-white/40 transition-colors" />
          </div>
          <div className="space-y-4">
            <button className="group text-left block w-full">
              <p className="text-[11px] font-bold text-black/80 dark:text-white/80 leading-tight group-hover:text-indigo-500 transition-colors">Theoretical Frameworks in ML</p>
              <p className="text-[9px] font-bold text-black/30 dark:text-white/30 uppercase tracking-widest mt-1">2 hours ago</p>
            </button>
            <button className="group text-left block w-full">
              <p className="text-[11px] font-bold text-black/40 dark:text-white/40 leading-tight group-hover:text-black dark:group-hover:text-white transition-colors">Post-modern Architectural Ethics</p>
              <p className="text-[9px] font-bold text-black/20 dark:text-white/20 uppercase tracking-widest mt-1">Yesterday</p>
            </button>
          </div>
        </div>

        {/* Scholarly Workspace */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 dark:text-white/30 block">Workspace</span>
          <div className="space-y-3">
            <button 
              onClick={() => { setActiveView('manuscripts'); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 text-[11px] font-bold transition-all w-full text-left ${activeView === 'manuscripts' ? 'text-black dark:text-white' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'}`}
            >
              <FileText className={`w-3.5 h-3.5 ${activeView === 'manuscripts' ? 'text-indigo-500' : 'text-black/20 dark:text-white/20'}`} />
              <span>Manuscript Drafts</span>
            </button>
            <button 
              onClick={() => { setActiveView('seminar'); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 text-[11px] font-bold transition-all w-full text-left ${activeView === 'seminar' ? 'text-black dark:text-white' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'}`}
            >
              <Users className={`w-3.5 h-3.5 ${activeView === 'seminar' ? 'text-indigo-500' : 'text-black/20 dark:text-white/20'}`} />
              <span>Collaborative Seminar</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-auto p-6 border-t border-black/25 dark:border-white/10">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors w-full"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Night Mode'}</span>
        </button>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="flex h-dvh bg-white dark:bg-[#212121] font-sans text-black dark:text-white overflow-hidden selection:bg-black/10 dark:selection:bg-white/10">
        <aside className={`${isSidebarOpen ? 'lg:flex' : 'hidden'} hidden w-64 flex-col border-r border-black/20 dark:border-white/[0.05] bg-[#fafaf9] dark:bg-[#212121] flex-shrink-0 transition-all duration-300`}>
        <div className="h-16 flex items-center px-6">
            <Link href="/" className="flex items-center">
              {theme === 'dark' ? (
                <div className="w-44 h-10 bg-white" />
              ) : (
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/946d8ec1-7f73-4d97-b50d-4d62b78b31a3/ChatGPT-Image-Jan-23-2026-01_10_45-AM-1769161931046.png?width=8000&height=8000&resize=contain"
                  alt="Bilge Logo"
                  width={400}
                  height={120}
                  className="h-12 w-auto object-contain -ml-1"
                  priority
                />
              )}
            </Link>
        </div>
      <SidebarContent />
    </aside>

        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#212121] relative">
          {/* Floating Controls */}
          <div className="absolute top-0 left-0 right-0 h-16 flex items-center px-4 md:px-8 z-30 pointer-events-none">
            <div className="flex items-center gap-4 pointer-events-auto">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>

        <AnimatePresence>
          {isSidebarOpen && (
            <div key="mobile-sidebar-wrapper">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 lg:hidden" />
                <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-72 bg-[#fafaf9] dark:bg-[#212121] z-50 lg:hidden flex flex-col border-r border-black/25 dark:border-white/15">
                  <div className="p-6 flex items-center justify-end bg-white dark:bg-[#212121] h-16">
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                <div className="flex-1 overflow-y-auto"><SidebarContent /></div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

          <ScrollArea className="flex-1 min-h-0 bg-white dark:bg-[#212121]" onScroll={handleScroll}>
            <div className="max-w-[900px] mx-auto pt-20 pb-8 px-[1.5%] md:px-8">
              <AnimatePresence mode="wait">
                {activeView === 'chat' ? (
                  <motion.div
                    key="chat-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {messages.map((message, index) => (
                      <motion.div 
                        key={`msg-${index}`} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className={`flex w-full mb-8 last:mb-0 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end max-w-[70%]' : 'items-start w-full max-w-[97%] md:max-w-[900px]'}`}>
                          <div className={`
                            relative px-4 py-3 md:px-5 md:py-4 rounded-2xl transition-colors
                            ${message.role === 'user' 
                              ? 'bg-[#f4f4f2] dark:bg-[#2f2f2d] text-black dark:text-white rounded-tr-none' 
                              : 'w-full text-black/90 dark:text-white/90'
                            }
                          `}>
                            <div className="text-[15px] leading-[1.6] font-sans">
                              {message.role === 'assistant' ? (
                                <div className="w-full">
                                  {(() => {
                                    const { thought, content } = parseThought(message.content);
                                    return (
                                      <>
                                        {thought && <ThoughtBlock thought={thought} />}
                                        <div className="prose prose-neutral dark:prose-invert max-w-none 
                                          text-[15px]
                                          prose-p:text-[15px] prose-p:mb-5 prose-p:leading-[1.6] prose-p:first:mt-0 prose-p:last:mb-0
                                          prose-headings:font-bold prose-headings:tracking-tight prose-headings:mt-8 prose-headings:mb-4
                                          prose-ul:my-5 prose-ul:list-disc prose-ul:pl-6
                                          prose-ol:my-5 prose-ol:list-decimal prose-ol:pl-6
                                          prose-li:my-1.5
                                          prose-blockquote:border-l-2 prose-blockquote:border-black/20 dark:prose-blockquote:border-white/10 prose-blockquote:pl-4 prose-blockquote:italic
                                          prose-code:bg-black/5 dark:prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                                          prose-pre:bg-[#f8f8f8] dark:prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-black/25 dark:prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:p-4
                                          selection:bg-black/10 dark:selection:bg-white/10
                                        ">
                                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                                        </div>
                                      </>
                                    );
                                  })()}
                                  <div className="mt-6 flex flex-col gap-3 group/feedback">
                                    <div className="flex items-center gap-1.5 transition-opacity">
                                      {!message.feedbackSubmitted ? (
                                        <>
                                          <button onClick={() => handleFeedback(index, 'helpful')} className={`p-1.5 rounded-lg transition-all hover:bg-black/[0.05] dark:hover:bg-white/[0.05] ${message.feedback === 'helpful' ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'text-black/40 dark:text-white/40'}`} title="Helpful"><ThumbsUp className="w-4 h-4" /></button>
                                          <button onClick={() => handleFeedback(index, 'unhelpful')} className={`p-1.5 rounded-lg transition-all hover:bg-black/[0.05] dark:hover:bg-white/[0.05] ${message.feedback === 'unhelpful' ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'text-black/40 dark:text-white/40'}`} title="Not helpful"><ThumbsDown className="w-4 h-4" /></button>
                                        </>
                                      ) : (
                                        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/20 dark:border-white/[0.05]">
                                          {message.feedback === 'helpful' ? <ThumbsUp className="w-3.5 h-3.5 text-blue-500" /> : <ThumbsDown className="w-3.5 h-3.5 text-orange-500" />}
                                          <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">Thank you for your feedback!</span>
                                        </div>
                                      )}
                                      <div className="w-px h-3 bg-black/25 dark:bg-white/5 mx-1" />
                                      <button onClick={() => handleCopy(message.content, `copy-${index}`)} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors flex items-center gap-1.5">
                                        {copyStatus === `copy-${index}` ? <span className="text-[10px] font-bold">Copied</span> : <Copy className="w-3.5 h-3.5" />}
                                      </button>
                                      <button onClick={() => handleRegenerate(index)} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
                                    </div>
                                    {activeFeedbackIndex === index && (
                                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-2 mt-1">
                                        <p className="text-[11px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">What could be improved?</p>
                                        <div className="relative">
                                          <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Your feedback helps improve the research engine..." className="w-full p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/20 dark:border-white/[0.05] text-[13px] outline-none focus:border-indigo-500/30 transition-colors min-h-[80px] resize-none" />
                                          <div className="absolute bottom-2 right-2 flex gap-2">
                                            <button type="button" onClick={() => setActiveFeedbackIndex(null)} className="px-3 py-1 rounded-lg text-[10px] font-bold text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors">Cancel</button>
                                            <button type="button" onClick={() => submitFeedback(index)} className="px-3 py-1 rounded-lg bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold hover:opacity-80 transition-opacity">Submit</button>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="whitespace-pre-wrap break-words">{message.content}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {(streamingContent || (isLoading && !streamingContent)) && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full mb-8">
                        <div className="flex flex-col gap-2 w-full max-w-[900px]">
                          <div className="w-full text-black/90 dark:text-white/90">
                            <div className="text-[15px] leading-[1.6]">
                              {streamingContent ? (
                                <div className="w-full">
                                  {(() => {
                                    const { thought, content } = parseThought(streamingContent);
                                    return (
                                      <>
                                        {thought && <ThoughtBlock thought={thought} isStreaming={!content} />}
                                        {content && (
                                          <div className="prose prose-neutral dark:prose-invert max-w-none text-[15px] prose-p:text-[15px] prose-p:mb-5 prose-p:leading-[1.6] prose-p:first:mt-0 prose-p:last:mb-0 prose-headings:font-bold prose-headings:tracking-tight prose-headings:mt-8 prose-headings:mb-4 prose-ul:my-5 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-5 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1.5 selection:bg-black/10 dark:selection:bg-white/10">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                                            <span className="inline-block w-1.5 h-4 ml-1 bg-black/20 dark:bg-white/20 animate-pulse align-middle" />
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 py-4">
                                  <div className="w-1.5 h-1.5 bg-black/10 dark:bg-white/10 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                  <div className="w-1.5 h-1.5 bg-black/10 dark:bg-white/10 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                  <div className="w-1.5 h-1.5 bg-black/10 dark:bg-white/10 rounded-full animate-bounce" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="other-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-center mb-6">
                      {activeView === 'library' && <BookOpen className="w-8 h-8 text-indigo-500" />}
                      {activeView === 'collections' && <FolderOpen className="w-8 h-8 text-indigo-500" />}
                      {activeView === 'manuscripts' && <FileText className="w-8 h-8 text-indigo-500" />}
                      {activeView === 'seminar' && <Users className="w-8 h-8 text-indigo-500" />}
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">
                      {activeView === 'library' && 'Personal Library'}
                      {activeView === 'collections' && 'Research Collections'}
                      {activeView === 'manuscripts' && 'Manuscript Drafts'}
                      {activeView === 'seminar' && 'Collaborative Seminar'}
                    </h2>
                    <p className="text-black/40 dark:text-white/40 text-sm max-w-sm">
                      This module is currently being calibrated for Deep Intelligence System v3.0. Advanced scholarly features will be available in the next deployment cycle.
                    </p>
                    <button 
                      onClick={() => setActiveView('chat')}
                      className="mt-8 px-6 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-all active:scale-95"
                    >
                      Return to Engine
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} className="h-20" />
            </div>
          </ScrollArea>


        <div className="bg-white dark:bg-[#212121] px-4 py-4 md:py-6 flex-shrink-0 border-t border-black/20 dark:border-white/[0.08]">
          <div className="max-w-[900px] mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between px-1">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 md:gap-5 text-[10px] font-bold uppercase tracking-[0.1em] text-black/40 dark:text-white/40">
                          <div className="flex items-center gap-1.5 shrink-0"><Search className="w-3 h-3" /><span>Deep Research</span></div>
                          <div className="flex items-center gap-1.5 hover:text-black dark:hover:text-white cursor-pointer transition-colors shrink-0">
                            <FileText className="w-3 h-3" /><span>Paper template</span>
                          </div>
                          
                            <div className="relative">
                              <button 
                                type="button"
                                onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                                className="p-1.5 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-all flex items-center justify-center"
                              >
                                <div className="relative">
                                  <Plus className="w-4 h-4" />
                                  <div className="absolute inset-0 animate-pulse bg-indigo-500/20 rounded-full scale-150 -z-10" />
                                </div>
                              </button>
                              
                              <AnimatePresence>
                                {isPlusMenuOpen && (
                                      <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                          className="absolute bottom-full right-0 mb-3 w-48 bg-white dark:bg-[#2f2f2f] rounded-[4px] border border-black/5 dark:border-white/5 shadow-xl shadow-black/10 p-1.5 z-50 origin-bottom-right"

                                      >
                                    <button className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[11px] font-bold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03] rounded-[4px] transition-all group">
                                      <div className="w-5 h-5 rounded-[4px] bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                        <ImageIcon className="w-3 h-3 text-indigo-500" />
                                      </div>
                                      <span>Add files or photos</span>
                                    </button>
                                  </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        
                        <AnimatePresence>

                        {isFooterExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0, y: -5 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-5 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-black/20 dark:text-white/20 overflow-hidden"
                          >
                            <div className="flex items-center gap-1.5 hover:text-black dark:hover:text-white cursor-pointer transition-colors">
                              <Sparkles className="w-3 h-3" /><span>Scholarly Mode</span>
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-black dark:hover:text-white cursor-pointer transition-colors">
                              <FolderOpen className="w-3 h-3" /><span>Project</span>
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-black dark:hover:text-white cursor-pointer transition-colors">
                              <Users className="w-3 h-3" /><span>Seminar</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                        <div className="flex items-center gap-3">
                            <button 
                              type="button" 
                              onClick={() => setIsFooterExpanded(!isFooterExpanded)}
                              className={`p-1.5 transition-all duration-300 ${isFooterExpanded ? 'text-indigo-500 scale-110' : 'text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white'}`}
                            >
                              <Maximize2 className={`w-3.5 h-3.5 ${isFooterExpanded ? 'rotate-90' : ''} transition-transform`} />
                            </button>
                          </div>

                    </div>
                      <div className="relative flex items-center gap-3 bg-indigo-50/30 dark:bg-[#2f2f2f] rounded-lg p-1.5 pr-3 transition-all focus-within:ring-[0.5px] focus-within:ring-indigo-400/50 focus-within:shadow-sm">
                            <textarea ref={textareaRef} placeholder="Inquiry..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} disabled={isLoading} rows={1} className="flex-1 bg-transparent border-none focus:ring-0 outline-none py-3 px-4 resize-none text-[15px] max-h-48 min-h-[44px] font-normal placeholder:font-normal placeholder:text-black/30 dark:placeholder:text-white/30 placeholder:text-[15px] leading-relaxed overflow-y-auto text-black dark:text-white" />
                          <div><button type="submit" disabled={isLoading || !input.trim()} className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 ${input.trim() ? 'bg-black dark:bg-white text-indigo-500 shadow-lg shadow-black/10 dark:shadow-white/10 active:scale-95' : 'bg-black/[0.05] dark:bg-white/[0.05] text-black/10 dark:text-white/10 cursor-not-allowed'}`}><ArrowUp className="w-4 h-4 stroke-[3]" /></button></div>
                    </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
