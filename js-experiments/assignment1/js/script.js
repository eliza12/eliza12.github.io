var mainContainerWrapper = document.getElementById("main-container-wrapper");

//make new div for plot data container

var plotsContainer = document.createElement("div");
plotsContainer.setAttribute("id", "plots-container");
plotsContainer.style.width = "500px";
plotsContainer.style.height = "500px";
plotsContainer.style.backgroundColor = "gray";
plotsContainer.style.position = "relative";
plotsContainer.style.overflow = "hidden";

//append plots container in main container
mainContainerWrapper.appendChild(plotsContainer);

//container for list
var listContainer = document.createElement("div");
mainContainerWrapper.appendChild(listContainer);

var plotElementInfo = document.createElement("ul");
listContainer.appendChild(plotElementInfo);

var itemsNum = 20;

var data = [];

init();
childPlots();

//function for initializing values for plots
function init() {
	for(var i=0; i<itemsNum; i++) {
		var dataObj = {
			top: Math.floor((Math.random() * 400) + 100),
			left: Math.floor((Math.random() * 400) + 100)
		}

		data.push(dataObj);
	}

}


function childPlots() {
	for(var i=0; i<itemsNum; i++) {
		var plotElement = document.createElement("div");
		plotElement.style.width = "10px";
		plotElement.style.height = "10px";
		plotElement.style.backgroundColor = "pink";
		plotElement.style.position = "absolute";
		plotElement.style.top = data[i].top+"px";
		plotElement.style.left = data[i].left+"px";

		plotElement.onclick = function() {

			var removedPlotLists = document.createElement("li");
			removedPlotLists.innerHTML = "top: " + this.style.top + " left: " + this.style.left;
			plotElementInfo.appendChild(removedPlotLists);

			plotsContainer.removeChild(this);
		};

		plotsContainer.appendChild(plotElement);
	}
}

