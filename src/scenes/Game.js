import Phaser from 'phaser';

const emptyTileKey = 'emptyTile';

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload() {}

  create() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.add.image(120 + j * 220, 120 + i * 220, emptyTileKey);
      }
    }
  }

  update() {}
}
