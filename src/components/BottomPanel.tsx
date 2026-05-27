import { Play, Pause, Upload, Link as LinkIcon, Volume2, X, MonitorPlay } from 'lucide-react';
import { useRef, useState } from 'react';

interface BottomPanelProps {
  isPlaying: boolean;
  togglePlay: () => void;
  onAudioUpload: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  onStartCapture: () => void;
}

export default function BottomPanel({ isPlaying, togglePlay, onAudioUpload, onUrlSubmit, onStartCapture }: BottomPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAudioUpload(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onUrlSubmit(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="glass-panel fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl rounded-3xl px-8 py-4 flex items-center justify-between z-50">

      <div className="flex items-center gap-2 w-[40%] relative">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors text-sm font-medium"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Upload</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors text-sm font-medium"
        >
          <LinkIcon size={16} />
          <span className="hidden sm:inline">URL</span>
        </button>

        <button
          onClick={onStartCapture}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--primary-color)]/20 text-[var(--primary-color)] hover:bg-[var(--primary-color)]/30 dark:bg-[var(--primary-color)]/30 dark:hover:bg-[var(--primary-color)]/40 transition-colors text-sm font-medium"
          title="Capture system or tab audio directly"
        >
          <MonitorPlay size={16} />
          <span className="hidden md:inline">Listen Tab</span>
        </button>

        {showUrlInput && (
          <div className="absolute bottom-full left-0 mb-4 w-72 p-3 glass-panel rounded-2xl flex flex-col gap-2 shadow-2xl">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-semibold opacity-70">Paste YouTube or Audio URL</span>
              <button onClick={() => setShowUrlInput(false)} className="opacity-50 hover:opacity-100"><X size={14} /></button>
            </div>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-black/5 dark:bg-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                autoFocus
              />
              <button type="submit" className="bg-[var(--primary-color)] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:brightness-110">
                Play
              </button>
            </form>
          </div>
        )}
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
