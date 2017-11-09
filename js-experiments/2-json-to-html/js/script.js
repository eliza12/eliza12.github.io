var data = [
   {
       tagName: 'div',
       className: 'test-class',
       styles: {
           width: "100px",
           height: "100px",
           backgroundColor: 'red'
       },
       children: [
           {
               tagName: 'div',
               className: 'box',
               styles: {
                   width: "50px",
                   height: "50px",
                   backgroundColor: 'blue'
               },
           },
           {
               tagName: 'div',
               className: 'box',
               styles: {
                   width: "50px",
                   height: "50px",
                   backgroundColor: 'brown',
                   float: 'right'
               },
           }
       ]
   }
];



function displayData() {
  for(var i=0;i<data.length;i++) {
    var mainContainer = document.createElement(data[i].tagName);
    mainContainer.className = data[i].className;
    setCssAttributes(mainContainer, data[i].styles);
    document.body.appendChild(mainContainer);

    if(data[i].children) {
      var dataChildren = data[i].children;
      
      for(var j=0; j<dataChildren.length; j++) {
        var childContainer = document.createElement(dataChildren[j].tagName);
        childContainer.className = dataChildren[j].className;
        setCssAttributes(childContainer, dataChildren[j].styles);
        mainContainer.appendChild(childContainer);
      }
    }

  }
}

function setCssAttributes(element, styleData) {
  var keys = Object.keys(styleData);

  for(var i=0;i<keys.length; i++) {
    element.style[keys[i]] = styleData[keys[i]];
  }
  
}


displayData();