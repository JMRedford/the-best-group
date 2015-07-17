
// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: Math.floor(x * Game.map_grid.tile.width), y: Math.floor(y * Game.map_grid.tile.height) });
      return this;
    }
  }
});


Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  }
});

Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, downWalk1, Collision')
      .fourway(4)
      .stopOnSolids()

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

Crafty.c('Boundary', {
  init: function() {
    this.requires('Actor, Color, Solid')
    .color('rgb(20, 125, 40)');
  }
});


Crafty.c('Rock', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 185, 40)');
  }
});

