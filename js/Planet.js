"use strict";
function Planet(title){
	this.position = new Point(0,0);
	this.angle = ~~(Math.random()*360);
	this.speed = 1/~~(Math.random()*240);//Math.random()*0.00001+0.00001;
	this.title = title;
	this.orbit;
	this.selected = false;
};

Planet.prototype = {
	Draw: function(deltaTime){
		this.position.x = this.orbit.centre.x + this.orbit.radius * Math.cos(this.angle);
        this.position.y = this.orbit.centre.y + this.orbit.radius * Math.sin(this.angle);
        this.angle += this.speed * deltaTime*0.001;
		var ctx = this.orbit.ctx;
        ctx.lineWidth = 1;
		if(this.selected)ctx.strokeStyle = 'white';
		else ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 25, 0, Math.PI * 2, true);
		ctx.fillStyle = 'blue';
		ctx.fill();
		ctx.closePath();
        ctx.stroke();
	}
};