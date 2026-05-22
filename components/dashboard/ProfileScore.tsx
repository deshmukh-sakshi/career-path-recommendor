'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProfileScoreProps {
  score: number;
  change?: number;
}

export default function ProfileScore({ score, change = 0 }: ProfileScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = score / 50;
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 20);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 56;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="card p-6">
      <div className="text-text-secondary text-sm mb-4">Profile Score</div>
      
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="var(--bg-muted)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="var(--brand)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-display text-brand">{displayScore}</span>
            <span className="text-xs text-text-muted">/100</span>
          </div>
        </div>
      </div>

      {change !== 0 && (
        <div className={`text-center text-sm ${change > 0 ? 'text-success' : 'text-danger'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)} pts this week
        </div>
      )}
    </div>
  );
}
