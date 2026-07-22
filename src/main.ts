import Phaser from 'phaser';
import './styles.css';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { QuizScene } from './scenes/QuizScene';
import { ResultsScene } from './scenes/ResultsScene';
import { HighScoreScene } from './scenes/HighScoreScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#0f172a',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [BootScene, PreloadScene, MainMenuScene, QuizScene, ResultsScene, HighScoreScene],
  dom: {
    createContainer: true
  }
};

new Phaser.Game(config);
