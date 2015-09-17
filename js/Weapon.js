"use strict";
function Weapon(energy, title, cost, size, mass, type, context, image, class_, amount) {
    if (!(this instanceof Weapon)) {
        return new Weapon();
    }
    this.ctx = context;
    this.tile = new Tile(this.ctx, image, null, null, /*49, 19,*/null, null, 1);
    this.energy = energy;
    this.disabled = false;
    this.title = title;
    this.primeCost = cost;//себестоимость, возможно не понадобится
    this.size = size;//размер слота
    this.id;
    this.type = type;
    this.mass = mass;
    this.class = class_;
    this.amount = {
        stock: amount,
        current: amount
        };
        
    this.beamLasting = 700;
    this.plasmaLasting = 1000;
    this.rocketLasting = 700;
};

Weapon.prototype = {
    renderAction: function (full_time, time, ctx, fire/*from, barrels, target*/) {
        var ret_time = full_time + time,
            thickness,// = ~~(ret_time / (this.beamLasting / 10));
			tg = (fire.target.object.position.y-fire.parent.object.position.y)/ (fire.target.object.position.x-fire.parent.object.position.x),
            radius = Math.abs(fire.target.object.position.x - fire.parent.object.position.x);

        if (fire.barrels == 1) {
            thickness = ~~(ret_time / (this.beamLasting / 10));
        }
        else {
            thickness = ~~(ret_time / (this.beamLasting / 20));
        }
            //target = from.target;
        switch (this.type) {
            case 'beam':
                if (ret_time > this.beamLasting) {
                    ret_time = -1;
                    fire.target.object.GetDamage(this, fire.barrels);
                    break;
                }
                ctx.beginPath();
                ctx.moveTo(fire.parent.object.position.x, fire.parent.object.position.y);
                
                var angle = Math.atan2(fire.target.object.position.y - fire.parent.object.position.y, fire.target.object.position.x - fire.parent.object.position.x);
                //var 
                angle+= Math.PI / 36;
                angle -= (ret_time / this.beamLasting) * (Math.PI / 18);
				var new_x = Math.cos(angle);
                var new_y = Math.sin(angle);
                //ctx.lineTo(fire.target.object.position.x, fire.target.object.position.y);
                ctx.lineTo(fire.parent.object.position.x + new_x * radius, fire.parent.object.position.y + new_y * radius);
				ctx.lineCap = 'round';
                for (var i = 5; i >= 0; i--) {
                    ctx.lineWidth = thickness+ (i + 1) * 4 - 2;
                    if (i == 0)
                        ctx.strokeStyle = '#fff';
                    else {
                        ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
                    }
                    ctx.stroke();
                }

                break;
            case 'plasma':
                if (ret_time > this.plasmaLasting) {
                    ret_time = -1;
                    fire.target.object.GetDamage(this, fire.barrels);
                    break;
                }
                var curr_x = (fire.target.object.position.x - fire.parent.object.position.x) * ret_time / this.plasmaLasting;

                var curr_xx = ((fire.parent.object.position.x + curr_x) / fire.target.object.position.x) * Math.PI * 2;
                var curr_yy = Math.sin(curr_xx) * 100;
                var grd,
                    grd2;
                if (fire.barrels > 1) {
                    //this.tile.draw(new Point(fire.parent.object.position.x + curr_x, fire.parent.object.position.y + curr_yy), 0);
                    //this.tile.draw(new Point(fire.parent.object.position.x + curr_x, fire.parent.object.position.y - curr_yy), 0);
                    grd = ctx.createRadialGradient(fire.parent.object.position.x + curr_x, fire.parent.object.position.y + curr_yy, 15,
                                                   fire.parent.object.position.x + curr_x, fire.parent.object.position.y + curr_yy, 30);
                    grd.addColorStop(0, '#f0f0FF');
                    grd.addColorStop(0.2, 'rgba(150, 150, 255 ,0.7)');
                    grd.addColorStop(0.5, 'rgba(150, 150, 255 ,0.6)');
                    grd.addColorStop(0.75, 'rgba(150, 150, 255 ,0.5)');
                    grd.addColorStop(0.9, 'rgba(150, 150, 255 ,0.3)');
                    grd.addColorStop(1, 'rgba(150, 150, 255 ,0.2)');
                    ctx.arc(fire.parent.object.position.x + curr_x, fire.parent.object.position.y + curr_yy, thickness + 15, 0, 2 * Math.PI, false);
                    ctx.fillStyle = grd;
                    ctx.fill();

                    ctx.beginPath();
                    grd2 = ctx.createRadialGradient(fire.parent.object.position.x + curr_x, fire.parent.object.position.y - curr_yy, 15,
                                                    fire.parent.object.position.x + curr_x, fire.parent.object.position.y - curr_yy, 30);
                    grd2.addColorStop(0, '#f0f0FF');
                    grd2.addColorStop(0.2, 'rgba(150, 150, 255 ,0.7)');
                    grd2.addColorStop(0.5, 'rgba(150, 150, 255 ,0.6)');
                    grd2.addColorStop(0.75, 'rgba(150, 150, 255 ,0.5)');
                    grd2.addColorStop(0.9, 'rgba(150, 150, 255 ,0.3)');
                    grd2.addColorStop(1, 'rgba(150, 150, 255 ,0.2)');
                    ctx.fillStyle = grd2;
                    ctx.arc(fire.parent.object.position.x + curr_x, fire.parent.object.position.y - curr_yy, thickness + 15, 0, 2 * Math.PI, false);
                    ctx.fill();
                    //console.log(curr_yy);
                }
                else {
                    grd = ctx.createRadialGradient(fire.parent.object.position.x + curr_x, fire.parent.object.position.y, 10, fire.parent.object.position.x + curr_x, fire.parent.object.position.y, 30);
                    grd.addColorStop(0, '#f0f0FF');
                    grd.addColorStop(0.2, 'rgba(150, 150, 255 ,0.7)');
                    grd.addColorStop(0.5, 'rgba(150, 150, 255 ,0.6)');
                    grd.addColorStop(0.75, 'rgba(150, 150, 255 ,0.5)');
                    grd.addColorStop(0.9, 'rgba(150, 150, 255 ,0.3)');
                    grd.addColorStop(1, 'rgba(150, 150, 255 ,0.2)');
                    ctx.fillStyle = grd;
                    ctx.arc(fire.parent.object.position.x + curr_x, fire.parent.object.position.y, thickness + 15, 0, 2 * Math.PI, false);
                    ctx.fill();
                    //this.tile.draw(new Point(fire.parent.object.position.x + curr_x, fire.parent.object.position.y), 0);
                }
                break;
            case 'rocket':
                var curr_x = (/*from.position.x +*/ 100) * ret_time / this.rocketLasting,
                    curr_y = (/*from.position.y -*/ 100) * ret_time / this.rocketLasting,
                    up_r_bo,
                    down_r_bo;
                if (ret_time > this.rocketLasting) {
                    if (this.amount.current>0) {
                        var rocket_ship_up = new Ship(this.ctx, this.tile.img, new Rectangle(0, 0, null, null, 1));
                        rocket_ship_up.id = StarSystem.battle.getNextId();//-1;
                        rocket_ship_up.parentShipId = fire.parent.object.id;
                        rocket_ship_up.speed = 1500;
                        rocket_ship_up.life.current = 20;
                        if(fire.parent.object.rot == -Math.PI / 2){
                            rocket_ship_up.battlePrepare(new Point(fire.parent.object.position.x - 100, fire.parent.object.position.y - 100), 2 * Math.PI, null, 1);
                        }
                        else {
                            rocket_ship_up.battlePrepare(new Point(fire.parent.object.position.x + 100, fire.parent.object.position.y - 100), Math.PI, null, 1);
                        }
                        //rocket_ship_up.slots = [{
                        //   size: 1,
                        //    weapon: new Weapon(1000, 'Ракеты', 1500, 2, 'rocket', this.ctx, null)
                        //}];
                        rocket_ship_up.target = fire.target.object;
                        rocket_ship_up.phaseActive = function phaseActive() {
                            rocket_ship_up.route = new Route(rocket_ship_up.position);
                            rocket_ship_up.route.to = fire.target.object.position;
                        };
                        rocket_ship_up.arrive = function arrive() {
                            this.target.GetDamage(this.slots[0].weapon, fire.barrels);
                            this.life.current = 0;
                            //StarSystem.battle.removeParticipant(this.id)
                        };
                        up_r_bo = new BattleObject(rocket_ship_up, fire.parent.align, rocket_ship_up.render);
                        up_r_bo.hide = false;
                        StarSystem.battle.participants[StarSystem.battle.participants.length] = up_r_bo;
                        this.amount.current--;
                    }
                    
                    if (this.amount.current>0) {
                        var rocket_ship_down = new Ship(this.ctx, this.tile.img, new Rectangle(0, 0, null, null, 1));
                        rocket_ship_down.id = StarSystem.battle.getNextId();//-2;
                        rocket_ship_down.parentShipId = fire.parent.object.id;
                        rocket_ship_down.speed = 1500;
                        rocket_ship_down.life.current = 20;
                        if (fire.parent.object.rot == -Math.PI / 2) {
                            rocket_ship_down.battlePrepare(new Point(fire.parent.object.position.x - 100, fire.parent.object.position.y + 100), 2 * Math.PI, null, 1);
                        }
                        else {
                            rocket_ship_down.battlePrepare(new Point(fire.parent.object.position.x + 100, fire.parent.object.position.y + 100), Math.PI, null, 1);
                        }
                        //rocket_ship_up.slots = [{
                        //    size: 1,
                        //    weapon: new Weapon(1000, 'Ракеты', 1500, 2, 'rocket', this.ctx, null)
                        //}];
                        rocket_ship_down.target = fire.target.object;
                        rocket_ship_down.phaseActive = function phaseActive() {
                            rocket_ship_down.route = new Route(rocket_ship_down.position);
                            rocket_ship_down.route.to = fire.target.object.position;
                        };
                        rocket_ship_down.arrive = function arrive() {
                            this.target.GetDamage(this.slots[0].weapon, fire.barrels);
                            this.life.current = 0;
                            //StarSystem.battle.removeParticipant(this.id)
                        };
                        down_r_bo = new BattleObject(rocket_ship_down, fire.parent.align, rocket_ship_down.render);
                        down_r_bo.hide = false;
                        StarSystem.battle.participants[StarSystem.battle.participants.length] = down_r_bo;
                        this.amount.current--;
                    }
                    ret_time = -1;
                    break;
                }
                if (fire.parent.object.rot == -Math.PI / 2) {
                    this.tile.draw(new Point(fire.parent.object.position.x - curr_x, fire.parent.object.position.y - curr_y), 2*Math.PI);
                    this.tile.draw(new Point(fire.parent.object.position.x - curr_x, fire.parent.object.position.y + curr_y), 2*Math.PI);
                }
                else {
                    this.tile.draw(new Point(fire.parent.object.position.x + curr_x, fire.parent.object.position.y - curr_y), -Math.PI);
                    this.tile.draw(new Point(fire.parent.object.position.x + curr_x, fire.parent.object.position.y + curr_y), -Math.PI);
                }
                break;
            case 'pulse_beam':
                if (ret_time > this.beamLasting) {
                    ret_time = -1;
                    //fire.target.object.GetDamage(this, fire.barrels);
                    //console.log("пиу пиу ", fire.target.object.id);
                    this.amount.current--;
                    fire.target.object.GetDamage(this, fire.barrels);
                    break;
                }
				//y=kx+b[]
                var x1 = fire.target.object.position.x * (ret_time / (this.beamLasting / 3)),
                    x0 = (x1 - 30) < fire.parent.object.position.x ? fire.parent.object.position.x : x1 - 30,
                    x1_2 = 0,
                    x0_2 = 0,
                    x1_3 = 0,
                    x0_3 = 0;

                if (x1 > fire.target.object.position.x) {
                    x1 = fire.target.object.position.x;
                }

                if (ret_time > (this.beamLasting / 3)) {
                    x1_2 = fire.target.object.position.x * ((ret_time - this.beamLasting / 3) / (this.beamLasting / 3));
                    x0_2 = (x1_2 - 30) < fire.parent.object.position.x ? fire.parent.object.position.x : x1_2 - 30;
                    if (x1_2 > fire.target.object.position.x) {
                        x1_2 = fire.target.object.position.x;
                    }
                }

                if (ret_time > (this.beamLasting*2 / 3)) {
                    x1_3 = fire.target.object.position.x * ((ret_time - this.beamLasting * 2 / 3) / (this.beamLasting / 3));
                    x0_3 = (x1_3 - 30) < fire.parent.object.position.x ? fire.parent.object.position.x : x1_3 - 30;
                    if (x1_3 > fire.target.object.position.x) {
                        x1_3 = fire.target.object.position.x;
                    }
                }
                

                var y0 = tg * x0 + fire.parent.object.position.y;
                var y1 = tg * x1 + fire.parent.object.position.y;

                var y0_2 = tg * x0_2 + fire.parent.object.position.y;
                var y1_2 = tg * x1_2 + fire.parent.object.position.y;

                var y0_3 = tg * x0_3 + fire.parent.object.position.y;
                var y1_3 = tg * x1_3 + fire.parent.object.position.y;
                
                ctx.beginPath();
                if (x0 < fire.target.object.position.x) {
                    ctx.moveTo(x0, y0);
                    ctx.lineTo(x1, y1);
                }
                if (x0_2 > fire.parent.object.position.x && x0_2 < fire.target.object.position.x) {
                    ctx.moveTo(x0_2, y0_2);
                    ctx.lineTo(x1_2, y1_2);
                    console.log(ret_time, " 2");
                }
                if (x0_3 > fire.parent.object.position.x && x0_3 < fire.target.object.position.x) {
                    ctx.moveTo(x0_3, y0_3);
                    ctx.lineTo(x1_3, y1_3);
                    console.log(ret_time, " 3");
                }
                ctx.lineCap = 'round';
                

                for (var i = 5; i >= 0; i--) {
                    ctx.lineWidth = (i + 1) * 4 - 2;
                    if (i == 0)
                        ctx.strokeStyle = '#fff';
                    else {
                        ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
                    }
                    ctx.stroke();
                }
                break;
            default:
                break;
        }
        //console.log(ret_time);
        return ret_time;
    },

    reset: function () {
        this.amount.current = this.amount.stock;
    }
};