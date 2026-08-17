// AyurSutra Web Audio API Ambient Soundscape & Singing Bowl Chimes

class AyurSoundscape {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.oscillators = [];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.initContext();
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  start() {
    this.initContext();
    this.stop();

    // 432 Hz Root (Vedic Healing Frequency) + Harmonic Drone (Tanpura feeling)
    const baseFreq = 108.0; // Harmonic sub-octave of 432Hz
    const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2.0, baseFreq * 3.0, 432.0];

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      // Gentle LFO subtle detune
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.1 + idx * 0.05;
      lfoGain.gain.value = 1.2;
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.015 / (idx + 1), this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      this.oscillators.push({ osc, lfo });
    });

    this.isPlaying = true;
    this.playSingingBowlChime(432, 2.5);
  }

  stop() {
    this.oscillators.forEach(({ osc, lfo }) => {
      try {
        osc.stop();
        lfo.stop();
      } catch (e) {}
    });
    this.oscillators = [];
    this.isPlaying = false;
  }

  // Play Tibetan / Ayurvedic Singing Bowl Chime
  playSingingBowlChime(freq = 528, duration = 3.5) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      // Bell-like subtle frequency slide
      osc.frequency.exponentialRampToValueAtTime(freq * 0.998, now + duration);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }
}

window.AyurSoundscape = new AyurSoundscape();
