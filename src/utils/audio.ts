// Web Audio API Synthesizer for "Save the Earth" Arcade Sound Effects and BGM

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmTimer: number | null = null;
  private bgmVolume: number = 0.5;
  private sfxVolume: number = 0.7;
  private bgmMuted: boolean = false;
  private sfxMuted: boolean = false;
  private isPlayingBgm: boolean = false;
  private currentBgmTempo: number = 130; // bpm

  constructor() {
    // Lazy init on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.bgmGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.bgmGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);

      this.updateVolumes();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(bgmVol: number, sfxVol: number, bgmMute: boolean, sfxMute: boolean) {
    this.bgmVolume = bgmVol;
    this.sfxVolume = sfxVol;
    this.bgmMuted = bgmMute;
    this.sfxMuted = sfxMute;
    this.updateVolumes();
  }

  private updateVolumes() {
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmMuted ? 0 : this.bgmVolume * 0.35, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
  }

  // --- Sound Effects ---

  public playLaser(type: 'single' | 'triple' | 'rapid' = 'single') {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    if (type === 'single') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'triple') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'rapid') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1500, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  public playAlienLaser() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playExplosion(isBoss: boolean = false) {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxMuted) return;

    const now = this.ctx.currentTime;
    const dur = isBoss ? 0.8 : 0.25;

    // Noise buffer
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isBoss ? 400 : 800, now);
    filter.frequency.exponentialRampToValueAtTime(30, now + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isBoss ? 0.6 : 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + dur);
  }

  public playPowerUp() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxMuted) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.15);
    });
  }

  public playBombBlast() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxMuted) return;

    const now = this.ctx.currentTime;
    const dur = 1.2;

    // Sub bass sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + dur);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + dur);

    this.playExplosion(true);
  }

  public playPlayerHit() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playClick() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playVictoryFanfare() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxMuted) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 659.25, 880];
    const times = [0, 0.15, 0.3, 0.45, 0.65, 0.85];
    const durs = [0.12, 0.12, 0.12, 0.18, 0.15, 0.6];

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + times[i]);

      gain.gain.setValueAtTime(0.3, now + times[i]);
      gain.gain.exponentialRampToValueAtTime(0.01, now + times[i] + durs[i]);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + times[i]);
      osc.stop(now + times[i] + durs[i]);
    });
  }

  public playGameOver() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxMuted) return;

    const now = this.ctx.currentTime;
    const notes = [300, 280, 260, 200];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.25);

      gain.gain.setValueAtTime(0.3, now + i * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.25 + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + i * 0.25);
      osc.stop(now + i * 0.25 + 0.22);
    });
  }

  // --- Background Music Synth ---

  public startBGM(isBoss: boolean = false) {
    this.initCtx();
    if (this.isPlayingBgm) return;
    this.isPlayingBgm = true;
    this.currentBgmTempo = isBoss ? 150 : 125;

    let step = 0;
    const bassNotes = isBoss ? [110, 110, 123.47, 130.81] : [110, 130.81, 146.83, 164.81];

    const playStep = () => {
      if (!this.isPlayingBgm || !this.ctx || !this.bgmGain) return;

      const now = this.ctx.currentTime;
      // Synth Bass
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const freq = bassNotes[step % bassNotes.length];
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + 0.2);

      // Arpeggio lead
      if (step % 2 === 0) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(freq * 4, now);

        leadGain.gain.setValueAtTime(0.04, now);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        leadOsc.connect(leadGain);
        leadGain.connect(this.bgmGain);

        leadOsc.start(now);
        leadOsc.stop(now + 0.12);
      }

      step++;
      const intervalMs = (60 / this.currentBgmTempo / 2) * 1000;
      this.bgmTimer = window.setTimeout(playStep, intervalMs);
    };

    playStep();
  }

  public stopBGM() {
    this.isPlayingBgm = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const soundManager = new SoundManager();
