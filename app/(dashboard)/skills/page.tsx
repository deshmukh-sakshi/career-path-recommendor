'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';

const mockCareers = [
  { id: '1', title: 'AI/ML Engineer' },
  { id: '2', title: 'Data Scientist' },
  { id: '3', title: 'Cloud Architect' },
];

const mockSkillGaps = [
  { name: 'MLOps', userLevel: 40, requiredLevel: 75, gap: -35, priority: 'CRITICAL' },
  { name: 'LLM Fine-tuning', userLevel: 30, requiredLevel: 70, gap: -40, priority: 'CRITICAL' },
  { name: 'Cloud (AWS/GCP)', userLevel: 60, requiredLevel: 80, gap: -20, priority: 'RECOMMENDED' },
  { name: 'TensorFlow/PyTorch', userLevel: 70, requiredLevel: 85, gap: -15, priority: 'RECOMMENDED' },
  { name: 'Python', userLevel: 85, requiredLevel: 90, gap: -5, priority: 'OPTIONAL' },
  { name: 'SQL', userLevel: 75, requiredLevel: 70, gap: 5, priority: 'OPTIONAL' },
];

const mockLearningPath = [
  {
    priority: 'CRITICAL',
    title: 'MLOps Specialization',
    provider: 'Coursera',
    duration: '3 months',
    cost: '$49/mo',
    impact: '+23%',
    link: '#',
  },
  {
    priority: 'CRITICAL',
    title: 'LLM Bootcamp',
    provider: 'Full Stack Deep Learning',
    duration: '6 weeks',
    cost: 'Free',
    impact: '+18%',
    link: '#',
  },
  {
    priority: 'RECOMMENDED',
    title: 'Advanced PyTorch',
    provider: 'Udacity',
    duration: '2 months',
    cost: '$399',
    impact: '+12%',
    link: '#',
  },
  {
    priority: 'RECOMMENDED',
    title: 'AWS ML Specialty',
    provider: 'AWS Training',
    duration: '4 weeks',
    cost: '$300',
    impact: '+8%',
    link: '#',
  },
  {
    priority: 'OPTIONAL',
    title: 'Python Advanced Patterns',
    provider: 'Real Python',
    duration: '2 weeks',
    cost: '$60',
    impact: '+3%',
    link: '#',
  },
];

export default function SkillsPage() {
  const [selectedCareer, setSelectedCareer] = useState(mockCareers[0].id);

  const overallReadiness = Math.round(
    mockSkillGaps.reduce((acc, skill) => acc + skill.userLevel, 0) / mockSkillGaps.length
  );

  const totalCost = mockLearningPath
    .filter((course) => course.priority !== 'OPTIONAL')
    .reduce((acc, course) => {
      const cost = course.cost.toLowerCase();
      if (cost === 'free') return acc;
      const match = cost.match(/\$(\d+)/);
      return acc + (match ? parseInt(match[1]) : 0);
    }, 0);

  const totalMonths = mockLearningPath
    .filter((course) => course.priority !== 'OPTIONAL')
    .reduce((acc, course) => {
      const match = course.duration.match(/(\d+)\s*(month|week)/);
      if (!match) return acc;
      const value = parseInt(match[1]);
      const unit = match[2];
      return acc + (unit === 'month' ? value : value / 4);
    }, 0);

  return (
    <AppShell title="Skill Gap Analysis" subtitle="Identify and close skill gaps for your target career">
      <div className="space-y-6">
        {/* Career Selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <label className="block text-sm text-text-secondary mb-2">Analyzing gap for:</label>
          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            className="input-dark text-lg font-semibold"
          >
            {mockCareers.map((career) => (
              <option key={career.id} value={career.id}>
                {career.title}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Skill Proficiency */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-display mb-6">Skill Proficiency vs Required</h2>
              <div className="space-y-6">
                {mockSkillGaps.map((skill, i) => {
                  const getBarColor = (gap: number) => {
                    if (gap >= 0) return 'bg-brand';
                    if (gap >= -15) return 'bg-warning';
                    return 'bg-danger';
                  };

                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-text-secondary">Your: {skill.userLevel}%</span>
                          <span className="text-text-secondary">
                            Required: {skill.requiredLevel}%
                          </span>
                          <span
                            className={`font-semibold ${
                              skill.gap >= 0 ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {skill.gap >= 0 ? '+' : ''}
                            {skill.gap}%
                          </span>
                        </div>
                      </div>
                      <div className="relative h-10 bg-bg-muted rounded-lg overflow-hidden">
                        {/* User Level Bar */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.userLevel}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`absolute h-full ${getBarColor(skill.gap)}`}
                        />
                        {/* Required Level Marker */}
                        <div
                          className="absolute h-full border-r-2 border-dashed border-white z-10"
                          style={{ left: `${skill.requiredLevel}%` }}
                        >
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Overall Readiness Arc */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-xl font-semibold mb-6 text-center">Overall Readiness</h3>
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="var(--bg-muted)"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke={
                        overallReadiness >= 80
                          ? 'var(--brand)'
                          : overallReadiness >= 60
                          ? 'var(--warning)'
                          : 'var(--danger)'
                      }
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 80}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 80 * (1 - overallReadiness / 100),
                      }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-brand">{overallReadiness}%</div>
                    <div className="text-sm text-text-secondary mt-2">Ready</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Learning Path */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-display mb-6">Recommended Learning Path</h2>
              <div className="space-y-4">
                {mockLearningPath.map((course, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className={`p-4 rounded-lg border-2 ${
                      course.priority === 'CRITICAL'
                        ? 'border-danger bg-danger/5'
                        : course.priority === 'RECOMMENDED'
                        ? 'border-warning bg-warning/5'
                        : 'border-brand bg-brand/5'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                          course.priority === 'CRITICAL'
                            ? 'bg-danger text-white'
                            : course.priority === 'RECOMMENDED'
                            ? 'bg-warning text-white'
                            : 'bg-brand text-bg-base'
                        }`}
                      >
                        {course.priority}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                        <div className="text-sm text-text-secondary">{course.provider}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-text-secondary mb-3">
                      <span>⏱️ {course.duration}</span>
                      <span>💰 {course.cost}</span>
                      <span className="text-brand font-semibold">
                        Match impact: {course.impact}
                      </span>
                    </div>
                    <button className="btn-primary w-full">Start learning →</button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Total Investment */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Total Investment Required</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold text-brand mb-2">~${totalCost}</div>
                  <div className="text-sm text-text-secondary">Total cost (critical + recommended)</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-brand mb-2">
                    {Math.round(totalMonths)}mo
                  </div>
                  <div className="text-sm text-text-secondary">Time commitment</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-brand/10 border border-brand/30 rounded-lg">
                <div className="text-sm text-text-secondary mb-1">Expected outcome</div>
                <div className="text-lg font-semibold text-brand">
                  Match score increase: +61% → 92%
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
