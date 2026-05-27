import { SlidersHorizontal, Palette } from 'lucide-react';

interface SidebarProps {
  currentStyle: string;
  setStyle: (style: string) => void;
}

const VISUALIZER_STYLES = [
  'Spectrum Bars',
  'Spectrum Bars (Bottom)',
  'Spectrum Bars (Top)',
  'Circular Ring',
  'Waveform',
  'Particle Flow',
  'Neon Tunnel',
  'Ambient Blob',
  'Radial Pulse'
];

export default function Sidebar({ currentStyle, setStyle }: SidebarProps) {
  return (
    <aside className="glass-panel w-72 h-[calc(100vh-140px)] rounded-3xl p-6 flex flex-col gap-8 overflow-y-auto">
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Palette size={18} className="text-[var(--primary-color)]" />
          Styles
        </h3>
        <div className="flex flex-col gap-2">
          {VISUALIZER_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setStyle(style)}
              className={`text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                currentStyle === style
                  ? 'bg-[var(--primary-color)] text-white shadow-lg shadow-indigo-500/30'
                  : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-[var(--primary-color)]" />
          Controls
        </h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2 opacity-70">
              <span>Sensitivity</span>
              <span>75%</span>
            </div>
            <input 
              type="range" 
              className="w-full accent-[var(--primary-color)] h-1.5 bg-black/10 dark:bg-white/20 rounded-full appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2 opacity-70">
              <span>Smoothing</span>
              <span>High</span>
            </div>
            <input 
              type="range" 
              className="w-full accent-[var(--primary-color)] h-1.5 bg-black/10 dark:bg-white/20 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
