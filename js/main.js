var animate =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

var canvas = document.createElement("canvas");
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext("2d");

window.onload = function () {
  document.body.appendChild(canvas);
  animate(step);
};

var step = function () {
  update();
  render();
  animate(step);
};

var update = function () {
  player.update();
  ball.update(player.paddle, computer.paddle);
  computer.update(ball);
};

var render = function () {
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);
};

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.xSpeed = 0;
  this.ySpeed = 0;
}

Paddle.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
  this.xSpeed = x;
  this.ySpeed = y;
  if (this.x < 0) {
    // all the way to the left
    this.x = 0;
    this.xSpeed = 0;
  } else if (this.x + this.width > 400) {
    // all the way to the right
    this.x = 400 - this.width;
    this.xSpeed = 0;
  }
};

Paddle.prototype.render = function () {
  context.fillStyle = "#fff";
  context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
  this.paddle = new Paddle(175, 580, 50, 10);
}

Player.prototype.render = function () {
  this.paddle.render();
};

Player.prototype.update = function () {
  for (var key in keysDown) {
    var value = Number(key);
    if (value == 37) {
      // up arrow
      this.paddle.move(-4, 0);
    } else if (value == 39) {
      // down arrow
      this.paddle.move(4, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

function Computer() {
  this.paddle = new Paddle(175, 10, 50, 10);
}

Computer.prototype.render = function () {
  this.paddle.render();
};

Computer.prototype.update = function (ball) {
  var xPos = ball.x;
  var diff = -(this.paddle.x + this.paddle.width / 2 - xPos);
  if (diff < 0 && diff < -4) {
    // max speed left
    diff = -5;
  } else if (diff > 0 && diff > 4) {
    // max speed right
    diff = 5;
  }
  this.paddle.move(diff, 0);
  if (this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > 400) {
    this.paddle.x = 400 - this.paddle.width;
  }
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.xSpeed = 0;
  this.ySpeed = 3;
  this.radius = 5;
}

Ball.prototype.render = function () {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#fff";
  context.fill();
};

Ball.prototype.update = function () {
  this.x += this.xSpeed;
  this.y += this.ySpeed;
};

Ball.prototype.update = function (paddle1, paddle2) {
  this.x += this.xSpeed;
  this.y += this.ySpeed;
  var topX = this.x - this.radius;
  var topY = this.y - this.radius;
  var bottomX = this.x + this.radius;
  var bottomY = this.y + this.radius;

  if (this.x - 5 < 0) {
    // hitting the top wall
    this.x = 5;
    this.xSpeed = -this.xSpeed;
  } else if (this.x + 5 > 400) {
    // hitting the bottom wall
    this.x = 395;
    this.xSpeed = -this.xSpeed;
  }

  if (this.y < 0 || this.y > 600) {
    // a point was scored
    var scoreElement = null;
    if (this.y <= 0) {
      scoreElement = document.getElementById("userScore");
    }
    if (this.y >= 600) {
      scoreElement = document.getElementById("enemyScore");
    }
    // Score
    var currentScore = parseInt(scoreElement.innerHTML);
    scoreElement.innerHTML = currentScore + 1;

    this.xSpeed = 0;
    this.ySpeed = 3;
    this.x = 200;
    this.y = 300;
  }

  if (topY > 300) {
    if (
      topY < paddle1.y + paddle1.height &&
      bottomY > paddle1.y &&
      topX < paddle1.x + paddle1.width &&
      bottomX > paddle1.x
    ) {
      // hit the player's paddle
      this.ySpeed = -3;
      this.xSpeed += paddle1.xSpeed / 2;
      this.y += this.ySpeed;
    }
  } else {
    if (
      topY < paddle2.y + paddle2.height &&
      bottomY > paddle2.y &&
      topX < paddle2.x + paddle2.width &&
      bottomX > paddle2.x
    ) {
      // hit the computer's paddle
      this.ySpeed = 3;
      this.xSpeed += paddle2.xSpeed / 2;
      this.y += this.ySpeed;
    }
  }
};

var keysDown = {};

window.addEventListener("keydown", function (event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
  delete keysDown[event.keyCode];
});

var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

var render = function () {
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};
