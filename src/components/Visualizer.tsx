import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface VisualizerProps {
  style: string;
  isPlaying: boolean;
  mediaStream?: MediaStream | null;
  zenMode?: boolean;
  primaryColor?: string;
  accentColor?: string;
  sensitivity?: number;
  smoothing?: number;
}

export default function Visualizer({ 
  style, 
  isPlaying, 
  mediaStream,
  zenMode = false,
  primaryColor = '#8B5CF6',
  accentColor = '#6366F1',
  sensitivity = 1.4,
  smoothing = 0.8
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '139, 92, 246';
  };

  const primaryRgb = hexToRgb(primaryColor);
  const accentRgb = hexToRgb(accentColor);

  useEffect(() => {
    if (isPlaying && !audioInitialized && mediaStream) {
      const initAudio = () => {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          
          analyserRef.current.fftSize = 256;
          analyserRef.current.smoothingTimeConstant = smoothing;
          
          sourceRef.current = audioContextRef.current.createMediaStreamSource(mediaStream);
          sourceRef.current.connect(analyserRef.current);
          
          setAudioInitialized(true);
        } catch (err) {
          console.error("Audio Context initialization failed", err);
        }
      };
      
      initAudio();
    }
    
    if (audioInitialized && audioContextRef.current && analyserRef.current && mediaStream) {
      if (sourceRef.current) sourceRef.current.disconnect();
      try {
        sourceRef.current = audioContextRef.current.createMediaStreamSource(mediaStream);
        sourceRef.current.connect(analyserRef.current);
      } catch (e) {
        console.error(e);
      }
    }

    if (isPlaying && audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, [isPlaying, mediaStream, audioInitialized]);

  // Update smoothing dynamically
  useEffect(() => {
    if (analyserRef.current) {
      analyserRef.current.smoothingTimeConstant = smoothing;
    }
  }, [smoothing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    
    const dataArray = analyserRef.current ? new Uint8Array(analyserRef.current.frequencyBinCount) : new Uint8Array(128);
    const timeDomainArray = analyserRef.current ? new Uint8Array(analyserRef.current.frequencyBinCount) : new Uint8Array(128);
    
    const particles = Array.from({length: 80}, () => ({
      x: Math.random(), 
      y: Math.random(), 
      speed: Math.random() * 0.02 + 0.005,
      size: Math.random() * 3 + 1,
      angle: Math.random() * Math.PI * 2
    }));

    const render = () => {
      time += 0.05;
      
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
        analyserRef.current.getByteTimeDomainData(timeDomainArray);
      } else {
        dataArray.fill(0);
        timeDomainArray.fill(128);
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const bassValue = (dataArray[0] + dataArray[1] + dataArray[2]) / 3 || 0;

      if (style.startsWith('Spectrum Bars')) {
        const bars = 64;
        const barWidth = (width / bars) * 0.7;
        const spacing = (width / bars) * 0.3;
        
        for (let i = 0; i < bars; i++) {
          const value = (dataArray[i] || 0) * sensitivity;
          const reactiveHeight = isPlaying ? (value / 255) * height * 0.6 + 10 : 10;
          const displayHeight = (audioInitialized && isPlaying) 
            ? reactiveHeight 
            : (Math.sin(time + i * 0.2) * 20 + 30);
          
          const x = i * (barWidth + spacing);
          let y = centerY - displayHeight / 2; 
          
          if (style === 'Spectrum Bars (Bottom)') {
            y = height - displayHeight;
          } else if (style === 'Spectrum Bars (Top)') {
            y = 0;
          }
          
          const gradient = ctx.createLinearGradient(x, y, x, y + displayHeight);
          if (style === 'Spectrum Bars (Top)') {
            gradient.addColorStop(0, accentColor); 
            gradient.addColorStop(1, primaryColor); 
          } else {
            gradient.addColorStop(0, primaryColor); 
            gradient.addColorStop(1, accentColor); 
          }
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, displayHeight, barWidth / 2);
          ctx.fill();
        }
      } 
      else if (style === 'Circular Ring') {
        const radius = Math.min(width, height) * 0.25;
        const segments = 64;
        
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const index = i === segments ? 0 : i;
          const value = (dataArray[index] || 0) * sensitivity;
          
          const angle = (i / segments) * Math.PI * 2;
          const pulse = isPlaying ? (value / 255) * 80 : 0;
          const r = radius + pulse + (!audioInitialized ? Math.sin(time + i * 0.5) * 10 : 0);
          
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = primaryColor;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      else if (style === 'Waveform') {
        ctx.beginPath();
        const sliceWidth = width / timeDomainArray.length;
        let x = 0;
        
        for (let i = 0; i < timeDomainArray.length; i++) {
          // Time domain is centered around 128
          const v = ((timeDomainArray[i] - 128) * sensitivity + 128) / 128.0;
          const y = v * centerY + (!audioInitialized && !isPlaying ? Math.sin(time + i * 0.1) * 20 : 0);
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          
          x += sliceWidth;
        }
        
        ctx.lineTo(width, centerY);
        ctx.lineWidth = 3;
        ctx.strokeStyle = primaryColor;
        ctx.stroke();
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = accentColor;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      else if (style === 'Particle Flow') {
        const bassValueScaled = bassValue * sensitivity;
        const bounceMultiplier = isPlaying ? (bassValueScaled / 255) * 2 : 0.2;
        
        particles.forEach(p => {
          p.y -= p.speed * (1 + bounceMultiplier * 5);
          p.x += Math.sin(time + p.y * 10) * 0.005;
          
          if (p.y < 0) {
            p.y = 1;
            p.x = Math.random();
          }
          
          const px = p.x * width;
          const py = p.y * height;
          
          ctx.beginPath();
          ctx.arc(px, py, p.size * (1 + bounceMultiplier), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${primaryRgb}, ${0.3 + bounceMultiplier * 0.2})`;
          ctx.fill();
        });
      }
      else if (style === 'Neon Tunnel') {
        const depth = 10;
        for (let i = depth; i > 0; i--) {
          const scale = ((time * 0.5 + i / depth) % 1);
          const size = scale * width;
          const intensity = (dataArray[Math.floor((1 - scale) * 30)] || 0) * sensitivity;
          const opacity = Math.max(0.1, Math.min(1, (intensity / 255) * (1 - scale)));
          
          ctx.beginPath();
          ctx.rect(centerX - size/2, centerY - size/2 * (height/width), size, size * (height/width));
          ctx.strokeStyle = `rgba(${accentRgb}, ${opacity})`;
          ctx.lineWidth = 2 + (intensity / 255) * 5;
          ctx.stroke();
        }
      }
      else if (style === 'Radial Pulse') {
        const bassValueScaled = bassValue * sensitivity;
        const pulse = isPlaying ? (bassValueScaled / 255) * 150 : Math.sin(time * 2) * 10;
        
        for(let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, 50 + pulse + (i * 30 * ((time * 2) % 1)), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${primaryRgb}, ${0.5 - i * 0.1})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50 + pulse * 0.8, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50 + pulse);
        grad.addColorStop(0, `rgba(${primaryRgb}, 0.8)`);
        grad.addColorStop(1, `rgba(${accentRgb}, 0.2)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      else {
        // Ambient Blob
        const bassValueScaled = bassValue * sensitivity;
        const pulse = isPlaying ? (bassValueScaled / 255) * 100 : Math.sin(time * 5) * 20;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 100 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primaryRgb}, 0.2)`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80 + pulse * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, 0.4)`;
        ctx.fill();
      }

      // No requestAnimationFrame here, worker handles it
    };

    // Create an inline Web Worker to act as a reliable timer that doesn't get throttled in the background
    const workerCode = `
      let intervalId = null;
      self.onmessage = function(e) {
        if (e.data === 'start') {
          intervalId = setInterval(() => self.postMessage('tick'), 16); // ~60fps
        } else if (e.data === 'stop') {
          clearInterval(intervalId);
        }
      };
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    worker.onmessage = () => {
      render();
    };

    // Start the background-proof loop
    worker.postMessage('start');

    // Trigger an immediate initial render
    render();

    return () => {
      worker.postMessage('stop');
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, [style, isPlaying, audioInitialized, primaryColor, accentColor, primaryRgb, accentRgb, sensitivity]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex-1 flex flex-col items-center justify-center relative min-w-[300px] transition-all duration-700 ${zenMode ? 'h-screen w-screen fixed inset-0 z-40 bg-black/90' : 'h-full'}`}
    >
      {!zenMode && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] -z-10 pointer-events-none transition-colors duration-1000" 
          style={{ backgroundColor: `${primaryColor}33` }} 
        />
      )}
      
      <div className={`w-full h-full relative flex items-center justify-center overflow-hidden transition-all duration-700 ${zenMode ? 'rounded-none' : 'max-h-[70vh] rounded-3xl glass-panel'}`}>
        {!isPlaying && !audioInitialized && !mediaStream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 pointer-events-none opacity-50">
            <h2 className="text-2xl font-bold mb-2">No Audio Captured</h2>
            <p className="text-sm">Click "Listen to Tab" to start visualizing</p>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          width={1920}
          height={1080}
          className={`w-full h-full object-contain z-10 relative ${zenMode ? 'p-0' : 'p-8'}`}
        />
      </div>
    </motion.div>
  );
}
