import React, { useState } from 'react';
import { Language } from '../types/game';
import { getTranslation } from '../utils/translations';
import { unityScripts } from '../utils/unityScripts';
import { soundManager } from '../utils/audio';
import { Code2, Copy, Check, X, Smartphone } from 'lucide-react';

interface UnityCodeModalProps {
  language: Language;
  onClose: () => void;
}

export const UnityCodeModal: React.FC<UnityCodeModalProps> = ({ language, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeScript = unityScripts[activeTab] || unityScripts[0];

  const handleCopyCode = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(activeScript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in select-none">
      <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-5 sm:p-6 w-full max-w-3xl shadow-2xl box-glow-gold my-auto relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-orbitron font-bold text-white">
                {getTranslation(language, 'unityModalTitle')}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Developed by Arash Nj for Unity Engine</p>
            </div>
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

        {/* Script Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-800 shrink-0 scrollbar-none">
          {unityScripts.map((script, index) => (
            <button
              key={script.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(index);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                activeTab === index
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {script.filename}
            </button>
          ))}
        </div>

        {/* Script Description & Copy Action */}
        <div className="flex items-center justify-between py-2 shrink-0">
          <div className="text-xs text-slate-300 font-medium line-clamp-1">{activeScript.description}</div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-all active:scale-95 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? getTranslation(language, 'codeCopied') : getTranslation(language, 'copyCode')}</span>
          </button>
        </div>

        {/* Code Viewer Container */}
        <div className="flex-1 min-h-[220px] max-h-[320px] bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-auto font-mono text-[11px] text-slate-200 leading-relaxed scrollbar-thin select-text">
          <pre>{activeScript.code}</pre>
        </div>

        {/* Android Build Guide Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 shrink-0 bg-slate-950/60 p-3 rounded-2xl border">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-1.5">
            <Smartphone className="w-4 h-4" />
            <span>{getTranslation(language, 'buildSettingsGuide')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-300">
            <div>{getTranslation(language, 'step1')}</div>
            <div>{getTranslation(language, 'step2')}</div>
            <div>{getTranslation(language, 'step3')}</div>
            <div>{getTranslation(language, 'step4')}</div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-4 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors"
          >
            {getTranslation(language, 'close')}
          </button>
        </div>
      </div>
    </div>
  );
};
