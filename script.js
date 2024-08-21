// script.js

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let currentScore = 0;
let bestScore = 0;

let enemySpeed = 3;
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// player class
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.shouldJump = false;
    this.jumpCounter = 0;
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
    }
  }
}

function drawBlock(ctx, x, y, width, height) {
  const blockArray = [
    [0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0],
    [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 0],
    [2, 2, 3, 3, 1, 1, 1, 3, 3, 3, 3, 3, 3, 2, 2],
    [2, 3, 3, 1, 1, 3, 1, 1, 1, 1, 3, 3, 3, 3, 2],
    [2, 3, 1, 1, 3, 1, 1, 1, 1, 3, 3, 1, 1, 3, 2],
    [2, 3, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 1, 3, 2],
    [2, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 2],
    [2, 3, 1, 3, 3, 1, 1, 1, 1, 1, 3, 1, 1, 3, 2],
    [2, 3, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 2],
    [2, 3, 3, 3, 1, 1, 1, 3, 1, 1, 1, 3, 3, 3, 2],
    [2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2],
    [0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
  ];

  var blockX = x; // Starting X position for the block
  var blockY = y; // Starting Y position for the block
  var pixelWidth = width / blockArray[0].length; // Calculate pixel width based on desired width
  var pixelHeight = height / blockArray.length; // Calculate pixel height based on desired height

  for (var i = 0; i < blockArray.length; i++) {
    for (var j = 0; j < blockArray[i].length; j++) {
      // Determine the color based on the number
      if (blockArray[i][j] === 0) {
        ctx.fillStyle = "yellow"; // Black
      } else if (blockArray[i][j] === 1) {
        ctx.fillStyle = "#FFFFFF"; // White (for the question mark)
      } else if (blockArray[i][j] === 2) {
        ctx.fillStyle = "#FFD700"; // Gold (for the block's outline)
      } else if (blockArray[i][j] === 3) {
        ctx.fillStyle = "#FFA500"; // Orange (for the block's fill)
      }

      // Draw the pixel with dynamic size
      ctx.fillRect(blockX, blockY, pixelWidth, pixelHeight);

      // Move to the next position on the X axis
      blockX += pixelWidth;
    }

    // Reset X position and move down on the Y axis
    blockX = x;
    blockY += pixelHeight;
  }
}

class AvoidBlock {
  constructor(width, height, speed, isTop) {
    this.x = canvas.width + width;
    this.y = isTop ? 0 : 500 - height;
    this.width = width;
    this.height = height;
    this.blockSpeed = speed;
  }
  draw() {
    drawBlock(ctx, this.x, this.y, this.width, this.height);
  }

  slide() {
    this.draw();
    this.x -= this.blockSpeed;
  }
}

let player = new Player(5, 415);

// add sound effects here

// functions

function drawBackgroundLine() {
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.lineTo(900, 500);
  ctx.lineWidth = 1.9;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

let arrayBlocks = [];

function generateBlocks() {
  let timeDelay = getRandomNumber(500, 2000);
  if (Math.random() < 0.2) {
    arrayBlocks.push(
      new AvoidBlock(
        getRandomNumber(30, 70),
        getRandomNumber(250, 400),
        enemySpeed,
        true
      )
    );
  } else {
    arrayBlocks.push(
      new AvoidBlock(
        getRandomNumber(30, 70),
        getRandomNumber(50, 150),
        enemySpeed,
        false
      )
    );
  }
  setTimeout(generateBlocks, timeDelay);
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackgroundLine();
  arrayBlocks.forEach((element) => {
    element.slide();
  });
  player.draw();
}

animate();

setTimeout(() => {
  generateBlocks();
}, getRandomNumber(500, 2000));
