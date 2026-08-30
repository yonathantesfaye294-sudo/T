// Web Audio API Synthesizer for rich arcade sound effects

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Lazy init AudioContext on first user gesture
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('logorush_sound_enabled');
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('logorush_sound_enabled', String(this.soundEnabled));
    }
    if (this.soundEnabled) {
      this.playCorrect(1);
    }
    return this.soundEnabled;
  }

  // Plays a snappy, rewarding chime with pitch scaling for combos
  public playCorrect(combo: number = 1) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const baseFreq = 523.25; // C5
    const multiplier = 1 + Math.min(combo * 0.08, 0.8);
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(baseFreq * multiplier, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5 * multiplier, now + 0.12);

    osc2.frequency.setValueAtTime(baseFreq * 2 * multiplier, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.5 * multiplier, now + 0.2);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.05);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  // Stage 1 Maximum Point Jackpot chime
  public playJackpot() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.18, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  // Wrong guess thud/buzz
  public playWrong() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.25);

    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Whoosh sound when uncovering next reveal stage
  public playReveal() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Ticking sound for countdown
  public playTick() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gainNode.gain.setValueAtTime(0.06, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Fanfare for completing a game or streak milestone
  public playVictory() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.1 },
      { f: 783.99, t: 0.2 },
      { f: 1046.5, t: 0.3 },
      { f: 1318.51, t: 0.45 },
    ];

    chords.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.2, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + 0.5);
    });
  }

  // Powerup activation sound
  public playPowerup() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(900, now + 0.2);

    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }
}

export const sound = new SoundManager();
