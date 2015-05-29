"use strict";
function Ship(ctx, image){
	this.position;
	this.tile = new Tile(ctx, image, 28, 804, 199, 163, 0.3);
	this.route;
	this.rot = -Math.PI / 2;
	this.speed= 90; //pixel per second e.g.

	this.money=1000;
	this.cargoCapacity=10;
};

Ship.prototype = {
	render:function(time){
		var path = this.speed*time*0.001;
		if(this.route.to!=null && this.route.to!=this.route.from){	
			this.rot = Math.atan2(this.position.y-this.route.to.y, this.position.x-this.route.to.x)-Math.PI / 2;
			var dir_vector = new Point(this.route.to.x-this.position.x, this.route.to.y-this.position.y);
			var dir_length = this.VLength(dir_vector);
			var new_pos = new Point(path*dir_vector.x/dir_length, path*dir_vector.y/dir_length);
			this.position = new Point(new_pos.x + this.position.x, new_pos.y + this.position.y);
			if(this.VLength(new_pos) > this.VLength(new Point(this.route.to.x-this.route.from.x, this.route.to.y-this.route.from.y))){
				this.position = this.route.from;
			}
		}
		this.tile.draw(this.position, this.rot);
		this.route.from=this.position;
	},
	
	VLength:function(vector){
		return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y,2));
	}
};