﻿"use strict";
function Battle(context) {
    this.participants = [];//тут корабли и ракеты
    this.fires = [];
    this.turns = 0;
    this.phase = 0;
    this.ctx = context;
    this.queue = [0, 1];
    this.currentShip = null;
    this.wantEnd = null;

    this.winner = false;
    this.defeated = false;
    this.endTextPosY = 0;
};

Battle.prototype = {

    render: function (time, mouse) {
        for (var i = 0; i < this.participants.length; i += 1) {
            if (this.participants[i].object.life.current<=0) {
                this.participants.splice(i, 1);
                if (this.participants.length == 1) {
                    this.battleEnd();
                }
                //console.log("splice", i);
                continue;
            }
            if (this.fires.length > 0) {
                for (var j = 0; j < this.fires.length; j += 1) {
                    if (this.fires[j].time < 0) {
                        this.fires.splice(j, 1);
                    }
                    else if (this.fires[j].ship.id === this.participants[i].object.id) {
                        //for (var k = 0, max_f = this.fires[j].ship.weapons.length; k < max_f; k += 1) {
                        for (var k = 0, max_f = this.fires[j].slots.length; k < max_f; k += 1) {
                            if (this.fires[j].weapon_id === this.fires[j].ship.slots[k].weapon.id) {
                                this.fires[j].time = this.fires[j].ship.slots[k].weapon.renderAction(this.fires[j].time, time, this.ctx, this.fires[j].ship, this.fires[j].barrels, this.fires[j].target/*this.participants[i].object/*, /*this.participants[i].target*/);
                            }
                        }
                        break;
                    }
                }
            }
            else if (this.wantEnd) {
                //console.log("WE", this.currentShip.id, this.fires.length);
                this.wantEnd = null;
                this.endPhase();
            }
            //console.log(this.participants[i].object);
            this.participants[i].render.call(this.participants[i].object, time);
            if (this.participants[i].object.inBound(mouse)) {
                this.refreshSelectedShip(this.participants[i].object.id);
            }
            
            if (this.participants[i].object.parentShipId == null) {
                this.participants[i].object.hud.render(time, this.participants[i].object.position, 1);
            }
        }

        if (this.winner) {
            this.endTextPosY += time*0.5;
            if (this.endTextPosY >= this.ctx.canvas.height / 2) this.endTextPosY = this.ctx.canvas.height / 2;
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.lineWidth = 7;
            this.ctx.font = '45pt Helvetica';
            var text_length = this.ctx.measureText("ПОБЕДА!").width;
            this.ctx.fillStyle = 'red';
            this.ctx.fillText("ПОБЕДА!", (this.ctx.canvas.width / 2) - text_length / 2, this.endTextPosY);
        }
        if (this.defeated) {
            this.endTextPosY -= time * 0.5;
            if (this.endTextPosY <= this.ctx.canvas.height / 2) this.endTextPosY = this.ctx.canvas.height / 2;
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.lineWidth = 7;
            this.ctx.font = '45pt Helvetica';
            var text_length = this.ctx.measureText("ПОРАЖЕНИЕ!").width;
            this.ctx.fillStyle = 'blue';
            this.ctx.fillText("ПОРАЖЕНИЕ!", (this.ctx.canvas.width / 2) - text_length / 2, this.endTextPosY);
        }
    },

    refreshSelectedShip: function(s_id) {
        for (var i = 0, max_p = this.participants.length; i < max_p; i += 1) {
            if (this.participants[i].object.id != s_id) {
                this.participants[i].object.selected = false;
            }
            else {
                this.participants[i].object.selected = true;
            }
        }
    },

    beginPhase: function () {
            //console.log("next is ", this.queue[0]);
            for (var i = 0, max = this.participants.length; i < max; i += 1) {
                if (this.participants[i].object.id == this.queue[0] || this.participants[i].object.parentShipId == this.queue[0]) {
                    if (this.participants[i].object.id == this.queue[0]) {
                        this.currentShip = this.participants[i].object;
                    }
                    this.participants[i].object.battleRestore();
                    this.participants[i].object.phaseActive.call(this.participants[i].object);
                    
                }
                else {
                    this.refreshSelectedShip(this.participants[i].object.id);
                }
            }
    },

    endPhase: function () {
        this.queue.splice(0, 1);
        this.queue[this.queue.length] = this.currentShip.id;
        //console.log("end phase");
        this.currentShip.phaseEnd.call(this.currentShip);
        //следующая фаза может и не начаться
        if (true) {
            this.beginPhase();
        }
    },

    fire: function (w_id) {
        var ship = null,
            wpns = this.currentShip.GetWeapons(),
            weapon_id_energy = w_id.split('_'),
            barrels = 1;
        //for (var i = 0, len = this.currentShip.weapons.length; i < len; i += 1) {
        for (var i = 0, len = wpns.length; i < len; i += 1) {
            if (w_idweapon_id_energy[0] == wpns[i].weapon.id) {
                //узнаем из скольких орудий стреляли
                for (var j = 0, max_barrels = wpns[i].count; j < max_barrels; j+=1){
                    if(weapon_id_energy[1] == wpns[i].weapon.energy*(j+1)){
                        barrels = j+1;
                        break;
                    }
                }

                var fire = {
                    ship: this.currentShip,
                    weapon_id: wpns[i].weapon.id,
                    time: 0,
                    barrels: barrels
                };

                for (var j = 0, max_p = this.participants.length; j < max_p; j += 1) {
                    if (this.participants[j].object.selected) {
                        fire.target = this.participants[j].object;
                        this.fires[this.fires.length] = fire;
                        this.currentShip.energy -= weapon_id_energy[1];//this.currentShip.weapons[i].energy;
                        break;
                    }
                }
                ship = this.currentShip;
                break;
            }
        }
        return ship;
    },

    battleEnd: function () {
        if (this.participants[0].object.id == 0) {
            this.winner = true;
        }
        else {
            this.defeated = true;
            this.endTextPosY = this.ctx.canvas.height;
        }
    }
};

