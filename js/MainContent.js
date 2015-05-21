"use strict";
function MainContent(){
	this.title;
	this.textData = [];
	
	//this.upper_left = upper_left;
	//this.lower_right = lower_right;
};

MainContent.prototype={
	Render:function(ctx, mouse, upper_left, lower_right){
		//this.ctx.beginPath();
		//this.ctx.lineWidth = 1;
		//this.ctx.strokeStyle = 'white';
		ctx.fillStyle = 'white';
		ctx.font = '12pt Courier New';
		ctx.fillText(this.title, upper_left.x+5, upper_left.y+5);
		
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(upper_left.x+5-0.5, upper_left.y+15+0.5);
		ctx.lineTo(lower_right.x-5-0.5, upper_left.y+15+0.5);
		ctx.stroke();
		
		var actual_x = upper_left.x+5;
		var actual_y = upper_left.y+35;
		
		for(var i = 0;i<this.textData.length;i++){
			ctx.fillText(this.textData[i], actual_x, actual_y);
			actual_y+=15;
		}
	}
}