"use strict";
function Infobox(width, height){
	this.width = width;
	this.height = height;
	this.ctx;
};

Infobox.prototype = {
	Show:function(text){
		var ctx = this.ctx;
        ctx.fillStyle = '#0ff';
        ctx.fillText(text, this.width-395, 15);
	},
	
	DrawForm:function(){
		this.ctx.beginPath();
		this.ctx.rect(this.width-399.5, 4.5, 395.5, this.height-5.5);
		this.ctx.fillStyle = '#002244';
		this.ctx.fill();
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = 'white';
		this.ctx.moveTo(this.width-399.5, 19.5);
		this.ctx.lineTo(this.width-4.5, 19.5);
		this.ctx.stroke();	
	}
};