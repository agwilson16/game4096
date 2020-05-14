import Phaser from 'phaser';
import { gameOptions } from '../index';

export const emptyTileKey = 'emptyTile';
export const tilesKey = 'tiles';

export default class Bootgame extends Phaser.Scene {
  constructor() {
    super({ key: 'BootGame' });
  }

  preload() {
    //empty tile
    this.load.image(emptyTileKey, '../../public/assets/sprites/emptytile.png');

    //spritesheet of numbered tiles
    this.load.spritesheet(tilesKey, '../../public/assets/sprites/tiles.png', {
      frameWidth: gameOptions.tileSize,
      frameHeight: gameOptions.tileSize
    });
  }

  create() {
    this.scene.start('Game');
  }
}
