"use strict";
function Weapon(energy, title, cost, size, type, context, image) {
    if (!(this instanceof Weapon)) {
        return new Weapon();
    }
    this.ctx = context;
    this.tile = new Tile(this.ctx, image, null, null, 49, 19, 1);
    this.energy = energy;
    this.title = title;
    this.primeCost = cost;//себестоимость, возможно не понадобится
    this.size = size;//размер слота
    this.id;
    this.type = type;

    this.beamLasting = 700;
    this.plasmaLasting = 1000;
    this.rocketLasting = 700;
};

Weapon.prototype = {
    renderAction: function (full_time, time, ctx, from, target) {
        var ret_time = full_time + time,
            thickness = ~~(ret_time / (this.beamLasting / 10));
            //target = from.target;
        switch (this.type) {
            case 'beam':
                //full_time -= time;
                if (ret_time > this.beamLasting) {
                    ret_time = -1;
                    target.GetDamage(this);
                    break;
                }
                ctx.beginPath();
                ctx.moveTo(from.position.x, from.position.y);
                ctx.lineTo(target.position.x, target.position.y);
                ctx.lineWidth = thickness;//10;
                // set line color
                ctx.strokeStyle = '#ff0000';
                ctx.stroke();
                break;
            case 'plasma':
                if (ret_time > this.plasmaLasting) {
                    ret_time = -1;
                    target.GetDamage(this);
                    break;
                }
                var curr_x = (target.position.x - from.position.x) * ret_time / this.plasmaLasting;
                ctx.beginPath();
                ctx.arc(from.position.x + curr_x, from.position.y, 30, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#ff3333';
                ctx.fill();
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#ff3333';
                ctx.stroke();
                break;
            case 'rocket':
                var curr_x = (/*from.position.x +*/ 100) * ret_time / this.rocketLasting,
                    curr_y = (/*from.position.y -*/ 100) * ret_time / this.rocketLasting;
                if (ret_time > this.rocketLasting) {
                    var rocket_ship_up = new Ship(this.ctx, this.tile.img, new Rectangle(0, 0, null, null, 1));
                    rocket_ship_up.id = -1
                    rocket_ship_up.parentShipId = from.id;
                    rocket_ship_up.speed = 1500;
                    rocket_ship_up.battlePrepare(new Point(from.position.x + 100, from.position.y - 100), Math.PI, null, 1);
                    rocket_ship_up.weapons[rocket_ship_up.weapons.length] = new Weapon(1000, 'Ракеты', 1500, 2, 'rocket', this.ctx, null);
                    rocket_ship_up.target = target;
                    rocket_ship_up.phaseActive = function phaseActive() {
                        rocket_ship_up.route = new Route(rocket_ship_up.position);
                        rocket_ship_up.route.to = target.position;
                    };
                    rocket_ship_up.arrive = function arrive() {
                        this.target.GetDamage(this.weapons[0]);
                        StarSystem.battle.removeParticipant(this.id)
                    };

                    StarSystem.battle.participants[StarSystem.battle.participants.length] = new BattleObject(rocket_ship_up, /*target,*/ rocket_ship_up.render);
                    var rocket_ship_down = new Ship(this.ctx, this.tile.img, new Rectangle(0, 0, null, null, 1));
                    rocket_ship_down.id = -2
                    rocket_ship_down.parentShipId = from.id;
                    rocket_ship_down.speed = 1500;
                    rocket_ship_down.battlePrepare(new Point(from.position.x + 100, from.position.y + 100), Math.PI, null, 1);
                    rocket_ship_down.weapons[rocket_ship_up.weapons.length] = new Weapon(1000, 'Ракеты', 1500, 2, 'rocket', this.ctx, null);
                    rocket_ship_down.target = target;
                    rocket_ship_down.phaseActive = function phaseActive() {
                        rocket_ship_down.route = new Route(rocket_ship_down.position);
                        rocket_ship_down.route.to = target.position;
                    };
                    rocket_ship_down.arrive = function arrive() {
                        this.target.GetDamage(this.weapons[0]);
                        StarSystem.battle.removeParticipant(this.id)
                    };
                    StarSystem.battle.participants[StarSystem.battle.participants.length] = new BattleObject(rocket_ship_down, /*target,*/ rocket_ship_down.render);
                    ret_time = -1;
                    break;
                }
                this.tile.draw(new Point(from.position.x + curr_x, from.position.y - curr_y), -Math.PI);
                this.tile.draw(new Point(from.position.x + curr_x, from.position.y + curr_y), -Math.PI);
                break;
            default:
                break;
        }
        //console.log(ret_time);
        return ret_time;
    }
};