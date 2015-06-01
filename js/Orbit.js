"use strict";
function Orbit(radius, centre, title, ctx, images, ship){
	this.radius = radius;
	var image_num = Math.floor(Math.random() * (18+1 - 1)) + 1; 
	this.planet = new Planet(title, images['planet'+image_num], ctx);
	this.planet.orbit=this;
	this.planet.MarketContent.ship = ship;
	this.ctx=ctx;
	this.centre=centre;
	//this.Infobox=new Infobox(this.centre).setProperty({'ctx':this.ctx}, true);
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
