// This example uses the Phaser 2.2.2 framework

// Copyright © 2014 John Watson
// Licensed under the terms of the MIT License

var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
    this.game.load.image('ground', 'ground2.png');
    this.game.load.image('player', 'player.png');
    this.game.load.image('enemy', 'enemy-3.png');
    this.game.load.image('powerup', 'powerup.png');
    this.game.load.image('back', 'back.png');
};

// Setup the example
GameState.prototype.create = function() {
    initGlobals();
    game.add.tileSprite(0, 90, 1000, 600, 'back');
    // Set stage background to something sky colored
    this.game.stage.backgroundColor = 0x4488cc;

    // Define movement constants
    this.MAX_SPEED = 500; // pixels/second
    this.ACCELERATION = 1500; // pixels/second/second
    this.DRAG = 600; // pixels/second
    this.GRAVITY = 2600; // pixels/second/second
    this.JUMP_SPEED = -1000; // pixels/second (negative y is up)

    // Create a player sprite
    this.player = this.game.add.sprite(this.game.width/2, this.game.height - 164, 'player');
this.player.scale.setTo(0.05,0.05);
    this.player.anchor.setTo(0.5, 0.5);

    // Enable physics on the player
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    // Make player collide with world boundaries so he doesn't leave the stage
    this.player.body.collideWorldBounds = true;

    // Set player minimum and maximum movement speed
    this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    this.player.body.drag.setTo(this.DRAG, 0); // x, y

    // Since we're jumping we need gravity
    game.physics.arcade.gravity.y = this.GRAVITY;


    this.enemies = this.game.add.group();
    this.powerups = this.game.add.group();

    // Create some ground for the player to walk on
    this.ground = this.game.add.group();
    for(var x = 0; x < this.game.width; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }

    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);

    // Just for fun, draw some height markers so we can see how high we're jumping
    this.drawHeightMarkers();
};

GameState.prototype.addEnemy = function() {
    var enemy = this.game.add.sprite(this.game.rnd.integerInRange(50, this.game.width-50), 0, 'enemy');
    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    enemy.body.drag.setTo(this.DRAG, 0); // x, y
    enemy.scale.setTo(0.1,0.1);
    if (enemy.x > this.player.x) {
        enemy.sideToGo = -1;

    }
    else {
        enemy.sideToGo = 1;

    }

    return enemy;
    // Since we're jumping we need gravity
}



GameState.prototype.addPowerup = function() {
    var powerup = this.game.add.sprite(this.game.width / 2, 0, 'powerup');
    this.game.physics.enable(powerup, Phaser.Physics.ARCADE);
    powerup.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 4); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    powerup.body.drag.setTo(this.DRAG, 0); // x, y
    powerup.scale.setTo(0.1,0.1);
    if (Math.random() >= 0.5) {
        powerup.sideToGo = -1;

    }
    else {
        powerup.sideToGo = 1;

    }

    return powerup;
    // Since we're jumping we need gravity
}



// This function draws horizontal lines across the stage
GameState.prototype.drawHeightMarkers = function() {
    // Create a bitmap the same size as the stage
    var bitmap = this.game.add.bitmapData(this.game.width, this.game.height);

    // These functions use the canvas context to draw lines using the canvas API
    for(y = this.game.height-32; y >= 64; y -= 32) {
        bitmap.context.beginPath();
        bitmap.context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        bitmap.context.moveTo(0, y);
        bitmap.context.lineTo(this.game.width, y);
        bitmap.context.stroke();
    }

    this.game.add.image(0, 0, bitmap);
};

// The update() method is called every frame
GameState.prototype.update = function() {
    // Collide the player with the ground

    this.enemies.forEach(function(enemy) {
        this.game.physics.arcade.collide(enemy, this.ground);

        if (enemy.body.touching.down) {
            enemy.body.acceleration.x = enemy.sideToGo * this.ACCELERATION;
        }


    }, this);



    this.powerups.forEach(function(powerup) {
        this.game.physics.arcade.collide(powerup, this.ground);

        if (powerup.body.touching.down) {
            powerup.body.acceleration.x = powerup.sideToGo * this.ACCELERATION;
        }


    }, this);





    if (game.time.now > enemyTime)
    {
        this.enemies.add(this.addEnemy());
        enemyTime = game.time.now + enemyIntervals;
    }

    if (game.time.now > powerupTime)
    {
        this.powerups.add(this.addPowerup());
        powerupTime = game.time.now + powerupIntervals;
    }

    if (game.time.now > 8000) {
        powerupIntervals = 8000;
    }




    if (game.physics.arcade.collide(this.player, this.enemies, collisionHandler, processHandler, this))
    {
        console.log('boom');
        playerSize-= 0.5;

//        this.player.scale.setTo(0.05,0.05 * playerSize);
        game.add.tween(this.player.scale).to( { x: 0.05 * playerSize, y: 0.05 * playerSize}, 500, Phaser.Easing.Linear.None, true);

        //    this.player.y = this.game.height - 164 * playerSize;

        if (playerSize <= 0) {
            game.paused = true;
setTimeout(() => {
    game.paused = false;
            this.game.state.start("game");
},
1 * 1000);
            //
        }
    }


    if (game.physics.arcade.collide(this.player, this.powerups, collisionHandler2, processHandler2, this))
    {
        console.log(this.player.scale)
        playerSize+= 0.5;
        //this.player.scale.setTo(0.05,0.05 * playerSize);    this.player.anchor.setTo(0.5, 0.5);
       // this.add.tween(this.player.scale).to({ x: 0.05, y: 0.05 * playerSize, type: 25});
        console.log(this.player.scale)
        game.add.tween(this.player.scale).to( { x: 0.05 * playerSize, y: 0.05 * playerSize}, 500, Phaser.Easing.Linear.None, true);

         // this.player.y = this.game.height - 164 * playerSize;
    }

    function processHandler (player, veg) {

        return true;

    }

    function processHandler2 (player, veg) {

        return true;

    }

    function collisionHandler (player, veg) {
        veg.kill();


        // veg.kill();

    }

    function collisionHandler2 (player, veg) {


         veg.kill();

    }
    this.game.physics.arcade.collide(this.player, this.ground);
    if (this.leftInputIsActive()) {
        // If the LEFT key is down, set the player velocity to move left
        this.player.body.acceleration.x = -this.ACCELERATION;
    } else if (this.rightInputIsActive()) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player.body.acceleration.x = this.ACCELERATION;
    } else {
        this.player.body.acceleration.x = 0;
    }

    // Set a variable that is true when the player is touching the ground
    var onTheGround = this.player.body.touching.down;

    if (onTheGround && this.upInputIsActive()) {
        // Jump when the player is touching the ground and the up arrow is pressed
        this.player.body.velocity.y = this.JUMP_SPEED;
    }

};


var playerSize = 1;
var enemyTime = 4000;
var enemiesToIgnore = 2;
var enemyIntervals = 3000;
var powerupTime = 0;
var powerupIntervals = 2000;

function initGlobals() {
    playerSize = 1;
    enemyTime = 4000;
    enemiesToIgnore = 2;
    enemyIntervals = 3000;
    powerupTime = 0;
    powerupIntervals = 2000;
}

// This function should return true when the player activates the "go left" control
// In this case, either holding the right arrow or tapping or clicking on the left
// side of the screen.
GameState.prototype.leftInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x < this.game.width/4);

    return isActive;
};

// This function should return true when the player activates the "go right" control
// In this case, either holding the right arrow or tapping or clicking on the right
// side of the screen.
GameState.prototype.rightInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
};

// This function should return true when the player activates the "jump" control
// In this case, either holding the up arrow or tapping or clicking on the center
// part of the screen.
GameState.prototype.upInputIsActive = function(duration) {
    var isActive = false;

    isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
    isActive |= (this.game.input.activePointer.justPressed(duration + 1000/60) &&
    this.game.input.activePointer.x > this.game.width/4 &&
    this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);

    return isActive;
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);
