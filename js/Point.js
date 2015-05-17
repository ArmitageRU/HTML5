"use strict";
function Point(x,y){
	this.x;
	this.y;
	
	this.Set(x,y);
};

Point.prototype = {
	Set:function(x,y){
		this.x = x||0;
		this.y = y||0;
	}

};