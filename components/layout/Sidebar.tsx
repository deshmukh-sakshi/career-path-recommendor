'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Map, FileText, BarChart3, TrendingUp, MessageSquare, Settings, LogOut } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Career Paths', href: '/careers', icon: Map },
  { name: 'My Resume', href: '/resume', icon: FileText },
  { name: 'Skill Gap', href: '/skills', icon: BarChart3 },
  { name: 'Market Trends', href: '/trends', icon: TrendingUp },
  { name: 'AI Assistant', href: '/assistant', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('careerAnalysis');
      localStorage.removeItem('resumeUploaded');
      router.push('/');
    }
  };

  // Calculate profile strength based on career analysis
  const calculateProfileStrength = () => {
    // Try to get career readiness from analysis
    const analysisData = localStorage.getItem('careerAnalysis');
    if (analysisData) {
      try {
        const parsed = JSON.parse(analysisData);
        if (parsed?.overallAnalysis?.careerReadiness) {
          return parsed.overallAnalysis.careerReadiness;
        }
      } catch (e) {
        console.error('Error parsing career analysis:', e);
      }
    }
    
    // Fallback: calculate based on profile completion
    let strength = 0;
    if (user?.name) strength += 20;
    if (user?.email) strength += 20;
    
    const hasResume = localStorage.getItem('resumeUploaded') === 'true';
    if (hasResume) strength += 40;
    
    return strength;
  };

  const profileStrength = calculateProfileStrength();

  return (
    <div className="w-64 bg-bg-surface border-r border-border flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold text-text-primary">CareerAI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-dim flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-text-primary truncate">{user?.name}</div>
            <div className="text-xs text-text-muted">Free Plan</div>
          </div>
        </div>
        
        {/* Career Readiness */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">Career Readiness</span>
            <span className="text-brand font-bold">{profileStrength}%</span>
          </div>
          <div className="h-2 bg-bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand to-brand-dim rounded-full transition-all duration-500"
              style={{ width: `${profileStrength}%` }}
            />
          </div>
          {profileStrength < 100 && (
            <p className="text-xs text-text-muted">
              {profileStrength < 40 ? 'Upload resume to get started' : 
               profileStrength < 60 ? 'Keep learning to improve' : 
               profileStrength < 80 ? 'You\'re making great progress' :
               'Almost career ready!'}
            </p>
          )}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-danger hover:bg-danger/10 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
