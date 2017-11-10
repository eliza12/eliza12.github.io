var parentContainer=document.getElementById('main-container');
parentContainer.style.width="800px";
parentContainer.style.height="600px";
parentContainer.style.backgroundImage="url('images/bg.jpg') ";
parentContainer.style.position = "relative";
parentContainer.style.margin = "0 auto";

var ants = [];

var killCount = 0;

function Game() {
	var that = this;

	this.init = function() {
		var heading = document.createElement("h1");
		heading.innerHTML = "Ant Smasher!!!"
		heading.style.textAlign = "center";
		heading.style.padding = "25px";
		parentContainer.appendChild(heading);

		var playButton = document.createElement("button");
		playButton.innerHTML = "Play";
		playButton.style.margin = "20px";
		playButton.style.marginLeft = "45%";
		parentContainer.appendChild(playButton);

		playButton.onclick = function() {
			parentContainer.removeChild(heading);
			parentContainer.removeChild(playButton);

			that.start();

		};

	};

	this.start = function() {

		for(i=0;i<10;i++) {
			var box = new player("box"+i);
			ants.push(box);
		}

		var antsNum = ants.length;

		var interval = setInterval(function() {

			if(killCount == antsNum) {
				clearInterval(interval);
				that.reset();
			}

			for(var i=0;i<ants.length;i++) {
				ants[i].movePosition();
			}
		}, 100);
	};

	this.reset = function() {
		var gameOverText = document.createElement("h1");
		gameOverText.innerHTML = "Game Over!!";
		gameOverText.style.textAlign = "center";
		gameOverText.style.padding = "25px";

		parentContainer.appendChild(gameOverText);

		setTimeout(function() {
			parentContainer.removeChild(gameOverText);
			that.init();
		}, 1000);

		// this.init();
	};
} 


var antGame = new Game();
antGame.init();

function player(idName) {

	var that = this;
	var death = 0;

	this.element = document.createElement("img");
	this.element.id = idName;
	this.element.style.width = "50px";
	this.element.style.height = "50px";
	this.element.src = "images/ant.png";
	this.element.style.position = "absolute";
	this.element.style.top = Math.random()*(parseInt(parentContainer.style.height)-parseInt(this.element.style.height))+"px";
	this.element.style.left = Math.random()*(parseInt(parentContainer.style.width)-parseInt(this.element.style.width))+"px";
	parentContainer.appendChild(this.element);

	this.element.onclick = function() {
		this.dx = 0;
		this.dy = 0;
		death = 1;

		killCount++;

		var temp = idName.substring(3);
		ants.splice(parseInt(temp),1);

		parentContainer.removeChild(this);

	};

	this.x = 0;
	this.y = 0;
	this.dx = 1;
	this.dy = 1;
	this.velocity = 20;
	this.movePosition = function() {

		if(death == 0) {
			this.checkBoundary();

			detectCollision(ants);

			this.x = this.x + this.dx*this.velocity;
			this.y = this.y + this.dy*this.velocity;
		}

		
		this.element.style.top = this.y+"px";
		this.element.style.left = this.x+"px";
	}

	this.checkBoundary = function() {
		this.x = parseInt(this.element.style.left);
		this.y = parseInt(this.element.style.top);

		if((this.x+parseInt(this.element.style.width)) > parseInt(parentContainer.style.width)-this.velocity) {
			this.dx = -1;
		}

		if(this.x < this.velocity) {
			this.dx = 1;
		}

		if((this.y + parseInt(this.element.style.height)) > parseInt(parentContainer.style.height)-this.velocity) {
			this.dy = -1;
		}

		if(this.y < this.velocity) {
			this.dy = 1;
		}

	}


}

var detectCollision = function(ants) {
	ants.forEach(function(ant1) {
		ants.forEach(function(ant2) {
			if(ant1 == ant2) {
				//do nothing
			}
			else {
				if((ant1.x+50 > ant2.x) && (ant2.x+50 > ant1.x) && (ant1.y+50 > ant2.y) && (ant2.y+50 > ant1.y)) {
					if(ant1.x > ant2.x) {
						ant1.dx = 1;
						ant2.dx = -1;
					}
					else {
						ant1.dx = -1;
						ant2.dx = 1;
					}
					
					if(ant1.y > ant2.y) {
						ant1.dy = 1;
						ant2.dy = -1;
					}
					else {
						ant1.dy = -1;
						ant2.dy = 1;
					}
				}
			}
		})
	})
};