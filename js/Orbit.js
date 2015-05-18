"use strict";
function Orbit(radius, title){
	this.radius = radius;
	this.planet = new Planet(title).setProperty({'orbit':this}, true);
	this.ctx;
	this.centre;
};

Orbit.prototype = {
	Draw:function(deltaTime){
		var ctx = this.ctx;
        ctx.lineWidth = 1;
		ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.centre.x, this.centre.y, this.radius, 0, Math.PI * 2, true);
		ctx.closePath();
        ctx.stroke();
		
		this.planet.Draw(deltaTime);
	}
};
