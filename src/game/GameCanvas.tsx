import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Difficulty,
  Enemy,
  EnemyType,
  GraphicsQuality,
  Language,
  LevelConfig,
  Particle,
  Player,
  PowerUpItem,
  PowerUpType,
  Bullet
} from '../types/game';
import { LEVELS } from '../utils/levels';
import { soundManager } from '../utils/audio';
import { getTranslation } from '../utils/translations';
import confetti from 'canvas-confetti';
import {
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  Bomb as BombIcon,
  Home,
  Skull,
  Award
} from 'lucide-react';

interface GameCanvasProps {
  difficulty: Difficulty;
  graphicsQuality: GraphicsQuality;
  language: Language;
  onReturnToMenu: () => void;
  onGameVictory: (finalScore: number) => void;
  bgmMuted: boolean;
  sfxMuted: boolean;
  onToggleMute: (type: 'bgm' | 'sfx') => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  difficulty,
  graphicsQuality,
  language,
  onReturnToMenu,
  onGameVictory,
  sfxMuted,
  onToggleMute
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game state references
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('savetheearth_highscore') || '0', 10);
  });
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [levelIntroBanner, setLevelIntroBanner] = useState<string | null>(null);
  const [bossWarningBanner, setBossWarningBanner] = useState<string | null>(null);

  // Gameplay state
  const playerRef = useRef<Player>({
    x: 0,
    y: 0,
    width: 48,
    height: 54,
    hp: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 3 : 2,
    maxHp: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 3 : 2,
    weapon: 'single',
    weaponTimer: 0,
    shieldTimer: 0,
    bombs: difficulty === 'easy' ? 3 : 2,
    isInvulnerable: false,
    invulnerableTimer: 0
  });

  const enemiesRef = useRef<Enemy[]>([]);
  const playerBulletsRef = useRef<Bullet[]>([]);
  const enemyBulletsRef = useRef<Bullet[]>([]);
  const powerUpsRef = useRef<PowerUpItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<{ x: number; y: number; size: number; speed: number; opacity: number }[]>([]);

  // Wave & Spawn Management
  const currentWaveIndexRef = useRef(0);
  const waveEnemiesSpawnedRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const levelCompletedRef = useRef(false);
  const lastFireTimeRef = useRef(0);
  const activeBossRef = useRef<Enemy | null>(null);

  // Input State
  const pointerPosRef = useRef<{ x: number; y: number; isDown: boolean }>({
    x: 0,
    y: 0,
    isDown: false
  });
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const currentLevelConfig: LevelConfig = LEVELS[currentLevelIndex] || LEVELS[0];

  // Helper to trigger bomb
  const triggerMegaBomb = useCallback(() => {
    if (playerRef.current.bombs <= 0 || isPaused || isGameOver || isVictory) return;

    playerRef.current.bombs -= 1;
    soundManager.playBombBlast();

    // Spawn massive shockwave particles
    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80;
      const speed = 4 + Math.random() * 8;
      particlesRef.current.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 4 + Math.random() * 6,
        color: '#f59e0b',
        alpha: 1,
        decay: 0.02
      });
    }

    // Destroy all normal enemies & deal massive damage to bosses
    enemiesRef.current.forEach((enemy) => {
      if (enemy.type.startsWith('boss')) {
        enemy.hp -= 250;
        setScore((prev) => prev + 500);
      } else {
        enemy.hp = 0;
        setScore((prev) => prev + enemy.points);
        // Create explosion
        for (let p = 0; p < 12; p++) {
          particlesRef.current.push({
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            radius: 3 + Math.random() * 4,
            color: '#ef4444',
            alpha: 1,
            decay: 0.03
          });
        }
      }
    });

    // Clear enemy bullets
    enemyBulletsRef.current = [];
  }, [isPaused, isGameOver, isVictory]);

  // Handle Keyboard bomb & pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        triggerMegaBomb();
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        setIsPaused((prev) => !prev);
      } else {
        keysRef.current[e.code] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerMegaBomb]);

  // Init Canvas & Stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Generate stars
    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    const count = graphicsQuality === 'low' ? 40 : graphicsQuality === 'medium' ? 80 : 120;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    starsRef.current = stars;

    // Place Player at bottom center
    playerRef.current.x = canvas.width / 2 - playerRef.current.width / 2;
    playerRef.current.y = canvas.height - 100;
  }, [graphicsQuality]);

  // Level Initialization Banner & Music
  useEffect(() => {
    const isBoss = currentLevelConfig.isBossLevel;
    soundManager.startBGM(isBoss);

    levelCompletedRef.current = false;
    currentWaveIndexRef.current = 0;
    waveEnemiesSpawnedRef.current = 0;
    enemiesRef.current = [];
    playerBulletsRef.current = [];
    enemyBulletsRef.current = [];
    powerUpsRef.current = [];
    activeBossRef.current = null;

    if (isBoss) {
      const bossNameKey =
        currentLevelConfig.bossType === 'boss1'
          ? 'boss1Name'
          : currentLevelConfig.bossType === 'boss2'
          ? 'boss2Name'
          : 'boss3Name';
      setBossWarningBanner(getTranslation(language, bossNameKey));
      const timer = setTimeout(() => setBossWarningBanner(null), 3000);
      return () => clearTimeout(timer);
    } else {
      setLevelIntroBanner(
        `${getTranslation(language, 'levelStart')} ${currentLevelConfig.level}: ${
          language === 'fa' ? currentLevelConfig.nameFa : currentLevelConfig.nameEn
        }`
      );
      const timer = setTimeout(() => setLevelIntroBanner(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentLevelIndex, language, currentLevelConfig]);

  // Main Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1); // clamp delta time
      lastTime = currentTime;

      if (!isPaused && !isGameOver && !isVictory) {
        updateGame(dt);
      }
      renderGame();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isGameOver, isVictory, currentLevelIndex, graphicsQuality]);

  // UPDATE GAME LOGIC
  const updateGame = (dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const player = playerRef.current;

    // 1. Player Timers
    if (player.weaponTimer > 0) {
      player.weaponTimer -= dt;
      if (player.weaponTimer <= 0) {
        player.weapon = 'single';
      }
    }
    if (player.shieldTimer > 0) {
      player.shieldTimer -= dt;
    }
    if (player.isInvulnerable) {
      player.invulnerableTimer -= dt;
      if (player.invulnerableTimer <= 0) {
        player.isInvulnerable = false;
      }
    }

    // 2. Player Movement (Touch/Mouse Pointer + Keyboard WASD)
    let targetX = player.x;
    let targetY = player.y;

    if (pointerPosRef.current.isDown) {
      targetX = pointerPosRef.current.x - player.width / 2;
      targetY = pointerPosRef.current.y - player.height / 2;
    }

    const kbSpeed = 400 * dt;
    if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) targetX -= kbSpeed;
    if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) targetX += kbSpeed;
    if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) targetY -= kbSpeed;
    if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) targetY += kbSpeed;

    // Smooth movement towards target
    const lerpSpeed = 15;
    player.x += (targetX - player.x) * Math.min(lerpSpeed * dt, 1);
    player.y += (targetY - player.y) * Math.min(lerpSpeed * dt, 1);

    // Keep player inside canvas
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    // 3. Player Auto Firing
    const fireInterval = player.weapon === 'rapid' ? 0.09 : 0.18;
    const now = performance.now() / 1000;
    if (now - lastFireTimeRef.current >= fireInterval) {
      lastFireTimeRef.current = now;
      soundManager.playLaser(player.weapon);

      const px = player.x + player.width / 2;
      const py = player.y;

      if (player.weapon === 'single') {
        playerBulletsRef.current.push({
          id: Math.random().toString(),
          x: px - 3,
          y: py - 10,
          width: 6,
          height: 16,
          isPlayer: true,
          speedX: 0,
          speedY: -650,
          damage: 12,
          color: '#06b6d4',
          radius: 3
        });
      } else if (player.weapon === 'triple') {
        [-0.3, 0, 0.3].forEach((angle) => {
          playerBulletsRef.current.push({
            id: Math.random().toString(),
            x: px - 3,
            y: py - 10,
            width: 6,
            height: 16,
            isPlayer: true,
            speedX: Math.sin(angle) * 350,
            speedY: -Math.cos(angle) * 650,
            damage: 10,
            color: '#f59e0b',
            radius: 3
          });
        });
      } else if (player.weapon === 'rapid') {
        [-4, 4].forEach((offsetX) => {
          playerBulletsRef.current.push({
            id: Math.random().toString(),
            x: px + offsetX - 3,
            y: py - 10,
            width: 6,
            height: 18,
            isPlayer: true,
            speedX: 0,
            speedY: -800,
            damage: 8,
            color: '#ec4899',
            radius: 3
          });
        });
      }
    }

    // 4. Wave Spawner Logic
    const waves = currentLevelConfig.waves;
    const currentWave = waves[currentWaveIndexRef.current];

    if (currentWave && !levelCompletedRef.current) {
      if (waveEnemiesSpawnedRef.current < currentWave.count) {
        if (now - lastSpawnTimeRef.current >= currentWave.spawnInterval) {
          lastSpawnTimeRef.current = now;
          spawnEnemy(currentWave.enemyType, currentWave.formation, waveEnemiesSpawnedRef.current, currentWave.count, canvas);
          waveEnemiesSpawnedRef.current += 1;
        }
      } else {
        // Wave enemies all spawned. Check if all defeated before advancing wave
        if (enemiesRef.current.length === 0) {
          if (currentWaveIndexRef.current < waves.length - 1) {
            currentWaveIndexRef.current += 1;
            waveEnemiesSpawnedRef.current = 0;
          } else {
            // Level Completed!
            levelCompletedRef.current = true;
            soundManager.playVictoryFanfare();

            if (currentLevelIndex < LEVELS.length - 1) {
              setTimeout(() => {
                setCurrentLevelIndex((prev) => prev + 1);
              }, 1800);
            } else {
              // Game Victory!
              setIsVictory(true);
              soundManager.stopBGM();
              confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
              onGameVictory(score);
            }
          }
        }
      }
    }

    // 5. Update Enemies
    enemiesRef.current.forEach((enemy) => {
      enemy.animFrame += dt * 5;

      // Boss patterns vs Normal enemy movement
      if (enemy.type.startsWith('boss')) {
        activeBossRef.current = enemy;
        // Smooth boss hovering across top half
        enemy.x += enemy.speedX * dt * 100;
        if (enemy.x <= 20 || enemy.x + enemy.width >= canvas.width - 20) {
          enemy.speedX *= -1;
        }

        // Boss shooting
        enemy.shootTimer -= dt;
        if (enemy.shootTimer <= 0) {
          enemy.shootTimer = enemy.shootInterval;
          soundManager.playAlienLaser();

          const bx = enemy.x + enemy.width / 2;
          const by = enemy.y + enemy.height - 10;

          if (enemy.type === 'boss1') {
            [-0.2, 0, 0.2].forEach((angle) => {
              enemyBulletsRef.current.push({
                id: Math.random().toString(),
                x: bx - 4,
                y: by,
                width: 8,
                height: 16,
                isPlayer: false,
                speedX: Math.sin(angle) * 200,
                speedY: Math.cos(angle) * 320,
                damage: 1,
                color: '#ef4444',
                radius: 4
              });
            });
          } else if (enemy.type === 'boss2') {
            // Skull Destroyer: Homing missile style salvo
            for (let i = -2; i <= 2; i++) {
              enemyBulletsRef.current.push({
                id: Math.random().toString(),
                x: bx + i * 15,
                y: by,
                width: 10,
                height: 20,
                isPlayer: false,
                speedX: i * 60,
                speedY: 360,
                damage: 1,
                color: '#a855f7',
                radius: 5
              });
            }
          } else if (enemy.type === 'boss3') {
            // Final Empress: Radial ring attack
            for (let a = 0; a < 8; a++) {
              const rad = (Math.PI * 2 * a) / 8;
              enemyBulletsRef.current.push({
                id: Math.random().toString(),
                x: bx,
                y: by,
                width: 10,
                height: 10,
                isPlayer: false,
                speedX: Math.cos(rad) * 220,
                speedY: Math.sin(rad) * 220,
                damage: 1,
                color: '#f43f5e',
                radius: 5
              });
            }
          }
        }
      } else {
        // Normal enemy wobble / movement
        enemy.waveOffset += dt * 3;
        enemy.x = enemy.originalX + Math.sin(enemy.waveOffset) * 40;
        enemy.y += enemy.speedY * dt * 60;

        // Enemy shooting
        enemy.shootTimer -= dt;
        if (enemy.shootTimer <= 0) {
          enemy.shootTimer = enemy.shootInterval + Math.random() * 2;
          if (enemy.y > 0 && enemy.y < canvas.height - 150) {
            soundManager.playAlienLaser();
            enemyBulletsRef.current.push({
              id: Math.random().toString(),
              x: enemy.x + enemy.width / 2 - 3,
              y: enemy.y + enemy.height,
              width: 6,
              height: 14,
              isPlayer: false,
              speedX: (Math.random() - 0.5) * 60,
              speedY: 280,
              damage: 1,
              color: '#ef4444',
              radius: 3
            });
          }
        }
      }
    });

    // Remove offscreen or dead enemies
    enemiesRef.current = enemiesRef.current.filter((e) => e.hp > 0 && e.y < canvas.height + 50);

    // 6. Update Player Bullets & Collision
    playerBulletsRef.current.forEach((bullet) => {
      bullet.x += bullet.speedX * dt;
      bullet.y += bullet.speedY * dt;

      // Check collision with enemies
      enemiesRef.current.forEach((enemy) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          bullet.y = -999; // destroy bullet
          enemy.hp -= bullet.damage;

          // Spark particle
          particlesRef.current.push({
            x: bullet.x,
            y: bullet.y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            radius: 2 + Math.random() * 3,
            color: '#06b6d4',
            alpha: 1,
            decay: 0.08
          });

          if (enemy.hp <= 0) {
            soundManager.playExplosion(enemy.type.startsWith('boss'));
            setScore((prev) => {
              const newScore = prev + enemy.points;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('savetheearth_highscore', newScore.toString());
              }
              return newScore;
            });

            // Explosion Particles
            const particleCount = enemy.type.startsWith('boss') ? 40 : 12;
            for (let i = 0; i < particleCount; i++) {
              particlesRef.current.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                vx: (Math.random() - 0.5) * (enemy.type.startsWith('boss') ? 10 : 6),
                vy: (Math.random() - 0.5) * (enemy.type.startsWith('boss') ? 10 : 6),
                radius: 3 + Math.random() * (enemy.type.startsWith('boss') ? 6 : 3),
                color: enemy.color,
                alpha: 1,
                decay: 0.03
              });
            }

            // Powerup Drop Chance
            const dropChance = enemy.type === 'golden' ? 1.0 : enemy.type.startsWith('boss') ? 1.0 : 0.25;
            if (Math.random() <= dropChance) {
              const types: PowerUpType[] = ['triple', 'rapid', 'shield', 'bomb', 'life'];
              const chosenType = types[Math.floor(Math.random() * types.length)];
              powerUpsRef.current.push({
                id: Math.random().toString(),
                x: enemy.x + enemy.width / 2 - 14,
                y: enemy.y + enemy.height / 2,
                width: 28,
                height: 28,
                type: chosenType,
                speedY: 120
              });
            }
          }
        }
      });
    });

    playerBulletsRef.current = playerBulletsRef.current.filter((b) => b.y > -50 && b.y < canvas.height + 50);

    // 7. Update Enemy Bullets & Collision with Player
    enemyBulletsRef.current.forEach((bullet) => {
      bullet.x += bullet.speedX * dt;
      bullet.y += bullet.speedY * dt;

      // Check collision with Player
      if (
        !player.isInvulnerable &&
        player.shieldTimer <= 0 &&
        bullet.x < player.x + player.width &&
        bullet.x + bullet.width > player.x &&
        bullet.y < player.y + player.height &&
        bullet.y + bullet.height > player.y
      ) {
        bullet.y = 9999;
        onPlayerDamaged();
      }
    });

    enemyBulletsRef.current = enemyBulletsRef.current.filter((b) => b.y > -50 && b.y < canvas.height + 50);

    // 8. Enemy Collision with Player Ship directly
    enemiesRef.current.forEach((enemy) => {
      if (
        !player.isInvulnerable &&
        player.shieldTimer <= 0 &&
        enemy.x < player.x + player.width &&
        enemy.x + enemy.width > player.x &&
        enemy.y < player.y + player.height &&
        enemy.y + enemy.height > player.y
      ) {
        enemy.hp -= 50;
        onPlayerDamaged();
      }
    });

    // 9. Update PowerUps & Collection
    powerUpsRef.current.forEach((item) => {
      item.y += item.speedY * dt;

      // Magnetic pull to player
      const dx = player.x + player.width / 2 - (item.x + item.width / 2);
      const dy = player.y + player.height / 2 - (item.y + item.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        item.x += (dx / dist) * 150 * dt;
        item.y += (dy / dist) * 150 * dt;
      }

      // Collect
      if (
        item.x < player.x + player.width &&
        item.x + item.width > player.x &&
        item.y < player.y + player.height &&
        item.y + item.height > player.y
      ) {
        item.y = 9999;
        soundManager.playPowerUp();

        if (item.type === 'triple') {
          player.weapon = 'triple';
          player.weaponTimer = 10;
        } else if (item.type === 'rapid') {
          player.weapon = 'rapid';
          player.weaponTimer = 10;
        } else if (item.type === 'shield') {
          player.shieldTimer = 8;
        } else if (item.type === 'bomb') {
          player.bombs = Math.min(5, player.bombs + 1);
        } else if (item.type === 'life') {
          player.hp = Math.min(player.maxHp, player.hp + 1);
        }
      }
    });

    powerUpsRef.current = powerUpsRef.current.filter((p) => p.y < canvas.height + 50);

    // 10. Update Particles
    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
    });
    particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

    // 11. Stars Parallax Background
    starsRef.current.forEach((star) => {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });
  };

  // Player damaged handler
  const onPlayerDamaged = () => {
    const player = playerRef.current;
    if (player.shieldTimer > 0) return; // Shield absorbed hit

    soundManager.playPlayerHit();
    player.hp -= 1;
    player.isInvulnerable = true;
    player.invulnerableTimer = 1.8;

    if (player.hp <= 0) {
      setIsGameOver(true);
      soundManager.stopBGM();
      soundManager.playGameOver();
    }
  };

  // Enemy Spawner helper
  const spawnEnemy = (
    type: EnemyType,
    formation: string,
    spawnIndex: number,
    totalInWave: number,
    canvas: HTMLCanvasElement
  ) => {
    const isBoss = type.startsWith('boss');
    let width = 42;
    let height = 42;
    let hp = 20;
    let speedY = 1.5;
    let points = 100;
    let color = '#06b6d4';
    let shootInterval = 2.5;

    if (type === 'invader') {
      width = 40;
      height = 36;
      hp = 15;
      points = 100;
      color = '#06b6d4';
    } else if (type === 'saucer') {
      width = 46;
      height = 38;
      hp = 25;
      points = 150;
      color = '#a855f7';
    } else if (type === 'scout') {
      width = 36;
      height = 36;
      hp = 12;
      speedY = 2.5;
      points = 120;
      color = '#22c55e';
    } else if (type === 'cruiser') {
      width = 54;
      height = 48;
      hp = 60;
      speedY = 1.0;
      points = 300;
      color = '#eab308';
    } else if (type === 'kamikaze') {
      width = 38;
      height = 38;
      hp = 18;
      speedY = 3.2;
      points = 200;
      color = '#ef4444';
    } else if (type === 'golden') {
      width = 44;
      height = 44;
      hp = 40;
      points = 500;
      color = '#fbbf24';
    } else if (type === 'boss1') {
      width = 110;
      height = 80;
      hp = difficulty === 'hard' ? 700 : difficulty === 'medium' ? 500 : 350;
      points = 3000;
      color = '#ec4899';
      shootInterval = 1.2;
    } else if (type === 'boss2') {
      width = 130;
      height = 100;
      hp = difficulty === 'hard' ? 1200 : difficulty === 'medium' ? 900 : 650;
      points = 6000;
      color = '#8b5cf6';
      shootInterval = 1.0;
    } else if (type === 'boss3') {
      width = 160;
      height = 120;
      hp = difficulty === 'hard' ? 2200 : difficulty === 'medium' ? 1600 : 1200;
      points = 12000;
      color = '#f43f5e';
      shootInterval = 0.8;
    }

    // Formation positioning
    let startX = canvas.width / 2 - width / 2;
    let startY = -height - 10;

    if (formation === 'grid') {
      const cols = 6;
      const col = spawnIndex % cols;
      const row = Math.floor(spawnIndex / cols);
      const spacingX = (canvas.width - 80) / cols;
      startX = 40 + col * spacingX + spacingX / 2 - width / 2;
      startY = -100 - row * 50;
    } else if (formation === 'v_shape') {
      const isLeft = spawnIndex % 2 === 0;
      const offset = Math.floor(spawnIndex / 2);
      startX = canvas.width / 2 + (isLeft ? -offset * 40 : offset * 40) - width / 2;
      startY = -50 - offset * 35;
    } else if (formation === 'circle' || formation === 'side_swipe') {
      startX = (spawnIndex / totalInWave) * (canvas.width - 80) + 40;
      startY = -60 - (spawnIndex % 3) * 40;
    } else if (isBoss) {
      startX = canvas.width / 2 - width / 2;
      startY = 60;
    }

    enemiesRef.current.push({
      id: Math.random().toString(),
      type,
      x: startX,
      y: startY,
      width,
      height,
      hp,
      maxHp: hp,
      speedX: isBoss ? 1.8 : 0,
      speedY: isBoss ? 0 : speedY,
      shootTimer: Math.random() * shootInterval,
      shootInterval,
      points,
      color,
      animFrame: 0,
      originalX: startX,
      originalY: startY,
      waveOffset: Math.random() * Math.PI * 2
    });
  };

  // RENDER GAME GRAPHICS TO CANVAS
  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Parallax Stars
    starsRef.current.forEach((star) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    // Draw Planet Earth at Bottom Background
    const earthRadius = canvas.width * 0.8;
    const earthY = canvas.height + earthRadius * 0.75;
    const grad = ctx.createRadialGradient(
      canvas.width / 2,
      earthY,
      earthRadius * 0.2,
      canvas.width / 2,
      earthY,
      earthRadius
    );
    grad.addColorStop(0, '#1d4ed8');
    grad.addColorStop(0.5, '#0e7490');
    grad.addColorStop(0.8, '#15803d');
    grad.addColorStop(1, '#030712');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, earthY, earthRadius, 0, Math.PI * 2);
    ctx.fill();

    // Atmosphere Glow Line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw PowerUps
    powerUpsRef.current.forEach((item) => {
      ctx.save();
      ctx.translate(item.x + item.width / 2, item.y + item.height / 2);

      // Pulse glow
      ctx.fillStyle =
        item.type === 'triple'
          ? '#f59e0b'
          : item.type === 'rapid'
          ? '#ec4899'
          : item.type === 'shield'
          ? '#06b6d4'
          : item.type === 'bomb'
          ? '#ef4444'
          : '#22c55e';

      ctx.beginPath();
      ctx.arc(0, 0, item.width / 2 + 2, 0, Math.PI * 2);
      ctx.globalAlpha = 0.3;
      ctx.fill();

      ctx.globalAlpha = 1.0;
      ctx.beginPath();
      ctx.arc(0, 0, item.width / 2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Icon Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label =
        item.type === 'triple'
          ? '3x'
          : item.type === 'rapid'
          ? '⚡'
          : item.type === 'shield'
          ? '🛡️'
          : item.type === 'bomb'
          ? '💣'
          : '❤️';
      ctx.fillText(label, 0, 1);
      ctx.restore();
    });

    // Draw Player Ship
    const player = playerRef.current;
    if (player.hp > 0 && (!player.isInvulnerable || Math.floor(Date.now() / 80) % 2 === 0)) {
      ctx.save();
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2);

      // Thruster Flame Particle
      const flameH = 12 + Math.random() * 8;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(-8, player.height / 2);
      ctx.lineTo(0, player.height / 2 + flameH);
      ctx.lineTo(8, player.height / 2);
      ctx.closePath();
      ctx.fill();

      // Spaceship Body (Futuristic Vector Fighter)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(0, -player.height / 2);
      ctx.lineTo(player.width / 2, player.height / 3);
      ctx.lineTo(player.width / 3, player.height / 2);
      ctx.lineTo(-player.width / 3, player.height / 2);
      ctx.lineTo(-player.width / 2, player.height / 3);
      ctx.closePath();
      ctx.fill();

      // Cockpit Canopy
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.ellipse(0, -6, 6, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wing Cannons
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-player.width / 2, 0, 4, 16);
      ctx.fillRect(player.width / 2 - 4, 0, 4, 16);

      // Active Shield Aura
      if (player.shieldTimer > 0) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, player.width * 0.75, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.fill();
      }

      ctx.restore();
    }

    // Draw Player Bullets
    playerBulletsRef.current.forEach((b) => {
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = graphicsQuality === 'high' ? 8 : 0;
      ctx.fillRect(b.x, b.y, b.width, b.height);
      ctx.shadowBlur = 0;
    });

    // Draw Enemy Bullets
    enemyBulletsRef.current.forEach((b) => {
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = graphicsQuality === 'high' ? 8 : 0;
      ctx.beginPath();
      ctx.arc(b.x + b.width / 2, b.y + b.height / 2, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Enemies (Chicken Invaders Style Vector Art)
    enemiesRef.current.forEach((enemy) => {
      ctx.save();
      ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);

      const isBoss = enemy.type.startsWith('boss');

      if (isBoss) {
        // Draw Boss Ship
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        if (enemy.type === 'boss1') {
          // Mother Saucer: Spinning Ring & Core
          ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, enemy.width / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'boss2') {
          // Skull Destroyer (غول جمجمه‌ای)
          ctx.moveTo(0, -enemy.height / 2);
          ctx.lineTo(enemy.width / 2, -enemy.height / 4);
          ctx.lineTo(enemy.width / 2 - 10, enemy.height / 2);
          ctx.lineTo(-enemy.width / 2 + 10, enemy.height / 2);
          ctx.lineTo(-enemy.width / 2, -enemy.height / 4);
          ctx.closePath();
          ctx.fill();

          // Glowing Skull Eyes
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(-18, -10, 8, 0, Math.PI * 2);
          ctx.arc(18, -10, 8, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'boss3') {
          // Final Empress (غول نهایی)
          ctx.moveTo(0, -enemy.height / 2);
          ctx.lineTo(enemy.width / 2, 0);
          ctx.lineTo(enemy.width / 3, enemy.height / 2);
          ctx.lineTo(-enemy.width / 3, enemy.height / 2);
          ctx.lineTo(-enemy.width / 2, 0);
          ctx.closePath();
          ctx.fill();

          // Core Energy Orb
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Normal Alien Invaders with wobbling wings
        const wingWobble = Math.sin(enemy.animFrame) * 4;

        ctx.fillStyle = enemy.color;
        ctx.beginPath();

        if (enemy.type === 'saucer') {
          ctx.ellipse(0, 0, enemy.width / 2, enemy.height / 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, -4, enemy.width / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'kamikaze') {
          ctx.moveTo(0, enemy.height / 2);
          ctx.lineTo(enemy.width / 2, -enemy.height / 2);
          ctx.lineTo(0, -enemy.height / 3);
          ctx.lineTo(-enemy.width / 2, -enemy.height / 2);
          ctx.closePath();
          ctx.fill();
        } else {
          // Invader / Scout / Cruiser
          ctx.fillRect(-enemy.width / 3, -enemy.height / 3, (enemy.width * 2) / 3, (enemy.height * 2) / 3);
          // Wings
          ctx.fillRect(-enemy.width / 2, -enemy.height / 4 + wingWobble, 6, 12);
          ctx.fillRect(enemy.width / 2 - 6, -enemy.height / 4 - wingWobble, 6, 12);
          // Eyes
          ctx.fillStyle = '#030712';
          ctx.fillRect(-8, -4, 4, 4);
          ctx.fillRect(4, -4, 4, 4);
        }
      }

      ctx.restore();
    });

    // Draw Particles
    particlesRef.current.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });
  };

  // Pointer / Touch Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pointerPosRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
      isDown: true
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !pointerPosRef.current.isDown) return;
    const rect = canvas.getBoundingClientRect();
    pointerPosRef.current.x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    pointerPosRef.current.y = ((e.clientY - rect.top) / rect.height) * canvas.height;
  };

  const handlePointerUp = () => {
    pointerPosRef.current.isDown = false;
  };

  const activeBoss = activeBossRef.current;
  const playerHp = playerRef.current.hp;
  const maxHp = playerRef.current.maxHp;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none bg-slate-950 overflow-hidden">
      {/* HUD OVERLAY */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-gradient-to-b from-slate-950/90 via-slate-900/60 to-transparent backdrop-blur-xs flex items-center justify-between pointer-events-none">
        {/* Left Stats: HP & Bombs */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Hearts */}
          <div className="flex items-center gap-1 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700/50">
            {Array.from({ length: maxHp }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${i < playerHp ? 'text-red-500 fill-red-500 animate-pulse' : 'text-slate-600'}`}
              />
            ))}
          </div>

          {/* Mega Bomb Button */}
          <button
            onClick={triggerMegaBomb}
            disabled={playerRef.current.bombs <= 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
              playerRef.current.bombs > 0
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-400 hover:bg-amber-500/30 box-glow-gold'
                : 'bg-slate-800/40 border-slate-700/40 text-slate-500 cursor-not-allowed'
            }`}
          >
            <BombIcon className="w-4 h-4 text-amber-400" />
            <span className="font-orbitron font-bold text-sm">{playerRef.current.bombs}</span>
          </button>
        </div>

        {/* Center: Score & Level */}
        <div className="text-center font-orbitron">
          <div className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">
            {getTranslation(language, 'level')} {currentLevelConfig.level} / 20
          </div>
          <div className="text-xl font-black text-white tracking-widest text-glow-cyan">{score}</div>
        </div>

        {/* Right Controls: Pause & Mute */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => onToggleMute('sfx')}
            className="p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {sfxMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Pause className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* BOSS HEALTH METER */}
      {activeBoss && activeBoss.hp > 0 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-md bg-slate-900/90 border border-red-500/50 rounded-lg p-2 shadow-2xl backdrop-blur-sm animate-fade-in">
          <div className="flex items-center justify-between text-xs font-orbitron text-red-400 font-bold mb-1">
            <span className="flex items-center gap-1">
              <Skull className="w-3.5 h-3.5" />
              {getTranslation(language, 'bossHealth')}
            </span>
            <span>{Math.max(0, Math.ceil((activeBoss.hp / activeBoss.maxHp) * 100))}%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-red-900">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500 transition-all duration-200"
              style={{ width: `${Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* LEVEL INTRO BANNER */}
      {levelIntroBanner && (
        <div className="absolute z-20 pointer-events-none flex flex-col items-center justify-center animate-bounce">
          <div className="bg-cyan-950/80 border-2 border-cyan-500/80 px-8 py-4 rounded-xl text-center shadow-2xl backdrop-blur-md">
            <div className="font-orbitron text-2xl font-black text-cyan-300 tracking-wider text-glow-cyan">
              {levelIntroBanner}
            </div>
            <div className="text-xs text-slate-300 mt-1">{getTranslation(language, 'enemyFleetApproaching')}</div>
          </div>
        </div>
      )}

      {/* BOSS WARNING BANNER */}
      {bossWarningBanner && (
        <div className="absolute z-20 pointer-events-none flex flex-col items-center justify-center animate-pulse">
          <div className="bg-red-950/90 border-2 border-red-500/80 px-8 py-5 rounded-2xl text-center shadow-2xl backdrop-blur-md">
            <div className="text-red-400 font-orbitron text-sm font-bold tracking-widest uppercase mb-1">
              {getTranslation(language, 'warning')}
            </div>
            <div className="font-orbitron text-2xl font-black text-white text-glow-red">{bossWarningBanner}</div>
          </div>
        </div>
      )}

      {/* CANVAS RENDERING AREA */}
      <canvas
        ref={canvasRef}
        width={480}
        height={720}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full max-w-[520px] max-h-[820px] object-contain cursor-crosshair touch-none border-x border-slate-800/40 shadow-2xl"
      />

      {/* PAUSE MODAL */}
      {isPaused && (
        <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-2xl font-orbitron font-black text-cyan-400 mb-6 text-glow-cyan">
              {getTranslation(language, 'paused')}
            </h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                {getTranslation(language, 'resume')}
              </button>
              <button
                onClick={() => {
                  setIsPaused(false);
                  setCurrentLevelIndex(0);
                  setScore(0);
                  playerRef.current.hp = playerRef.current.maxHp;
                }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                {getTranslation(language, 'restart')}
              </button>
              <button
                onClick={onReturnToMenu}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Home className="w-5 h-5" />
                {getTranslation(language, 'mainMenu')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER MODAL */}
      {isGameOver && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-slate-900 border-2 border-red-500/60 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/40">
              <Skull className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-orbitron font-black text-red-500 mb-2 text-glow-red">
              {getTranslation(language, 'gameOver')}
            </h2>
            <p className="text-sm text-slate-300 mb-6">{getTranslation(language, 'earthDestroyed')}</p>

            <div className="bg-slate-950/80 rounded-xl p-4 mb-6 border border-slate-800 space-y-2 text-left">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{getTranslation(language, 'finalScore')}</span>
                <span className="font-orbitron font-bold text-white text-sm">{score}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{getTranslation(language, 'highScore')}</span>
                <span className="font-orbitron font-bold text-amber-400 text-sm">{highScore}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{getTranslation(language, 'levelsCleared')}</span>
                <span className="font-orbitron font-bold text-cyan-400 text-sm">{currentLevelIndex} / 20</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsGameOver(false);
                  setCurrentLevelIndex(0);
                  setScore(0);
                  playerRef.current.hp = playerRef.current.maxHp;
                  soundManager.startBGM(false);
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                {getTranslation(language, 'playAgain')}
              </button>
              <button
                onClick={onReturnToMenu}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Home className="w-5 h-5" />
                {getTranslation(language, 'mainMenu')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VICTORY MODAL */}
      {isVictory && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 w-full max-w-sm shadow-2xl box-glow-gold">
            <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/40 animate-bounce">
              <Award className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-orbitron font-black text-amber-400 mb-2 text-glow-gold">
              {getTranslation(language, 'victory')}
            </h2>
            <p className="text-sm text-cyan-300 font-semibold mb-6">{getTranslation(language, 'victoryMessage')}</p>

            <div className="bg-slate-950/80 rounded-xl p-4 mb-6 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{getTranslation(language, 'finalScore')}</span>
                <span className="font-orbitron font-bold text-amber-300 text-base">{score}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{getTranslation(language, 'developedBy')}</span>
                <span className="font-bold text-cyan-400 text-xs">Arash Nj</span>
              </div>
            </div>

            <button
              onClick={onReturnToMenu}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
            >
              <Home className="w-5 h-5" />
              {getTranslation(language, 'mainMenu')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
