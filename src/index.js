import Phaser from 'phaser';
import Game from './scenes/Game';

window.onload = () => {
  const gameConfig = {
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: 'game4096'
    },
    backgroundColor: 0xecf0f1,
    scene: [Game]
  };
  const game = new Phaser.Game(gameConfig);
};
