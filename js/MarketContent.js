"use strict";
function MarketContent(){
	this.goods = [];
	this.ship;
};

MarketContent.prototype = {

	Fulfill: function(planet){
	    var FakeGoods = new Goods();//Удалить когда будет серверная часть
		var goods_quantity = ~~(Math.random()*(1+11)+1);
		var c_item = [0,1,2,3,4,5,6,7,8,9,10];//~~(Math.random()*FakeGoods.items.length);/
		shuffle(c_item);
		var i = 0;
		while(c_item[i]<10){
			var c_q = ~~(Math.random()*(200+900)+200);
			var c_b = ~~(Math.random()*(1200+9001)+1200);
			var c_s = ~~(Math.random()*(c_b-50)+c_b-300);
			var item = {
				item: FakeGoods.items[c_item[i]],
				quantity: c_q,
				buy: c_b,
				sell: c_s,
				in_cargo:0
			}
			this.goods.push(item);
			i++;
		}
	},

	ReCalculateInCargo: function(){
		for(var i = 0;i<this.goods.length;i++){
			this.goods[i].in_cargo = this.ship.InCargoParticular(this.goods[i].item.id);
			/*
			for(var j =0;j<this.ship.InCargo();j++){
				if(this.goods[i].item.id==this.ship.items[j]){
					this.goods[i].in_cargo++;
				}
			}
			*/
		}
	}
};