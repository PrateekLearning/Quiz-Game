import Phaser from 'phaser';
import { AudioManager } from '../managers/AudioManager';
import { QuizManager, QuizQuestion } from '../managers/QuizManager';
import { ScoreManager } from '../managers/ScoreManager';
import { StorageManager } from '../managers/StorageManager';

export class QuizScene extends Phaser.Scene {
  private quizManager!: QuizManager;
  private audioManager!: AudioManager;
  private scoreManager!: ScoreManager;
  private storageManager!: StorageManager;
  private questionText!: Phaser.GameObjects.Text;
  private answerButtons: Phaser.GameObjects.Text[] = [];
  private progressBar!: Phaser.GameObjects.Rectangle;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private timerEvent?: Phaser.Time.TimerEvent;
  private timeLeft = 15;
  private currentQuestion!: QuizQuestion;
  private questionIndex = 0;
  private answered = false;

  constructor() {
    super('QuizScene');
  }

  create(): void {
    this.quizManager = new QuizManager();
    this.audioManager = new AudioManager();
    this.scoreManager = new ScoreManager();
    this.storageManager = new StorageManager();
    this.audioManager.toggleMute();
    if (this.storageManager.loadBool('muted')) {
      this.audioManager.toggleMute();
    }

    this.cameras.main.setBackgroundColor('#111827');
    this.add.rectangle(0, 0, this.scale.width * 2, this.scale.height * 2, 0x111827).setOrigin(0, 0);

    this.add.text(40, 40, 'Quiz Challenge', { fontSize: '28px', color: '#f8fafc', fontStyle: 'bold' }).setOrigin(0, 0.5);

    this.scoreText = this.add.text(this.scale.width - 40, 40, 'Score: 0', {
      fontSize: '24px',
      color: '#fbbf24',
      fontStyle: 'bold'
    }).setOrigin(1, 0.5);

    this.progressBar = this.add.rectangle(40, 90, 1, 12, 0x38bdf8).setOrigin(0, 0.5);
    this.add.rectangle(40, 90, this.scale.width - 80, 12, 0x334155, 0.8).setOrigin(0, 0.5);

    this.timerText = this.add.text(this.scale.width / 2, 140, '15s', {
      fontSize: '34px',
      color: '#fb923c',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const card = this.add.rectangle(this.scale.width / 2, this.scale.height * 0.35, 360, 220, 0x1e293b, 0.95).setStrokeStyle(3, 0x6366f1);
    this.questionText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 60, '', {
      fontSize: '26px',
      color: '#f8fafc',
      align: 'center',
      wordWrap: { width: 300 }
    }).setOrigin(0.5);

    this.tweens.add({ targets: card, scale: 1.02, yoyo: true, repeat: -1, duration: 1800, ease: 'Sine.easeInOut' });
    this.showNextQuestion();
  }

  private showNextQuestion(): void {
    this.answered = false;
    this.timeLeft = 15;
    this.questionIndex += 1;
    this.currentQuestion = this.quizManager.getNextQuestion()!;
    if (!this.currentQuestion) {
      this.endQuiz();
      return;
    }

    this.questionText.setText(this.currentQuestion.question);
    this.updateProgress();
    this.updateScore();

    this.answerButtons.forEach((button) => button.destroy());
    this.answerButtons = [];

    const buttonY = this.scale.height / 2 + 50;
    this.currentQuestion.answers.forEach((answer, index) => {
      const button = this.add.text(this.scale.width / 2, buttonY + index * 55, answer, {
        fontSize: '22px',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#475569',
        padding: { x: 16, y: 10 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      button.on('pointerover', () => {
        this.tweens.add({ targets: button, scale: 1.03, duration: 100, ease: 'Back.easeOut' });
      });

      button.on('pointerout', () => {
        this.tweens.add({ targets: button, scale: 1, duration: 100, ease: 'Back.easeOut' });
      });

      button.on('pointerdown', () => {
        if (this.answered) {
          return;
        }
        this.answered = true;
        this.audioManager.playButtonSound();
        const correct = this.quizManager.submitAnswer(index);
        if (correct) {
          this.audioManager.playCorrectSound();
          this.flashFeedback(button, '#22c55e');
          this.spawnParticles(button.x, button.y);
          this.showFloatingText('+100', button.x, button.y - 40);
        } else {
          this.audioManager.playWrongSound();
          this.flashFeedback(button, '#ef4444');
          this.cameras.main.shake(120, 0.01);
          this.showFloatingText('-100', button.x, button.y - 40);
        }
        this.updateScore();
        this.time.delayedCall(700, () => this.showNextQuestion());
      });

      this.answerButtons.push(button);
    });

    this.timerEvent?.remove(false);
    this.timeLeft = 15;
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft -= 1;
        this.timerText.setText(`${this.timeLeft}s`);
        if (this.timeLeft <= 0) {
          this.answered = true;
          this.audioManager.playWrongSound();
          this.quizManager.submitAnswer(-1);
          this.updateScore();
          this.time.delayedCall(700, () => this.showNextQuestion());
        }
      },
      loop: true
    });
  }

  private flashFeedback(button: Phaser.GameObjects.Text, color: string): void {
    this.tweens.add({ targets: button, alpha: 0.5, duration: 150, yoyo: true, repeat: 1 });
    button.setStyle({ backgroundColor: color });
  }

  private spawnParticles(x: number, y: number): void {
    for (let i = 0; i < 12; i += 1) {
      const particle = this.add.circle(x, y, 4, 0xfacc15);
      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-80, 80),
        y: y + Phaser.Math.Between(-80, 80),
        alpha: 0,
        duration: 700,
        onComplete: () => particle.destroy()
      });
    }
  }

  private showFloatingText(text: string, x: number, y: number): void {
    const floating = this.add.text(x, y, text, {
      fontSize: '24px',
      color: '#fef3c7',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.tweens.add({ targets: floating, y: y - 50, alpha: 0, duration: 800, onComplete: () => floating.destroy() });
  }

  private updateScore(): void {
    this.scoreText.setText(`Score: ${this.quizManager.getScore()}`);
  }

  private updateProgress(): void {
    const progress = this.quizManager.getProgress();
    this.tweens.add({ targets: this.progressBar, width: (this.scale.width - 80) * progress, duration: 300, ease: 'Power2' });
  }

  private endQuiz(): void {
    const accuracy = Math.round((this.quizManager.getScore() / (this.quizManager.getAnsweredCount() * 100)) * 100);
    this.scoreManager.addScore(this.quizManager.getScore(), accuracy);
    this.scene.start('ResultsScene', { score: this.quizManager.getScore(), accuracy });
  }
}
