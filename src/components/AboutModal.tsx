import React from 'react';
import { Language } from '../types/game';
import { getTranslation } from '../utils/translations';
import { soundManager } from '../utils/audio';
import { Info, Code2, Heart, X, Rocket, Award, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  language: Language;
  onClose: () => void;
  onOpenUnityCode: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ language, onClose, onOpenUnityCode }) => {
  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in select-none">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl box-glow-cyan my-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-orbitron font-bold text-white">
              {getTranslation(language, 'aboutTitle')}
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

        {/* Content */}
        <div className="space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Developer Card */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center border border-cyan-500/40 shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-orbitron font-bold text-white flex items-center gap-2">
                <span>Arash Nj</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xs text-cyan-400 font-medium">Arash Nj Studio</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Version 1.0.0 • Android / Web</div>
            </div>
          </div>

          <p className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 text-slate-300">
            {getTranslation(language, 'aboutContent')}
          </p>

          <div className="bg-amber-950/30 p-3.5 rounded-2xl border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{getTranslation(language, 'devThanks')}</span>
          </div>

          {/* Unity C# Code Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
              onOpenUnityCode();
            }}
            className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 border border-amber-500/50 hover:border-amber-400 text-amber-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Code2 className="w-5 h-5 text-amber-400" />
            <span>{getTranslation(language, 'viewUnityScripts')}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <div className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1 mb-3">
            <span>{getTranslation(language, 'poweredBy')}</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all"
          >
            {getTranslation(language, 'close')}
          </button>
        </div>
      </div>
    </div>
  );
};
