"use strict";
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

    this.phaseInAction = false;
    //функция из вызывающего объекта (Application в данном случае)
    this.whenBattleEnding;
    this.whenBattleEnded;
};

Battle.prototype = {

    render: function (time, mouse) {
        this.removeParticipant();
        var claim_end_phase = false,//если кто-то из участников изъявил желание закончит фазу
            permission_end_phase = true;//если кто-то из участников не возражает чтобы фаза была закончена

        for (var i = 0; i < this.participants.length; i += 1) {
            if (this.participants[i].hide) {
                continue;
            }
            if (this.fires.length > 0) {
                for (var j = 0; j < this.fires.length; j += 1) {
                    if (this.fires[j].time < 0) {
                        var wpn = StarSystem.GetWeaponById(this.fires[j].weapon_id);
                        if (wpn != null && wpn.class == 'auto') {
                            UpdateAuto();
                        }
                        this.fires.splice(j, 1);
                        continue;
                    }
					else if (this.fires[j].parent.object.id === this.participants[i].object.id) {
                        for (var k = 0, max_f = this.fires[j].parent.object.slots.length; k < max_f; k += 1) {
                            if (this.fires[j].parent.object.slots[k].weapon !=null && this.fires[j].weapon_id === this.fires[j].parent.object.slots[k].weapon.id) {
                                this.fires[j].time = this.fires[j].parent.object.slots[k].weapon.renderAction(this.fires[j].time, time, this.ctx, this.fires[j]);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            else if (this.wantEnd) {
                claim_end_phase = true;
                //this.endPhase();
            }

            if (!this.participants[i].object.CanEnd()) {
                permission_end_phase = false;
            }

            this.participants[i].render.call(this.participants[i].object, time);
            if (this.participants[i].object.inBound(mouse)) {
                this.refreshSelectedShip(this.participants[i].object.id);
            }
            
            if (this.participants[i].object.parentShipId == null) {
                this.participants[i].object.hud.render(time, this.participants[i].object.position, 1);
            }
        }

        if (claim_end_phase && permission_end_phase) {
            this.wantEnd = null;
            this.endPhase();
        }

        if (this.winner) {
            this.endTextPosY += time*0.5;
            if (this.endTextPosY >= this.ctx.canvas.height / 2) {
                this.endTextPosY = this.ctx.canvas.height / 2;
                if (this.whenBattleEnded!=null) this.whenBattleEnded.call(StarSystem, 1);
            }
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
            if (this.endTextPosY <= this.ctx.canvas.height / 2) {
                this.endTextPosY = this.ctx.canvas.height / 2;
                if (this.whenBattleEnded != null) this.whenBattleEnded.call(StarSystem, -1);
            }
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
        if (!this.phaseInAction) {
            for (var i = 0, max = this.participants.length; i < max; i += 1) {
                if (this.participants[i].object.id == this.queue[0] || this.participants[i].object.parentShipId == this.queue[0]) {
                    if (this.participants[i].object.id == this.queue[0]) {
                        this.currentShip = this.participants[i].object;
                    }
                    this.participants[i].object.battleRestore();//с учетом щита
                    this.participants[i].object.phaseActive.call(this.participants[i].object);

                }
                else {
                    this.refreshSelectedShip(this.participants[i].object.id);
                }
            }
            this.phaseInAction = true;
        }
    },

    endPhase: function () {
        this.queue.splice(0, 1);
        this.queue[this.queue.length] = this.currentShip.id;
        //console.log("end phase");
        this.currentShip.phaseEnd.call(this.currentShip);
        //следующая фаза может и не начаться
        if (true) {
            this.phaseInAction = false;
            this.beginPhase();
        }
    },

    fire: function (w_id) {
        var ship = null,
            wpns = this.currentShip.GetWeapons(),
            weapon_id_energy = w_id.split('_'),
            barrels = 1,
			fire;
        for (var i = 0, len = wpns.length; i < len; i += 1) {
            if (weapon_id_energy[0] == wpns[i].weapon.id) {
                //узнаем из скольких орудий стреляли
                for (var j = 0, max_barrels = wpns[i].count; j < max_barrels; j+=1){
                    if(weapon_id_energy[1] == wpns[i].weapon.energy*(j+1)){
                        barrels = j+1;
                        break;
                    }
                }

                for (var j = 0, max_p = this.participants.length; j < max_p; j += 1) {
                    
					if (this.participants[j].object.selected && wpns[i].weapon.class == 'weapon') {
                        
						fire = {
								parent: this.getParticipant(this.currentShip.id),//this.currentShip,
								weapon_id: wpns[i].weapon.id,
								time: 0,
								barrels: barrels,
								target: this.participants[j]
								};
						
						fire.target = this.participants[j];//.object;
                        this.fires[this.fires.length] = fire;
                        this.currentShip.energy -= weapon_id_energy[1];
                        break;
                    }
                    
					if (wpns[i].weapon.class == 'auto' && !wpns[i].weapon.disabled && wpns[i].weapon.amount.current > 0 && this.participants[j].object.parentShipId != null && this.participants[j].align == -1) {
                        fire = {
								parent: this.getParticipant(this.currentShip.id),//this.currentShip,
								weapon_id: wpns[i].weapon.id,
								time: 0,
								barrels: barrels,
								target: this.participants[j]
								};
						this.fires[this.fires.length] = fire;
						//console.log(fire.weapon_id, " add w_id ", this.fires[this.fires.length-1].target.object.id)
                    }
                }
                ship = this.currentShip;
                break;
            }
        }
        return ship;
    },

    //battleEnd: function () {
    //    if (this.participants[0].object.id == 0) {
    //        this.winner = true;
    //    }
    //    else {
    //        this.defeated = true;
    //        this.endTextPosY = this.ctx.canvas.height;
    //    }
	//	this.whenBattleEnding.call();
    //},

    getParticipant: function (ship_id){
        for (var i = 0; i < this.participants.length; i += 1){
            if(this.participants[i].object.id == ship_id){
                return this.participants[i];
            }
        }
    },

    getNextId: function () {
        var id = 1;
        for (var i = 0; i < this.participants.length; i += 1) {
            if (this.participants[i].object.id >= id) {
                id = this.participants[i].object.id + 1;
            }
        }
        return id;
    },

    removeParticipant: function () {
        var lost_partivcples = [],
            win = false,
            defeat = false;
        //собираем информацию о тех кто отжил своё
        for (var i = 0; i < this.participants.length; i += 1) {
            if (this.participants[i].object.death/*.life.current <= 0*/) {
                //this.participants[i] = null;
                lost_partivcples[lost_partivcples.length] = this.participants[i].object.id;
                this.participants.splice(i, 1);
                continue;
            }
        }
        //обнулфем тех кто ссылается на них
        for (var j = 0, max = lost_partivcples.length; j < max; j += 1) {
            for (var k = 0; k < this.participants.length; k += 1) {
                if(this.participants[k].object.parentShipId!=null && this.participants[k].object.target !=null && this.participants[k].object.target.id == lost_partivcples[j]) {
                    this.participants[k].object.death = true;//life.current = 0;
                }
            }
        }
        //и еще раз обновляем
        for (var i = 0; i < this.participants.length; i += 1) {
            if (this.participants[i].object.death/*life.current <= 0*/) {
                this.participants.splice(i, 1);
                continue;
            }
            if (this.participants[i].align == 1) {
                win = true;
            }
            if (this.participants[i].align == -1) {
                defeat = true;
            }
        }

        if(win && !defeat){
            this.winner = true;
        }
        if (!win && defeat) {
            this.defeated = true;
        }

        if (this.winner || this.defeated) {
            this.fires = [];
        }
    },

    showAllParticipants: function () {
        for (var i = 0; i < this.participants.length; i += 1) {
            this.participants[i].hide = false;
        }
    }
};

