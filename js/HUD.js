"use strict";
function HUD(ctx, tile, life) {
    if (!(this instanceof HUD)) {
        return new HUD();
    }
    this.ctx = ctx;
    this.tile = tile;
    this.life = life;
    this.lifebar = 200;
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
    },

    getLifeLength: function () {
        return ~~(this.lifebar * this.life.current / this.life.max);
    }
};