import Phaser from 'phaser';
import Game from './scenes/Game';
import BootGame from './scenes/Bootgame';

export const gameOptions = {
  tileSize: 200,
  tileSpacing: 20,
  boardSize: {
    rows: 4,
    columns: 4
  },
  tweenSpeed: 500, //in ms,
  swipeMaxTime: 1000,
  swipeMinDistance: 20,
  swipeMinNormal: 0.85
};

export const directions = {
  left: 0,
  right: 1,
  up: 2,
  down: 3
};

const gameConfig = {
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width:
      gameOptions.boardSize.columns *
        (gameOptions.tileSize + gameOptions.tileSpacing) +
      gameOptions.tileSpacing,
    height:
      gameOptions.boardSize.rows *
        (gameOptions.tileSize + gameOptions.tileSpacing) +
      gameOptions.tileSpacing,
    parent: 'game4096'
  },
  backgroundColor: 0xecf0f1,
  scene: [BootGame, Game]
};

const game = new Phaser.Game(gameConfig);
