"use strict";
var Application = function(){
	this.canvas;
	this.ctx;
	//this.canvasCentre;
	this.Star;
	this.Orbits = [];
	
	this.pre_init();
};

Application.prototype = {
	pre_init:function(){
		var self = this;
		window.onload = function(){
			self.init();
		}
	},
	init:function(){
		this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        if (!this.canvas.getContext('2d')) {
            document.body.innerHTML = '<center>No support 2d context.</center>';
            return false;
        }
		this.canvas.width  = 1440;
        this.canvas.height = 900;
        this.ctx = this.canvas.getContext('2d');
        var globalCenter = new Point(this.canvas.width / 2, this.canvas.height / 2);
		this.Star = new Star(globalCenter, 50).setProperty({ctx:this.ctx}, true);
		for(var i = 0; i < 8; ++i){
			var nextOrbit = this.generateOrbit();
			if(nextOrbit!=-1){
				var orbit = new Orbit(nextOrbit, 'text');
				orbit.setProperty({ctx:this.ctx}, true);
				orbit.setProperty({centre:globalCenter}, true);
				this.Orbits.push(orbit);
			}
		}
		console.warn(this.Orbits.length);
		this.render(new Date());
	},
	render: function(lastTime) {
        var curTime = new Date();
        var self    = this,
            ctx     = this.ctx;
        requestAnimationFrame(function(){
            self.render(curTime);
        });
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		self.Star.Draw(curTime-lastTime);
		for(var j = 0;j<this.Orbits.length;j++)this.Orbits[j].Draw(curTime-lastTime);
    },
	
	generateOrbit: function(){
		var min = 50;
		var max = 450;
		var randomOrbit = ~~(getRandomArbitrary(min, max));
		var finalOrbit = Math.ceil(randomOrbit/50)*50-25;
		if(finalOrbit==25)finalOrbit=-1;
		else{
			for(var i = 0;i<this.Orbits.length;i++){
				if(this.Orbits[i].radius==finalOrbit){
					finalOrbit = -1;
					break;
				}
			}
		}
		return finalOrbit;
	}
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}