// This file is all of the 'Scenes' used by crafty, which represent each 'state' 
// of the game the player sees

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(data){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
 Crafty.e('2D, DOM, Text')
    .text('Loading...').textFont({ size: '40px' })

  // Load the sprite map images
  Crafty.load({"images":['sprites/gokuSprite.png', 
                         'sprites/FB.png',
                         "sprites/rock.png", 
                         "sprites/mountain.png", 
                         "sprites/Water.png", 
                         "sprites/Sand.png", 
                         "sprites/Grass.png",
                         "sprites/blueEnergy.png",
                         "sprites/Krillin.png"]}, function(){

// These lines tell Crafty which squares in the sprite map are frames for which animations
    Crafty.sprite(32, 'sprites/gokuSprite.png', {
     down      :  [0, 0],
     downWalk1 :  [1, 0],
     downWalk2 :  [2, 0],
     up        :  [1, 0],
     upWalk1   :  [1, 1],
     upWalk2   :  [1, 2],
     right     :  [2, 0],
     rightWalk1:  [2, 1],
     rightWalk2:  [2, 2],
     left      :  [3, 0],
     leftWalk1 :  [3, 1],
     leftWalk2 :  [3, 2]
    });

    Crafty.sprite(32, 'sprites/FB.png', {
      FBdown1 :   [0,0],
      FBdown2 :   [0,1],
      FBdown3 :   [0,2],
      FBleft1 :   [1,0],
      FBleft2 :   [1,1],
      FBleft3 :   [1,2],
      FBright1:   [2,0],
      FBright2:   [2,1],
      FBright3:   [2,2],
      FBup1   :   [3,0],
      FBup2   :   [3,1],
      FBup3   :   [3,2]
    });

    Crafty.scene('Game',data);
  });
});



// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function(data) {

  console.log('started game scene');

  window.board = [];
  window.boardCtr = 0;

  // Data saved to window, to be used again in gameover scene and restart 
  window.data=data;
  
  // Sets the board to an array of tiles defined in the response to the '/start' GET request
  // Crafty.e establishes something as a Crafty entity (see Crafty documentation)
  window.setBoard = function() {
    for (var i = 0; i < window.data.board.length; i++){
      for (var j = 0; j < window.data.board[i].length; j++){
        if (window.data.board[i][j] === 'w'){
          window.board[boardCtr] = Crafty.e('Water').at(i,j);
          window.board[boardCtr++].z = 0; 
        } else if (window.data.board[i][j] === 's'){
          window.board[boardCtr] = Crafty.e('Sand').at(i,j);
          window.board[boardCtr++].z = 0;
        } else if (window.data.board[i][j] === 'g'){
          window.board[boardCtr] = Crafty.e('Grass').at(i,j);
          window.board[boardCtr++].z = 0;
        }
      }
    }
  };

  window.setBoard();

  // window.bg = Crafty.e("2D, Canvas, Image")
  // .attr({w: 1000, h: 1000})
  // .image("sprites/landscape.png", "repeat");

  console.log('making player');
  window.player = Crafty.e('PlayerCharacter, SpriteAnimation, down').at(playerStartLoc[0], playerStartLoc[1]);

  // Crafty's viewport system handles the scrolling
  Crafty.viewport.follow(window.player,0,0);
  Crafty.viewport.clampToEntities = true;
  player.direction = 'down';

  // This changes the player animation in response to direction events emitted by 
  // Crafty's keyboard control system: 'Fourway'
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

  // Handles creation of a new player fireball on SPACEBAR, including ID number based on userID 
  // and timestamp of when it was created so that it's current position can be accurately calculated server side
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
  
  window.setBoard();

  var text1 = Crafty.e("2D, Canvas, Text").textFont({ size: '40px', weight: 'bold' })
              .text('Game Over')
              .attr({x:Game.width()/2, y: Game.height()/2-50, w: Game.width() });

  var text2 = Crafty.e("2D, Canvas, Text").textFont({ size: '20px', weight: 'bold' })
              .text("ESC to logout, Enter to play again")
              .attr({x:Game.width()/2, y: Game.height()/2, w: Game.width() });
  
  // Makes sure the view is centered on the text "Game OVer"
  Crafty.viewport.follow(text1,Game.width()/2,0);
  Crafty.viewport.scale(0.45);
  
  // If Enter is pressed, restarts the game
  text1.requires('Keyboard')
  .bind('KeyDown', function (e) { 
    if (e.key === Crafty.keys.ENTER) {
     initBoard(window.data);
    }
   });
});

