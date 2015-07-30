﻿ "use strict";
function Ship(ctx, image, rectangle){
    this.id;
    this.position;
    this.parentShipId = null;//если вспомогательный объект типа ракет
    //this.shift = 0;
    this.target = null;//пока только корабль, возможно убрать или наоборот исользовать таргет из роута

    this.selected = false;

    //this.origin = new Point(0, 0);

    //храним для возвращения из битвы
    this.prevPos;
    this.prevRot;
    this.prevRoute;
    this.prevScale;

    this.inBattle = false;//индикатор перехода в режим боя

    //функция инициализации
    //для нашего корабля это будет показ интерфейса управления
    this.phaseActive;
    this.phaseEnd;
    
    this.prevMouseState = false;
    this.canShot = true;

    this.ctx = ctx;
    this.tile = new Tile(ctx, image, rectangle.x, rectangle.y, rectangle.width, rectangle.height, rectangle.scale);//new Tile(ctx, image, 28, 804, 199, 163, 0.3);//надо менять
	this.route;
	this.rot = -Math.PI;
	this.speed = 90; //pixel per second e.g.
	this.energyСapacity = 1900;//это чтобы знать до куда восстанавливать
	this.energy = 1900;//это значение изменяется во время боя
	this.recharge = 130;//скорость зарядки батареи
	this.weapons = [];

	this.money=20000;
	this.cargoCapacity=10;
	this.cargo = [];

	this.life = {
	    max:100,
        current:100
	};
	this.hud = new HUD(ctx, this.tile, this.life);
	//this.boundingBox = new Rectangle(this.position.x - this.tile.width / 2, this.position.y - this.tile.height / 2, this.tile.width, this.tile.height);//x, y, width, height, scale
};

Ship.prototype = {
	render:function(time){
		var path = this.speed*time*0.001;
		if(this.route != null && this.route.to!=null && this.route.to!=this.route.from){	
		    this.rot = Math.atan2(this.position.y - this.route.to.y, this.position.x - this.route.to.x);//-Math.PI / 2; <-- я хз зачем это
			var dir_vector = new Point(this.route.to.x-this.position.x, this.route.to.y-this.position.y);
			var dir_length = this.VLength(dir_vector);
			var new_pos = new Point(path*dir_vector.x/dir_length, path*dir_vector.y/dir_length);
			this.position = new Point(new_pos.x + this.position.x, new_pos.y + this.position.y);
			if(this.VLength(new_pos) > this.VLength(new Point(this.route.to.x-this.route.from.x, this.route.to.y-this.route.from.y))){
				this.position = this.route.from;
			}
		}
		this.tile.draw(this.position, this.rot, this.selected);
		if (this.route != null) this.route.from = this.position;
		//if (this.selected) {
		//    this.ctx.beginPath();
		//    this.ctx.rect(this.position.x - this.tile.sWidth / 2, this.position.y - this.tile.sHeight / 2, this.tile.sWidth, this.tile.sHeight);
		//    this.ctx.lineWidth = 1;
		//    this.ctx.strokeStyle = 'orange';
		//    this.ctx.stroke();
		//}
	},

	renderBattleMode: function (time) {
	    if (!this.inBattle) {
	        this.battlePrepare(pos, rot, route, scale);
	        this.inBattle = true;
	    }
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

	battleRestore: function() {
	    this.energy = this.energyСapacity;
	},

	battleDebriefing: function() {
	    this.position = this.prevPos;
	},

	VLength:function(vector){
		return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y,2));
	},

	inBound:function(mouse){
	    var sX = this.position.x - this.tile.sWidth * this.tile.scale / 2,
	        eX = this.position.x + this.tile.sWidth * this.tile.scale / 2,
            sY = this.position.y - this.tile.sHeight * this.tile.scale / 2,
            eY = this.position.y + this.tile.sHeight * this.tile.scale / 2;

	        if ((Math.PI / 2) == Math.abs(this.rot)) {
	            sX = this.position.x - this.tile.sHeight * this.tile.scale / 2;
	            eX = this.position.x + this.tile.sHeight * this.tile.scale / 2;
	            sY = this.position.y - this.tile.sWidth * this.tile.scale / 2;
	            eY = this.position.y + this.tile.sWidth * this.tile.scale / 2;
	        }
	        //this.ctx.beginPath();
	        //this.ctx.rect(sX, sY, eX-sX, eY-sY);
	        //this.ctx.lineWidth = 5;
	        //this.ctx.strokeStyle = 'white';
	        //this.ctx.stroke();
	        if (mouse.pos.x >= sX && mouse.pos.x <= eX && mouse.pos.y >= sY && mouse.pos.y <= eY) {
	            if (mouse.pressed && (this.prevMouseState == false)) {
	                this.selected = !this.selected;
	                this.prevMouseState = mouse.pressed;
	            }
	            if (!mouse.pressed && (this.prevMouseState==true)) {
	                this.prevMouseState = mouse.pressed;
	            }
	        }

	        return this.selected;
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