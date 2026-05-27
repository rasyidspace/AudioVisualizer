import { Moon, Sun, Settings, Activity, PanelLeft, Maximize } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleSidebar: () => void;
  onZenMode: () => void;
  onOpenSettings: () => void;
}

export default function Navbar({ theme, toggleTheme, toggleSidebar, onZenMode, onOpenSettings }: NavbarProps) {
  return (
    <nav className="glass-panel fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl rounded-full px-6 py-3 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="hidden lg:flex p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[var(--primary-color)] rounded-full text-white">
            <Activity size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">PulseCanvas</span>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80">
        <a href="#" className="hover:opacity-100 transition-opacity">Visualizer</a>
        <a href="#" className="hover:opacity-100 transition-opacity">Presets</a>
        <a href="#" className="hover:opacity-100 transition-opacity">About</a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onZenMode}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title="Zen Mode (Hide UI)"
        >
          <Maximize size={20} />
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button 
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </nav>
  );
}
