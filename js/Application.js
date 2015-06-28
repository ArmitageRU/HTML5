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
	
	//system screen
	this.currentMainContent;
	this.currentMarketContent = null;
	this.curentShipContent = null;

    //battle
	this.battleActive = true;

    //tmp
	this.Ships = [];
	this.enemyShip;
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
        //document.body.appendChild(this.canvas);
        document.getElementById("application").appendChild(this.canvas);
        if (!this.canvas.getContext('2d')) {
			document.getElementById("application").innerHTML = '<center>No support 2d context.</center>';
            return false;
        }
		this.canvas.width  = 1440;
        this.canvas.height = 900;
        this.ctx = this.canvas.getContext('2d');
        var globalCenter = new Point(this.canvas.height / 2, this.canvas.height / 2);
		
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
                    }
                }
                image.src = url;
                this.store[name] = image;
                this.imagesAdded++;
            },
            app: this
        }
		IM.add('img/ships.png', 'ships');
		//planets
		IM.add('img/planets/planet1.png', 'planet1');
		IM.add('img/planets/planet2.png', 'planet2');
		IM.add('img/planets/planet3.png', 'planet3');
		IM.add('img/planets/planet4.png', 'planet4');
		IM.add('img/planets/planet5.png', 'planet5');
		IM.add('img/planets/planet6.png', 'planet6');
		IM.add('img/planets/planet7.png', 'planet7');
		IM.add('img/planets/planet8.png', 'planet8');
		IM.add('img/planets/planet9.png', 'planet9');
		IM.add('img/planets/planet10.png', 'planet10');
		IM.add('img/planets/planet11.png', 'planet11');
		IM.add('img/planets/planet12.png', 'planet12');
		IM.add('img/planets/planet13.png', 'planet13');
		IM.add('img/planets/planet14.png', 'planet14');
		IM.add('img/planets/planet15.png', 'planet15');
		IM.add('img/planets/planet16.png', 'planet16');
		IM.add('img/planets/planet17.png', 'planet17');
		IM.add('img/planets/planet18.png', 'planet18');
		
		this.Star = new Star(globalCenter, 50)
		this.Star.ctx = this.ctx;
		this.currentMainContent = this.Star.MainContent;
		this.ship = new Ship(this.ctx, this._images['ships'])
		this.ship.position = new Point(this.canvas.width-100, this.canvas.height/2);
		this.route = new Route(this.ship.position);
		this.ship.route =this.route;
		//system screen
		for(var i = 0; i < 8; ++i){
			var nextOrbit = this.generateOrbit();
			if(nextOrbit!=-1){
				var orbit = new Orbit(nextOrbit, globalCenter, 'Планета — '+nextOrbit,this.ctx, this._images, this.ship);
				this.Orbits.push(orbit);
			}
		}
		this.mouse = new MouseController(this.canvas);
		//this.Infobox = new Infobox(this.canvas.width, this.canvas.height, this.ctx);
		//tmp
		var tmp_s_obj = {
		    x:64,
		    y:72, 
		    width:128,
		    height:99
		}
		this.Ships.push(tmp_s_obj);
		tmp_s_obj = {
		    x:64,
		    y:320, 
		    width:128,
		    height: 131
		}
		this.Ships.push(tmp_s_obj);
		tmp_s_obj = {
		    x: 32,
		    y: 568,
		    width: 192,
		    height: 131
		}
		this.Ships.push(tmp_s_obj);
		tmp_s_obj = {
		    x: 28,
		    y: 804, 
		    width: 199,
		    height:163
		}
		this.Ships.push(tmp_s_obj);
		tmp_s_obj = {
		    x:32,
		    y:1052, 
		    width: 192,
		    height:168
		}
		this.Ships.push(tmp_s_obj);
		tmp_s_obj = {
		    x:80,
		    y:1332, 
		    width: 95,
		    height:135
		}
		this.Ships.push(tmp_s_obj);
		tmp_s_obj = {
		    x:80,
		    y:1580, 
		    width: 95,
		    height:135
		}
		this.Ships.push(tmp_s_obj);
		tmp_s_obj = {
		    x:32,
		    y:1864, 
		    width: 191,
		    height:127
		}
		this.Ships.push(tmp_s_obj);
		tmp_s_obj = {
		    x:28,
		    y:2108, 
		    width:199,
		    height:135
		}
		this.Ships.push(tmp_s_obj);
		tmp_s_obj = {
		    x:80,
		    y:2388, 
		    width:95,
		    height:83
		}
		this.Ships.push(tmp_s_obj);
		tmp_s_obj = {
		    x:28,
		    y:2596, 
		    width:199,
		    height:263
		}
		this.Ships.push(tmp_s_obj);
		tmp_s_obj = {
		    x:28,
		    y:2980, 
		    width: 199,
		    height: 255
		}
		this.Ships.push(tmp_s_obj);

		this.enemyShip = this.getEnemy();
	},
	render: function(lastTime) {
        var curTime = new Date();
        var self    = this,
            ctx     = this.ctx;
        requestAnimationFrame(function(){
            self.render(curTime);
        });
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.battleActive) {
            self.Star.Draw(curTime - lastTime);
            //var showInfo= -1;
            this.route.to = null;
            this.currentMainContent = this.Star.MainContent;
            this.currentMarketContent = null;
            for (var j = 0; j < this.Orbits.length; j++) {
                //if(this.Orbits[j].planet.selected)showInfo = j;
                this.Orbits[j].Draw(curTime - lastTime);
                if (this.mouse.pressed && Math.abs(this.mouse.pos.x - this.Orbits[j].planet.position.x) < 25 && Math.abs(this.mouse.pos.y - this.Orbits[j].planet.position.y) < 25) {
                    this.selectPlanet(this.Orbits[j])
                }
                if (this.Orbits[j].planet.selected) {
                    this.currentMainContent = this.Orbits[j].planet.MainContent;
                    this.currentMarketContent = this.Orbits[j].planet.MarketContent;
                    this.currentMarketContent.ship = this.ship;
                }
                if (this.Orbits[j].planet.to) this.route.to = this.Orbits[j].planet.position;
            }
            //this.Infobox.DrawForm(selectedPlanet, this.mouse);
            this.route.RenderPath(this.ctx, curTime - lastTime);
            this.ship.render(curTime - lastTime);
            this.mouse.pressed = false;

            FillTabs(this.currentMainContent, this.currentMarketContent);
        }
        else if (this.battleActive) {
            this.ship.tile.drawScale(new Point(120, this.canvas.height / 2), Math.PI / 2, 1);
            this.enemyShip.tile.drawScale(new Point(this.canvas.width - 120, this.canvas.height / 2), -Math.PI / 2, 1);
        }
		/*GRID*/
		/*
		ctx.beginPath();
		ctx.moveTo(this.canvas.width/2, 0);
		ctx.lineTo(this.canvas.width/2, this.canvas.height);
		ctx.moveTo(0, this.canvas.height/2);
		ctx.lineTo(this.canvas.width, this.canvas.height/2);
		ctx.strokeStyle = "yellow";
		ctx.lineWidth = 2;
		ctx.stroke();
		*/
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

		return orbit.planet.selected;
	},

	getEnemy: function () {
	    var random_ship = ~~(getRandomArbitrary(0, this.Ships.length));
	    var enemy_ship = new Ship(this.ctx, this._images['ships']);
	    enemy_ship.tile.sx = this.Ships[random_ship].x;
	    enemy_ship.tile.sy = this.Ships[random_ship].y;
	    enemy_ship.tile.sWidth = this.Ships[random_ship].width;
	    enemy_ship.tile.sHeight = this.Ships[random_ship].height;
	    return enemy_ship;
	}
};
