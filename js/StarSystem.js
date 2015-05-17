"use strict";
function StarSystem(title, centre){
	this.title = title;
	this.type;
	this.planets = [];
	this.star;
	this.centre = centre;
};

StarSystem.prototype = {
	draw: function(){
		this.star.draw();
		for(var i = 0;i<this.planets;i++){
			this.planets[i].draw();
		}
	}		
};

