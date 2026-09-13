export type Language = 'en' | 'fa';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GraphicsQuality = 'low' | 'medium' | 'high';
export type GameScreen = 'menu' | 'playing' | 'settings' | 'about' | 'unityCode';

export type WeaponType = 'single' | 'triple' | 'rapid';
export type PowerUpType = 'triple' | 'rapid' | 'shield' | 'bomb' | 'life';

export interface Settings {
  language: Language;
  difficulty: Difficulty;
  graphicsQuality: GraphicsQuality;
  bgmVolume: number;
  sfxVolume: number;
  bgmMuted: boolean;
  sfxMuted: boolean;
  useAndroidFrame: boolean;
}

export interface HighScoreData {
  highScore: number;
  highestLevel: number;
  totalKills: number;
  bossesDefeated: number;
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player extends GameObject {
  hp: number;
  maxHp: number;
  weapon: WeaponType;
  weaponTimer: number; // in seconds
  shieldTimer: number; // in seconds
  bombs: number;
  isInvulnerable: boolean;
  invulnerableTimer: number;
}

export type EnemyType = 'invader' | 'saucer' | 'scout' | 'cruiser' | 'kamikaze' | 'golden' | 'boss1' | 'boss2' | 'boss3';

export interface Enemy extends GameObject {
  id: string;
  type: EnemyType;
  hp: number;
  maxHp: number;
  speedX: number;
  speedY: number;
  shootTimer: number;
  shootInterval: number;
  points: number;
  color: string;
  animFrame: number;
  originalX: number;
  originalY: number;
  waveOffset: number;
  bossPhase?: number;
}

export interface Bullet extends GameObject {
  id: string;
  isPlayer: boolean;
  speedX: number;
  speedY: number;
  damage: number;
  color: string;
  radius: number;
}

export interface PowerUpItem extends GameObject {
  id: string;
  type: PowerUpType;
  speedY: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

export interface LevelConfig {
  level: number;
  nameEn: string;
  nameFa: string;
  isBossLevel: boolean;
  bossType?: EnemyType;
  bgType: 'deep_space' | 'nebula_purple' | 'nebula_blue' | 'orbit_earth' | 'alien_core';
  waves: WaveConfig[];
}

export interface WaveConfig {
  enemyType: EnemyType;
  count: number;
  formation: 'grid' | 'v_shape' | 'circle' | 'rain' | 'side_swipe' | 'boss';
  spawnInterval: number;
}
