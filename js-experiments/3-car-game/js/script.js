var gameInterval,obstacleInterval;
var carObjList=[];
var obstacleObjList=[];
var bulletObjList = [];

function Game(parentElement) {

	this.parentElement = parentElement;
	var that = this;
	var marginValue = 0;
	this.init = function() {

		this.parentElement.style.width = "600px";
		this.parentElement.style.height = "650px";
		this.parentElement.style.margin = "0 auto";
		this.parentElement.style.overflow = "hidden";

		this.gameContainer = document.createElement("div");
		this.gameContainer.className = "game-container";

		this.parentElement.appendChild(this.gameContainer);

		var homeContainer=document.createElement("div");
		var header=document.createElement("h1");
		header.appendChild(document.createTextNode("Car crash"));
		header.style.color="white";
		header.style.fontSize="38px";
		header.style.textAlign="center";

		var startButton=document.createElement("button");
		startButton.appendChild(document.createTextNode("Start"));
		startButton.style.padding="5px";
		startButton.style.fontSize="20px";
		startButton.style.marginTop="20px";
		startButton.style.marginLeft="45%";

		startButton.onclick=function(){
				
				that.gameContainer.removeChild(homeContainer);
				that.start();
		}

		homeContainer.appendChild(header);
		homeContainer.appendChild(startButton);
		this.gameContainer.appendChild(homeContainer);	

	}

	this.start = function() {

		gameInterval = setInterval(function() {
		 	that.backGround();
		}, 50);

		var carObj = new Car(this.gameContainer);
		carObjList.push(carObj);
		
		obstacleInterval=setInterval(function(){
			that.obstacleGenerator();
		},1500);

	}

	this.backGround=function(){
			marginValue += 10;
			that.gameContainer.style.backgroundPosition = "center top " + marginValue + "px";

			obstacleObjList.forEach(function(obstacle) {
				obstacle.updatePosition();
			});

			carObjList.forEach(function(car) {
				if (car.killed==1) {
					clearInterval(gameInterval);
					clearInterval(obstacleInterval);
					that.gameOver();
				}
			});

			bulletObjList.forEach(function(bullet){
				bullet.updatePosition();
			});
	}

	this.obstacleGenerator=function(){
		var obstacleObj=new Obstacle(that.gameContainer);
		obstacleObjList.push(obstacleObj);
	}

	this.gameOver=function(){

		var homeContainer=document.createElement("div");
		var header=document.createElement("h1");
		header.appendChild(document.createTextNode("Game Over"));
		header.style.color="white";
		header.style.fontSize="38px";
		header.style.textAlign="center";

		var restartButton=document.createElement("button");
		restartButton.appendChild(document.createTextNode("Restart"));
		restartButton.style.padding="5px";
		restartButton.style.fontSize="20px";
		restartButton.style.marginTop="20px";
		restartButton.style.marginLeft="45%";

		restartButton.onclick=function(){		
			that.gameContainer.removeChild(homeContainer);
			that.restart();
		}

		homeContainer.appendChild(header);
		homeContainer.appendChild(restartButton);
		this.gameContainer.appendChild(homeContainer);

	}

	this.restart=function(){
		
		while (that.gameContainer.firstChild){
			that.gameContainer.removeChild(that.gameContainer.firstChild);
		}

		carObjList=[];
		obstacleObjList=[];
		bulletObjList = [];
		that.start();
	}

}

function Car(parentElement) {

	var that = this;

	this.parentElement = parentElement;
	this.killed=0;
	this.carElement = document.createElement("img");
	this.carElement.className = "game-car";
	this.x = 50;
	this.velocity = 5;
	this.dontMove = 0;
	this.width=100;
	this.height=204;
	this.dx = 1;
	this.dy = 1;
	this.y = 650-this.height;
	this.carElement.src = "images/car.png";
	this.carElement.style.width=this.width+"px";
	this.carElement.style.height=this.height+"px";
	this.carElement.style.left = this.x+"px";
	this.carElement.style.top = this.y+"px";
	this.parentElement.appendChild(this.carElement);	

	this.movePosition = function(dx, dy) {

		if (this.killed==0){

			this.dx = dx;
			this.dy = dy;

			this.checkBoundary();

			if(this.dontMove == 0) {
				this.x = this.x + this.velocity*this.dx;
				this.carElement.style.left = this.x+"px";
			}	 
		}
	}

	this.checkBoundary=function(){
		
		if (this.x<31 && this.dx<0) {
			this.dontMove = 1;
		}
		else if (this.x>459 && this.dx>0) {
			this.dontMove = 1;
		}
		else {
			this.dontMove = 0;
		}
	}
}


function Obstacle(parentElement){

	var that = this;
	this.destroyed = 0;
	this.parentElement = parentElement;
	this.obstacleElement = document.createElement("img");
	this.obstacleElement.src = "images/rock.png";
	this.obstacleElement.style.position = "absolute";
	this.x = getRandomInteger(31,460);
	this.y = 0;
	this.velocity = 5;
	this.width = 60;
	this.height = 37;
	this.obstacleElement.style.width = this.width+"px";
	this.obstacleElement.style.height = this.height+"px";
	this.obstacleElement.style.top = this.y+"px";
	this.obstacleElement.style.left = this.x+"px";
	this.parentElement.appendChild(this.obstacleElement);

	this.updatePosition = function(){
		var collision = new Collision(this.parentElement);
		collision.carCollision();	
		collision.bulletCollision();
		this.y = this.y + this.velocity;
		this.removeElement();
		this.obstacleElement.style.top = this.y + "px";
	}

	this.removeElement = function(){

		if(this.y>650 || this.destroyed == 1) {							
			this.parentElement.removeChild(this.obstacleElement);

			// console.log(obstacleObjList[indexOf(this.obstacleElement)]);
			var tempObjectList = obstacleObjList;
			obstacleObjList = [];

			tempObjectList.forEach(function(object) {
				if (object != that) {
					obstacleObjList.push(object);
				}
			});
		}
	}
}

var gameObj = new Game(document.getElementById("main-container"));
gameObj.init();

function Collision(parentElement){
	
	var that=this;
	this.parentElement = parentElement;

	this.carCollision = function() {

		carObjList.forEach(function(car) {
			obstacleObjList.forEach(function(obstacle) {

				this.collisionAction = function() {
					car.carElement.src="images/explosion.png";
					car.carElement.style.width = "200px";
					car.killed=1;	
				}

				if (obstacle.y>car.y) {							
					if(car.x+car.width > obstacle.x) {
						if (car.x+car.width < obstacle.x+obstacle.width) {
							this.collisionAction();
						}
					}
					if(obstacle.x+obstacle.width > car.x) {
						if (obstacle.x+obstacle.width < car.x+car.width) {
							this.collisionAction();
						}
					}
				}
			});
		});
	}

	this.bulletCollision = function() {
		bulletObjList.forEach(function(bullet) {
			obstacleObjList.forEach(function(obstacle) {

				this.bulletCollisionAction = function() {
					obstacle.obstacleElement.src = "images/scattered-rock.png";
					setTimeout(function() {
						obstacle.destroyed = 1;
					}, 20);
					bullet.used = 1;
				}
			
				if (bullet.y < obstacle.y+obstacle.height) {
					if(obstacle.x+obstacle.width > bullet.x) {
						if (obstacle.x+obstacle.width < bullet.x+bullet.width) {
							this.bulletCollisionAction();
						}
					}
					if(bullet.x+bullet.width > obstacle.x) {
						if (bullet.x+bullet.width < obstacle.x+obstacle.width) {
							this.bulletCollisionAction();
						}
					}
				}
			});
		});
	}
}

function Bullet (parentElement, carX, carY, carWidth, carHeight) {
	this.parentElement = parentElement;

	this.used = 0;

	this.width = 20;
	this.height = 50;
	this.x = carX + carWidth/2-this.width/2;
	this.y = carY;
	this.bulletElement = document.createElement("img");
	this.bulletElement.src = "images/bullet.png";
	this.bulletElement.style.position = "absolute";
	this.bulletElement.style.left = this.x + "px";
	this.bulletElement.style.top = this.y + "px";
	this.bulletElement.style.width = this.width + "px";
	this.bulletElement.style.height = this.height + "px";

	this.parentElement.appendChild(this.bulletElement);

	this.updatePosition = function() {
		this.y -= 20;
		this.bulletElement.style.top = this.y + "px";
		if (this.y < 0) {
			this.used = 1;
		}

		this.removeBullet();
	}

	this.removeBullet = function() {
		if (this.used == 1) {
			this.parentElement.removeChild(this.bulletElement);
		}

		var tempObjList = bulletObjList;
		bulletObjList = [];

		tempObjList.forEach(function(object) {
			if(object.used == 0) {
				bulletObjList.push(object);
			}
		});
		
	}

}

function getRandomInteger(min,max){
		return Math.floor(Math.random()*max+min);
}

document.onkeydown = function(event) {
	keyCodeValue = event.keyCode;
	switch(keyCodeValue) {
		case 37:
			carObjList.forEach(function(individualCar) {
				 individualCar.movePosition(-1,0);
			});
			break;
		case 39:
			carObjList.forEach(function(individualCar) {
				individualCar.movePosition(1,0);
			});	 
			break;
		case 32:
			carObjList.forEach(function(individualCar) {
				var bulletObj = new Bullet(individualCar.parentElement, individualCar.x, individualCar.y, individualCar.width, individualCar.height);
				bulletObjList.push(bulletObj);
			});
			break;
	}		
}