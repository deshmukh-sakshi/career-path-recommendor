'use client';

import { motion } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import ProfileScore from '@/components/dashboard/ProfileScore';
import CareerCard from '@/components/dashboard/CareerCard';
import { useEffect, useState } from 'react';

// Mock data - will be replaced with real API calls
const mockCareerMatches = [
  {
    id: '1',
    title: 'AI/ML Engineer',
    salary: '$145K avg',
    demand: 'High demand',
    timeline: '2–3 yr path',
    matchScore: 92,
    skills: {
      have: ['Python', 'TensorFlow'],
      need: ['MLOps', 'LLM fine-tuning'],
    },
    isBestFit: true,
  },
  {
    id: '2',
    title: 'Data Scientist',
    salary: '$125K avg',
    demand: 'Very high demand',
    timeline: '1–2 yr',
    matchScore: 85,
    skills: {
      have: ['SQL', 'Statistics'],
      need: ['Spark'],
    },
  },
  {
    id: '3',
    title: 'Cloud Architect',
    salary: '$155K avg',
    demand: 'Growing fast',
    timeline: '3–4 yr path',
    matchScore: 71,
    skills: {
      have: ['AWS', 'Docker'],
      need: ['Kubernetes', 'Terraform'],
    },
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <AppShell
      title={`Good morning, ${user?.name?.split(' ')[0] || 'there'} 👋`}
      subtitle="3 new career matches since yesterday"
    >
      {/* Profile Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ProfileScore score={user?.profileScore || 74} change={8} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="text-text-secondary text-sm mb-2">Skills Mapped</div>
          <div className="text-4xl font-display text-text-primary mb-1">23</div>
          <div className="text-xs text-text-muted mb-3">5 gaps identified</div>
          <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full" style={{ width: '82%' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="text-text-secondary text-sm mb-2">Market Demand</div>
          <div className="text-2xl font-semibold text-success mb-1">HIGH</div>
          <div className="text-xs text-text-muted">AI/ML roles ↑ 29% YoY</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="text-text-secondary text-sm mb-2">Next Best Action</div>
          <div className="text-sm font-medium mb-1">Complete LLM certification</div>
          <div className="text-xs text-brand mb-3">+18% match score</div>
          <button className="btn-primary text-xs px-3 py-1.5">Do it →</button>
        </motion.div>
      </div>

      {/* Career Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display">Your career matches</h2>
          <div className="flex gap-2">
            {['All', 'Best fit', 'Fastest path', 'Highest salary', 'Saved'].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filter === 'All'
                    ? 'bg-brand text-bg-base'
                    : 'bg-bg-surface text-text-secondary hover:bg-bg-elevated'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 mb-6">
          {mockCareerMatches.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <CareerCard {...career} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button className="text-brand hover:text-brand-dim transition-colors">
            See all 12 matches →
          </button>
        </div>
      </motion.div>

      {/* Secondary Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Peer Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">How professionals like you moved</h3>
          <p className="text-sm text-text-secondary mb-4">
            Based on collaborative filtering
          </p>

          <div className="space-y-3">
            {[
              { role: 'ML Engineer', percentage: 68 },
              { role: 'Data Scientist', percentage: 44 },
              { role: 'Product Manager', percentage: 31 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">→ {item.role}</span>
                    <span className="text-sm text-brand font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-text-muted mt-4">
            Based on 847 profiles matching yours
          </p>
        </motion.div>

        {/* AI Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">AI Career Assistant</h3>

          <div className="space-y-4 mb-4">
            <div className="bg-bg-elevated p-4 rounded-lg">
              <p className="text-sm text-text-secondary">
                Based on your resume, your fastest path to ML Engineer is TensorFlow
                certification. 87 similar profiles finished this in 4–6 months.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask me anything about your career..."
              className="input-dark flex-1 text-sm"
            />
            <button className="btn-primary px-4 py-2 text-sm">Send</button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
