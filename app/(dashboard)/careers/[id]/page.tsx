'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockCareerData = {
  '1': {
    title: 'AI/ML Engineer',
    avgSalary: '$150K',
    demand: 'Very High',
    growth: '+42%',
    timeline: '2-3 years',
    matchScore: 92,
    description: `AI/ML Engineers design, build, and deploy machine learning models that solve real-world problems. You'll work with large datasets, train neural networks, and optimize algorithms for production environments. This role combines software engineering with data science, requiring both coding expertise and statistical knowledge.

The field is rapidly evolving with new frameworks and techniques emerging constantly. You'll collaborate with data scientists, software engineers, and product teams to integrate AI capabilities into products. Strong programming skills in Python, understanding of ML frameworks like TensorFlow or PyTorch, and knowledge of cloud platforms are essential.

Career growth is exceptional, with opportunities to specialize in computer vision, NLP, reinforcement learning, or MLOps. Senior roles involve architecting ML systems, leading teams, and defining AI strategy for organizations.`,
    jobTitles: [
      'Machine Learning Engineer',
      'AI Engineer',
      'Deep Learning Engineer',
      'ML Platform Engineer',
      'Applied Scientist',
    ],
    topCompanies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'OpenAI', 'Anthropic'],
    salaryRange: { min: 120, max: 180 },
    remoteFriendly: 'Very High',
    topIndustries: ['Tech', 'Finance', 'Healthcare', 'Automotive'],
    skills: [
      { name: 'Python', userLevel: 85, requiredLevel: 90 },
      { name: 'TensorFlow/PyTorch', userLevel: 70, requiredLevel: 85 },
      { name: 'MLOps', userLevel: 40, requiredLevel: 75 },
      { name: 'LLM Fine-tuning', userLevel: 30, requiredLevel: 70 },
      { name: 'Cloud (AWS/GCP)', userLevel: 60, requiredLevel: 80 },
      { name: 'SQL', userLevel: 75, requiredLevel: 70 },
    ],
    learningPath: [
      {
        priority: 'CRITICAL',
        title: 'MLOps Specialization',
        provider: 'Coursera',
        duration: '3 months',
        cost: '$49/mo',
        impact: '+23%',
      },
      {
        priority: 'CRITICAL',
        title: 'LLM Bootcamp',
        provider: 'Full Stack Deep Learning',
        duration: '6 weeks',
        cost: 'Free',
        impact: '+18%',
      },
      {
        priority: 'RECOMMENDED',
        title: 'Advanced PyTorch',
        provider: 'Udacity',
        duration: '2 months',
        cost: '$399',
        impact: '+12%',
      },
      {
        priority: 'OPTIONAL',
        title: 'AWS ML Specialty',
        provider: 'AWS Training',
        duration: '4 weeks',
        cost: '$300',
        impact: '+8%',
      },
    ],
    salaryTrend: [
      { year: '2020', salary: 115 },
      { year: '2021', salary: 125 },
      { year: '2022', salary: 138 },
      { year: '2023', salary: 145 },
      { year: '2024', salary: 150 },
      { year: '2025', salary: 158 },
    ],
    jobPostings: [
      { month: 'Jan', count: 2400 },
      { month: 'Feb', count: 2600 },
      { month: 'Mar', count: 2900 },
      { month: 'Apr', count: 3200 },
      { month: 'May', count: 3500 },
      { month: 'Jun', count: 3800 },
    ],
    geoDemand: [
      { city: 'San Francisco', jobs: 1240 },
      { city: 'New York', jobs: 980 },
      { city: 'Seattle', jobs: 850 },
      { city: 'Austin', jobs: 620 },
      { city: 'Boston', jobs: 580 },
    ],
    similarRoles: [
      {
        id: '2',
        title: 'Data Scientist',
        matchScore: 85,
        salary: '$110K - $160K',
      },
      {
        id: '3',
        title: 'Cloud Architect',
        matchScore: 78,
        salary: '$130K - $190K',
      },
      {
        id: '7',
        title: 'Research Scientist',
        matchScore: 81,
        salary: '$140K - $200K',
      },
    ],
  },
};

const tabs = ['Overview', 'Required Skills', 'Learning Path', 'Market Data', 'Similar Roles'];

export default function CareerDetailPage() {
  const params = useParams();
  const careerId = params.id as string;
  const [activeTab, setActiveTab] = useState('Overview');
  const [saved, setSaved] = useState(false);

  const career = mockCareerData[careerId as keyof typeof mockCareerData] || mockCareerData['1'];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Hero Band */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-display mb-4">{career.title}</h1>
              <div className="flex flex-wrap gap-6 text-text-secondary">
                <div>
                  <div className="text-xs uppercase tracking-wide mb-1">Avg Salary</div>
                  <div className="text-xl font-semibold text-text-primary">{career.avgSalary}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide mb-1">Demand</div>
                  <div className="text-xl font-semibold text-success">{career.demand}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide mb-1">Growth Rate</div>
                  <div className="text-xl font-semibold text-brand">{career.growth}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide mb-1">Timeline</div>
                  <div className="text-xl font-semibold text-text-primary">{career.timeline}</div>
                </div>
              </div>
            </div>

            {/* Match Arc */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="var(--bg-muted)"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 56 * (1 - career.matchScore / 100),
                    }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-brand">{career.matchScore}%</div>
                  <div className="text-xs text-text-secondary">Match</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`btn-ghost ${saved ? 'border-brand text-brand' : ''}`}
                >
                  {saved ? '♥' : '♡'} Save path
                </button>
                <button className="btn-primary">→ Start analysis</button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'text-brand border-b-2 border-brand'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'Overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="card p-6">
                  <h2 className="text-2xl font-display mb-4">About this role</h2>
                  <div className="space-y-4 text-text-secondary leading-relaxed">
                    {career.description.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-4">Typical Job Titles</h3>
                  <div className="flex flex-wrap gap-2">
                    {career.jobTitles.map((title, i) => (
                      <span
                        key={i}
                        className="px-3 py-2 bg-bg-muted rounded-lg text-sm text-text-primary"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-4">Top Hiring Companies</h3>
                  <div className="flex flex-wrap gap-2">
                    {career.topCompanies.map((company, i) => (
                      <span
                        key={i}
                        className="px-3 py-2 bg-brand/10 border border-brand/30 rounded-lg text-sm text-brand"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-4">Salary Range</h3>
                  <div className="text-3xl font-bold text-brand mb-2">
                    ${career.salaryRange.min}K - ${career.salaryRange.max}K
                  </div>
                  <div className="text-sm text-text-secondary">Annual (USD)</div>
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-4">Remote Friendly</h3>
                  <div className="text-2xl font-bold text-success">{career.remoteFriendly}</div>
                  <div className="text-sm text-text-secondary mt-2">
                    Most positions offer remote or hybrid options
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-4">Top Industries</h3>
                  <div className="space-y-2">
                    {career.topIndustries.map((industry, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand" />
                        <span className="text-text-primary">{industry}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Required Skills' && (
            <div className="card p-6">
              <h2 className="text-2xl font-display mb-6">Skill Requirements</h2>
              <div className="space-y-6">
                {career.skills.map((skill, i) => {
                  const gap = skill.userLevel - skill.requiredLevel;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-text-secondary">
                            Your level: {skill.userLevel}%
                          </span>
                          <span className="text-text-secondary">
                            Required: {skill.requiredLevel}%
                          </span>
                          <span
                            className={`font-semibold ${
                              gap >= 0 ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {gap >= 0 ? '+' : ''}
                            {gap}%
                          </span>
                        </div>
                      </div>
                      <div className="relative h-8 bg-bg-muted rounded-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.userLevel}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`absolute h-full ${
                            gap >= 0 ? 'bg-brand' : gap >= -15 ? 'bg-warning' : 'bg-danger'
                          }`}
                        />
                        <div
                          className="absolute h-full border-r-2 border-dashed border-white"
                          style={{ left: `${skill.requiredLevel}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'Learning Path' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-2xl font-display mb-6">Recommended Learning Path</h2>
                <div className="space-y-4">
                  {career.learningPath.map((course, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${
                        course.priority === 'CRITICAL'
                          ? 'border-danger bg-danger/5'
                          : course.priority === 'RECOMMENDED'
                          ? 'border-warning bg-warning/5'
                          : 'border-brand bg-brand/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                course.priority === 'CRITICAL'
                                  ? 'bg-danger text-white'
                                  : course.priority === 'RECOMMENDED'
                                  ? 'bg-warning text-white'
                                  : 'bg-brand text-bg-base'
                              }`}
                            >
                              {course.priority}
                            </span>
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                            <span>📚 {course.provider}</span>
                            <span>⏱️ {course.duration}</span>
                            <span>💰 {course.cost}</span>
                            <span className="text-brand font-semibold">
                              Match impact: {course.impact}
                            </span>
                          </div>
                        </div>
                        <button className="btn-primary whitespace-nowrap">Start learning →</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4">Total Investment</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-brand mb-2">~$750</div>
                    <div className="text-sm text-text-secondary">Total cost</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-brand mb-2">5-6 months</div>
                    <div className="text-sm text-text-secondary">Time commitment</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Market Data' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-2xl font-display mb-6">Salary Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={career.salaryTrend}>
                    <defs>
                      <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="year" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="salary"
                      stroke="var(--brand)"
                      strokeWidth={2}
                      fill="url(#salaryGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-6">
                <h2 className="text-2xl font-display mb-6">Job Posting Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={career.jobPostings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="var(--brand)"
                      strokeWidth={3}
                      dot={{ fill: 'var(--brand)', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-6">
                <h2 className="text-2xl font-display mb-6">Geographic Demand</h2>
                <div className="space-y-3">
                  {career.geoDemand.map((location, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="font-medium">{location.city}</span>
                      <div className="flex items-center gap-4 flex-1 max-w-md ml-6">
                        <div className="flex-1 h-2 bg-bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(location.jobs / 1240) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="h-full bg-brand rounded-full"
                          />
                        </div>
                        <span className="text-text-secondary text-sm w-20 text-right">
                          {location.jobs} jobs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Similar Roles' && (
            <div className="grid md:grid-cols-3 gap-6">
              {career.similarRoles.map((role, i) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-6 hover:border-brand/30 transition-all cursor-pointer group"
                >
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-brand transition-colors">
                    {role.title}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Match Score</div>
                      <div className="text-2xl font-bold text-brand">{role.matchScore}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Salary Range</div>
                      <div className="text-lg font-semibold">{role.salary}</div>
                    </div>
                  </div>
                  <button className="mt-4 text-brand text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View details →
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}
