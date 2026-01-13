// Simula un chip de sonido antiguo usando Web Audio API
class SoundSynth {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private humOscillator: OscillatorNode | null = null;
  private isMuted: boolean = false;
  private baseVolume: number = 0.35;

  constructor() {
    // Inicializar perezosamente para cumplir con politicas de navegadores
    // (el audio no puede arrancar sin interaccion del usuario)
  }

  private init() {
    if (this.context) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = this.baseVolume; // Volumen global seguro
    this.masterGain.connect(this.context.destination);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.baseVolume,
        this.context?.currentTime || 0,
        0.1
      );
    }
    return this.isMuted;
  }

  public async startHum() {
    if (this.isMuted) return;
    this.init();
    if (!this.context || !this.masterGain) return;
    
    // Resume context if suspended (common browser policy)
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    // Evitar multiples hums
    if (this.humOscillator) return;

    // 60Hz Electrical Hum (Mains hum)
    const hum = this.context.createOscillator();
    const humGain = this.context.createGain();

    hum.type = 'sawtooth'; // Sawtooth suena mas "electrico"
    hum.frequency.value = 60; // 60Hz standard
    
    // Filtro para suavizar el zumbido y que no sea molesto
    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 120;

    humGain.gain.value = 0.03; // Muy bajo, apenas perceptible

    hum.connect(filter);
    filter.connect(humGain);
    humGain.connect(this.masterGain);

    hum.start();
    this.humOscillator = hum;
  }

  public stopHum() {
    if (this.humOscillator) {
      try {
        this.humOscillator.stop();
        this.humOscillator.disconnect();
      } catch (e) {
        // Ignorar si ya paro
      }
      this.humOscillator = null;
    }
  }

  // Sonido de "Click" mecanico para el teclado
  public playKeystroke() {
    if (this.isMuted) return;
    this.init();
    if (!this.context || !this.masterGain) return;

    const t = this.context.currentTime;
    
    // 1. Ruido blanco corto (impacto)
    const bufferSize = this.context.sampleRate * 0.05; // 50ms
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;
    
    const noiseGain = this.context.createGain();
    noiseGain.gain.setValueAtTime(0.15, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);

    // Filtro paso alto para que suene mas "tick" y menos "pshh"
    const filter = this.context.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    noise.start();
  }

  // Sonido genérico de UI (Beep)
  public playBeep(frequency = 800, duration = 0.1, type: OscillatorType = 'square') {
    if (this.isMuted) return;
    this.init();
    if (!this.context || !this.masterGain) return;

    const t = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, t);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(t + duration);
  }

  public playSuccess() {
    // Arpegio ascendente rapido
    this.playBeep(440, 0.1, 'sine'); // A4
    setTimeout(() => this.playBeep(554, 0.1, 'sine'), 100); // C#5
    setTimeout(() => this.playBeep(659, 0.2, 'sine'), 200); // E5
  }

  public playError() {
    // Sonido grave y aspero
    this.playBeep(150, 0.3, 'sawtooth');
  }

  public playBootSequence() {
    // Sonido de carga de capacitor
    if (this.isMuted) return;
    this.init();
    if (!this.context || !this.masterGain) return;
    
    const t = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 1.5); // Subida de tono

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(t + 1.5);
  }
}

export const soundSynth = new SoundSynth();
