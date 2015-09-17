"use strict";
function FAKES() {
    this.ships = this.GetFakeShips();
    this.weapons;
};

FAKES.prototype = {
    GenerateFakeWeapons: function (slots, context, rocket_image, plasma_image) {
        var weapons = [];
        var w = new Weapon(200, 'Лазер', 500, 1, 10, 'beam', context, null, 'weapon', -1);
        w.id = 101;
        weapons[0] = w;
        w = new Weapon(1000, 'Ракеты', 1500, 2, 40, 'rocket', context, rocket_image, 'weapon', 4);
        w.id = 102;
        weapons[1] = w;
        w = new Weapon(500, 'Плазма', 650, 1, 20, 'plasma', context, plasma_image, 'weapon', -1);
        w.id = 103;
        weapons[2] = w;
        w = new Weapon(400, 'Точный лазер', 10000, 1, 10, 'pulse_beam', context, null, 'auto', 4);
        w.id = 104;
        weapons[3] = w;
        w = new Weapon(400, 'Щит', 10000, 1, 10, 'shield', context, null, 'shield', 100);
        w.id = 105;
        w.class = 'shield';
        weapons[4] = w;
        this.weapons = weapons;
        slots[0].weapon = weapons[0];
        slots[1].weapon = weapons[1];
        slots[2].weapon = weapons[2];
        //slots[3].weapon = weapons[4];
        //slots[4].weapon = weapons[3];
        //return weapons;
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
    },

    GetWeaponById: function(id) {
        var return_weapon = null;
        for (var i = 0, max = this.weapons.length; i < max; i += 1) {
            if (this.weapons[i].id == id) {
                return_weapon = this.weapons[i];
                break;
            }
        }
        return return_weapon;
    }
};
    