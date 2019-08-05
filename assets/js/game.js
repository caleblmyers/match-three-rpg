// var tileTypes = [[0, "Red"],
// [1, "Blue"],
// [2, "Green"],
// [3, "Yellow"],
// [4, "Gold"],
// [5, "Purple"]];

var tileTypes = [0, 1, 2, 3, 4, 5];

function Level() {
  this.rows = 8;
  this.columns = 8;
  this.tileArray = [];
};

function Tile(i, j) {
  this.type = Math.floor(Math.random() * tileTypes.length);
  this.row = i;
  this.col = j;
};

Level.prototype.init = function () {
  for (let i = 0; i < level.rows; i++) {
    this.tileArray[i] = [];
    for (let j = 0; j < level.columns; j++) {
      this.tileArray[i][j] = new Tile(i, j);
    };
  };
};

Level.prototype.display = function () {
  for (let i = 0; i < level.rows; i++) {
    // var tileRow = ''
    for (let j = 0; j < level.columns; j++) {
      process.stdout.write(this.tileArray[i][j].type.toString())
      // tileRow += this.tileArray[i][j].type + "  "
    }
    process.stdout.write("\n")
    // console.log(tileRow)
  }
}

var level = new Level();

level.init();
level.display()
// console.log(level.tileArray);
// console.log(level.tileArray[3][4]);