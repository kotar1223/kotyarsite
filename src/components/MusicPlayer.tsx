import React, { useEffect, useRef, useState } from 'react';

type Props = { onExit: () => void };

const BAR_COUNT = 30;
const LOWER_CUTOFF = 50;
const UPPER_CUTOFF = 10000;

export const MusicPlayer: React.FC<Props> = ({ onExit }) => {
  const [fileName, setFileName] = useState('No track loaded');
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bassBoost, setBassBoost] = useState(false);
  const [spectrum, setSpectrum] = useState<number[]>(new Array(BAR_COUNT).fill(0));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const requestRef = useRef<number>(0);
  const objectUrlRef = useRef<string | null>(null);
  const spectrumRef = useRef<number[]>(new Array(BAR_COUNT).fill(0));

  const initAudio = () => {
    if (contextRef.current) return;

    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    contextRef.current = new AudioCtx();

    analyserRef.current = contextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    analyserRef.current.minDecibels = -92;
    analyserRef.current.maxDecibels = -18;
    analyserRef.current.smoothingTimeConstant = 0.5;

    bassFilterRef.current = contextRef.current.createBiquadFilter();
    bassFilterRef.current.type = 'lowshelf';
    bassFilterRef.current.frequency.value = 60;
    bassFilterRef.current.gain.value = 0;

    analyserRef.current.connect(bassFilterRef.current);
    bassFilterRef.current.connect(contextRef.current.destination);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !audioRef.current) return;

    initAudio();

    if (contextRef.current?.state === 'suspended') {
      await contextRef.current.resume();
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    audioRef.current.src = url;
    setFileName(file.name);

    if (!sourceRef.current && contextRef.current && analyserRef.current) {
      sourceRef.current = contextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
    }

    await audioRef.current.play().catch(console.error);
    setIsPlaying(true);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const togglePlay = async () => {
    if (!audioRef.current || fileName === 'No track loaded') return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (contextRef.current?.state === 'suspended') {
      await contextRef.current.resume();
    }

    await audioRef.current.play().catch(console.error);
    setIsPlaying(true);
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const toggleBass = () => {
    if (!bassFilterRef.current) return;
    const nextState = !bassBoost;
    bassFilterRef.current.gain.value = nextState ? 15 : 0;
    setBassBoost(nextState);
  };

  useEffect(() => {
    const updateVisualizer = () => {
      if (analyserRef.current && isPlaying) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);

        const sampleRate = contextRef.current?.sampleRate ?? 44100;
        const nyquist = sampleRate / 2;
        const rawSpectrum = new Array(BAR_COUNT).fill(0);

        for (let i = 0; i < BAR_COUNT; i++) {
          const startFreq = LOWER_CUTOFF * Math.pow(UPPER_CUTOFF / LOWER_CUTOFF, i / BAR_COUNT);
          const endFreq = LOWER_CUTOFF * Math.pow(UPPER_CUTOFF / LOWER_CUTOFF, (i + 1) / BAR_COUNT);
          const startIndex = Math.max(0, Math.floor((startFreq / nyquist) * data.length));
          const endIndex = Math.min(data.length - 1, Math.max(startIndex + 1, Math.ceil((endFreq / nyquist) * data.length)));

          let sum = 0;
          let peak = 0;

          for (let j = startIndex; j <= endIndex; j++) {
            const value = data[j];
            sum += value;
            if (value > peak) peak = value;
          }

          const width = endIndex - startIndex + 1;
          const average = sum / width;
          const blended = average * 0.68 + peak * 0.32;
          const normalized = Math.min(1, blended / 255);
          const target = Math.pow(normalized, 0.9) * 255;

          rawSpectrum[i] = target;
        }

        const nextSpectrum = new Array(BAR_COUNT).fill(0);

        for (let i = 0; i < BAR_COUNT; i++) {
          const left = rawSpectrum[i - 1] ?? rawSpectrum[i];
          const center = rawSpectrum[i];
          const right = rawSpectrum[i + 1] ?? rawSpectrum[i];
          const target = left * 0.22 + center * 0.56 + right * 0.22;

          const current = spectrumRef.current[i];
          const smoothing = target >= current ? 0.28 : 0.16;
          const nextValue = current + (target - current) * smoothing;

          spectrumRef.current[i] = nextValue;
          nextSpectrum[i] = nextValue;
        }

        setSpectrum(nextSpectrum);
      } else {
        const nextSpectrum = spectrumRef.current.map((value, index) => {
          const nextValue = Math.max(0, value - 8);
          spectrumRef.current[index] = nextValue;
          return nextValue;
        });

        if (nextSpectrum.some((value) => value > 0)) {
          setSpectrum(nextSpectrum);
        }
      }

      requestRef.current = requestAnimationFrame(updateVisualizer);
    };

    requestRef.current = requestAnimationFrame(updateVisualizer);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        e.stopPropagation();
        onExit();
      }
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        e.stopPropagation();
        fileInputRef.current?.click();
      }
      if (e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        void togglePlay();
      }
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        e.stopPropagation();
        stop();
      }
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        e.stopPropagation();
        toggleBass();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, bassBoost, fileName]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const formatT = (s: number) => {
    if (isNaN(s)) return '00:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progressRatio = duration > 0 ? time / duration : 0;
  const progressLen = 40;
  const filled = Math.floor(progressRatio * progressLen);
  const empty = progressLen - filled;
  const progressStr = '[' + '='.repeat(filled) + '>'.padEnd(empty + 1, '.') + ']';

  return (
    <div className="fixed inset-0 z-50 bg-[#11111b]/95 flex items-center justify-center p-4">
      <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleFile} />
      <audio
        ref={audioRef}
        className="hidden"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          setIsPlaying(false);
          setTime(0);
        }}
      />

      <div className="bg-[#1e1e2e] border-2 border-[#89b4fa] rounded-lg p-6 max-w-3xl w-full font-mono text-[#cdd6f4] shadow-2xl flex flex-col space-y-6">
        <div className="text-center text-[#89b4fa] font-bold text-xl border-b border-[#313244] pb-2">
          KOTYAR TERMINAL PLAYER
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-2">
          <div>
            <span className="text-[#a6e3a1]">File:</span> {fileName.length > 30 ? fileName.substring(0, 30) + '...' : fileName}
          </div>
          <div>
            <span className="text-[#fab387]">State:</span> {isPlaying ? 'PLAYING' : 'STOPPED'}
            <span className="text-[#cba6f7] ml-4">Bass:</span> {bassBoost ? 'ON' : 'OFF'}
          </div>
        </div>

        <div className="bg-[#11111b] border border-[#313244] rounded p-3 w-full h-40 md:h-48 overflow-hidden">
          <div className="flex h-full w-full items-end gap-[3px] px-[3px]">
            {spectrum.map((value, index) => {
              const height = Math.max(0, Math.min(100, Math.pow(value / 255, 0.92) * 100));

              return (
                <div key={index} className="flex h-full min-w-0 flex-1 items-end">
                  <div
                    className="w-full rounded-t-[2px] border border-[#d7b2ff]/60 border-b-0 bg-[linear-gradient(180deg,#f3b8ff_0%,#b8d8ff_28%,#93dbff_100%)] shadow-[0_0_8px_rgba(167,225,255,0.18)]"
                    style={{ height: `${Math.max(2, height)}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-4 text-sm whitespace-nowrap">
            <span className="text-[#89b4fa]">{formatT(time)}</span>
            <span className="flex-1 text-center text-[#cba6f7] overflow-hidden">{progressStr}</span>
            <span className="text-[#89b4fa]">{formatT(duration)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-[#313244] text-xs sm:text-sm text-center">
          <div className="bg-[#313244] px-2 py-1 rounded cursor-pointer hover:bg-[#45475a] transition-colors" onClick={() => fileInputRef.current?.click()}>
            <span className="text-[#f38ba8] font-bold">[L]</span>oad
          </div>
          <div className="bg-[#313244] px-2 py-1 rounded cursor-pointer hover:bg-[#45475a] transition-colors" onClick={() => void togglePlay()}>
            <span className="text-[#f38ba8] font-bold">[Space]</span> {isPlaying ? 'Pause' : 'Play'}
          </div>
          <div className="bg-[#313244] px-2 py-1 rounded cursor-pointer hover:bg-[#45475a] transition-colors" onClick={toggleBass}>
            <span className="text-[#f38ba8] font-bold">[B]</span>ass Boost
          </div>
          <div className="bg-[#313244] px-2 py-1 rounded cursor-pointer hover:bg-[#45475a] transition-colors" onClick={onExit}>
            <span className="text-[#f38ba8] font-bold">[Q]</span>uit
          </div>
        </div>
      </div>
    </div>
  );
};
