"use strict";
function Ship(ctx, image){
	this.position;
	this.tile = new Tile(ctx, image, 28, 804, 199, 163);
};

Ship.prototype = {
	render:function(){
		this.tile.draw(this.position);
	}
};