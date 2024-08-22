// script.js

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const currentScoreElement = document.getElementById("currentScoreValue");
const bestScoreElement = document.getElementById("bestScoreValue");
const timePassedElement = document.getElementById("timePassedValue");
const enterToStartElement = document.getElementById("start");
const hightScoreElement = document.getElementById("highScore");

let gameStarted = false;
let startingTime;
let time = 0;
let currentScore = 0;
let bestScore = localStorage.getItem("bestScore");

if (bestScore === null) {
  bestScore = 0;
} else {
  bestScore = parseInt(bestScore);
}

bestScoreElement.innerText = bestScore;
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
    this.jumpUp = true;
    this.jumpHeight = 10;
    this.jumpCounter = 0;
  }

  draw() {
    this.jump();
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

  jump() {
    if (this.shouldJump) {
      this.jumpCounter++;
      if (this.jumpCounter < 30) {
        //Go up
        this.y -= this.jumpHeight;
      } else if (this.jumpCounter > 29 && this.jumpCounter < 35) {
        this.y += 0;
      } else if (this.jumpCounter < 64) {
        //Come back down
        this.y += this.jumpHeight;
      }
      //End the cycle
      if (this.jumpCounter >= 63) {
        this.shouldJump = false;
      }
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

function blockColliding(player, block) {
  let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
  let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
  s2.width -= 55;
  return !(
    (
      s1.x > s2.x + s2.width || // r1 is to right of r2
      s1.x + 105 < s2.x || // r1 to the left of r2
      s1.y > s2.y + s2.height || // r1 is below r2
      s1.y + 100 < s2.y
    ) // r1 is above r2
  );
}

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
        getRandomNumber(30, 45),
        getRandomNumber(50, 120),
        enemySpeed,
        false
      )
    );
  }
  enemySpeed += enemySpeed * 0.02;
  setTimeout(generateBlocks, timeDelay);
}

let animationId = null;

function startGame() {
  hightScoreElement.style.display = "none";
  enterToStartElement.style.display = "none";
  startingTime = Date.now();
  gameStarted = true;
  arrayBlocks = [];
  player = new Player(5, 415);
  if (currentScore != 0) {
    requestAnimationFrame(animate);
  }
  currentScore = 0;
}

function gameEnded() {
  gameStarted = false;
  time = 0;
  enterToStartElement.style.display = "block";
  enterToStartElement.innerText = "PRESS ENTER TO PLAY AGAIN";
  if (currentScore > bestScore) {
    bestScore = currentScore;
    localStorage.setItem("bestScore", bestScore);
    bestScoreElement.innerText = bestScore;
  }
}
function updateTimePassed() {
  const timePassed = Math.floor((Date.now() - startingTime) / 1000);
  timePassedElement.innerText = `${timePassed} s`;
}

function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackgroundLine();
  if (gameStarted) {
    currentScore += 1 + currentScore * 0.1 * time;
    if (currentScore > bestScore && bestScore != 0) {
      hightScoreElement.style.display = "block";
    }
    currentScoreElement.innerText = Math.floor(currentScore);
    updateTimePassed();
    arrayBlocks.forEach((element, index) => {
      element.slide();
      if (blockColliding(player, element)) {
        cancelAnimationFrame(animationId);
        gameEnded();
      }
      // Delete block that has left the screen
      if (arrayBlocks.x + arrayBlocks.width <= 0) {
        setTimeout(() => {
          arrayBlocks.splice(index, 1);
        }, 0);
      }
    });
  }

  player.draw();
}
animate();

setTimeout(() => {
  generateBlocks();
}, 2000);

//Event Listeners
addEventListener("keydown", (e) => {
  if (e.code === "Space" && gameStarted) {
    if (!player.shouldJump) {
      player.jumpCounter = 0;
      player.shouldJump = true;
    }
  }
  if (e.code === "Enter") {
    if (!gameStarted) {
      startGame();
    }
  }
});

addEventListener("mousedown", (e) => {
  if (e.button === 0 && gameStarted) {
    if (!player.shouldJump) {
      player.jumpCounter = 0;
      player.shouldJump = true;
    }
  }
});
