var slider_contents = {
	0: {
		'title': "Donec faucibus ultricies congue",
		'images': ['mountain1.jpg', 'mountain2.jpg', 'mountain3.jpg', 'mountain4.jpg']
	},

	1: {
		'title': "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
		'images': ['flowers1.jpg', 'flowers2.jpg', 'flowers3.jpg', 'flowers4.jpg', 'flowers5.jpg']
	}
}

//heading
var sliderHeading = document.getElementById("mainHeading");

var headingSlideLeft = document.getElementById("headingSlideLeft");
var headingSlideRight = document.getElementById("headingSlideRight");

var imageslideLeft = document.getElementById("imageslideLeft");
var imageslideRight = document.getElementById("imageslideRight");

var sliderKeys = Object.keys(slider_contents[0]);
var sliderType = 0;

var slideIndicatorUl = document.getElementById("slideIndicatorUl");
var imgUlContainer = document.getElementById("imageSliderUL");

function sliderMain() {

	this.flag = true;
	var that = this;
	
	addLinkToTitle(sliderType);
	addImages(sliderType);
	addSlideIndicator(sliderType);

	function addLinkToTitle(headingIndex) {
		var headingLink = document.createElement("a");
		headingLink.setAttribute('href', '#');
		headingLink.textContent = slider_contents[sliderType][sliderKeys[0]];

		sliderHeading.appendChild(headingLink);
	}

	function addImages(sliderType) {
		var imglen = slider_contents[sliderType][sliderKeys[1]].length;
		console.log(imglen);

		for(var i=0; i<imglen; i++) {
			var imgList = document.createElement("li");
			var imgSrc = document.createElement("img");
			// console.log(slider_contents[sliderType]['images'][i]);

			if (i == 0) {
				imgList.setAttribute('class', 'active');
			}

			var tempImgSrc = "images/" + slider_contents[sliderType]['images'][i];
			imgSrc.setAttribute('src', tempImgSrc);

			imgUlContainer.appendChild(imgList);
			imgList.appendChild(imgSrc);

		}
	}

	function addSlideIndicator(sliderType) {
		var imglen = slider_contents[sliderType][sliderKeys[1]].length;
		console.log(imglen);
		for(var i=0; i<imglen; i++) {
			var indicatorList = document.createElement("li");
			var indicatorLink = document.createElement("a");

			indicatorLink.setAttribute('href', '#');
			indicatorLink.textContent = "text";

			if (i == 0) {
				indicatorList.setAttribute('class', 'current-slide');
			}

			slideIndicatorUl.appendChild(indicatorList);
			indicatorList.appendChild(indicatorLink);

		}
	}

	headingSlideLeft.onclick = function() {
		if(sliderType > 0) {
			removeElement(sliderHeading);
			removeElement(imgUlContainer);
			removeElement(slideIndicatorUl);
			--sliderType;
			console.log(sliderType);
			addLinkToTitle(sliderType);
			addImages(sliderType);
			addSlideIndicator(sliderType);
		}
		
	};

	headingSlideRight.onclick = function() {
		var objNum = Object.keys(slider_contents).length;
		console.log(objNum);
		if(sliderType < objNum-1) {
			removeElement(sliderHeading);
			removeElement(imgUlContainer);
			removeElement(slideIndicatorUl);
			++sliderType;
			console.log(sliderType);
			addLinkToTitle(sliderType);
			addImages(sliderType);
			addSlideIndicator(sliderType);
		}
	};

	var currentIndex = 0;
	var imgIndex = 0;
	var imageList = imgUlContainer.getElementsByTagName("li");
	var imageIndicatorList = slideIndicatorUl.getElementsByTagName("li");

	imageslideLeft.onclick = function() {
		if (imgIndex > 0 && that.flag==true) {
			that.flag = false;
			imageList[imgIndex].className = "";
			imageIndicatorList[imgIndex].className = "";
			--imgIndex;
			imageList[imgIndex].className = 'active';
			imageList[imgIndex].style.opacity = '0';
			fadeIn(imageList[imgIndex], imageList[imgIndex].style.opacity);
			currentIndex = imgIndex;
			that.flag = true;

			imageIndicatorList[imgIndex].className = 'current-slide';
		}
	};

	imageslideRight.onclick = function() {
		var listLength = imageList.length;
		if(imgIndex < listLength-1 && that.flag==true) {
			that.flag = false;
			imageList[imgIndex].className = "";
			imageIndicatorList[imgIndex].className = "";
			++imgIndex;
			imageList[imgIndex].setAttribute('class', 'active');
			imageList[imgIndex].style.opacity = '0';
			fadeIn(imageList[imgIndex], imageList[imgIndex].style.opacity);
			currentIndex = imgIndex;

			that.flag = true;

			imageIndicatorList[imgIndex].className = 'current-slide';
		}
	};

	function removeElement(parent) {
		while (parent.hasChildNodes()) {
	    parent.removeChild(parent.lastChild);
	  }
	}

}

sliderMain();

