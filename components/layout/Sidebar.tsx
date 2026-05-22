'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Career Paths', href: '/careers', icon: '🗺' },
  { name: 'My Resume', href: '/resume', icon: '📄' },
  { name: 'Skill Gap', href: '/skills', icon: '📊' },
  { name: 'Market Trends', href: '/trends', icon: '📈' },
  { name: 'AI Assistant', href: '/assistant', icon: '💬' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-60 bg-bg-surface border-r border-border flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="text-2xl font-display text-brand">
          Kiro
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-brand-subtle text-brand border-l-2 border-brand'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-dim flex items-center justify-center text-bg-base font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name}</div>
            <div className="text-xs text-text-secondary">Pro</div>
          </div>
        </div>
        
        {/* Profile Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Profile</span>
            <span className="text-brand font-semibold">{user?.profileScore || 0}% complete</span>
          </div>
          <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all"
              style={{ width: `${user?.profileScore || 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
