"use strict";
function Infotab(title, ctx, offset){
	this.title = title;
	this.selected=false;
	this.ctx = ctx;
	this.offset = offset;
	this.width = textWidth(ctx, null, title)+10;	
};