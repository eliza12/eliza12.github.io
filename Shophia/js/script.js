var userIcon = document.getElementById('userIcon');
var userNav = document.getElementsByClassName('user-nav')[0];

var userIconFlag = 1;
function userIconClick() {
	if (userIconFlag === 1) {
		userNav.style.display = 'block';
		userIconFlag = 0;
	}
	else {
		userNav.style.display = 'none';
		userIconFlag = 1;
	}
}

var menuIcon = document.getElementById('menuIcon');
var mainNav = document.getElementsByClassName('nav-bar')[0];

var menuIconFlag = 1;
function menuIconClick() {
	if (menuIconFlag === 1) {
		mainNav.style.display = 'block';
		menuIconFlag = 0;
	}
	else {
		mainNav.style.display = 'none';
		menuIconFlag = 1;
	}
}

