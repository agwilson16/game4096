import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload() {}

  create() {
    this.dealText = this.add
      .text(75, 350, ['GAME 4096'])
      .setFontSize(18)
      .setFontFamily('Trebuchet MS')
      .setColor(' 0xfff0f1');
  }

  update() {}
}
