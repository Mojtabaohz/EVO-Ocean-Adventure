class Scene1 extends Phaser.Scene {
    constructor() {
      super("bootGame");
    }
  
    preload(){
      this.load.image("background", "assets/images/background.png");
      this.load.spritesheet("greenFood", "assets/spritesheets/greenFood.png",{
          frameWidth:32,
          frameHeight:32
      });
      this.load.spritesheet("redFood","assets/spritesheets/redFood.png",{
          frameWidth: 32,
          frameHeight: 32
      })
      this.load.spritesheet("enemy","assets/spritesheets/enemy.png",{
        frameWidth: 32,
        frameHeight: 32
    })
      this.load.spritesheet("evo","assets/spritesheets/evo.png",{
        frameHeight: 46,
        frameWidth: 46
      })

      //this.load.image("ship", "assets/images/ship.png");
      //this.load.image("ship2", "assets/images/ship2.png");
      //this.load.image("ship3", "assets/images/ship3.png");
    }
  
    create() {
      this.add.text(20, 20, "Loading game...");
      this.scene.start("playGame");
    }
    update(){
      this.add.text(100,100,gameSettings.evoPoint);
    }
  }