'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-brand/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2 className="text-4xl lg:text-6xl font-display mb-4">
          Ready to find your path?
        </h2>
        <p className="text-xl text-text-secondary mb-8">
          Free to start. No credit card required.
        </p>
        <Link href="/signup" className="btn-primary text-lg px-10 py-5 inline-flex items-center gap-2">
          Start with CareerAI
          <span>→</span>
        </Link>
      </motion.div>
    </section>
  );
}
