'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Upload your resume',
    description: 'Gemini reads it instantly — skills, experience, and hidden strengths extracted.',
  },
  {
    number: '02',
    title: 'Get your career map',
    description: 'AI matches you to career paths ranked by fit, market demand, and growth potential.',
  },
  {
    number: '03',
    title: 'Close the gaps',
    description: 'Follow a personalized learning roadmap with curated courses and certifications.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-bg-surface">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display mb-4">
            How it works
          </h2>
        </motion.div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="relative">
                  <div className="text-[120px] font-display text-text-muted/10 absolute -top-8 -left-4">
                    {step.number}
                  </div>
                  <div className="relative z-10">
                    <div className="text-brand text-sm font-semibold mb-2">
                      STEP {step.number}
                    </div>
                    <h3 className="text-3xl font-display mb-4">{step.title}</h3>
                    <p className="text-text-secondary text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="card p-8 aspect-video flex items-center justify-center bg-gradient-to-br from-bg-elevated to-bg-surface">
                  <div className="text-6xl opacity-50">{step.number}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
