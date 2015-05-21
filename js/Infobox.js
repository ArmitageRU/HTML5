"use strict";
function Infobox(width, height, ctx){
	this.ctx=ctx;
	this.left_upper = new Point(width-405, 5);
	this.right_lower = new Point(width-5, height-5);
	this.width = 400;
	this.height = height-10;
	this.tabs = [];
	
	var offset = 0;
	this.tabs.push(new Infotab("Общее", this.ctx, offset).setProperty({selected:true},true));
	offset += this.tabs[0].width;
	this.tabs.push(new Infotab("Корабль", this.ctx, offset));
	offset += this.tabs[1].width;
	this.tabs.push(new Infotab("Рынок", this.ctx, offset));
};

Infobox.prototype = {
	Show:function(text){
		var ctx = this.ctx;
        ctx.fillStyle = '#0ff';
        ctx.fillText(text, this.width-395, 15);
	},
	
	DrawForm:function(object, mouse){
		this.ctx.beginPath();
		this.ctx.rect(this.left_upper.x-0.5, this.left_upper.y-0.5, this.width, this.height);
		this.ctx.fillStyle = '#002244';
		this.ctx.fill();
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = 'white';
		this.ctx.stroke();
		this.DrawTabs(object, mouse);
	},
	
	DrawTabs:function(object, mouse){
		//set line color
		this.ctx.beginPath();
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = 'white';
		this.ctx.fillStyle = 'white';
		var currentX = this.left_upper.x;
		var title_width = 0;
		for(var i = 0;i<this.tabs.length;i++){
			title_width = this.tabs[i].width;
			this.ctx.font = '12pt Courier New';
			this.ctx.fillText(this.tabs[i].title, this.left_upper.x+this.tabs[i].offset+5, this.left_upper.y+15);
			this.ctx.moveTo(currentX+title_width-0.5, this.left_upper.y);
			this.ctx.lineTo(currentX+title_width-0.5, this.left_upper.y+20.5);
			if(!this.tabs[i].selected){
				this.ctx.moveTo(currentX-0.5, this.left_upper.y+20.5);
				this.ctx.lineTo(currentX+title_width-0.5, this.left_upper.y+20.5);
			}
			currentX+=title_width;
		}
		this.ctx.moveTo(currentX-0.5, this.left_upper.y+20.5);
		this.ctx.lineTo(this.left_upper.x+this.width-0.5, this.left_upper.y+20.5);
		this.ctx.stroke();
		
		if(object!=null)this.DrawInfoPanels(object, mouse)
		if(mouse.pressed)this.ClickHandler(mouse);	
	},
	
	ClickHandler:function(mouse){
		
		//if(!mouse.pressed)return;
		for(var i = 0;i<this.tabs.length;i++){
			var x_min = this.left_upper.x+this.tabs[i].offset;
			var x_max = this.left_upper.x+this.tabs[i].offset+this.tabs[i].width;
			var y_min = this.left_upper.y;
			var y_max = this.left_upper.y + 20;
			if(!this.tabs[i].selected &&
				mouse.pos.x >x_min && mouse.pos.x <x_max &&
				mouse.pos.y >y_min <y_max){
				this.selectOneTab(this.tabs[i]);
				console.log('tab '+i);
			}
		}
		
	},
	
	selectOneTab: function(infotab){
		for(var i = 0;i<this.tabs.length;i++){
			if(this.tabs[i]==infotab)this.tabs[i].selected = true;
			else this.tabs[i].selected = false;
		}
	},
	
	DrawInfoPanels: function(object, mouse){
		if(this.tabs[0].selected){
			//ctx, mouse, uppder_left, lower_right
			object.MainContent.Render(this.ctx, mouse, new Point(this.left_upper.x, this.left_upper.y+35), this.right_lower);//на глазок
		}
	}
};