var player1, player2, gameBall, score1, score2;
var canvasImg = new Image();
canvasImg.src = "./assets/canvas.png";
score1 = document.getElementById("player1");
score2 = document.getElementById("player2");

function startGame() {
  myGameArea.start();
  player1 = new Paddle(5, 300, "#1199ff");
  player2 = new Paddle(790, 300, "#1199ff");
  gameBall = new Ball(400, 300, "#ff9911", 6);
  animate();
}

var myGameArea = {
  canvas: document.getElementById("canvas"),
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(canvasImg, 0, 0);
  },
};

class Paddle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 40;
    this.color = color;
    this.velocityY = 0;
    this.score = 0;

    this.update = function () {
      this.ctx = myGameArea.context;
      this.y += this.velocityY;
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
  }
}

class Ball {
  constructor(x, y, color, radius) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.velocityX = 1.2;
    this.velocityY = 1.2;

    this.reset = function (u) {
      this.x = 400;
      this.y = 300;
      this.velocityX = 1.2 * u;
      this.velocityY = -1.2;
    };
    this.update = function () {
      this.ctx = myGameArea.context;
      this.x += this.velocityX;
      this.y += this.velocityY;

      // Check collision with the right wall
      if (this.x + this.radius > myGameArea.canvas.width) {
        player1.score += 1;
        score1.innerHTML = `${player1.score}`;
        this.reset(-1);
      }
      // Check collision with the left wall
      if (this.x - this.radius < 0) {
        player2.score += 1;
        score2.innerHTML = `${player2.score}`;
        this.reset(1);
      }
      // Check collision with the top and bottom walls
      if (
        this.y + this.radius > myGameArea.canvas.height ||
        this.y - this.radius < 0
      ) {
        this.velocityY = -this.velocityY;
      }
      // Check collision with player1 (left paddle)
      if (
        this.x - this.radius < player1.x + player1.width &&
        this.y > player1.y &&
        this.y < player1.y + player1.height
      ) {
        this.velocityX = -this.velocityX;
      }
      // Check collision with player2 (right paddle)
      if (
        this.x + this.radius > player2.x &&
        this.y > player2.y &&
        this.y < player2.y + player2.height
      ) {
        this.velocityX = -this.velocityX;
      }

      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      this.ctx.closePath();
    };
  }
}

function updateGameArea() {
  myGameArea.clear();
  myGameArea.frameNo += 1;

  // Smoothing the movement by adjusting the velocity based on frame rate
  player1.velocityY *= 0.9;
  player2.velocityY *= 0.9;

  // Adding player movement
  if (keys["w"] && player1.y >= 0) {
    player1.velocityY -= 0.2;
  }
  if (keys["s"] && player1.y <= 560) {
    player1.velocityY += 0.2;
  }
  if (keys["ArrowUp"] && player2.y >= 0) {
    player2.velocityY -= 0.2;
  }
  if (keys["ArrowDown"] && player2.y <= 560) {
    player2.velocityY += 0.2;
  }

  player1.update();
  player2.update();
  gameBall.update();
}

const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  delete keys[e.key];
});

function animate() {
  updateGameArea();
  requestAnimationFrame(animate);
}
