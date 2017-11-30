
var slideProjectLeft = document.getElementById('slideProjectLeft');
var slideProjectRight = document.getElementById('slideProjectRight');

var projectsContainer = document.getElementById('projectsContainer');
var children = projectsContainer.children;

var countChildren = 0;

var recentProjectsChildren = projectsContainer.getElementsByTagName('ul');

window.onload = function(event) {
	var firstUl = recentProjectsChildren[0];
	firstUl.className = "active";
}

slideProjectRight.onclick = function(event) {

	if (countChildren < recentProjectsChildren.length -1) {
		
		recentProjectsChildren[countChildren].className = "";
		++countChildren;
		var tempNextChild = recentProjectsChildren[countChildren];
		tempNextChild.style.opacity = 0;
		console.log("opacity = "+tempNextChild.style.opacity);
		
		fadeIn(tempNextChild, tempNextChild.style.opacity);
	}
	else {
		// alert('finish');
	}
}

slideProjectLeft.onclick = function(event) {

	if (countChildren > 0) {
		recentProjectsChildren[countChildren].className = "";
		--countChildren;
		var prevChild = recentProjectsChildren[countChildren];
		prevChild.style.opacity = 0;

		fadeIn(prevChild, prevChild.style.opacity);
	}
	else {
		// alert('start');
	}
	
}

function fadeIn(element, opacity) {
	this.element = element;
	console.log("this.element.style.opacity in fadeIn:");
	this.opacity = parseFloat(opacity);
	console.log(this.opacity);
	this.element.className = 'active';
	if(this.opacity != 1) {
		this.opacity += 0.02;
		this.element.style.opacity = this.opacity;
		
		setTimeout(function() {
			fadeIn(this.element, this.element.style.opacity);
		}, 20);
	}
	else {
		return;
	}

}
