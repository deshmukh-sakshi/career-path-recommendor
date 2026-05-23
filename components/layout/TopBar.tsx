'use client';

import { useRouter } from 'next/navigation';

interface TopBarProps {
  user: any;
  title?: string;
  subtitle?: string;
}

export default function TopBar({ user, title, subtitle }: TopBarProps) {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="h-16 bg-bg-surface border-b border-border flex items-center justify-between px-6">
      <div>
        {title && (
          <>
            <h1 className="text-lg font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-text-secondary">{subtitle}</p>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search careers, skills..."
            className="input-dark w-64 pl-10 py-2 text-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            🔍
          </span>
        </div>

        {/* Notifications */}
        <button className="w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center hover:bg-bg-muted transition-colors">
          <span className="text-lg">🔔</span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brand-dim flex items-center justify-center text-bg-base font-semibold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </div>
  );
}
