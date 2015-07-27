// This File defines all of the 'Components' used by Crafty (think of them as kinda like classes)


// This Grid component is the basis of the coordinate system used to place everything in the scene
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    });
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height };
    } else {
      this.attr({ x: Math.floor(x * Game.map_grid.tile.width), y: Math.floor(y * Game.map_grid.tile.height) });
      return this;
    }
  }
});


// An "Actor" is an entity that is drawn in 2D on canvas
//  via the coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  }
});


// The player's character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, Collision, down, SpriteAnimation')
      .fourway(4)
      .stopOnSolids()
      .reel("walkDown", 500, 1, 0, 2)
      .reel("walkLeft", 500, 1, 3, 2)
      .reel("walkRight", 500, 1, 2, 2)
      .reel("walkUp", 500, 1 , 1, 2)
      .reel('up', 1, 0, 1, 1)
      .reel('down', 1, 0, 0, 1)
      .reel('right', 1, 0, 2, 1)
      .reel('left', 1, 0, 3, 1);


  },

  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);

    return this;
  },
  // Stops the movement
  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },

});


// Mountains used for outer boundaries (originally)
Crafty.c('Boundary', {
  init: function() {
    this.requires('Actor, Color, Solid, Image')
    .image('sprites/mountain.png');
  }
});

// Plain old static rock
Crafty.c('Rock', {
  init: function() {
    this.requires('Actor, Solid, Image')
    .image("sprites/rock.png");
  }
});

// The enemy sprites
Crafty.c('Enemy', {
  init: function() {
    this.requires('Actor, Image')
      .image('sprites/Enemy.png');
  }
});

// (Enemy) fireballs
Crafty.c('Fireball', {
  init: function() {
    this.requires('Actor, SpriteAnimation, Collision, FBdown1').destroyOnSolids();
    this.reel('flyRight', 500, 0, 2, 3);
    this.reel('flyDown', 500, 0, 0, 3);
    this.reel('flyLeft', 500, 0, 1, 3);
    this.reel('flyUp', 500, 0, 3, 3);
  },

  destroyOnSolids: function(){
    this.onHit('Solid', this.destroy);
  }
});

// Player projectiles
Crafty.c('playerFireball', {
  init: function() {
    this.requires('Actor, Collision, Image')
    .image('sprites/blueEnergy.png');
    this.destroyOnSolids();
  },

  destroyOnSolids: function(){
    this.onHit('Solid', this.destroy);
  }
});

// Water tile
Crafty.c('Water', {
  init: function() {
    this.requires('Actor, Solid ,Image')
      .image('sprites/Water.png');
    this.z = -1;
  }
});

// Sandy Beach tile
Crafty.c('Sand', {
  init: function() {
    this.requires('Actor, Image')
      .image('sprites/Sand.png');
    this.z = -1;
  }
});

// Grass tile
Crafty.c('Grass', {
  init: function() {
    this.requires('Actor, Image')
      .image('sprites/Grass.png');
    this.z = -1;
  }
});



