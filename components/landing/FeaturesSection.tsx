'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '🤖',
    title: 'Gemini Resume Parsing',
    description: 'Upload PDF or DOCX. Gemini AI extracts every skill, role, and achievement with 94% accuracy.',
  },
  {
    icon: '🎯',
    title: 'Hybrid AI Recommendations',
    description: 'Collaborative filtering meets LLM reasoning — recommendations that learn from 50,000 similar profiles.',
  },
  {
    icon: '📊',
    title: 'Live Market Intelligence',
    description: 'Real-time data from BLS, LinkedIn, and Glassdoor updated daily so your plan always reflects now.',
  },
  {
    icon: '🗺',
    title: 'Skill Gap Analysis',
    description: 'Know exactly what\'s missing — with a learning roadmap, cost estimate, and time-to-close forecast.',
  },
  {
    icon: '👥',
    title: 'Peer Pathway Insights',
    description: 'See how professionals with your background actually transitioned — not theory, real moves.',
  },
  {
    icon: '💬',
    title: 'AI Career Assistant',
    description: 'Ask anything about your profile, the market, or your next move. Gets smarter every session.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display mb-4">
            Everything you need to navigate what's next.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="card p-6 hover:border-brand/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
