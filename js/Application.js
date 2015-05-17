"use strict";
var Application = function(){
	this.canvas;
	this.ctx;
	//this.canvasCentre;
	this.Star;
	this.Planets = [];
	
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
	},
	render: function(lastTime) {
        var curTime = new Date();
        var self    = this,
            ctx     = this.ctx;
        requestAnimationFrame(function(){
            self.render(curTime);
        });
        ctx.clearRect(0, 0, this.width, this.height);
		self.Star.draw();
    }
};