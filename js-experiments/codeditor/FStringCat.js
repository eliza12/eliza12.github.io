class FStringCat {
    constructor() {
        this.accumz = "";
    this.list = [];
    }
    
    
    push(what){
        this.accumz += what;
        if(this.accumz.length>2800)
        {
			this.list.push(this.accumz);
			this.accumz = '';
        }
    };
    
    value() {
		this.list.push(this.accumz);
		accumz = '';
		this.list = [ this.list.join("") ];
		return this.list[0];
    };
}