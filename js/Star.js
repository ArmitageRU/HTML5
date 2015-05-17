"use strict";
function Star(centre, radius){
	this.centre = centre;
	this.radius = radius;
	this.ctx = null;
};

Star.prototype = {
	Draw: function(elapsedTime){
		var ctx = this.ctx;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0,192,255)';
        ctx.beginPath();
        ctx.arc(this.centre.x, this.centre.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();
	}
};