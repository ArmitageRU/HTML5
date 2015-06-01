var prevMainContent = null;
var prevMarketContent = null;
var currentCommodities = [];
var moneyRest = 0;

function ShowHideInfopanel() {
	if($("#infobox" ).hasClass( "dn" ))$("#infobox").removeClass("dn");
	else $("#infobox").addClass("dn");
}

function ShowHideMarketPlace() {
	if(prevMarketContent!=null){
		prevMarketContent.ReCalculateInCargo();
		currentCommodities = [];
		moneyRest = 0;
		if($("#marketplace" ).hasClass( "dn" ))	{
			$("#marketplace").removeClass("dn");
			prevMarketContent = null; //мне не нравится этот момент, он выглядит криво
		}
		else $("#marketplace").addClass("dn");
	}
}

function DisableAppButtons(){
	if(prevMarketContent!=null && $("#app_mrkt_btn").attr('disabled')!== undefined){
		$("#app_mrkt_btn").removeAttr('disabled');
	}
	else if(prevMarketContent==null && $("#app_mrkt_btn").attr('disabled')=== undefined){
		$("#app_mrkt_btn").attr('disabled', 'disabled');
	} 
}

function FillTabs(maincontent, marketcontent) {
	if(maincontent!=null && prevMainContent!=maincontent) {
		$("#origin_title").removeClass("dn");
		$("#origin_avatar").removeClass("dn");

		var full_title = maincontent.title;
		if (maincontent.owner != null)full_title += "( " + maincontent.owner + " )";

		var textData = "";
		for (var i = 0; i < maincontent.textData.length; i++) {
			textData +=  maincontent.textData[i]+"<br/>";
		}
		if (textData.length > 0) {
			textData.substr(0, textData.length - 5);
			$("#origin_textdata").html(textData);
		}
		if (full_title.length > 0)$("#origin_title").html(full_title);
		else $("#origin_title").addClass("dn");

		if (maincontent.avatar != null)$("#origin_avatar").attr("src", maincontent.avatar);
		else $("#origin_avatar").addClass("dn");
		prevMainContent = maincontent;
	}
	
	if(prevMarketContent!=marketcontent){
		$('#market_goods tbody').empty();
		if(marketcontent!=null){
			$('#ship_cargo_current').html(marketcontent.ship.items.length);
			$('#ship_cargo_max').html(marketcontent.ship.cargoCapacity);
			$('#ship_money').html(marketcontent.ship.money);
			//$('#market_goods').append('<tbody></tbody>');
			for(var i = 0;i<marketcontent.Commodity.length;i++){
				$('#market_goods tbody').append("<tr onmouseover=\"ShowItemInfo(this);\" onmouseout=\"ClearItemInfo(this);\" id=\""+marketcontent.Commodity[i].item.id+"\"><td>"+marketcontent.Commodity[i].item.title+
											  "</td><td id=\"B"+marketcontent.Commodity[i].item.id+"\">"+marketcontent.Commodity[i].buy+
											  "</td><td id=\"S"+marketcontent.Commodity[i].item.id+"\">"+marketcontent.Commodity[i].sell+
											  "</td><td id=\"MQ"+marketcontent.Commodity[i].item.id+"\">"+marketcontent.Commodity[i].quantity+
											  "</td><td><button onclick=\"ItemSell(this);\">-</button></td>"+
											  "<td id=\"Q"+marketcontent.Commodity[i].item.id+"\" class=\"market_\">"+marketcontent.Commodity[i].in_cargo+"</td>"+
											  "<td><button onclick=\"ItemBuy(this);\">+</button></td></tr>");
				for(var j = 0;j<marketcontent.Commodity[i].in_cargo;j++){
					currentCommodities.push(marketcontent.Commodity[i].item.id);
				}
			}
		}
	prevMarketContent = marketcontent;
	DisableAppButtons();
	}
}

function ClearItemInfo(obj){
	$('#marketplace_info').html('');
}

function ShowItemInfo(obj){
	//$('#marketplace_info').html('');
	if(prevMarketContent!=null){
		var id = $(obj).attr('id');
		for(var i = 0;i<prevMarketContent.Commodity.length;i++){
			if(prevMarketContent.Commodity[i].item.id==id){
				$('#marketplace_info').html(prevMarketContent.Commodity[i].item.desription);			
				break;
			}
		}
	}
}

function ItemBuy(obj){
	var id = $(obj).closest('tr').attr('id');
	var quantity = $("#Q"+id).html();
	if(AddItemInCargo(id, '+'))$("#Q"+id).html(++quantity);
	//console.warn('item id+: '+id);
}

function ItemSell(obj){
	var id = $(obj).closest('tr').attr('id');
	var quantity = $("#Q"+id).html();
	if(AddItemInCargo(id, '-'))$("#Q"+id).html(--quantity);
	console.warn('item id-: '+id);
}

function AddItemInCargo(id, operation){
	var result = true;

	var inside = parseInt(prevMarketContent.ship.items.length+currentCommodities.length);
	var free = parseInt(prevMarketContent.ship.cargoCapacity-inside);
	var quantity_in_store = parseInt($("#MQ"+id).html());
	var sell_cost = parseInt($("#S"+id).html());
	var buy_cost = parseInt($("#B"+id).html());

	var money = parseInt(prevMarketContent.ship.money+(moneyRest-sell_cost));
	if(operation=='-')money = parseInt(prevMarketContent.ship.money+(moneyRest+buy_cost));

	if(operation=='+'){
		if(free>0 && money>=0 && quantity_in_store>=1){
			//добавляем товар
			currentCommodities.push(id);
			inside++;
			$('#ship_cargo_current').html(inside);
			//изменяем сумму наличных
			moneyRest-=sell_cost;
			$('#ship_money').html(prevMarketContent.ship.money+moneyRest);
			//изменяем колличество имеющегося товара
			$("#MQ"+id).html(--quantity_in_store);
		}
		else result = false;
	}
	if(operation=='-'){
		if(inside>0){
			var index = currentCommodities.indexOf(id);
			if (index >= 0) {
				currentCommodities.splice( index, 1 );
				inside--;
				$('#ship_cargo_current').html(inside);
				//изменяем сумму наличных
				moneyRest+=buy_cost;
				$('#ship_money').html(prevMarketContent.ship.money+moneyRest);
				//изменяем колличество имеющегося товара
				$("#MQ"+id).html(++quantity_in_store);
			}
			else result = false;
		}
		else result = false;
	}

	return result;
}

function ConfirmPurchases(){
	for(var i = 0;i<currentCommodities.length;i++){
		var index = prevMarketContent.ship.items.indexOf(currentCommodities[i]);
		if(index!=-1)prevMarketContent.ship.items = jQuery.grep(prevMarketContent.ship.items, function(value) {return value != currentCommodities[i];});
	}
	for(var j = 0;j<currentCommodities.length;j++){
		prevMarketContent.ship.items.push(currentCommodities[j]);
	}
	prevMarketContent.ship.money += moneyRest;
	ShowHideMarketPlace();
}