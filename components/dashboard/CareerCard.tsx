'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface CareerCardProps {
  id: string;
  title: string;
  salary: string;
  demand: string;
  timeline: string;
  matchScore: number;
  skills: {
    have: string[];
    need: string[];
  };
  isBestFit?: boolean;
}

export default function CareerCard({
  id,
  title,
  salary,
  demand,
  timeline,
  matchScore,
  skills,
  isBestFit = false,
}: CareerCardProps) {
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-match-high';
    if (score >= 60) return 'text-match-mid';
    return 'text-match-low';
  };

  const getMatchBg = (score: number) => {
    if (score >= 80) return 'bg-match-high';
    if (score >= 60) return 'bg-match-mid';
    return 'bg-match-low';
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card p-6 hover:border-brand/30 transition-all cursor-pointer group relative"
    >
      {isBestFit && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-pill bg-brand text-bg-base text-xs font-semibold">
          Best fit
        </div>
      )}

      <Link href={`/careers/${id}`}>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-brand transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span>{salary}</span>
            <span>·</span>
            <span>{demand}</span>
            <span>·</span>
            <span>{timeline}</span>
          </div>
        </div>

        {/* Match Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Match Score</span>
            <span className={`text-lg font-semibold ${getMatchColor(matchScore)}`}>
              {matchScore}%
            </span>
          </div>
          <div className="h-2 bg-bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${matchScore}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full ${getMatchBg(matchScore)} rounded-full`}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {skills.have.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded bg-success/20 text-success text-xs border border-success/30"
              >
                {skill} ✓
              </span>
            ))}
            {skills.need.slice(0, 2).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded bg-bg-muted text-text-secondary text-xs border border-border"
              >
                {skill} needed
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 text-brand text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          View path →
        </div>
      </Link>
    </motion.div>
  );
}
