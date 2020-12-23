  var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2],
    //pixelArt: true
};
  var game = new Phaser.Game(config);
  
  
  var gameSettings = {
    evoSpeed: 100,
    evoH: 0,
    evoV: 0,
  }