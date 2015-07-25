// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(data){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() });
  // Load our sprite map image
  Crafty.load({"images":['sprites/gokuSprite.png', 
                         'sprites/FB.png',
                         "sprites/rock.png", 
                         "sprites/mountain.png", 
                         "sprites/Water.png", 
                         "sprites/Sand.png", 
                         "sprites/Grass.png",
                         "sprites/blueEnergy.png"]}, function(){

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

    Crafty.scene('Game',data);
  });
});



// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function(data) {

  console.log('started game scene');

  window.board = []
  window.boardCtr = 0;
    
  for (var i = 0; i < data.board.length; i++){
    for (var j = 0; j < data.board[i].length; j++){
      if (data.board[i][j] === 'w'){
        window.board[boardCtr++] = Crafty.e('Water').at(i,j);
      } else if (data.board[i][j] === 's'){
        window.board[boardCtr++] = Crafty.e('Sand').at(i,j);
      } else if (data.board[i][j] === 'g'){
        window.board[boardCtr++] = Crafty.e('Grass').at(i,j);
      }
    }
  }

  // window.bg = Crafty.e("2D, Canvas, Image")
  // .attr({w: 1000, h: 1000})
  // .image("sprites/landscape.png", "repeat");

  console.log('making player');
  window.player = Crafty.e('PlayerCharacter, SpriteAnimation, down').at(playerStartLoc[0], playerStartLoc[1]);
  Crafty.viewport.follow(window.player,0,0)
  Crafty.viewport.clampToEntities = true;
  player.direction = 'down';

  player.bind('NewDirection', function(e) {
    if (e.x === 0 && e.y === 0) { this.animate(player.direction); }
    if (e.y < 0) {
      player.direction = 'up';
      this.animate('walkUp', -1);
    }
    if (e.y > 0) {
      player.direction = 'down';
      this.animate('walkDown', -1);
    }
    if (e.x < 0) {
      player.direction = 'left';
      this.animate('walkLeft', -1);
    }
    if (e.x > 0) {
      player.direction = 'right';
      this.animate('walkRight', -1);
    }
  });

  player.bind('KeyDown', function(e) {
    if (e.key === Crafty.keys.SPACE) {
      var ID = userID + ',' + fireballs.getID();
      var fbDir = '';
      if (this._movement.y === 0 && this._movement.x === 0) { fbDir = player.direction; } 
      if (this._movement.y < 0) { fbDir += 'up'; }
      if (this._movement.y > 0) { fbDir += 'down'; }
      if (this._movement.x < 0) { fbDir += 'left'; }
      if (this._movement.x > 0) { fbDir += 'right'; }
      newFireballs.push({t: Date.now(), loc: [player.at().x, player.at().y], ID: ID, dir: fbDir});
    }
  });

});

// GameOver Scene: Shows Background Image and text telling user they lost and how to play again or logout
Crafty.scene('GameOver', function() {
  
  Crafty.e("2D, Canvas, Image")
  .attr({w: 1000, h: 1000})
  .image("sprites/landscape.png", "repeat");
  
  var text1 = Crafty.e("2D, Canvas, Text").textFont({ size: '40px', weight: 'bold' })
              .text('Game Over')
              .attr({x:Game.width()/2, y: Game.height()/2-50, w: Game.width() });

  var text2 = Crafty.e("2D, Canvas, Text").textFont({ size: '20px', weight: 'bold' })
              .text("ESC to logout, Enter to play again")
              .attr({x:Game.width()/2, y: Game.height()/2, w: Game.width() });
  
  Crafty.viewport.follow(text1,Game.width()/2,0);
  Crafty.viewport.scale(0.65);
  
  text1.requires('Keyboard')
  .bind('KeyDown', function (e) { 
    if (e.key === Crafty.keys.ENTER) {
      Crafty.scene('Loading');
    }
    else if (e.key === Crafty.keys.ESC) {
      // Logout 
    }
   });
});

