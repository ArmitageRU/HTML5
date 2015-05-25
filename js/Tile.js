"use strict";
function Tile(ctx, image, sx, sy, sw, sh, scale){
	this.ctx = ctx;
	this.img = image;
	this.sx = sx;
	this.sy = sy;
	this.sWidth = sw;
	this.sHeight = sh;
	this.scale = scale;
};

Tile.prototype = {
	draw:function(pos, rot){
		this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        //ctx.rotate(Math.atan2(p.y - y, p.x - x) + Math.PI / 2);
		this.ctx.rotate(rot);
		this.ctx.scale(this.scale, this.scale);
        this.ctx.drawImage(this.img, this.sx, this.sy, this.sWidth, this.sHeight,-this.sWidth / 2, -this.sHeight / 2, this.sWidth, this.sHeight);
        this.ctx.restore();
	
	}
};