

function Class_Intellisense()
{
	this.isParsing = ""; 
	
	this.visible = false;	//as Boolean
	var offset = 0;
	var content = null;		//array
	
	//chars that commit the selected match
	this.commitChar = "{}[]().,:;+-*/%&|^!~=<>?@#'\"\\";
	this.commitSpace = true;
	
	this.CommitChars = function()
	{
		if(Editor.getLanguage() === cssParser || htmlInStyle)
			return "{}[]().,:;+*/%&|^!~=<>?@#'\"\\ 0123456789"; //no minus + numbers
		else
			return this.commitSpace ? this.commitChar + " " : this.commitChar;
	}
	//------------------------------------
	this.snippet = function(word)
	{
		if(JSDefinition[word])
			return true;
	}
	
	this.commitSnippet = function(word, tabindex)
	{
		var snip = JSDefinition[word].value;
		var row = Editor.Row();
		var col = 0;
		
		for(var i=1; i<10; i++)
		{
			if( snip.indexOf("$"+i) > -1 )
			{
				var param = prompt("Parameter $"+i + " \n" + snip, "")
				if(param==null){
					window.focus();
					return;
				}
				snip = snip.replace(new RegExp("(\\$"+i+")","g") , param)
			}
		}
		snip = snip.split("\n");
		
		for(var i=0, Line; Line=snip[i]; i++)
		{
			if(Line.indexOf("$0") >-1)
			{
				row = row + i;
				col = tabindex.length + Line.indexOf("$0")
				Line = Line.replace("$0","");
			}
			
			if(i>0)//first line sets index
				snip[i] = tabindex + Line;
		}
		
		var row = Editor.Row();
		var col = Curser.Charcount() - word.length;
		
		Selection.from_row = Selection.end_row = row;
		Selection.from_col = col;
		Selection.end_col = Curser.Charcount();
		Selection.active = true;
		
		UndoRedo.Delete([Selection.from_row, Selection.from_col], Selection.getText() );
		Selection.deleteRange();
		Selection.active = false;
		
		UndoRedo.write([row,col], word);
		byid("clipboard").value = snip.join("\n");
		CopyPaste.Paste();
		window.focus();
	}
	
	this.Commit = function(Char)
	{
		var test = this.commitSpace ? this.commitChar + " " : this.commitChar;
		
		if( test.indexOf(Char) != -1 || arguments[1]) //or forced by enter
		{
			if( this.matched && this.word != content[this.index + offset][0]) //no need to commit...
			{
				var word = content[this.index + offset][0];
				var row = Editor.Row();
				var col = Curser.Charcount() - this.word.length;
				
				Selection.from_row = Selection.end_row = row;
				Selection.from_col = col;
				Selection.end_col = Curser.Charcount();
				Selection.active = true;
				
				if(col != Curser.Charcount()){
					UndoRedo.Delete([Selection.from_row, Selection.from_col], Selection.getText() );
					Selection.deleteRange();
				}
				Selection.active = false;
				
				//UndoRedo.write([row,col], word);
				if(htmlIsAttributeName && htmlInTag && !htmlIsTagName)
				{
				    byid("clipboard").value = word + '=""';
				    CopyPaste.Paste();
				    Curser.move_le();
				}
				else if(!htmlIsAttributeName && htmlInTag && !htmlIsTagName && htmlInHtml)
				{
				    byid("clipboard").value = word;
				    CopyPaste.Paste();
				    Curser.move_ri();
				}
				else{
				    byid("clipboard").value = word;
				    CopyPaste.Paste();
				}
				
				this.hide();
			}
			if(arguments[1]){ this.hide(); }
		}
	};
	
	// this.Content = function(){ return content; }
	this.CommitIndex = function(index)
	{
		var word = Intellisense.Content()[index][0];
		var row = Editor.Row();
		var col = Curser.Charcount() - Intellisense.word.length;
		
		Selection.from_row = Selection.end_row = row;
		Selection.from_col = col;
		Selection.end_col = Curser.Charcount();
		Selection.active = true;
		
		if(col != Curser.Charcount()){
			UndoRedo.Delete([Selection.from_row, Selection.from_col], Selection.getText() );
			Selection.deleteRange();
		}
		Selection.active = false;
		
		//UndoRedo.write([row,col], word);
		byid("clipboard").value = word;
		CopyPaste.Paste();
		
		this.hide();
	};
	
	this.hide = function()
	{
		this.visible = false;
		this.word = "";
		offset = 0;
		_intellisense.style.display = "none";
	};

	//index of popup
	this.index = 0;
	this.matched = false;
	var isHTMLEntity = false;
	var isCSSKey = false;
	var isCSSValue = false;
	var isHTMLTagName = false;
	var isHTMLAttributeName = false;
	
	
	this.word = "";
	
}

