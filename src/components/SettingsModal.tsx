import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  sensitivity: number;
  setSensitivity: (val: number) => void;
  smoothing: number;
  setSmoothing: (val: number) => void;
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  primaryColor, 
  setPrimaryColor, 
  accentColor, 
  setAccentColor,
  sensitivity,
  setSensitivity,
  smoothing,
  setSmoothing
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 tracking-tight">Theme Settings</h2>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium opacity-80">Primary Color</label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-inner border-2 border-white/10 cursor-pointer">
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] cursor-pointer"
                  title="Choose primary color spectrum"
                />
              </div>
              <span className="font-mono text-sm opacity-70 uppercase">{primaryColor}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium opacity-80">Accent Color</label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-inner border-2 border-white/10 cursor-pointer">
                <input 
                  type="color" 
                  value={accentColor} 
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] cursor-pointer"
                  title="Choose accent color spectrum"
                />
              </div>
              <span className="font-mono text-sm opacity-70 uppercase">{accentColor}</span>
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium opacity-80">Sensitivity</label>
              <span className="text-xs font-mono opacity-60">{sensitivity.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="3.0" 
              step="0.1" 
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-black/10 dark:bg-white/10 accent-[var(--primary-color)] outline-none"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium opacity-80">Smoothing (Fluidity)</label>
              <span className="text-xs font-mono opacity-60">{smoothing.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="0.95" 
              step="0.05" 
              value={smoothing}
              onChange={(e) => setSmoothing(parseFloat(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-black/10 dark:bg-white/10 accent-[var(--primary-color)] outline-none"
            />
          </div>
          
          <p className="text-xs opacity-50 mt-4 leading-relaxed">
            Click on the colored boxes to open your device's native color spectrum wheel. The changes will apply to the visualizer instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
