var level = {
  x: 250,
  y: 113,
  columns: 8, // Width
  rows: 8,    // Height
  tileWidth: 40,
  tileHeight: 40,
  tiles: [],
  selectedTile: { selected: false, column: 0, row: 0 }
};

// Values for level.tiles[i][j].type
var tileColors = [[255, 128, 128],
[128, 255, 128],
[128, 128, 255],
[255, 255, 128],
[255, 128, 255],
[128, 255, 255],
[255, 255, 255]];

// Array of clusters
var clusters = [];  // { column, row, length, horizontal }

// Create tiles
function init() {
  // Initialize the two-dimensional tile array
  for (var i = 0; i < level.columns; i++) {
    level.tiles[i] = [];
    for (var j = 0; j < level.rows; j++) {
      // Define a tile type and a shift parameter for animation
      level.tiles[i][j] = { type: 0, shift: 0 }
    }
  }
}

// Create valid game board
function createLevel() {
  // var done = false;

  // Keep generating levels until it is correct
  // while (!done) {

    // Create a level with random tiles
    for (var i = 0; i < level.columns; i++) {
      for (var j = 0; j < level.rows; j++) {
        level.tiles[i][j].type = getRandomTile();
      }
    }

    // // Resolve the clusters
    // resolveClusters();

    // // Check if there are valid moves
    // findMoves();

    // Done when there is a valid move
    // if (moves.length > 0) {
    //   done = true;
    // }
  // }
}

function getRandomTile() {
  return Math.floor(Math.random() * tileColors.length);
}

// Remove clusters and insert tiles
function resolveClusters() {
  // Check for clusters
  findClusters();

  // While there are clusters left
  while (clusters.length > 0) {

    // Remove clusters
    removeClusters();

    // Shift tiles
    shiftTiles();

    // Check if there are clusters left
    findClusters();
  }
}

// Find clusters in the level
function findClusters() {
  // Reset clusters
  clusters = []

  // Find horizontal clusters
  for (var j = 0; j < level.rows; j++) {
    // Start with a single tile, cluster of 1
    var matchLength = 1;
    for (var i = 0; i < level.columns; i++) {
      var checkCluster = false;

      if (i == level.columns - 1) {
        // Last tile
        checkCluster = true;
      } else {
        // Check the type of the next tile
        if (level.tiles[i][j].type == level.tiles[i + 1][j].type &&
          level.tiles[i][j].type != -1) {
          // Same type as the previous tile, increase matchLength
          matchLength += 1;
        } else {
          // Different type
          checkCluster = true;
        }
      }

      // Check if there was a cluster
      if (checkCluster) {
        if (matchLength >= 3) {
          // Found a horizontal cluster
          clusters.push({
            column: i + 1 - matchLength, row: j,
            length: matchLength, horizontal: true
          });
        }

        matchLength = 1;
      }
    }
  }

  // Find vertical clusters
  for (var i = 0; i < level.columns; i++) {
    // Start with a single tile, cluster of 1
    var matchLength = 1;
    for (var j = 0; j < level.rows; j++) {
      var checkCluster = false;

      if (j == level.rows - 1) {
        // Last tile
        checkCluster = true;
      } else {
        // Check the type of the next tile
        if (level.tiles[i][j].type == level.tiles[i][j + 1].type &&
          level.tiles[i][j].type != -1) {
          // Same type as the previous tile, increase matchLength
          matchLength += 1;
        } else {
          // Different type
          checkCluster = true;
        }
      }

      // Check if there was a cluster
      if (checkCluster) {
        if (matchLength >= 3) {
          // Found a vertical cluster
          clusters.push({
            column: i, row: j + 1 - matchLength,
            length: matchLength, horizontal: false
          });
        }

        matchLength = 1;
      }
    }
  }
}

// Array of moves
var moves = [];     // { column1, row1, column2, row2 }

// Swap two tiles in the level
function swap(x1, y1, x2, y2) {
  var typeswap = level.tiles[x1][y1].type;
  level.tiles[x1][y1].type = level.tiles[x2][y2].type;
  level.tiles[x2][y2].type = typeswap;
}

// Find available moves
function findMoves() {
  // Reset moves
  moves = []

  // Check horizontal swaps
  for (var j = 0; j < level.rows; j++) {
    for (var i = 0; i < level.columns - 1; i++) {
      // Swap, find clusters and swap back
      swap(i, j, i + 1, j);
      findClusters();
      swap(i, j, i + 1, j);

      // Check if the swap made a cluster
      if (clusters.length > 0) {
        // Found a move
        moves.push({ column1: i, row1: j, column2: i + 1, row2: j });
      }
    }
  }

  // Check vertical swaps
  for (var i = 0; i < level.columns; i++) {
    for (var j = 0; j < level.rows - 1; j++) {
      // Swap, find clusters and swap back
      swap(i, j, i, j + 1);
      findClusters();
      swap(i, j, i, j + 1);

      // Check if the swap made a cluster
      if (clusters.length > 0) {
        // Found a move
        moves.push({ column1: i, row1: j, column2: i, row2: j + 1 });
      }
    }
  }

  // Reset clusters
  clusters = []
}

// Remove the clusters
function removeClusters() {
  // Change the type of the tiles to -1, indicating a removed tile
  loopClusters(function (index, column, row, cluster) { level.tiles[column][row].type = -1; });

  // Calculate how much a tile should be shifted downwards
  for (var i = 0; i < level.columns; i++) {
    var shift = 0;
    for (var j = level.rows - 1; j >= 0; j--) {
      // Loop from bottom to top
      if (level.tiles[i][j].type == -1) {
        // Tile is removed, increase shift
        shift++;
        level.tiles[i][j].shift = 0;
      } else {
        // Set the shift
        level.tiles[i][j].shift = shift;
      }
    }
  }
}

// Shift tiles and insert new tiles
function shiftTiles() {
  // Shift tiles
  for (var i = 0; i < level.columns; i++) {
    for (var j = level.rows - 1; j >= 0; j--) {
      // Loop from bottom to top
      if (level.tiles[i][j].type == -1) {
        // Insert new random tile
        level.tiles[i][j].type = getRandomTile();
      } else {
        // Swap tile to shift it
        var shift = level.tiles[i][j].shift;
        if (shift > 0) {
          swap(i, j, i, j + shift)
        }
      }

      // Reset shift
      level.tiles[i][j].shift = 0;
    }
  }
}

/*
//
// Simulation beginning
//
*/

init()
createLevel()

console.log(level.tiles)

// Check if there are moves available
// findMoves();

// if (moves.length > 0) {
//   // Get a random valid move
//   var move = moves[Math.floor(Math.random() * moves.length)];

//   // Simulate a player using the mouse to swap two tiles
//   mouseSwap(move.column1, move.row1, move.column2, move.row2);
// } else {
//   // No moves left, Game Over. We could start a new game.
//   // newGame();
// }


// var a = Array(5).fill(0).map(x => Array(10).fill(0))

// console.log(a)