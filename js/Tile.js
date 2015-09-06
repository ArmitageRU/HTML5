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
		    //this.ctx.rect(-this.sWidth / 2, -this.sHeight / 2, this.sWidth, this.sHeight);
		    this.ctx.moveTo(-this.sWidth / 2, -this.sHeight / 2);
		    this.ctx.lineTo(this.sWidth / 2, -this.sHeight / 2)
		    this.ctx.moveTo(-this.sWidth / 2, -this.sHeight / 2);
		    this.ctx.lineTo(this.sWidth / 2, -this.sHeight / 2)
		    this.ctx.lineWidth = 1;
		    this.ctx.strokeStyle = 'orange';
		    this.ctx.stroke();
		}

		    this.ctx.scale(this.sWidth/this.sHeight, 1);
		    this.ctx.beginPath();
		    this.ctx.arc(0, 0, this.sHeight / 2, 0, 2 * Math.PI, false);
		    this.ctx.fillStyle = 'rgba(142, 214, 255, 0.5)';
		    this.ctx.fill();
		    this.ctx.lineWidth = 1;
		    this.ctx.strokeStyle = 'rgba(142, 214, 255, 0.5)';
		    this.ctx.stroke();
        //не работает в связи с невозможностью получить точные координаты
		if (false) {
		    var imageData = this.ctx.getImageData(0, 0, this.sWidth+300, this.sHeight+300);//(-this.sWidth / 2, -this.sHeight / 2, this.sWidth, this.sHeight);
		    var data = imageData.data;

		    for (var i = 0; i < data.length; i += 4) {
		        //var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
		        // red
		        data[i] = 255;//brightness;
		        // green
		        //data[i + 1] = 255;//brightness;
		        // blue
		        //data[i + 2] = 255;//brightness;
		    }
		    // overwrite original image
		    this.ctx.putImageData(imageData, 0, 0);
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