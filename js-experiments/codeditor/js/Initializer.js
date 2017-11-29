

let EditorContent = new Array();
let writeroot;
let hasFocus = false;
let wheelx, wheely; //BugFix for Firefox 2.0 wheel event :-(
let isScrolling = false;
let ctrlPressed = false;
let clickspeed = 400;

let Curser;
let Editor;
let Selection;
let CopyPaste;
let UndoRedo;
let Intellisense;
let ContextMenu;

//placement of editor
let editor_x = 80;
let editor_y = 50;
let cols = 80;
let rows = 30;
let fontsize = [10,18];

//markers
let _post1;
let _post2;
let _pre1;
let _pre2;
let _xmlStart;
let _xmlFinish;

//editor
let __content;
let _curser;
let _errors;
let _editorinfo;
let _editor;
let _contentContatiner;
let _secondary;
let _linenumbers;
let _scrollbarY;
let _scrollbarX;
let _contextmenu;
let _intellisense;
// let _errors;
let _ErrorExplain;


window.onblur = function()
{
	if(Curser)
		Curser.SwitchOnOff(false);
}

window.onfocus = function()
{
	if(Curser)
		Curser.SwitchOnOff(true);
}

window.onload = function()
{
	_post1 = byid("post1");
	_post2 = byid("post2");
	_pre1 = byid("pre1");
	_pre2 = byid("pre2");
	_xmlStart  = byid("xmlStart");
	_xmlFinish = byid("xmlFinish");
	
	__content = byid("content");
	_curser = byid("curser");
	_editor = byid("editor");
	_errors = byid("errors");
	_editorinfo = byid("editorinfo");
	_contentContatiner = byid("contentContatiner");
	_secondary = byid("secondary");
	_ErrorExplain = byid("errorexplain");
	_linenumbers = byid("linenumbers");
	_scrollbarY = byid("scrollbarY");
	_scrollbarX = byid("scrollbarX");
	_contextmenu = byid("ContextMenu");
	_intellisense = byid("Intellisense");

	_sourceCode = byid("sourceCode");
	//---------------------------------------
	Intellisense = new Class_Intellisense();
	Curser = new Class_Curser(rows,cols);
	Editor = new Class_Editor(rows,cols);
	Selection = new Class_Selection();
	CopyPaste = new Class_CopyPaste();
	UndoRedo = new Class_UndoRedo();

	writeroot = byid('writeroot');	
	Curser.onoff();
	Editor.print();

	
	//------
	
	_contentContatiner.onmousedown = mousedownEvtHandler;
	_contentContatiner.onmouseup = mouseupEvtHandler;
	_contentContatiner.onmousemove = mousemoveEvtHandler;

	_scrollbarY.onscroll = scrollHandlerY;
	_scrollbarX.onscroll = scrollHandlerX;
	document.onselectstart = new Function("return false");
	document.onmouseup = function(){ isPressed = false; }
	document.defaultAction = false;
	document.onkeydown = function(e){ handleKeys(e); detectShiftPress(e); }
	document.onkeypress = function(e){ handleKeys(e); }
	document.onkeyup = detectShiftRelease;
	
}

/******************************************************************************
	KEYBOARD EVENT HANDLERS: DOWN->PRESS->UP
******************************************************************************/
function detectShiftPress(e)
{
	let evt = e ? e : window.event;
	
	if(evt.keyCode==16 && Selection.distance())
	{
		Selection.active = true;
		Editor.print();
	}
	if(evt.keyCode==17) //CTRL
	{
		ctrlPressed = true;
		_errors.style.display = "none";
	}
}

function detectShiftRelease(e)
{
	let evt = e ? e : window.event;
	
	if(evt.keyCode==16)//SHIFT
	{
		Selection.active = false;
		Editor.print();
	}
	if(evt.keyCode==17) //CTRL
	{
		ctrlPressed = false;
		_errors.style.display = "block";
	}
	
	Combo = false //detectShiftRelease is the last function call in a key event
}

let nonChar = false;
let Combo = false;
function handleKeys(e) 
{
	isScrolling = false;
	let char;
    let evt = (e) ? e : window.event;       //IE reports window.event not arg
    
    if (!evt.stopPropagation){
		evt.stopPropagation = function() {this.cancelBubble = true;};
		evt.preventDefault = function() {this.returnValue = false;};
	}
	
	if (!evt.stop){
		evt.stop = function(){
			this.stopPropagation();
			this.preventDefault();
		};
	}
    
    if (evt.type == "keydown") {
        char = evt.keyCode;
        if (char < 16 ||                    // non printables
            (char > 16 && char < 32) ||     // avoid shift
            (char > 32 && char < 41) ||     // navigation keys
            char == 46                    // Delete Key (Add to these if you need)
        )
        {
            nonChar = true;
            Keyhandler_Meta(char, evt, e);     // function to handle non Characters
        } else
            nonChar = false;
    } else {                                // This is keypress
        if (nonChar) return;                // Already Handled on keydown
        char = (evt.charCode) ? evt.charCode : evt.keyCode;
        if (char > 31 && char < 256)        // safari and opera
			if( (evt.ctrlKey && evt.altKey) || (!evt.ctrlKey && !evt.altKey)) //allow AltGr
				Keyhandler_Char(char, evt);
    }    
    
    if(evt.ctrlKey && !nonChar && evt.type == "keydown")
    {
		let tmp = Keyhandler_Combo(char, evt) //love tristate boolean :D
		Combo = (tmp == undefined) ? Combo : tmp;
		
		if(!Combo){
			evt.stop();
			evt.returnValue = false;
		}
	}
	
	if (e && !Combo && nonChar)				// Non IE
		evt.stop();							// Using prototype
    else if (evt.keyCode == 8 || evt.keyCode == 9)
        evt.returnValue = false;            // and stop it!
}

/******************************************************************************
	MOUSE WHEEL EVENT HANDLERS
******************************************************************************/
// function wheel(event)
// {
// 	let delta = 0;
// 	if (!event) // For IE.
// 		event = window.event;
// 	if (event.wheelDelta) { // IE/Opera. 
// 		delta = event.wheelDelta/120;
	
// 	// In Opera 9, delta differs in sign as compared to IE.
// 	if (window.opera)
// 		delta = -delta;
// 	}else if (event.detail) { 
// 		// Mozilla
// 		delta = -event.detail/3;
// 	}
	
// 	//Target for scroll event
// 	let targ;
// 	if (event.target) 
// 		targ = event.target;
// 	else if (event.srcElement) 
// 		targ = event.srcElement;
// 	if (targ.nodeType == 3)
// 	{ 
// 		// defeat Safari bug
// 		targ = targ.parentNode;	
// 	}
	
// 	let mx=my=0;
// 	if(Selection.active){
// 		mx = wheelx - editor_x + scrollOffset()[0] + fontsize[0]; 
// 		my = wheely - editor_y + scrollOffset()[1] + fontsize[1];
// 	}
// 	//Handle non-zero delta, only on content-div
// 	if (delta && (targ.id == "content" 
// 				|| targ.id == "errors"
// 				|| targ.className == "bug"
// 				|| targ.id == "contentContainer"
// 				|| targ.parentNode.id == "content" 
// 				|| targ.parentNode.className ))
// 		handle(delta, mx, my);
	
	
// 	//Defeat event
// 	if (event.preventDefault)
// 		event.preventDefault();
// 	event.returnValue = false;
// }

//Mouse Scroll handler
// function handle(delta, mx, my)
// {
// 	if (delta < 0)
// 		for(let x=0;x<3;x++)
// 			Editor.move_down(true)
// 	else
// 		for(let x=0;x<3;x++)
// 			Editor.move_up(true)
	
// 	if(Selection.active){
// 		let coord = Curser.getMousePos([mx, my]);
// 		Selection.end_row = coord[0]
// 		Selection.end_col = coord[1]			
// 	}
	
// 	_ErrorExplain.style.display = "none";
// 	isScrolling = true;
// 	Editor.print(true);
// 	scrollTimeDown(50)
// }
/******************************************************************************
	SCROLL OPTIMIZER
******************************************************************************/
let scollTimer = 0;
 isScrolling = false;
function scrollTimeDown(count)
{
	scollTimer = count;
	
	if(!isScrolling){
		isScrolling = true
		scrollTick();
	}
}
function scrollTick()
{
	if(scollTimer-- >0)
		setTimeout(scrollTick, 10)
	else{
		isScrolling = false;
		//alert("Not Scrolling");
	}
}

/******************************************************************************
	SCROLLBAR HANDLER
******************************************************************************/
let DisableGoto = false;
function scrollHandlerY(evt)
{
	let e = evt ? evt : window.event;
	let target = getTarget(e);
	
	if(!DisableGoto) //prevent event refire, from Editor
	{
		//Editor.Goto( Math.floor(target.scrollTop/fontsize[1]) )
		Editor.OffzY( Math.floor(target.scrollTop/fontsize[1]) )
		Editor.print();
		scrollTimeDown(50)
	}
	else
	{
		DisableGoto = false;
	}
	
	if(_scrollbarY.scrollTop != fontsize[1] * Editor.OffzY())
		_scrollbarY.scrollTop = fontsize[1] * Editor.OffzY();
}
function scrollHandlerX(evt)
{
	let e = evt ? evt : window.event;
	let target = getTarget(e);
	
	Curser.scrollX( target.scrollLeft/fontsize[0] );
}
/******************************************************************************
	MOUSE DOWN -> MOVE -> UP -> CLICK
******************************************************************************/
let isPressed = false
function mousedownEvtHandler(evt)
{ 
	let e = evt ? evt : window.event;
	let targ = getTarget(e);
	isPressed = true;
		
	//detect mouseClick event
	mouseclick = true;
	setTimeout(detectClick, clickspeed);
		
	if(targ.id=="content" 
	|| targ.id=="errors"
	|| targ.parentNode.id=="content" 
	|| targ.parentNode.id=="errors" 
	|| targ.parentNode.className
	|| targ.className == "bug")
	{
		if(e.button == 2)
		{
			let left = (e.clientX - editor_x)-10;
			let top = (e.clientY- editor_y)-6;
			// ContextMenu.show(top,left) ;
			return false;
		}
		
		// ContextMenu.hide();
		
		let pageX = scrollOffset()[0];
		let pageY = scrollOffset()[1];
		
		let coord = Curser.getMousePos([
			e.clientX - editor_x + pageX + fontsize[0], 
			e.clientY - editor_y + pageY + fontsize[1]
		]);
		
		if( !Selection.active ){
			Selection.from_row = coord[0]
			Selection.from_col = coord[1]
			Selection.active = true;
		}else{
			Selection.end_row = coord[0]
			Selection.end_col = coord[1]
		}
	}else
		Selection.active = false;
	
	return document.defaultAction
}

function mousemoveEvtHandler(evt)
{ 
	let e = evt ? evt : window.event;
	if(e.button == 2)
		return false;
		
	wheelx = e.clientX;
	wheely = e.clientY;
	
	// _ErrorExplain.style.top = (wheely - editor_y + 5) + "px";
	// _ErrorExplain.style.left = (wheelx - editor_x + 5) + "px";
	
	if(Selection.active && isPressed)
	{
		let pageX = scrollOffset()[0];
		let pageY = scrollOffset()[1];
	
		let coord = Curser.getMousePos([
			e.clientX - editor_x + pageX + fontsize[0], 
			e.clientY - editor_y + pageY + fontsize[1]
		]);
		
		Selection.end_row = coord[0]
		Selection.end_col = coord[1]
		Editor.print();
	}
	return document.defaultAction
}

function mouseupEvtHandler(evt)
{ 
	let e = evt ? evt : window.event;
	if(e.button == 2)
		return false;
		
	let targ = getTarget(e);
	isPressed = false;
	
	if(targ.id=="content" 
	|| targ.id=="errors"
	|| targ.parentNode.id=="content" 
	|| targ.parentNode.id=="errors" 
	|| targ.parentNode.className
	|| targ.className == "bug")
	{
		let pageX = scrollOffset()[0];
		let pageY = scrollOffset()[1];
		
		let coord = Curser.getMousePos([
			e.clientX - editor_x + pageX + fontsize[0], 
			e.clientY - editor_y + pageY + fontsize[1]
		]);
		
		Curser.setCurser([
			e.clientX - editor_x + pageX + fontsize[0], 
			e.clientY - editor_y + pageY + fontsize[1]
		]);
		
		Selection.end_row = coord[0]
		Selection.end_col = coord[1]
	}
	Selection.active = false;
	
	if(e.ctrlKey){
		Selection.dubbleClick(coord);
	}
	
	return document.defaultAction
}

let mouseclick = false;
function detectClick(){
	mouseclick = false;
}

let mousedoubleclick = false;
function detectDoubleClick(){
	mousedoubleclick = false; 
}

function clickEvtHandler(e)
{ 
	let e = e ? e : window.event;
	window.focus();
	
	if(mousedoubleclick || e.ctrlKey)
	{
		mousedoubleclick = false;
		
		let pageX = scrollOffset()[0];
		let pageY = scrollOffset()[1];
	
		let coord = Curser.getMousePos([
			e.clientX - editor_x + pageX + fontsize[0], 
			e.clientY - editor_y + pageY + fontsize[1]
		]);
		
		Selection.dubbleClick(coord);
	}else{
		mousedoubleclick = true;
		setTimeout(detectDoubleClick, clickspeed)
	}	
	
	Editor.print();
	return document.defaultAction;
}


EditorContent.push("<html>");
EditorContent.push("<head>");
EditorContent.push("	<title></title>");
EditorContent.push("</head>");
EditorContent.push("</html>");
