 "use strict";
//Корабль и все что приравнено к нему, сейчас это ракеты (дроны возможно потом)
 function Ship(ctx, image, rectangle) {
    this.id;
    this.position;
    this.parentShipId = null;//если вспомогательный объект типа ракет
    this.target = null;//пока только корабль, возможно убрать или наоборот исользовать таргет из роута
    this.selected = false;
    this.damagedDuration = 300; //константа для this.damaged
    this.damaged = 0;//длительность анимации дамага
    this.death = false;
    this.shieldOpaque = 0;
    this.shieldDuration = 0;//для анисации щита
    this.prevMouseState = false;//нужно для выделения, не хочется держать её здесь, но пока не вижу другого выхода
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
    //а это наоброт когда фаза закончена
    this.phaseEnd;
    this.arrive;//когда добрался до точки

    this.statistic = new Statistic();
    this.Damage = new Damage();

    this.ctx = ctx;
    this.tile = new Tile(ctx, image, rectangle.x, rectangle.y, rectangle.width, rectangle.height, rectangle.scale);//new Tile(ctx, image, 28, 804, 199, 163, 0.3);//надо менять
	this.route;

	this.rot = -Math.PI;//начальный поворот
	this.speed = 90; //pixel per second e.g.
	this.energyСapacity = 1400;//это чтобы знать до куда восстанавливать
	this.energy = 1400;//это значение изменяется во время боя
	this.recharge = 130;//скорость зарядки батареи
	//this.weapons = [];
	this.money=20000;
	this.cargoCapacity=10;
	this.cargo = [];
    //оружейные (и не только) слоты
	this.slots = [
                    {
                        size: 1,
                        class:"weapon"
                    },
                    {
                        size: 2,
                        class: "weapon"
                    },
                    {
                        size: 1,
                        class: "weapon"
                    },
                    {
                        size: 2,
                        class: "shield"
                    },
                    {
                        size: 1,
                        class:"auto"
                    }
	             ];
	this.mass = 95; //масса корабля

	this.life = {
	    max:1000,
        current:1000
	};
	this.hud = new HUD(ctx, this.tile, this.life);
	//this.boundingBox = new Rectangle(this.position.x - this.tile.width / 2, this.position.y - this.tile.height / 2, this.tile.width, this.tile.height);//x, y, width, height, scale
};

Ship.prototype = {
	render:function(time){
	    var path = this.speed * time * 0.001,
            offset,
            offset_point;
		if(this.route != null && this.route.to!=null && this.route.to!=this.route.from){	
		    this.rot = Math.atan2(this.position.y - this.route.to.y, this.position.x - this.route.to.x);//-Math.PI / 2; <-- я хз зачем это
			var dir_vector = new Point(this.route.to.x-this.position.x, this.route.to.y-this.position.y);
			var dir_length = this.VLength(dir_vector);
			var new_pos = new Point(path*dir_vector.x/dir_length, path*dir_vector.y/dir_length);
			this.position = new Point(new_pos.x + this.position.x, new_pos.y + this.position.y);
			if(this.VLength(new_pos) > this.VLength(new Point(this.route.to.x-this.route.from.x, this.route.to.y-this.route.from.y))){
			    this.position = this.route.from;
			    if (this.arrive !== "undefined") {
			        this.arrive.call(this);
			    }
			}
		}
		if (this.damaged > 0) {
		    offset = Math.sin((this.damagedDuration - this.damaged) / this.damagedDuration * 20 * Math.PI) * (20 * this.damaged / this.damagedDuration);
		    offset_point = new Point(this.position.x - offset, this.position.y - offset);
		    if (this.rot == -Math.PI / 2) {
		        offset_point = new Point(this.position.x + offset, this.position.y - offset);
		    }
            this.tile.draw(offset_point, this.rot, this.selected, this.shieldOpaque);
		    this.damaged -= time;
		}
		else { 
		    this.tile.draw(this.position, this.rot, this.selected, this.shieldOpaque);
		}
		if (this.route != null) this.route.from = this.position;

		if (this.life.current <= 0 && this.damaged <= 0) {
		    this.death = true;
		}
	},

	battlePrepare: function (pos, rot, route, scale) {
	    this.prevPos = this.position;
	    this.prevRot = this.rot;
	    this.prevRoute = this.route;
	    this.prevScale = this.tile.scale;
		/*
		var x_offset = this.tile.sHeight/2+20;
		if(x_offset<=110){
			x_offset = 110;
		}
		if(rot == -Math.PI/2){
			this.position = new Point(size.x-x_offset, size.y / 2)
		}
		else {
			this.position = new Point(x_offset, size.y / 2)
		}
		*/
	    this.position = pos;
	    this.rot = rot;
	    this.route = route;
	    this.tile.scale = scale;

	},

	battleRestore: function() {
	    this.energy = this.energyСapacity;
	    this.SwitchShield(true);
	    this.SwitchAuto(true);
	    this.death = false;
	    this.hud.notices = [];
	    //console.log("BR damaged ", this.damaged, " id ", this.id);
	},

	battleDebriefing: function() {
	    this.position = this.prevPos;
	    this.rot = this.prevRot;
	    this.route = this.prevRoute;
	    this.tile.scale = this.prevScale;
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
				if(this.cargo[i].quantity == quantity){
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
		    cargo_amount += this.cargo[i].quantity;
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
	},

	GetDamage: function (weapon, barrels) {
	    var loss = this.Damage.GetDamage(this, weapon, barrels);//~~(Math.random() * (30 - 10) + 10);
	    this.life.current -= loss.damage;//this.GedDamageByShield(loss);

	    switch (loss.hint) {
	        case 'miss':
	            this.hud.notices[this.hud.notices.length] = {
	                text: 'МИМО'
	            }
	            console.log('МИМО');
	            break;
	        case 'guard':
	            this.hud.notices[this.hud.notices.length] = {
	                text: 'БРОНЯ'
	            }
	            console.log('БРОНЯ');
	            break;
	        case 'crit':
	            this.hud.notices[this.hud.notices.length] = {
	                text: 'КРИТИЧЕСКИЙ УРОН'
	            }
	            console.log('КРИТИЧЕСКИЙ УРОН');
	            break;
	        default:
	            break;
	    }

	    if(loss.damage>0) {
	        this.damaged = this.damagedDuration;
	    }
	},

	GedDamageByShield: function(damage) {
	    var shield = this.GetShield(),
            residual_damage = 0,
            residual_shield;
	    if (shield != null && shield.amount.current>0) {
	        residual_damage = ~~(getRandomArbitrary(1, damage));
	        residual_shield = shield.amount.current - residual_damage;
	        shield.amount.current = residual_shield;
	        if (residual_shield < 0) {
	            residual_damage += residual_shield;
	            shield.amount.current = 0;
	        }
	        this.shieldOpaque = 0.1 * Math.ceil(shield.amount.current * 5 / shield.amount.stock);
	        console.log(this.shieldOpaque);
	    }
	    return damage - residual_damage;
	},

	GetDodge: function () {
	    var reference_mass = 70;
	    var total_mass = this.mass,
            ret_val;

	    for (var i = 0, max = this.slots.length; i < max; i += 1) {
	        if (this.slots[i].weapon != null) {
	            total_mass += this.slots[i].weapon.mass;
	        }
	    }
	    ret_val = total_mass / reference_mass;
	    return ret_val;
	},

	GetRecharge: function () {
	    var weapon_energy = 0,
            ret_val = 0;


	    for (var i = 0, max = this.slots.length; i < max; i += 1) {
	        if (this.slots[i].weapon != null) {
	            weapon_energy += this.slots[i].weapon.energy;
	        }
	    }
	    ret_val = (this.energyСapacity - weapon_energy) / this.recharge;
	    return ret_val;
	},

	GetEnergy: function () {
	    var remaining_energy = 0;

	    remaining_energy = this.energyСapacity;
	    for (var i = 0, max = this.slots.length; i < max; i += 1) {
	        if (this.slots[i].weapon != null) {
	            remaining_energy -= this.slots[i].weapon.energy;
	        }
	    }
	    return remaining_energy;
	},

	GetWeapons: function () {
	    var wpns = [],
            found = false;
	    for (var i = 0, max = this.slots.length; i < max; i += 1) {
	        found = false;
	        if (this.slots[i].weapon != null) {
	            for (var j = 0, len = wpns.length; j < len; j++) {
	                if (wpns[j].weapon.id == this.slots[i].weapon.id) {
	                    wpns[j].count++;
	                    found = true;
                        break;
	                }
	            }
	            if (!found) {
	                wpns[wpns.length] = {
	                    weapon: this.slots[i].weapon,
	                    count: 1
	                };
	            }
	        }
	    }
	    return wpns;
	},

	GetWeaponList: function (){
	    var weapons = this.GetWeapons(),
            ret_wpns = [],
            counter = 1,
	        w_count;

	    for (var i = 0, len = weapons.length; i < len; i += 1) {
	        w_count = weapons[i].count;
	        counter = 1;
	        do{
	            ret_wpns[ret_wpns.length] = {
	                id: weapons[i].weapon.id,
	                energy: weapons[i].weapon.energy * counter,
	                title: weapons[i].weapon.title,
	                cls: weapons[i].weapon.class,
	                amount: weapons[i].weapon.amount
	            }
	            counter++;
	        }while(counter<=w_count)
	    }
	    return ret_wpns;
	},

	ResetWeapons: function(){
	    var weapons = this.GetWeapons();
	    for(var i = 0, max = weapons.length;i < max; i+=1) {
	        weapons[i].weapon.reset();
	    }
	},

	SetWeapon: function (slot, weapon) {
	    this.slots[slot].weapon = weapon;
	},

	SwitchShield: function (operation) {
	    //var shield_disabled;
	    if (operation) {//включить щит
	        for (var i = 0, max = this.slots.length; i<max;i+=1){
	            if (typeof this.slots[i].weapon !== "undefined" && this.slots[i].weapon!=null && this.slots[i].weapon.class == 'shield') {
	                if (this.energy < this.slots[i].weapon.energy) {
	                    this.slots[i].weapon.disabled = true;
	                    //shield_disabled = true;
	                }
	                else {
	                    this.energy -= this.slots[i].weapon.energy;
	                    this.slots[i].weapon.disabled = false;
	                    this.shieldOpaque = 0.1 * Math.ceil(this.slots[i].weapon.amount.current * 5 / this.slots[i].weapon.amount.stock);
	                    //shield_disabled = false;
	                }
                    break;
	            }
	        }
	    }
	    else {//выключить
	        for (var i = 0, max = this.slots.length; i < max; i += 1) {
	            if (typeof this.slots[i].weapon !== 'undefined' && this.slots[i].weapon.class == 'shield') {
	                this.slots[i].weapon.disabled = true;
	                //shield_disabled = false;
	                this.energy += this.slots[i].weapon.energy;
                    break;
	            }
	        }
	    }
	    //return shield_disabled;
	},

	SwitchAuto: function (operation) {
	    var AM = this.GetAuto();
        if (AM.length > 0) {
	        if (operation) {//включить auto
	        
	                if (this.energy < AM[0].energy) {
	                    AM[0].disabled = true;
	                }
	                else {
	                    this.energy -= AM[0].energy;
	                    AM[0].disabled = false;
	                }
	       
	        }
	        else {//выключить
	            this.energy += AM[0].energy;
	            AM[0].disabled = true;
	        }
        }
	},

	GetAuto: function () {
	    var autos = [];
	    for (var i = 0, max = this.slots.length; i < max; i += 1) {
	        if (this.slots[i].weapon!=null && typeof this.slots[i].weapon !== 'undefined' && this.slots[i].weapon.class == 'auto') {
	            autos[autos.length] = this.slots[i].weapon;
	            //break;
	        }
	    }
	    return autos;
	},

	GetShield: function () {
	    var shield = null;
	    for (var i = 0, max = this.slots.length; i < max; i += 1) {
	        if (this.slots[i].weapon != null && typeof this.slots[i].weapon !== 'undefined' && this.slots[i].weapon.class == 'shield') {
	            shield = this.slots[i].weapon;
	            break;
	        }
	    }
	    return shield;
	},

	CanEnd: function () {
	    return this.damaged <= 0 && this.hud.notices.length == 0;
	}
};