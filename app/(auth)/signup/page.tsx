'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Success! Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="bg-bg-base p-12 flex flex-col justify-between">
        <Link href="/" className="text-2xl font-display text-brand">
          Kiro
        </Link>

        <div>
          <h1 className="text-5xl font-display italic mb-8 leading-tight">
            The right career
            <br />
            is waiting — you
            <br />
            just need a map.
          </h1>

          <div className="space-y-3 mb-8">
            {[
              'Resume parsed in under 10 seconds',
              'Career matches updated with live market data',
              'Your data is encrypted and never sold',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center">
                  <span className="text-brand text-xs">✓</span>
                </div>
                <span className="text-text-secondary">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-text-secondary">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-bg-elevated border-2 border-bg-base"
                  style={{
                    background: `linear-gradient(135deg, #00d4aa ${i * 20}%, #0a0e17 100%)`
                  }}
                />
              ))}
            </div>
            <span className="text-warning">★★★★★</span>
          </div>
          Already trusted by 50,000+ professionals
        </div>
      </div>

      {/* Right Panel */}
      <div className="bg-bg-surface p-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-2">Create your account</h2>
          <p className="text-text-secondary text-sm mb-8">
            It's free. Cancel anytime.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-dark w-full"
                placeholder="Alex Johnson"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark w-full"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark w-full pr-12"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-bg-surface text-text-secondary">
                or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="btn-ghost flex items-center justify-center gap-2">
              <span className="text-xl">G</span>
              Google
            </button>
            <button className="btn-ghost flex items-center justify-center gap-2">
              <span className="text-xl">in</span>
              LinkedIn
            </button>
          </div>

          <p className="text-xs text-text-muted text-center mb-4">
            By creating an account you agree to our Terms and Privacy Policy.
          </p>

          <p className="text-center text-sm text-text-secondary">
            Have an account?{' '}
            <Link href="/login" className="text-brand hover:text-brand-dim">
              Sign in →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
