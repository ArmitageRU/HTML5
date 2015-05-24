"use strict";
var Application = function(){
	this.canvas;
	this.ctx;
	this.Star;
	this.Orbits = [];
	this.mouse;
	this.Infobox;
	this.pre_init();
	this.route;
	this.ship;
	this._images = {};
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
        var globalCenter = new Point(this.canvas.height / 2, this.canvas.height / 2);
		
		this.Star = new Star(globalCenter, 50).setProperty({ctx:this.ctx}, true);
		for(var i = 0; i < 8; ++i){
			var nextOrbit = this.generateOrbit();
			if(nextOrbit!=-1){
				var orbit = new Orbit(nextOrbit, globalCenter, 'Планета — '+nextOrbit,this.ctx, this.Infobox);
				this.Orbits.push(orbit);
			}
		}
		this.mouse = new MouseController(this.canvas);
		this.Infobox = new Infobox(this.canvas.width, this.canvas.height, this.ctx);
		var IM = {
            store: this._images,
            imagesAdded: 0,
            imagesLoaded: 0,
            add: function(url, name) {
                var self  = this;
                var image = new Image();
                image.onload = function() {
                    self.imagesLoaded++;
                    if (self.imagesAdded == self.imagesLoaded) {
                        self.app.render(new Date());
                        //console.log('init complete over ' + (new Date() - initRunTime) + 'ms');
                    }
                }
                image.src = url;
                this.store[name] = image;
                this.imagesAdded++;
            },
            app: this
        }
        //IM.add('img/sun.png', 'sun');
        //IM.add('img/planets.png', 'planets');
		IM.add('img/ships.png', 'ships');
		this.ship = new Ship(this.ctx, this._images['ships']).setProperty({position:new Point(this.canvas.width-100, this.canvas.height/2)}, true);
		this.route = new Route(this.ship.position);
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
		//var showInfo= -1;
		var selectedPlanet = null;
		this.route.to = null;
		for(var j = 0;j<this.Orbits.length;j++){
			//if(this.Orbits[j].planet.selected)showInfo = j;
			this.Orbits[j].Draw(curTime-lastTime);
			if(this.mouse.pressed && Math.abs(this.mouse.pos.x -this.Orbits[j].planet.position.x)<25 && Math.abs(this.mouse.pos.y-this.Orbits[j].planet.position.y)<25){
				this.selectPlanet(this.Orbits[j]);
			}
			if(this.Orbits[j].planet.selected)selectedPlanet = this.Orbits[j].planet;
			if(this.Orbits[j].planet.to)this.route.to = this.Orbits[j].planet.position;
		}
		//this.Infobox.DrawForm(selectedPlanet, this.mouse);
		this.route.RenderPath(this.ctx, curTime-lastTime);
		this.ship.render();
		this.mouse.pressed = false;
		
		/*GRID*/
		ctx.beginPath();
		ctx.moveTo(this.canvas.width/2, 0);
		ctx.lineTo(this.canvas.width/2, this.canvas.height);
		ctx.moveTo(0, this.canvas.height/2);
		ctx.lineTo(this.canvas.width, this.canvas.height/2);
		ctx.strokeStyle = "yellow";
		ctx.lineWidth = 2;
		ctx.stroke();
		/**/
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
	},
	
	selectPlanet: function(orbit){
		orbit.planet.selected = orbit.planet.selected?false:true;
		if(this.mouse.doublePressed)orbit.planet.setTo();
		
		for(var i = 0;i<this.Orbits.length;i++){
			if(this.Orbits[i]!=orbit)this.Orbits[i].planet.selected = false;
			if(this.mouse.doublePressed && this.Orbits[i]!=orbit)this.Orbits[i].planet.to = false;
		}
	}
};
