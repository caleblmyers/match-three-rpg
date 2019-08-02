// var tileTypes = [[0, "Red"],
// [1, "Blue"],
// [2, "Green"],
// [3, "Yellow"],
// [4, "Gold"],
// [5, "Purple"]];

var tileTypes = [0, 1, 2, 3, 4, 5]

function Level() {
  this.col = 8;
  this.row = 8;
  this.tileArray = [];
};

function Tile() {
  this.type = tileTypes[Math.floor(Math.random() * tileTypes.length)];
};

Level.prototype.init = function () {
  for (let i = 0; i < level.col; i++) {
    this.tileArray[i] = []
    for (let j = 0; j < level.row; j++) {
      this.tileArray[i][j] = new Tile()
    }
  }
}

var level = new Level();

level.init()

console.log(level.tileArray)