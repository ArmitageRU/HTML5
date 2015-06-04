"use strict";
function Commodity(id, quantity, worth){
	this.id=id;
	this.quantity=quantity;
	this.worth=worth*quantity;
};

Commodity.prototype = {
	AverageCost:function(){
		var a_cost =this.worth/this.quantity;
		return a_cost;
	},
	
	Reduction:function(amount){
		var averageCost = this.AverageCost();
		this.quantity-=amount;
		this.worth-=averageCost*amount;
	}
}