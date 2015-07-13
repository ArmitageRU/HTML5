"use strict";
function FAKES() {
    this.ships = this.GetFakeShips();
};

FAKES.prototype = {
    GenerateFakeWeapons: function () {
        var weapons = [];
        var w = new Weapon(200, 'Лазер', 500, 1, 'beam');
        w.id = 101;
        weapons[0] = w;
        w = new Weapon(1000, 'Ракеты', 1500, 2, 'rocket');
        w.id = 102;
        weapons[1] = w;
        w = new Weapon(500, 'Плазма', 650, 3, 'plasma');
        w.id = 103;
        weapons[2] = w;

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
    