'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 212, 170, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-2xl font-display text-brand">CareerAI</div>
        <div className="flex items-center gap-4">
          <Link href="/upload" className="btn-ghost text-sm">
            Try Demo
          </Link>
          <Link href="/login" className="btn-ghost text-sm">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary text-sm">
            Get started
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-brand-subtle border border-brand/20 text-brand text-sm mb-6"
          >
            <span>✦</span>
            <span>Powered by Gemini AI</span>
          </motion.div>

          <h1 className="font-display text-6xl lg:text-7xl leading-tight mb-6">
            Navigate your
            <br />
            <span className="italic text-brand">career</span> with
            <br />
            intelligence.
          </h1>

          <p className="text-xl text-text-secondary mb-8 max-w-xl leading-relaxed">
            Upload your resume. Let AI map your skills, find your perfect career paths, 
            and close the gaps holding you back — all backed by live market data.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
              Get started free
              <span>→</span>
            </Link>
            <button className="btn-ghost text-lg px-8 py-4 inline-flex items-center gap-2">
              <span>▷</span>
              Watch how it works
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-bg-elevated border-2 border-bg-base"
                  style={{
                    background: `linear-gradient(135deg, #00d4aa ${i * 20}%, #0a0e17 100%)`
                  }}
                />
              ))}
            </div>
            <span>Joined by 50,000+ professionals</span>
          </div>
        </motion.div>

        {/* Right mockup card */}
        <motion.div
          initial={{ opacity: 0, rotateY: -8, x: 40 }}
          animate={{ opacity: 1, rotateY: 0, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="card p-6 relative"
            style={{
              boxShadow: '0 0 60px rgba(0, 212, 170, 0.2)'
            }}
          >
            <div className="absolute top-4 right-4 px-3 py-1 rounded-pill bg-brand text-bg-base text-xs font-semibold">
              Best fit
            </div>

            <h3 className="text-2xl font-semibold mb-4">AI/ML Engineer</h3>

            {/* Match score arc */}
            <div className="flex items-center justify-center mb-6">
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
                    initial={{ strokeDasharray: "0 352" }}
                    animate={{ strokeDasharray: "324 352" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-display text-brand">92%</span>
                </div>
              </div>
            </div>

            {/* Skill chips */}
            <div className="flex flex-wrap gap-2">
              {['Python', 'TensorFlow', 'MLOps', 'LLM'].map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="px-3 py-1 rounded-pill bg-bg-muted text-text-secondary text-sm border border-border"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Glow effect */}
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-radial from-brand to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
