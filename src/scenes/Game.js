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

    for (let i = 0; i < gameOptions.boardSize.rows; i++) {
      for (let j = 0; j < gameOptions.boardSize.columns; j++) {
        if (this.boardArray[i][j].tileValue === 0) {
          emptyTiles.push({
            row: i,
            col: j
          });
        }
      }
    }

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
          this.canMove = true;
        }
      });
    }
  }

  makeMove(d) {
    //vertical direction
    const dRow =
      d === directions.left || d === directions.right
        ? 0
        : d === directions.up
        ? -1
        : 1;

    //horizontal direction
    const dCol =
      d === directions.up || d === directions.down
        ? 0
        : d === directions.left
        ? -1
        : 1;

    //will be used for z-depth (z-depth default is 0 for sprites)
    let movedTiles = 0;

    //prevent other moves while this move resolves
    this.canMove = false;

    const firstRow = d === directions.up ? 1 : 0;
    const lastRow =
      gameOptions.boardSize.rows - (d === directions.down ? 1 : 0);
    const firstCol = d === directions.left ? 1 : 0;
    const lastCol =
      gameOptions.boardSize.columns - (d === directions.right ? 1 : 0);

    for (let i = firstRow; i < lastRow; i++) {
      for (let j = firstCol; j < lastCol; j++) {
        //current row and column added for readability

        const curRow = dRow === 1 ? lastRow - 1 - i : i;
        const curCol = dCol === 1 ? lastCol - 1 - j : j;

        //get the tile val
        const tileValue = this.boardArray[curRow][curCol].tileValue;

        //if it's not blank, get nre position
        if (tileValue !== 0) {
          let newRow = curRow;
          let newCol = curCol;

          while (this.isLegalPosition(newRow + dRow, newCol + dCol)) {
            newRow += dRow;
            newCol += dCol;
          }

          //for z-depth
          movedTiles++;

          const newPos = this.getTilePosition(newRow, newCol);

          this.boardArray[curRow][curCol].tileSprite.depth = movedTiles;
          this.boardArray[curRow][curCol].tileSprite.x = newPos.x;
          this.boardArray[curRow][curCol].tileSprite.y = newPos.y;

          this.boardArray[curRow][curCol].tileValue = 0;

          if (this.boardArray[newRow][newCol].tileValue === tileValue) {
            console.log('here');
            this.boardArray[newRow][newCol].tileValue = tileValue + 1;
            this.boardArray[curRow][curCol].tileSprite.setFrame(tileValue);
          } else {
            this.boardArray[newRow][newCol].tileValue = tileValue;
          }
        }
      }
    }
    this.canMove = true;
    this.refreshBoard();
  }

  refreshBoard() {
    for (let i = 0; i < gameOptions.boardSize.rows; i++) {
      for (let j = 0; j < gameOptions.boardSize.columns; j++) {
        const spritePosition = this.getTilePosition(i, j);
        this.boardArray[i][j].tileSprite.x = spritePosition.x;
        this.boardArray[i][j].tileSprite.y = spritePosition.y;
        const tileValue = this.boardArray[i][j].tileValue;
        if (tileValue > 0) {
          this.boardArray[i][j].tileSprite.visible = true;
          this.boardArray[i][j].tileSprite.setFrame(tileValue - 1);
        } else {
          this.boardArray[i][j].tileSprite.visible = false;
        }
      }
    }
    this.addTile();
  }

  isLegalPosition(row, col) {
    const rowInside = row >= 0 && row < gameOptions.boardSize.rows;
    const colInside = col >= 0 && col < gameOptions.boardSize.columns;
    return rowInside && colInside;
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

  update() {}
}
