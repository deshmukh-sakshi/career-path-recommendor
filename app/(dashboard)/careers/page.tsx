'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import CareerCard from '@/components/dashboard/CareerCard';

const mockCareers = [
  {
    id: '1',
    title: 'AI/ML Engineer',
    salary: '$120K - $180K',
    demand: 'Very High',
    matchScore: 92,
    skills: { have: ['Python', 'TensorFlow'], need: ['MLOps', 'LLM fine-tuning'] },
    category: 'Tech',
    isBestFit: true,
  },
  {
    id: '2',
    title: 'Data Scientist',
    salary: '$110K - $160K',
    demand: 'Very High',
    matchScore: 85,
    skills: { have: ['SQL', 'Statistics'], need: ['Spark'] },
    category: 'Data',
  },
  {
    id: '3',
    title: 'Cloud Architect',
    salary: '$130K - $190K',
    demand: 'High',
    matchScore: 78,
    skills: { have: ['AWS', 'Docker'], need: ['Kubernetes', 'Terraform'] },
    category: 'Tech',
  },
  {
    id: '4',
    title: 'Product Manager',
    salary: '$115K - $170K',
    demand: 'High',
    matchScore: 71,
    skills: { have: ['Agile', 'Communication'], need: ['Product Strategy'] },
    category: 'Tech',
  },
  {
    id: '5',
    title: 'UX Designer',
    salary: '$90K - $140K',
    demand: 'Medium',
    matchScore: 68,
    skills: { have: ['Figma', 'User Research'], need: ['Prototyping'] },
    category: 'Design',
  },
  {
    id: '6',
    title: 'Financial Analyst',
    salary: '$80K - $130K',
    demand: 'Medium',
    matchScore: 62,
    skills: { have: ['Excel', 'SQL'], need: ['Financial Modeling'] },
    category: 'Finance',
  },
];

const filters = ['All', 'Tech', 'Finance', 'Healthcare', 'Design', 'Data'];
const sortOptions = ['Best fit', 'Highest salary', 'Fastest path'];

export default function CareersPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Best fit');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const filteredCareers = mockCareers.filter((career) => {
    const matchesFilter = activeFilter === 'All' || career.category === activeFilter;
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AppShell title="Career Paths" subtitle="Explore career opportunities matched to your profile">
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search careers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-dark w-full"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-dark"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                Sort by: {option}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                activeFilter === filter
                  ? 'bg-brand text-bg-base'
                  : 'bg-bg-surface text-text-secondary hover:bg-bg-elevated'
              }`}
            >
              {filter}
            </button>
          ))}
          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              showSaved
                ? 'bg-brand text-bg-base'
                : 'bg-bg-surface text-text-secondary hover:bg-bg-elevated'
            }`}
          >
            ♡ Saved
          </button>
        </div>

        {/* Career Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCareers.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <CareerCard {...career} timeline="2-3 years" />
            </motion.div>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            No careers found matching your criteria
          </div>
        )}
      </div>
    </AppShell>
  );
}
