// Sound Effects Utility using Web Audio API
export type SoundType =
  | 'buy'
  | 'sell'
  | 'travel'
  | 'unlock'
  | 'notification'
  | 'error'
  | 'goalComplete'
  | 'click'
  | 'hover';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  private ensureContext() {
    if (!this.audioContext) {
      return null;
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(this.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  buy() {
    // Rising tone for purchase
    this.playTone(523.25, 0.1, 'sine'); // C5
    setTimeout(() => this.playTone(659.25, 0.15, 'sine'), 100); // E5
  }

  sell() {
    // Happy chime for sale
    this.playTone(783.99, 0.1, 'sine'); // G5
    setTimeout(() => this.playTone(987.77, 0.2, 'sine'), 100); // B5
  }

  travel() {
    // Rising sequence for travel
    this.playTone(440, 0.15, 'sine'); // A4
    setTimeout(() => this.playTone(554.37, 0.15, 'sine'), 120); // C#5
    setTimeout(() => this.playTone(659.25, 0.2, 'sine'), 240); // E5
  }

  unlock() {
    // Triumph for unlocking
    this.playTone(523.25, 0.1, 'triangle');
    setTimeout(() => this.playTone(659.25, 0.1, 'triangle'), 100);
    setTimeout(() => this.playTone(783.99, 0.15, 'triangle'), 200);
    setTimeout(() => this.playTone(1046.50, 0.3, 'triangle'), 300); // C6
  }

  notification() {
    // Simple ding
    this.playTone(880, 0.1, 'sine'); // A5
  }

  error() {
    // Low descending tone
    this.playTone(200, 0.15, 'sawtooth');
    setTimeout(() => this.playTone(150, 0.2, 'sawtooth'), 150);
  }

  goalComplete() {
    // Victory fanfare
    const ctx = this.ensureContext();
    if (!ctx) return;

    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    frequencies.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'triangle'), i * 150);
    });
  }

  click() {
    // Subtle click
    this.playTone(800, 0.02, 'sine');
  }

  hover() {
    // Very subtle hover sound
    this.playTone(1200, 0.015, 'sine');
  }

  play(type: SoundType) {
    if (!this.enabled) return;

    const ctx = this.ensureContext();
    if (!ctx) return;

    switch (type) {
      case 'buy':
        this.buy();
        break;
      case 'sell':
        this.sell();
        break;
      case 'travel':
        this.travel();
        break;
      case 'unlock':
        this.unlock();
        break;
      case 'notification':
        this.notification();
        break;
      case 'error':
        this.error();
        break;
      case 'goalComplete':
        this.goalComplete();
        break;
      case 'click':
        this.click();
        break;
      case 'hover':
        this.hover();
        break;
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export function playSound(type: SoundType) {
  soundManager.play(type);
}

export function toggleSound() {
  soundManager.setEnabled(!soundManager.isEnabled());
}

export function setSoundVolume(volume: number) {
  soundManager.setVolume(volume);
}

export function isSoundEnabled(): boolean {
  return soundManager.isEnabled();
}
