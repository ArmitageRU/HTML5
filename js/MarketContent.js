"use strict";
function MarketContent(){
	this.Commodity = [];
	this.ship;
};

MarketContent.prototype = {

	Fulfill: function(planet){
		var FakeGoods = new Goods();//Удалить когда будет серверная часть
		var commodity_quantity = ~~(Math.random()*(1+11)+1);
		var c_item = [0,1,2,3,4,5,6,7,8,9];//~~(Math.random()*FakeGoods.items.length);/
		shuffle(c_item);
		var i = 0;
		while(c_item[i]<=9){
			var c_q = ~~(Math.random()*(200+900)+200);
			var c_b = ~~(Math.random()*(1200+9001)+1200);
			var c_s = ~~(Math.random()*(c_b-50)+c_b-300);
			var commodity = {
				item: FakeGoods.items[c_item[i]],
				quantity: c_q,
				buy: c_b,
				sell: c_s
			}
			this.Commodity.push(commodity);
			i++;
		}
	}
};