// script.js

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// player class

class Player {
  constructor(x, y) {
    (this.x = x), (this.y = y);
  }

  draw() {
    var marioArray = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0],
      [0, 0, 0, 3, 3, 3, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 3, 1, 3, 3, 1, 1, 1, 1, 3, 1, 1, 1, 0, 0, 0],
      [0, 0, 3, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 2, 2, 2, 4, 2, 2, 4, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 2, 2, 2, 4, 2, 2, 4, 2, 2, 2, 0, 0, 0, 0, 0],
      [2, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 0, 0, 0, 0],
      [1, 1, 1, 2, 4, 1, 4, 4, 1, 4, 2, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
      [0, 0, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0],
      [0, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    //starting position
    var xPos = this.x;
    var yPos = this.y;

    for (var i = 0; i < marioArray.length; i++) {
      for (var r = 0; r < marioArray[i].length; r++) {
        ctx.fillRect(xPos, yPos, 5, 5);
        //black
        if (marioArray[i][r] === 0) {
          ctx.fillStyle = "transparent";
        }
        //flesh
        if (marioArray[i][r] === 1) {
          ctx.fillStyle = "#FFCC66";
        }
        //red
        if (marioArray[i][r] === 2) {
          ctx.fillStyle = "#FF0000";
        }
        //brown
        if (marioArray[i][r] === 3) {
          ctx.fillStyle = "#663300";
        }
        //blue
        if (marioArray[i][r] === 4) {
          ctx.fillStyle = "#66CCFF";
        }
        //move over 5px
        xPos += 5;
      } //end internal for loop
      //once ctx reaches end on canvas reset xPos to 0
      xPos = 50;
      //move down 5px
      yPos += 5;
    } //end
  }
}
let player = new Player(5, 415);

// add sound effects here

// functions

function drawBackgroundLine() {
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.lineTo(800, 500);
  ctx.lineWidth = 1.9;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackgroundLine();
  player.draw();
}

animate();
