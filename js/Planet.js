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
	this.MarketContent = new MarketContent();
	this.StoreContent = /*new StoreContent()*/null;
	this.Init(title);
	this.tile = this.tile = new Tile(ctx, image, 0, 0, 300,300, 0.27);
	this.goods = [];
};

Planet.prototype = {
	Init: function(title){
			this.MainContent.title=title;
			this.MainContent.owner = "Owwwwnnner!";
			this.MainContent.avatar = "img/avatar.png";
			this.MainContent.textData.push("An enigmatic terrestrial planet, Zayarter has a hazy atmosphere of nitrogen and argon. The surface is scorching hot, and mainly composed of calcium with deposits of sodium. Three times in the last century, ships stopping to discharge at Treyarmus reported geometric patterns of lights on the dark side of Zayarter. Attempts at further investigation proved fruitless; the lights disappear when ships approach the inner system.");
			this.MainContent.textData.push("Сервисы:")
			this.MarketContent.Fulfill(this);
			if(this.MarketContent.goods.length>0){
				this.MainContent.textData.push("Потребительский рынок")
			}
			//this.goods = 
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