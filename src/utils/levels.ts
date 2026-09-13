import { LevelConfig } from '../types/game';

export const LEVELS: LevelConfig[] = [
  // --- ACT 1: INVASION BEGINS (Levels 1 - 5) ---
  {
    level: 1,
    nameEn: 'First Contact',
    nameFa: 'نخستین برخورد',
    isBossLevel: false,
    bgType: 'deep_space',
    waves: [
      { enemyType: 'invader', count: 8, formation: 'grid', spawnInterval: 0.5 },
      { enemyType: 'invader', count: 12, formation: 'v_shape', spawnInterval: 0.4 },
    ]
  },
  {
    level: 2,
    nameEn: 'Swooping Swarm',
    nameFa: 'هجوم پروازی',
    isBossLevel: false,
    bgType: 'deep_space',
    waves: [
      { enemyType: 'scout', count: 10, formation: 'side_swipe', spawnInterval: 0.3 },
      { enemyType: 'invader', count: 14, formation: 'grid', spawnInterval: 0.4 },
    ]
  },
  {
    level: 3,
    nameEn: 'Saucer Recon',
    nameFa: 'شناسایی بشقاب‌پرنده‌ها',
    isBossLevel: false,
    bgType: 'nebula_purple',
    waves: [
      { enemyType: 'saucer', count: 8, formation: 'circle', spawnInterval: 0.5 },
      { enemyType: 'invader', count: 16, formation: 'v_shape', spawnInterval: 0.3 },
      { enemyType: 'golden', count: 1, formation: 'side_swipe', spawnInterval: 1.0 },
    ]
  },
  {
    level: 4,
    nameEn: 'Atmosphere Breach',
    nameFa: 'رخنه به جو زمین',
    isBossLevel: false,
    bgType: 'nebula_purple',
    waves: [
      { enemyType: 'scout', count: 12, formation: 'rain', spawnInterval: 0.3 },
      { enemyType: 'saucer', count: 10, formation: 'grid', spawnInterval: 0.4 },
      { enemyType: 'cruiser', count: 4, formation: 'v_shape', spawnInterval: 0.6 },
    ]
  },
  {
    level: 5,
    nameEn: 'Boss Battle: Mother Saucer',
    nameFa: 'مرحله ۵: غول مادر سفینه‌ها',
    isBossLevel: true,
    bossType: 'boss1',
    bgType: 'nebula_purple',
    waves: [
      { enemyType: 'boss1', count: 1, formation: 'boss', spawnInterval: 0.1 }
    ]
  },

  // --- ACT 2: AGGRESSIVE ASSAULT (Levels 6 - 10) ---
  {
    level: 6,
    nameEn: 'Alien Counterattack',
    nameFa: 'پاتک فضایی‌ها',
    isBossLevel: false,
    bgType: 'nebula_blue',
    waves: [
      { enemyType: 'kamikaze', count: 10, formation: 'side_swipe', spawnInterval: 0.3 },
      { enemyType: 'invader', count: 16, formation: 'grid', spawnInterval: 0.3 },
    ]
  },
  {
    level: 7,
    nameEn: 'Armored Fleet',
    nameFa: 'ناوگان زره‌پوش',
    isBossLevel: false,
    bgType: 'nebula_blue',
    waves: [
      { enemyType: 'cruiser', count: 8, formation: 'v_shape', spawnInterval: 0.5 },
      { enemyType: 'scout', count: 14, formation: 'circle', spawnInterval: 0.3 },
      { enemyType: 'golden', count: 2, formation: 'side_swipe', spawnInterval: 0.8 },
    ]
  },
  {
    level: 8,
    nameEn: 'Egg & Laser Rain',
    nameFa: 'باران لیزر و تخم فضایی',
    isBossLevel: false,
    bgType: 'nebula_blue',
    waves: [
      { enemyType: 'saucer', count: 12, formation: 'rain', spawnInterval: 0.25 },
      { enemyType: 'kamikaze', count: 12, formation: 'side_swipe', spawnInterval: 0.25 },
    ]
  },
  {
    level: 9,
    nameEn: 'The Dread Armada',
    nameFa: 'آرمادای وحشت',
    isBossLevel: false,
    bgType: 'orbit_earth',
    waves: [
      { enemyType: 'cruiser', count: 10, formation: 'grid', spawnInterval: 0.4 },
      { enemyType: 'saucer', count: 14, formation: 'v_shape', spawnInterval: 0.3 },
      { enemyType: 'kamikaze', count: 8, formation: 'rain', spawnInterval: 0.3 },
    ]
  },
  {
    level: 10,
    nameEn: 'Boss Battle: Skull Destroyer',
    nameFa: 'مرحله ۱۰: غول جمجمه‌ای',
    isBossLevel: true,
    bossType: 'boss2',
    bgType: 'orbit_earth',
    waves: [
      { enemyType: 'boss2', count: 1, formation: 'boss', spawnInterval: 0.1 }
    ]
  },

  // --- ACT 3: TOTAL WAR (Levels 11 - 15) ---
  {
    level: 11,
    nameEn: 'Hyper Space Assault',
    nameFa: 'حمله ابرفضایی',
    isBossLevel: false,
    bgType: 'orbit_earth',
    waves: [
      { enemyType: 'scout', count: 18, formation: 'side_swipe', spawnInterval: 0.2 },
      { enemyType: 'invader', count: 20, formation: 'grid', spawnInterval: 0.25 },
    ]
  },
  {
    level: 12,
    nameEn: 'Kamikaze Swarm',
    nameFa: 'موج انتحاری',
    isBossLevel: false,
    bgType: 'alien_core',
    waves: [
      { enemyType: 'kamikaze', count: 16, formation: 'rain', spawnInterval: 0.2 },
      { enemyType: 'saucer', count: 14, formation: 'circle', spawnInterval: 0.3 },
      { enemyType: 'golden', count: 2, formation: 'v_shape', spawnInterval: 0.5 },
    ]
  },
  {
    level: 13,
    nameEn: 'Heavy Plasma Barrage',
    nameFa: 'رگبار سنگین پلاسما',
    isBossLevel: false,
    bgType: 'alien_core',
    waves: [
      { enemyType: 'cruiser', count: 12, formation: 'grid', spawnInterval: 0.35 },
      { enemyType: 'kamikaze', count: 12, formation: 'side_swipe', spawnInterval: 0.25 },
    ]
  },
  {
    level: 14,
    nameEn: 'Orbital Siege',
    nameFa: 'محاصره مداری',
    isBossLevel: false,
    bgType: 'alien_core',
    waves: [
      { enemyType: 'saucer', count: 16, formation: 'rain', spawnInterval: 0.2 },
      { enemyType: 'cruiser', count: 10, formation: 'v_shape', spawnInterval: 0.3 },
      { enemyType: 'scout', count: 16, formation: 'circle', spawnInterval: 0.2 },
    ]
  },
  {
    level: 15,
    nameEn: 'Alien Core Guard',
    nameFa: 'محافظان هسته فضایی',
    isBossLevel: false,
    bgType: 'alien_core',
    waves: [
      { enemyType: 'kamikaze', count: 20, formation: 'rain', spawnInterval: 0.15 },
      { enemyType: 'cruiser', count: 12, formation: 'grid', spawnInterval: 0.3 },
      { enemyType: 'golden', count: 3, formation: 'side_swipe', spawnInterval: 0.5 },
    ]
  },

  // --- ACT 4: FINAL RECKONING (Levels 16 - 20) ---
  {
    level: 16,
    nameEn: 'Doomsday Fleet',
    nameFa: 'ناوگان روز قیامت',
    isBossLevel: false,
    bgType: 'orbit_earth',
    waves: [
      { enemyType: 'invader', count: 24, formation: 'grid', spawnInterval: 0.2 },
      { enemyType: 'saucer', count: 18, formation: 'v_shape', spawnInterval: 0.2 },
    ]
  },
  {
    level: 17,
    nameEn: 'Extinction Wave',
    nameFa: 'موج انقراض',
    isBossLevel: false,
    bgType: 'orbit_earth',
    waves: [
      { enemyType: 'cruiser', count: 14, formation: 'circle', spawnInterval: 0.3 },
      { enemyType: 'kamikaze', count: 18, formation: 'rain', spawnInterval: 0.18 },
    ]
  },
  {
    level: 18,
    nameEn: 'Earth\'s Last Line',
    nameFa: 'آخرین خط دفاعی زمین',
    isBossLevel: false,
    bgType: 'orbit_earth',
    waves: [
      { enemyType: 'scout', count: 20, formation: 'side_swipe', spawnInterval: 0.15 },
      { enemyType: 'cruiser', count: 12, formation: 'v_shape', spawnInterval: 0.25 },
      { enemyType: 'saucer', count: 16, formation: 'grid', spawnInterval: 0.2 },
    ]
  },
  {
    level: 19,
    nameEn: 'The Final Storm',
    nameFa: 'طوفان نهایی',
    isBossLevel: false,
    bgType: 'orbit_earth',
    waves: [
      { enemyType: 'kamikaze', count: 22, formation: 'rain', spawnInterval: 0.15 },
      { enemyType: 'cruiser', count: 16, formation: 'grid', spawnInterval: 0.2 },
      { enemyType: 'golden', count: 3, formation: 'v_shape', spawnInterval: 0.4 },
    ]
  },
  {
    level: 20,
    nameEn: 'FINAL BOSS: ALIEN EMPRESS',
    nameFa: 'مرحله ۲۰: غول نهایی - ملکه فضایی‌ها',
    isBossLevel: true,
    bossType: 'boss3',
    bgType: 'orbit_earth',
    waves: [
      { enemyType: 'boss3', count: 1, formation: 'boss', spawnInterval: 0.1 }
    ]
  }
];
