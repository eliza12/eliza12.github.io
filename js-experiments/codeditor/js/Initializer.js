

var EditorContent = new Array();
var writeroot;
var hasFocus = false;
var wheelx, wheely; //BugFix for Firefox 2.0 wheel event :-(
var isScrolling = false;
var ctrlPressed = false;
var clickspeed = 400;

var Curser;
var Editor;
var Selection;
var CopyPaste;
var UndoRedo;
var Intellisense;
var ContextMenu;

//placement of editor
var editor_x = 80;
var editor_y = 50;
var cols = 80;
var rows = 30;
var fontsize = [10,18];

//markers
var _post1;
var _post2;
var _pre1;
var _pre2;
var _xmlStart;
var _xmlFinish;

//editor
var __content;
var _curser;
var _errors;
var _editorinfo;
var _editor;
var _contentContatiner;
var _secondary;
var _linenumbers;
var _scrollbarY;
var _scrollbarX;
var _contextmenu;
var _intellisense;
// var _errors;
var _ErrorExplain;


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
	var evt = e ? e : window.event;
	
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
	var evt = e ? e : window.event;
	
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

var nonChar = false;
var Combo = false;
function handleKeys(e) 
{
	isScrolling = false;
	var char;
    var evt = (e) ? e : window.event;       //IE reports window.event not arg
    
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
            char == 46                    // Devare Key (Add to these if you need)
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
		var tmp = Keyhandler_Combo(char, evt) //love tristate boolean :D
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
	SCROLL OPTIMIZER
******************************************************************************/
var scollTimer = 0;
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
var DisableGoto = false;
function scrollHandlerY(evt)
{
	var e = evt ? evt : window.event;
	var target = getTarget(e);
	
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
	var e = evt ? evt : window.event;
	var target = getTarget(e);
	
	Curser.scrollX( target.scrollLeft/fontsize[0] );
}
/******************************************************************************
	MOUSE DOWN -> MOVE -> UP -> CLICK
******************************************************************************/
var isPressed = false
function mousedownEvtHandler(evt)
{ 
	var e = evt ? evt : window.event;
	var targ = getTarget(e);
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
			var left = (e.clientX - editor_x)-10;
			var top = (e.clientY- editor_y)-6;
			// ContextMenu.show(top,left) ;
			return false;
		}
		
		// ContextMenu.hide();
		
		var pageX = scrollOffset()[0];
		var pageY = scrollOffset()[1];
		
		var coord = Curser.getMousePos([
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
	var e = evt ? evt : window.event;
	if(e.button == 2)
		return false;
		
	wheelx = e.clientX;
	wheely = e.clientY;
	
	// _ErrorExplain.style.top = (wheely - editor_y + 5) + "px";
	// _ErrorExplain.style.left = (wheelx - editor_x + 5) + "px";
	
	if(Selection.active && isPressed)
	{
		var pageX = scrollOffset()[0];
		var pageY = scrollOffset()[1];
	
		var coord = Curser.getMousePos([
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
	var e = evt ? evt : window.event;
	if(e.button == 2)
		return false;
		
	var targ = getTarget(e);
	isPressed = false;
	
	if(targ.id=="content" 
	|| targ.id=="errors"
	|| targ.parentNode.id=="content" 
	|| targ.parentNode.id=="errors" 
	|| targ.parentNode.className
	|| targ.className == "bug")
	{
		var pageX = scrollOffset()[0];
		var pageY = scrollOffset()[1];
		
		var coord = Curser.getMousePos([
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

var mouseclick = false;
function detectClick(){
	mouseclick = false;
}

var mousedoubleclick = false;
function detectDoubleClick(){
	mousedoubleclick = false; 
}

function clickEvtHandler(e)
{ 
	var e = e ? e : window.event;
	window.focus();
	
	if(mousedoubleclick || e.ctrlKey)
	{
		mousedoubleclick = false;
		
		var pageX = scrollOffset()[0];
		var pageY = scrollOffset()[1];
	
		var coord = Curser.getMousePos([
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
