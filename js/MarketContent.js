"use strict";
function MarketContent(){
	this.Commodity = [];
};

MarketContent.prototype = {

	fulfill: function(planet){

		var commodity_quantity = Math.random()*(15+36)+15;
		for(var i = 0;i<commodity_quantity;i++){
			var c_name = "Товар"+~~(Math.random()*(1000+2000)+1000);
			var c_q = ~~(Math.random()*(200+900)+200);
			var c_b = ~~(Math.random()*(1200+9001)+1200);
			var c_s = ~~(Math.random()*(c_b-50)+c_b-300);

			var commodity = {
				name: c_name,
				quantity: c_q,
				buy: c_b,
				sell: c_s
			}
			this.Commodity.push(commodity);
		}
	}

};