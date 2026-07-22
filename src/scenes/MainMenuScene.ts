import Phaser from 'phaser';
import { AudioManager } from '../managers/AudioManager';
import { StorageManager } from '../managers/StorageManager';

export class MainMenuScene extends Phaser.Scene {
  private audioManager!: AudioManager;
  private storageManager!: StorageManager;

  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    this.audioManager = new AudioManager();
    this.storageManager = new StorageManager();

    this.cameras.main.setBackgroundColor('#0f172a');
    this.add.rectangle(0, 0, this.scale.width * 2, this.scale.height * 2, 0x111827).setOrigin(0, 0);

    const title = this.add.text(this.scale.width / 2, 140, 'Quiz Quest', {
      fontSize: '64px',
      fontFamily: 'Arial Black',
      color: '#f8fafc',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      y: 170,
      duration: 900,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    const subtitle = this.add.text(this.scale.width / 2, 220, 'A vibrant quiz adventure', {
      fontSize: '22px',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    const panel = this.add.rectangle(this.scale.width / 2, this.scale.height / 2 + 40, 320, 360, 0x1e293b, 0.9).setStrokeStyle(2, 0x38bdf8);
    panel.setData('radius', 28);

    const playButton = this.createButton(this.scale.width / 2, this.scale.height / 2 - 20, 'Play', () => {
      this.audioManager.playButtonSound();
      this.scene.start('QuizScene');
    });

    const settingsButton = this.createButton(this.scale.width / 2, this.scale.height / 2 + 60, 'Settings', () => {
      this.audioManager.playButtonSound();
      this.storageManager.saveBool('muted', !this.audioManager.isMuted());
      this.audioManager.toggleMute();
      settingsButton.setText(this.audioManager.isMuted() ? 'Unmute' : 'Mute');
    });

    const scoresButton = this.createButton(this.scale.width / 2, this.scale.height / 2 + 140, 'High Scores', () => {
      this.audioManager.playButtonSound();
      this.scene.start('HighScoreScene');
    });

    this.tweens.add({
      targets: [panel, playButton, settingsButton, scoresButton, title, subtitle],
      alpha: { from: 0, to: 1 },
      duration: 800,
      ease: 'Back.easeOut'
    });

    this.time.addEvent({ delay: 300, callback: () => this.audioManager.playBackgroundMusic(), loop: false });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, label, {
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
      backgroundColor: '#4f46e5',
      padding: { x: 18, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    button.on('pointerover', () => {
      this.tweens.add({ targets: button, scale: 1.05, duration: 120, ease: 'Back.easeOut' });
    });

    button.on('pointerout', () => {
      this.tweens.add({ targets: button, scale: 1, duration: 120, ease: 'Back.easeOut' });
    });

    button.on('pointerdown', () => {
      this.tweens.add({ targets: button, scale: 0.95, duration: 80 });
      onClick();
    });

    button.on('pointerup', () => {
      this.tweens.add({ targets: button, scale: 1.05, duration: 80 });
    });

    return button;
  }
}
