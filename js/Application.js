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
    this.battleInProcess = false;//для единоразового приготовления, скрыть интерфейс например
    //tmp
	this.FAKE;
	this.enemyShip;

	this.currentMode = {
	    preBattle: false,
        inBattle:false,
	    afterBattle: false
	};
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
	    document.getElementById("canvas_wrapper").appendChild(this.canvas);
        if (!this.canvas.getContext('2d')) {
            document.getElementById("canvas_wrapper").innerHTML = '<center>No support 2d context.</center>';
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
		IM.add('img/bigshipshaded.png', 'bigship');
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
		IM.add('img/Plazma2.png', 'plasma');
		
		this.Star = new Star(globalCenter, 50)
		this.Star.ctx = this.ctx;
		this.currentMainContent = this.Star.MainContent;
        //ship section
		this.ship = new Ship(this.ctx, this._images['bigship'], new Rectangle(0, 0, 64, 64, 1));
		this.ship.position = new Point(this.canvas.width-100, this.canvas.height/2);
		this.route = new Route(this.ship.position);
		this.ship.route = this.route;
		this.FAKE.GenerateFakeWeapons(this.ship.slots, this.ctx, this._images['rocket'], this._images['plasma']); //устанавливаем оружие в слоты
		this.ship.phaseActive = function phaseActive() {
		    PrepareBattleMenu(this);
		    var autos = this.GetAuto();
		    if (autos.length > 0) {
		        StarSystem.battle.fire(autos[0].id+'_0');//чтобы метод отработал, как-то криво выглядит
		    }

		};
		this.ship.phaseEnd = function phaseEnd() {
		    HideBattleMenu();
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
		this.currentMode.preBattle = true;
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
                    this.selectPlanet(this.Orbits[j]);
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

            if (this.currentMode.preBattle) {
                this.ship.ResetWeapons();
                this.ship.battleRestore();
                PrepareForBattle(true, this.ship);
				this.initBattle();
				this.currentMode.preBattle = false;
			}

            this.battle.render(elapsedTime, this.mouse);
            
            if (this.currentMode.inBattle) {
                this.battle.showAllParticipants();
                //PrepareBattleMenu(this.ship);

                this.battle.beginPhase();
                this.currentMode.inBattle = false;
            }

            if (this.currentMode.afterBattle) {
                HideSummaryStat(false);
                this.currentMode.afterBattle = false;
            }
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
	    this.FAKE.GenerateFakeWeapons(enemy_ship.slots, this.ctx, this._images['rocket'], this._images['plasma']);
	    enemy_ship.life.current = 1000;
	    enemy_ship.id = 1;
	    //return enemy_ship;
	    this.enemyShip = enemy_ship;
	},

    //только для теста
	initBattle: function () {
	    this.getEnemy();
		var our_pos,
			enemy_pos;
		
	    this.battle = new Battle(this.ctx);
	    our_pos = this.calculateInBattlePosition(new Point(this.canvas.width, this.canvas.height), this.ship.tile, true);
		enemy_pos = this.calculateInBattlePosition(new Point(this.canvas.width, this.canvas.height), this.enemyShip.tile, false);
		this.ship.battlePrepare(our_pos, Math.PI / 2, null, 1);
	    this.enemyShip.battlePrepare(enemy_pos, -Math.PI / 2, null, 1);
	    this.battle.participants[this.battle.participants.length] = new BattleObject(this.ship, 1, this.ship.render);
	    this.battle.participants[this.battle.participants.length] = new BattleObject(this.enemyShip, -1, this.enemyShip.render);
	    this.battle.whenBattleEnding = function battleEnding() {
	        HideBattleMenu();
	    };
	    this.battle.whenBattleEnded = function battleEnded(result) {
	        this.currentMode.afterBattle = true;
	        if (result == 1) {
	            this.ship.statistic.kills++;
	        }
	        if (result == -1) {
	            this.ship.statistic.death++;
	        }
	        this.battle.whenBattleEnded = null;
	    };
	    var ai = new AI(this.enemyShip, this.battle.participants);
	    this.enemyShip.phaseActive = function phaseActive() {
	        ai.phaseActive.call(ai);
	        StarSystem.battle.wantEnd = true;
	    };
	    this.enemyShip.phaseEnd = function phaseEnd() {
	        console.log("enemy ship end phase");
	    };
	},
	
	calculateInBattlePosition: function(size, tile, left){
		var x_offset = tile.sHeight/2+20,
			pos;
		if(x_offset<=110){
			x_offset = 110;
		}
		if(!left){
			pos = new Point(size.x-x_offset, size.y / 2)
		}
		else {
			pos = new Point(x_offset, size.y / 2)
		}
		return pos;
	},

	GetWeaponById: function (w_id) {
	    return this.FAKE.GetWeaponById(w_id);
	}
};
