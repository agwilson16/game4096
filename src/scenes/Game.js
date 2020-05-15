import Phaser from 'phaser';
import { gameOptions } from '../index';
import { emptyTileKey, tilesKey } from './Bootgame';

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });

    this.boardArray = [];
  }

  preload() {}

  create() {
    //create the board -- see gameOptions in index.js
    //this will create a 4 x 4 board
    for (let i = 0; i < gameOptions.boardSize.rows; i++) {
      this.boardArray[i] = [];
      for (let j = 0; j < gameOptions.boardSize.columns; j++) {
        const tilePosition = this.getTilePosition(i, j);

        this.add.image(tilePosition.x, tilePosition.y, emptyTileKey);

        const tile = this.add.sprite(
          tilePosition.x,
          tilePosition.y,
          tilesKey,
          0
        );

        tile.visible = false;

        //store board config
        this.boardArray[i][j] = {
          tileValue: 0,
          tileSprite: tile
        };
      }
    }
    this.addTile();
    this.addTile();
  }

  getTilePosition(row, col) {
    const posX =
      gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);

    const posY =
      gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
  }

  addTile() {
    let emptyTiles = [];

    this.boardArray.forEach((row, rowIndex) => {
      row.forEach((column, colIndex) => {
        if (column.tileValue === 0) {
          emptyTiles.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    //place tiles
    if (emptyTiles.length > 0) {
      const chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);

      const tile = this.boardArray[chosenTile.row][chosenTile.col];

      tile.tileValue = 1;
      tile.tileSprite.visible = true;
      tile.tileSprite.setFrame(0);
    }
  }

  update() {}
}
