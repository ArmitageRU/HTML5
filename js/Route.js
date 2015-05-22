"use strict";
function Route(){
	this.from = null;
	this.to = null;
	this.actualLength = null;
	this.elapsedTime=0;
};

Route.prototype = {
	RenderPath:function(ctx, frameTime){
		this.elapsedTime += frameTime*0.0001;		
		if(this.elapsedTime>1)this.elapsedTime = frameTime*0.001;//Math.PI*2 - frameTime*0.001;
		
		//var dot0 = Math.abs(Math.sin(this.elapsedTime)); 
		//var dot1 = Math.abs(Math.sin(this.elapsedTime+Math.PI/2)); 
		//var dot2 = Math.abs(Math.sin(this.elapsedTime+Math.PI)); 
		//var dot3 = Math.abs(Math.sin(this.elapsedTime+Math.PI*3/2)); 
		
		var dot0 = 0+ this.elapsedTime;
		var dot1 = 0.25+ dot0; if(dot1>1)dot1=1-dot1;
		var dot2 = 0.5 + dot0; if(dot2>1)dot2=1-dot2;
		var dot3 = 0.75 + dot0; if(dot3>1)dot3=1-dot3
		var dot4 = 1 + dot0; if(dot4>1)dot4 = 1-dot4;
		
		//console.log(dot0+" [0] "+dot1+" [1] "+dot2+" [2] "+dot3+" [3] "+dot4+" [4] "); 
		
		ctx.beginPath();
		ctx.lineWidth = 25;
		
		var grad= ctx.createLinearGradient(300, 300, 700, 300);
		grad.addColorStop(dot0, "red");
		if(dot1>=0 && dot1<=1)grad.addColorStop(dot1, "red");
		if(dot2>=0 && dot2<=1)grad.addColorStop(dot2, "white");
		if(dot3>=0 && dot3<=1)grad.addColorStop(dot3, "red");
		if(dot4>=0 && dot4<=1)grad.addColorStop(dot4, "white");
		
		ctx.moveTo(300, 300);
		ctx.lineTo(700, 300);
		ctx.strokeStyle = grad;
		ctx.stroke();
	}
}