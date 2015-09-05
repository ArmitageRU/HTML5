"use strict";
function HUD(ctx, tile, life) {
    if (!(this instanceof HUD)) {
        return new HUD();
    }
    this.ctx = ctx;
    this.tile = tile;
    this.life = life;
    this.lifebar = 200;
    this.notices = [];
};

HUD.prototype = {
    render: function (time, position, scale) {
        var text = this.life.current + "/" + this.life.max;
        var life_length = this.getLifeLength();
        this.ctx.beginPath();
        this.ctx.rect(position.x * scale - 100, (position.y - this.tile.sWidth / 2) * scale - 25, life_length, 20);
        this.ctx.fillStyle = 'green';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.rect(position.x * scale - 100 + life_length, (position.y - this.tile.sWidth / 2) * scale - 25, this.lifebar - life_length, 20);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.rect(position.x * scale - 100, (position.y - this.tile.sWidth / 2) * scale - 25, this.lifebar, 20);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'yellow';
        this.ctx.stroke();
        this.ctx.font = '15pt Courier';
        var text_length = this.ctx.measureText(text).width;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(text, (position.x * scale) - text_length / 2, (position.y - this.tile.sWidth / 2) * scale - 8);

        for (var i = 0; i<this.notices.length;i++){
            if (typeof this.notices[i].time === "undefined") {
                this.notices[i].time = 0;
                this.notices[i].v = 100;
                this.notices[i].posY = (position.y - this.tile.sWidth / 2) * scale-8;
				this.notices[i].alpha =1;
            }
            this.notices[i].time += time/1000; 
            this.notices[i].v -= time / 7;
            if (this.notices[i].v < 0) {
                this.notices[i].v = 0;
                console.log("0 v");
            }
            //if (this.notices[i].time >= 2) {
            //    this.notices.splice(i, 1);
            //    continue;
            //}
			if(this.notices[i].v == 0) {
				this.notices[i].alpha =this.notices[i].alpha-time/100;
				if(this.notices[i].alpha<=0){
					this.notices.splice(i, 1);
					continue;
				}
			}
			
            this.notices[i].posY -= Math.pow(this.notices[i].time, 2) * this.notices[i].v*0.5;

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.font = 'bold 15pt sans-serif';
            this.ctx.strokeStyle = "rgba(255,255,255," + this.notices[i].alpha.toFixed(1) + ")";
            this.ctx.lineWidth = 1;
            this.ctx.shadowColor = "#FFF";
            this.ctx.shadowOffsetX = 1;
            this.ctx.shadowOffsetY = 1;
            this.ctx.shadowBlur = 5;
            text_length = this.ctx.measureText(this.notices[i].text).width;
            this.ctx.strokeText(this.notices[i].text, (position.x * scale) - text_length / 2, this.notices[i].posY);
            console.log(this.ctx.strokeStyle);
            this.ctx.restore();
            //console.log(this.notices[i].posY, " posY");
        }
    },

    getLifeLength: function () {
        return ~~(this.lifebar * this.life.current / this.life.max);
    }

};