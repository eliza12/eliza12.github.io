var parentContainer=document.getElementById('main-container');
parentContainer.style.width="600px";
parentContainer.style.height="600px";
parentContainer.style.backgroundColor="gray";
parentContainer.style.position = "relative";


function player(idName) {
	this.element = document.createElement("div");
	this.element.id = idName;
	this.element.style.width = "50px";
	this.element.style.height = "50px";
	this.elementImage = document.createElement("img");
	this.elementImage.src = "images/ant.png";
	this.elementImage.style.width = "50px";
	this.elementImage.style.height = "50px";
	this.element.appendChild(this.elementImage);
	this.element.style.position = "absolute";
	this.element.style.top = Math.random()*(parseInt(parentContainer.style.height)-parseInt(this.element.style.height))+"px";
	this.element.style.left = Math.random()*(parseInt(parentContainer.style.width)-parseInt(this.element.style.width))+"px";
	parentContainer.appendChild(this.element);
	this.elementU=document.getElementById(idName);

	this.elementU.onclick = function() {
		parentContainer.removeChild(this);
	};

	var direction = [-1,1];

	var directionPosition = Math.floor(Math.random()*1+0);


	this.x = 0;
	this.y = 0;
	this.dx = direction[directionPosition];
	this.dy = direction[directionPosition];
	this.velocity = 20;
	this.movePosition = function() {
		this.x = parseInt(this.elementU.style.left);
		this.y = parseInt(this.elementU.style.top);

		if((this.x+parseInt(this.elementU.style.width)) > parseInt(parentContainer.style.width)-this.velocity) {
			this.dx = -1;
		}

		if(this.x < this.velocity) {
			this.dx = 1;
		}

		if((this.y + parseInt(this.elementU.style.height)) > parseInt(parentContainer.style.height)-this.velocity) {
			this.dy = -1;
		}

		if(this.y < this.velocity) {
			this.dy = 1;
		}


		this.x = this.x + this.dx*this.velocity;
		this.y = this.y + this.dy*this.velocity;
		this.elementU.style.top = this.y+"px";
		this.elementU.style.left = this.x+"px";
	}


}


var ants = [];

for(i=0;i<20;i++) {
	var box = new player("box"+i);
	ants.push(box);
}

setInterval(function() {
	for(var i=0;i<ants.length;i++) {
		ants[i].movePosition();
	}
}, 500);