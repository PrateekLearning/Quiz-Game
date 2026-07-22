import Phaser from 'phaser';
import { AudioManager } from '../managers/AudioManager';

interface ResultsData {
  score: number;
  accuracy: number;
}

export class ResultsScene extends Phaser.Scene {
  private audioManager!: AudioManager;

  constructor() {
    super('ResultsScene');
  }

  create(data: ResultsData): void {
    this.audioManager = new AudioManager();
    this.cameras.main.setBackgroundColor('#0f172a');
    this.add.rectangle(0, 0, this.scale.width * 2, this.scale.height * 2, 0x0f172a).setOrigin(0, 0);

    const title = this.add.text(this.scale.width / 2, 120, 'Results', {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#f8fafc'
    }).setOrigin(0.5);

    const panel = this.add.rectangle(this.scale.width / 2, this.scale.height / 2 + 10, 360, 340, 0x1e293b, 0.95).setStrokeStyle(3, 0x8b5cf6);

    const scoreLabel = this.add.text(this.scale.width / 2, this.scale.height / 2 - 80, 'Final Score', {
      fontSize: '24px',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    const scoreValue = this.add.text(this.scale.width / 2, this.scale.height / 2 - 30, '0', {
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#fbbf24'
    }).setOrigin(0.5);

    const accuracyLabel = this.add.text(this.scale.width / 2, this.scale.height / 2 + 30, 'Accuracy', {
      fontSize: '20px',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    const accuracyValue = this.add.text(this.scale.width / 2, this.scale.height / 2 + 70, '0%', {
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#34d399'
    }).setOrigin(0.5);

    const rank = this.getRank(data.accuracy);
    const rankText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 120, rank, {
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#f472b6'
    }).setOrigin(0.5);

    this.tweens.add({ targets: title, y: 140, duration: 700, ease: 'Back.easeOut' });
    this.tweens.add({ targets: panel, scale: 1.02, yoyo: true, repeat: -1, duration: 1800, ease: 'Sine.easeInOut' });

    this.tweens.addCounter({
      from: 0,
      to: data.score,
      duration: 1400,
      ease: 'Power2',
      onUpdate: (tween) => {
        const value = tween.getValue();
        if (value !== null) {
          scoreValue.setText(Math.round(value).toString());
        }
      }
    });

    this.tweens.addCounter({
      from: 0,
      to: data.accuracy,
      duration: 1400,
      ease: 'Power2',
      onUpdate: (tween) => {
        const value = tween.getValue();
        if (value !== null) {
          accuracyValue.setText(`${Math.round(value)}%`);
        }
      }
    });

    const playAgain = this.createButton(this.scale.width / 2 - 90, this.scale.height - 120, 'Play Again', () => {
      this.audioManager.playButtonSound();
      this.scene.start('QuizScene');
    });

    const menuButton = this.createButton(this.scale.width / 2 + 90, this.scale.height - 120, 'Menu', () => {
      this.audioManager.playButtonSound();
      this.scene.start('MainMenuScene');
    });

    this.tweens.add({ targets: [playAgain, menuButton, scoreLabel, accuracyLabel, rankText], alpha: { from: 0, to: 1 }, duration: 700 });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, label, {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      backgroundColor: '#4f46e5',
      padding: { x: 16, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    button.on('pointerover', () => this.tweens.add({ targets: button, scale: 1.05, duration: 120 }));
    button.on('pointerout', () => this.tweens.add({ targets: button, scale: 1, duration: 120 }));
    button.on('pointerdown', () => {
      this.tweens.add({ targets: button, scale: 0.95, duration: 80 });
      onClick();
    });
    return button;
  }

  private getRank(accuracy: number): string {
    if (accuracy >= 90) return 'Master';
    if (accuracy >= 70) return 'Expert';
    if (accuracy >= 50) return 'Intermediate';
    return 'Beginner';
  }
}
