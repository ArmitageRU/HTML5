 "use strict";
function Ship(ctx, image, rectangle){
    this.id;
    this.position;
    this.parentShipId = null;
    this.shift = 0;

    this.origin = new Point(0, 0);

    //храним для возвращения из битвы
    this.prevPos;
    this.prevRot;
    this.prevRoute;
    this.prevScale;

    //значения инициализации для битвы
    this.battlePos;
    this.battleRot;
    this.battleRoute;

    this.inBattle = false;
    this.ctx = ctx;
    this.tile = new Tile(ctx, image, rectangle.x, rectangle.y, rectangle.width, rectangle.height, rectangle.scale);//new Tile(ctx, image, 28, 804, 199, 163, 0.3);//надо менять
	this.route;
	this.rot = -Math.PI;
	this.speed = 90; //pixel per second e.g.
	this.energy = 1900;
	this.recharge = 130;//скорость зарядки батареи
	this.weapons = [];

	this.money=20000;
	this.cargoCapacity=10;
	this.cargo = [];

	this.life = {
	    max:100,
        current:80
	};
	this.hud = new HUD(ctx, this.tile, this.life);
};

Ship.prototype = {
	render:function(time){
		var path = this.speed*time*0.001;
		if(this.route != null && this.route.to!=null && this.route.to!=this.route.from){	
			this.rot = Math.atan2(this.position.y-this.route.to.y, this.position.x-this.route.to.x)-Math.PI / 2;
			var dir_vector = new Point(this.route.to.x-this.position.x, this.route.to.y-this.position.y);
			var dir_length = this.VLength(dir_vector);
			var new_pos = new Point(path*dir_vector.x/dir_length, path*dir_vector.y/dir_length);
			this.position = new Point(new_pos.x + this.position.x, new_pos.y + this.position.y);
			if(this.VLength(new_pos) > this.VLength(new Point(this.route.to.x-this.route.from.x, this.route.to.y-this.route.from.y))){
				this.position = this.route.from;
			}
		}
		this.tile.draw(this.position, this.rot);
		if (this.route!=null)this.route.from = this.position;
	},

	renderBattleMode: function (time) {
	    if (!this.inBattle) {
	        this.battlePrepare(pos, rot, route, scale);
	        this.inBattle = true;
	    }

        /*
	    var x = 0,// = this.id === 0 ? 120 : this.ctx.canvas.width - 120,
            rot = 0,// = this.id === 0 ? this.rot - Math.PI / 2 : this.rot + Math.PI / 2,
            y = this.ctx.canvas.height / 2;
        //координаты
	    if (this.shift > 0) {
	        y -= this.tile.sHeight / 2 + 100;
	    }
	    if (this.shift < 0) {
	        y += this.tile.sHeight / 2 + 100;
	    }

	    if (this.parentShipId == null && this.id == 0) {
	        x = 120;
	    }
	    else if (this.parentShipId == null && this.id > 0) {
	        x = this.ctx.canvas.width - 120;
	    }
	    //поворот
	    if (this.parentShipId == null && this.id == 0) {
	        rot = this.rot - Math.PI / 2;
	    }
	    else if (this.parentShipId == null && this.id > 0) {
	        rot = this.rot + Math.PI / 2;
	    }

	    this.position = new Point(x+this.origin.x, y+this.origin.y);
	    this.tile.drawScale(this.position, rot, 1);
	    if(this.subShip==0)this.hud.render(time, this.position, 1);
        */
	},
	
	battlePrepare: function (pos, rot, route, scale) {
	    this.prevPos = this.position;
	    this.prevRot = this.rot;
	    this.prevRoute = this.route;
	    this.prevScale = this.tile.scale;

	    this.position = pos;
	    this.rot = rot;
	    this.route = route;
	    this.tile.scale = scale;
	},

	battleDebriefing: function() {
	    this.position = this.prevPos;
	},

	VLength:function(vector){
		return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y,2));
	},

	AddCargo:function(id, quantity, cost){
		if(quantity<0)this.RemoveCargo(id, quantity*-1, cost);
		else{
			var found = false;
			for(var i = 0;i<this.cargo.length;i++){
				if(this.cargo[i].id==id){
					this.cargo[i].quantity+=quantity;
					this.cargo[i].worth+=cost*quantity;
					found = true;
					break;
				}
			}
			if(!found)this.cargo.push(new Commodity(id, quantity, cost));
			this.money-=cost*quantity;
		}
	},
	
	RemoveCargo:function(id, quantity, cost){
		for(var i = 0;i<this.cargo.length;i++){
			if(this.cargo[i].id==id){
				if(this.cargo[i].quantity ==quantity){
					this.cargo.splice(i,1);
					break;
				}
				else {
					this.cargo[i].Reduction(quantity);
					break;
				}
			}
		}
		this.money+=cost*quantity;
	},
		
	InCargo:function(){
		var cargo_amount =0;
		for(var i = 0;i<this.cargo.length;i++){
			cargo_amount+=this.cargo[i].quantity
		}
		return cargo_amount;
	},

	InCargoParticular:function(id){
		var cargo_amount =0;
		for(var i = 0;i<this.cargo.length;i++){
			if(this.cargo[i].id==id){
				cargo_amount=this.cargo[i].quantity;
				break;
			}
		}
		return cargo_amount;
	},
	
	GetCommodityProfit:function(id, cost){
		var profit = 0;
		for(var i = 0;i<this.cargo.length;i++){
			if(this.cargo[i].id==id){
				profit = cost-this.cargo[i].AverageCost();
				break;
			}
		}
		return profit;
	}	
};