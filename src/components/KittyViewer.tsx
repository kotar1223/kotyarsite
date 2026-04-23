import React, { useEffect, useRef, useState } from 'react';

type Props = { onExit: () => void };

export const KittyViewer: React.FC<Props> = ({ onExit }) => {
  const [displayCat, setDisplayCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState('1/1');

  // Use refs to avoid stale closures in event handler
  const catsRef = useRef<string[]>([]);
  const idxRef = useRef(-1);

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= catsRef.current.length) return;
    idxRef.current = idx;
    setLoading(true);
    setDisplayCat(catsRef.current[idx]);
    setCounter(`${idx + 1}/${catsRef.current.length}`);
  };

  const fetchNext = () => {
    const url = `https://cataas.com/cat?t=${Date.now()}`;
    catsRef.current = [...catsRef.current, url];
    const newIdx = catsRef.current.length - 1;
    idxRef.current = newIdx;
    setLoading(true);
    setDisplayCat(url);
    setCounter(`${newIdx + 1}/${catsRef.current.length}`);
  };

  // Load first cat on mount
  useEffect(() => {
    fetchNext();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      } else if (e.key === 'd' || e.key === 'D') {
        const idx = idxRef.current;
        if (idx < catsRef.current.length - 1) {
          goTo(idx + 1);
        } else {
          fetchNext();
        }
      } else if (e.key === 'a' || e.key === 'A') {
        const idx = idxRef.current;
        if (idx > 0) goTo(idx - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0D0D] flex flex-col items-center justify-center font-mono p-4">
      {loading && (
        <div className="text-[#ff3333] animate-pulse absolute top-1/2 -translate-y-1/2">
          Fetching cat over standard output...
        </div>
      )}
      {displayCat && (
        <img
          src={displayCat}
          alt="kitty"
          className={`max-w-full max-h-[80vh] object-contain border-2 border-[#2a1515] rounded transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
        />
      )}
      <div className="mt-6 flex items-center gap-4 text-sm select-none">
        <span className="text-[#ff3333] font-bold">[A]</span>
        <span className="text-[#997777]">prev</span>
        <span className="text-[#441111] mx-1">│</span>
        <span className="text-[#664444]">{counter}</span>
        <span className="text-[#441111] mx-1">│</span>
        <span className="text-[#997777]">next</span>
        <span className="text-[#ff3333] font-bold">[D]</span>
        <span className="text-[#441111] mx-2">·</span>
        <span className="text-[#664444]">[ESC] exit</span>
      </div>
    </div>
  );
};
