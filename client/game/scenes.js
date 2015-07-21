// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files

Crafty.scene('Loading', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() });
  // Load our sprite map image
  Crafty.load({"images":['sprites/gokuSprite.png', 'sprites/FB.png',"sprites/rock.png", "sprites/mountain.png"]}, function(){
    // Once the image is loaded...

    // Define the individual sprites in the image
    // Each one (spr_tree, etc.) becomes a component
    // These components' names are prefixed with "spr_"
    //  to remind us that they simply cause the entity
    //  to be drawn with a certain sprite
    Crafty.sprite(32, 'sprites/gokuSprite.png', {
     down :         [0, 0],
     downWalk1 :    [1, 0],
     downWalk2 :    [2, 0],
     up  :          [1, 0],
     upWalk1   :    [1, 1],
     upWalk2   :    [1, 2],
     right:         [2, 0],
     rightWalk1:    [2, 1],
     rightWalk2:    [2, 2],
     left  :        [3, 0],
     leftWalk1 :    [3, 1],
     leftWalk2 :    [3, 2]
    });

    Crafty.sprite(32, 'sprites/FB.png', {
      FBdown1: [0,0],
      FBdown2: [0,1],
      FBdown3: [0,2],
      FBleft1: [1,0],
      FBleft2: [1,1],
      FBleft3: [1,2],
      FBright1: [2,0],
      FBright2: [2,1],
      FBright3: [2,2],
      FBup1: [3,0],
      FBup2: [3,1],
      FBup3: [3,2]
    });
    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  });
});



// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {

  console.log('started game scene');

  // Player character, placed at 5, 5 on our grid
  console.log('making player');
  window.player = Crafty.e('PlayerCharacter, SpriteAnimation, down').at(playerStartLoc[0], playerStartLoc[1]);
  player.direction = 'down';


  player.bind("KeyDown", function(e) {
    switch (e.key){
      case Crafty.keys.SPACE:
        var ID = userID + fireballs.getID();
        newFireballs.push({t: Date.now(), loc: [player.at().x, player.at().y], ID: ID, dir: player.direction});

        // switch(player.direction){
        //   case 'up':
        //     fireball.animate('flyUp',-1);
        //     break;
        //   case 'down':
        //     fireball.animate('flyDown',-1);
        //     break;
        //   case 'right':
        //     fireball.animate('flyRight',-1);
        //     break;
        //   case 'left':
        //     fireball.animate('flyLeft',-1);
        //     break;
        // }
        break;
      case Crafty.keys.UP_ARROW || Crafty.keys.W:
        this.animate('walkUp',-1);
        player.direction = 'up';
        break;
      case Crafty.keys.DOWN_ARROW || Crafty.keys.S:
        this.animate('walkDown',-1);
        player.direction = 'down';
        break;
      case Crafty.keys.LEFT_ARROW || Crafty.keys.A:
        this.animate('walkLeft',-1);
        player.direction = 'left';
        break;
      case Crafty.keys.RIGHT_ARROW || Crafty.keys.D:
        this.animate('walkRight',-1);
        player.direction = 'right';
        break;
    }

  });
  window.player.bind("KeyUp", function(e){
    switch (e.key){
      case Crafty.keys.UP_ARROW || Crafty.keys.W:
        this.animate('up');
        break;
      case Crafty.keys.DOWN_ARROW || Crafty.keys.S:
        this.animate('down');
        break;
      case Crafty.keys.LEFT_ARROW || Crafty.keys.A:
        this.animate('left');
        break;
      case Crafty.keys.RIGHT_ARROW || Crafty.keys.D:
        this.animate('right');
        break;
    }

  });



  for (var rock = 0; rock < Game.rocks.length;  rock++) {
      Crafty.e('Rock').at(Game.rocks[rock].loc[0], Game.rocks[rock].loc[1]);
  }

  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      var at_edge = x === 0 || x == Game.map_grid.width - 1 || y === 0 || y == Game.map_grid.height - 1;

      if (at_edge) {
        // Place a tree entity at the current tile
        Crafty.e('Boundary').at(x, y);
      }
    }
  }
});
