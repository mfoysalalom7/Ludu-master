/**
 * Ludo Royale - Audio & Haptics Engine
 * Uses Web Audio API for high-performance procedural sound generation
 */
class AudioManager {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.vibrationEnabled = true;
    this.musicInterval = null;
    this.musicGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  vibrate(ms = 30) {
    if (!this.vibrationEnabled) return;
    try {
      if (window.AndroidNative && typeof window.AndroidNative.vibrate === 'function') {
        window.AndroidNative.vibrate(ms);
      } else if (navigator && navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch (_) {}
  }

  playClick() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
    this.vibrate(15);
  }

  playDiceRoll() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    // Simulate tumbling dice rattle
    const count = 5;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const freq = 180 + Math.random() * 140;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
        this.vibrate(20);
      }, i * 65);
    }
  }

  playTokenStep(stepIndex = 0) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = 420 + Math.min(stepIndex * 6, 240);
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
    this.vibrate(15);
  }

  playTokenCapture() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(250, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
    this.vibrate(80);
  }

  playTokenHome() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
      }, idx * 75);
    });
    this.vibrate(50);
  }

  playRollSix() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
      }, idx * 60);
    });
  }

  playVictory() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const fanfare = [
      { f: 523.25, d: 150 },
      { f: 523.25, d: 150 },
      { f: 523.25, d: 150 },
      { f: 659.25, d: 350 },
      { f: 783.99, d: 350 },
      { f: 1046.50, d: 600 }
    ];
    let offset = 0;
    fanfare.forEach(item => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (item.d / 1000));
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + (item.d / 1000));
      }, offset);
      offset += item.d + 30;
    });
    this.vibrate(100);
  }

  startMusic() {
    if (!this.musicEnabled || this.musicInterval) return;
    this.init();
    if (!this.ctx) return;

    // Gentle ambient lounge progression (Cmaj7 - Am7 - Dm7 - G7)
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // C E G B
      [220.00, 261.63, 329.63, 392.00], // A C E G
      [293.66, 349.23, 440.00, 523.25], // D F A C
      [196.00, 246.94, 293.66, 349.23]  // G B D F
    ];
    let chordIdx = 0;

    const playChord = () => {
      if (!this.musicEnabled || !this.ctx) return;
      const currentChord = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      currentChord.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.0);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 3.1);
      });
    };

    playChord();
    this.musicInterval = setInterval(playChord, 3200);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  toggleSound(enabled) {
    this.soundEnabled = enabled;
  }

  toggleMusic(enabled) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  toggleVibration(enabled) {
    this.vibrationEnabled = enabled;
  }
}

window.audioManager = new AudioManager();
