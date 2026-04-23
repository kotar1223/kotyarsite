import { motion } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { KittyViewer } from './components/KittyViewer';
import { SiTiktok, SiDiscord, SiSteam, SiGithub, SiSpotify, SiYoutube } from 'react-icons/si';

type AppMode = 'normal' | 'player' | 'snake' | 'kitty';

type HistoryEntry = {
  id: string;
  mode: AppMode;
  dir: string;
  command: string | React.ReactNode;
  output: React.ReactNode;
  hidePrompt?: boolean;
};

const folders = ['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos', 'Projects', 'Games'];

const FORTUNES = [
  "It works on my machine. — Every developer, forever",
  "There are 10 types of people: those who understand binary, and those who don't.",
  "A good programmer looks both ways before crossing a one-way street.",
  "99 little bugs in the code. Take one down, patch it around... 127 little bugs in the code.",
  "I have not failed. I've just found 10,000 ways that won't work. — Thomas Edison, debugging",
  "Always code as if the guy maintaining it is a violent psychopath who knows where you live.",
  "The best code is no code at all.",
  "Premature optimization is the root of all evil. — Donald Knuth",
  "First, solve the problem. Then, write the code. — John Johnson",
  "To understand recursion, you must first understand recursion.",
  "A computer lets you make more mistakes faster than any other invention. Except maybe tequila.",
  "Talk is cheap. Show me the code. — Linus Torvalds",
];

// ──── HackOutput ──────────────────────────────────────────────────────────────

const HACK_LINES = [
  '> Initializing exploit framework v4.2.0...',
  '> Scanning target 192.168.1.1...',
  '> Port 22   (SSH)    ........... OPEN',
  '> Port 80   (HTTP)   ........... OPEN',
  '> Port 443  (HTTPS)  ........... OPEN',
  '> Port 1337 (hax)    ........... OPEN',
  '> Brute-forcing credentials...',
  '> admin:admin        ........... FAILED',
  '> root:toor          ........... FAILED',
  '> kotyar:hunter2     ........... SUCCESS ✓',
  '> Escalating privileges to root...',
  '> uid=0(root) gid=0(root) groups=0(root)',
  '> Installing backdoor at /etc/totally-normal.sh ... done',
  '> Covering tracks...',
  '> Sending results to FBI... just kidding lol',
  '> HACK COMPLETE. Total time: 1337ms',
  '> (100% fictional. go touch grass.)',
];

const HackOutput: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const idxRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (idxRef.current < HACK_LINES.length) {
        setLines(prev => [...prev, HACK_LINES[idxRef.current]]);
        idxRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 130);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col space-y-0.5 font-mono text-sm mt-1">
      {lines.map((line, i) => (
        <div
          key={i}
          className={
            line.includes('SUCCESS') || line.includes('COMPLETE') || (line.includes('root') && !line.includes('toor'))
              ? 'text-[#ff3333]'
              : line.includes('FAILED')
              ? 'text-[#663333]'
              : 'text-[#ff6666]'
          }
        >
          {line}
        </div>
      ))}
    </div>
  );
};

// ──── KernelPanic ─────────────────────────────────────────────────────────────

const PANIC_LINES = [
  '[    0.000001] Kernel panic - not syncing: attempted to rm -rf /*',
  '[    0.000002] CPU: 0 PID: 1337 Comm: bash Not tainted 6.6.0-kotyar #666',
  '[    0.000003] Hardware name: KOTYAR Terminal (Definitely Not A Toaster)',
  '[    0.000004] RIP: 0010:do_unlink_everything+0xDEAD/0xBEEF',
  '[    0.000005] RSP: 0018:ffffca3e408c3dc0 EFLAGS: 00010246',
  '[    0.000006] RAX: 0000000000000000 RBX: ffffd000deadbeef RCX: 0xdead',
  '[    0.000007] Call Trace:',
  '[    0.000008]  <IRQ>',
  '[    0.000009]  dump_stack_lvl+0x5b/0x77',
  '[    0.000010]  panic+0x14e/0x344',
  '[    0.000011]  do_rm_recursive+0xdead/0xbeef',
  '[    0.000012]  sys_unlink_tree+0x4a/0xb0',
  '[    0.000013]  </IRQ>',
  '[    0.000014] ',
  '[    0.000015] Deleting /etc        ████████████████ 100%   [    OK    ]',
  '[    0.000016] Deleting /usr        ████████████████ 100%   [    OK    ]',
  '[    0.000017] Deleting /bin        ████████████████ 100%   [    OK    ]',
  '[    0.000018] Deleting /sbin       ████████████████ 100%   [    OK    ]',
  '[    0.000019] Deleting /boot       ████████████████ 100%   [    OK    ]',
  '[    0.000020] Deleting /home       ████████████████ 100%   [    OK    ]',
  '[    0.000021] Deleting /dev        ██████████░░░░░░  67%   [  FATAL   ]',
  '[    0.000022] ',
  '[    0.000023] ---[ end Kernel panic - not syncing: filesystem is gone ]---',
  '[    0.000024] ',
  '[    0.000025]  ██████╗ ██╗███████╗██████╗ ',
  '[    0.000026] ██╔══██╗██║██╔════╝██╔══██╗',
  '[    0.000027] ██║  ██║██║█████╗  ██║  ██║',
  '[    0.000028] ██║  ██║██║██╔══╝  ██║  ██║',
  '[    0.000029] ██████╔╝██║███████╗██████╔╝',
  '[    0.000030] ╚═════╝ ╚═╝╚══════╝╚═════╝ ',
];

const KernelPanic: React.FC<{ onReboot: () => void }> = ({ onReboot }) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showReboot, setShowReboot] = useState(false);
  const panicBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < PANIC_LINES.length) {
        setVisibleLines(prev => [...prev, PANIC_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowReboot(true), 600);
      }
    }, 65);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    panicBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleLines]);

  useEffect(() => {
    if (!showReboot) return;
    const handler = () => onReboot();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showReboot, onReboot]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0000aa] flex flex-col p-4 sm:p-6 font-mono text-xs sm:text-sm text-white overflow-auto">
      <div className="flex flex-col space-y-0.5">
        {visibleLines.map((line, i) => (
          <div
            key={i}
            className={
              line.includes('FATAL')
                ? 'text-[#ff8888] font-bold'
                : line.includes('[    OK    ]')
                ? 'text-[#88ff88]'
                : 'text-white'
            }
          >
            {line}
          </div>
        ))}
      </div>
      <div ref={panicBottomRef} />
      {showReboot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex flex-col items-start"
        >
          <div className="text-[#ffff00] text-lg font-bold mb-1 animate-smooth-blink">
            ■ SYSTEM HALTED ■
          </div>
          <div className="text-white text-sm mb-4 opacity-80">
            Your filesystem has been successfully obliterated. Impressive work.
          </div>
          <button
            onClick={onReboot}
            className="border border-white text-white px-4 py-2 text-sm hover:bg-white hover:text-[#0000aa] transition-colors cursor-pointer"
          >
            [ Press any key to reboot ]
          </button>
        </motion.div>
      )}
    </div>
  );
};

// ──── Routing helpers ─────────────────────────────────────────────────────────

function splitRoute(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const routeIndex = segments.findIndex(
    (segment, index) =>
      segment.toLowerCase() === 'home' && segments[index + 1]?.toLowerCase() === 'kotyar'
  );
  if (routeIndex === -1) {
    return { prefixSegments: segments, routeSegments: [] as string[] };
  }
  return {
    prefixSegments: segments.slice(0, routeIndex),
    routeSegments: segments.slice(routeIndex),
  };
}

function getRoutePrefix(pathname: string): string {
  const { prefixSegments } = splitRoute(pathname);
  return prefixSegments.length ? `/${prefixSegments.join('/')}` : '';
}

function buildRoutePath(mode: AppMode, dir: string): string {
  if (mode === 'normal') {
    return dir ? `/home/kotyar/${dir.toLowerCase()}` : '/home/kotyar';
  }
  return `/home/kotyar/${mode}`;
}

function readPathState(): { mode: AppMode; dir: string } {
  if (typeof window === 'undefined') return { mode: 'normal', dir: '' };
  const { routeSegments } = splitRoute(window.location.pathname);
  const section = routeSegments[2]?.toLowerCase() ?? '';
  const folderNames = folders.map(f => f.toLowerCase());
  if (section === 'player' || section === 'snake' || section === 'kitty') {
    return { mode: section, dir: '' };
  }
  if (folderNames.includes(section)) {
    return { mode: 'normal', dir: folders.find(f => f.toLowerCase() === section) ?? '' };
  }
  return { mode: 'normal', dir: '' };
}

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

// ──── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const initialState = readPathState();
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'init',
      mode: 'normal',
      dir: '',
      command: '',
      output: (
        <div>
          Type <span className="text-[#ff3333]">help</span> to see available commands.
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AppMode>(initialState.mode);
  const [dir, setDir] = useState<string>(initialState.dir);
  const [correction, setCorrection] = useState<{
    rawInput: string;
    original: string;
    suggested: string;
    args: string[];
  } | null>(null);
  const [kernelPanic, setKernelPanic] = useState(false);

  const routePrefixRef = useRef(getRoutePrefix(window.location.pathname));
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const isTerminalInteractive = mode === 'normal';

  useEffect(() => {
    if (isTerminalInteractive) inputRef.current?.focus();
    const handleClick = () => {
      if (isTerminalInteractive) inputRef.current?.focus();
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isTerminalInteractive]);

  useEffect(() => {
    if (isTerminalInteractive) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
      setIsFocused(false);
    }
  }, [isTerminalInteractive]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    const nextPath = `${routePrefixRef.current}${buildRoutePath(mode, dir)}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
  }, [mode, dir]);

  useEffect(() => {
    const handlePopState = () => {
      routePrefixRef.current = getRoutePrefix(window.location.pathname);
      const nextState = readPathState();
      setMode(nextState.mode);
      setDir(nextState.dir);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const syncScroll = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setCursorPos(e.currentTarget.selectionStart || 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTerminalInteractive || correction) return;
    setInput(e.target.value);
    setCursorPos(e.target.selectionStart || 0);
    syncScroll(e);
  };

  const currentCorrectionPrompt = () => {
    if (!correction) return null;
    return (
      <span className="text-[#f0d8d8]">
        zsh: correct '
        <span className="text-[#ff2244] font-bold">{correction.original}</span>
        ' to '
        <span className="text-[#ff3333] font-bold">{correction.suggested}</span>
        ' [nyae]?
      </span>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isTerminalInteractive) {
      e.preventDefault();
      return;
    }

    if (correction) {
      e.preventDefault();
      const key = e.key.toLowerCase();
      const argsStr = correction.args.length > 0 ? ' ' + correction.args.join(' ') : '';

      const commitCorrection = (action: string) => {
        setHistory(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            mode,
            dir,
            hidePrompt: true,
            command: (
              <div className="flex items-center space-x-2">
                {currentCorrectionPrompt()} <span>{action}</span>
              </div>
            ),
            output: null,
          },
        ]);
      };

      if (key === 'y') {
        commitCorrection('y');
        setCorrection(null);
        processCommand(correction.suggested + argsStr, true);
      } else if (key === 'n') {
        commitCorrection('n');
        setCorrection(null);
        processCommand(correction.rawInput, true);
      } else if (key === 'a' || (e.ctrlKey && e.key === 'c')) {
        commitCorrection('a');
        setCorrection(null);
        setInput('');
        setCursorPos(0);
      } else if (key === 'e') {
        commitCorrection('e');
        setCorrection(null);
        setInput(correction.suggested + argsStr);
        setCursorPos((correction.suggested + argsStr).length);
      }
      return;
    }

    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setHistory(prev => [
        ...prev,
        { id: Date.now().toString(), mode, dir, command: input + '^C', output: null },
      ]);
      setInput('');
      setCursorPos(0);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const words = input.split(' ');
      if (words.length === 1) {
        const cmds = [
          'help', 'ls', 'bio', 'about', 'player', 'snake', 'kitty',
          'clear', 'cd', 'whoami', 'uname', 'fortune', 'hack', 'date',
          'coffee', 'neofetch',
        ];
        const match = cmds.find(c => c.startsWith(words[0].toLowerCase()));
        if (match) setInput(match + ' ');
      } else {
        const lastWord = words[words.length - 1];
        const match = folders.find(f => f.toLowerCase().startsWith(lastWord.toLowerCase()));
        if (match) {
          words[words.length - 1] = match;
          setInput(words.join(' ') + ' ');
        }
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTerminalInteractive || correction) return;
    if (!input.trim() && input.length === 0) {
      setHistory(prev => [
        ...prev,
        { id: Date.now().toString(), mode, dir, command: '', output: null },
      ]);
      return;
    }
    processCommand(input);
  };

  const processCommand = (rawInput: string, skipCorrection = false) => {
    const cmd = rawInput.trim();
    if (!cmd) return;

    const parts = cmd.split(' ').filter(Boolean);
    const main = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    // ── sudo — bypass correction ──────────────────────────────────────────
    if (main === 'sudo') {
      const subCmd = parts.slice(1).join(' ').trim();
      let sudoOutput: React.ReactNode;

      if (subCmd === 'rm -rf /*' || subCmd === 'rm -rf /') {
        sudoOutput = (
          <div className="text-[#ff3333] space-y-1 font-mono">
            <div>[sudo] password for kotyar: ••••••••</div>
            <div className="text-[#ff6666] animate-pulse">rm: removing /etc...</div>
            <div className="text-[#ff6666] animate-pulse">rm: removing /usr...</div>
            <div className="text-[#ff6666] animate-pulse">rm: removing /bin...</div>
          </div>
        );
        setTimeout(() => setKernelPanic(true), 1800);
      } else {
        sudoOutput = (
          <span className="text-[#997777]">
            sudo: sorry, you are not in the sudoers file. This incident will be reported.
          </span>
        );
      }

      setHistory(prev => [
        ...prev,
        { id: Date.now().toString(), mode, dir, command: rawInput, output: sudoOutput },
      ]);
      setInput('');
      setCursorPos(0);
      return;
    }

    // ── typo correction ───────────────────────────────────────────────────
    const validNormal = [
      'help', 'ls', 'bio', 'about', 'player', 'snake', 'kitty', 'clear', 'cd',
      'whoami', 'uname', 'fortune', 'hack', 'date', 'coffee', 'neofetch',
    ];

    if (!validNormal.includes(main) && !skipCorrection) {
      let bestMatch = '';
      let minDistance = Infinity;
      for (const c of validNormal) {
        const dist = levenshtein(main, c);
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = c;
        }
      }
      const threshold = main.length > 3 ? 2 : 1;
      if (minDistance > 0 && minDistance <= threshold) {
        setHistory(prev => [
          ...prev,
          { id: Date.now().toString(), mode, dir, command: rawInput, output: null },
        ]);
        setCorrection({ rawInput, original: main, suggested: bestMatch, args: parts.slice(1) });
        setInput('');
        setCursorPos(0);
        return;
      }
    }

    let output: React.ReactNode = null;
    let newMode = mode;
    let newDir = dir;

    switch (main) {
      case 'help':
        output = (
          <div className="flex flex-col space-y-1">
            <div className="grid grid-cols-[120px_1fr] gap-x-2 gap-y-1 mt-2">
              <strong className="text-[#ff3333]">bio</strong><span>Social links and contacts</span>
              <strong className="text-[#ff3333]">about</strong><span>Information about me</span>
              <strong className="text-[#ff3333]">player</strong><span>Launch music station</span>
              <strong className="text-[#ff3333]">snake</strong><span>Play Snake game</span>
              <strong className="text-[#ff3333]">kitty</strong><span>Show random cat  [A / D to navigate]</span>
              <strong className="text-[#ff3333]">neofetch</strong><span>System information</span>
              <strong className="text-[#ff3333]">whoami</strong><span>Identity crisis simulator</span>
              <strong className="text-[#ff3333]">fortune</strong><span>Receive unsolicited wisdom</span>
              <strong className="text-[#ff3333]">hack</strong><span>Definitely legal cybersecurity research</span>
              <strong className="text-[#ff3333]">date</strong><span>What time is it?</span>
              <strong className="text-[#ff3333]">uname</strong><span>Kernel information</span>
              <strong className="text-[#ff3333]">ls</strong><span>List directory contents</span>
              <strong className="text-[#ff3333]">cd</strong><span>Change directory</span>
              <strong className="text-[#ff3333]">clear</strong><span>Clear terminal screen</span>
            </div>
          </div>
        );
        break;

      case 'ls':
        if (dir === '') {
          output = (
            <div className="flex space-x-6 text-[#ff6666] font-bold flex-wrap gap-y-2">
              {folders.map(f => <span key={f}>{f}</span>)}
            </div>
          );
        }
        break;

      case 'cd':
        if (!arg || arg === '~' || arg === '..') {
          newDir = '';
        } else {
          const target = folders.find(f => f.toLowerCase() === arg.toLowerCase());
          if (target) {
            if (dir === '') {
              newDir = target;
            } else {
              output = <span className="text-[#ff2244]">bash: cd: {arg}: No such file or directory</span>;
            }
          } else {
            output = <span className="text-[#ff2244]">bash: cd: {arg}: No such file or directory</span>;
          }
        }
        break;

      case 'bio':
        output = (
          <div className="flex flex-col mt-2">
            <div className="text-[#ff2244] asci-art mb-4 text-xs sm:text-sm">
{`██╗  ██╗ ██████╗ ████████╗██╗   ██╗ █████╗ ██████╗ \n██║ ██╔╝██╔═══██╗╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔══██╗\n█████╔╝ ██║   ██║   ██║    ╚████╔╝ ███████║██████╔╝\n██╔═██╗ ██║   ██║   ██║     ╚██╔╝  ██╔══██║██╔══██╗\n██║  ██╗╚██████╔╝   ██║      ██║   ██║  ██║██║  ██║`}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              <a href="https://www.tiktok.com/@kotar12233" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-[#f0d8d8] hover:text-[#ff3333] transition-colors">
                <span className="text-[#ff6644]"><SiTiktok size={18} /></span><span>TikTok</span>
              </a>
              <a href="https://discord.gg/yfcENEXQM7" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-[#f0d8d8] hover:text-[#ff6666] transition-colors">
                <span className="text-[#ff7777]"><SiDiscord size={18} /></span><span>Discord</span>
              </a>
              <a href="https://steamcommunity.com/id/KOARASTIM" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-[#f0d8d8] hover:text-[#ffaaaa] transition-colors">
                <span className="text-[#ffaaaa]"><SiSteam size={18} /></span><span>Steam</span>
              </a>
              <a href="https://github.com/kotar1223" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-[#f0d8d8] hover:text-[#ff3333] transition-colors">
                <span className="text-[#f0d8d8]"><SiGithub size={18} /></span><span>GitHub</span>
              </a>
              <a href="https://open.spotify.com/user/312a35kuqsswomrnbt2ad7hwjhvu" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-[#f0d8d8] hover:text-[#ff3333] transition-colors">
                <span className="text-[#ff4444]"><SiSpotify size={18} /></span><span>Spotify</span>
              </a>
              <a href="https://www.youtube.com/@kotar1223" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-[#f0d8d8] hover:text-[#ff2244] transition-colors">
                <span className="text-[#ff2244]"><SiYoutube size={18} /></span><span>YouTube</span>
              </a>
              <a href="https://www.youtube.com/@kotar1223stream" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-[#f0d8d8] hover:text-[#ff2244] transition-colors">
                <span className="text-[#ff2244]"><SiYoutube size={18} /></span><span>YouTube Stream</span>
              </a>
            </div>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="flex flex-col mt-2">
            <div className="text-[#ff6666] asci-art mb-4 text-xs sm:text-sm">
{`  __   ____  __  _  _  ____ \n / _\\ (  _ \\/  \\/ )( \\(_  _)\n/    \\ ) _ (  O ) \\/ (  )(  \n\\_/\\_/(____/\\__/\\____/ (__) `}
            </div>
            <ul className="space-y-1 list-disc list-inside text-[#f0d8d8]">
              <li><span className="text-[#ff3333]">I am KOTYAR</span></li>
              <li><span className="text-[#ff6666]">Hardcore Gamer</span></li>
              <li><span className="text-[#ff9999]">Music Enthusiast</span></li>
              <li><span className="text-[#ffbbbb]">Terminal Lover</span></li>
            </ul>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-1">
            <div className="text-[#ff3333] font-bold">root</div>
            <div className="text-[#997777] text-sm italic">(in your dreams, buddy)</div>
          </div>
        );
        break;

      case 'uname':
        output = (
          <span className="text-[#ff6666]">
            Linux kotyar 6.6.0-kotyar #1 SMP PREEMPT_DYNAMIC redterm x86_64 GNU/Chaos
          </span>
        );
        break;

      case 'date':
        output = <span className="text-[#ff7777]">{new Date().toString()}</span>;
        break;

      case 'fortune': {
        const pick = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        output = (
          <div className="text-[#ff9966] italic max-w-lg mt-1">"{pick}"</div>
        );
        break;
      }

      case 'hack':
        output = <HackOutput />;
        break;

      case 'coffee':
        output = (
          <div className="flex flex-col space-y-0 leading-tight mt-1">
            <pre className="text-[#ff6644] text-sm">{`    ( (
     ) )
  ........
  |      |]
  \\      /
   \`----'`}</pre>
            <div className="text-[#ff2244] mt-2 font-bold">ERROR: coffee.cup not found</div>
            <div className="text-[#997777] text-sm">Have you tried turning it off and on again?</div>
          </div>
        );
        break;

      case 'neofetch':
        output = (
          <div className="flex flex-row gap-6 mt-1 flex-wrap">
            <pre className="text-[#ff3333] text-xs leading-tight">{`██╗  ██╗
██║ ██╔╝
█████╔╝ 
██╔═██╗ 
██║  ██╗
╚═╝  ╚═╝`}</pre>
            <div className="flex flex-col space-y-0.5 text-sm">
              <span><span className="text-[#ff3333]">user</span><span className="text-[#f0d8d8]">@kotyar</span></span>
              <span className="text-[#441111]">-----------------</span>
              <span><span className="text-[#ff3333]">OS: </span>KotyarOS Linux x86_64</span>
              <span><span className="text-[#ff3333]">Kernel: </span>6.6.0-kotyar</span>
              <span><span className="text-[#ff3333]">Shell: </span>zsh 5.9 (blood red edition)</span>
              <span><span className="text-[#ff3333]">Terminal: </span>redterm 1.0.0</span>
              <span><span className="text-[#ff3333]">CPU: </span>Intel Coffee Lake (too hot)</span>
              <span><span className="text-[#ff3333]">Memory: </span>¯\_(ツ)_/¯ / ¯\_(ツ)_/¯</span>
              <span><span className="text-[#ff3333]">Uptime: </span>since the big bang</span>
              <div className="flex gap-1 mt-1">
                {['#550000','#880000','#aa0000','#cc0000','#ff0000','#ff3333','#ff6666','#ff9999'].map(c => (
                  <div key={c} style={{ background: c }} className="w-4 h-4 rounded-sm" />
                ))}
              </div>
            </div>
          </div>
        );
        break;

      case 'player':
        newMode = 'player';
        break;

      case 'snake':
        newMode = 'snake';
        break;

      case 'kitty':
        newMode = 'kitty';
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        setCursorPos(0);
        return;

      default:
        output = (
          <span className="text-[#ff2244]">
            Command not found: {cmd}. Type <span className="text-[#ff3333]">help</span> for available commands.
          </span>
        );
    }

    setHistory(prev => [
      ...prev,
      { id: Date.now().toString(), mode, dir, command: rawInput, output },
    ]);
    setMode(newMode);
    setDir(newDir);
    setInput('');
    setCursorPos(0);
  };

  const getPrompt = (m: AppMode, d: string = '') => {
    let currentPath = '~';
    if (m !== 'normal') currentPath = `~/${m}`;
    else if (d) currentPath = `~/${d}`;
    return (
      <div className="flex items-center space-x-1 whitespace-nowrap mr-2 select-none">
        <span className="text-[#ff3333]">user@kotyar</span>
        <span className="text-[#f0d8d8]">:</span>
        <span className="text-[#ff6666]">{currentPath}</span>
        <span className="text-[#f0d8d8]">$</span>
      </div>
    );
  };

  return (
    <>
      <main className="min-h-screen bg-[#0D0D0D] text-[#f0d8d8] p-4 sm:p-6 font-mono text-sm sm:text-base selection:bg-[#3a1515] selection:text-[#f0d8d8]">
        <div className="w-full">
          <div className="flex flex-col space-y-2 mb-2">
            {history.map(entry => (
              <div key={entry.id} className="flex flex-col">
                {(entry.command || entry.command === '') && entry.id !== 'init' && (
                  <div className="flex items-start">
                    {!entry.hidePrompt && getPrompt(entry.mode, entry.dir)}
                    <span className="break-all whitespace-pre-wrap">{entry.command}</span>
                  </div>
                )}
                {entry.output && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1"
                  >
                    {entry.output}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommand} className="flex items-start relative w-full pt-1">
            {correction ? (
              <div className="flex items-center space-x-2 mr-2 whitespace-nowrap select-none">
                {currentCorrectionPrompt()}
              </div>
            ) : (
              getPrompt(mode, dir)
            )}

            <div
              className={`flex-1 relative min-h-[1.5em] w-full ${correction ? 'hidden' : ''}`}
              onClick={() => inputRef.current?.focus()}
            >
              <input
                ref={inputRef}
                type="text"
                disabled={!isTerminalInteractive}
                value={input}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onSelect={handleSelect}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onScroll={syncScroll}
                className="absolute inset-0 w-full h-full opacity-0 text-transparent bg-transparent outline-none z-20 cursor-text"
                autoComplete="off"
                spellCheck="false"
                autoFocus
              />
              <div
                ref={displayRef}
                className="absolute inset-0 z-10 pointer-events-none flex items-center whitespace-pre overflow-x-hidden top-0 bottom-0"
              >
                <div className="relative flex items-center h-full text-[#f0d8d8]">
                  <span>{input}</span>
                  <div
                    className={`absolute h-[1.2em] w-[2px] bg-[#f0d8d8] left-0 transition-transform duration-150 ease-out origin-left ${
                      isFocused ? 'animate-smooth-blink' : 'hidden'
                    }`}
                    style={{ transform: `translateX(calc(${cursorPos}ch))` }}
                  />
                </div>
              </div>
            </div>

            {correction && (
              <div className="relative flex items-center h-[1.5em] w-full">
                <div className="h-[1.2em] w-[8px] bg-[#f0d8d8] animate-smooth-blink" />
                <input
                  ref={inputRef}
                  type="text"
                  disabled={!isTerminalInteractive}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="absolute inset-0 w-full h-full opacity-0 outline-none z-20"
                  autoFocus
                />
              </div>
            )}
          </form>
          <div ref={bottomRef} className="h-4" />
        </div>
      </main>

      {mode === 'player' && <MusicPlayer onExit={() => setMode('normal')} />}
      {mode === 'snake' && <SnakeGame onExit={() => setMode('normal')} />}
      {mode === 'kitty' && <KittyViewer onExit={() => setMode('normal')} />}
      {kernelPanic && (
        <KernelPanic onReboot={() => { setKernelPanic(false); setHistory([]); }} />
      )}
    </>
  );
}
