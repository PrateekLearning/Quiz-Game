import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    this.load.image('logo', 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=300&q=80');
  }

  create(): void {
    this.scene.start('PreloadScene');
  }
}
