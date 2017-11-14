let birdPlayer;
let obstacleObjList = [];
let score = 0;

class World {
	constructor(parentElement) {
		this.parentElement = parentElement;
		console.log(parentElement);
	}

	init() {
		this.gameContainer = document.getElementById("gameContainer");
		this.gameContainer.style.height = "500px";

		this.gameName = document.createElement("h1");
		this.gameName.innerHTML = "Flappy Bird";
		this.gameName.style.position = "absolute";
		this.gameName.style.margin = "20px";
		this.gameName.style.color = "#fff";
		this.gameName.style.textAlign = "center";

		this.startButton = document.createElement("button");
		this.startButton.innerHTML = "START FLAPPY BIRD";
		this.startButton.style.margin = "25% 45%";

		this.gameContainer.appendChild(this.gameName);
		this.gameContainer.appendChild(this.startButton);

		this.startButton.onclick = () => {
			this.gameContainer.removeChild(this.gameName);
			this.gameContainer.removeChild(this.startButton);
			this.start();
		}
	}

	start() {
		this.scoreBoard = document.createElement("span");
		this.scoreBoard.innerHTML = "Score: ";
		this.scoreBoard.style.textAlign = "center";
		this.scoreBoard.style.position = "absolute";
		this.scoreBoard.style.right = "30px";
		this.scoreBoard.style.color = "#fff";

		this.gameContainer.appendChild(this.scoreBoard);

		this.scoreNumber = document.createElement("span");
		this.scoreNumber.id = "scoreNumber";
		this.scoreNumber.innerHTML = score;
		this.scoreNumber.style.position = "absolute";
		this.scoreNumber.style.right = "15px";
		this.scoreNumber.style.color = "#fff";
		
		this.gameContainer.appendChild(this.scoreNumber);

		let birdObj = new Bird(gameContainer);
		birdPlayer = birdObj;

		let marginValue = 0;

		this.gameInterval = setInterval(() => {
			marginValue -= 5;
			this.gameContainer.style.backgroundPosition = "center left " + marginValue +"px";
			birdObj.updatePosition();

			obstacleObjList.forEach((obstacle) => {
				obstacle.updatePosition();
			});

			if (birdObj.killed == 1) {
				clearInterval(this.gameInterval);
				clearInterval(this.obstacleInterval);
				this.gameOver();
			}

		}, 50);

		this.obstacleInterval = setInterval(() => {
			this.obstacleGenerator();
		}, 2000);
	}

	obstacleGenerator() {
		let obstacleObj = new Obstacles(this.gameContainer);
		obstacleObj.init();
		obstacleObjList.push(obstacleObj);
	}

	gameOver() {
		this.gameOverText = document.createElement("h1");
		this.gameOverText.innerHTML = "Game Over!!";
		this.gameOverText.style.position = "absolute";
		this.gameOverText.style.margin = "20px";
		this.gameOverText.style.color = "#fff";

		this.gameContainer.appendChild(this.gameOverText);

		this.restartGame();
	}

	restartGame() {
		this.restartButton = document.createElement("button");
		this.restartButton.innerHTML = "RESTART";
		this.restartButton.style.position = "absolute";
		this.restartButton.style.margin = "30%";

		this.gameContainer.appendChild(this.restartButton);

		this.restartButton.onclick = () => {

			obstacleObjList = [];
			score = 0;

			while(this.gameContainer.firstChild) {
				this.gameContainer.removeChild(this.gameContainer.firstChild);
			}

			this.start();
		};	
	}

}

class Bird {
	constructor(parentElement) {
		this.parentElement = parentElement;
		this.birdElement = document.createElement("img");
		this.birdElement.src = "images/flappy-bird.png";
		this.birdElement.style.position = "absolute";

		this.width = 30;
		this.birdElement.style.width = this.width + "px";
		this.height = 21;
		this.birdElement.style.height = "21px";
		
		this.x = 100;
		this.y = 50;
		this.dy = 1;
		this.velocity = 8;
		this.birdElement.style.left = this.x + "px";
		this.birdElement.style.top = this.y + "px";

		this.killed = 0;

		this.parentElement.appendChild(this.birdElement);
	}

	updatePosition() {
		this.y = this.y + this.velocity*this.dy;
		this.birdElement.style.top = this.y + "px";
	}

	fireEvent() {
		this.dy = -1;
		this.velocity = 10;

		setTimeout(() => {
			this.dy = 1;
			this.velocity = 8;
		}, 800);
	}
}

class Obstacles {
	constructor(parentElement) {
		this.parentElement = parentElement;
		this.x = 700;
	}

	init() {
		this.pipeUp = document.createElement("img");
		this.pipeUp.src = "images/pipe-green.png";
		this.pipeUp.style.position = "absolute";

		this.width = 25;

		this.pipeUp.style.top = "0px";
		this.pipeUp.style.width = this.width + "px";

		this.parentElement.appendChild(this.pipeUp);

		this.pipeDown = document.createElement("img");
		this.pipeDown.src = "images/pipe-red.png";
		this.pipeDown.style.position = "absolute";
		this.pipeDown.style.bottom = "0px";
		this.pipeDown.style.width = this.width + "px";

		this.parentElement.appendChild(this.pipeDown);

		this.updatePipeHeight();
	}

	updatePosition() {

		let collisionObj = new Collision(this.parentElement);
		collisionObj.birdCollision();

		this.x -= 10;
		this.pipeUp.style.left = this.x + "px";
		this.pipeDown.style.left = this.x + "px";

		this.removeElement(this.x);

	}

	updatePipeHeight() {
		this.pipeUpHeight = Math.floor((Math.random() * 300) + 50);
		this.pipeUp.style.height = this.pipeUpHeight + "px";

		this.pipeDownHeight = Math.floor((Math.random() * (500 - this.pipeUpHeight - 100)) + 50);
		this.pipeDown.style.height = this.pipeDownHeight + "px";
	}

	removeElement(x) {

		if (x<=0) {
			this.parentElement.removeChild(this.pipeUp);
			this.parentElement.removeChild(this.pipeDown);

			obstacleObjList.splice(0, 1);

			score++;
			let scoreObj = document.getElementById("scoreNumber");
			scoreObj.innerHTML = score;
			// this.parentElement.scoreNumber.innerHTML = score;
		}
	}

}

class Collision {
	constructor(parentElement) {
		this.parentElement = parentElement;
	}

	birdCollision() {
		obstacleObjList.forEach((obstacle) => {
			if (((birdPlayer.x + birdPlayer.width) > obstacle.x) && ((birdPlayer.x + birdPlayer.width) < (obstacle.x + obstacle.width)) ) {
				if ((birdPlayer.y < obstacle.pipeUpHeight)) {
					console.log("hit pipe up");
					birdPlayer.killed = 1;
				}
				if ((birdPlayer.y+birdPlayer.height) > (parseInt(this.parentElement.style.height) - obstacle.pipeDownHeight)) {
					console.log("hit pipe down");
					birdPlayer.killed = 1;
				}
			}
		});
	}

}

let game = new World(document.getElementById("gameContainer"));
game.init();

document.onkeydown = (event) => {
	if (event.keyCode == 32) {
		birdPlayer.fireEvent();
	}
};