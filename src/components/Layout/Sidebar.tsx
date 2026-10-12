import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  FileText,
  Mic2,
  Code2,
  ClipboardCheck,
  BarChart3,
  User,
  Zap,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/roadmap', label: 'Career Roadmap', icon: Map },
  { to: '/resume', label: 'Resume AI', icon: FileText },
  { to: '/interview', label: 'Mock Interviews', icon: Mic2 },
  { to: '/dsa', label: 'DSA Tracker', icon: Code2 },
  { to: '/assessments', label: 'Skill Assessments', icon: ClipboardCheck },
  { to: '/analytics', label: 'Progress Analytics', icon: BarChart3 },
  { to: '/profile', label: 'My Profile', icon: User },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 z-50 flex flex-col',
          'bg-[#0E1428] border-r border-white/5',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:z-auto'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white font-semibold text-sm tracking-tight">PlaceMate</span>
              <span className="text-violet-400 font-semibold text-sm tracking-tight"> AI</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest px-3 mb-3">
            Navigation
          </p>
          <ul className="space-y-0.5">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-violet-600/15 text-violet-300 border border-violet-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 flex-shrink-0',
                        isActive ? 'text-violet-400' : 'text-slate-500'
                      )}
                    />
                    {label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom CTA */}
        <div className="px-3 pb-4 flex-shrink-0">
          <div className="bg-gradient-to-br from-violet-600/20 to-cyan-500/10 border border-violet-500/20 rounded-xl p-4">
            <p className="text-xs font-semibold text-violet-300 mb-1">Placement Ready?</p>
            <p className="text-xs text-slate-400 mb-3">Take a full mock interview and see where you stand.</p>
            <NavLink
              to="/interview"
              className="block text-center text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg py-2 transition-colors"
            >
              Start Now
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
