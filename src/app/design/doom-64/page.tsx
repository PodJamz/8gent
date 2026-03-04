'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skull, Heart, Crosshair, RotateCcw, Play, Volume2, VolumeX } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface Demon {
  id: number;
  x: number;
  y: number;
  z: number;
  health: number;
  type: 'imp' | 'cacodemon' | 'baron';
  hit: boolean;
}

interface GameState {
  health: number;
  ammo: number;
  score: number;
  wave: number;
  gameOver: boolean;
  victory: boolean;
}

function DoomMiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    health: 100,
    ammo: 50,
    score: 0,
    wave: 1,
    gameOver: false,
    victory: false,
  });
  const [demons, setDemons] = useState<Demon[]>([]);
  const [playing, setPlaying] = useState(false);
  const [muzzleFlash, setMuzzleFlash] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const gameLoopRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);

  const spawnDemon = useCallback((wave: number): Demon => {
    const types: Array<'imp' | 'cacodemon' | 'baron'> = ['imp', 'imp', 'imp', 'cacodemon', 'cacodemon', 'baron'];
    const type = types[Math.min(Math.floor(Math.random() * (3 + wave)), types.length - 1)];
    const health = type === 'imp' ? 1 : type === 'cacodemon' ? 2 : 3;
    return {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 100 + 50,
      z: 400 + Math.random() * 200,
      health,
      type,
      hit: false,
    };
  }, []);

  const startGame = useCallback(() => {
    setGameState({
      health: 100,
      ammo: 50,
      score: 0,
      wave: 1,
      gameOver: false,
      victory: false,
    });
    setDemons([spawnDemon(1), spawnDemon(1), spawnDemon(1)]);
    setPlaying(true);
    lastSpawnRef.current = Date.now();
  }, [spawnDemon]);

  const shoot = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!playing || gameState.gameOver || gameState.ammo <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left - canvas.width / 2;
    const clickY = e.clientY - rect.top - canvas.height / 2;

    setMuzzleFlash(true);
    setTimeout(() => setMuzzleFlash(false), 100);

    setGameState(prev => ({ ...prev, ammo: prev.ammo - 1 }));

    // Check hits - demons closer (lower z) are easier to hit
    const sortedDemons = [...demons].sort((a, b) => a.z - b.z);
    let hitDemon: Demon | null = null;

    for (const demon of sortedDemons) {
      const scale = 200 / demon.z;
      const screenX = demon.x * scale;
      const screenY = demon.y * scale - 50;
      const hitboxSize = (demon.type === 'baron' ? 80 : demon.type === 'cacodemon' ? 60 : 50) * scale;

      if (
        Math.abs(clickX - screenX) < hitboxSize &&
        Math.abs(clickY - screenY) < hitboxSize
      ) {
        hitDemon = demon;
        break;
      }
    }

    if (hitDemon) {
      setDemons(prev => prev.map(d => {
        if (d.id === hitDemon!.id) {
          const newHealth = d.health - 1;
          if (newHealth <= 0) {
            const points = d.type === 'baron' ? 300 : d.type === 'cacodemon' ? 200 : 100;
            setGameState(p => ({ ...p, score: p.score + points }));
            return { ...d, health: 0, hit: true };
          }
          return { ...d, health: newHealth, hit: true };
        }
        return d;
      }));

      setTimeout(() => {
        setDemons(prev => prev.map(d => d.id === hitDemon!.id ? { ...d, hit: false } : d));
      }, 100);
    }
  }, [playing, gameState, demons]);

  // Game loop
  useEffect(() => {
    if (!playing || gameState.gameOver) return;

    const gameLoop = () => {
      // Move demons closer
      setDemons(prev => {
        const updated = prev
          .filter(d => d.health > 0)
          .map(d => ({
            ...d,
            z: d.z - (2 + gameState.wave * 0.5),
            x: d.x + (Math.random() - 0.5) * 3,
          }));

        // Check for demons reaching player
        const attacking = updated.filter(d => d.z <= 50);
        if (attacking.length > 0) {
          const damage = attacking.reduce((sum, d) => sum + (d.type === 'baron' ? 20 : d.type === 'cacodemon' ? 15 : 10), 0);
          setGameState(p => {
            const newHealth = p.health - damage;
            if (newHealth <= 0) {
              return { ...p, health: 0, gameOver: true };
            }
            return { ...p, health: newHealth };
          });
          return updated.filter(d => d.z > 50);
        }

        return updated;
      });

      // Spawn new demons
      const now = Date.now();
      if (now - lastSpawnRef.current > 2000 - gameState.wave * 100) {
        lastSpawnRef.current = now;
        setDemons(prev => {
          if (prev.length < 5 + gameState.wave) {
            return [...prev, spawnDemon(gameState.wave)];
          }
          return prev;
        });
      }

      // Check wave completion
      setDemons(prev => {
        if (prev.filter(d => d.health > 0).length === 0) {
          if (gameState.wave >= 5) {
            setGameState(p => ({ ...p, victory: true, gameOver: true }));
            return [];
          }
          setGameState(p => ({
            ...p,
            wave: p.wave + 1,
            ammo: Math.min(p.ammo + 20, 99),
          }));
          return [spawnDemon(gameState.wave + 1), spawnDemon(gameState.wave + 1), spawnDemon(gameState.wave + 1)];
        }
        return prev;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [playing, gameState.gameOver, gameState.wave, spawnDemon]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Clear with gradient sky
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#1a0a0a');
      gradient.addColorStop(0.5, '#2d1010');
      gradient.addColorStop(1, '#0a0505');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Floor
      ctx.fillStyle = '#1a0808';
      ctx.fillRect(0, h * 0.6, w, h * 0.4);

      // Draw grid lines for depth
      ctx.strokeStyle = '#3a1515';
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const y = h * 0.6 + i * 10;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Sort demons by z (far to near)
      const sortedDemons = [...demons].filter(d => d.health > 0).sort((a, b) => b.z - a.z);

      // Draw demons
      sortedDemons.forEach(demon => {
        const scale = 200 / demon.z;
        const x = w / 2 + demon.x * scale;
        const y = h / 2 + demon.y * scale - 50;
        const size = (demon.type === 'baron' ? 80 : demon.type === 'cacodemon' ? 60 : 50) * scale;

        ctx.save();
        ctx.translate(x, y);

        // Demon body
        const color = demon.hit ? '#ffffff' :
          demon.type === 'baron' ? '#8B0000' :
          demon.type === 'cacodemon' ? '#DC143C' : '#B22222';

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;

        if (demon.type === 'cacodemon') {
          // Round floating demon
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
          // Eye
          ctx.fillStyle = '#00ff00';
          ctx.beginPath();
          ctx.arc(-size * 0.2, -size * 0.1, size * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(-size * 0.15, -size * 0.1, size * 0.15, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Humanoid demon
          ctx.fillRect(-size / 2, -size, size, size * 1.5);
          // Horns
          ctx.beginPath();
          ctx.moveTo(-size / 2, -size);
          ctx.lineTo(-size / 2 - size * 0.3, -size - size * 0.5);
          ctx.lineTo(-size / 4, -size);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(size / 2, -size);
          ctx.lineTo(size / 2 + size * 0.3, -size - size * 0.5);
          ctx.lineTo(size / 4, -size);
          ctx.fill();
          // Eyes
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(-size * 0.3, -size * 0.7, size * 0.2, size * 0.15);
          ctx.fillRect(size * 0.1, -size * 0.7, size * 0.2, size * 0.15);
        }

        ctx.restore();
      });

      // Muzzle flash
      if (muzzleFlash) {
        ctx.fillStyle = 'rgba(255, 200, 50, 0.8)';
        ctx.beginPath();
        ctx.moveTo(w / 2, h - 50);
        ctx.lineTo(w / 2 - 30, h - 100);
        ctx.lineTo(w / 2, h - 80);
        ctx.lineTo(w / 2 + 30, h - 100);
        ctx.closePath();
        ctx.fill();
      }

      // Weapon
      ctx.fillStyle = '#333';
      ctx.fillRect(w / 2 - 15, h - 60, 30, 60);
      ctx.fillStyle = '#222';
      ctx.fillRect(w / 2 - 10, h - 80, 20, 30);
      ctx.fillStyle = '#111';
      ctx.fillRect(w / 2 - 5, h - 100, 10, 25);

      // Crosshair
      ctx.strokeStyle = '#ff3333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 15, h / 2);
      ctx.lineTo(w / 2 - 5, h / 2);
      ctx.moveTo(w / 2 + 5, h / 2);
      ctx.lineTo(w / 2 + 15, h / 2);
      ctx.moveTo(w / 2, h / 2 - 15);
      ctx.lineTo(w / 2, h / 2 - 5);
      ctx.moveTo(w / 2, h / 2 + 5);
      ctx.lineTo(w / 2, h / 2 + 15);
      ctx.stroke();

      // CRT scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let i = 0; i < h; i += 3) {
        ctx.fillRect(0, i, w, 1);
      }

      requestAnimationFrame(render);
    };

    const animFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrame);
  }, [demons, muzzleFlash]);

  return (
    <div
      className="w-full border-2 overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-primary))',
        backgroundColor: '#0a0505',
        height: '520px',
      }}
    >
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start p-4">
        <div className="flex items-center gap-4">
          {/* Health */}
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-600 fill-red-600" />
            <div className="w-24 h-4 bg-gray-900 border border-red-900">
              <motion.div
                className="h-full bg-red-600"
                animate={{ width: `${gameState.health}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-red-500 font-bold text-sm font-mono">{gameState.health}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Score */}
          <div className="text-right">
            <p className="text-red-500 font-bold text-xs uppercase">Score</p>
            <p className="text-red-400 font-bold text-xl font-mono">{gameState.score}</p>
          </div>
          {/* Wave */}
          <div className="text-right">
            <p className="text-red-500 font-bold text-xs uppercase">Wave</p>
            <p className="text-red-400 font-bold text-xl font-mono">{gameState.wave}/5</p>
          </div>
        </div>
      </div>

      {/* Ammo */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
        <Crosshair className="w-5 h-5 text-yellow-500" />
        <span className="text-yellow-500 font-bold text-lg font-mono">{gameState.ammo}</span>
        <span className="text-yellow-700 text-xs uppercase">Ammo</span>
      </div>

      {/* Sound toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="absolute bottom-4 right-4 z-20 p-2 text-red-500 hover:text-red-400"
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        onClick={shoot}
        className="w-full h-full cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Start/Game Over overlay */}
      {!playing || gameState.gameOver ? (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80">
          {gameState.gameOver ? (
            <>
              <Skull className="w-16 h-16 text-red-600 mb-4" />
              <h2 className="text-3xl font-bold text-red-500 uppercase mb-2">
                {gameState.victory ? 'Victory!' : 'Game Over'}
              </h2>
              <p className="text-red-400 text-lg mb-2">Final Score: {gameState.score}</p>
              <p className="text-red-600 text-sm mb-6">Wave {gameState.wave}/5</p>
            </>
          ) : (
            <>
              <Skull className="w-20 h-20 text-red-600 mb-4" />
              <h2 className="text-4xl font-bold text-red-500 uppercase mb-2">Demon Slayer</h2>
              <p className="text-red-400 text-sm mb-6">Click to shoot. Survive 5 waves.</p>
            </>
          )}
          <button
            onClick={startGame}
            className="flex items-center gap-2 px-8 py-3 bg-red-700 hover:bg-red-600 text-white font-bold uppercase transition-colors"
          >
            {gameState.gameOver ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {gameState.gameOver ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function Doom64Page() {
  return (
    <ProductPageLayout
      theme="doom-64"
      targetUser="anyone who needs to destroy their demons"
      problemStatement="Sometimes you just need to shoot something. Stress needs an outlet."
      problemContext="Work piles up. Frustration builds. We sit in chairs all day with no physical release. Ancient humans would hunt or fight. We answer emails. The primal part of our brain craves action, destruction, victory. It has nowhere to go."
      insight="Games are not escapism. They are pressure valves. A few minutes of focused destruction can reset your nervous system better than an hour of meditation. Sometimes the healthiest thing is to rip and tear."
      tradeoffs={['Action over contemplation', 'Release over restraint', 'Fun over productivity']}
      appName="Demon Slayer"
      appDescription="A playable mini-game. Click demons to destroy them. Survive 5 waves."
      principles={[
        {
          title: 'High Contrast',
          description: 'Blood red on black. No ambiguity, no softness. The visual language demands attention and action.',
        },
        {
          title: 'Primal Satisfaction',
          description: 'Direct cause and effect. Click, demon dies. No complexity, pure visceral feedback.',
        },
        {
          title: 'Retro Aesthetic',
          description: 'Pixelated graphics, CRT scanlines. Nostalgia for a simpler time when games were games.',
        },
        {
          title: 'Raw Energy',
          description: 'No polish, no refinement. Design that feels urgent, powerful, ready to fight.',
        },
      ]}
      quote={{
        text: 'RIP AND TEAR, UNTIL IT IS DONE.',
        author: 'Doom Slayer',
      }}
    >
      <DoomMiniGame />

      <div className="mt-16">
        <h3 className="text-xl font-bold uppercase mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Blood Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Red and black. Click to copy hex values.
        </p>
        <ColorPalette colors={themeColors['doom-64']} />
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-bold uppercase mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Battle Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
