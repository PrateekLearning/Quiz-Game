import Phaser from 'phaser';
import { ScoreManager } from '../managers/ScoreManager';
import { AudioManager } from '../managers/AudioManager';

export class HighScoreScene extends Phaser.Scene {
  private scoreManager!: ScoreManager;
  private audioManager!: AudioManager;

  constructor() {
    super('HighScoreScene');
  }

  create(): void {
    this.audioManager = new AudioManager();
    this.scoreManager = new ScoreManager();
    this.cameras.main.setBackgroundColor('#0f172a');
    this.add.rectangle(0, 0, this.scale.width * 2, this.scale.height * 2, 0x0f172a).setOrigin(0, 0);

    this.add.text(this.scale.width / 2, 80, 'High Scores', {
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#f8fafc'
    }).setOrigin(0.5);

    const scores = this.scoreManager.getScores();
    if (scores.length === 0) {
      this.add.text(this.scale.width / 2, this.scale.height / 2, 'No scores yet. Play a round to set the first one!', {
        fontSize: '22px',
        color: '#cbd5e1',
        align: 'center',
        wordWrap: { width: 340 }
      }).setOrigin(0.5);
    } else {
      const list = this.add.text(this.scale.width / 2, 180, '', {
        fontSize: '22px',
        color: '#f8fafc',
        align: 'left',
        wordWrap: { width: 340 }
      }).setOrigin(0.5, 0);

      const lines = scores.slice(0, 8).map((entry, index) => `${index + 1}. Score ${entry.score} • ${entry.accuracy}%`).join('\n');
      list.setText(lines);
    }

    const menuButton = this.createButton(this.scale.width / 2, this.scale.height - 90, 'Back to Menu', () => {
      this.audioManager.playButtonSound();
      this.scene.start('MainMenuScene');
    });
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
}
