window.fireballs = {
  fbID: 0,
  getID: function() {
    this.fbID++
    if (this.fbID>99) {
      this.fbID=0;
    }
    return this.fbID;
  },
  addFireball: function (craftyObj, ID) {
    this.storage[ID] = craftyObj;
  },
  removeFireball: function (ID){
    this.storage[ID].destroy();
    delete this.storage[ID];
  },

  storage: {}
};

window.userID = 23;
window.enemies = {};
window.newFireballs = [];

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
    // Start crafty and set a background color so that we can see it's working


    // get width, height, rock positions from data

    this.map_grid.width  = data.borderX;
    this.map_grid.height = data.borderY;
    this.rocks  = data.staticObjects;

    Crafty.init(Game.width(), Game.height());
    Crafty.background('rgb(249, 223, 125)');

    Crafty.scene('Loading');
  }
}
