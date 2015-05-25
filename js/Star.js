"use strict";
function Star(centre, radius){
	this.centre = centre;
	this.radius = radius;
	this.ctx = null;
	
	this.MainContent = new MainContent();
	this.Init();
};

Star.prototype = {
	Init: function(){
		this.MainContent.title = "SunLike system";
		this.MainContent.textData.push("This week we're coming to you a day early to take the wraps off our third major content update. This ");
		this.MainContent.textData.push("announcement means a lot to us, so in this special newsletter our team will talk through the new features of ");
		this.MainContent.textData.push("Powerplay in their own words, and we'llreveal how you'll be able to make your own powerplay in the Elite: ");
		this.MainContent.textData.push("Dangerous galaxy.");
	},
	
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