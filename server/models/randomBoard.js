// This file handles creation of the random 'island' board (with MATH!)

var exports = module.exports = {};

exports.boardSize = 50;

exports.boardArray = [];

for (var i = 0; i < exports.boardSize; i++){
  exports.boardArray.push([]);
  for (var j = 0; j < exports.boardSize; j++){
    exports.boardArray[i].push(' ');
  }
}

var forSpiral = function(p,sqMatrix,callback){
  var n = sqMatrix.length;
  if (p > Math.ceil(n/2)) return null;

  //top row
  for (var i = p-1; i <= n-p; i++){
    callback(sqMatrix,p-1,i);
  }
  //right side
  for (var i = p; i <= n-p; i++){
    callback(sqMatrix,i,n-p);
  }
  //bottom
  for (var i = n-p-1; i >= p-1; i--){
    callback(sqMatrix,n-p,i);
  }
  //left side
  for (var i = n-p-1; i >= p-1; i--){
    callback(sqMatrix,i,p-1);
  }
}

for (var i = 1; i < 10; i++){
  forSpiral(i,exports.boardArray, function(array,row,col){
    array[row][col] = 'w';
  })
}

for (var i = 10; i < 15; i++){
  forSpiral(i,exports.boardArray, function(array,row,col){
    array[row][col] = 'w';
    if (row === i-1 && array[row-1][col] === 's') {
      array[row][col] = 's';
    } else if (col === exports.boardSize-i && array[row][col+1] === 's') {
      array[row][col] = 's';   
    } else if (row === exports.boardSize-i && array[row+1][col] === 's') {
      array[row][col] = 's';
    } else if (col === i-1 && array[row][col-1] === 's') {
      array[row][col] = 's';
    } else if (Math.random() < 0.3){
      array[row][col] = 's';
    }
  });
  forSpiral(i,exports.boardArray, function(array,row,col){
    if (row === i-1 && 
        array[row][col-1] && 
        array[row][col+1] === 's') {
      array[row][col] = 's';
    } else if (col === exports.boardSize-i && 
               array[row-1][col] === 's' &&
               array[row+1][col] === 's') {
      array[row][col] = 's';   
    } else if (row === exports.boardSize-i && 
               array[row][col-1] === 's' &&
               array[row][col+1]) {
      array[row][col] = 's';
    } else if (col === i-1 && 
               array[row+1][col] === 's' &&
               array[row-1][col] === 's') {
      array[row][col] = 's';
    }
  });
}

forSpiral(15,exports.boardArray, function(array,row,col){
  array[row][col] = 's';
})

for (var i = 16; i <= exports.boardSize/2; i++){
  forSpiral(i,exports.boardArray, function(array,row,col){
    array[row][col] = 's';
    if (row === i-1 && array[row-1][col] === 'g') {
      array[row][col] = 'g';
    } else if (col === exports.boardSize-i && array[row][col+1] === 'g') {
      array[row][col] = 'g';   
    } else if (row === exports.boardSize-i && array[row+1][col] === 'g') {
      array[row][col] = 'g';
    } else if (col === i-1 && array[row][col-1] === 'g') {
      array[row][col] = 'g';
    } else if (Math.random() < 0.3){
      array[row][col] = 'g';
    }
  });
  forSpiral(i,exports.boardArray, function(array,row,col){
    if (row === i-1 && 
        array[row][col-1] && 
        array[row][col+1] === 'g') {
      array[row][col] = 'g';
    } else if (col === exports.boardSize-i && 
               array[row-1][col] === 'g' &&
               array[row+1][col] === 'g') {
      array[row][col] = 'g';   
    } else if (row === exports.boardSize-i && 
               array[row][col-1] === 'g' &&
               array[row][col+1]) {
      array[row][col] = 'g';
    } else if (col === i-1 && 
               array[row+1][col] === 'g' &&
               array[row-1][col] === 'g') {
      array[row][col] = 'g';
    }
  });
}