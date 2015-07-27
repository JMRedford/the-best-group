// Fireball object that has adding/removing methods plus the storage object for tracking whats what
// This was originally built out a bit more to track everything by ID, could be re-expanded fairly easily
window.fireballs = {
  fbID: 0,
  getID: function() {
    this.fbID++;
    if (this.fbID>99) {
      this.fbID=0;
    }
    return this.fbID;
  },
  addFireball: function (fbLoc) {
     this.storage[this.getID()] = Crafty.e('Fireball')
    .at(fbLoc[0],fbLoc[1]);
  },
  addPlayerFireball: function (fbLoc) {
     this.storage[this.getID()] = Crafty.e('playerFireball')
    .at(fbLoc[0],fbLoc[1]);
  },
  clearFireballs: function(){
    Crafty("Fireball").each(function(i){
      this.destroy();
    });
    Crafty("playerFireball").each(function(i){
      this.destroy();
    });
    this.storage = {};
  },

  storage: {}
};

window.healthBar = {
  storage: [],
  clearHealthBar: function (){
    for (var i = 0; i < this.storage.length; i++){
      this.storage[i].destroy();
    }
  },
  drawHealthBar: function(health, playerLoc){
    var xStart = playerLoc[0]*32;
    var yStart = playerLoc[1]*32;
    //health bar is made of red and white squares at a location
    // relative to the player
    for (var i = 0; i < 10; i++){
      this.storage[i] = Crafty.e('2D, Canvas, Color').attr({
        x: xStart - 10 + 5*i,
        y: yStart - 20,
        w: 5,
        h: 5
      }).color('white');
      this.storage[i].z = 1;
      if (i < health) {
        this.storage[i].color('red');
      } else {
        this.storage[i].color('white');
      }
    }
    
  }
}

// Enemies object that works the same way as the fireball object above
window.enemies = {
  enemiesNum: 0,

  addEnemy: function(enemy){
    this.storage[this.enemiesNum++] = Crafty.e('Enemy')
    .at(enemy[0],enemy[1]);
  },
  clearEnemies: function() {
    Crafty("Enemy").each(function(i){
      this.destroy();
    });

    this.storage = {};
    this.enemiesNum = 0;
  },
  storage: {}
};

window.players = {
  playerNum: 0,
  addPlayer: function(player) {
    this.storage[this.playerNum++] = Crafty.e('OtherPlayer')
    .at(player[0], player[1])
  },
  clearPlayers: function() {
    Crafty("OtherPlayer").each(function(i){
      this.destroy();
    });
    this.storage = {};
    this.playerNum = 0;
  }
}

// default player values, only exist to be updated by server
window.userID = 23;
window.playerStartLoc = [5,5];

// The array used to temporarily store new fireballs created by player
// before they are sent to server
window.newFireballs = [];

Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  50,
    height: 50,
    tile: {
      width:  32,
      height: 32
    }
  },

  rocks : [],

  // The total width of the game screen. Since the grid takes up the entire screen
  //  this is just the width of a tile times the width of the grid
  width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },

  // The total height of the game screen. Since the grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },

  // Initialize and start the game
  start: function(data) {
    // Start crafty and set a background color
    // get width, height, rock positions from data

    this.map_grid.width  = data.borderX;
    this.map_grid.height = data.borderY;
    // this.rocks  = data.staticObjects;
    playerStartLoc = [data.playerStartX, data.playerStartY];
    window.userID = data.pId;

    Crafty.init(20*32, 20*32);
    //Crafty.background('url(sprites/landscape.png) fixed' );
    Crafty.scene('Loading', data);
  }
};
