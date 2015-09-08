//глобальные переменные
var prevMainContent = null;
var prevMarketContent = null;
var inbattle = false;

var phaseActive = false;
//var fires = [];

//var currentCommodities = [];
//var moneyRest = 0;

var currentStuff = {
    worth: 0,
    id: 0
}

var currentShip;

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
    //$("#marketplace_veil").addClass("dn");
    $("#veil").addClass("dn");
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
    //$("#marketplace_veil").removeClass("dn");
	$("#veil").removeClass("dn");
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
    //$("#marketplace_veil").removeClass("dn");
	$("#veil").removeClass("dn");
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

/************************************Режим боя********************************************/
function PrepareForBattle(hide, ship) {
    if (!inbattle) {
        inbattle = true;
        currentShip = ship;
        HideStandartHTMLUI(hide);
        PreBattle(!hide);
    }
}

//Скрыть UI 
function HideStandartHTMLUI(hide) {
    if (hide) {
        $("#main_ui").addClass("dn");
    }
    else {
        $("#main_ui").removeClass("dn");
    }
}

//Подготовительное меню
function PreBattle(hide) {
    if (hide) {
        $("#outfit").addClass("dn");
		$("#veil").addClass("dn");
    }
    else {
        //заполнить данными
        FillPreBattle();
	    $("#outfit").removeClass("dn");
		$("#veil").removeClass("dn");
    }
}
//Заполнить окно с предподготовкой
function FillPreBattle() {
    $("#outfit_recharge").html(currentShip.GetRecharge().toFixed(2));
    $("#outfit_dodge").html(currentShip.GetDodge().toFixed(2));
    var energy = currentShip.GetEnergy();
    $("#outfit_energy").html(energy);
	if(energy<0 && !$("#outfit_energy").hasClass("outfit_weapon_item_red")){
		$("#outfit_energy").addClass("outfit_weapon_item_red");
		$("#outfit_ready").prop('disabled', true);
	}
	else {
		$("#outfit_energy").removeClass("outfit_weapon_item_red");
		$("#outfit_ready").prop('disabled', false);
	}
	
    
	$("#outfit_slot_weapon").html("");

    var suited_weapons,
        suited_shields,
        suited_auto,
        all_weapons = StarSystem.FAKE.weapons;
    //оржие
    for (var i = 0, max = currentShip.slots.length; i < max; i += 1) {
        suited_weapons = "<select onclick=\"ViewWeaponInfo(this)\" onchange=\"SelectOutfitWeapon("+ i +", this);\"><option value=\"0\"></option>";
        suited_shields = "<select onclick=\"ViewWeaponInfo(this)\" onchange=\"SelectOutfitWeapon(" + i + ", this);\"><option value=\"0\"></option>";
        suited_auto = "<select onclick=\"ViewWeaponInfo(this)\" onchange=\"SelectOutfitWeapon(" + i + ", this);\"><option value=\"0\"></option>";
            for (var j = 0, max_w = all_weapons.length; j < max_w; j += 1) {
                if (all_weapons[j].size <= currentShip.slots[i].size && all_weapons[j].class == currentShip.slots[i].class) {
                    suited_weapons += "<option value=\"" + all_weapons[j].id + "\" ";
                    if (currentShip.slots[i].weapon != null && all_weapons[j].id == currentShip.slots[i].weapon.id) {
                        suited_weapons += " selected=\"selected\"";
                    }
                    suited_weapons += ">" + all_weapons[j].title + "</option>";
                }
            }
        suited_weapons += "</select>";
        suited_weapons += "</select>";
        suited_weapons += "</select>";
        if (currentShip.slots[i].class == 'weapon') {
            $("#outfit_slot_weapon").html("<span class=\"cell-box\">" + currentShip.slots[i].size + "</span>" + suited_weapons);
        }
        if (currentShip.slots[i].class == 'shield') {
            $("#outfit_slot_shield").html("<span class=\"cell-box\">" + currentShip.slots[i].size + "</span>" + suited_weapons);
        }
        if (currentShip.slots[i].class == 'auto') {
            $("#outfit_slot_auto").html("<span class=\"cell-box\">" + currentShip.slots[i].size + "</span>" + suited_weapons);
        }
    }
}

//выбор оружия из списка
function SelectOutfitWeapon(slot, obj) {
    var weapon_id = $(obj).val(),
        wpn = StarSystem.FAKE.GetWeaponById(weapon_id);
    currentShip.SetWeapon(slot, wpn);
    FillPreBattle(null);
    ShowWeaponInfo(wpn);
}

//показ информации об оружии
function ViewWeaponInfo(obj) {
    var o = $(obj),
        weapon_id = o.children("select option:selected").eq(0).val(),
        wpn = StarSystem.FAKE.GetWeaponById(weapon_id);
    ShowWeaponInfo(wpn);
}

function ShowSummaryStat(hide) {
    if (hide) {
        $("#summary").addClass("dn");
        $("#veil").addClass("dn");
    }
    else {
        $("#summary_kills").html(currentShip.statistic.kills);
        $("#summary_death").html(currentShip.statistic.death);
        //заполнить данными
        //Function();
        $("#summary").removeClass("dn");
        $("#veil").removeClass("dn");
    }


}

//клик по диву в котором выбор оружия (сильно не уверен что нужно)
function ShowWeaponInfo(weapon) {
    if (weapon != null) {
        $("#outfit_specification_energy").html(weapon.energy);
        $("#outfit_specification_cost").html(weapon.primeCost);
        $("#outfit_specification_type").html(weapon.type);
        $("#outfit_specification_mass").html(weapon.mass);
    }
    else {
        $("#outfit_specification_energy").html("");
        $("#outfit_specification_cost").html("");
        $("#outfit_specification_type").html("");
        $("#outfit_specification_mass").html("");
    }
}

//После нажатия кнопки "Готово"
function PreBattleReady() {
    StarSystem.currentMode.inBattle = true;
    PreBattle(true);
}

// Ship.js
function PrepareBattleMenu(ship/*,w_id*/) {
    $("#battle").removeClass("dn");
    $("#battle_energy").html(ship.energy);
    $("#battle_weapons").empty();
    //console.log(ship.weapons.length);
    var weapons = currentShip.GetWeaponList();

    for (var i = 0, len = weapons.length; i < len; i += 1) {
        $('#battle_weapons').append('<option value="' + weapons[i].id + '_' + weapons[i].energy + '" selected="selected">' + weapons[i].title + ' — ' + weapons[i].energy + '</option>');
    }
    CheckWeapons(ship, 0/*w_id*/);
}

function HideBattleMenu() {
    $("#battle").addClass("dn");
}

//задизейблить невозможное оружие и/или кнопку стрельбы
function CheckWeapons(ship, w_id) {
    var disable_fire = true,//weapon_id_energy = w_id.split('_'),
        weapons_id = w_id,
        wpns = ship.GetWeaponList(),
        tmp_energy,
        tmp_id;
    

    $("#battle_energy").html(ship.energy);
    $("#battle_fire").prop('disabled', false);

    for (var i = 0, len = wpns.length; i < len; i += 1) {
        tmp_energy = wpns[i].energy;
        tmp_id = wpns[i].id + '_' + wpns[i].energy;

        if (tmp_energy > ship.energy) {
            $('#battle_weapons option[value=' + tmp_id + ']').prop('disabled', true);

            if (tmp_id == weapons_id) {
                weapons_id = 0;
            }
        }
        else {
            $('#battle_weapons option[value=' + tmp_id + ']').prop('disabled', false);
            if (tmp_id == w_id) {
                $('#battle_weapons option[value=' + tmp_id + ']').prop('selected', true);
            }
            disable_fire = false;
        }
    }

    if (weapons_id == 0) {
        $('#battle_weapons option:enabled').prop('selected', true);
    }

    if (disable_fire) {
        $("#battle_fire").prop('disabled', true);
    }
}

function Fire() {
    var w_id = $('#battle_weapons option:selected').val();
    var c_ship = StarSystem.battle.fire(w_id);
    if(c_ship !=null)CheckWeapons(c_ship, w_id);
}

function EndPhase() {
    StarSystem.battle.wantEnd = true;//.endPhase();
}

function CloseBattleStat() {
    ShowSummaryStat(true);
    this.inbattle = false;
    StarSystem.currentMode.preBattle = true;
    currentShip.life.current = currentShip.life.max;
}
