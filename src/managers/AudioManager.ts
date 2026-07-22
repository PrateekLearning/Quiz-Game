export class AudioManager {
  private context: AudioContext | null = null;
  private muted = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (typeof window === 'undefined') {
      return;
    }
    this.context = new window.AudioContext();
  }

  public toggleMute(): void {
    this.muted = !this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public playTone(frequency: number, duration: number, type: OscillatorType = 'square'): void {
    if (this.muted || !this.context) {
      return;
    }

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    gain.gain.setValueAtTime(0.05, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }

  public playButtonSound(): void {
    this.playTone(660, 0.08, 'triangle');
  }

  public playCorrectSound(): void {
    this.playTone(880, 0.12, 'sine');
  }

  public playWrongSound(): void {
    this.playTone(220, 0.18, 'sawtooth');
  }

  public playBackgroundMusic(): void {
    if (this.muted || !this.context) {
      return;
    }
    this.playTone(392, 0.1, 'triangle');
  }
}
