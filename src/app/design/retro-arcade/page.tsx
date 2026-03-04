'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Gamepad2, Play, RotateCcw, Trophy } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  alive: boolean;
  points: number;
}

interface GameState {
  score: number;
  lives: number;
  level: number;
  gameOver: boolean;
  victory: boolean;
}

function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    victory: false,
  });
  const [playing, setPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const ballRef = useRef<Ball>({ x: 250, y: 350, dx: 4, dy: -4, radius: 8 });
  const paddleRef = useRef({ x: 200, y: 380, width: 80, height: 12 });
  const bricksRef = useRef<Brick[]>([]);
  const animationRef = useRef<number>(0);

  const colors = ['#ff0055', '#ff6600', '#ffcc00', '#00ff66', '#00ccff', '#cc00ff'];

  const initBricks = useCallback((level: number) => {
    const bricks: Brick[] = [];
    const rows = Math.min(4 + level, 7);
    const cols = 10;
    const brickWidth = 45;
    const brickHeight = 15;
    const padding = 5;
    const offsetX = 25;
    const offsetY = 40;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        bricks.push({
          x: offsetX + col * (brickWidth + padding),
          y: offsetY + row * (brickHeight + padding),
          width: brickWidth,
          height: brickHeight,
          color: colors[row % colors.length],
          alive: true,
          points: (rows - row) * 10,
        });
      }
    }
    bricksRef.current = bricks;
  }, [colors]);

  const resetBall = useCallback(() => {
    ballRef.current = {
      x: 250,
      y: 350,
      dx: (Math.random() > 0.5 ? 1 : -1) * (3 + gameState.level * 0.5),
      dy: -(3 + gameState.level * 0.5),
      radius: 8,
    };
  }, [gameState.level]);

  const startGame = useCallback(() => {
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      victory: false,
    });
    initBricks(1);
    resetBall();
    paddleRef.current = { x: 200, y: 380, width: 80, height: 12 };
    setPlaying(true);
  }, [initBricks, resetBall]);

  // Mouse/touch control
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMove = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const x = (clientX - rect.left) * scaleX;
      paddleRef.current.x = Math.max(0, Math.min(canvas.width - paddleRef.current.width, x - paddleRef.current.width / 2));
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!playing || gameState.gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      const ball = ballRef.current;
      const paddle = paddleRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Clear
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);

      // Draw scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let i = 0; i < h; i += 4) {
        ctx.fillRect(0, i, w, 2);
      }

      // Update ball position
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collisions
      if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= w) {
        ball.dx = -ball.dx;
      }
      if (ball.y - ball.radius <= 0) {
        ball.dy = -ball.dy;
      }

      // Paddle collision
      if (
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width
      ) {
        ball.dy = -Math.abs(ball.dy);
        // Add angle based on where ball hits paddle
        const hitPos = (ball.x - paddle.x) / paddle.width;
        ball.dx = (hitPos - 0.5) * 8;
      }

      // Ball out of bounds
      if (ball.y > h) {
        setGameState(prev => {
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            if (prev.score > highScore) setHighScore(prev.score);
            return { ...prev, lives: 0, gameOver: true };
          }
          resetBall();
          return { ...prev, lives: newLives };
        });
      }

      // Brick collisions
      let allDestroyed = true;
      bricksRef.current.forEach(brick => {
        if (!brick.alive) return;
        allDestroyed = false;

        if (
          ball.x + ball.radius > brick.x &&
          ball.x - ball.radius < brick.x + brick.width &&
          ball.y + ball.radius > brick.y &&
          ball.y - ball.radius < brick.y + brick.height
        ) {
          brick.alive = false;
          ball.dy = -ball.dy;
          setGameState(prev => ({ ...prev, score: prev.score + brick.points }));
        }
      });

      // Check level complete
      if (allDestroyed && bricksRef.current.length > 0) {
        setGameState(prev => {
          if (prev.level >= 5) {
            if (prev.score > highScore) setHighScore(prev.score);
            return { ...prev, victory: true, gameOver: true };
          }
          const newLevel = prev.level + 1;
          initBricks(newLevel);
          resetBall();
          return { ...prev, level: newLevel };
        });
      }

      // Draw bricks
      bricksRef.current.forEach(brick => {
        if (!brick.alive) return;
        ctx.fillStyle = brick.color;
        ctx.shadowColor = brick.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.shadowBlur = 0;

        // Brick highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(brick.x, brick.y, brick.width, 3);
      });

      // Draw paddle
      const paddleGradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
      paddleGradient.addColorStop(0, '#00ffcc');
      paddleGradient.addColorStop(1, '#00aa88');
      ctx.fillStyle = paddleGradient;
      ctx.shadowColor = '#00ffcc';
      ctx.shadowBlur = 15;
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.shadowBlur = 0;

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw ball trail
      ctx.beginPath();
      ctx.moveTo(ball.x, ball.y);
      ctx.lineTo(ball.x - ball.dx * 3, ball.y - ball.dy * 3);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = ball.radius;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [playing, gameState.gameOver, highScore, initBricks, resetBall]);

  return (
    <div
      className="w-full border-2 overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-primary))',
        backgroundColor: '#0a0a0f',
        height: '520px',
      }}
    >
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-4 py-2 border-b-2" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-gray-500">Score</span>
            <p className="text-lg font-bold font-mono" style={{ color: 'hsl(var(--theme-primary))' }}>{gameState.score}</p>
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-gray-500">High</span>
            <p className="text-lg font-bold font-mono text-yellow-400">{highScore}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-mono uppercase text-gray-500">Level</span>
            <p className="text-lg font-bold font-mono text-cyan-400">{gameState.level}</p>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: i < gameState.lives ? '#ff0055' : '#333',
                  boxShadow: i < gameState.lives ? '0 0 10px #ff0055' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="w-full h-full cursor-none"
        style={{ marginTop: '50px' }}
      />

      {/* Start/Game Over overlay */}
      {!playing || gameState.gameOver ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85">
          {gameState.gameOver ? (
            <>
              {gameState.victory ? (
                <Trophy className="w-16 h-16 text-yellow-400 mb-4" style={{ filter: 'drop-shadow(0 0 20px #facc15)' }} />
              ) : (
                <Gamepad2 className="w-16 h-16 text-red-500 mb-4" />
              )}
              <h2 className="text-3xl font-bold font-mono uppercase mb-2" style={{ color: gameState.victory ? '#facc15' : '#ff0055' }}>
                {gameState.victory ? 'You Win!' : 'Game Over'}
              </h2>
              <p className="text-xl font-mono mb-1" style={{ color: 'hsl(var(--theme-primary))' }}>
                Score: {gameState.score}
              </p>
              {gameState.score >= highScore && gameState.score > 0 && (
                <p className="text-sm font-mono text-yellow-400 mb-4">New High Score!</p>
              )}
            </>
          ) : (
            <>
              <Gamepad2 className="w-20 h-20 mb-4" style={{ color: 'hsl(var(--theme-primary))', filter: 'drop-shadow(0 0 20px hsl(var(--theme-primary)))' }} />
              <h2 className="text-4xl font-bold font-mono uppercase mb-2" style={{ color: 'hsl(var(--theme-primary))' }}>
                Breakout
              </h2>
              <p className="text-sm font-mono text-gray-400 mb-6">Move mouse to control paddle</p>
            </>
          )}
          <button
            onClick={startGame}
            className="flex items-center gap-2 px-8 py-3 font-bold font-mono uppercase transition-all hover:scale-105"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: '#000',
              boxShadow: '0 0 30px hsl(var(--theme-primary) / 0.5)',
            }}
          >
            {gameState.gameOver ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {gameState.gameOver ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function RetroArcadePage() {
  return (
    <ProductPageLayout
      theme="retro-arcade"
      targetUser="anyone who misses the arcade"
      problemStatement="Games today are complicated. Tutorials, cutscenes, skill trees. Where is the simple joy?"
      problemContext="Arcade games were pure. Insert coin, play immediately. No accounts, no updates, no grinding. Just you, the machine, and the high score board. That simplicity was not a limitation. It was the point. Modern games have forgotten that fun can be instant."
      insight="Classic games endure because they respect the player. No time wasted. No confusion. Just challenge, feedback, and the promise that with practice, you will get better. Breakout is 50 years old and still satisfying."
      tradeoffs={['Simplicity over complexity', 'Instant fun over progression', 'Pure gameplay over narrative']}
      appName="Breakout"
      appDescription="A playable arcade classic. Move mouse to control the paddle. Break all bricks."
      principles={[
        {
          title: 'Pixel Perfect',
          description: 'Sharp edges and bold pixels honor the 8-bit era. Every element feels deliberate and chunky.',
        },
        {
          title: 'Neon Glow',
          description: 'CRT-style bloom effects make colors pop. The screen feels alive with electric energy.',
        },
        {
          title: 'Instant Feedback',
          description: 'Every action has immediate visual response. Hit a brick, see it shatter, feel the satisfaction.',
        },
        {
          title: 'One More Try',
          description: 'Quick restart, clear progress. The loop that made arcades addictive.',
        },
      ]}
      quote={{
        text: 'The game has changed. The players have not.',
        author: 'Arcade Wisdom',
      }}
    >
      <BreakoutGame />

      <div className="mt-16">
        <h3 className="text-xl font-bold font-mono uppercase mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Color RAM
        </h3>
        <p className="text-sm font-mono mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Primary colors and neon accents. Click to copy.
        </p>
        <ColorPalette colors={themeColors['retro-arcade']} />
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-bold font-mono uppercase mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Power-Ups
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
