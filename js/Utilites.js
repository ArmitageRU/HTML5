var prevMainContent = null;
var prevMarketContent = null

function ShowHideInfopanel() {
	if($("#infobox" ).hasClass( "dn" ))$("#infobox").removeClass("dn");
	else $("#infobox").addClass("dn");
}

function ShowHideMarketPlace() {
	if(prevMarketContent!=null){
		if($("#marketplace" ).hasClass( "dn" ))$("#marketplace").removeClass("dn");
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
	
	$("#market_goods > tbody").empty();
	if(prevMarketContent!=marketcontent){
		if(marketcontent!=null){
			for(var i = 0;i<marketcontent.Commodity.length;i++){
				$('#market_goods> tbody').after("<tr><td>"+marketcontent.Commodity[0].name+
											  "</td><td>"+marketcontent.Commodity[0].buy+
											  "</td><td>"+marketcontent.Commodity[0].sell+
											  "</td><td>"+marketcontent.Commodity[0].quantity+
											  "</td><td><button>-</button></td>"+
											  "<td>88</td>"+
											  "<td><button>+</button></td></tr>");
			}
		}
	prevMarketContent = marketcontent;
	DisableAppButtons();
	}
}
