import { Play, Pause, Volume2, MonitorPlay } from 'lucide-react';

interface BottomPanelProps {
  isPlaying: boolean;
  togglePlay: () => void;
  onStartCapture: () => void;
}

export default function BottomPanel({ isPlaying, togglePlay, onStartCapture }: BottomPanelProps) {
  return (
    <div className="glass-panel fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl rounded-3xl px-8 py-4 flex items-center justify-between z-50">
      
      <div className="flex items-center w-1/3">
        <button 
          onClick={onStartCapture}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary-color)]/20 text-[var(--primary-color)] hover:bg-[var(--primary-color)]/30 dark:bg-[var(--primary-color)]/30 dark:hover:bg-[var(--primary-color)]/40 transition-colors text-sm font-medium shadow-sm"
          title="Capture system or tab audio directly"
        >
          <MonitorPlay size={18} />
          <span className="hidden md:inline font-semibold">Listen to Tab</span>
        </button>
      </div>

      <div className="flex justify-center w-1/3">
        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-[var(--primary-color)] hover:bg-[var(--accent-color)] text-white flex items-center justify-center transition-all hover:scale-105 shadow-lg shadow-indigo-500/30"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
      </div>

      <div className="flex items-center justify-end gap-3 w-1/3 opacity-70 hover:opacity-100 transition-opacity">
        <Volume2 size={20} />
        <input 
          type="range" 
          className="w-24 accent-current h-1.5 bg-black/10 dark:bg-white/20 rounded-full appearance-none cursor-pointer"
        />
      </div>
      
    </div>
  );
}
