"use strict";
/*Не нужен, будет хранится на сервере*/
function Goods(){
	this.items = [];
	this.FillItems();
};
Goods.prototype = {
	FillItems:function(){
		var item1 = {
			id:100,
			title:"Algae",
			desription:"Algae are a range of biological organisms grown in water. Considered edible and often locally produced to sustain life in many poorer outposts. Usually commercially processed to provide more appetising food stuffs as a constituent of food cartridges for 'chefs' (cheap 3D food printers).";
		}
		this.items.push(item1);
		var item2 = {
			id:100,
			title:"Animal Meat",
			desription:"Flesh - and other elements - harvested from a vast selection of once-living creatures. In many places a luxury item with some ceremonial importance. Illegal in some jurisdictions.";
		}
		this.items.push(item2);
		var item3 = {
			id:100,
			title:"Coffee",
			desription:"A good source of caffeine to fuel to the creative economics. Many attempts have been made to supplant it but all inevitably fail. Some claim the archaic ritual of grinding beans is a key part of the experience.";
		}
		this.items.push(item3);
		var item4 = {
			id:100,
			title:"Fish",
			desription:"Flesh from once-living aquatic organisms sold as food stuff. Illegal in some jurisdictions.";
		}
		this.items.push(item4);
		var item5 = {
			id:100,
			title:"Food Cartridges",
			desription:"Cartridges for 'chefs' (cheap 3D food printers). These dehydrated components are reconstituted into a variety of shapes using a 3D printing technique. Components are mixed with water and flavourings as they are printed, according to the desired food item template for colour, texture and taste.""Burgers"" and ""Hotdogs"" are common standard template choices in most chefs.";
		}
		this.items.push(item5);
		var item6 = {
			id:100,
			title:"Fruit and Vegetables",
			desription:"A diverse selection of plant-based produce, usually grown in bulk on outdoor worlds, used by the luxury food industry and for direct consumption by the population.";
		}
		this.items.push(item6);
		var item7 = {
			id:100,
			title:"Grain",
			desription:"Inexpensive and intensively grown in various forms on many outdoor worlds. Mainly consumed as bread but also forms a key constituent of many industrially produced foods.";
		}
		this.items.push(item7);
		var item8 = {
			id:100,
			title:"Synthetic Meat",
			desription:"Meat that is synthesised in an industrial scale. The process relies on DNA from species from old Earth. The DNA is adjusted so muscle tissue is grown in huge quantities without the rest of the animal.";
		}
		this.items.push(item8);
		var item9 = {
			id:100,
			title:"Tea",
			desription:"Used ceremonially as well as for its stimulant effects. Tea remains a beverage with historic roots and there is great rivalry between those that drink tea and those that drink coffee.";
		}
		this.items.push(item9);
		var item10 = {
			id:100,
			title:"Liquor",
			desription:"A range of luxury drinks made from distilled, fermented grains and fruits, usually containing a high percentage of alcohol. The narcotic effect means it is illegal in some jurisdictions.";
		}
		this.items.push(item10);
	}
};