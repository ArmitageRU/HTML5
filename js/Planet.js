"use strict";
function Planet(title){
	this.position = new Point(0,0);
	this.angle = ~~(Math.random()*360);
	this.speed = 1/~~(Math.random()*240);//Math.random()*0.00001+0.00001;
	//this.title = title;
	this.orbit;
	this.selected = false;
	this.Infobox;
	this.MainContent = new MainContent();
	this.StoreContent = /*new StoreContent()*/null;
	this.Init(title);
};

Planet.prototype = {
	Init: function(title){
			this.MainContent.title=title;
			this.MainContent.textData.push("This week we're coming to you a day early to take the wraps off our third major content update. This ");
			this.MainContent.textData.push("announcement means a lot to us, so in this special newsletter our team will talk through the new features of ");
			this.MainContent.textData.push("Powerplay in their own words, and we'll reveal how you'll be able to make your own powerplay in the Elite: ");
			this.MainContent.textData.push("Dangerous galaxy.");
	},
	
	Draw: function(deltaTime){
		this.position.x = this.orbit.centre.x + this.orbit.radius * Math.cos(this.angle);
        this.position.y = this.orbit.centre.y + this.orbit.radius * Math.sin(this.angle);
        this.angle += this.speed * deltaTime*0.001;
		var ctx = this.orbit.ctx;
		if(this.selected){	
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'white';
		}
		else {
			ctx.strokeStyle = 'blue';
			ctx.lineWidth = 1;
		}
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 25, 0, Math.PI * 2, true);
		ctx.fillStyle = 'blue';
		ctx.fill();
		ctx.closePath();
        ctx.stroke();
		
		//if(this.selected)this.Infobox.Show(this.title);
	},
	
	DrawInfo: function(){
		this.Infobox.DrawInfoPanels(main_content, store_content);
	}
};