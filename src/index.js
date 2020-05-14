import Phaser from 'phaser';
import Game from './scenes/Game';
import BootGame from './scenes/Bootgame';

const gameOptions = {
  tileSize: 200,
  tileSpacing: 20,
  boardSize: {
    rows: 4,
    columns: 4
  }
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
