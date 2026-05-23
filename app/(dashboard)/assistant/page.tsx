'use client';

import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Sparkles, FileText, Code, Briefcase, Lightbulb, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  {
    icon: FileText,
    title: 'Resume Review',
    prompt: 'Can you review my resume and suggest improvements?',
    color: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    icon: Code,
    title: 'Technical Question',
    prompt: 'Explain the difference between REST and GraphQL APIs',
    color: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    icon: Briefcase,
    title: 'Career Advice',
    prompt: 'What skills should I learn to become a senior developer?',
    color: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/20',
  },
  {
    icon: Lightbulb,
    title: 'Interview Prep',
    prompt: 'Give me tips for technical interviews at top tech companies',
    color: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-500/20',
  },
];

export default function AssistantPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Load conversation history from localStorage
    const savedMessages = localStorage.getItem('aiChatHistory');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    }
  }, [router]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Save conversation history to localStorage
    if (messages.length > 0) {
      localStorage.setItem('aiChatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get user context
      const careerAnalysis = localStorage.getItem('careerAnalysis');
      let userContext: any = {};

      if (careerAnalysis) {
        const analysis = JSON.parse(careerAnalysis);
        userContext = {
          skills: analysis.overallAnalysis?.strengths || [],
          careerGoals: analysis.careerRecommendations?.map((c: any) => c.title) || [],
          experience: 'Mid-level',
        };
      }

      // Build conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText.trim(),
          conversationHistory,
          userContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('aiChatHistory');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <AppShell
      title="AI Career Assistant"
      subtitle="Get personalized career advice and technical help"
    >
      <div className="max-w-4xl mx-auto">
        {/* Chat Container */}
        <div className="card p-0 mb-4 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 16rem)' }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-20 h-20 bg-gradient-to-br from-brand to-brand-dim rounded-full flex items-center justify-center mb-6"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-text-primary mb-3">
                  Hi {user?.name?.split(' ')[0]}! 👋
                </h2>
                <p className="text-text-secondary mb-8 max-w-md">
                  I'm your AI Career Assistant. I can help you with resume improvements,
                  technical questions, career advice, and interview preparation.
                </p>

                {/* Quick Prompts */}
                <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {quickPrompts.map((prompt, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleQuickPrompt(prompt.prompt)}
                      className={`p-4 rounded-xl text-left transition-all bg-gradient-to-br ${prompt.color} border ${prompt.borderColor} hover:shadow-lg`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                          <prompt.icon className="w-5 h-5 text-brand" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-text-primary mb-1">
                            {prompt.title}
                          </h3>
                          <p className="text-xs text-text-secondary line-clamp-2">{prompt.prompt}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-brand text-white'
                            : 'bg-bg-muted text-text-primary border border-border'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {message.content}
                        </div>
                        <div
                          className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-white/70' : 'text-text-muted'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-bg-muted text-text-primary border border-border rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-bg-surface p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your career, resume, or technical topics..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  rows={1}
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px',
                  }}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isLoading}
                className="btn-primary h-12 w-12 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            {messages.length > 0 && (
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-text-muted">
                  {messages.length} message{messages.length !== 1 ? 's' : ''} in conversation
                </div>
                <button
                  onClick={clearChat}
                  className="text-xs text-danger hover:underline"
                >
                  Clear chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="card p-4 bg-brand/5 border-brand/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
            <div className="text-sm text-text-secondary">
              <strong className="text-text-primary">Pro tip:</strong> I have context about your
              skills and career goals. Ask me specific questions about your resume, career path,
              or technical topics for personalized advice!
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
