var prevMainContent = null;
var prevMarketContent = null;
//var currentCommodities = [];
//var moneyRest = 0;

var currentStuff = {
    worth: 0,
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
		if(marketcontent.goods.length==0)marketcontent=null;
		DrawMarketContent(marketcontent);		
	}
}

//отрисовать таблицу рынка  
function DrawMarketContent(content){
		$('#market_goods tbody').empty();
		if(content!=null){
			content.ReCalculateInCargo();
			$('#ship_cargo_current').html(content.ship.InCargo());
			$('#ship_cargo_max').html(content.ship.cargoCapacity);
			$('#ship_money').html(content.ship.money);
			for(var i = 0;i<content.goods.length;i++){
				var can_sell = content.goods[i].in_cargo==0?"disabled=\"disabled\"":"";
				var can_buy = content.goods[i].sell>content.ship.money?"disabled=\"disabled\"":"";
				$('#market_goods tbody').append("<tr onmouseover=\"ShowItemInfo(this);\" onmouseout=\"ClearItemInfo(this);\" id=\""+content.goods[i].item.id+"\"><td>"+content.goods[i].item.title+
											    "</td><td id=\"B"+content.goods[i].item.id+"\">"+content.goods[i].buy+
											    "</td><td id=\"S"+content.goods[i].item.id+"\">"+content.goods[i].sell+
											   	"</td><td id=\"MQ"+content.goods[i].item.id+"\">"+content.goods[i].quantity+
											  	"</td><td><button onclick=\"ItemSell(this);\" "+can_sell+">-</button></td>"+
											  	"<td id=\"Q"+content.goods[i].item.id+"\">"+content.goods[i].in_cargo+"</td>"+
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
		for(var i = 0;i<prevMarketContent.goods.length;i++){
			if(prevMarketContent.goods[i].item.id==id){
				$('#marketplace_info').html(prevMarketContent.goods[i].item.desription);			
				break;
			}
		}
	}
}

//Показывать выбранное колличество при покупке/продаже товара, остаток денег, загруженность грузового отсека
function ShowQuantity(val, operation){
	val = parseInt(val);
	$(".marketplace_purchase_input").html(val);
	var money = prevMarketContent.ship.money - currentStuff.worth*val;
	if(operation=='-')money=prevMarketContent.ship.money + currentStuff.worth*val;
	$(".marketplace_purchase_money").html(money);
	var in_cargo = prevMarketContent.ship.InCargo()+val;
	if(operation=='-')in_cargo = prevMarketContent.ship.InCargo()-val;
	var cargo_capacity = prevMarketContent.ship.cargoCapacity;
	$(".marketplace_purchase_cargo").html(in_cargo+'/'+cargo_capacity);
	var profit = (prevMarketContent.ship.GetCommodityProfit(currentStuff.id, currentStuff.worth)).toFixed(1);
	$("#marketplace_purchase_profit").html(profit*val);
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
	currentStuff.id = id;
	var max_buy = 1;
	$("#marketplace_veil").removeClass("dn");
	$("#marketplace_purchase").removeClass("dn");
	$("#marketplace_purchase_buy").removeClass("dn");

	for(var i = 0;i<prevMarketContent.goods.length;i++){
		if(prevMarketContent.goods[i].item.id==id){
			$(".marketplace_purchase_title").html(prevMarketContent.goods[i].item.title+" ["+prevMarketContent.goods[i].sell+"]");			
			max_buy = Math.floor(prevMarketContent.ship.money/prevMarketContent.goods[i].sell);
			var free_cargo = prevMarketContent.ship.cargoCapacity-prevMarketContent.ship.InCargo();
			if(max_buy>prevMarketContent.goods[i].quantity)max_buy=prevMarketContent.goods[i].quantity;
			if(max_buy>free_cargo)max_buy = free_cargo;
			currentStuff.worth = prevMarketContent.goods[i].sell;
			//currentStuff.id = prevMarketContent.goods[i].item.id;
			$("#marketplace_purchase_quantity_b").attr('max',max_buy);
			break;
		}
	}
	ShowQuantity(1, '+');
}

//Обработчик нажатия кнопки "-"(продать) на товаре
function ItemSell(obj){
	var id = $(obj).closest('tr').attr('id');
	currentStuff.id = id;
	var max_sell = prevMarketContent.ship.InCargoParticular(id);
	$("#marketplace_veil").removeClass("dn");
	$("#marketplace_purchase").removeClass("dn");
	$("#marketplace_purchase_sell").removeClass("dn");
	$("#marketplace_purchase_quantity_s").attr('max',max_sell);
	for(var i = 0;i<prevMarketContent.goods.length;i++){
		if(prevMarketContent.goods[i].item.id==id){
			$(".marketplace_purchase_title").html(prevMarketContent.goods[i].item.title+" ["+prevMarketContent.goods[i].sell+"]");			
			currentStuff.worth = prevMarketContent.goods[i].buy;
			break;
		}
	}
	ShowQuantity(1, '-');
}

//Выставить колличесво товара для покупки/продажи в максимум
function SetMaxQuantity(operation){
	if(operation=='+'){
		var max = $("#marketplace_purchase_quantity_b").attr('max');
		$("#marketplace_purchase_quantity_b").val(max);
		ShowQuantity(max, '+');
	}
	else if(operation=='-'){
		var max = $("#marketplace_purchase_quantity_s").attr('max');
		$("#marketplace_purchase_quantity_s").val(max);
		ShowQuantity(max, '-');
	}
}
//Подтверждение покупки
function ConfirmPurchase(operation){
	var item_id = currentStuff.id;
	var item_quantity = 0;
	//var total_cost = currentStuff.worth*item_quantity;
	if(operation=='+'){
		item_quantity = parseInt($("#marketplace_purchase_quantity_b").val());
		//total_cost*=-1;
	}
	else if(operation=='-'){
		item_quantity = -1*parseInt($("#marketplace_purchase_quantity_s").val());
	}
	//prevMarketContent.ship.money+=total_cost;
	prevMarketContent.ship.AddCargo(item_id, item_quantity, currentStuff.worth);
	ClosePurchaseWindow(operation);
	DrawMarketContent(prevMarketContent);
}