"use strict";
function Damage() {
    if (!(this instanceof Damage)) {
        return new Damage();
    }
};

Damage.prototype = {
    GetDamage: function (ship, weapon, barrels) {
        var return_struct = {
            hint: 'normal',
            damage: 0
        },
            damage = 0;
        switch (weapon.type) {
            case 'beam':
                var roll1 = this.RollDice(2, 8) - 3,
                    roll2 = this.RollDice(2, 8) - 3,
                    lazer_dmg = 150;
                if (barrels > 1) {
                    lazer_dmg += (barrels - 1) * lazer_dmg * 0.5;
                }

                damage = Math.min(roll1, roll2);
                if (damage < 0) {
                    return_struct.hint = 'guard';
                    damage = 0;
                }
                else if (damage == 0) {
                    return_struct.hint = 'miss';
                }

                if (Math.round(getRandomArbitrary(0, 100)) < 5*(barrels-1)) {
                    return_struct.hint = 'crit';
                    damage += this.RollDice(1, 8) + 10;
                }
                damage = damage * lazer_dmg * 0.1;
                break;
            case 'rocket':
                damage = 0;
                break;
            case 'plasma':
                var roll1 = this.RollDice(3, 8) + 0,
                    roll2 = this.RollDice(3, 8) - 6,
                    plasma_dmg = 250;
                if (barrels > 1) {
                    plasma_dmg += (barrels - 1) * plasma_dmg * 0.5;
                }

                damage = Math.min(roll1, roll2);
                if (damage < 0) {
                    return_struct.hint = 'guard';
                    damage = 0;
                }
                else if (damage == 0) {
                    return_struct.hint = 'miss';
                }

                if (Math.round(getRandomArbitrary(0, 100)) < 10 * (barrels)) {
                    return_struct.hint = 'crit';
                    damage += this.RollDice(7, 4) + 10;
                }
                damage = damage * plasma_dmg * 0.1;
                break;
            case 'pulse_beam':
                damage = 0;
                break;
            default:
                break;
        }
        return_struct.damage = damage;
        return return_struct;
    },

    RollDice: function (N, S) {
        var die_sum = 0;
        
        for (var i = 0; i < N; i++) {
            die_sum += Math.round(getRandomArbitrary(0, S + 1));
        }
        return die_sum;
    }

};