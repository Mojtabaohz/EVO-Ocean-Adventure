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
    scene: [Scene1, Scene2, Scene3],
    //pixelArt: true
};
  var game = new Phaser.Game(config);
  
  
  var gameSettings = {
    evoHealth: 2,
    evoSpeed: 100,
    enemySpeed: 50,
    enemyRange: 250,
    currPoint: 0,
    evolvePoint: 10
  }