// Visual effects for Terminal Easter Egg

export interface MatrixDrop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  charIndex: number;
}

export const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const createMatrixDrop = (x: number, canvasHeight: number): MatrixDrop => {
  const chars = Array.from({ length: Math.floor(Math.random() * 20) + 10 }, () =>
    MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
  );
  return {
    x,
    y: Math.random() * canvasHeight * -1,
    speed: Math.random() * 2 + 1,
    chars,
    charIndex: 0,
  };
};

export const getRandomMatrixChar = (): string => {
  return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
};

// Typing animation effect
export const typeText = async (
  text: string,
  callback: (partial: string) => void,
  delay = 30
): Promise<void> => {
  let result = '';
  for (const char of text) {
    result += char;
    callback(result);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};

// Glitch effect for text
export const glitchText = (text: string): string => {
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█';
  return text
    .split('')
    .map(char => (Math.random() < 0.1 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char))
    .join('');
};

// CRT flicker effect values
export const CRT_FLICKER_KEYFRAMES = `
  @keyframes flicker {
    0% { opacity: 1; }
    3% { opacity: 0.97; }
    6% { opacity: 1; }
    7% { opacity: 0.95; }
    8% { opacity: 1; }
    9% { opacity: 0.98; }
    10% { opacity: 1; }
    100% { opacity: 1; }
  }
`;

// Scanline animation
export const SCANLINE_ANIMATION = `
  @keyframes scanline {
    0% { transform: translateY(0); }
    100% { transform: translateY(100vh); }
  }
`;

// Glow pulse effect
export const GLOW_PULSE = `
  @keyframes glowPulse {
    0%, 100% {
      text-shadow: 0 0 4px currentColor, 0 0 8px currentColor;
    }
    50% {
      text-shadow: 0 0 8px currentColor, 0 0 16px currentColor, 0 0 24px currentColor;
    }
  }
`;

// Boot sequence messages
export const BOOT_SEQUENCE = [
  'Initializing OpenClaw-OS kernel...',
  'Loading system modules...',
  'Mounting virtual filesystem...',
  'Starting display manager...',
  'Initializing network stack...',
  'Loading user preferences...',
  'Starting terminal emulator...',
  '',
  'OpenClaw-OS v1.0.0 (tty1)',
  '',
  'Login: guest',
  'Password: ********',
  '',
  'Welcome to OpenClaw-OS!',
  'Type "help" for a list of commands.',
  '',
];

// Hack sequence messages
export const HACK_SEQUENCE = [
  '> Initiating hack sequence...',
  '> Bypassing firewall [████████████████████] 100%',
  '> Decrypting mainframe access codes...',
  '> Injecting payload...',
  '> Establishing backdoor connection...',
  '> Accessing classified files...',
  '',
  '⚠️  ACCESS GRANTED ⚠️',
  '',
  'Just kidding! This is just a fun easter egg.',
  'No actual hacking occurred. You\'re safe! 🔐',
];

// Progress bar helper
export const createProgressBar = (progress: number, width = 30): string => {
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${progress}%`;
};

// Animated loading spinner frames
export const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

// Get random delay for realistic typing effect
export const getTypingDelay = (): number => {
  return Math.random() * 50 + 20;
};
