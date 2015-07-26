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
	this.battle;
	
	//system screen
	this.currentMainContent;
	this.currentMarketContent = null;
	this.curentShipContent = null;

    //battle
	this.battleActive = true;

    //tmp
	this.FAKE;
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
	    this.FAKE = new FAKES();

	    this.canvas = document.createElement('canvas');
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
        //rocket
		IM.add('img/DiverWithMissleRocket.png', 'rocket');
		
		this.Star = new Star(globalCenter, 50)
		this.Star.ctx = this.ctx;
		this.currentMainContent = this.Star.MainContent;
        //ship section
		this.ship = new Ship(this.ctx, this._images['ships'], new Rectangle(28, 804, 199, 163, 0.3));
		this.ship.position = new Point(this.canvas.width-100, this.canvas.height/2);
		this.route = new Route(this.ship.position);
		this.ship.route = this.route;
		this.ship.weapons = this.FAKE.GenerateFakeWeapons(this.ctx, this._images['rocket']);
		this.ship.phaseActive = function phaseActive() {
		    PrepareBattleMenu(this.ship, 0);
		};
		this.ship.id = 0;
		//system screen
		for(var i = 0; i < 8; ++i){
			var nextOrbit = this.generateOrbit();
			if(nextOrbit!=-1){
				var orbit = new Orbit(nextOrbit, globalCenter, 'Планета — '+nextOrbit,this.ctx, this._images, this.ship);
				this.Orbits.push(orbit);
			}
		}
		this.mouse = new MouseController(this.canvas);
		this.enemyShip = this.getEnemy();
		this.enemyShip.id = 1;

		this.initBattle();
	},
	render: function(lastTime) {
        var curTime = new Date();
        var self = this,
            ctx = this.ctx,
            elapsedTime = curTime - lastTime;
        requestAnimationFrame(function(){
            self.render(curTime);
        });
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.battleActive) {
            self.Star.Draw(elapsedTime);
            this.route.to = null;
            this.currentMainContent = this.Star.MainContent;
            this.currentMarketContent = null;
            for (var j = 0; j < this.Orbits.length; j++) {
                this.Orbits[j].Draw(elapsedTime);
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
            this.route.RenderPath(this.ctx, elapsedTime);
            this.ship.render(elapsedTime);
            this.mouse.pressed = false;

            FillTabs(this.currentMainContent, this.currentMarketContent);
        }
        else if (this.battleActive) {
            this.battle.begin();
            //PrepareForBattle(true, this.ship);
            this.battle.render(elapsedTime);
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
	    var random_ship = ~~(getRandomArbitrary(0, this.FAKE.ships.length));
	    var enemy_ship = new Ship(this.ctx, this._images['ships'], new Rectangle(this.FAKE.ships[random_ship].x, this.FAKE.ships[random_ship].y, this.FAKE.ships[random_ship].width, this.FAKE.ships[random_ship].height, 0.3));
	    //enemy_ship.tile.sx = this.FAKE.ships[random_ship].x;
	    //enemy_ship.tile.sy = this.FAKE.ships[random_ship].y;
	    //enemy_ship.tile.sWidth = this.FAKE.ships[random_ship].width;
	    //enemy_ship.tile.sHeight = this.FAKE.ships[random_ship].height;
	    return enemy_ship;
	},

    //только для теста
	initBattle: function () {
	    this.battle = new Battle(this.ctx);
	    this.ship.battlePrepare(new Point(120, this.canvas.height / 2), Math.PI / 2, null, 1);
	    this.enemyShip.battlePrepare(new Point(this.canvas.width - 120, this.canvas.height / 2), -Math.PI / 2, null, 1);
	    this.battle.participants[this.battle.participants.length] = new BattleObject(this.ship, this.enemyShip, this.ship.render);
	    this.battle.participants[this.battle.participants.length] = new BattleObject(this.enemyShip, this.ship, this.enemyShip.render);
	}
};
