var prevMainContent = null;
var prevMarketContent = null;
//var currentCommodities = [];
//var moneyRest = 0;

var currentStuff = {
    sell: 0, 
    id: 0
}


//Обработчик кнопки "Инфопанель"
function ShowHideInfopanel() {
	if($("#infobox" ).hasClass( "dn" ))$("#infobox").removeClass("dn");
	else $("#infobox").addClass("dn");
}

//Обработчик кнопки "Рынок"
function ShowHideMarketPlace() {
	if(prevMarketContent!=null){
		//prevMarketContent.ReCalculateInCargo();
		//currentCommodities = [];
		//moneyRest = 0;
		if($("#marketplace" ).hasClass( "dn" ))	{
			$("#marketplace").removeClass("dn");
			prevMarketContent = null; //мне не нравится этот момент, он выглядит криво
		}
		else $("#marketplace").addClass("dn");
	}
}

//Доступность кнопки "Инфопанель", "Рынок", "Корабль"
function DisableAppButtons(){
	if(prevMarketContent!=null && $("#app_mrkt_btn").attr('disabled')!== undefined){
		$("#app_mrkt_btn").removeAttr('disabled');
	}
	else if(prevMarketContent==null && $("#app_mrkt_btn").attr('disabled')=== undefined){
		$("#app_mrkt_btn").attr('disabled', 'disabled');
	} 
}

//Заполнение Информацией панелей в соответсвии с выбранной планетой
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
		DrawMarketContent(marketcontent);		
	}
}

//отрисовать таблицу рынка  
function DrawMarketContent(content){
		$('#market_goods tbody').empty();
		if(content!=null){
			content.ReCalculateInCargo();
			$('#ship_cargo_current').html(content.ship.items.length);
			$('#ship_cargo_max').html(content.ship.cargoCapacity);
			$('#ship_money').html(content.ship.money);
			for(var i = 0;i<content.Commodity.length;i++){
				var can_sell = content.Commodity[i].in_cargo==0?"disabled=\"disabled\"":"";
				var can_buy = content.Commodity[i].sell>content.ship.money?"disabled=\"disabled\"":"";
				$('#market_goods tbody').append("<tr onmouseover=\"ShowItemInfo(this);\" onmouseout=\"ClearItemInfo(this);\" id=\""+content.Commodity[i].item.id+"\"><td>"+content.Commodity[i].item.title+
											    "</td><td id=\"B"+content.Commodity[i].item.id+"\">"+content.Commodity[i].buy+
											    "</td><td id=\"S"+content.Commodity[i].item.id+"\">"+content.Commodity[i].sell+
											   	"</td><td id=\"MQ"+content.Commodity[i].item.id+"\">"+content.Commodity[i].quantity+
											  	"</td><td><button onclick=\"ItemSell(this);\" "+can_sell+">-</button></td>"+
											  	"<td id=\"Q"+content.Commodity[i].item.id+"\">"+content.Commodity[i].in_cargo+"</td>"+
											  	"</td><td><button onclick=\"ItemBuy(this);\" "+can_buy+">+</button></td>");
			}
		}
	prevMarketContent = content;
	DisableAppButtons();
}

//Очистка информации о товаре при уводе с него курсора
function ClearItemInfo(obj){
	$('#marketplace_info').html('');
}

//Показ информации о выбранном товаре
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

//Показывать выбранное колличество при покупке/продаже товара, остаток денег, загруженность грузового отсека
function ShowQuantity(val){
	val = parseInt(val);
	$(".marketplace_purchase_input").html(val);
	var money = prevMarketContent.ship.money - currentStuff.sell*val;
	$(".marketplace_purchase_money").html(money);
	var in_cargo = prevMarketContent.ship.items.length+val;
	var cargo_capacity = prevMarketContent.ship.cargoCapacity;
	$(".marketplace_purchase_cargo").html(in_cargo+'/'+cargo_capacity);
}

//Закрываем окно покупок
function ClosePurchaseWindow(option){
	$("#marketplace_veil").addClass("dn");
	$("#marketplace_purchase").addClass("dn");
	if(option=='+'){
		$("#marketplace_purchase_buy").addClass("dn");
		$("#marketplace_purchase_quantity_b").val("1");
	}
	else if(option=='-'){
		$("#marketplace_purchase_sell").addClass("dn");
		$("#marketplace_purchase_quantity_s").val("1");
	}
}

//Обработчик нажатия кнопки "+"(купить) на товаре
function ItemBuy(obj){
	var id = $(obj).closest('tr').attr('id');
	var max_buy = 1;
	$("#marketplace_veil").removeClass("dn");
	$("#marketplace_purchase").removeClass("dn");
	$("#marketplace_purchase_buy").removeClass("dn");

	for(var i = 0;i<prevMarketContent.Commodity.length;i++){
			if(prevMarketContent.Commodity[i].item.id==id){
				$(".marketplace_purchase_title").html(prevMarketContent.Commodity[i].item.title+" ["+prevMarketContent.Commodity[i].sell+"]");			
				max_buy = Math.floor(prevMarketContent.ship.money/prevMarketContent.Commodity[i].sell);
				var free_cargo = prevMarketContent.ship.cargoCapacity-prevMarketContent.ship.items.length;
				if(max_buy>prevMarketContent.Commodity[i].quantity)max_buy=prevMarketContent.Commodity[i].quantity;
				if(max_buy>free_cargo)max_buy = free_cargo;
				currentStuff.sell = prevMarketContent.Commodity[i].sell;
				currentStuff.id = prevMarketContent.Commodity[i].item.id;
				$("#marketplace_purchase_quantity_b").attr('max',max_buy);
				ShowQuantity(1);
				break;
			}
		}
}

//Обработчик нажатия кнопки "-"(продать) на товаре
function ItemSell(obj){
		var id = $(obj).closest('tr').attr('id');
	var max_buy = 1;
	$("#marketplace_veil").removeClass("dn");
	$("#marketplace_purchase").removeClass("dn");
	$("#marketplace_purchase_sell").removeClass("dn");

	for(var i = 0;i<prevMarketContent.Commodity.length;i++){
			if(prevMarketContent.Commodity[i].item.id==id){
				$(".marketplace_purchase_title").html(prevMarketContent.Commodity[i].item.title+" ["+prevMarketContent.Commodity[i].sell+"]");			
				max_buy = Math.floor(prevMarketContent.ship.money/prevMarketContent.Commodity[i].sell);
				var free_cargo = prevMarketContent.ship.cargoCapacity-prevMarketContent.ship.items.length;
				if(max_buy>prevMarketContent.Commodity[i].quantity)max_buy=prevMarketContent.Commodity[i].quantity;
				if(max_buy>free_cargo)max_buy = free_cargo;
				currentStuff.sell = prevMarketContent.Commodity[i].sell;
				currentStuff.id = prevMarketContent.Commodity[i].item.id;
				$("#marketplace_purchase_quantity_s").attr('max',max_buy);
				ShowQuantity(1);
				break;
			}
		}
}

//Выставить колличесво товара для покупки/продажи в максимум
function SetMaxQuantity(operation){
	if(operation=='+'){
		var max = $("#marketplace_purchase_quantity_b").attr('max');
		$("#marketplace_purchase_quantity_b").val(max);
		ShowQuantity(max);
	}
	else if(operation=='+'){
		var max = $("#marketplace_purchase_quantity_s").attr('max');
		$("#marketplace_purchase_quantity_s").val(max);
		ShowQuantity(max);
	}
}
//Подтверждение покупки
function ConfirmPurchase(option){
	var item_id = currentStuff.id;
	var item_quantity = 0;
	if(operation=='+')item_quantity = parseInt($("#marketplace_purchase_quantity_b").val());
	else if(operation=='-')item_quantity = parseInt($("#marketplace_purchase_quantity_s").val());
	prevMarketContent.ship.money-=currentStuff.sell*item_quantity;
	//for(var i = 0;i<item_quantity;i++){
		var buy_item ={
			id:item_id,
			cost:currentStuff.sell,
			quantity:item_quantity
		}
		prevMarketContent.ship.items.push(buy_item);
	//}
	ClosePurchaseWindow(option);
	DrawMarketContent(prevMarketContent);
}