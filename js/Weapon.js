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

};

Weapon.prototype = {
    renderAction: function (full_time, time, ctx, from, to) {
        var ret_time = full_time + time;
        switch (this.type) {
            case 'beam':
                //full_time -= time;
                if (ret_time > 1000) {
                    ret_time = -1;
                    break;
                }
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.lineWidth = 10;

                // set line color
                ctx.strokeStyle = '#ff0000';
                ctx.stroke();
                break;
            default:
                break;
        }
        //console.log(ret_time);
        return ret_time;
    }
};