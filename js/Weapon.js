"use strict";
function Weapon(energy, title, cost, size, type, context, image) {
    if (!(this instanceof Weapon)) {
        return new Weapon();
    }
    this.ctx = context;
    this.tile = new Tile(this.ctx, image, null, null, null, null, 1);

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
        switch (this.type) {
            case 'beam':
                //full_time -= time;
                if (ret_time > this.beamLasting) {
                    ret_time = -1;
                    break;
                }
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(target.position.x, target.position.y);
                ctx.lineWidth = thickness;//10;
                // set line color
                ctx.strokeStyle = '#ff0000';
                ctx.stroke();
                break;
            case 'plasma':
                if (ret_time > this.plasmaLasting) {
                    ret_time = -1;
                    break;
                }
                var curr_x = (target.position.x - from.x) * ret_time / this.plasmaLasting;
                ctx.beginPath();
                ctx.arc(from.x + curr_x, from.y, 30, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#ff3333';
                ctx.fill();
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#ff3333';
                ctx.stroke();
                break;
            case 'rocket':
                var curr_x = (from.x + 50) * ret_time / this.rocketLasting,
                    curr_y = (from.y + 50) * ret_time / this.rocketLasting;
                if (ret_time > this.rocketLasting) {
                    var rocket_ship = new Ship(this.ctx, this.tile.img, new Rectangle(0, 0, null, null, 1));
                    rocket_ship.id = 0;
                    rocket_ship.subShip = 1;
                    rocket_ship.rot = Math.PI;
                    StarSystem.battle.participants[StarSystem.battle.participants.length] = new BattleObject(rocket_ship, target, rocket_ship.renderBattleMode);
                    ret_time = -1;
                    break;
                }
                this.tile.draw(new Point(from.x + curr_x, from.y - curr_y), -Math.PI);
                break;
            default:
                break;
        }
        //console.log(ret_time);
        return ret_time;
    }
};