//array for images
var imageArray = ["images/image1.jpg", "images/image2.jpg", "images/image3.jpg"];


var mainContainerWrapper = document.getElementById("main-container-wrapper");

var sliderContainer = document.createElement("div");
sliderContainer.setAttribute("id", "slider-container");
sliderContainer.style.width = "500px";
sliderContainer.style.margin = "auto";
sliderContainer.style.height = "600px";
sliderContainer.style.margin = "auto";
// sliderContainer.style.position = "relative";

mainContainerWrapper.appendChild(sliderContainer);

var childImageSlider = document.createElement("div");
childImageSlider.setAttribute("id", "image-slider");
childImageSlider.style.width = "300px";
childImageSlider.style.height = "300px";
childImageSlider.style.margin = "auto";
childImageSlider.style.overflow = "hidden";

sliderContainer.appendChild(childImageSlider);

var childButtonContainer = document.createElement("div");
childButtonContainer.setAttribute("id", "button-container");
sliderContainer.appendChild(childButtonContainer);

var childButtonPrev = document.createElement("button");
childButtonPrev.setAttribute("id", "prev-button");
childButtonPrev.innerHTML= "Previous";
childButtonPrev.style.width = "auto";
childButtonPrev.style.height = "20px";

var childButtonNext = document.createElement("button");
childButtonNext.setAttribute("id", "next-button");
childButtonNext.innerHTML = "Next";
childButtonNext.style.width = "auto";
childButtonNext.style.height = "20px";

childButtonContainer.appendChild(childButtonPrev);
childButtonContainer.appendChild(childButtonNext);

//for images in image slider

var imageListUL = document.createElement("ul");
imageListUL.style.listStyleType = "none";
imageListUL.style.margin = "0px";
imageListUL.style.padding = "0px";
imageListUL.style.whiteSpace = "nowrap";
childImageSlider.appendChild(imageListUL);


addImages();

// var interval =  setInterval(function() {
// 	slideNext();
// 	console.log("text");

// }, 2000);

function addImages() {
	for(var i=0; i<imageArray.length; i++) {

		var imageListObj = document.createElement("li");
		imageListObj.style.display = "inline";
		imageListUL.appendChild(imageListObj);

		var imageObj = document.createElement("img");
		imageObj.setAttribute("src", imageArray[i]);
		imageObj.style.width = "300px";
		imageObj.style.height = "300px";

		imageListObj.appendChild(imageObj);
	}
}
var x = 0;
var counter = 0;

function slideNext() {
	// counter++;
	// // console.log("counter is "+counter);
	// if(counter<=(imageArray.length-1)) {
		x-=300;
		animateNextSlide(x);
		// imageListUL.style.marginLeft = x+"px";
		console.log(imageListUL.style.marginLeft);
		console.log(counter);
	// }
	// else {
	// 	console.log("else block")
	// 	counter = imageArray.length-1;
	// 	clearInterval(this.interval);
	// }
}

function slidePrev() {
	// counter--;
	// if(counter>=0) {
		x+=300;
		imageListUL.style.marginLeft = x+"px";
		console.log(imageListUL.style.marginLeft);
		console.log(counter);
	// }
	// else {
	// 	counter=0;
	// }
}


childButtonNext.onclick = function() {
	slideNext();	
	// animateNextSlide();
};

childButtonPrev.onclick = function() {
	slidePrev();
	
};

var marginValue = 0;

function animateNextSlide(x) {	
	if(marginValue>x) {
		marginValue-=10;
		imageListUL.style.marginLeft = marginValue+"px";
		setTimeout(function (){animateNextSlide(x);}, 10);
	}
}

function animatePrevSlide(x) {	
	if(marginValue<x) {
		marginValue+=10;
		imageListUL.style.marginLeft = marginValue+"px";
		setTimeout(function (){animateNextSlide(x);}, 10);
	}
}

