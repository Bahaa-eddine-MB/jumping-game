// script.js

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const currentScoreElement = document.getElementById("currentScoreValue");
const bestScoreElement = document.getElementById("bestScoreValue");
const timePassedElement = document.getElementById("timePassedValue");
const enterToStartElement = document.getElementById("start");
const hightScoreElement = document.getElementById("highScore");
const titleElement = document.getElementById("title");
const scoreboard = document.getElementById("scoreboard");

canvas.style.backgroundColor = "rgba(0, 0, 0, 0.6)";

let canScore = true;
let gameStarted = false;
let gameHasEnded = false
let startingTime;
let currentScore = 0;
let bestScore = localStorage.getItem("bestScore");
let animationId = null;

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


//SFX
let gameOverSFX = new Audio("./sounds/lost.mp3");
let jumpSFX = new Audio("./sounds/jump.mp3");
let gameMusicSFX = new Audio("./sounds/mario.mp3");
let newScoreSFX = new Audio("./sounds/high-score.mp3");
let startSFX = new Audio("./sounds/yeahoo.mp3");

gameMusicSFX.loop = true
newScoreSFX.loop = true

// functions

function drawBackgroundLine(isBlack) {
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.lineTo(900, 500);
  ctx.lineWidth = 1.9;
  ctx.strokeStyle = isBlack ? "black" : "white";
  ctx.stroke();
}

let arrayBlocks = [];

//Returns true if past player past block
function isPastBlock(player, block) {
  return (
    player.x + 25 > block.x + block.width / 4 &&
    player.x + 25 < block.x + (block.width / 4) * 3
  );
}

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
  let timeDelay = getRandomNumber(800, 2500);
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
  if (gameStarted) {
    setTimeout(generateBlocks, timeDelay);
  }
}


function startGame() {
  startSFX.play()
  gameMusicSFX.play()
  arrayBlocks = [];
  enemySpeed = 3;
  canScore = true;
  document.body.style.backgroundColor = "antiquewhite";
  canvas.style.backgroundColor = "white";
  hightScoreElement.style.display = "none";
  enterToStartElement.style.display = "none";
  startingTime = Date.now();
  gameStarted = true;
  player = new Player(5, 415);
  if (gameHasEnded) {
    requestAnimationFrame(animate);
  }
  currentScore = 0;
  setTimeout(() => {
    generateBlocks();
  }, 2000);
}

function gameEnded() {
  gameMusicSFX.pause()
  newScoreSFX.pause()
  gameOverSFX.play()
  document.body.classList.remove("bodyDark");
  canvas.classList.remove("dark");
  titleElement.classList.remove("dark");
  canvas.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
  gameHasEnded = true
  gameStarted = false;
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
  drawBackgroundLine(Math.floor(currentScore / 50) % 2 === 0);
  if (gameStarted) {
    thmeManagement();    
    currentScoreElement.innerText = Math.floor(currentScore);
    updateTimePassed();
    blocksManagement();
  }
  player.draw();
}

animate();

//Event Listeners
addEventListener("keydown", (e) => {
  if (e.code === "Space" && gameStarted) {
    if (!player.shouldJump) {
      jumpSFX.play();
      player.jumpCounter = 0;
      player.shouldJump = true;
      canScore = true;
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
      jumpSFX.play();
      player.jumpCounter = 0;
      player.shouldJump = true;
    }
  }
});

function blocksManagement() {
  arrayBlocks.forEach((element, index) => {
    element.speed = enemySpeed;
    element.slide();
    if (isPastBlock(player, element) && canScore) {
      canScore = false;
      currentScore += 10;
    }
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

function thmeManagement() {
  isNewScore = currentScore > bestScore && bestScore != 0;
  if (isNewScore) {
    gameMusicSFX.pause()
    newScoreSFX.play()
    hightScoreElement.style.display = "block";
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    canvas.style.backgroundColor = "#" + randomColor;
    document.body.style.backgroundColor = "#" + randomColor;
  } else {
    if (Math.floor(currentScore / 50) % 2 === 0) {
      document.body.style.backgroundColor = "antiquewhite";
      canvas.style.backgroundColor = "white";
      titleElement.classList.remove("dark");
      const paragraphs = document.querySelectorAll("p");
      paragraphs.forEach((p) => {
        p.classList.remove("dark");
      });
    } else {
      canvas.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      document.body.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
      const paragraphs = document.querySelectorAll("p");
      paragraphs.forEach((p) => {
        p.classList.add("dark");
      });
      canvas.classList.add("darkCanvas");
      titleElement.classList.add("dark");
    }
  }
}
