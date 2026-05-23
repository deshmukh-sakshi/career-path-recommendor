'use client';

import { motion } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const fastestGrowingRoles = [
  { role: 'AI/ML Engineer', growth: 42 },
  { role: 'Data Scientist', growth: 38 },
  { role: 'Cloud Architect', growth: 35 },
  { role: 'Cybersecurity Analyst', growth: 32 },
  { role: 'DevOps Engineer', growth: 29 },
  { role: 'Product Manager', growth: 24 },
];

const skillDemand = [
  { rank: 1, skill: 'Generative AI', trend: '↑↑', reason: 'ChatGPT & LLM explosion' },
  { rank: 2, skill: 'Cloud Computing', trend: '↑↑', reason: 'Enterprise migration continues' },
  { rank: 3, skill: 'Cybersecurity', trend: '↑', reason: 'Rising threat landscape' },
  { rank: 4, skill: 'Data Analysis', trend: '↑', reason: 'Data-driven decision making' },
  { rank: 5, skill: 'DevOps', trend: '↑', reason: 'CI/CD adoption growing' },
  { rank: 6, skill: 'UX Design', trend: '→', reason: 'Steady demand across industries' },
];

const salaryIntelligence = [
  {
    role: 'AI/ML Engineer',
    avgSalary: '₹12.5L',
    range: '₹10L - ₹15L',
    yoyChange: '+12%',
    demand: 'Very High',
    isRecommended: true,
  },
  {
    role: 'Data Scientist',
    avgSalary: '₹11.2L',
    range: '₹9L - ₹13.3L',
    yoyChange: '+9%',
    demand: 'Very High',
    isRecommended: false,
  },
  {
    role: 'Cloud Architect',
    avgSalary: '₹13.3L',
    range: '₹10.8L - ₹15.8L',
    yoyChange: '+11%',
    demand: 'High',
    isRecommended: false,
  },
  {
    role: 'Product Manager',
    avgSalary: '₹11.8L',
    range: '₹9.5L - ₹14.1L',
    yoyChange: '+7%',
    demand: 'High',
    isRecommended: false,
  },
  {
    role: 'DevOps Engineer',
    avgSalary: '₹10.6L',
    range: '₹8.7L - ₹12.9L',
    yoyChange: '+10%',
    demand: 'High',
    isRecommended: false,
  },
];

const wefForecast = [
  { label: '170M', description: 'New jobs created by 2030' },
  { label: '92M', description: 'Jobs displaced by automation' },
  { label: '22%', description: 'Jobs in transformation' },
  { label: '39%', description: 'Skills changing by 2027' },
];

const trendingTopics = [
  {
    icon: '🤖',
    title: 'Generative AI Revolution',
    description: 'ChatGPT, Midjourney, and LLMs are transforming how we work. Companies are racing to integrate AI into products.',
    impact: 'High',
    color: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    icon: '🔐',
    title: 'Zero Trust Security',
    description: 'With remote work, traditional perimeter security is dead. Zero trust architecture is the new standard.',
    impact: 'High',
    color: 'from-red-500/10 to-orange-500/10',
    borderColor: 'border-red-500/20',
  },
  {
    icon: '☁️',
    title: 'Multi-Cloud Strategy',
    description: 'Companies are moving beyond single cloud providers. AWS + Azure + GCP expertise is highly valued.',
    impact: 'Medium',
    color: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    icon: '⚡',
    title: 'Edge Computing',
    description: 'Processing data closer to the source. IoT, 5G, and real-time applications are driving this trend.',
    impact: 'Medium',
    color: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/20',
  },
];

const techJargon = [
  {
    term: 'Forward Deployed Engineer',
    shortDesc: 'Engineers who work directly at client sites',
    fullDesc: 'A software engineer who works on-site with clients to understand their problems deeply and build custom solutions. Think of it as being a technical consultant who codes. Popular at companies like Palantir.',
    example: 'Working at a bank to build fraud detection systems',
    salary: '₹15L - ₹25L',
    companies: ['Palantir', 'Stripe', 'Scale AI'],
  },
  {
    term: 'Site Reliability Engineer (SRE)',
    shortDesc: 'DevOps + Software Engineering hybrid',
    fullDesc: 'Combines software engineering and systems administration to build and run large-scale, distributed systems. Focus on automation, monitoring, and keeping services running 24/7.',
    example: 'Ensuring Netflix stays online during peak hours',
    salary: '₹12L - ₹20L',
    companies: ['Google', 'Netflix', 'Amazon'],
  },
  {
    term: 'Platform Engineer',
    shortDesc: 'Builds tools for other developers',
    fullDesc: 'Creates internal platforms, tools, and infrastructure that make other developers more productive. Think of it as building the foundation that others build on top of.',
    example: 'Creating a deployment system used by 100+ engineers',
    salary: '₹14L - ₹22L',
    companies: ['Uber', 'Airbnb', 'Spotify'],
  },
  {
    term: 'MLOps Engineer',
    shortDesc: 'DevOps for Machine Learning',
    fullDesc: 'Bridges the gap between data scientists and production systems. Deploys, monitors, and maintains ML models at scale. Combines ML knowledge with DevOps practices.',
    example: 'Deploying recommendation models that serve millions',
    salary: '₹13L - ₹21L',
    companies: ['Meta', 'Google', 'Microsoft'],
  },
  {
    term: 'Developer Advocate',
    shortDesc: 'Technical evangelist and community builder',
    fullDesc: 'A developer who represents a company to the developer community. Creates content, speaks at conferences, and helps developers succeed with the company\'s products.',
    example: 'Creating tutorials and demos for a new API',
    salary: '₹10L - ₹18L',
    companies: ['Vercel', 'MongoDB', 'Twilio'],
  },
  {
    term: 'Growth Engineer',
    shortDesc: 'Engineering + Marketing + Data',
    fullDesc: 'Uses engineering skills to drive user growth and engagement. Runs experiments, builds growth features, and analyzes data to optimize conversion funnels.',
    example: 'A/B testing signup flows to increase conversions',
    salary: '₹11L - ₹19L',
    companies: ['Dropbox', 'Notion', 'Figma'],
  },
];

export default function TrendsPage() {
  return (
    <AppShell title="Market Trends" subtitle="Live market intelligence and career insights">
      <div className="space-y-6">
        {/* Header with Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-3xl font-display">Live Market Intelligence</h1>
          <div className="text-sm text-text-secondary">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </motion.div>

        {/* Row 1: Stat Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { value: '1.1M+', label: 'Tech jobs available' },
            { value: '+29%', label: 'AI/ML growth YoY' },
            { value: '2.5yr', label: 'Skill half-life' },
            { value: '39%', label: 'Skills changing by 2027' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-6"
            >
              <div className="text-4xl font-bold text-brand mb-2">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Row 2: Charts Side by Side */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Fastest Growing Roles Chart */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-2xl font-display mb-6">Fastest-Growing Roles</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fastestGrowingRoles} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis dataKey="role" type="category" width={150} stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value}%`, 'Growth']}
                />
                <Bar dataKey="growth" fill="var(--brand)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Skill Demand Grid */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-2xl font-display mb-6">Top Skill Demand</h2>
            <div className="grid grid-cols-2 gap-4">
              {skillDemand.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="p-4 bg-bg-muted rounded-lg border border-border hover:border-brand/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl font-bold text-brand">#{item.rank}</span>
                    <span className="text-xl">{item.trend}</span>
                  </div>
                  <h3 className="font-semibold mb-1">{item.skill}</h3>
                  <p className="text-xs text-text-secondary">{item.reason}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Row 3: Salary Intelligence Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h2 className="text-2xl font-display mb-6">Salary Intelligence</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    Avg Salary
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    Range
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    YoY Change
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    Demand
                  </th>
                </tr>
              </thead>
              <tbody>
                {salaryIntelligence.map((item, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className={`border-b border-border ${
                      item.isRecommended ? 'bg-brand/10' : ''
                    } hover:bg-bg-elevated transition-colors`}
                  >
                    <td className="py-4 px-4 font-medium">
                      {item.role}
                      {item.isRecommended && (
                        <span className="ml-2 px-2 py-1 bg-brand text-bg-base text-xs rounded">
                          Your top match
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-brand font-semibold">{item.avgSalary}</td>
                    <td className="py-4 px-4 text-text-secondary">{item.range}</td>
                    <td className="py-4 px-4 text-success font-semibold">{item.yoyChange}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.demand === 'Very High'
                            ? 'bg-success/20 text-success'
                            : 'bg-brand/20 text-brand'
                        }`}
                      >
                        {item.demand}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Row 4: Trending Topics */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display">🔥 What's Trending in Tech</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {trendingTopics.map((topic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className={`card p-6 bg-gradient-to-br ${topic.color} border ${topic.borderColor} hover:shadow-lg transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{topic.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-text-primary">{topic.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        topic.impact === 'High' 
                          ? 'bg-danger/20 text-danger' 
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {topic.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Row 5: Tech Jargon Explained */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display">💡 Tech Jargon Explained</h2>
            <span className="text-sm text-text-secondary">Decode the buzzwords</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techJargon.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                className="card p-6 hover:shadow-elevated transition-all group"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-brand transition-colors">
                    {item.term}
                  </h3>
                  <p className="text-xs text-brand font-semibold mb-3">{item.shortDesc}</p>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {item.fullDesc}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-text-secondary mt-0.5">💼</span>
                    <div className="flex-1">
                      <div className="text-xs text-text-secondary mb-1">Example:</div>
                      <div className="text-sm text-text-primary">{item.example}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-text-secondary mb-1">Salary Range</div>
                      <div className="text-sm font-bold text-success">{item.salary}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-text-secondary mb-2">Hiring Companies:</div>
                    <div className="flex flex-wrap gap-1">
                      {item.companies.map((company, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-bg-muted text-text-primary text-xs rounded border border-border"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Row 6: WEF 2025 Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h2 className="text-2xl font-display mb-6">WEF 2025 Future of Jobs Forecast</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {wefForecast.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="text-center p-6 bg-bg-muted rounded-lg border border-border"
              >
                <div className="text-5xl font-bold text-brand mb-3">{item.label}</div>
                <div className="text-sm text-text-secondary">{item.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
