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
	this.scale = scale || 1;
	//console.log(ctx, image, sx, sy, this.sWidth, this.sHeight, scale);
    this.test_id = Math.random();
	if ((this.sWidth == 0) && (this.sHeight == 0)) {
	    console.log(this.img);
	    console.log(sx, sy, sw, sh, image.width, image.height, this.img.height, this.img.width);
	    console.log("I [" + this.test_id + "]" + this.sWidth, this.sHeight);
	}

	
};

Tile.prototype = {
	draw:function(pos, rot, selected){
		this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
		this.ctx.rotate(rot);
		this.ctx.scale(this.scale, this.scale);
		this.ctx.drawImage(this.img, this.sx, this.sy, this.sWidth, this.sHeight, -this.sWidth / 2, -this.sHeight / 2, this.sWidth, this.sHeight);

		if (selected) {
		    this.ctx.beginPath();
		    this.ctx.rect(-this.sWidth / 2, -this.sHeight / 2, this.sWidth, this.sHeight);
		    this.ctx.lineWidth = 1;
		    this.ctx.strokeStyle = 'orange';
		    this.ctx.stroke();
		}

        this.ctx.restore();
	
	},

	drawScale: function (pos, rot, scale) {
	    this.ctx.save();
	    this.ctx.translate(pos.x, pos.y);
	    this.ctx.rotate(rot);
	    this.ctx.scale(scale, scale);
	    this.ctx.drawImage(this.img, this.sx, this.sy, this.sWidth, this.sHeight, -this.sWidth / 2, -this.sHeight / 2, this.sWidth, this.sHeight);
	    this.ctx.restore();
	}
};