import { Bell, Search, Flame, Menu } from 'lucide-react';
import { storage } from '../../lib/localStorage';
import { defaultStats } from '../../lib/demoData';

interface TopNavProps {
  onMenuClick: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  const profile = storage.getProfile();
  const stats = storage.getStats() ?? defaultStats;
  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PM';

  return (
    <header className="h-16 border-b border-white/5 bg-[#0B1020]/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 flex-shrink-0 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-white/5 border border-white/8 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 w-56 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Streak */}
        <div className="hidden sm:flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-semibold text-orange-300">{stats.learningStreak} day streak</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
          {initials}
        </div>
      </div>
    </header>
  );
}
