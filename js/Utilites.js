function ShowHideInfopanel() {
	if($("#container" ).hasClass( "dn" ))$("#container").removeClass("dn");
	else $("#container").addClass("dn");
}

function FillMainTab(maincontent, marketcontent) {
	if(maincontent!=null) {
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
	}

	if(marketcontent!=null){

	}
}
