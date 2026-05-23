'use client';

import { useRouter } from 'next/navigation';
import { Search, Bell } from 'lucide-react';

interface TopBarProps {
  user: any;
  title?: string;
  subtitle?: string;
}

export default function TopBar({ user, title, subtitle }: TopBarProps) {
  const router = useRouter();

  return (
    <div className="h-16 bg-bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        {title && (
          <>
            <h1 className="text-xl font-bold text-text-primary">{title}</h1>
            {subtitle && (
              <p className="text-sm text-text-secondary">{subtitle}</p>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search careers, skills..."
            className="input-dark w-64 pl-10 py-2 text-sm"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-lg bg-bg-muted flex items-center justify-center hover:bg-border transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-dim flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-lg transition-shadow">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </div>
  );
}
