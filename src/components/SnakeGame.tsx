import React, { useEffect, useRef, useState } from 'react';

export const SnakeGame = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 20;
    const tileCountX = canvas.width / gridSize;
    const tileCountY = canvas.height / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let velocity = { x: 0, y: 0 };
    let food = { x: 15, y: 15 };
    let currentScore = 0;
    let isGameOver = false;

    let animationFrameId: number;
    let lastTime = 0;
    const speed = 10;
    const interval = 1000 / speed;

    const resetGame = () => {
      snake = [{ x: 10, y: 10 }];
      velocity = { x: 0, y: 0 };
      food = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY),
      };
      currentScore = 0;
      setScore(0);
      isGameOver = false;
      setGameOver(false);
    };

    const draw = () => {
      ctx.fillStyle = '#11111b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isGameOver) {
        ctx.fillStyle = '#f38ba8';
        ctx.font = '24px "Fira Code"';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = '#cdd6f4';
        ctx.font = '16px "Fira Code"';
        ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 20);
        return;
      }

      ctx.fillStyle = '#a6e3a1';
      snake.forEach((segment) => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
      });

      ctx.fillStyle = '#f38ba8';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    };

    const update = () => {
      if (isGameOver || (velocity.x === 0 && velocity.y === 0)) return;

      const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

      if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        isGameOver = true;
        setGameOver(true);
        return;
      }

      if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        isGameOver = true;
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        currentScore += 10;
        setScore(currentScore);
        food = {
          x: Math.floor(Math.random() * tileCountX),
          y: Math.floor(Math.random() * tileCountY),
        };
      } else {
        snake.pop();
      }
    };

    const loop = (time: number) => {
      animationFrameId = requestAnimationFrame(loop);
      const deltaTime = time - lastTime;

      if (deltaTime > interval) {
        update();
        draw();
        lastTime = time - (deltaTime % interval);
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    const handleKey = (e: KeyboardEvent) => {
      if (isGameOver && e.code === 'Space') {
        resetGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (velocity.y !== 1) velocity = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (velocity.y !== -1) velocity = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (velocity.x !== 1) velocity = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (velocity.x !== -1) velocity = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#11111b] flex flex-col items-center justify-center font-mono">
      <div className="text-[#cdd6f4] mb-4 text-xl flex justify-between w-[400px]">
        <span>SNAKE</span>
        <span>SCORE: {score}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border-2 border-[#45475a] shadow-lg rounded"
      />
      <div className="mt-8 text-[#a6adc8] text-sm opacity-80 animate-pulse">
        Press ESC to exit
      </div>
    </div>
  );
};
