"use strict";
function Battle(context) {
    this.participants = [];//тут корабли и ракеты
    this.fires = [];
    this.turns = 0;
    this.phase = 0;
    this.ctx = context;
    this.queue = [0, 1];
    this.phaseActive = false;
    this.currentShip = null;
};

Battle.prototype = {
    //addParticipant: function (render, object, init) {
    //    var participant = {
    //        render: render,
    //        param: param,
    //        object:object
    //    }
    //    this.participants[this.participants.length] = participant;
    //}, 

    render: function (time, mouse) {
        for (var i = 0, max_p = this.participants.length; i < max_p; i += 1) {
            if (this.fires.length > 0) {
                for (var j = 0; j < this.fires.length; j += 1) {
                    if (this.fires[j].time < 0) {
                        //this.fires[j].ship.canShot = true;
                        //this.currentShip.canShot = true;
                        this.fires.splice(j, 1);
                    }
                    else if (this.fires[j].ship.id === this.participants[i].object.id) {
                        for (var k = 0, max_f = this.fires[j].ship.weapons.length; k < max_f; k += 1) {
                            if (this.fires[j].weapon_id === this.fires[j].ship.weapons[k].id) {
                                this.fires[j].time = this.fires[j].ship.weapons[k].renderAction(this.fires[j].time, time, this.ctx, this.fires[j].ship, this.fires[j].target/*this.participants[i].object/*, /*this.participants[i].target*/);
                            }
                        }
                        break;
                    }
                }
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
        //phase begin
        //turn begin 
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
        if (!this.phaseActive) {
            for (var i = 0, max = this.participants.length; i < max; i += 1) {
                if (this.participants[i].object.id == this.queue[0] || this.participants[i].object.parentShipId == this.queue[0]) {
                    if (this.participants[i].object.id == this.queue[0]) {
                        this.currentShip = this.participants[i].object;
                    }
                    this.participants[i].object.battleRestore();
                    this.participants[i].object.phaseActive.call(this.participants[i].object);
                    this.phaseActive = true;
                }
                else {
                    this.refreshSelectedShip(this.participants[i].object.id);
                }
            }
        }
    },

    endPhase: function () {
        this.queue.splice(0, 1);
        this.queue[this.queue.length] = this.currentShip.id;
        this.phaseActive = false;
        this.currentShip.phaseEnd.call(this.currentShip);
    },

    fire: function (w_id) {
        var ship = null;
        for (var i = 0, len = this.currentShip.weapons.length; i < len; i += 1) {
            if (w_id == this.currentShip.weapons[i].id) {

                var fire = {
                    ship: this.currentShip,
                    weapon_id: this.currentShip.weapons[i].id,
                    time: 0
                };

                for (var j = 0, max_p = this.participants.length; j < max_p; j += 1) {
                    if (this.participants[j].object.selected) {
                        fire.target = this.participants[j].object;
                        this.fires[this.fires.length] = fire;
                        this.currentShip.energy -= this.currentShip.weapons[i].energy;
                        break;
                    }
                }
                ship = this.currentShip;
                break;
            }
        }
        return ship;
    }
};

