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
  clearFireballs: function(){
    Crafty("Fireball").each(function(i){
      this.destroy();
    });

    this.storage = {};
  },

  storage: {}
};

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

window.userID = 23;
window.newFireballs = [];
window.playerStartLoc = [5,5];

Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  20,
    height: 20,
    tile: {
      width:  32,
      height: 32
    }
  },

  rocks : [],

  // The total width of the game screen. Since our grid takes up the entire screen
  //  this is just the width of a tile times the width of the grid
  width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },

  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },

  // Initialize and start our game
  start: function(data) {
    // Start crafty and set a background color
    // get width, height, rock positions from data

    this.map_grid.width  = data.borderX;
    this.map_grid.height = data.borderY;
    this.rocks  = data.staticObjects;
    playerStartLoc = [data.playerStartX, data.playerStartY];
    userID = data.pid;

    Crafty.init(Game.width(), Game.height());
    //Crafty.background('url(sprites/landscape.png) fixed' );
    Crafty.scene('Loading');
  }
};
