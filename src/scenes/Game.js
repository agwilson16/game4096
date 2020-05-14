import Phaser from 'phaser';
import { gameOptions } from '../index';
import { emptyTileKey, tilesKey } from './Bootgame';

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload() {}

  create() {
    //create the board -- see gameOptions in index.js
    //this will create a 4 x 4 board
    for (let i = 0; i < gameOptions.boardSize.rows; i++) {
      for (let j = 0; j < gameOptions.boardSize.columns; j++) {
        const tilePosition = this.getTilePosition(i, j);

        this.add.image(tilePosition.x, tilePosition.y, emptyTileKey);

        const tile = this.add.sprite(
          tilePosition.x,
          tilePosition.y,
          tilesKey,
          11
        );

        tile.visible = false;
      }
    }
  }

  getTilePosition(row, col) {
    const posX =
      gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);

    const posY =
      gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
  }

  update() {}
}
