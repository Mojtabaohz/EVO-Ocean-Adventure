class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
    
  }

create() {

    

  this.cursors = this.input.keyboard.createCursorKeys();
  // 4.1 make the background a tile sprite
  
  this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
  this.background.setOrigin(0, 0);

  
  this.greenFood = new FoodGreen(this, Phaser.Math.Between(0, config.width), 0);
  this.redFood = new FoodRed(this, Phaser.Math.Between(0, config.width), 0);
  this.evo = this.physics.add.sprite(config.width/2, config.height/2, "evo");


  //create 4 enemies and add them to "enemies" group to later update them with following player movement in update function
  this.enemy01 = new Enemy(this, Phaser.Math.Between(0, config.width), Phaser.Math.Between(0, config.height));
  this.enemy02 = new Enemy(this, Phaser.Math.Between(0, config.width), Phaser.Math.Between(0, config.height));
  this.enemy03 = new Enemy(this, Phaser.Math.Between(0, config.width), Phaser.Math.Between(0, config.height));
  this.enemy04 = new Enemy(this, Phaser.Math.Between(0, config.width), Phaser.Math.Between(0, config.height));
  
  this.enemies = this.physics.add.group();
  this.enemies.add(this.enemy01);
  this.enemies.add(this.enemy02);
  this.enemies.add(this.enemy03);
  this.enemies.add(this.enemy04);


  console.log(this.enemies.getChildren());
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
    key: "enemy_anim",
    frames: this.anims.generateFrameNumbers("enemy",{ start: 4, end: 7 }),
    frameRate: 4,
    repeat: -1
  });
  this.anims.create({
    key: "enemy_sleep",
    frames: this.anims.generateFrameNumbers("enemy",{ start: 0, end: 3 }),
    frameRate: 4,
    repeat: -1
  });

  this.anims.create({
    key: "evo_move",
    frames: this.anims.generateFrameNumbers('evo', { start: 0, end: 3 }), 
    frameRate: 8,
    repeat:-1
  })
  this.anims.create({
    key: "evo_idle",
    frames: this.anims.generateFrameNumbers('evo', { start: 0, end: 3 }), 
    frameRate: 5,
    repeat:-1
  })
  this.anims.create({
    key: "evoG_move",
    frames: this.anims.generateFrameNumbers('evo', { start: 4, end: 7 }), 
    frameRate: 8,
    repeat:-1
  })
    

    
    
  this.greenFood.play("greenFood_anim");
  this.redFood.play("redFood_anim");
  this.enemy01.play("enemy_sleep",true);
  this.enemy02.play("enemy_sleep",true);
  this.enemy03.play("enemy_sleep",true);
  this.enemy04.play("enemy_sleep",true);

  this.evo.body.collideWorldBounds = true;


    // spawn food between a random number which is fixed in every session after creation
  this.time.addEvent({
    delay: Phaser.Math.Between(1500, 3000),
    callback: ()=>{
        // spawn a new food
        this.resetFoodPos();
        
    },
    loop: true
    })
  }
  
// 0 add the update function
  update() {
    
    this.enemies.getChildren().forEach(function(enemy) {
      this.physics.add.overlap(this.evo, enemy, this.touchEnemy, null, this);
      //wakes enemy up if player gets closer than enemyRange
      if (Phaser.Math.Distance.BetweenPoints(this.evo, enemy)< gameSettings.enemyRange && (gameSettings.evoHealth > 0) && (gameSettings.currPoint < gameSettings.evolvePoint)) {
        enemy.play("enemy_anim",true); 
        // rotate enemy to face towards player and move enemy towards player 
        this.moveEnemyManager(enemy);
        
      }else{
        //put enemies in sleep when player escape from their range
        enemy.play("enemy_sleep",true);
        enemy.setVelocity(0);
      }
    }, this);


    
    //manage player movement
    this.moveEvoManager();

    //check overlap between player(evo) and foods
    this.physics.add.overlap(this.evo,this.greenFood,this.eatFood,null,this);
    this.physics.add.overlap(this.evo,this.redFood,this.eatFood,null,this);
    
    // scroll the background
    this.background.tilePositionY -= 0.3;
    

  }


  moveEnemyManager(enemy){
    var dir2 =  Phaser.Math.Angle.Between(enemy.x,enemy.y,this.evo.x,this.evo.y);
    enemy.setRotation(dir2) ;
    this.physics.moveTo(enemy, this.evo.x, this.evo.y, gameSettings.enemySpeed);

  }
  /** */
  moveEvoManager(){
    //choose evo animation based on previous evoloution
    if(gameSettings.currPoint<5){
      this.evo.play("evo_move",true);
    }
    else if(gameSettings.currPoint<10){
      this.evo.play("evoG_move",true);
    }else{
      this.evo.play("enemy_anim",true);
    }

    //set velocity to zero after each move to prevent sliding
    this.evo.setVelocity(0);

    // change the true or false of cursors to integer 
    //later we will use this integer to see if evo moving up or down and left or right based on simple calculation
    var leftCursor = this.cursors.left.isDown ? 1 : 0;
    var rightCursor = this.cursors.right.isDown ? 1 : 0;

    var upCursor = this.cursors.up.isDown ? 1 : 0;
    var downCursor = this.cursors.down.isDown ? 1 : 0;

    //xInput is when left or right arrow key is pressed, then will return 1 for right direction and -1 for left direction
    //yInput is like xInpute except for Y direction 1 is down and -1 is up
    var xInput = rightCursor - leftCursor;
    var yInput =  downCursor - upCursor;

    // check and see if xInput or yInput is other than zero then move the evo based on the direction. 
    // evo.setRotation will rotate the evo itself to the direction it is heading
    if( xInput != 0 || yInput != 0){
      this.evo.setVelocityX(gameSettings.evoSpeed * xInput);
      this.evo.setVelocityY(gameSettings.evoSpeed * yInput);

      var dir =  Phaser.Math.Angle.Between(xInput,yInput,0,0) - Math.PI/2;
      this.evo.setRotation(dir);
      
      //console.log(dir);
    }
    
  }

  eatFood(evo,food){
    
    //console.log(food.texture);
    if(food.texture == this.redFood.texture){
      this.events.emit('addScore');
      //console.log(" add score");
    }else{
      this.events.emit('slowDown');
      //console.log("slow down");
    }
    food.destroy();

    if(gameSettings.currPoint >= gameSettings.evolvePoint){
      this.events.emit('endGame');
    }
    //gameSettings.enemySpeed += 15;
    //this.resetFoodPos(food);
  }
    
  touchEnemy(evo,enemy){
        
    enemy.disableBody(true,true);
    this.events.emit('getDamage');

    this.time.addEvent({
      delay: 1000,
      callback: ()=>{
      this.events.emit('returnNormal');
        
    },
    loop: false
    })
    if(gameSettings.evoHealth == 0){
      this.events.emit('endGame');
      this.evo.disableBody(true,true);
    }

    
    
    
    //enemy.destroy();
  }

  resetFoodPos(){
    // spawn a food based on a random math
    let rand = Phaser.Math.Between(0, 1);
    if(rand==0){
      let foodGreen = new FoodGreen(this, Phaser.Math.Between(0, config.width), 0);
      this.greenFood = foodGreen;
      this.greenFood.play("greenFood_anim");
    }
    else{
      let foodRed = new FoodRed(this, Phaser.Math.Between(0, config.width), 0);
      this.redFood = foodRed;
      this.redFood.play("redFood_anim");
    }
  }


}


/* Green Food Class */
class FoodGreen extends Phaser.Physics.Arcade.Sprite {
  
  constructor(scene, x = 0, y = 0, texture = 'greenFood') {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    scene.events.on('update', this.update, this)

    
  }

  update(){
    this.y += 1;
    
  }

}
/*Red Food Class */
class FoodRed extends Phaser.Physics.Arcade.Sprite {
  
  constructor(scene, x = 0, y = 0, texture = 'redFood') {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    scene.events.on('update', this.update, this)

    
  }

  update(){
    this.y += 1;
    
  }

}

/*Enemy Class */
class Enemy extends Phaser.Physics.Arcade.Sprite {
  
  constructor(scene, x = 0, y = 0, texture = 'enemy') {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    scene.events.on('update', this.update, this)

    
  }

  update(){
    //this.y += 1;
    //this.setVelocityX(gameSettings.evoSpeed);
    //this.setVelocityY(gameSettings.evoSpeed);
    
  }

}


/*UI Scene Class */
class Scene3 extends Phaser.Scene {

  constructor ()
  {
      super({ key: 'UIScene', active: true });

  }

  create ()
  {
      //  Our Text object to display the Score

      let info = this.add.text(10, 20, 'Score: 0', { font: '28px Arial', fill: '#000000' });
      let endGame = this.add.text(config.width/2 - 250,config.height/2 - 100,'',{font: '48px Arial', fill: '#000000' })

      //  Grab a reference to the Game Scene
      let ourGame = this.scene.get('playGame');

      //  Listen for events from it
      ourGame.events.on('addScore', function () {

          gameSettings.currPoint += 2;
          gameSettings.enemySpeed += 15;
          gameSettings.enemyRange += 100;

          info.setText('Score: ' + gameSettings.currPoint);
          

      }, this);

      ourGame.events.on('slowDown',function(){

        gameSettings.currPoint -= 1;
        gameSettings.enemySpeed -= 10;
        gameSettings.enemyRange += 100;

        info.setText('Score: ' + gameSettings.currPoint);

      },this);
  
      ourGame.events.on('getDamage',function(){
        
        gameSettings.evoHealth -= 1;
        gameSettings.enemySpeed -= 200;


      },this);
      ourGame.events.on('returnNormal',function(){
        
        gameSettings.enemySpeed += 200;


      },this);

      ourGame.events.on('endGame',function(){
        
        if(gameSettings.currPoint >= gameSettings.evolvePoint){
          endGame.setText('You Evolved successfuly');
        }else{
          endGame.setText('Game Over');
        }
        

      },this);
  }
}