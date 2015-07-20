"use strict";
function Tile(ctx, image, sx, sy, sw, sh, scale){
	this.ctx = ctx;
	this.img = image;
	this.sx = sx || 0;
	this.sy = sy || 0;
	this.sWidth = sw;
	if (sw == null && image != null) this.sWidth = image.width;
	this.sHeight = sh;
	if (sh == null && image != null) this.sHeight = image.height;
	this.scale = scale|| 1;
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
	
	},

	drawScale: function (pos, rot, scale) {
	    this.ctx.save();
	    this.ctx.translate(pos.x, pos.y);
	    //ctx.rotate(Math.atan2(p.y - y, p.x - x) + Math.PI / 2);
	    this.ctx.rotate(rot);
	    this.ctx.scale(scale, scale);
	    this.ctx.drawImage(this.img, this.sx, this.sy, this.sWidth, this.sHeight, -this.sWidth / 2, -this.sHeight / 2, this.sWidth, this.sHeight);
	    this.ctx.restore();
	}
};