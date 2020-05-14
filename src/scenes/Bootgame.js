import Phaser from 'phaser';

const emptyTileKey = 'emptyTile';

export default class Bootgame extends Phaser.Scene {
  constructor() {
    super({ key: 'BootGame' });
  }

  preload() {
    this.load.image(emptyTileKey, '../../public/assets/sprites/emptytile.png');
  }

  create() {
    this.scene.start('Game');
  }
}
