"use strict";
function Route(startPoint){
	this.from = startPoint;
	this.to = null;
	this.actualLength = null;
	this.elapsedTime=0;
};

Route.prototype = {
	RenderPath:function(ctx, frameTime){
		if(this.from!=null && this.to !=null){
			var grad= ctx.createLinearGradient(this.from.x, this.from.y, this.to.x, this.to.y);
			grad.addColorStop(0, "green");
			grad.addColorStop(1, "red");
			ctx.beginPath();
			ctx.moveTo(this.from.x, this.from.y);
			ctx.lineTo(this.to.x, this.to.y);
			ctx.strokeStyle = grad;
			ctx.lineWidth = 7;
			ctx.stroke();
		}
	}
}

//28, 804 - 227, 967