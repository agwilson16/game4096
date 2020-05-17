import Phaser from 'phaser';
import { directions, gameOptions } from '../index';
import { emptyTileKey, tilesKey } from './Bootgame';

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });

    this.boardArray = [];
    this.canMove = false;
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

    //handle user input
    //swipe ends when finger raised or mouse button released (pointerup)
    //keyboard
    this.input.keyboard.on('keydown', this.handleKey, this);

    //swipes
    this.input.on('pointerup', this.handleSwipe, this);
  }

  getTilePosition(row, col) {
    const posX =
      gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);

    const posY =
      gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
  }

  addTile() {
    //get empty tiles
    let emptyTiles = [];

    this.boardArray.forEach((row, rowIndex) => {
      row.forEach((column, colIndex) => {
        if (column.tileValue === 0) {
          emptyTiles.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    //place or show tiles
    if (emptyTiles.length > 0) {
      const chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);

      const tile = this.boardArray[chosenTile.row][chosenTile.col];

      tile.tileValue = 1; //first frame off of sprite sheet showing 2
      tile.tileSprite.visible = true; //make sprite visible
      tile.tileSprite.setFrame(0); //show the first frame
      tile.tileSprite.alpha = 0; //starts out invisible

      //animate to visible and set this.canMove to true
      this.tweens.add({
        targets: tile.tileSprite,
        alpha: 1,
        duration: gameOptions.tweenSpeed,
        callbackScope: this,
        onComplete: () => {
          console.log('tween completed');
          this.canMove = true;
        }
      });
    }
  }

  //handle keyboard and swipe events
  handleKey(e) {
    //callbacks like handleKey get automatic access to the event (e)
    const keyPressed = e.code;

    if (this.canMove) {
      switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
          this.makeMove(directions.left);
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.makeMove(directions.right);
          break;
        case 'KeyW':
        case 'ArrowUp':
          this.makeMove(directions.up);
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.makeMove(directions.down);
          break;
      }
    }
  }

  handleSwipe(e) {
    //swipe ends when finger raised or mouse button released

    if (this.canMove) {
      const swipeTime = e.upTime - e.downTime;
      const fastEnough = swipeTime < gameOptions.swipeMaxTime;
      const swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
      const swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
      const longEnough = swipeMagnitude > gameOptions.swipeMinDistance;

      if (longEnough && fastEnough) {
        Phaser.Geom.Point.SetMagnitude(swipe, 1);
        if (swipe.x > gameOptions.swipeMinNormal) {
          this.makeMove(directions.right);
        }
        if (swipe.x < -gameOptions.swipeMinNormal) {
          this.makeMove(directions.left);
        }
        if (swipe.y > gameOptions.swipeMinNormal) {
          this.makeMove(directions.down);
        }
        if (swipe.y < -gameOptions.swipeMinNormal) {
          this.makeMove(directions.up);
        }
      }
    }
  }

  makeMove(direction) {
    console.log('direction ', direction);
  }

  update() {}
}
