class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
    
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    // 4.1 make the background a tile sprite
    
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);
    this.greenFood = this.add.sprite(config.width / 2 - 50, config.height / 2, "greenFood");
    this.redFood = this.add.sprite(config.width / 2 - 50, config.height / 2, "redFood");
    this.evo = this.physics.add.sprite(config.width/2, config.height/2, "evo");
    //this.ship1 = this.add.image(config.width / 2 - 50, config.height / 2, "ship");
    //this.ship2 = this.add.image(config.width / 2, config.height / 2, "ship2");
    //this.ship3 = this.add.image(config.width / 2 + 50, config.height / 2, "ship3");
    this.anims.create({
      key: "greenFood_anim",
      frames: this.anims.generateFrameNumbers("greenFood"),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
        key: "redFood_anim",
        frames: this.anims.generateFrameNumbers("redFood"),
        frameRate: 4,
        repeat: -1
    });

    this.anims.create({
      key: "evo_up",
      frames: this.anims.generateFrameNumbers('evo', { start: 0, end: 3 }), 
      frameRate: 10,
      repeat:-1
    })
    this.anims.create({
      key: "evo_upRight",
      frames: this.anims.generateFrameNumbers('evo', { start: 4, end: 7 }), 
      frameRate: 10,
      repeat:-1
    })
    this.anims.create({
      key: "evo_upLeft",
      frames: this.anims.generateFrameNumbers('evo', { start: 28, end: 31 }), 
      frameRate: 10,
      repeat:-1
    })
    this.anims.create({
      key: "evo_down",
      frames: this.anims.generateFrameNumbers('evo', { start: 16, end: 19 }), 
      frameRate: 10,
      repeat:-1
    })
    this.anims.create({
      key: "evo_downRight",
      frames: this.anims.generateFrameNumbers('evo', { start: 12 , end: 15 }), 
      frameRate: 10,
      repeat:-1
    })
    this.anims.create({
      key: "evo_downLeft",
      frames: this.anims.generateFrameNumbers('evo', { start: 20, end: 23 }), 
      frameRate: 10,
      repeat:-1
    })
    this.anims.create({
      key: "evo_left",
      frames: this.anims.generateFrameNumbers('evo', { start: 24, end: 27 }), 
      frameRate: 10,
      repeat:-1
    })
    this.anims.create({
      key: "evo_right",
      frames: this.anims.generateFrameNumbers('evo', { start: 8, end: 11 }), 
      frameRate: 10,
      repeat:-1
    })

    this.add.text(20, 20, "Playing game", {
      font: "25px Arial",
      fill: "yellow"
    });
    
    this.greenFood.play("greenFood_anim");
    this.redFood.play("redFood_anim");
    this.evo.play("evo_up");

    
  }
  
// 0 add the update function
  update() {
    this.evo.setVelocity(0);
    this.moveEvoManager();

    this.moveFood(this.greenFood, 1);
    //this.moveEvo(this.redFood, 2);
    // 1.1 call a function to move the ships vertically
    //this.moveShip(this.ship1, 1);
    //this.moveShip(this.ship2, 2);
    //this.moveShip(this.ship3, 3);

    // scroll the background
    this.background.tilePositionY -= 0.5;
    
    


  }
  moveEvoManager(){
    this.evo.setVelocity(0);


    var leftCursor = this.cursors.left.isDown ? 1 : 0;
    var rightCursor = this.cursors.right.isDown ? 1 : 0;

    var upCursor = this.cursors.up.isDown ? 1 : 0;
    var downCursor = this.cursors.down.isDown ? 1 : 0;


    var xInput = rightCursor - leftCursor;
    var yInput =  downCursor - upCursor;

    if( xInput != 0 || yInput != 0){
      this.evo.setVelocityX(gameSettings.evoSpeed * xInput);
      this.evo.setVelocityY(gameSettings.evoSpeed * yInput);

      var dir =  Phaser.Math.Angle.Between(xInput,yInput,0,0) - Math.PI/2;
      this.evo.setRotation(dir);
      
      console.log(dir);
    }
    
  }
    // 1.2 create the function to move the ships
  moveFood(seed, speed) {
    // increase the position of the EVO on the vertical axis
    seed.y += speed;
    // if the EVO hits the bottom of the screen call the reset function
    if (seed.y > config.height) {
      // 2.1 call a reset position function
      this.resetFoodPos(seed);
    }
  }
  
    // 2.2 create the reset position function
  resetFoodPos(seed){
    // put the EVO on the top
    seed.y = 0;
    // put the EVO on a random position on the x axis
    var randomX = Phaser.Math.Between(0, config.width);
    seed.x = randomX;
  }
  
    
}