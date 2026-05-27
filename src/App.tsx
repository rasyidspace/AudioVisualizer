import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomPanel from './components/BottomPanel';
import Visualizer from './components/Visualizer';
import SettingsModal from './components/SettingsModal';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentStyle, setCurrentStyle] = useState('Spectrum Bars');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [zenMode, setZenMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
  const [accentColor, setAccentColor] = useState('#6366F1');
  const [sensitivity, setSensitivity] = useState(1.4);
  const [smoothing, setSmoothing] = useState(0.8);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zenMode) {
        setZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zenMode]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleStartCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());

      setMediaStream(stream);
      setIsPlaying(true);

      stream.getTracks().forEach(track => {
        track.onended = () => {
          setIsPlaying(false);
          setMediaStream(null);
        };
      });
    } catch (err) {
      console.error("Capture failed:", err);
    }
  };

  const appStyle = {
    '--primary-color': primaryColor,
    '--accent-color': accentColor,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col" style={appStyle}>

      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary-color)] opacity-10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-color)] opacity-10 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }} />
      </div>

      <AnimatePresence>
        {!zenMode && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="z-50 relative">
            <Navbar 
              theme={theme} 
              toggleTheme={toggleTheme} 
              toggleSidebar={toggleSidebar} 
              onZenMode={() => setZenMode(true)} 
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`flex-1 flex gap-8 mx-auto w-full transition-all duration-700 ${zenMode ? 'mt-0 mb-0 px-0 max-w-full' : 'mt-28 mb-32 px-6 lg:px-12 max-w-[1600px]'}`}>
        <AnimatePresence>
          {isSidebarOpen && !zenMode && (
            <motion.div
              initial={{ width: 0, opacity: 0, marginLeft: -32 }}
              animate={{ width: 'auto', opacity: 1, marginLeft: 0 }}
              exit={{ width: 0, opacity: 0, marginLeft: -32 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="hidden lg:block shrink-0 overflow-hidden"
            >
              <div className="w-72">
                <Sidebar currentStyle={currentStyle} setStyle={setCurrentStyle} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Visualizer
          style={currentStyle}
          isPlaying={isPlaying}
          mediaStream={mediaStream}
          zenMode={zenMode}
          primaryColor={primaryColor}
          accentColor={accentColor}
          sensitivity={sensitivity}
          smoothing={smoothing}
        />
      </main>

      <AnimatePresence>
        {!zenMode && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="z-50 relative">
            <BottomPanel
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              onStartCapture={handleStartCapture}
            />
          </motion.div>
        )}
      </AnimatePresence>



      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        sensitivity={sensitivity}
        setSensitivity={setSensitivity}
        smoothing={smoothing}
        setSmoothing={setSmoothing}
      />
    </div>
  );
}

export default App;
