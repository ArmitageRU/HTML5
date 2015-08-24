"use strict";
function FAKES() {
    this.ships = this.GetFakeShips();
    this.weapons;
};

FAKES.prototype = {
    GenerateFakeWeapons: function (context, rocket_image) {
        var weapons = [];
        var w = new Weapon(200, 'Лазер', 500, 1, 10, 'beam', context, null);
        w.id = 101;
        weapons[0] = w;
        w = new Weapon(1000, 'Ракеты', 1500, 2, 40, 'rocket', context, rocket_image);
        w.id = 102;
        weapons[1] = w;
        w = new Weapon(500, 'Плазма', 650, 1, 20, 'plasma', context, null);
        w.id = 103;
        weapons[2] = w;
        this.weapons = weapons;
        return weapons;
    },

    GetFakeShips: function () {
        var ships = [];

        var tmp_s_obj = {
            x: 64,
            y: 72,
            width: 128,
            height: 99
        }
        ships.push(tmp_s_obj);
        tmp_s_obj = {
            x: 64,
            y: 320,
            width: 128,
            height: 131
        }
        ships.push(tmp_s_obj);
        tmp_s_obj = {
            x: 32,
            y: 568,
            width: 192,
            height: 131
        }
        ships.push(tmp_s_obj);
        tmp_s_obj = {
            x: 28,
            y: 804,
            width: 199,
            height: 163
        }
        ships.push(tmp_s_obj);
        tmp_s_obj = {
            x: 32,
            y: 1052,
            width: 192,
            height: 168
        }
        ships.push(tmp_s_obj);
        tmp_s_obj = {
            x: 80,
            y: 1332,
            width: 95,
            height: 135
        }
        ships.push(tmp_s_obj);
        tmp_s_obj = {
            x: 80,
            y: 1580,
            width: 95,
            height: 135
        }
        ships.push(tmp_s_obj);
        tmp_s_obj = {
            x: 32,
            y: 1864,
            width: 191,
            height: 127
        }
        ships.push(tmp_s_obj);
        tmp_s_obj = {
            x: 28,
            y: 2108,
            width: 199,
            height: 135
        }
        ships.push(tmp_s_obj);
        tmp_s_obj = {
            x: 80,
            y: 2388,
            width: 95,
            height: 83
        }
        ships.push(tmp_s_obj);
        tmp_s_obj = {
            x: 28,
            y: 2596,
            width: 199,
            height: 263
        }
        ships.push(tmp_s_obj);
        tmp_s_obj = {
            x: 28,
            y: 2980,
            width: 199,
            height: 255
        }
        ships.push(tmp_s_obj);

        return ships;
    }
};
    