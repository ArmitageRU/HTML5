"use strict";
function Battle(context) {
    this.participants = [];//тут корабли и ракеты
    this.fires = [];
    this.turns = 0;
    this.phase = 0;
    this.ctx = context;
};

Battle.prototype = {
    addParticipant: function (render, object, init) {
        var participant = {
            render: render,
            param: param,
            object:object
        }
        this.participants[this.participants.length] = participant;
    }, 

    render: function (time) {
        for (var i = 0, max = this.participants.length; i < max; i += 1) {
            if (this.fires.length > 0) {
                for (var j = 0; j < this.fires.length; j += 1) {
                    if (this.fires[j].time < 0) {
                        this.fires.splice(j, 1)
                    }
                    else if (this.fires[j].ship.id = this.participants[i].source.id) {
                        for (var k = 0, max = this.fires[j].ship.weapons.length; k < max; k += 1) {
                            if (this.fires[j].weapons_id === this.fires[i].ship.weapons[k].id) {
                                this.fires[j].time = this.fires[j].ship.weapons[k].renderAction(this.fires[j].time, time, this.ctx, this.participants[i].source.position, this.participants[i].source.target.position);
                            }
                        }
                    }
                }
            }

            this.participants[i].render.call(this.participants[i].source, time);
        }
        //phase begin

        //turn begin 
    }
};

