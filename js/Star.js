"use strict";
function Star(centre, radius){
	this.centre = centre;
	this.radius = radius;
	this.ctx = null;
};

Star.prototype = {
	Draw: function(elapsedTime){
		var ctx = this.ctx;
        
		ctx.lineWidth = 1;
        //ctx.strokeStyle = 'rgb(0,192,255)';
		ctx.strokeStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.centre.x, this.centre.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = 'yellow';
		ctx.fill();
		ctx.closePath();
        ctx.stroke();
		
		/*
		var gradient = ctx.createRadialGradient(this.centre.x, this.centre.y,60,this.centre.x, this.centre.y,0);
		gradient.addColorStop(0,"transparent");
		gradient.addColorStop(1,"green");
		ctx.fillStyle = gradient;
		ctx.fill();
		ctx.fillRect(this.centre.x-50, this.centre.y-50,100,100);
		*/
	}
};