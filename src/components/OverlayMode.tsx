import { useEffect, useState } from 'react';
import Visualizer from './Visualizer';

export default function OverlayMode() {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Parse URL Parameters
  const params = new URLSearchParams(window.location.search);
  const rawStyle = params.get('style') || 'particle';
  const rawTheme = params.get('theme') || 'purple';
  const isTransparent = params.get('transparent') === 'true';
  const rawSensitivity = params.get('sensitivity') || 'medium';

  // Map settings
  const styleMap: Record<string, string> = {
    'spectrum': 'Spectrum Bars',
    'circle': 'Circular Ring',
    'waveform': 'Waveform',
    'particle': 'Particle Flow',
    'blob': 'Ambient Blob',
    'radial': 'Radial Pulse'
  };
  const currentStyle = styleMap[rawStyle] || 'Particle Flow';

  const themeMap: Record<string, { primary: string; accent: string }> = {
    'purple': { primary: '#8B5CF6', accent: '#6366F1' },
    'blue': { primary: '#3B82F6', accent: '#06B6D4' },
    'green': { primary: '#10B981', accent: '#34D399' },
    'pink': { primary: '#EC4899', accent: '#F43F5E' },
    'mono': { primary: '#FFFFFF', accent: '#9CA3AF' }
  };
  const { primary, accent } = themeMap[rawTheme] || themeMap['purple'];

  const sensitivityMap: Record<string, number> = {
    'low': 0.8,
    'medium': 1.4,
    'high': 2.5
  };
  const sensitivity = sensitivityMap[rawSensitivity] || 1.4;

  const handleStartCapture = async () => {
    try {
      setAudioError(null);
      // Request microphone or virtual audio cable input
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false
      });
      setMediaStream(stream);
      setIsCapturing(true);
    } catch (err: any) {
      console.error("Audio capture failed:", err);
      setAudioError(err.message || "Microphone permission denied");
      setIsCapturing(false);
    }
  };

  // Attempt auto-capture on mount (works in OBS if permissions are granted)
  useEffect(() => {
    handleStartCapture();
  }, []);

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative" 
      style={{ 
        backgroundColor: isTransparent ? 'transparent' : '#000000',
        color: 'white' 
      }}
    >
      {/* If capture fails (e.g. requires click), show a very subtle button or text so the streamer knows why it's not working */}
      {!isCapturing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
          <p className="text-white mb-4 opacity-80 text-sm">Waiting for audio permission...</p>
          <button 
            onClick={handleStartCapture}
            className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-full font-medium hover:scale-105 transition-transform"
            style={{ backgroundColor: primary }}
          >
            Start Audio Capture
          </button>
          {audioError && <p className="text-red-400 mt-4 text-xs max-w-sm text-center">{audioError}</p>}
        </div>
      )}

      {/* Visualizer Container with safe area padding for vertical compatibility */}
      <div className="absolute inset-0 flex items-center justify-center w-full h-full p-4 lg:p-12">
        <Visualizer
          style={currentStyle}
          isPlaying={isCapturing}
          mediaStream={mediaStream}
          zenMode={false} // Force standard borderless rendering inside the container
          primaryColor={primary}
          accentColor={accent}
          sensitivity={sensitivity}
          smoothing={0.8}
          transparent={isTransparent}
        />
      </div>
    </div>
  );
}
