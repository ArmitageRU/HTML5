"use strict";
function Weapon(energy, title, cost, size, type) {
    if (!(this instanceof Weapon)) {
        return new Weapon();
    }

    this.energy = energy;
    this.title = title;
    this.primeCost = cost;//себестоимость, возможно не понадобится
    this.size = size;//размер слота
    this.id;
    this.type = type;

    this.beamLasting = 700;
    this.plasmaLasting = 1000;
};

Weapon.prototype = {
    renderAction: function (full_time, time, ctx, from, to) {
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
                ctx.lineTo(to.x, to.y);
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
                var curr_x = (to.x - from.x) * ret_time / this.plasmaLasting;
                ctx.beginPath();
                ctx.arc(from.x + curr_x, from.y, 30, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#ff3333';
                ctx.fill();
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#ff3333';
                ctx.stroke();
                break;
            default:
                break;
        }
        //console.log(ret_time);
        return ret_time;
    }
};