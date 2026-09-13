import { Language } from '../types/game';

export const translations = {
  en: {
    // Header & Menu
    gameTitle: 'Save the Earth',
    gameSubTitle: 'Space Shooter Arcade',
    developedBy: 'Developed by: Arash Nj',
    studioName: 'Arash Nj Studio',
    version: 'Version 1.0.0',
    startGame: 'Start Game',
    settings: 'Settings',
    aboutUs: 'About Us',
    unityCode: 'Unity C# Code',
    exitGame: 'Exit Game',
    
    // Difficulty
    selectDifficulty: 'Select Difficulty',
    easy: 'Easy',
    easyDesc: 'Slower enemies, extra player health & higher powerup drops.',
    medium: 'Medium',
    mediumDesc: 'Standard balanced arcade challenge.',
    hard: 'Hard',
    hardDesc: 'Fast aggressive aliens, higher enemy damage & tough boss battles.',
    cancel: 'Cancel',

    // Settings
    settingsTitle: 'Game Settings',
    graphicsQuality: 'Graphics Quality',
    low: 'Low (30 FPS Cap / Minimal Effects)',
    med: 'Medium (Standard 60 FPS)',
    high: 'High (60 FPS + Particles, Glow & Screen Shake)',
    language: 'Language / زبان',
    english: 'English',
    persian: 'فارسی (Persian)',
    audio: 'Audio Controls',
    bgmVolume: 'Background Music (BGM)',
    sfxVolume: 'Sound Effects (SFX)',
    muteBgm: 'Mute BGM',
    muteSfx: 'Mute SFX',
    androidFrame: 'Android Phone Mockup Frame',
    androidFrameDesc: 'Play inside simulated Android smartphone screen',
    testSound: 'Test Sound',
    saveSettings: 'Close Settings',
    resetStats: 'Reset High Scores',
    statsResetConfirm: 'High scores reset successfully!',

    // About Us
    aboutTitle: 'About Save the Earth',
    aboutContent: 'Save the Earth is a full-featured arcade space shooter inspired by classic Chicken Invaders. Battle through 20 intense waves of alien invaders, upgrade your weapons, release screen-clearing bombs, and defeat terrifying bosses to rescue planet Earth!',
    devThanks: 'Special thanks for playing! Destroy aliens and save our planet!',
    poweredBy: 'Powered by Arash Nj Studio.',
    viewUnityScripts: 'View & Export Unity C# Scripts',
    close: 'Close',

    // Game HUD & Gameplay
    level: 'Level',
    score: 'Score',
    highScore: 'High Score',
    lives: 'Lives',
    weapon: 'Weapon',
    bomb: 'BOMB',
    shield: 'SHIELD ACTIVE',
    rapid: 'PLASMA BEAM',
    triple: 'TRIPLE SHOT',
    normal: 'STANDARD LASER',
    bossHealth: 'BOSS HEALTH',
    wave: 'Wave',
    pause: 'Pause',
    paused: 'GAME PAUSED',
    resume: 'Resume',
    restart: 'Restart',
    mainMenu: 'Main Menu',
    
    // Level Intro & Boss Warnings
    levelStart: 'LEVEL',
    enemyFleetApproaching: 'Alien Invaders Detected!',
    warning: '⚠️ WARNING ⚠️',
    bossApproaching: 'BOSS ENCOUNTER DETECTED!',
    boss1Name: 'Mother Saucer Warlord',
    boss2Name: 'Skull Destroyer Ship',
    boss3Name: 'Alien Empress Earth Threat',

    // Game Over & Victory
    gameOver: 'GAME OVER',
    earthDestroyed: 'The aliens conquered Earth! Try again hero!',
    victory: 'VICTORY! EARTH IS SAVED!',
    victoryMessage: 'Congratulations! Earth is Saved by Arash Nj\'s Hero!',
    finalScore: 'Final Score',
    levelsCleared: 'Levels Cleared',
    kills: 'Aliens Destroyed',
    playAgain: 'Play Again',
    nextLevel: 'Next Level',
    congratulations: 'Congratulations!',

    // Controls Help
    controlsHelp: 'Controls: Touch/Mouse drag to move & shoot automatically. Press [SPACE] or tap BOMB button to trigger Mega Bomb!',
    
    // Unity Code Exporter Modal
    unityModalTitle: 'Unity C# Scripts & Android Build Guide',
    unityModalDesc: 'Use these exact C# scripts created by Arash Nj to build this game natively in Unity for Android!',
    copyCode: 'Copy Code',
    codeCopied: 'Copied to Clipboard!',
    buildSettingsGuide: 'Android Build Instructions:',
    step1: '1. Switch platform to Android (File > Build Settings > Android).',
    step2: '2. Set Company Name: "Arash Nj" and Product Name: "Save the Earth".',
    step3: '3. Set Package Name: "com.arashnj.savetheearth".',
    step4: '4. Assign ship icon and click "Build APK".',
  },
  fa: {
    // Header & Menu
    gameTitle: 'نجات زمین',
    gameSubTitle: 'بازی سفینه‌ای / تیراندازی فضایی',
    developedBy: 'توسعه‌دهنده: آرش ان‌جی (Arash Nj)',
    studioName: 'استودیو آرش ان‌جی (Arash Nj Studio)',
    version: 'نسخه ۱.۰.۰',
    startGame: 'شروع بازی',
    settings: 'تنظیمات',
    aboutUs: 'درباره ما',
    unityCode: 'کدهای Unity C#',
    exitGame: 'خروج از بازی',
    
    // Difficulty
    selectDifficulty: 'انتخاب درجه سختی',
    easy: 'آسان (Easy)',
    easyDesc: 'سرعت دشمنان کمتر، جان سفینه بیشتر و افتادن پاورآپ‌های بیشتر.',
    medium: 'متوسط (Medium)',
    mediumDesc: 'حالت استاندارد و متعادل بازی آرکید.',
    hard: 'سخت (Hard)',
    hardDesc: 'سرعت بالای دشمنان، تیراندازی شدیدتر و غول‌های جان‌سخت.',
    cancel: 'انصراف',

    // Settings
    settingsTitle: 'تنظیمات بازی',
    graphicsQuality: 'کیفیت گرافیک',
    low: 'پایین (محدود به ۳۰ فریم / جلوه‌های حداقل)',
    med: 'متوسط (۶۰ فریم استاندارد)',
    high: 'بالا (۶۰ فریم + پارتیکل‌ها، درخشش و لرزش صفحه)',
    language: 'زبان / Language',
    english: 'English (انگلیسی)',
    persian: 'فارسی (Persian)',
    audio: 'تنظیمات صدا',
    bgmVolume: 'صدای موزیک متن (BGM)',
    sfxVolume: 'صدای افکت‌های صوتی (SFX)',
    muteBgm: 'قطع موزیک',
    muteSfx: 'قطع افکت‌ها',
    androidFrame: 'قاب شبیه‌ساز گوشی اندروید',
    androidFrameDesc: 'اجرای بازی درون قاب گوشی هوشمند',
    testSound: 'تست صدا',
    saveSettings: 'بستن تنظیمات',
    resetStats: 'بازنشانی حدنصاب‌ها',
    statsResetConfirm: 'رکوردها با موفقیت پاک شدند!',

    // About Us
    aboutTitle: 'درباره بازی نجات زمین (Save the Earth)',
    aboutContent: 'بازی «نجات زمین» یک بازی کامل سفینه‌ای و تیراندازی فضایی در سبک محبوب چیکن اینوایدرز (Chicken Invaders) است. در این بازی شما باید در ۲۰ مرحله جذاب و پر از هیجان با موج‌های مختلف آدم فضایی‌ها مبارزه کنید، سلاح‌های خود را ارتقا دهید، بمب‌های همه‌جانبه بزنید و غول‌های غول‌پیکر را شکست دهید تا سیاره زمین را نجات دهید!',
    devThanks: 'با تشکر ویژه از شما برای انجام این بازی! آدم فضایی‌ها را نابود کنید و سیاره ما را نجات دهید!',
    poweredBy: 'قدرت گرفته از Arash Nj Studio.',
    viewUnityScripts: 'مشاهده و دریافت کدهای Unity C#',
    close: 'بستن',

    // Game HUD & Gameplay
    level: 'مرحله',
    score: 'امتیاز',
    highScore: 'رکورد',
    lives: 'جان‌ها',
    weapon: 'سلاح',
    bomb: 'بمب',
    shield: 'سپر فعال',
    rapid: 'لیزر پلاسما',
    triple: 'تیر سه‌تایی',
    normal: 'لیزر استاندارد',
    bossHealth: 'جان غول',
    wave: 'موج',
    pause: 'توقف',
    paused: 'بازی متوقف شد',
    resume: 'ادامه بازی',
    restart: 'شروع مجدد',
    mainMenu: 'منوی اصلی',
    
    // Level Intro & Boss Warnings
    levelStart: 'مرحله',
    enemyFleetApproaching: 'موج متجاوزان فضایی شناسایی شد!',
    warning: '⚠️ هشدار ⚠️',
    bossApproaching: 'غول فضایی نزدیک می‌شود!',
    boss1Name: 'مادر سفینه‌ها (Mother Saucer)',
    boss2Name: 'غول جمجمه‌ای (Skull Destroyer)',
    boss3Name: 'ملکه فضایی‌ها - تهدید نهایی زمین',

    // Game Over & Victory
    gameOver: 'پایان بازی',
    earthDestroyed: 'آدم فضایی‌ها زمین را تصرف کردند! دوباره تلاش کن قهرمان!',
    victory: 'پیروزی! زمین نجات یافت!',
    victoryMessage: 'تبریک! سیاره زمین توسط قهرمان Arash Nj نجات یافت!',
    finalScore: 'امتیاز نهایی',
    levelsCleared: 'مراحل طی شده',
    kills: 'فضایی‌های نابودشده',
    playAgain: 'بازی مجدد',
    nextLevel: 'مرحله بعدی',
    congratulations: 'تبریک!',

    // Controls Help
    controlsHelp: 'راهنما: لمس/موس را روی صفحه بکشید تا سفینه حرکت و شلیک کند. دکمه اسپیس یا دکمه BOMB را برای بمب بکار ببرید!',
    
    // Unity Code Exporter Modal
    unityModalTitle: 'کدهای Unity C# و راهنمای ساخت اندروید',
    unityModalDesc: 'می‌توانید کدهای زیر که توسط Arash Nj توسعه یافته را مستقیم در Unity وارد کرده و خروجی APK بگیرید!',
    copyCode: 'کپی کد',
    codeCopied: 'کد در حافظه کپی شد!',
    buildSettingsGuide: 'راهنمای خروجی گرفتن در Unity:',
    step1: '۱. پروژه را روی Android بگذارید (File > Build Settings > Android).',
    step2: '۲. نام کمپانی: "Arash Nj" و نام محصول: "Save the Earth" را قرار دهید.',
    step3: '۳. نام پکیج: "com.arashnj.savetheearth" باشد.',
    step4: '۴. آیکون سفینه را ست کرده و دکمه Build APK را بزنید.',
  }
};

export function getTranslation(lang: Language, key: keyof typeof translations['en']): string {
  return translations[lang]?.[key] || translations['en'][key] || key;
}
