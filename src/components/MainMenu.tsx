import React, { useState } from 'react';
import { Difficulty, Language } from '../types/game';
import { getTranslation } from '../utils/translations';
import { soundManager } from '../utils/audio';
import {
  Play,
  Settings as SettingsIcon,
  Info,
  Code2,
  Trophy,
  ShieldAlert,
  Flame,
  Globe,
  Sparkles,
  Rocket
} from 'lucide-react';

interface MainMenuProps {
  language: Language;
  onSelectDifficulty: (diff: Difficulty) => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenUnityCode: () => void;
  onToggleLanguage: () => void;
  highScore: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  language,
  onSelectDifficulty,
  onOpenSettings,
  onOpenAbout,
  onOpenUnityCode,
  onToggleLanguage,
  highScore
}) => {
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const handleDifficultyClick = (diff: Difficulty) => {
    soundManager.playClick();
    setShowDifficultyModal(false);
    onSelectDifficulty(diff);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 text-slate-100 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden select-none">
      {/* Dynamic Background Parallax Glow Stars */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl" />

      {/* Top Bar: Developer Tag & Language Toggle */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700/60 backdrop-blur-md">
          <Rocket className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-cyan-200">Arash Nj Studio</span>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onToggleLanguage();
          }}
          className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700/60 hover:border-cyan-500 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all active:scale-95 backdrop-blur-md"
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>{language === 'en' ? 'فارسی' : 'English'}</span>
        </button>
      </div>

      {/* Title & Branding */}
      <div className="flex flex-col items-center text-center z-10 mt-4 my-auto">
        <div className="relative mb-2">
          <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto border border-cyan-500/40 shadow-xl box-glow-cyan animate-pulse">
            <Rocket className="w-9 h-9" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-cyan-400 tracking-wider text-glow-cyan">
          {getTranslation(language, 'gameTitle')}
        </h1>
        <p className="text-xs sm:text-sm font-bold text-cyan-400/90 tracking-widest mt-1 uppercase">
          {getTranslation(language, 'gameSubTitle')}
        </p>

        {/* High Score Badge */}
        {highScore > 0 && (
          <div className="mt-4 flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 px-4 py-1.5 rounded-full shadow-lg box-glow-gold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300 font-semibold">{getTranslation(language, 'highScore')}:</span>
            <span className="text-sm font-orbitron font-extrabold text-amber-300">{highScore}</span>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-xs flex flex-col gap-3 z-10 mb-auto">
        {/* START GAME BUTTON */}
        <button
          onClick={() => {
            soundManager.playClick();
            setShowDifficultyModal(true);
          }}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500 via-sky-500 to-cyan-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-orbitron font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl box-glow-cyan"
        >
          <Play className="w-6 h-6 fill-slate-950" />
          <span>{getTranslation(language, 'startGame')}</span>
        </button>

        {/* SETTINGS BUTTON */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenSettings();
          }}
          className="w-full py-3 px-6 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/80 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-md backdrop-blur-md"
        >
          <SettingsIcon className="w-5 h-5 text-cyan-400" />
          <span>{getTranslation(language, 'settings')}</span>
        </button>

        {/* ABOUT US BUTTON */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenAbout();
          }}
          className="w-full py-3 px-6 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/80 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-md backdrop-blur-md"
        >
          <Info className="w-5 h-5 text-cyan-400" />
          <span>{getTranslation(language, 'aboutUs')}</span>
        </button>

        {/* UNITY C# CODE BUTTON */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenUnityCode();
          }}
          className="w-full py-3 px-6 bg-slate-900/90 hover:bg-slate-800/90 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-md backdrop-blur-md"
        >
          <Code2 className="w-5 h-5 text-amber-400" />
          <span>{getTranslation(language, 'unityCode')}</span>
        </button>
      </div>

      {/* Footer credits */}
      <div className="z-10 text-center text-xs text-slate-500 font-medium">
        {getTranslation(language, 'developedBy')} • {getTranslation(language, 'version')}
      </div>

      {/* DIFFICULTY SELECTION POPUP */}
      {showDifficultyModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 w-full max-w-sm shadow-2xl box-glow-cyan text-center">
            <h3 className="text-xl font-orbitron font-black text-cyan-400 mb-1">
              {getTranslation(language, 'selectDifficulty')}
            </h3>
            <p className="text-xs text-slate-400 mb-5">Choose game challenge level</p>

            <div className="flex flex-col gap-3 mb-5">
              {/* EASY */}
              <button
                onClick={() => handleDifficultyClick('easy')}
                className="p-3.5 bg-emerald-950/50 border border-emerald-500/50 hover:bg-emerald-900/60 rounded-2xl flex flex-col text-left transition-all active:scale-95"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-orbitron font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>🟢 {getTranslation(language, 'easy')}</span>
                </div>
                <span className="text-xs text-slate-300 mt-1">{getTranslation(language, 'easyDesc')}</span>
              </button>

              {/* MEDIUM */}
              <button
                onClick={() => handleDifficultyClick('medium')}
                className="p-3.5 bg-amber-950/50 border border-amber-500/50 hover:bg-amber-900/60 rounded-2xl flex flex-col text-left transition-all active:scale-95"
              >
                <div className="flex items-center gap-2 text-amber-400 font-orbitron font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>🟡 {getTranslation(language, 'medium')}</span>
                </div>
                <span className="text-xs text-slate-300 mt-1">{getTranslation(language, 'mediumDesc')}</span>
              </button>

              {/* HARD */}
              <button
                onClick={() => handleDifficultyClick('hard')}
                className="p-3.5 bg-red-950/50 border border-red-500/50 hover:bg-red-900/60 rounded-2xl flex flex-col text-left transition-all active:scale-95"
              >
                <div className="flex items-center gap-2 text-red-400 font-orbitron font-bold">
                  <Flame className="w-4 h-4" />
                  <span>🔴 {getTranslation(language, 'hard')}</span>
                </div>
                <span className="text-xs text-slate-300 mt-1">{getTranslation(language, 'hardDesc')}</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowDifficultyModal(false);
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors text-sm"
            >
              {getTranslation(language, 'cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
