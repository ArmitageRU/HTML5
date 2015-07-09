 "use strict";
function Ship(ctx, image){
    this.position;
    this.ctx = ctx;
	this.tile = new Tile(ctx, image, 28, 804, 199, 163, 0.3);
	this.route;
	this.rot = -Math.PI / 2;
	this.speed = 90; //pixel per second e.g.
	this.energy = 900;
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
		if(this.route.to!=null && this.route.to!=this.route.from){	
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
		this.route.from=this.position;
	},

	renderBattleMode: function (time, forward, left) {
	    var point = new Point(left ? 120 : this.ctx.canvas.width - 120, this.ctx.canvas.height / 2);
	    this.tile.drawScale(point, forward ? Math.PI / 2 : -Math.PI / 2, 1);
	    this.hud.render(time, point, 1);
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