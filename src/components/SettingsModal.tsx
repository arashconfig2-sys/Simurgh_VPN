import React, { useState } from 'react';
import { GraphicsQuality, Settings } from '../types/game';
import { getTranslation } from '../utils/translations';
import { soundManager } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Smartphone,
  Check,
  RotateCcw,
  X,
  Sparkles,
  Sliders,
  Globe
} from 'lucide-react';

interface SettingsModalProps {
  settings: Settings;
  onUpdateSettings: (updated: Partial<Settings>) => void;
  onClose: () => void;
  onResetStats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onResetStats
}) => {
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const handleTestSound = () => {
    soundManager.playLaser('single');
  };

  const handleResetClick = () => {
    onResetStats();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 2500);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in select-none">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl box-glow-cyan my-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-orbitron font-bold text-white">
              {getTranslation(settings.language, 'settingsTitle')}
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 1. Language Option */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              {getTranslation(settings.language, 'language')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onUpdateSettings({ language: 'en' });
                }}
                className={`py-2.5 px-3 rounded-xl font-semibold text-sm transition-all border ${
                  settings.language === 'en'
                    ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                English
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onUpdateSettings({ language: 'fa' });
                }}
                className={`py-2.5 px-3 rounded-xl font-semibold text-sm transition-all border ${
                  settings.language === 'fa'
                    ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                فارسی (Persian)
              </button>
            </div>
          </div>

          {/* 2. Graphics Quality */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {getTranslation(settings.language, 'graphicsQuality')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    soundManager.playClick();
                    onUpdateSettings({ graphicsQuality: q });
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                    settings.graphicsQuality === q
                      ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200 box-glow-cyan'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {q === 'low'
                    ? getTranslation(settings.language, 'low').split(' ')[0]
                    : q === 'medium'
                    ? getTranslation(settings.language, 'med').split(' ')[0]
                    : getTranslation(settings.language, 'high').split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Audio Volume Sliders & Toggles */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" />
                {getTranslation(settings.language, 'audio')}
              </span>
              <button
                onClick={handleTestSound}
                className="text-[10px] text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 px-2 py-0.5 rounded-md"
              >
                {getTranslation(settings.language, 'testSound')}
              </button>
            </label>

            <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              {/* BGM Volume */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{getTranslation(settings.language, 'bgmVolume')}</span>
                  <span>{Math.round(settings.bgmVolume * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateSettings({ bgmMuted: !settings.bgmMuted })}
                    className="text-slate-400 hover:text-white"
                  >
                    {settings.bgmMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.bgmVolume}
                    onChange={(e) => onUpdateSettings({ bgmVolume: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              {/* SFX Volume */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{getTranslation(settings.language, 'sfxVolume')}</span>
                  <span>{Math.round(settings.sfxVolume * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateSettings({ sfxMuted: !settings.sfxMuted })}
                    className="text-slate-400 hover:text-white"
                  >
                    {settings.sfxMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.sfxVolume}
                    onChange={(e) => onUpdateSettings({ sfxVolume: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Android Mockup Frame Toggle */}
          <div className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">
                  {getTranslation(settings.language, 'androidFrame')}
                </div>
                <div className="text-[10px] text-slate-400">
                  {getTranslation(settings.language, 'androidFrameDesc')}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onUpdateSettings({ useAndroidFrame: !settings.useAndroidFrame });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                settings.useAndroidFrame ? 'bg-cyan-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.useAndroidFrame ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 5. Reset High Scores */}
          <div className="pt-2">
            <button
              onClick={handleResetClick}
              className="w-full py-2.5 px-4 bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{getTranslation(settings.language, 'resetStats')}</span>
            </button>
            {resetConfirmed && (
              <div className="text-[11px] text-emerald-400 text-center mt-1 flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {getTranslation(settings.language, 'statsResetConfirm')}
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg"
          >
            {getTranslation(settings.language, 'saveSettings')}
          </button>
        </div>
      </div>
    </div>
  );
};
