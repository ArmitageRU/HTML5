"use strict";
function Planet(title, image, ctx){
	this.position = new Point(0,0);
	this.angle = ~~(Math.random()*360);
	this.speed = 1/~~(Math.random()*240);//Math.random()*0.00001+0.00001;
	//this.title = title;
	this.orbit;
	this.selected = false;
	this.from = false;
	this.to = false;
	this.Infobox;
	this.MainContent = new MainContent();
	this.StoreContent = /*new StoreContent()*/null;
	this.Init(title);
	this.tile = this.tile = new Tile(ctx, image, 0, 0, 300,300, 0.27);
};

Planet.prototype = {
	Init: function(title){
			this.MainContent.title=title;
			this.MainContent.textData.push("This week we're coming to you a day earl");//y to take the wraps off our third major content update. This ");  /*методом подбора ограничение длины*/
			this.MainContent.textData.push("announcement means a lot to us, so in th");//is special newsletter our team will talk through the new features of ");
			this.MainContent.textData.push("Powerplay in their own words, and we'll");// reveal how you'll be able to make your own powerplay in the Elite: ");
			this.MainContent.textData.push("Dangerous galaxy.");
	},
	
	Draw: function(deltaTime){
		this.position.x = this.orbit.centre.x + this.orbit.radius * Math.cos(this.angle);
        this.position.y = this.orbit.centre.y + this.orbit.radius * Math.sin(this.angle);
        this.angle += this.speed * deltaTime*0.001;
		var planet_rot = Math.atan2(this.orbit.centre.y - this.position.y, this.orbit.centre.x - this.position.x) + 3*Math.PI/4;
		this.tile.draw(this.position, planet_rot);
		var ctx = this.orbit.ctx;
		if(this.selected){	
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'white';
			ctx.beginPath();
			ctx.arc(this.position.x, this.position.y, 25, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.stroke();
		}
		
		if(this.to){	
			ctx.save();
			ctx.globalCompositeOperation = "multiply";
			ctx.fillStyle = 'rgba(255,0,0,0.5)';
			ctx.beginPath();
			ctx.arc(this.position.x, this.position.y, 25, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
		//if(this.selected)this.Infobox.Show(this.title);
	},
	
	setTo:function(){
		if(!this.from)this.to= !this.to;
	},
	
	DrawInfo: function(){
		this.Infobox.DrawInfoPanels(main_content, store_content);
	}
};