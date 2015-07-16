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
  Crafty.load(['sprites/gokuSprite.png'], function(){
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

    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  })
});



// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  // A 2D array to keep track of all occupied tiles
  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) {
      this.occupied[i][y] = false;
    }
  }

  // Player character, placed at 5, 5 on our grid
  this.player = Crafty.e('PlayerCharacter').at(5, 5);
  this.occupied[this.player.at().x][this.player.at().y] = true;

  for (var rock = 0; rock < Game.rocks.length;  rock++) {
      Crafty.e('Rock').at(Game.rocks[rock].loc[0], Game.rocks[rock].loc[1])
  }

  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;

      if (at_edge) {
        // Place a tree entity at the current tile
        Crafty.e('Boundary').at(x, y);
        this.occupied[x][y] = true;
      }
    }
  }
});
