var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ball = {
	speed: getRandomArbitrary(-4, 5),
	isMovingUp: false,
	x: canvas.width / 2,
	y: canvas.height - 30
}

var player = {
	speed: 5
}

var dx = ball.speed * getRandomArbitrary(-2, 3);
var dy = ball.speed * getRandomArbitrary(-2, 3);

var ballRadius = 10;
var ballColor = "#0095DD"

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var enemyX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var paused = false;
var lose = false;
var win = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	}
	else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	}
	else if (e.keyCode == 37) {
		leftPressed = false;
	}
	else if (e.keyCode == 80) {
		togglePause();
	}
	else if (e.keyCode == 32 || e.keyCode == 13) {
		document.location.reload();
	}
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function togglePause() {
	if (!paused) {
		paused = true;
	} else if (paused) {
		paused = false;
		window.requestAnimationFrame(draw);
	}
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = ballColor;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#666";
	ctx.fill();
	ctx.closePath();
}

function drawEnemy() {
	ctx.beginPath();
	ctx.rect(enemyX, 0, paddleWidth, paddleHeight);
	ctx.fillStyle = "#666";
	ctx.fill();
	ctx.closePath();
}

function drawPause() {
	ctx.font = "30px Arial";
	ctx.fillStyle = "#666";
	ctx.textAlign = "center";
	ctx.fillText("Pause", canvas.width / 2, canvas.height / 2);
}

function drawText(text) {
	ctx.font = "30px Arial";
	ctx.fillStyle = "#666";
	ctx.textAlign = "center";
	ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	drawEnemy();

	//Win case
	if (ball.y + dy < ballRadius + paddleHeight) {
		if (ball.x > enemyX && ball.x < enemyX + paddleWidth) {
			dy = -dy;
			ball.isMovingUp = false;
		} else if (ball.y + dy < paddleHeight) {
			win = true;
		}
		//Lose case
	} else if (ball.y + dy > canvas.height - ballRadius - paddleHeight) {
		if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
			dy = -dy;
			ball.isMovingUp = true;
			dx++;
			dy--;
		}
		else if (ball.y + dy > canvas.height - ballRadius) {
			lose = true;
		}
	}


	if (ball.x + dx > canvas.width - ballRadius || ball.x + dx < ballRadius) {
		dx = -dx;
		ballSpeed = getRandomArbitrary(-4, 5);
	}

	//Paddle Movement

	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += player.speed;
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -= player.speed;
	}

	//Enemy Movement
	if (ball.y < canvas.height * 0.8 && ball.isMovingUp) {
		if (enemyX + paddleWidth / 2 < ball.x && enemyX < canvas.width - paddleWidth) {
			enemyX += player.speed;
		}
		else if (enemyX + paddleWidth / 2 > ball.x && enemyX > 0) {
			enemyX -= player.speed;
		}
	}

	ball.x += dx;
	ball.y += dy;

	if (!paused) {

		if (lose) {
			drawText("You Lose!");
		} else if (win) {
			drawText("You win!");
		} else {
			window.requestAnimationFrame(draw);
		}
	} else {
		drawPause();
	}
}
window.requestAnimationFrame(draw);