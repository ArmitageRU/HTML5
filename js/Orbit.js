"use strict";
function Orbit(radius, point_on_circle, planet){
	this.radius = radius;
	this.POC = point_on_circle;
	this.planet = planet;
	this.ctx;
	this.centre;
};

Orbit.prototype = {
	Draw:function(){
		var ctx = this.ctx;
        ctx.lineWidth = 1;
		ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.centre.x, this.centre.y, this.radius, 0, Math.PI * 2, true);
		//ctx.fillStyle = 'yellow';
		//ctx.fill();
		ctx.closePath();
        ctx.stroke();
	}
};
