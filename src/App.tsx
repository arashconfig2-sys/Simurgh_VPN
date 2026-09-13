import { useState, useEffect } from 'react';
import { GameScreen, Settings, Difficulty } from './types/game';
import { MainMenu } from './components/MainMenu';
import { GameCanvas } from './game/GameCanvas';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { UnityCodeModal } from './components/UnityCodeModal';
import { soundManager } from './utils/audio';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  const [settings, setSettings] = useState<Settings>(() => {
    const savedLang = PlayerPrefs_getString('Language', 'en');
    const savedDiff = (PlayerPrefs_getString('Difficulty', 'medium') as Difficulty) || 'medium';
    return {
      language: savedLang === 'Persian' || savedLang === 'fa' ? 'fa' : 'en',
      difficulty: savedDiff,
      graphicsQuality: 'high',
      bgmVolume: 0.5,
      sfxVolume: 0.7,
      bgmMuted: false,
      sfxMuted: false,
      useAndroidFrame: true
    };
  });

  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('savetheearth_highscore') || '0', 10);
  });

  // Sync settings with SoundManager
  useEffect(() => {
    soundManager.setVolumes(settings.bgmVolume, settings.sfxVolume, settings.bgmMuted, settings.sfxMuted);
  }, [settings.bgmVolume, settings.sfxVolume, settings.bgmMuted, settings.sfxMuted]);

  // Handle setting updates
  const updateSettings = (updated: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updated };
      if (updated.language) {
        localStorage.setItem('savetheearth_lang', updated.language);
      }
      return next;
    });
  };

  // Toggle Language
  const toggleLanguage = () => {
    updateSettings({ language: settings.language === 'en' ? 'fa' : 'en' });
  };

  // Start game with selected difficulty
  const handleSelectDifficulty = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    updateSettings({ difficulty: diff });
    setCurrentScreen('playing');
  };

  const handleToggleMute = (type: 'bgm' | 'sfx') => {
    if (type === 'bgm') {
      updateSettings({ bgmMuted: !settings.bgmMuted });
    } else {
      updateSettings({ sfxMuted: !settings.sfxMuted });
    }
  };

  const handleResetStats = () => {
    localStorage.removeItem('savetheearth_highscore');
    setHighScore(0);
  };

  const handleVictory = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('savetheearth_highscore', score.toString());
    }
  };

  return (
    <div
      dir={settings.language === 'fa' ? 'rtl' : 'ltr'}
      className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-vazir"
    >
      {/* Top Mobile Mode Toggle Floating Pill (Desktop view) */}
      <div className="fixed top-3 right-3 z-40 hidden sm:flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-full shadow-lg backdrop-blur-md">
        <button
          onClick={() => updateSettings({ useAndroidFrame: !settings.useAndroidFrame })}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            settings.useAndroidFrame ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Phone</span>
        </button>
        <button
          onClick={() => updateSettings({ useAndroidFrame: !settings.useAndroidFrame })}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            !settings.useAndroidFrame ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full</span>
        </button>
      </div>

      {/* Android Device Mockup Frame OR Fullscreen Container */}
      <div
        className={`relative transition-all duration-300 flex flex-col items-center justify-center overflow-hidden ${
          settings.useAndroidFrame
            ? 'w-[390px] h-[810px] max-w-[95vw] max-h-[95vh] rounded-[48px] border-[12px] border-slate-900 shadow-[0_0_50px_rgba(6,182,212,0.25)] ring-1 ring-slate-800 bg-slate-950'
            : 'w-full h-full'
        }`}
      >
        {/* Smartphone Camera Notch (Only in Frame Mode) */}
        {settings.useAndroidFrame && (
          <div className="absolute top-2 z-50 w-28 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-2 border border-slate-800 pointer-events-none">
            <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800" />
            <div className="w-1.5 h-1.5 bg-cyan-900/60 rounded-full" />
          </div>
        )}

        {/* SCREEN CONTENT */}
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          {currentScreen === 'playing' ? (
            <GameCanvas
              difficulty={selectedDifficulty}
              graphicsQuality={settings.graphicsQuality}
              language={settings.language}
              onReturnToMenu={() => {
                soundManager.stopBGM();
                setCurrentScreen('menu');
              }}
              onGameVictory={handleVictory}
              bgmMuted={settings.bgmMuted}
              sfxMuted={settings.sfxMuted}
              onToggleMute={handleToggleMute}
            />
          ) : (
            <MainMenu
              language={settings.language}
              onSelectDifficulty={handleSelectDifficulty}
              onOpenSettings={() => setCurrentScreen('settings')}
              onOpenAbout={() => setCurrentScreen('about')}
              onOpenUnityCode={() => setCurrentScreen('unityCode')}
              onToggleLanguage={toggleLanguage}
              highScore={highScore}
            />
          )}

          {/* OVERLAY MODALS */}
          {currentScreen === 'settings' && (
            <SettingsModal
              settings={settings}
              onUpdateSettings={updateSettings}
              onClose={() => setCurrentScreen('menu')}
              onResetStats={handleResetStats}
            />
          )}

          {currentScreen === 'about' && (
            <AboutModal
              language={settings.language}
              onClose={() => setCurrentScreen('menu')}
              onOpenUnityCode={() => setCurrentScreen('unityCode')}
            />
          )}

          {currentScreen === 'unityCode' && (
            <UnityCodeModal language={settings.language} onClose={() => setCurrentScreen('menu')} />
          )}
        </div>

        {/* Smartphone Bottom Home Bar (Only in Frame Mode) */}
        {settings.useAndroidFrame && (
          <div className="absolute bottom-2 z-50 w-32 h-1 bg-slate-700/60 rounded-full pointer-events-none" />
        )}
      </div>
    </div>
  );
}

// Helper to mimic PlayerPrefs
function PlayerPrefs_getString(key: string, defaultValue: string): string {
  return localStorage.getItem(`savetheearth_prefs_${key}`) || defaultValue;
}
