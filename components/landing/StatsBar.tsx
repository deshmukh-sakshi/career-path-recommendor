'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const stats = [
  { value: '1.1M+', label: 'Tech jobs posted in 2025' },
  { value: '414%', label: 'Growth in data scientist roles by 2030' },
  { value: '2.5yr', label: 'Average tech skill half-life' },
  { value: '92%', label: 'User satisfaction in AI career platforms' },
];

export default function StatsBar() {
  return (
    <section className="bg-bg-surface border-y border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-display text-brand mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
