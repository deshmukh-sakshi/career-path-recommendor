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
    avgSalary: '$150K',
    range: '$120K - $180K',
    yoyChange: '+12%',
    demand: 'Very High',
    isRecommended: true,
  },
  {
    role: 'Data Scientist',
    avgSalary: '$135K',
    range: '$110K - $160K',
    yoyChange: '+9%',
    demand: 'Very High',
    isRecommended: false,
  },
  {
    role: 'Cloud Architect',
    avgSalary: '$160K',
    range: '$130K - $190K',
    yoyChange: '+11%',
    demand: 'High',
    isRecommended: false,
  },
  {
    role: 'Product Manager',
    avgSalary: '$142K',
    range: '$115K - $170K',
    yoyChange: '+7%',
    demand: 'High',
    isRecommended: false,
  },
  {
    role: 'DevOps Engineer',
    avgSalary: '$128K',
    range: '$105K - $155K',
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

        {/* Row 4: WEF 2025 Forecast */}
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
